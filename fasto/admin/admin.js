// Fasto news admin. Edits fasto/news/news.json and its photos in the liberland/site
// repository through the GitHub API and publishes everything as one commit to master.
// The GitHub Pages workflow then regenerates the pages with fasto/build.py.
(function () {
  'use strict';

  var REPO = 'liberland/site', BRANCH = 'master', ROOT = 'fasto/';
  var NEWS_PATH = ROOT + 'news/news.json';
  var API = 'https://api.github.com';
  var MAX_SIDE = 1600, JPEG_QUALITY = 0.82;
  var TOKEN_KEY = 'fasto-admin-token';

  var $ = function (id) { return document.getElementById(id); };
  var state = {
    token: '', news: { items: [] }, newsSha: null,
    original: new Set(),      // image paths that exist in the repository
    pending: {},              // src -> base64 JPEG waiting to be uploaded
    previews: {},             // src -> data URL for new photos
    categories: {}, editing: null, draft: null, dirty: false
  };

  // ---------- helpers ----------
  function status(msg, kind) { var s = $('status'); s.className = 'status ' + (kind || ''); s.innerHTML = msg; }
  function esc(s) { return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); }
  function today() { var d = new Date(); return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0'); }
  function slug(s) {
    return (s || '').normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase()
      .replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '').slice(0, 48) || 'novinka';
  }
  function rand() { return Math.random().toString(36).slice(2, 7); }
  function b64ToUtf8(b64) { var bin = atob(b64.replace(/\s/g, '')); var bytes = new Uint8Array(bin.length); for (var i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i); return new TextDecoder().decode(bytes); }
  function imgUrl(src) { return state.previews[src] || ('../' + src); }
  function setDirty(v) { state.dirty = v; $('savebar').hidden = !v; }
  function allSrcs() { var s = new Set(); state.news.items.forEach(function (it) { (it.images || []).forEach(function (im) { s.add(im.src); }); }); return s; }

  async function gh(method, path, body) {
    var res = await fetch(API + path, {
      method: method,
      headers: { Authorization: 'Bearer ' + state.token, Accept: 'application/vnd.github+json', 'X-GitHub-Api-Version': '2022-11-28' },
      body: body ? JSON.stringify(body) : undefined
    });
    if (!res.ok) {
      var detail = ''; try { detail = (await res.json()).message || ''; } catch (e) { /* no body */ }
      var err = new Error(res.status + (detail ? ' – ' + detail : '')); err.status = res.status; throw err;
    }
    return res.status === 204 ? null : res.json();
  }

  // ---------- login & loading ----------
  async function login(token) {
    state.token = token;
    status('Přihlašuji…');
    try {
      var user = await gh('GET', '/user');
      try { localStorage.setItem(TOKEN_KEY, token); } catch (e) { /* storage unavailable */ }
      $('who').innerHTML = 'Přihlášeno jako <b>' + esc(user.login) + '</b>. Změny se uloží do <code>' + REPO + '</code> a web se aktualizuje asi do dvou minut.';
      $('token').value = ''; $('token').placeholder = 'token uložen v tomto prohlížeči';
      $('token').required = false; $('logout').hidden = false;
      document.body.classList.add('logged');
      await loadNews();
      status('');
    } catch (e) {
      status('Přihlášení se nepovedlo (' + esc(e.message) + '). Zkontrolujte token.', 'err');
      state.token = '';
    }
  }

  async function loadNews() {
    var file = await gh('GET', '/repos/' + REPO + '/contents/' + NEWS_PATH + '?ref=' + BRANCH);
    state.news = JSON.parse(b64ToUtf8(file.content));
    state.news.items = state.news.items || [];
    state.newsSha = file.sha;
    state.original = allSrcs();
    state.pending = {}; state.previews = {};
    setDirty(false);
    $('list-panel').hidden = false;
    renderList();
  }

  // ---------- list ----------
  function renderList() {
    var items = state.news.items.slice().sort(function (a, b) { return (b.date || '').localeCompare(a.date || ''); });
    var ul = $('items');
    if (!items.length) { ul.innerHTML = '<li class="empty">Zatím žádné novinky. Sekce se na webu skryje, dokud nějakou nepřidáte.</li>'; return; }
    ul.innerHTML = items.map(function (it) {
      var im = (it.images || [])[0];
      var cat = state.categories[it.category];
      return '<li data-id="' + esc(it.id) + '">' +
        (im ? '<img src="' + esc(imgUrl(im.src)) + '" alt="">' : '<span class="noimg"></span>') +
        '<div><b>' + esc(it.title && it.title.cs) + '</b><span class="meta">' + esc(it.date) + ' · ' + esc(cat ? cat.cs : it.category) +
        (it.location ? ' · ' + esc(it.location) : '') + ' · ' + (it.images || []).length + ' fotek</span></div>' +
        '<div class="acts"><button class="btn btn--ghost btn--sm" data-act="edit">Upravit</button>' +
        '<button class="btn btn--ghost btn--sm" data-act="delete">Smazat</button></div></li>';
    }).join('');
  }

  $('items').addEventListener('click', function (e) {
    var b = e.target.closest('button[data-act]'); if (!b) return;
    var id = b.closest('li').getAttribute('data-id');
    var idx = state.news.items.findIndex(function (it) { return it.id === id; });
    if (idx < 0) return;
    if (b.getAttribute('data-act') === 'edit') openEditor(state.news.items[idx]);
    else if (confirm('Opravdu smazat novinku „' + state.news.items[idx].title.cs + '“? Smaže se až po kliknutí na Uložit a zveřejnit.')) {
      state.news.items.splice(idx, 1); setDirty(true); renderList();
    }
  });

  // ---------- editor ----------
  function openEditor(item) {
    state.editing = item ? item.id : null;
    state.draft = JSON.parse(JSON.stringify(item || {
      id: null, date: today(), category: 'obecne', location: '',
      title: { cs: '', en: '', hr: '' }, text: { cs: '', en: '', hr: '' }, images: []
    }));
    var d = state.draft;
    $('editor-title').textContent = item ? 'Upravit novinku' : 'Nová novinka';
    $('f-date').value = d.date; $('f-category').value = d.category; $('f-location').value = d.location || '';
    ['cs', 'en', 'hr'].forEach(function (l) {
      $('f-title-' + l).value = (d.title && d.title[l]) || '';
      $('f-text-' + l).value = (d.text && d.text[l]) || '';
    });
    renderShots();
    $('editor').hidden = false; $('list-panel').hidden = true;
    $('editor').scrollIntoView({ behavior: 'smooth', block: 'start' });
    $('f-title-cs').focus({ preventScroll: true });
  }

  function closeEditor() { $('editor').hidden = true; $('list-panel').hidden = false; state.draft = null; state.editing = null; }

  function renderShots() {
    var imgs = state.draft.images;
    $('shots').innerHTML = imgs.map(function (im, i) {
      return '<div class="shot">' + (state.pending[im.src] ? '<span class="new">nová</span>' : '') +
        '<img src="' + esc(imgUrl(im.src)) + '" alt="Fotka ' + (i + 1) + '">' +
        '<div class="tools"><button type="button" data-i="' + i + '" data-m="-1" aria-label="Posunout doleva"' + (i === 0 ? ' disabled' : '') + '>←</button>' +
        '<button type="button" data-i="' + i + '" data-m="x" aria-label="Odebrat fotku">×</button>' +
        '<button type="button" data-i="' + i + '" data-m="1" aria-label="Posunout doprava"' + (i === imgs.length - 1 ? ' disabled' : '') + '>→</button></div></div>';
    }).join('');
  }

  $('shots').addEventListener('click', function (e) {
    var b = e.target.closest('button[data-m]'); if (!b) return;
    var i = +b.getAttribute('data-i'), m = b.getAttribute('data-m'), imgs = state.draft.images;
    if (m === 'x') imgs.splice(i, 1);
    else { var j = i + +m; var t = imgs[i]; imgs[i] = imgs[j]; imgs[j] = t; }
    renderShots();
  });

  function resize(file) {
    return new Promise(function (resolve, reject) {
      var url = URL.createObjectURL(file), img = new Image();
      img.onload = function () {
        var k = Math.min(1, MAX_SIDE / Math.max(img.naturalWidth, img.naturalHeight));
        var w = Math.round(img.naturalWidth * k), h = Math.round(img.naturalHeight * k);
        var c = document.createElement('canvas'); c.width = w; c.height = h;
        var ctx = c.getContext('2d'); ctx.fillStyle = '#fff'; ctx.fillRect(0, 0, w, h); ctx.drawImage(img, 0, 0, w, h);
        URL.revokeObjectURL(url);
        var dataUrl = c.toDataURL('image/jpeg', JPEG_QUALITY);
        resolve({ dataUrl: dataUrl, b64: dataUrl.split(',')[1], w: w, h: h });
      };
      img.onerror = function () { URL.revokeObjectURL(url); reject(new Error('Soubor ' + file.name + ' se nepodařilo načíst jako obrázek.')); };
      img.src = url;
    });
  }

  $('f-files').addEventListener('change', async function () {
    var files = Array.prototype.slice.call(this.files); this.value = '';
    status('Zpracovávám ' + files.length + ' fotek…');
    for (var f of files) {
      try {
        var r = await resize(f);
        var src = 'news/img/' + today().replace(/-/g, '') + '-' + rand() + '.jpg';
        state.pending[src] = r.b64; state.previews[src] = r.dataUrl;
        state.draft.images.push({ src: src, w: r.w, h: r.h });
        renderShots();
      } catch (e) { status(esc(e.message), 'err'); return; }
    }
    status('');
  });

  $('cancel').addEventListener('click', closeEditor);

  $('item-form').addEventListener('submit', function (e) {
    e.preventDefault();
    var d = state.draft;
    d.date = $('f-date').value; d.category = $('f-category').value; d.location = $('f-location').value.trim();
    ['cs', 'en', 'hr'].forEach(function (l) { d.title[l] = $('f-title-' + l).value.trim(); d.text[l] = $('f-text-' + l).value.trim(); });
    if (!d.title.cs) { status('Vyplňte nadpis v češtině.', 'err'); $('f-title-cs').focus(); return; }
    if (state.editing) {
      var idx = state.news.items.findIndex(function (it) { return it.id === state.editing; });
      state.news.items[idx] = d;
    } else {
      var base = d.date + '-' + slug(d.title.cs), id = base, n = 2;
      while (state.news.items.some(function (it) { return it.id === id; })) id = base + '-' + n++;
      d.id = id; state.news.items.push(d);
    }
    setDirty(true); closeEditor(); renderList();
    status('Novinka je připravená. Na web se dostane po kliknutí na Uložit a zveřejnit.');
  });

  // ---------- publish: one commit with photos and news.json ----------
  async function publish() {
    var btn = $('publish'); btn.disabled = true;
    try {
      status('Ukládám…');
      var current = await gh('GET', '/repos/' + REPO + '/contents/' + NEWS_PATH + '?ref=' + BRANCH);
      if (current.sha !== state.newsSha) {
        status('Novinky mezitím upravil někdo jiný. Načtěte stránku znovu a změny zopakujte.', 'err');
        return;
      }
      var ref = await gh('GET', '/repos/' + REPO + '/git/ref/heads/' + BRANCH);
      var parent = await gh('GET', '/repos/' + REPO + '/git/commits/' + ref.object.sha);
      var used = allSrcs(), tree = [];

      var uploads = Object.keys(state.pending).filter(function (src) { return used.has(src); });
      for (var i = 0; i < uploads.length; i++) {
        status('Nahrávám fotky ' + (i + 1) + ' / ' + uploads.length + '…');
        var blob = await gh('POST', '/repos/' + REPO + '/git/blobs', { content: state.pending[uploads[i]], encoding: 'base64' });
        tree.push({ path: ROOT + uploads[i], mode: '100644', type: 'blob', sha: blob.sha });
      }
      state.original.forEach(function (src) {
        if (!used.has(src) && src.indexOf('news/') === 0) tree.push({ path: ROOT + src, mode: '100644', type: 'blob', sha: null });
      });
      state.news.items.sort(function (a, b) { return (b.date || '').localeCompare(a.date || ''); });
      var json = JSON.stringify(state.news, null, 1) + '\n';
      var jsonBlob = await gh('POST', '/repos/' + REPO + '/git/blobs', { content: json, encoding: 'utf-8' });
      tree.push({ path: NEWS_PATH, mode: '100644', type: 'blob', sha: jsonBlob.sha });

      status('Vytvářím commit…');
      var newTree = await gh('POST', '/repos/' + REPO + '/git/trees', { base_tree: parent.tree.sha, tree: tree });
      var titles = state.news.items.slice(0, 3).map(function (it) { return it.title.cs; }).join(', ');
      var commit = await gh('POST', '/repos/' + REPO + '/git/commits', {
        message: 'Fasto: novinky upravené v administraci\n\n' + titles, tree: newTree.sha, parents: [ref.object.sha]
      });
      await gh('PATCH', '/repos/' + REPO + '/git/refs/heads/' + BRANCH, { sha: commit.sha });

      state.newsSha = jsonBlob.sha; state.original = used; state.pending = {};
      setDirty(false); renderList();
      status('Uloženo. Web se aktualizuje asi do dvou minut: <a href="../#novinky" target="_blank" rel="noopener">zobrazit novinky</a> · <a href="https://github.com/' + REPO + '/actions" target="_blank" rel="noopener">průběh nasazení</a>.', 'ok');
    } catch (e) {
      var hint = e.status === 403 || e.status === 404 ? ' Token nemá právo zápisu do repozitáře, nebo je větev chráněná.' : '';
      status('Uložení se nepovedlo (' + esc(e.message) + ').' + hint + ' Změny zůstávají na této stránce, můžete to zkusit znovu.', 'err');
    } finally { btn.disabled = false; }
  }
  $('publish').addEventListener('click', publish);

  // ---------- start ----------
  $('token-form').addEventListener('submit', function (e) { e.preventDefault(); var t = $('token').value.trim(); if (t) login(t); });
  $('logout').addEventListener('click', function () { try { localStorage.removeItem(TOKEN_KEY); } catch (e) { /* ignore */ } location.reload(); });
  $('add').addEventListener('click', function () { openEditor(null); });
  addEventListener('beforeunload', function (e) { if (state.dirty) { e.preventDefault(); e.returnValue = ''; } });

  fetch('../news/categories.json').then(function (r) { return r.json(); }).then(function (cats) {
    state.categories = cats;
    $('f-category').innerHTML = Object.keys(cats).map(function (k) { return '<option value="' + k + '">' + esc(cats[k].cs) + '</option>'; }).join('');
    var saved = null; try { saved = localStorage.getItem(TOKEN_KEY); } catch (e) { /* ignore */ }
    if (saved) login(saved);
  });
})();

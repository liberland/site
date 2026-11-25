/*
 * LiberCom page behaviour. Reads window.LIBERCOM_CONFIG (config.js) and:
 *   1. fills every [data-bind] with a config value and every [data-href] with a link,
 *   2. turns the citizen 1 GB buttons on only when a verified https URL is configured,
 *   3. copies the Global Plus code,
 *   4. loads Atli's widget script exactly once, and shows a fallback if it never answers.
 * No framework, no build step, ES5 so it parses everywhere.
 */
(function () {
  'use strict';

  var config = window.LIBERCOM_CONFIG;
  if (!config) return; // config.js missing: the static fallbacks in index.html stay as they are.

  function get(path) {
    var parts = path.split('.');
    var value = config;
    for (var i = 0; i < parts.length; i++) {
      if (value == null) return undefined;
      value = value[parts[i]];
    }
    return value;
  }

  function each(selector, fn) {
    var list = document.querySelectorAll(selector);
    for (var i = 0; i < list.length; i++) fn(list[i]);
  }

  /** Only absolute https URLs count as configured. Anything else is treated as missing. */
  function httpsUrl(value) {
    if (typeof value !== 'string' || !/^https:\/\/[^\s/]+\.[^\s/]+/i.test(value.trim())) return null;
    try {
      return new URL(value.trim()).href;
    } catch (e) {
      return null;
    }
  }

  function withParam(url, name, value) {
    if (!url || !value) return url;
    var hashAt = url.indexOf('#');
    var hash = hashAt === -1 ? '' : url.slice(hashAt);
    var base = hashAt === -1 ? url : url.slice(0, hashAt);
    return base + (base.indexOf('?') === -1 ? '?' : '&') +
      encodeURIComponent(name) + '=' + encodeURIComponent(value) + hash;
  }

  var gp = config.globalPlus || {};
  var widget = config.widget || {};
  var brand = config.brand || {};

  /* ---- 1. Links and text ------------------------------------------------ */

  var links = {
    // Global Plus: Atli's product page with the Liberland code as ?referral=…
    globalPlus: withParam(httpsUrl(gp.productUrl), gp.referralParam || 'referral', gp.code),
    // Widget fallback: Atli's home page with the widget's own referral code.
    widgetFallback: withParam(httpsUrl(brand.partnerUrl) || 'https://heyatli.com/', 'referral', widget.referral),
    'brand.partnerUrl': httpsUrl(brand.partnerUrl),
    'brand.liberlandUrl': httpsUrl(brand.liberlandUrl),
    'brand.partnerTermsUrl': httpsUrl(brand.partnerTermsUrl),
    'brand.partnerPrivacyUrl': httpsUrl(brand.partnerPrivacyUrl)
  };

  each('[data-href]', function (el) {
    var href = links[el.getAttribute('data-href')];
    if (href) el.setAttribute('href', href);
  });

  each('[data-bind]', function (el) {
    var value = get(el.getAttribute('data-bind'));
    if (value !== undefined && value !== null && value !== '') el.textContent = String(value);
  });

  each('[data-year]', function (el) {
    el.textContent = String(new Date().getFullYear());
  });

  var canonical = httpsUrl(config.site && config.site.canonicalUrl);
  if (canonical && !document.querySelector('link[rel="canonical"]')) {
    var link = document.createElement('link');
    link.rel = 'canonical';
    link.href = canonical;
    document.head.appendChild(link);
  }

  /* ---- 2. Citizen 1 GB: live only with a verified link -------------------- */

  var citizen = config.citizenData || {};
  var redemptionUrl = citizen.status === 'available' ? httpsUrl(citizen.redemptionUrl) : null;
  var citizenLive = !!redemptionUrl;

  var card = document.querySelector('[data-citizen-card]');
  if (card) card.setAttribute('data-state', citizenLive ? 'available' : 'coming-soon');

  each('[data-citizen-cta]', function (el) {
    var isHero = el.getAttribute('data-variant') === 'hero';
    if (citizenLive) {
      el.setAttribute('href', redemptionUrl);
      el.setAttribute('target', '_blank');
      el.setAttribute('rel', 'noopener');
      el.removeAttribute('hidden');
    } else if (isHero) {
      // Points at the card, which explains that activation details will follow.
      el.setAttribute('href', '#citizen-benefit');
      el.removeAttribute('target');
    } else {
      el.removeAttribute('href');
      el.setAttribute('hidden', '');
    }
  });
  each('[data-citizen-soon]', function (el) {
    if (citizenLive && el.parentNode) el.parentNode.removeChild(el);
  });
  each('[data-citizen-soon-panel]', function (el) { el.hidden = citizenLive; });
  each('[data-citizen-available-note]', function (el) { el.hidden = !citizenLive; });

  /* ---- 3. Copy the discount code ---------------------------------------- */

  var copyButton = document.querySelector('[data-copy-code]');
  var copyLabel = document.querySelector('[data-copy-label]');
  var copyStatus = document.querySelector('[data-copy-status]');
  var copyTimer;

  function copied(ok) {
    if (copyLabel) copyLabel.textContent = ok ? 'Copied' : 'Copy failed';
    if (copyStatus) copyStatus.textContent = ok ? 'Code ' + gp.code + ' copied to the clipboard.' : 'Could not copy. The code is ' + gp.code + '.';
    if (copyButton) copyButton.classList.toggle('is-done', ok);
    clearTimeout(copyTimer);
    copyTimer = setTimeout(function () {
      if (copyLabel) copyLabel.textContent = 'Copy code';
      if (copyButton) copyButton.classList.remove('is-done');
    }, 2200);
  }

  function legacyCopy(text) {
    var area = document.createElement('textarea');
    area.value = text;
    area.setAttribute('readonly', '');
    area.style.position = 'fixed';
    area.style.opacity = '0';
    document.body.appendChild(area);
    area.select();
    var ok = false;
    try { ok = document.execCommand('copy'); } catch (e) { ok = false; }
    document.body.removeChild(area);
    return ok;
  }

  if (copyButton && gp.code) {
    copyButton.addEventListener('click', function () {
      if (navigator.clipboard && window.isSecureContext) {
        navigator.clipboard.writeText(gp.code).then(function () { copied(true); }, function () { copied(legacyCopy(gp.code)); });
      } else {
        copied(legacyCopy(gp.code));
      }
    });
  } else if (copyButton) {
    copyButton.hidden = true;
  }

  /* ---- 4. Atli widget ---------------------------------------------------- */

  var frame = document.querySelector('[data-widget-frame]');
  var fallback = document.querySelector('[data-widget-fallback]');
  var status = document.querySelector('[data-widget-status]');
  var scriptUrl = httpsUrl(widget.scriptUrl);

  function setWidgetState(state) {
    if (!frame || frame.getAttribute('data-state') === 'ready') return;
    frame.setAttribute('data-state', state);
    if (fallback) fallback.hidden = state !== 'failed';
    if (status) {
      status.textContent = state === 'ready' ? 'eSIM plans loaded.' :
        state === 'failed' ? 'The plan finder could not be loaded. A link to Atli’s website is available instead.' : status.textContent;
    }
  }

  function mountWidget() {
    if (!frame) return;
    if (!scriptUrl) { setWidgetState('failed'); return; }

    var widgetOrigin = new URL(scriptUrl).origin;
    // The frame posts 'atli:resize' once it has rendered: that is our "it works" signal.
    window.addEventListener('message', function (event) {
      if (event.origin !== widgetOrigin) return;
      var data = event.data;
      if (data && typeof data === 'object' && data.type === 'atli:resize') {
        setWidgetState('ready');
        if (fallback) fallback.hidden = true;
      }
    });

    // Load once, even if this file were somehow included twice.
    if (window.HeyAtli || document.querySelector('script[data-atli-widget]')) return;

    var script = document.createElement('script');
    script.src = scriptUrl;
    script.async = true;
    script.setAttribute('data-atli-widget', '');
    script.setAttribute('data-target', '#atli-esim-widget');
    script.setAttribute('data-title', 'Atli eSIM plans by destination');
    if (widget.theme) script.setAttribute('data-theme', widget.theme);
    if (widget.themePriority) script.setAttribute('data-theme-priority', widget.themePriority);
    if (widget.referral) script.setAttribute('data-referral', widget.referral);
    var cssUrl = httpsUrl(widget.cssUrl);
    if (cssUrl) script.setAttribute('data-css', cssUrl);
    script.onerror = function () { setWidgetState('failed'); };
    document.body.appendChild(script);

    // The iframe is lazy, so only start the clock once the section is on screen.
    var wait = Number(widget.fallbackAfterMs) || 15000;
    function startClock() {
      setTimeout(function () {
        if (frame.getAttribute('data-state') !== 'ready') setWidgetState('failed');
      }, wait);
    }
    if ('IntersectionObserver' in window) {
      var seen = new IntersectionObserver(function (entries) {
        for (var i = 0; i < entries.length; i++) {
          if (entries[i].isIntersecting) { seen.disconnect(); startClock(); return; }
        }
      }, { rootMargin: '200px 0px' });
      seen.observe(frame);
    } else {
      startClock();
    }
  }

  mountWidget();

  /* ---- Header shadow once the page scrolls ------------------------------- */

  var header = document.querySelector('[data-header]');
  if (header) {
    var onScroll = function () { header.classList.toggle('is-scrolled', window.scrollY > 8); };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }
})();

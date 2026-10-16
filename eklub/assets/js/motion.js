/* eKLUB — motion: scroll reveals, counters, scroll-spy navigation.
   Does nothing when the visitor asks for reduced motion. */
(function () {
  var header = document.querySelector('[data-ek-header]');

  // Scroll-spy: the tomato underline in the nav follows the section you're reading.
  var links = Array.prototype.slice.call(document.querySelectorAll('.ek-nav a[href^="#"]'));
  var targets = links.map(function (a) { return document.querySelector(a.getAttribute('href')); });
  function spy() {
    var line = window.innerHeight * 0.35, current = 0; // before the first section, Kurzy stays marked as in the design
    targets.forEach(function (t, i) { if (t && t.getBoundingClientRect().top <= line) current = i; });
    links.forEach(function (a, i) { if (i === current) a.setAttribute('aria-current', 'location'); else a.removeAttribute('aria-current'); });
    if (header) header.classList.toggle('is-scrolled', window.scrollY > 8);
  }
  window.addEventListener('scroll', spy, { passive: true });
  spy();

  var root = document.documentElement;
  if (!root.classList.contains('ek-motion')) return; // switched on in <head> unless reduced motion is requested
  window.EklubMotion = true;
  root.classList.add('ek-motion-init'); // apply the hidden start state without animating into it

  function mark(selector, kind) {
    document.querySelectorAll(selector).forEach(function (el) {
      if (el.hasAttribute('data-reveal')) return;
      var key = el.parentNode;
      key.__ekCount = (key.__ekCount || 0) + 1;
      el.setAttribute('data-reveal', kind || '');
      el.style.setProperty('--i', Math.min(key.__ekCount - 1, 7));
    });
  }
  mark('.w-hero__copy > *');
  mark('.w-hero__art .ek-ill', 'pop');
  mark('.w-hero__art .ek-sticker', 'pop');
  document.querySelector('.w-hero__art .ek-sticker') && document.querySelector('.w-hero__art .ek-sticker').style.setProperty('--i', 8);
  mark('.w-stats .ek-stat');
  mark('.ek-head > *');
  mark('.w-cards > *', 'pop');
  mark('.w-split > div:first-child > *');
  mark('.w-courses > *', 'pop');
  mark('.ek-dialogue > *', 'bubble');
  mark('.ek-reasons li', 'left');
  mark('.w-biz > div:first-child > *');
  mark('.ek-clients span', 'pop');
  mark('.w-duo > *', 'pop');
  mark('.w-contact > div:first-child > *');
  mark('.w-info > *', 'left');
  mark('.w-form', 'pop');
  mark('.ek-chainband > *', 'pop');
  mark('.ek-footer__grid > *');

  void root.offsetHeight;
  root.classList.remove('ek-motion-init');

  // Counters: 20 and 13 count up, "0 Kč" counts down from a full lesson price.
  function count(el) {
    var final = el.textContent.trim(), m = final.match(/^(\d+)(.*)$/);
    if (!m || /\d/.test(m[2])) return; // ranges like "2–4" stay as they are
    var to = +m[1], suffix = m[2], from = to === 0 ? 590 : 0, t0 = null, dur = to === 0 ? 1600 : 1200;
    var hand = el.parentNode.querySelector('.ek-hand');
    el.textContent = from + suffix;
    function step(t) {
      if (t0 === null) t0 = t;
      var p = Math.min((t - t0) / dur, 1), e = 1 - Math.pow(1 - p, 3);
      el.textContent = Math.round(from + (to - from) * e) + suffix;
      if (p < 1) requestAnimationFrame(step);
      else { el.textContent = final; if (hand) hand.classList.add('is-in'); }
    }
    requestAnimationFrame(step);
  }

  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (en) {
      if (!en.isIntersecting) return;
      var el = en.target;
      el.classList.add('is-in');
      if (el.classList.contains('ek-stat')) { var b = el.querySelector('b'); if (b) setTimeout(function () { count(b); }, 150); }
      io.unobserve(el);
    });
  }, { rootMargin: '0px 0px -8% 0px', threshold: 0.12 });
  // Start observing only after the hidden state has been painted, otherwise the hero skips its entrance.
  requestAnimationFrame(function () { requestAnimationFrame(function () {
    document.querySelectorAll('[data-reveal], .ek-wave, .ek-mark').forEach(function (el) { io.observe(el); });
  }); });
})();

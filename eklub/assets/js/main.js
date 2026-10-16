/* eKLUB — page behaviour: mobile menu, contact form. */
(function () {
  window.Eklub && window.Eklub.hydrate();

  // Mobile menu
  var header = document.querySelector('[data-ek-header]');
  var burger = header && header.querySelector('.ek-burger');
  function setOpen(open) {
    header.classList.toggle('is-open', open);
    burger.setAttribute('aria-expanded', open ? 'true' : 'false');
    burger.textContent = open ? 'Zavřít' : 'Menu';
  }
  if (burger) {
    burger.addEventListener('click', function () { setOpen(!header.classList.contains('is-open')); });
    header.querySelectorAll('.ek-nav a').forEach(function (a) { a.addEventListener('click', function () { setOpen(false); }); });
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape') setOpen(false); });
  }

  // Links like "Jazykový audit zdarma" preselect the topic in the form
  var form = document.querySelector('[data-ek-form]');
  document.querySelectorAll('[data-ek-topic]').forEach(function (a) {
    a.addEventListener('click', function () {
      var r = form && form.querySelector('input[name="t"][value="' + a.getAttribute('data-ek-topic') + '"]');
      if (r) r.checked = true;
    });
  });

  // Contact form: hand the message to the visitor's e-mail client, addressed to eKLUB
  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var v = function (n) { var el = form.elements[n]; return el ? el.value.trim() : ''; };
      var topic = (form.querySelector('input[name="t"]:checked') || {}).value || 'Kurz';
      var body = [
        'Zájem o: ' + topic,
        'Jméno: ' + v('jmeno'),
        v('firma') ? 'Firma: ' + v('firma') : null,
        'E-mail: ' + v('email'),
        v('telefon') ? 'Telefon: ' + v('telefon') : null,
        '',
        v('zprava')
      ].filter(function (l) { return l !== null; }).join('\n');
      var href = 'mailto:eklub@eklub.cz?subject=' + encodeURIComponent('Poptávka z webu – ' + topic + ' – ' + v('jmeno')) + '&body=' + encodeURIComponent(body);
      window.location.href = href;
      var note = form.querySelector('.w-cta .ek-small');
      if (note) { note.textContent = 'Otevřeli jsme váš e-mail. Stačí zprávu odeslat – nebo volejte +420 608 101 105.'; note.classList.add('w-form__done'); }
    });
  }
})();

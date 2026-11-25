/*
 * LiberCom — the ONE place to change codes, links and launch status.
 * ---------------------------------------------------------------------------
 * Nothing in index.html or app.js repeats these values: app.js reads them and
 * fills in every link, code and label on the page. Edit a value, commit, and
 * the next Pages deploy publishes it. No build step.
 *
 * Plain ES5 on purpose: no bundler, and it must not break old browsers.
 * See README.md → "Configuration" for what each field does and how it was
 * verified.
 */
window.LIBERCOM_CONFIG = {
  brand: {
    name: 'LiberCom',            // header, hero and footer wordmark
    partnerName: 'Atli',
    partnerUrl: 'https://heyatli.com/',
    // Atli's own legal pages (both answered 200 on 25 Nov 2026).
    partnerTermsUrl: 'https://heyatli.com/terms',
    partnerPrivacyUrl: 'https://heyatli.com/privacy',
    liberlandUrl: 'https://liberland.org/'
  },

  // Card 1 — Global Plus, 30 GB · 365 days, with the Liberland discount.
  globalPlus: {
    // Atli's product page. The link on the page is
    //   productUrl + '?' + referralParam + '=' + code
    // so changing `code` alone updates the button, the copy button and the
    // code shown on the card.
    productUrl: 'https://heyatli.com/esim-global-plus',
    referralParam: 'referral',
    // Supplied by Atli. heyatli.com recognises it as a voucher (25 Nov 2026).
    // Atli may change the public code to 'LIBERLAND' — that code is currently
    // treated by heyatli.com as a plain referral, NOT as a voucher, so only
    // switch once Atli confirms it carries the 20% discount.
    code: 'LIBERLANDGLOBAL',
    discountPercent: 20,
    dataGb: 30,
    validityDays: 365,
    destinations: 113
  },

  // Card 2 — the free 1 GB for Liberland citizens.
  citizenData: {
    // 'coming-soon' until Atli supplies AND someone has tested the dedicated
    // redemption link; then set 'available' and fill in redemptionUrl.
    // The claim buttons go live only when BOTH are set and the URL is https.
    status: 'coming-soon',
    redemptionUrl: ''
  },

  // Section C — Atli's embeddable eSIM widget.
  widget: {
    scriptUrl: 'https://embed.heyatli.com/embed.js',
    // Atli's "Liberty" partner theme, made after liberland.org.
    cssUrl: 'https://embed.heyatli.com/themes/liberty.css',
    // Kept separate from globalPlus.code on purpose: Atli supplied
    // 'LIBERLAND' for the widget and 'LIBERLANDGLOBAL' for Global Plus.
    referral: 'LIBERLAND',
    theme: 'light',
    themePriority: 'widget',
    // Shown when the widget has not answered after this many ms in view.
    fallbackAfterMs: 15000
  },

  site: {
    // Where the preview is served. Every asset path in the page is relative,
    // so the same files work at /mobile/ and at the root of the future domain;
    // this value is informational (deploy step, docs, tests).
    basePath: '/mobile/',
    previewUrl: 'https://liberlandlimited.com/mobile/',
    productionUrl: 'https://libercom.ll.land/',
    // Leave null during the preview. Set to productionUrl only once
    // libercom.ll.land serves this site; app.js then adds <link rel=canonical>.
    canonicalUrl: null
  }
};

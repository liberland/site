/* Liberland eSignature for xNotary — page logic for /form.
 *
 * Three roles are simulated on one page, each with only the data it would really have:
 *   • the phone (Liberland App): identity, the non-extractable private key, the certificate;
 *   • the Liberland CA: issues and revokes certificates, sees only the public key;
 *   • xNotary: holds the PDF, computes its fingerprint, embeds the signature.
 * The cryptography lives in lib/core.js (bundled as vendor/sign-lib.js → window.LLSignLib).
 */
(function () {
  "use strict";

  var L = window.LLSignLib;
  var CA = window.LL_DEMO_CA;
  var TSA_URL = "https://rfc3161.ai.moda"; // public RFC 3161 proxy with CORS; only a hash is sent
  var RELYING_PARTY = "xnotary.digital";
  var MAX_BYTES = 30 * 1024 * 1024;
  var REVOKED_KEY = "ll-esign-revoked";

  var $ = function (sel, root) { return (root || document).querySelector(sel); };

  if (!L || !CA || !window.crypto || !window.crypto.subtle) {
    var body = document.getElementById("phone-body");
    if (body) body.innerHTML = '<p>This browser cannot run the demo (WebCrypto unavailable). Open the page over HTTPS in a current browser.</p>';
    return;
  }

  var caDer = L.fromB64(CA.certB64);
  var caKeyPromise = L.importPrivateJwk(CA.privateJwk);

  // ── state ────────────────────────────────────────────────
  var S = {
    identity: null,      // { fullName, liberlandId, kycAt }
    keyPair: null,       // CryptoKeyPair (private key non-extractable)
    keyFp: "",
    cert: null,          // { der, serialHex, notAfter, issuedAt }
    doc: null,           // { name, size, pages, prepared, digestHex, requestId, deepLink }
    tsa: true,
    phase: "idle",       // idle | requested | approving | signing | signed | declined
    signature: null,     // DER bytes from the phone
    approvedAt: null,
    signed: null,        // { bytes, fileName, ts, tsError }
    busy: {},
    errors: {},
  };

  // ── utilities ────────────────────────────────────────────
  function esc(s) {
    return String(s == null ? "" : s).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  }
  function groupHex(hex) { return hex.toUpperCase().replace(/(.{4})/g, "$1 ").trim(); }
  function shortHex(hex) { return hex.slice(0, 8).toUpperCase() + "…" + hex.slice(-8).toUpperCase(); }
  function fmtDate(d) {
    if (!d) return "—";
    var x = new Date(d);
    return x.toISOString().slice(0, 16).replace("T", " ") + " UTC";
  }
  function fmtDay(d) { return d ? new Date(d).toISOString().slice(0, 10) : "—"; }
  function fmtSize(n) { return n > 1048576 ? (n / 1048576).toFixed(1) + " MB" : Math.max(1, Math.round(n / 1024)) + " kB"; }
  function toast(msg) {
    var t = $("#toast");
    t.textContent = msg;
    t.classList.add("is-on");
    clearTimeout(toast._t);
    toast._t = setTimeout(function () { t.classList.remove("is-on"); }, 2600);
  }
  function download(bytes, name, type) {
    var url = URL.createObjectURL(new Blob([bytes], { type: type }));
    var a = document.createElement("a");
    a.href = url;
    a.download = name;
    document.body.appendChild(a);
    a.click();
    a.remove();
    setTimeout(function () { URL.revokeObjectURL(url); }, 4000);
  }
  function errMsg(e) {
    var m = (e && (e.message || e.name)) || String(e);
    if (/encrypt/i.test(m)) return "This PDF is encrypted or password-protected. Remove the protection and try again.";
    if (/Failed to parse|No PDF header|Invalid PDF|parse/i.test(m)) return "This file could not be read as a PDF.";
    return m;
  }

  function revokedList() {
    try { return JSON.parse(localStorage.getItem(REVOKED_KEY) || "[]"); } catch (e) { return []; }
  }
  function isRevoked(serialHex) { return revokedList().indexOf(serialHex) >= 0; }
  function setRevoked(serialHex, on) {
    var list = revokedList().filter(function (s) { return s !== serialHex; });
    if (on) list.push(serialHex);
    try { localStorage.setItem(REVOKED_KEY, JSON.stringify(list)); } catch (e) { /* in-memory only */ }
    memRevoked[serialHex] = on;
  }
  var memRevoked = {};
  function revoked(serialHex) { return memRevoked[serialHex] != null ? memRevoked[serialHex] : isRevoked(serialHex); }

  // ── the phone's storage (IndexedDB keeps the CryptoKey without ever exposing it) ──
  var DB_NAME = "ll-esign", STORE = "phone";
  function db() {
    return new Promise(function (resolve, reject) {
      var req = indexedDB.open(DB_NAME, 1);
      req.onupgradeneeded = function () { req.result.createObjectStore(STORE); };
      req.onsuccess = function () { resolve(req.result); };
      req.onerror = function () { reject(req.error); };
    });
  }
  function savePhone() {
    var data = { identity: S.identity, keyPair: S.keyPair, keyFp: S.keyFp, cert: S.cert };
    return db().then(function (d) {
      return new Promise(function (resolve) {
        var tx = d.transaction(STORE, "readwrite");
        tx.objectStore(STORE).put(data, "state");
        tx.oncomplete = resolve;
        tx.onerror = resolve;
      });
    }).catch(function () {});
  }
  function loadPhone() {
    return db().then(function (d) {
      return new Promise(function (resolve) {
        var req = d.transaction(STORE, "readonly").objectStore(STORE).get("state");
        req.onsuccess = function () { resolve(req.result || null); };
        req.onerror = function () { resolve(null); };
      });
    }).catch(function () { return null; });
  }
  function clearPhone() {
    return db().then(function (d) {
      return new Promise(function (resolve) {
        var tx = d.transaction(STORE, "readwrite");
        tx.objectStore(STORE).delete("state");
        tx.oncomplete = resolve;
        tx.onerror = resolve;
      });
    }).catch(function () {});
  }

  // ── actions ──────────────────────────────────────────────
  function confirmKyc(fullName, liberlandId) {
    S.identity = { fullName: fullName, liberlandId: liberlandId, kycAt: new Date().toISOString() };
    savePhone();
    render();
  }

  function createKey() {
    S.busy.key = true; render();
    L.generateSigningKey().then(function (kp) {
      S.keyPair = kp;
      return L.publicKeyFingerprint(kp.publicKey);
    }).then(function (fp) {
      S.keyFp = fp;
      S.busy.key = false;
      savePhone();
      render();
    }).catch(function (e) { S.busy.key = false; S.errors.key = errMsg(e); render(); });
  }

  function tryExport() {
    crypto.subtle.exportKey("pkcs8", S.keyPair.privateKey).then(function () {
      S.errors.exportTest = "Unexpected: the key was exportable.";
      render();
    }).catch(function (e) {
      S.errors.exportTest = "Refused by the browser: " + (e.name || "InvalidAccessError") + ". The private key cannot leave this device.";
      render();
    });
  }

  function requestCertificate() {
    S.busy.cert = true; S.errors.cert = null; render();
    // The phone sends ONLY the public key (plus the KYC-verified identity reference) to the CA.
    caKeyPromise.then(function (caKey) {
      return L.issueCitizenCertificate({
        caCertDer: caDer,
        caPrivateKey: caKey,
        subjectPublicKey: S.keyPair.publicKey,
        fullName: S.identity.fullName,
        liberlandId: S.identity.liberlandId,
        days: 365,
      });
    }).then(function (c) {
      S.cert = { der: c.der, serialHex: c.serialHex, notAfter: c.notAfter.toISOString(), issuedAt: new Date().toISOString() };
      S.busy.cert = false;
      savePhone();
      render();
    }).catch(function (e) { S.busy.cert = false; S.errors.cert = errMsg(e); render(); });
  }

  function loadDocument(name, bytes) {
    if (bytes.length > MAX_BYTES) { S.errors.doc = "That file is larger than 30 MB."; render(); return; }
    S.busy.doc = true; S.errors.doc = null;
    S.doc = null; S.phase = "idle"; S.signed = null; S.signature = null;
    render();
    L.preparePdf(bytes, {
      fullName: S.identity.fullName,
      liberlandId: S.identity.liberlandId,
      signedAt: new Date(),
    }).then(function (p) {
      var digestHex = L.toHex(p.documentDigest);
      var requestId = L.toHex(crypto.getRandomValues(new Uint8Array(8)));
      var deepLink = "liberland://sign?v=1&rp=" + RELYING_PARTY + "&req=" + requestId + "&sha256=" + digestHex +
        "&doc=" + encodeURIComponent(name);
      S.doc = { name: name, size: bytes.length, pages: p.pageCount, prepared: p, digestHex: digestHex, requestId: requestId, deepLink: deepLink };
      S.busy.doc = false;
      render();
    }).catch(function (e) { S.busy.doc = false; S.errors.doc = errMsg(e); render(); });
  }

  function useSample() {
    S.busy.doc = true; render();
    L.createSamplePdf({ title: "Service Agreement", parties: ["Liberland Limited", S.identity.fullName] })
      .then(function (bytes) { loadDocument("liberland-sample-agreement.pdf", bytes); })
      .catch(function (e) { S.busy.doc = false; S.errors.doc = errMsg(e); render(); });
  }

  function sendToPhone() {
    S.phase = "requested";
    render();
    if (window.matchMedia("(max-width: 980px)").matches) {
      $(".phone").scrollIntoView({ behavior: "smooth", block: "center" });
    }
  }

  var signedAttrsCache = null;
  function approve() {
    if (revoked(S.cert.serialHex)) return;
    S.phase = "approving";
    render();
    var start = Date.now();
    L.buildSignedAttributes(S.doc.prepared.documentDigest, S.cert.der).then(function (sa) {
      signedAttrsCache = sa;
      // "Face ID / fingerprint": the protected key signs only after the user approves.
      var wait = Math.max(0, 1100 - (Date.now() - start));
      return new Promise(function (r) { setTimeout(r, wait); }).then(function () {
        return L.signOnDevice(S.keyPair.privateKey, sa.toBeSigned);
      });
    }).then(function (sig) {
      S.signature = sig;
      S.approvedAt = new Date();
      S.phase = "signing";
      render();
      return embed();
    }).catch(function (e) {
      S.phase = "requested";
      S.errors.sign = errMsg(e);
      render();
    });
  }

  function decline() {
    S.phase = "declined";
    render();
  }

  function embed() {
    var tsPromise = S.tsa
      ? L.requestTimestamp(S.signature, TSA_URL).then(function (t) { return { ts: t }; }, function (e) { return { tsError: errMsg(e) }; })
      : Promise.resolve({});
    return tsPromise.then(function (res) {
      var cms = L.assembleCms({
        signedAttrs: signedAttrsCache.signedAttrs,
        signature: S.signature,
        signerCertDer: S.cert.der,
        chainDer: [caDer],
        timestampToken: res.ts ? res.ts.token : null,
      });
      var bytes = L.embedSignature(S.doc.prepared, cms);
      var base = S.doc.name.replace(/\.pdf$/i, "");
      S.signed = { bytes: bytes, fileName: base + "-signed.pdf", ts: res.ts || null, tsError: res.tsError || null };
      S.phase = "signed";
      render();
    }).catch(function (e) {
      S.phase = "requested";
      S.errors.sign = errMsg(e);
      render();
    });
  }

  function resetDoc() {
    S.doc = null; S.phase = "idle"; S.signed = null; S.signature = null; S.errors.doc = null; S.errors.sign = null;
    render();
  }

  function resetPhone() {
    if (!window.confirm("Reset the demo phone? Its identity, key and certificate are deleted.")) return;
    clearPhone().then(function () {
      S.identity = null; S.keyPair = null; S.keyFp = ""; S.cert = null;
      S.errors = {};
      resetDoc();
      toast("Demo phone reset");
    });
  }

  // ── rendering: steps ─────────────────────────────────────
  function stepState(n) {
    var hasId = !!S.identity, hasKey = !!S.keyPair, hasCert = !!S.cert;
    var reqd = S.phase === "requested" || S.phase === "approving" || S.phase === "signing" || S.phase === "signed" || S.phase === "declined";
    switch (n) {
      case 1: return hasId ? "done" : "active";
      case 2: return hasKey ? "done" : hasId ? "active" : "locked";
      case 3: return hasCert ? (revoked(S.cert.serialHex) ? "active" : "done") : hasKey ? "active" : "locked";
      case 4: return !hasCert ? "locked" : reqd ? "done" : "active";
      case 5: return S.phase === "signing" || S.phase === "signed" ? "done" : reqd ? "active" : "locked";
      case 6: return S.phase === "signed" ? "done" : S.phase === "signing" ? "active" : "locked";
    }
  }
  var STATUS = { done: "Done", active: "Now", locked: "Waiting" };

  function stepBody(n) {
    var h = "";
    switch (n) {
      case 1:
        if (!S.identity) {
          h += '<p class="body">In the real app this is already done. For the demo, enter a name and a Liberland ID on the phone and confirm KYC.</p>';
        } else {
          h += '<dl class="kv"><dt>Name</dt><dd>' + esc(S.identity.fullName) + '</dd><dt>Liberland ID</dt><dd>' + esc(S.identity.liberlandId) +
            '</dd><dt>KYC</dt><dd><span class="pill pill--ok">Verified</span> <span class="small">demo, ' + fmtDay(S.identity.kycAt) + '</span></dd></dl>';
        }
        break;
      case 2:
        if (!S.keyPair) {
          h += '<p class="body">The phone creates a P-256 key pair inside its protected hardware. Tap <em>Create signing key</em> on the phone.</p>';
          if (S.errors.key) h += '<div class="alert alert--bad">' + esc(S.errors.key) + "</div>";
        } else {
          h += '<dl class="kv"><dt>Algorithm</dt><dd>ECDSA P-256 (secp256r1), SHA-256</dd><dt>Private key</dt><dd>Non-extractable, stored on this device</dd>' +
            '<dt>Public key</dt><dd class="mono">SHA-256 ' + esc(groupHex(S.keyFp).slice(0, 39)) + '…</dd></dl>';
          h += '<div class="step-actions"><button class="btn btn--ghost btn--sm" type="button" data-act="export-test">Try to export the private key</button></div>';
          if (S.errors.exportTest) h += '<div class="alert alert--ok">' + esc(S.errors.exportTest) + "</div>";
        }
        break;
      case 3:
        if (!S.cert) {
          h += '<p class="body">The phone sends <strong>only the public key</strong> to the Liberland certificate authority, which checks the KYC record and issues a certificate: "this key belongs to [verified name, ID]".</p>';
          if (S.errors.cert) h += '<div class="alert alert--bad">' + esc(S.errors.cert) + "</div>";
        } else {
          var d = L.describeCertificate(S.cert.der);
          var rev = revoked(S.cert.serialHex);
          h += '<dl class="kv"><dt>Subject</dt><dd>' + esc(d.subject.CN) + " · " + esc(d.subject.serialNumber) + '</dd><dt>Attests</dt><dd>' + esc(d.subject.OU) +
            '</dd><dt>Issuer</dt><dd>' + esc(d.issuer.CN) + '</dd><dt>Serial</dt><dd class="mono">' + esc(groupHex(d.serialHex)) +
            '</dd><dt>Valid until</dt><dd>' + fmtDay(d.notAfter) + '</dd><dt>Status</dt><dd>' +
            (rev ? '<span class="pill pill--bad">Revoked</span>' : '<span class="pill pill--ok">Active</span>') + "</dd></dl>";
          if (rev) h += '<div class="alert alert--warn">The CA revoked this certificate. The phone refuses to sign, and verifiers flag signatures made with it. Reinstate it, or reset the phone to start again.</div>';
          h += '<div class="step-actions">' +
            '<button class="btn btn--ghost btn--sm" type="button" data-act="dl-cert">Download certificate</button>' +
            '<button class="btn btn--ghost btn--sm" type="button" data-act="dl-ca">Download CA certificate</button>' +
            (rev ? '<button class="btn btn--sm" type="button" data-act="reinstate">Reinstate (CA console)</button>'
                 : '<button class="btn btn--danger btn--sm" type="button" data-act="revoke">Revoke (CA console)</button>') +
            "</div>";
          h += '<p class="small note">Revocation in this demo is recorded in this browser. A production CA publishes it through OCSP and a CRL, so every verifier sees it.</p>';
        }
        break;
      case 4:
        if (!S.cert) { h += '<p class="body">Open a PDF in xNotary once the certificate is issued.</p>'; break; }
        if (!S.doc) {
          h += '<label class="drop" id="doc-drop"><input type="file" id="doc-file" accept="application/pdf,.pdf">' +
            '<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" aria-hidden="true"><path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8l-5-5z"/><path d="M14 3v5h5"/><path d="M12 12v6M9 15l3-3 3 3"/></svg>' +
            "<strong>" + (S.busy.doc ? '<span class="spinner"></span> Preparing the document…' : "Drop a PDF here, or choose a file") + "</strong>" +
            '<span class="small">It stays in your browser. Nothing is uploaded.</span></label>' +
            '<div class="step-actions"><span class="small">No PDF at hand?</span><button class="btn btn--ghost btn--sm" type="button" data-act="sample">Use a sample agreement</button></div>';
          if (S.errors.doc) h += '<div class="alert alert--bad">' + esc(S.errors.doc) + "</div>";
          break;
        }
        h += '<dl class="kv"><dt>Document</dt><dd>' + esc(S.doc.name) + '</dd><dt>Size</dt><dd>' + fmtSize(S.doc.size) + " · " + S.doc.pages + (S.doc.pages === 1 ? " page" : " pages") + "</dd></dl>";
        h += '<div class="request"><div class="qr" aria-hidden="true">' + L.qrSvg(S.doc.deepLink, { cellSize: 3, margin: 2 }) + "</div><div>" +
          '<p class="label" style="margin-bottom:6px">Document fingerprint · SHA-256</p><div class="hash" data-testid="doc-hash">' + esc(groupHex(S.doc.digestHex)) + "</div>" +
          '<span class="deeplink">' + esc(S.doc.deepLink) + "</span></div></div>";
        h += '<p class="small note">The fingerprint covers every byte of the PDF except the slot reserved for the signature, including the visible stamp xNotary added to the last page. Change one byte and it no longer matches.</p>';
        var locked = S.phase !== "idle";
        h += '<label class="check"><input type="checkbox" id="tsa-toggle"' + (S.tsa ? " checked" : "") + (locked ? " disabled" : "") +
          '><span>Add a trusted timestamp when signing <span class="small">(RFC 3161 via a public timestamp authority; only a hash of the signature is sent)</span></span></label>';
        h += '<div class="step-actions">' +
          (S.phase === "idle" ? '<button class="btn btn--teal" type="button" data-act="send">Scan with the demo phone <span aria-hidden="true">→</span></button>' : "") +
          '<button class="btn btn--ghost btn--sm" type="button" data-act="reset-doc">Choose another document</button></div>';
        break;
      case 5:
        if (S.phase === "idle" || !S.doc) { h += '<p class="body">The phone shows what is being signed and asks for fingerprint or face.</p>'; break; }
        if (S.phase === "requested") {
          h += '<p class="body"><span class="spinner" aria-hidden="true"></span> Waiting for approval on the phone…</p>';
          if (revoked(S.cert.serialHex)) h += '<div class="alert alert--warn">The certificate is revoked, so the phone will refuse. Reinstate it in step 3.</div>';
          if (S.errors.sign) h += '<div class="alert alert--bad">' + esc(S.errors.sign) + "</div>";
        } else if (S.phase === "approving") {
          h += '<p class="body"><span class="spinner" aria-hidden="true"></span> Biometric check, then the protected key signs…</p>';
        } else if (S.phase === "declined") {
          h += '<div class="alert alert--warn">Declined on the phone. Nothing was signed.</div><div class="step-actions"><button class="btn btn--ghost btn--sm" type="button" data-act="send">Send the request again</button></div>';
        } else {
          h += '<dl class="kv"><dt>Approved</dt><dd>' + fmtDate(S.approvedAt) + '</dd><dt>Signed</dt><dd>Document fingerprint + certificate reference (CAdES signed attributes)</dd>' +
            '<dt>Signature</dt><dd class="mono">ECDSA ' + esc(shortHex(L.toHex(S.signature))) + "</dd></dl>";
        }
        break;
      case 6:
        if (S.phase === "signing") { h += '<p class="body"><span class="spinner" aria-hidden="true"></span> Embedding the signature and certificate' + (S.tsa ? ", requesting the timestamp" : "") + "…</p>"; break; }
        if (S.phase !== "signed") { h += '<p class="body">xNotary embeds the signature and the certificate into the PDF as a standard PDF signature.</p>'; break; }
        h += '<div class="alert alert--ok">Signed. Open the file in Adobe Acrobat or any signature-aware reader, or check it below.</div>';
        h += '<dl class="kv"><dt>File</dt><dd>' + esc(S.signed.fileName) + " · " + fmtSize(S.signed.bytes.length) + '</dd><dt>Format</dt><dd>PAdES (ETSI.CAdES.detached), ECDSA P-256, SHA-256</dd><dt>Timestamp</dt><dd>' +
          (S.signed.ts ? fmtDate(S.signed.ts.genTime) + " · " + esc(S.signed.ts.tsa || "timestamp authority")
            : S.signed.tsError ? '<span class="pill pill--warn">Not added</span> <span class="small">' + esc(S.signed.tsError) + "</span>"
            : "Not requested") + "</dd></dl>";
        h += '<div class="step-actions"><button class="btn btn--solid" type="button" data-act="dl-signed">Download signed PDF</button>' +
          '<button class="btn btn--ghost" type="button" data-act="verify-signed">Verify it</button>' +
          '<button class="btn btn--ghost btn--sm" type="button" data-act="reset-doc">Sign another document</button></div>';
        h += '<p class="small note">Acrobat will say the signer\'s identity is unknown: the demo CA is not in its trust list. Add <em>Download CA certificate</em> from step 3 as a trusted certificate and the signature turns valid. A production Liberland root can be submitted to Adobe\'s trust list.</p>';
        break;
    }
    return h;
  }

  // ── rendering: phone ─────────────────────────────────────
  var FACE_ICON = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" aria-hidden="true"><path d="M4 8V6a2 2 0 0 1 2-2h2M16 4h2a2 2 0 0 1 2 2v2M20 16v2a2 2 0 0 1-2 2h-2M8 20H6a2 2 0 0 1-2-2v-2"/><path d="M9 9.5v1M15 9.5v1M12 9.5v3.5h-1M9.5 16c1.5 1.2 3.5 1.2 5 0"/></svg>';

  function certCard() {
    var rev = revoked(S.cert.serialHex);
    return '<div class="card-cert' + (rev ? " is-revoked" : "") + '"><div class="row"><span class="lbl">Signing certificate</span><span class="lbl">' + (rev ? "Revoked" : "Active") + "</span></div>" +
      '<div class="nm">' + esc(S.identity.fullName) + '</div><div class="row"><span class="id">' + esc(S.identity.liberlandId) + '</span><span class="lbl">until ' + fmtDay(S.cert.notAfter) + "</span></div></div>";
  }

  function phoneScreen() {
    if (!S.identity) {
      return { sub: "Identity", html:
        '<h3>Your verified identity</h3><p>KYC is already complete in the Liberland App. For this demo, type the name and ID it would hold.</p>' +
        '<form id="kyc-form" class="field" style="gap:12px" autocomplete="off">' +
        '<div class="field"><label for="kyc-name">Full name</label><input id="kyc-name" name="fullName" required maxlength="64" placeholder="Jana Svobodová"></div>' +
        '<div class="field"><label for="kyc-id">Liberland ID</label><input id="kyc-id" name="liberlandId" required maxlength="32" pattern="[A-Za-z0-9 \\-]{3,32}" placeholder="LL-2026-004711"></div>' +
        '<button class="btn btn--teal" type="submit">Confirm verified KYC</button></form>' };
    }
    if (!S.keyPair) {
      return { sub: "Signing key", html:
        "<h3>Create your signing key</h3><p>A private key is generated inside this phone. It can sign, but nobody — not Liberland, not xNotary, not you — can copy it out.</p>" +
        '<div class="spacer"></div><button class="btn btn--teal" type="button" data-act="create-key"' + (S.busy.key ? " disabled" : "") + ">" +
        (S.busy.key ? '<span class="spinner"></span> Generating…' : "Create signing key") + "</button>" };
    }
    if (!S.cert) {
      return { sub: "Certificate", html:
        '<h3>Get your Liberland certificate</h3><p>Your public key goes to the Liberland certificate authority. It confirms the key belongs to <strong>' + esc(S.identity.fullName) + "</strong>.</p>" +
        '<p class="mini">Public key SHA-256<br>' + esc(groupHex(S.keyFp)) + "</p>" +
        '<div class="spacer"></div><button class="btn btn--teal" type="button" data-act="request-cert"' + (S.busy.cert ? " disabled" : "") + ">" +
        (S.busy.cert ? '<span class="spinner"></span> Contacting the CA…' : "Request certificate") + "</button>" };
    }
    if (S.phase === "requested" || S.phase === "approving") {
      var rev = revoked(S.cert.serialHex);
      var scanning = S.phase === "approving";
      return { sub: "Signing request", html:
        '<h3>Sign this document?</h3><div class="req-card"><div class="from"><span class="pill">xNotary.digital</span> asks you to sign</div>' +
        '<div class="doc">' + esc(S.doc.name) + '</div><p class="mini">' + S.doc.pages + (S.doc.pages === 1 ? " page" : " pages") + " · SHA-256<br>" + esc(groupHex(S.doc.digestHex)) + "</p>" +
        '<p style="font-size:12px">As <strong>' + esc(S.identity.fullName) + "</strong> · " + esc(S.identity.liberlandId) + "</p></div>" +
        (rev ? '<div class="alert alert--bad">Your certificate has been revoked. This phone cannot sign.</div>' :
          '<p>Check the fingerprint matches the one xNotary shows.</p>') +
        '<div class="spacer"></div><div class="bio"><button class="bio-btn' + (scanning ? " is-scanning" : "") + '" type="button" data-act="approve" aria-label="Approve with Face ID or fingerprint"' + (rev || scanning ? " disabled" : "") + ">" + FACE_ICON + "</button>" +
        '<span class="small">' + (scanning ? "Verifying…" : "Approve with Face ID or fingerprint") + "</span></div>" +
        '<button class="btn btn--ghost btn--sm" type="button" data-act="decline"' + (scanning ? " disabled" : "") + ">Decline</button>" };
    }
    if (S.phase === "signing" || S.phase === "signed") {
      return { sub: "Signed", html:
        '<div class="big-check" aria-hidden="true"><svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4"><path d="M5 12.5l4.5 4.5L19 7.5"/></svg></div>' +
        '<h3 style="text-align:center">Signed</h3><p style="text-align:center">Your phone signed the fingerprint of <strong>' + esc(S.doc.name) + "</strong>. The signature went back to xNotary; the document never came to this phone.</p>" +
        '<p class="mini" style="text-align:center">' + fmtDate(S.approvedAt) + "</p><div class=\"spacer\"></div>" + certCard() };
    }
    return { sub: "Wallet", html:
      "<h3>Ready to sign</h3>" + certCard() +
      "<p>" + (S.phase === "declined" ? "You declined the last request." : "No pending requests. Open a document in xNotary and scan its QR code.") + "</p>" +
      '<p class="mini">Key SHA-256 ' + esc(shortHex(S.keyFp)) + "<br>Certificate " + esc(groupHex(S.cert.serialHex).slice(0, 19)) + "…</p>" };
  }

  // ── render ───────────────────────────────────────────────
  function render() {
    for (var n = 1; n <= 6; n++) {
      var el = document.getElementById("step-" + n);
      var st = stepState(n);
      el.dataset.state = st;
      $("[data-status]", el).textContent = n === 3 && S.cert && revoked(S.cert.serialHex) ? "Revoked" : STATUS[st];
      var body = $("[data-body]", el);
      var html = stepBody(n);
      if (body._html !== html) { body.innerHTML = html; body._html = html; }
    }
    var p = phoneScreen();
    $("#phone-sub").textContent = p.sub;
    var pb = $("#phone-body");
    if (pb._html !== p.html) {
      var keep = {};
      ["kyc-name", "kyc-id"].forEach(function (id) { var i = document.getElementById(id); if (i) keep[id] = i.value; });
      pb.innerHTML = p.html;
      pb._html = p.html;
      Object.keys(keep).forEach(function (id) { var i = document.getElementById(id); if (i) i.value = keep[id]; });
    }
    wireDrop($("#doc-drop"), function (f) { readFile(f, loadDocument); });
  }

  function readFile(file, cb) {
    if (!file) return;
    if (!/\.pdf$/i.test(file.name) && file.type !== "application/pdf") { toast("Please choose a PDF file"); return; }
    file.arrayBuffer().then(function (buf) { cb(file.name, new Uint8Array(buf)); });
  }

  function wireDrop(zone, onFile) {
    if (!zone || zone._wired) return;
    zone._wired = true;
    var input = $('input[type="file"]', zone);
    input.addEventListener("change", function () { onFile(input.files[0]); input.value = ""; });
    ["dragenter", "dragover"].forEach(function (ev) {
      zone.addEventListener(ev, function (e) { e.preventDefault(); zone.classList.add("is-over"); });
    });
    ["dragleave", "drop"].forEach(function (ev) {
      zone.addEventListener(ev, function (e) { e.preventDefault(); zone.classList.remove("is-over"); });
    });
    zone.addEventListener("drop", function (e) { onFile(e.dataTransfer.files[0]); });
  }

  // ── verification ─────────────────────────────────────────
  function check(kind, title, detail) {
    var sym = { ok: "✓", bad: "✕", warn: "!", na: "–" }[kind];
    return '<li><span class="ic ic--' + kind + '" aria-hidden="true">' + sym + '</span><span><strong>' + title + "</strong>" +
      (detail ? '<span class="small">' + detail + "</span>" : "") + "</span></li>";
  }

  function verifyBytes(name, bytes) {
    var out = $("#verify-report");
    out.innerHTML = '<div class="report-card"><p class="body" style="margin:0"><span class="spinner"></span> Checking ' + esc(name) + "…</p></div>";
    L.verifyPdf(bytes, { trustedCaDer: caDer, isRevoked: revoked }).then(function (results) {
      if (!results.length) {
        out.innerHTML = '<div class="report-card"><p class="label">' + esc(name) + '</p><h3 class="h3">No digital signature found</h3><p class="body" style="margin:0">This PDF carries no embedded signature. A printed or drawn signature image is not a digital signature.</p></div>';
        return;
      }
      out.innerHTML = results.map(function (r, i) { return reportCard(name, r, i, results.length); }).join("");
    }).catch(function (e) {
      out.innerHTML = '<div class="report-card"><h3 class="h3">Could not check this file</h3><div class="alert alert--bad">' + esc(errMsg(e)) + "</div></div>";
    });
  }

  function reportCard(name, r, i, total) {
    var head = '<p class="label">' + esc(name) + (total > 1 ? " · signature " + (i + 1) + " of " + total : "") + "</p>";
    if (r.error) {
      return '<div class="report-card">' + head + '<h3 class="h3">This signature could not be read</h3><div class="alert alert--bad">' + esc(r.error) + "</div></div>";
    }
    var signer = r.signer || {};
    var expired = r.certNotAfter && r.claimedTime && new Date(r.claimedTime) > new Date(r.certNotAfter);
    var good = r.documentIntact && r.signatureValid && r.issuedByLiberland && !r.revoked && !expired;
    var verdict = good
      ? (r.coversWholeFile ? '<span class="pill pill--ok">Valid · Liberland identity</span>' : '<span class="pill pill--warn">Valid, file changed later</span>')
      : (!r.documentIntact || !r.signatureValid) ? '<span class="pill pill--bad">Invalid</span>'
      : r.revoked ? '<span class="pill pill--bad">Certificate revoked</span>'
      : '<span class="pill pill--warn">Not a Liberland identity</span>';
    var h = '<div class="report-card">' + head + '<h3 class="h3">' + esc(signer.CN || "Unknown signer") + "</h3>" +
      '<div class="verdict">' + verdict + (signer.serialNumber ? ' <span class="small">Liberland ID ' + esc(signer.serialNumber) + "</span>" : "") + "</div><ul class=\"checks\">";
    h += r.issuedByLiberland
      ? check("ok", "Who signed: verified by Liberland KYC", esc(signer.OU || "") + " · issued by " + esc((r.issuer && r.issuer.CN) || "Liberland CA"))
      : check("warn", "Signer not vouched for by the Liberland CA", "Certificate issued by " + esc((r.issuer && (r.issuer.CN || r.issuer.O)) || "an unknown authority") + ". The name in it is not a Liberland-verified identity.");
    h += r.documentIntact
      ? check("ok", "Document unchanged since signing", "The SHA-256 fingerprint of the signed bytes matches the one in the signature.")
      : check("bad", "Document changed after signing", "The signed bytes no longer match the fingerprint in the signature.");
    h += r.signatureValid
      ? check("ok", "Signature is cryptographically valid", "Made by the private key belonging to this certificate.")
      : check("bad", "Signature does not verify", "It was not made by this certificate's key, or it was altered.");
    if (!r.coversWholeFile) h += check("warn", "Content was added after this signature", "Later signatures or edits were appended. Check the later signatures, or the earlier revision this one covers.");
    h += r.revoked
      ? check("bad", "Certificate revoked by the Liberland CA", "Serial " + esc(groupHex(r.certSerialHex || "")))
      : expired
        ? check("bad", "Certificate had expired when this was signed", "Valid until " + fmtDay(r.certNotAfter))
        : check("ok", "Certificate active", "Valid " + fmtDay(r.certNotBefore) + " to " + fmtDay(r.certNotAfter) + (r.issuedByLiberland ? " · revocation checked against the demo CA list in this browser" : ""));
    if (r.timestamp && !r.timestamp.error) {
      var tsGood = r.timestamp.coversSignature && r.timestamp.tsaSignatureValid;
      h += check(tsGood ? "ok" : "bad", "Signed no later than " + fmtDate(r.timestamp.time),
        tsGood ? "Independent RFC 3161 timestamp by " + esc(r.timestamp.tsa || "a timestamp authority") + ", covering this signature." : "The timestamp does not match this signature.");
    } else if (r.timestamp && r.timestamp.error) {
      h += check("warn", "Timestamp could not be read", esc(r.timestamp.error));
    } else {
      h += check("na", "No timestamp", r.claimedTime ? "The signer's device states " + fmtDate(r.claimedTime) + ". Without a timestamp that time is not independently proven." : "");
    }
    h += "</ul></div>";
    return h;
  }

  // ── events ───────────────────────────────────────────────
  document.addEventListener("click", function (e) {
    var b = e.target.closest("[data-act]");
    if (!b || b.disabled) return;
    var act = b.getAttribute("data-act");
    switch (act) {
      case "create-key": createKey(); break;
      case "request-cert": requestCertificate(); break;
      case "export-test": tryExport(); break;
      case "dl-cert": download(S.cert.der, "liberland-certificate-" + S.identity.liberlandId.replace(/[^A-Za-z0-9-]/g, "") + ".cer", "application/pkix-cert"); break;
      case "dl-ca": download(caDer, "liberland-demo-ca.cer", "application/pkix-cert"); break;
      case "revoke": setRevoked(S.cert.serialHex, true); toast("Certificate revoked by the CA"); render(); break;
      case "reinstate": setRevoked(S.cert.serialHex, false); toast("Certificate reinstated"); render(); break;
      case "sample": useSample(); break;
      case "send": sendToPhone(); break;
      case "reset-doc": resetDoc(); break;
      case "approve": approve(); break;
      case "decline": decline(); break;
      case "dl-signed": download(S.signed.bytes, S.signed.fileName, "application/pdf"); break;
      case "verify-signed":
        verifyBytes(S.signed.fileName, S.signed.bytes);
        document.getElementById("verify").scrollIntoView({ behavior: "smooth" });
        break;
    }
  });

  document.addEventListener("submit", function (e) {
    if (e.target.getAttribute("id") !== "kyc-form") return;
    e.preventDefault();
    var name = $("#kyc-name").value.trim().replace(/\s+/g, " ");
    var id = $("#kyc-id").value.trim().toUpperCase();
    if (!name || !id) return;
    confirmKyc(name, id);
  });

  document.addEventListener("change", function (e) {
    if (e.target.id === "tsa-toggle") S.tsa = e.target.checked;
  });

  $("#reset-phone").addEventListener("click", resetPhone);
  wireDrop($("#verify-drop"), function (f) { readFile(f, verifyBytes); });

  function tick() {
    var d = new Date();
    $("#phone-clock").textContent = d.getHours() + ":" + String(d.getMinutes()).padStart(2, "0");
  }
  tick();
  setInterval(tick, 30000);

  // ── start: restore the phone ─────────────────────────────
  render();
  loadPhone().then(function (saved) {
    if (saved && saved.identity) {
      S.identity = saved.identity;
      if (saved.keyPair && saved.keyPair.privateKey) { S.keyPair = saved.keyPair; S.keyFp = saved.keyFp || ""; }
      if (S.keyPair && saved.cert && saved.cert.der) S.cert = saved.cert;
      render();
    }
  });

  // Test hook (used by tests/site.spec.js).
  window.__llEsign = { state: S, verifyBytes: verifyBytes };
})();

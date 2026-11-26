# Liberland eSignature for xNotary — `/form`

A proposal page, styled after liberland.org (yellow top bar, shield + wordmark, dark-blue hero, Playfair Display + Open Sans), with a **working demonstration** of how a Liberland identity can sign PDFs through xNotary.digital
(launched with Jan Purkrabek and LongRiver Lab). Served at `https://liberlandlimited.com/form/` (`noindex`).

## The flow (all real cryptography, all in the browser)

1. **Identity** — the simulated Liberland App holds a KYC-verified name and Liberland ID.
2. **Key** — the phone generates an ECDSA P-256 key, **non-extractable** (WebCrypto refuses to export it; the page
   lets you try). It persists in IndexedDB, like a key in the Secure Enclave / StrongBox.
3. **Certificate** — only the public key goes to the Liberland CA, which issues an X.509 certificate
   (`CN` = name, `serialNumber` = Liberland ID, KeyUsage digitalSignature + nonRepudiation). The CA console can
   revoke / reinstate it (demo revocation list in `localStorage`).
4. **Document** — xNotary adds a visible stamp and an empty signature field, computes the SHA-256 over the PDF's
   `/ByteRange` (the fingerprint) and shows a QR code with a `liberland://sign?...` request.
5. **Phone** — shows the document and fingerprint, "Face ID" approval, signs the CAdES signed attributes
   (messageDigest + signing-certificate-v2) with the protected key.
6. **PDF** — xNotary embeds a CMS SignedData (`ETSI.CAdES.detached`, PAdES baseline) with the certificate chain and,
   optionally, an RFC 3161 timestamp from `https://rfc3161.ai.moda` (public proxy to DigiCert & co.; only the
   signature's hash is sent; without it the PDF is still signed).

The **verifier** checks any PDF: integrity, signature, chain to the Liberland CA, revocation, timestamp, and whether
content was appended after signing. Independently checked with pyHanko: `INTACT:TRUSTED, TIMESTAMP_TOKEN<INTACT>, UNTOUCHED`.

## What is a demo

- `demo-ca.js` holds the demo CA **including its private key, on purpose**. Anyone can mint "Liberland"
  certificates with it, so signatures prove the mechanism, not identity. Regenerate with
  `node tools/make-demo-ca.mjs` (old demo PDFs then stop chaining).
- One browser plays phone, CA and xNotary. Production: key in Secure Enclave/StrongBox, CA keys in an HSM with
  OCSP/CRL, an xNotary signing-request API (QR → app → signature back to xNotary), PAdES-LTA, optionally the
  Liberland root on the Adobe trust list.

## Files

| File | Purpose |
| --- | --- |
| `index.html`, `styles.css`, `app.js` | The page (no framework, no build step at deploy) |
| `lib/core.js` | Crypto core: certificates, PDF placeholder, CMS, timestamp, verifier |
| `vendor/sign-lib.js` | `lib/` bundled with pkijs, asn1js, pdf-lib, qrcode-generator (`npm run build:lib`) — committed |
| `demo-ca.js` | Demo CA certificate + key |
| `tools/` | `make-demo-ca.mjs`, `e2e-node.mjs` (Node end-to-end check incl. tamper test) |
| `tests/` | Playwright suite (desktop + Pixel 7) and a GitHub-Pages-like server |

## Run and test

```bash
cd liberland-sign
npm install
npm start                 # http://localhost:3748/form/
npm test                  # OFFLINE=1 npm test skips the real-TSA test
npm run build:lib         # after editing lib/
```

## Deployment

`.github/workflows/deploy-pages.yml` copies this folder to `_site/form` (without `tests/`, `tools/`, `lib/`)
on pushes to `master`. Nothing else on the site changes.

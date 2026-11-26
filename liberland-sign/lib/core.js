// Liberland eSignature — cryptographic core.
//
// Everything that turns "a verified person with a phone" into "a standard PDF signature" lives here:
// X.509 certificates from the Liberland CA, the PDF signature placeholder, the CMS (PAdES/CAdES) container,
// the RFC 3161 timestamp and the verifier. It runs on WebCrypto in the browser and in Node 20+.
//
// Bundled for the page by `npm run build:lib` into vendor/sign-lib.js (global `LLSignLib`).

import * as asn1js from "asn1js";
import * as pkijs from "pkijs";
import {
  PDFDocument, PDFName, PDFHexString, PDFArray, PDFDict, PDFString, StandardFonts, rgb,
} from "pdf-lib";

const webcrypto = globalThis.crypto;
pkijs.setEngine("liberland", new pkijs.CryptoEngine({ name: "liberland", crypto: webcrypto }));

export const OID = {
  sha256: "2.16.840.1.101.3.4.2.1",
  ecdsaWithSHA256: "1.2.840.10045.4.3.2",
  data: "1.2.840.113549.1.7.1",
  signedData: "1.2.840.113549.1.7.2",
  contentType: "1.2.840.113549.1.9.3",
  messageDigest: "1.2.840.113549.1.9.4",
  signingCertificateV2: "1.2.840.113549.1.9.16.2.47",
  timeStampToken: "1.2.840.113549.1.9.16.2.14",
  tstInfo: "1.2.840.113549.1.9.16.1.4",
  commonName: "2.5.4.3",
  serialNumber: "2.5.4.5",
  organization: "2.5.4.10",
  organizationalUnit: "2.5.4.11",
  basicConstraints: "2.5.29.19",
  keyUsage: "2.5.29.15",
  subjectKeyIdentifier: "2.5.29.14",
  authorityKeyIdentifier: "2.5.29.35",
  certificatePolicies: "2.5.29.32",
};

/** Bytes reserved in the PDF for the signature container (certificates + timestamp fit comfortably). */
export const SIGNATURE_SPACE = 20000;
const BYTE_RANGE_PLACEHOLDER = "**********";

// ── small helpers ────────────────────────────────────────────

export const toHex = (buf) =>
  Array.from(new Uint8Array(buf), (b) => b.toString(16).padStart(2, "0")).join("");

export const fromHex = (hex) => {
  const clean = hex.replace(/[^0-9a-f]/gi, "");
  const out = new Uint8Array(clean.length / 2);
  for (let i = 0; i < out.length; i++) out[i] = parseInt(clean.substr(i * 2, 2), 16);
  return out;
};

export const toB64 = (buf) => {
  const u8 = new Uint8Array(buf);
  let s = "";
  for (let i = 0; i < u8.length; i += 0x8000) s += String.fromCharCode.apply(null, u8.subarray(i, i + 0x8000));
  return btoa(s);
};

export const fromB64 = (b64) => Uint8Array.from(atob(b64), (c) => c.charCodeAt(0));

export const sha256 = async (data) => new Uint8Array(await webcrypto.subtle.digest("SHA-256", data));

const latin1 = (u8) => {
  let s = "";
  for (let i = 0; i < u8.length; i += 0x8000) s += String.fromCharCode.apply(null, u8.subarray(i, i + 0x8000));
  return s;
};

const concat = (...parts) => {
  const out = new Uint8Array(parts.reduce((n, p) => n + p.length, 0));
  let o = 0;
  for (const p of parts) { out.set(p, o); o += p.length; }
  return out;
};

/** Raw P-256 signature (r||s, as WebCrypto and phone secure elements return it) → DER Ecdsa-Sig-Value. */
export function ecdsaRawToDer(raw) {
  const u8 = new Uint8Array(raw);
  const half = u8.length / 2;
  const int = (bytes) => {
    let i = 0;
    while (i < bytes.length - 1 && bytes[i] === 0) i++;
    let v = bytes.slice(i);
    if (v[0] & 0x80) v = concat(new Uint8Array([0]), v);
    return v;
  };
  const seq = new asn1js.Sequence({
    value: [
      new asn1js.Integer({ valueHex: int(u8.slice(0, half)) }),
      new asn1js.Integer({ valueHex: int(u8.slice(half)) }),
    ],
  });
  return new Uint8Array(seq.toBER());
}

/** DER Ecdsa-Sig-Value → raw r||s (P-256). */
function derToRaw(der) {
  const asn = asn1js.fromBER(der);
  const [r, s] = asn.result.valueBlock.value.map((i) => {
    let v = new Uint8Array(i.valueBlock.valueHexView);
    while (v.length > 32 && v[0] === 0) v = v.slice(1);
    const out = new Uint8Array(32);
    out.set(v, 32 - v.length);
    return out;
  });
  return concat(r, s);
}

const ECDSA = { name: "ECDSA", namedCurve: "P-256" };
const ECDSA_SIGN = { name: "ECDSA", hash: "SHA-256" };

/**
 * Step 2 — the phone creates its signing key. The private key is non-extractable: WebCrypto (like the
 * Secure Enclave / StrongBox on a real phone) can use it to sign but will never hand out its bytes.
 */
export function generateSigningKey() {
  return webcrypto.subtle.generateKey(ECDSA, false, ["sign", "verify"]);
}

export async function publicKeyFingerprint(publicKey) {
  const spki = await webcrypto.subtle.exportKey("spki", publicKey);
  return toHex(await sha256(spki));
}

export async function exportPublicKeySpki(publicKey) {
  return new Uint8Array(await webcrypto.subtle.exportKey("spki", publicKey));
}

export function importPublicKeySpki(spki) {
  return webcrypto.subtle.importKey("spki", spki, ECDSA, true, ["verify"]);
}

export function importPrivateJwk(jwk) {
  return webcrypto.subtle.importKey("jwk", jwk, ECDSA, false, ["sign"]);
}

// ── Step 3 — the Liberland certificate authority ──────────────

function rdn(pairs) {
  // One attribute per RDN (pkijs would otherwise put them all into a single multi-valued RDN).
  const seq = new asn1js.Sequence({
    value: pairs.map(([type, value]) => new asn1js.Set({
      value: [new pkijs.AttributeTypeAndValue({
        type,
        value: type === OID.serialNumber ? new asn1js.PrintableString({ value }) : new asn1js.Utf8String({ value }),
      }).toSchema()],
    })),
  });
  return pkijs.RelativeDistinguishedNames.fromBER(seq.toBER());
}

function keyUsageExtension(bits) {
  // bits: array of KeyUsage bit numbers (0 = digitalSignature, 1 = nonRepudiation, 5 = keyCertSign, 6 = cRLSign)
  let byte = 0;
  for (const b of bits) byte |= 0x80 >> b;
  const highest = Math.max(...bits);
  const unused = 7 - highest;
  return new pkijs.Extension({
    extnID: OID.keyUsage,
    critical: true,
    extnValue: new asn1js.BitString({ valueHex: new Uint8Array([byte]), unusedBits: unused }).toBER(),
  });
}

async function keyIdentifier(publicKey) {
  const spki = await webcrypto.subtle.exportKey("spki", publicKey);
  const parsed = pkijs.PublicKeyInfo.fromBER(spki);
  const digest = await webcrypto.subtle.digest("SHA-1", parsed.subjectPublicKey.valueBlock.valueHexView);
  return new Uint8Array(digest);
}

async function buildCertificate({ serial, issuer, subject, publicKey, signingKey, issuerKeyId, notBefore, notAfter, isCA, policyOid }) {
  const cert = new pkijs.Certificate();
  cert.version = 2;
  cert.serialNumber = new asn1js.Integer({ valueHex: serial });
  cert.issuer = issuer;
  cert.subject = subject;
  cert.notBefore.value = notBefore;
  cert.notAfter.value = notAfter;
  await cert.subjectPublicKeyInfo.importKey(publicKey);

  const ski = await keyIdentifier(publicKey);
  cert.extensions = [
    new pkijs.Extension({
      extnID: OID.basicConstraints,
      critical: true,
      extnValue: new pkijs.BasicConstraints({ cA: isCA }).toSchema().toBER(),
      parsedValue: new pkijs.BasicConstraints({ cA: isCA }),
    }),
    isCA ? keyUsageExtension([0, 5, 6]) : keyUsageExtension([0, 1]),
    new pkijs.Extension({
      extnID: OID.subjectKeyIdentifier,
      extnValue: new asn1js.OctetString({ valueHex: ski }).toBER(),
    }),
    new pkijs.Extension({
      extnID: OID.authorityKeyIdentifier,
      extnValue: new pkijs.AuthorityKeyIdentifier({
        keyIdentifier: new asn1js.OctetString({ valueHex: issuerKeyId || ski }),
      }).toSchema().toBER(),
    }),
  ];
  if (policyOid) {
    cert.extensions.push(new pkijs.Extension({
      extnID: OID.certificatePolicies,
      extnValue: new pkijs.CertificatePolicies({
        certificatePolicies: [new pkijs.PolicyInformation({ policyIdentifier: policyOid })],
      }).toSchema().toBER(),
    }));
  }
  await cert.sign(signingKey, "SHA-256");
  return new Uint8Array(cert.toSchema(true).toBER());
}

/** Creates a self-signed root for the CA (used once, by tools/make-demo-ca.mjs). */
export async function createRootCertificate({ keyPair, commonName, organization, years = 10 }) {
  const name = rdn([[OID.organization, organization], [OID.commonName, commonName]]);
  const now = new Date();
  const notAfter = new Date(now);
  notAfter.setFullYear(now.getFullYear() + years);
  const serial = webcrypto.getRandomValues(new Uint8Array(16));
  serial[0] &= 0x7f;
  return buildCertificate({
    serial, issuer: name, subject: name, publicKey: keyPair.publicKey, signingKey: keyPair.privateKey,
    notBefore: new Date(now.getTime() - 60_000), notAfter, isCA: true,
  });
}

/**
 * The CA issues "this key belongs to [verified name, Liberland ID]". It receives only the public key.
 * Returns { der, serialHex, notAfter }.
 */
export async function issueCitizenCertificate({ caCertDer, caPrivateKey, subjectPublicKey, fullName, liberlandId, days = 365, policyOid }) {
  const ca = pkijs.Certificate.fromBER(caCertDer);
  const caPublicKey = await ca.getPublicKey();
  const serial = webcrypto.getRandomValues(new Uint8Array(16));
  serial[0] = (serial[0] & 0x7f) | 0x01;
  const now = new Date();
  const notAfter = new Date(now.getTime() + days * 86400_000);
  const der = await buildCertificate({
    serial,
    issuer: ca.subject,
    subject: rdn([
      [OID.organization, "Liberland"],
      [OID.organizationalUnit, "KYC verified in the Liberland App"],
      [OID.serialNumber, liberlandId],
      [OID.commonName, fullName],
    ]),
    publicKey: subjectPublicKey,
    signingKey: caPrivateKey,
    issuerKeyId: await keyIdentifier(caPublicKey),
    notBefore: new Date(now.getTime() - 60_000),
    notAfter,
    isCA: false,
    policyOid,
  });
  return { der, serialHex: toHex(serial), notAfter };
}

const RDN_LABELS = {
  [OID.commonName]: "CN", [OID.serialNumber]: "serialNumber", [OID.organization]: "O",
  [OID.organizationalUnit]: "OU", "2.5.4.6": "C",
};

function readName(rdns) {
  const out = {};
  for (const tv of rdns.typesAndValues) out[RDN_LABELS[tv.type] || tv.type] = tv.value.valueBlock.value;
  return out;
}

export function describeCertificate(der) {
  const c = pkijs.Certificate.fromBER(der);
  return {
    subject: readName(c.subject),
    issuer: readName(c.issuer),
    serialHex: toHex(c.serialNumber.valueBlock.valueHexView),
    notBefore: c.notBefore.value,
    notAfter: c.notAfter.value,
  };
}

export function certificateToPem(der) {
  const b64 = toB64(der).replace(/(.{64})/g, "$1\n");
  return `-----BEGIN CERTIFICATE-----\n${b64}\n-----END CERTIFICATE-----\n`;
}

// ── Step 4 — xNotary prepares the PDF and computes its fingerprint ──

/** Helvetica (WinAnsi) cannot draw every character; keep the visible stamp readable. */
const stampText = (s) => s.normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/[^\x20-\x7e]/g, "?");

const fmtUtc = (d) => d.toISOString().replace("T", " ").replace(/\.\d+Z$/, " UTC");

/**
 * Adds a visible signature stamp and an empty signature field (a /Sig dictionary with a reserved
 * /Contents hole) to the PDF. Returns the prepared bytes, the /ByteRange and the SHA-256 of exactly
 * the bytes that the signature will cover — the document's fingerprint.
 */
export async function preparePdf(input, { fullName, liberlandId, signedAt = new Date(), reason, location = "Liberland", contact = "xNotary.digital" }) {
  const pdf = await PDFDocument.load(input, { updateMetadata: false });
  const pages = pdf.getPages();
  const page = pages[pages.length - 1];
  const { width } = page.getSize();
  const font = await pdf.embedFont(StandardFonts.Helvetica);
  const bold = await pdf.embedFont(StandardFonts.HelveticaBold);

  // Visible stamp, bottom-right of the last page.
  const w = 236, h = 66, x = Math.max(12, width - w - 28), y = 24;
  const teal = rgb(0.184, 0.353, 0.427); // Liberland blue #2f5a6d
  page.drawRectangle({ x, y, width: w, height: h, color: rgb(1, 1, 1), borderColor: teal, borderWidth: 0.8, opacity: 0.97 });
  page.drawRectangle({ x, y, width: 5, height: h, color: rgb(0.945, 0.784, 0.137) }); // Liberland yellow #f1c823
  page.drawText("DIGITALLY SIGNED · LIBERLAND IDENTITY", { x: x + 12, y: y + h - 15, size: 6.4, font: bold, color: teal });
  page.drawText(stampText(fullName).slice(0, 40), { x: x + 12, y: y + h - 30, size: 10.5, font: bold, color: rgb(0.08, 0.09, 0.1) });
  page.drawText(`Liberland ID ${stampText(liberlandId)}`.slice(0, 54), { x: x + 12, y: y + h - 42, size: 7, font, color: rgb(0.25, 0.27, 0.28) });
  page.drawText(fmtUtc(signedAt), { x: x + 12, y: y + h - 52, size: 7, font, color: rgb(0.25, 0.27, 0.28) });
  page.drawText("Verify: liberlandlimited.com/form/#verify", { x: x + 12, y: y + 7, size: 6.2, font, color: teal });

  const sig = pdf.context.obj({
    Type: "Sig",
    Filter: "Adobe.PPKLite",
    SubFilter: "ETSI.CAdES.detached",
    ByteRange: [0, PDFName.of(BYTE_RANGE_PLACEHOLDER), PDFName.of(BYTE_RANGE_PLACEHOLDER), PDFName.of(BYTE_RANGE_PLACEHOLDER)],
    Contents: PDFHexString.of("0".repeat(SIGNATURE_SPACE * 2)),
    Name: PDFHexString.fromText(fullName),
    Reason: PDFHexString.fromText(reason || `Signed with Liberland identity ${liberlandId}`),
    Location: PDFHexString.fromText(location),
    ContactInfo: PDFHexString.fromText(contact),
    M: PDFString.fromDate(signedAt),
    Prop_Build: { App: { Name: PDFName.of("xNotary.digital") } },
  });
  const sigRef = pdf.context.register(sig);

  const appearance = pdf.context.register(
    pdf.context.stream("", { Type: "XObject", Subtype: "Form", BBox: [0, 0, w, h] }),
  );
  const fieldName = `Liberland signature ${Date.now().toString(36)}`;
  const widget = pdf.context.obj({
    Type: "Annot", Subtype: "Widget", FT: "Sig", F: 132, // Print + Locked
    Rect: [x, y, x + w, y + h],
    V: sigRef,
    T: PDFHexString.fromText(fieldName),
    P: page.ref,
    AP: { N: appearance },
  });
  const widgetRef = pdf.context.register(widget);

  const annots = page.node.lookup(PDFName.of("Annots"));
  if (annots instanceof PDFArray) annots.push(widgetRef);
  else page.node.set(PDFName.of("Annots"), pdf.context.obj([widgetRef]));

  const acroForm = pdf.catalog.getOrCreateAcroForm();
  acroForm.addField(widgetRef);
  acroForm.dict.set(PDFName.of("SigFlags"), pdf.context.obj(3));

  const bytes = await pdf.save({ useObjectStreams: false, addDefaultPage: false, updateFieldAppearances: false });
  const text = latin1(bytes);

  const brPlaceholder = `/ByteRange [ 0 /${BYTE_RANGE_PLACEHOLDER} /${BYTE_RANGE_PLACEHOLDER} /${BYTE_RANGE_PLACEHOLDER} ]`;
  const brPos = text.indexOf(brPlaceholder);
  if (brPos < 0) throw new Error("Could not locate the signature placeholder in the prepared PDF.");
  const holeHex = `<${"0".repeat(SIGNATURE_SPACE * 2)}>`;
  const contentsStart = text.indexOf(holeHex);
  if (contentsStart < 0) throw new Error("Could not locate the signature hole in the prepared PDF.");
  const contentsEnd = contentsStart + holeHex.length;
  const byteRange = [0, contentsStart, contentsEnd, bytes.length - contentsEnd];

  let br = `/ByteRange [${byteRange.join(" ")}]`;
  if (br.length > brPlaceholder.length) throw new Error("ByteRange does not fit its placeholder.");
  br = br.padEnd(brPlaceholder.length, " ");
  for (let i = 0; i < br.length; i++) bytes[brPos + i] = br.charCodeAt(i);

  const covered = concat(bytes.subarray(0, byteRange[1]), bytes.subarray(byteRange[2]));
  const documentDigest = await sha256(covered);
  return { bytes, byteRange, documentDigest, pageCount: pages.length, fieldName };
}

// ── Step 5 — what the phone signs ─────────────────────────────

function attribute(type, value) {
  return new pkijs.Attribute({ type, values: [value] });
}

/**
 * CAdES signed attributes for the document digest. The phone signs their DER encoding (a SET OF
 * Attribute). Includes ESS signing-certificate-v2 so the signature is bound to the Liberland certificate.
 */
export async function buildSignedAttributes(documentDigest, signerCertDer) {
  const certHash = await sha256(signerCertDer);
  const essCertIdV2 = new asn1js.Sequence({ value: [new asn1js.OctetString({ valueHex: certHash })] });
  const signingCertificateV2 = new asn1js.Sequence({
    value: [new asn1js.Sequence({ value: [essCertIdV2] })],
  });
  const attrs = [
    attribute(OID.contentType, new asn1js.ObjectIdentifier({ value: OID.data })),
    attribute(OID.messageDigest, new asn1js.OctetString({ valueHex: documentDigest })),
    attribute(OID.signingCertificateV2, signingCertificateV2),
  ];
  // DER: SET OF sorted by encoding.
  const enc = (a) => new Uint8Array(a.toSchema().toBER());
  attrs.sort((a, b) => {
    const x = enc(a), y = enc(b);
    for (let i = 0; i < Math.min(x.length, y.length); i++) if (x[i] !== y[i]) return x[i] - y[i];
    return x.length - y.length;
  });
  const signedAttrs = new pkijs.SignedAndUnsignedAttributes({ type: 0, attributes: attrs });
  const toBeSigned = new Uint8Array(signedAttrs.toSchema().toBER());
  toBeSigned[0] = 0x31; // [0] IMPLICIT → SET for the signature input (RFC 5652 §5.4)
  return { signedAttrs, toBeSigned };
}

/** The phone: sign with the protected key after biometric approval. Returns a DER ECDSA signature. */
export async function signOnDevice(privateKey, toBeSigned) {
  const raw = await webcrypto.subtle.sign(ECDSA_SIGN, privateKey, toBeSigned);
  return ecdsaRawToDer(raw);
}

// ── Step 6 — xNotary assembles the CMS container and embeds it ──

/** Requests an RFC 3161 timestamp over the signature value. Returns the TimeStampToken (ContentInfo). */
export async function requestTimestamp(signatureValue, tsaUrl, fetchImpl = globalThis.fetch) {
  const imprint = await sha256(signatureValue);
  const nonce = webcrypto.getRandomValues(new Uint8Array(8));
  nonce[0] &= 0x7f;
  const req = new pkijs.TimeStampReq({
    version: 1,
    messageImprint: new pkijs.MessageImprint({
      hashAlgorithm: new pkijs.AlgorithmIdentifier({ algorithmId: OID.sha256 }),
      hashedMessage: new asn1js.OctetString({ valueHex: imprint }),
    }),
    nonce: new asn1js.Integer({ valueHex: nonce }),
    certReq: true,
  });
  const res = await fetchImpl(tsaUrl, {
    method: "POST",
    headers: { "Content-Type": "application/timestamp-query" },
    body: req.toSchema().toBER(),
  });
  if (!res.ok) throw new Error(`Timestamp authority answered ${res.status}`);
  const resp = pkijs.TimeStampResp.fromBER(await res.arrayBuffer());
  const status = resp.status.status;
  if ((status !== 0 && status !== 1) || !resp.timeStampToken) throw new Error(`Timestamp refused (status ${status})`);
  const info = readTstInfo(resp.timeStampToken);
  if (toHex(info.imprint) !== toHex(imprint)) throw new Error("Timestamp does not cover this signature");
  return { token: resp.timeStampToken, genTime: info.genTime, tsa: info.tsa };
}

function readTstInfo(tokenContentInfo) {
  const sd = new pkijs.SignedData({ schema: tokenContentInfo.content });
  const tst = pkijs.TSTInfo.fromBER(sd.encapContentInfo.eContent.valueBlock.valueHexView);
  let tsa = null;
  const signer = (sd.certificates || []).find((c) => c instanceof pkijs.Certificate &&
    sd.signerInfos[0].sid instanceof pkijs.IssuerAndSerialNumber &&
    toHex(c.serialNumber.valueBlock.valueHexView) === toHex(sd.signerInfos[0].sid.serialNumber.valueBlock.valueHexView));
  if (signer) tsa = readName(signer.subject).CN || readName(signer.subject).O || null;
  return { genTime: tst.genTime, imprint: tst.messageImprint.hashedMessage.valueBlock.valueHexView, tsa, sd };
}

export function assembleCms({ signedAttrs, signature, signerCertDer, chainDer = [], timestampToken = null }) {
  const signerCert = pkijs.Certificate.fromBER(signerCertDer);
  const signerInfo = new pkijs.SignerInfo({
    version: 1,
    sid: new pkijs.IssuerAndSerialNumber({ issuer: signerCert.issuer, serialNumber: signerCert.serialNumber }),
    digestAlgorithm: new pkijs.AlgorithmIdentifier({ algorithmId: OID.sha256 }),
    signedAttrs,
    signatureAlgorithm: new pkijs.AlgorithmIdentifier({ algorithmId: OID.ecdsaWithSHA256 }),
    signature: new asn1js.OctetString({ valueHex: signature }),
  });
  if (timestampToken) {
    signerInfo.unsignedAttrs = new pkijs.SignedAndUnsignedAttributes({
      type: 1,
      attributes: [new pkijs.Attribute({ type: OID.timeStampToken, values: [timestampToken.toSchema()] })],
    });
  }
  const sd = new pkijs.SignedData({
    version: 1,
    encapContentInfo: new pkijs.EncapsulatedContentInfo({ eContentType: OID.data }),
    digestAlgorithms: [new pkijs.AlgorithmIdentifier({ algorithmId: OID.sha256 })],
    certificates: [signerCert, ...chainDer.map((d) => pkijs.Certificate.fromBER(d))],
    signerInfos: [signerInfo],
  });
  const ci = new pkijs.ContentInfo({ contentType: OID.signedData, content: sd.toSchema(true) });
  return new Uint8Array(ci.toSchema().toBER());
}

export function embedSignature(prepared, cms) {
  const hex = toHex(cms);
  if (hex.length > SIGNATURE_SPACE * 2) throw new Error("Signature container is larger than the reserved space.");
  const out = new Uint8Array(prepared.bytes);
  const start = prepared.byteRange[1] + 1; // after "<"
  for (let i = 0; i < hex.length; i++) out[start + i] = hex.charCodeAt(i);
  return out;
}

// ── Anyone can verify ─────────────────────────────────────────

const parsePdfDate = (s) => {
  const m = /^D:(\d{4})(\d{2})(\d{2})(\d{2})(\d{2})(\d{2})/.exec(s || "");
  return m ? new Date(Date.UTC(+m[1], +m[2] - 1, +m[3], +m[4], +m[5], +m[6])) : null;
};

/**
 * Finds every signature in a PDF and checks it: integrity of the covered bytes, the signature itself,
 * whether the certificate chains to the Liberland CA, revocation, and the timestamp.
 */
export async function verifyPdf(input, { trustedCaDer, isRevoked = () => false } = {}) {
  const bytes = new Uint8Array(input);
  const text = latin1(bytes);
  const re = /\/ByteRange\s*\[\s*(\d+)\s+(\d+)\s+(\d+)\s+(\d+)\s*\]/g;
  const results = [];
  const trusted = trustedCaDer ? [pkijs.Certificate.fromBER(trustedCaDer)] : [];
  let m;
  while ((m = re.exec(text))) {
    const br = m.slice(1, 5).map(Number);
    const r = { byteRange: br, coversWholeFile: br[2] + br[3] === bytes.length, problems: [] };
    results.push(r);
    try {
      if (br[0] !== 0 || br[1] >= br[2] || br[2] + br[3] > bytes.length || text[br[1]] !== "<" || text[br[2] - 1] !== ">") {
        throw new Error("Malformed /ByteRange");
      }
      // Signature dictionary fields near the ByteRange (claimed signing time and name).
      const dictStart = text.lastIndexOf("<<", m.index);
      const dictText = text.slice(Math.max(0, dictStart), Math.min(text.length, br[2] + 2000)).replace(/\/Contents\s*<[0-9a-fA-F]*>/, "");
      const mm = /\/M\s*\((D:[^)]*)\)/.exec(dictText);
      r.claimedTime = mm ? parsePdfDate(mm[1]) : null;
      const sf = /\/SubFilter\s*\/([A-Za-z0-9.#]+)/.exec(dictText);
      r.subFilter = sf ? sf[1] : null;

      const cmsBytes = fromHex(text.slice(br[1] + 1, br[2] - 1));
      const asn = asn1js.fromBER(cmsBytes);
      if (asn.offset === -1) throw new Error("Signature container is not valid DER");
      const ci = new pkijs.ContentInfo({ schema: asn.result });
      if (ci.contentType !== OID.signedData) throw new Error("Not a CMS SignedData signature");
      const sd = new pkijs.SignedData({ schema: ci.content });
      const si = sd.signerInfos[0];

      const covered = concat(bytes.subarray(0, br[1]), bytes.subarray(br[2]));
      const digest = await sha256(covered);
      const mdAttr = si.signedAttrs?.attributes.find((a) => a.type === OID.messageDigest);
      r.documentIntact = !!mdAttr && toHex(mdAttr.values[0].valueBlock.valueHexView) === toHex(digest);

      let base;
      try {
        base = await sd.verify({ signer: 0, data: covered, extendedMode: true, checkChain: false });
      } catch (e) {
        base = { signatureVerified: false, signerCertificate: e && e.signerCertificate };
      }
      // Check the signature over the signed attributes on its own, so a changed document is reported
      // as "changed after signing" rather than as a forged signature.
      const cert = base.signerCertificate || (sd.certificates || []).find((c) => c instanceof pkijs.Certificate &&
        si.sid instanceof pkijs.IssuerAndSerialNumber &&
        toHex(c.serialNumber.valueBlock.valueHexView) === toHex(si.sid.serialNumber.valueBlock.valueHexView));
      if (cert && si.signedAttrs) {
        const tbs = new Uint8Array(si.signedAttrs.encodedValue);
        tbs[0] = 0x31;
        try {
          const pub = await cert.getPublicKey();
          const raw = derToRaw(si.signature.valueBlock.valueHexView);
          r.signatureValid = await webcrypto.subtle.verify(ECDSA_SIGN, pub, raw, tbs);
        } catch (e) {
          r.signatureValid = !!base.signatureVerified && r.documentIntact;
        }
      } else {
        r.signatureValid = !!base.signatureVerified;
      }
      if (cert) {
        r.signer = readName(cert.subject);
        r.issuer = readName(cert.issuer);
        r.certSerialHex = toHex(cert.serialNumber.valueBlock.valueHexView);
        r.certNotBefore = cert.notBefore.value;
        r.certNotAfter = cert.notAfter.value;
      }
      if (trusted.length) {
        try {
          const engine = new pkijs.CertificateChainValidationEngine({
            trustedCerts: trusted,
            certs: (sd.certificates || []).filter((c) => c instanceof pkijs.Certificate),
            checkDate: r.claimedTime || new Date(),
          });
          const chain = await engine.verify();
          r.issuedByLiberland = !!chain.result;
        } catch (e) {
          r.issuedByLiberland = false;
        }
      }
      r.revoked = r.certSerialHex ? !!isRevoked(r.certSerialHex) : false;

      const ts = si.unsignedAttrs?.attributes.find((a) => a.type === OID.timeStampToken);
      if (ts) {
        try {
          const token = new pkijs.ContentInfo({ schema: ts.values[0] });
          const info = readTstInfo(token);
          const imprint = await sha256(si.signature.valueBlock.valueHexView);
          const tsOk = await info.sd.verify({ signer: 0, data: si.signature.valueBlock.valueHexView, extendedMode: true, checkChain: false });
          r.timestamp = {
            time: info.genTime,
            tsa: info.tsa,
            coversSignature: toHex(info.imprint) === toHex(imprint),
            tsaSignatureValid: !!tsOk.signatureVerified,
          };
        } catch (e) {
          r.timestamp = { error: String(e.message || e) };
        }
      }
    } catch (e) {
      r.error = String(e.message || e);
    }
  }
  return results;
}

// ── A sample document for people without a PDF at hand ─────────

export async function createSamplePdf({ title = "Service Agreement", parties = ["Liberland Limited", "The Signatory"] } = {}) {
  const pdf = await PDFDocument.create();
  pdf.setTitle(title);
  pdf.setProducer("xNotary.digital demo");
  pdf.setCreator("liberlandlimited.com/form");
  const page = pdf.addPage([595.28, 841.89]);
  const serif = await pdf.embedFont(StandardFonts.TimesRoman);
  const serifBold = await pdf.embedFont(StandardFonts.TimesRomanBold);
  const sans = await pdf.embedFont(StandardFonts.Helvetica);
  const ink = rgb(0.08, 0.09, 0.1);
  const teal = rgb(0.184, 0.353, 0.427);
  let y = 770;
  page.drawText("SAMPLE DOCUMENT · FOR THE LIBERLAND eSIGNATURE DEMO", { x: 60, y, size: 8, font: sans, color: teal });
  y -= 36;
  page.drawText(title, { x: 60, y, size: 26, font: serifBold, color: ink });
  y -= 30;
  page.drawText(`Between ${parties[0]} and ${parties[1]}`, { x: 60, y, size: 12, font: serif, color: ink });
  y -= 34;
  const paras = [
    "1. Purpose. This sample agreement exists so that the Liberland eSignature flow can be tried end to end. It creates no obligations for anyone.",
    "2. Signature. The signatory signs with a key held in the Liberland App. The key is certified by the Liberland certificate authority after KYC, so the signature names a verified person.",
    "3. Integrity. Any change to this document after signing breaks the signature. Any PDF reader that supports digital signatures can confirm that.",
    "4. Time. When a timestamp is requested, an independent timestamp authority certifies when the signature existed.",
    "5. Revocation. The Liberland certificate authority can revoke a certificate at any time, for example when KYC lapses or a phone is lost.",
  ];
  const wrap = (text, max) => {
    const words = text.split(" ");
    const lines = [];
    let line = "";
    for (const w of words) {
      const t = line ? `${line} ${w}` : w;
      if (serif.widthOfTextAtSize(t, 11.5) > max) { lines.push(line); line = w; } else line = t;
    }
    if (line) lines.push(line);
    return lines;
  };
  for (const p of paras) {
    for (const line of wrap(p, 475)) { page.drawText(line, { x: 60, y, size: 11.5, font: serif, color: ink }); y -= 16; }
    y -= 10;
  }
  y -= 20;
  page.drawLine({ start: { x: 60, y }, end: { x: 260, y }, thickness: 0.6, color: ink });
  page.drawText("Signatory (signed digitally below)", { x: 60, y: y - 14, size: 9, font: sans, color: rgb(0.36, 0.38, 0.4) });
  return pdf.save();
}

export { asn1js, pkijs };

// End-to-end check in Node: sample PDF → key → certificate → sign → timestamp → embed → verify.
//   node tools/e2e-node.mjs <out-dir> [--no-tsa]
import { readFileSync, writeFileSync } from "node:fs";
import * as L from "../lib/core.js";

const outDir = process.argv[2] || ".";
const useTsa = !process.argv.includes("--no-tsa");
const caSrc = readFileSync(new URL("../demo-ca.js", import.meta.url), "utf8");
const CA = JSON.parse(caSrc.slice(caSrc.indexOf("{"), caSrc.lastIndexOf("}") + 1));
const caDer = L.fromB64(CA.certB64);
const caKey = await L.importPrivateJwk(CA.privateJwk);

const keys = await L.generateSigningKey();
const cert = await L.issueCitizenCertificate({ caCertDer: caDer, caPrivateKey: caKey, subjectPublicKey: keys.publicKey, fullName: "Jana Svobodová", liberlandId: "LL-2026-004711" });
writeFileSync(`${outDir}/citizen.cer`, cert.der);
writeFileSync(`${outDir}/ca.cer`, caDer);
const sample = await L.createSamplePdf();
writeFileSync(`${outDir}/sample.pdf`, sample);
const prep = await L.preparePdf(sample, { fullName: "Jana Svobodová", liberlandId: "LL-2026-004711" });
const { signedAttrs, toBeSigned } = await L.buildSignedAttributes(prep.documentDigest, cert.der);
const signature = await L.signOnDevice(keys.privateKey, toBeSigned);
let ts = null;
if (useTsa) ts = await L.requestTimestamp(signature, "https://rfc3161.ai.moda");
const cms = L.assembleCms({ signedAttrs, signature, signerCertDer: cert.der, chainDer: [caDer], timestampToken: ts?.token });
const signed = L.embedSignature(prep, cms);
writeFileSync(`${outDir}/signed.pdf`, signed);
console.log("cms bytes", cms.length, "ts", ts?.genTime, ts?.tsa);
const v = await L.verifyPdf(signed, { trustedCaDer: caDer });
console.log(JSON.stringify(v, null, 1));
const tampered = new Uint8Array(signed);
tampered[prep.byteRange[1] - 400] ^= 1; // flip one covered byte
const v2 = await L.verifyPdf(tampered, { trustedCaDer: caDer });
console.log("tampered intact:", v2[0].documentIntact, "sigValid:", v2[0].signatureValid);

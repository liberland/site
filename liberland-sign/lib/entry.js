// Bundle entry for vendor/sign-lib.js (global LLSignLib). Rebuild with `npm run build:lib`.
export * from "./core.js";
import qrcode from "qrcode-generator";

/** SVG markup for a QR code (error correction M). */
export function qrSvg(text, { cellSize = 4, margin = 2 } = {}) {
  const qr = qrcode(0, "M");
  qr.addData(text, "Byte");
  qr.make();
  return qr.createSvgTag({ cellSize, margin, scalable: true });
}

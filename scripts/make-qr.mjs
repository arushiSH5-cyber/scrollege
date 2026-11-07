// Makes the QR code that opens Scrollege on a phone.
//   node scripts/make-qr.mjs https://your-app.vercel.app
// Writes docs/qr.png (for the README) and public/qr.png (served by the app).
import QRCode from "qrcode";
import { mkdirSync } from "node:fs";
const url = process.argv[2];
if (!url || !/^https?:\/\//.test(url)) { console.error("Usage: node scripts/make-qr.mjs https://your-app.vercel.app"); process.exit(1); }
const opts = { width: 512, margin: 2, color: { dark: "#3b4252", light: "#ffffff" } };
mkdirSync("docs", { recursive: true });
await QRCode.toFile("docs/qr.png", url, opts);
await QRCode.toFile("public/qr.png", url, opts);
console.log("QR for", url, "-> docs/qr.png, public/qr.png");

// Renders Scrolly (from the mockup's SVG) to PNG app icons, on Scrollege's soft pink -> lilac -> mint gradient.
import sharp from "sharp";
import { mkdirSync } from "node:fs";
const INK = "#4a3f3a";
const rotty = `<path d="M40 20v-7" stroke="${INK}" stroke-width="2.4" stroke-linecap="round"/><path d="M40 15q-10-9-16-1q8 6 16 1z" fill="#bfe0cf" stroke="${INK}" stroke-width="2"/><path d="M12 50c0-19 12-30 28-30s28 11 28 30c0 13-11 20-28 20s-28-7-28-20z" fill="#fffaf0" stroke="${INK}" stroke-width="2.6"/><ellipse cx="24" cy="52" rx="5" ry="3.2" fill="#f3b9c6"/><ellipse cx="56" cy="52" rx="5" ry="3.2" fill="#f3b9c6"/><circle cx="32" cy="45" r="2.8" fill="${INK}"/><circle cx="48" cy="45" r="2.8" fill="${INK}"/><path d="M36 51q4 4 8 0" fill="none" stroke="${INK}" stroke-width="2.4" stroke-linecap="round"/>`;
// grid-paper background like the app
const grid = (n) => Array.from({ length: n }, (_, i) => `<path d="M${(i * 80) / n} 0V80M0 ${(i * 80) / n}H80" stroke="#ece5d6" stroke-width=".5"/>`).join("");
const svg = (pad, round) => `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 80 80" width="1024" height="1024">
  <defs><linearGradient id="g" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#ffe3ef"/><stop offset=".5" stop-color="#ece2ff"/><stop offset="1" stop-color="#d8f6e8"/></linearGradient></defs>
  <rect width="80" height="80" rx="${round}" fill="url(#g)"/>
  <g transform="translate(${pad} ${pad - 2}) scale(${(80 - pad * 2) / 80})">${rotty}</g></svg>`;
mkdirSync("public/icons", { recursive: true });
const out = [
  ["icon-192.png", 192, svg(4, 16)], ["icon-512.png", 512, svg(4, 16)],
  ["maskable-512.png", 512, svg(14, 0)], ["apple-touch-icon.png", 180, svg(8, 0)],
];
for (const [f, s, v] of out) await sharp(Buffer.from(v)).resize(s, s).png().toFile("public/icons/" + f);
console.log("icons ->", out.map((o) => o[0]).join(", "));

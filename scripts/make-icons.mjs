// Renders Scrolly (the app's own rotty() drawing, read straight from src/app.js) to PNG app icons,
// on the ☁️ Sky watercolor gradient.
import sharp from "sharp";
import { mkdirSync, readFileSync } from "node:fs";

const app = readFileSync("src/app.js", "utf8");
const ink = app.match(/const INK="([^"]+)";/)[1];
const start = app.indexOf("function rotty(");
const end = app.indexOf("\nfunction sq(", start);
const rotty = new Function("INK", app.slice(start, end) + ";return rotty;")(ink);
const inner = rotty("happy", 80).replace(/^<svg[^>]*>/, "").replace(/<\/svg>$/, "");

const svg = (pad, round) => `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 80 80" width="1024" height="1024">
  <defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#c9e4f6"/><stop offset="1" stop-color="#fff4d4"/></linearGradient></defs>
  <rect width="80" height="80" rx="${round}" fill="url(#g)"/>
  <g transform="translate(${pad} ${pad}) scale(${(80 - pad * 2) / 80})">${inner}</g></svg>`;

mkdirSync("public/icons", { recursive: true });
const out = [
  ["icon-192.png", 192, svg(4, 16)], ["icon-512.png", 512, svg(4, 16)],
  ["maskable-512.png", 512, svg(14, 0)], ["apple-touch-icon.png", 180, svg(8, 0)],
];
for (const [f, s, v] of out) await sharp(Buffer.from(v)).resize(s, s).png().toFile("public/icons/" + f);
console.log("icons ->", out.map((o) => o[0]).join(", "));

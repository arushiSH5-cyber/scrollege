// Writes tests/fixtures/three-pages.pdf: a real 3-page PDF with a text layer.
import { writeFileSync, mkdirSync } from "node:fs";
const pages = ["Cells are the basic unit of life.", "The nucleus holds the DNA of the cell.", "Mitochondria release energy from food."];
const objs = ["<< /Type /Catalog /Pages 2 0 R >>", `<< /Type /Pages /Kids [${pages.map((_, i) => `${3 + i * 2} 0 R`).join(" ")}] /Count ${pages.length} >>`];
pages.forEach((t, i) => {
  const s = `BT /F1 18 Tf 72 700 Td (${t.replace(/[()\\]/g, "\\$&")}) Tj ET`;
  objs.push(`<< /Type /Page /Parent 2 0 R /MediaBox [0 0 612 792] /Contents ${4 + i * 2} 0 R /Resources << /Font << /F1 ${3 + pages.length * 2} 0 R >> >> >>`);
  objs.push(`<< /Length ${s.length} >>\nstream\n${s}\nendstream`);
});
objs.push("<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>");
let out = "%PDF-1.4\n"; const offs = [];
objs.forEach((o, i) => { offs.push(out.length); out += `${i + 1} 0 obj\n${o}\nendobj\n`; });
const x = out.length;
out += `xref\n0 ${objs.length + 1}\n0000000000 65535 f \n` + offs.map((o) => String(o).padStart(10, "0") + " 00000 n \n").join("") +
  `trailer\n<< /Size ${objs.length + 1} /Root 1 0 R >>\nstartxref\n${x}\n%%EOF\n`;
mkdirSync("tests/fixtures", { recursive: true });
writeFileSync("tests/fixtures/three-pages.pdf", out, "latin1");
console.log("wrote tests/fixtures/three-pages.pdf");

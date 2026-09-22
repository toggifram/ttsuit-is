import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import path from "node:path";
import { PDFDocument, StandardFonts, rgb } from "pdf-lib";

const PILL = { x: 139.66, y: 376.27, w: 562.46, h: 128.14 };
const GREEN = rgb(4 / 255, 48 / 255, 52 / 255);
const templates = ["2500", "5000", "7500", "10000", "skyrta"];
const samples = {
  2500: "TTPRUF2500KODI",
  5000: "TTPRUF5000KODI",
  7500: "TTPRUF7500KODI",
  10000: "TTPRUF10000KOD",
  skyrta: "TTPRUFSKYRTAXX",
};

function display(code) {
  const compact = code.replace(/[\s-]+/g, "").toUpperCase();
  if (compact.startsWith("TT") && compact.length === 14) {
    return `${compact.slice(0, 2)}-${compact.slice(2, 6)}-${compact.slice(6, 10)}-${compact.slice(10)}`;
  }
  return compact.replace(/(.{4})/g, "$1-").replace(/-$/, "");
}

const outDir = process.argv[2] || "/tmp/gift-stamped";
mkdirSync(outDir, { recursive: true });

for (const template of templates) {
  const src = path.join(process.cwd(), "gift-cards/templates", `${template}.pdf`);
  const doc = await PDFDocument.load(readFileSync(src));
  const page = doc.getPages()[0];
  const font = await doc.embedFont(StandardFonts.TimesRoman);
  const label = display(samples[template]);
  let size = 32;
  while (size > 16 && font.widthOfTextAtSize(label, size) > PILL.w - 48) size -= 1;
  const tracking = 1.15;
  const width =
    font.widthOfTextAtSize(label, size) + tracking * Math.max(0, label.length - 1);
  let x = PILL.x + (PILL.w - width) / 2;
  const y = PILL.y + (PILL.h - size) / 2 + size * 0.12;
  for (const char of label) {
    page.drawText(char, { x, y, size, font, color: GREEN });
    x += font.widthOfTextAtSize(char, size) + tracking;
  }
  const dest = path.join(outDir, `${template}.pdf`);
  writeFileSync(dest, Buffer.from(await doc.save()));
  console.log(dest);
}

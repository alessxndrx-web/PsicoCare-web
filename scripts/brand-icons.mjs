// Regenerates raster icons from the official vector isotype (public/brand/isotype.svg). No redrawing:
// the SVG is rasterised as-is and centred on a square canvas. Run: node scripts/brand-icons.mjs
import sharp from "sharp";
import { readFileSync, writeFileSync } from "node:fs";
const svg = readFileSync("public/brand/isotype.svg");
async function square(size, { padding = 0.12, background = { r: 0, g: 0, b: 0, alpha: 0 } } = {}) {
  const inner = Math.round(size * (1 - padding * 2));
  const art = await sharp(svg, { density: 1200 }).resize(inner, inner, { fit: "contain", background: { r: 0, g: 0, b: 0, alpha: 0 } }).png().toBuffer();
  return sharp({ create: { width: size, height: size, channels: 4, background } }).composite([{ input: art, gravity: "center" }]).png().toBuffer();
}
const white = { r: 255, g: 255, b: 255, alpha: 1 };
writeFileSync("public/brand/psicocare-logo-512.png", await square(512, { padding: 0.08 }));
writeFileSync("app/apple-icon.png", await square(180, { padding: 0.14, background: white }));
writeFileSync("public/brand/icon-192.png", await square(192, { padding: 0.12, background: white }));
writeFileSync("public/brand/icon-512.png", await square(512, { padding: 0.12, background: white }));
// favicon.ico with PNG-encoded 16, 32 and 48 px entries (supported by every current browser).
const sizes = [16, 32, 48];
const images = await Promise.all(sizes.map(s => square(s, { padding: 0.04 })));
const header = Buffer.alloc(6); header.writeUInt16LE(0, 0); header.writeUInt16LE(1, 2); header.writeUInt16LE(sizes.length, 4);
let offset = 6 + 16 * sizes.length;
const entries = sizes.map((s, i) => { const e = Buffer.alloc(16); e.writeUInt8(s, 0); e.writeUInt8(s, 1); e.writeUInt16LE(1, 4); e.writeUInt16LE(32, 6); e.writeUInt32LE(images[i].length, 8); e.writeUInt32LE(offset, 12); offset += images[i].length; return e; });
writeFileSync("app/favicon.ico", Buffer.concat([header, ...entries, ...images]));
console.log("icons written");

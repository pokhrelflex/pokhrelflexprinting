import sharp from "sharp";
import { readdir, stat, mkdir } from "node:fs/promises";
import { existsSync } from "node:fs";
import { join, extname, basename } from "node:path";

const SRC_DIR = "frontend/public/Images";
const OUT_DIR = "frontend/public/Images-optimized";
const MAX_WIDTH = 1200;
const QUALITY = 80;

if (!existsSync(OUT_DIR)) await mkdir(OUT_DIR, { recursive: true });

const files = await readdir(SRC_DIR);
const targets = files.filter(f => /\.(jpe?g|png)$/i.test(f));

let totalBefore = 0;
let totalAfter = 0;

for (const file of targets) {
  const src = join(SRC_DIR, file);
  const before = (await stat(src)).size;
  totalBefore += before;

  const meta = await sharp(src).metadata();
  const targetWidth = meta.width && meta.width > MAX_WIDTH ? MAX_WIDTH : meta.width;
  const out = join(OUT_DIR, `${basename(file, extname(file))}.jpg`);

  await sharp(src)
    .resize({ width: targetWidth, withoutEnlargement: true })
    .jpeg({ quality: QUALITY, mozjpeg: true })
    .toFile(out);

  const after = (await stat(out)).size;
  totalAfter += after;
  const pct = Math.round((1 - after / before) * 100);
  console.log(`${file.padEnd(22)}  ${(before / 1024).toFixed(0).padStart(6)} KB → ${(after / 1024).toFixed(0).padStart(5)} KB  (-${pct}%)`);
}

console.log(`\nTotal: ${(totalBefore / 1024 / 1024).toFixed(1)} MB → ${(totalAfter / 1024 / 1024).toFixed(2)} MB`);
console.log(`Saved: ${((totalBefore - totalAfter) / 1024 / 1024).toFixed(1)} MB`);
console.log(`\nOptimized files written to: ${OUT_DIR}`);
console.log(`Stop the dev server, then run the swap script:`);
console.log(`  node scripts/swap-images.mjs`);

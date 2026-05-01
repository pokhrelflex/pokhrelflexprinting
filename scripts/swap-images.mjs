import { readdir, rename, unlink, rmdir, mkdir, copyFile, stat } from "node:fs/promises";
import { existsSync } from "node:fs";
import { join } from "node:path";

const SRC_DIR = "frontend/public/Images";
const OPT_DIR = "frontend/public/Images-optimized";
const BACKUP_DIR = "frontend/public/Images-original-backup";

if (!existsSync(OPT_DIR)) {
  console.error(`No optimized folder found at ${OPT_DIR}. Run resize-images.mjs first.`);
  process.exit(1);
}

// 1. Back up the originals
if (!existsSync(BACKUP_DIR)) {
  await mkdir(BACKUP_DIR, { recursive: true });
  const originals = await readdir(SRC_DIR);
  for (const f of originals) {
    await copyFile(join(SRC_DIR, f), join(BACKUP_DIR, f));
  }
  console.log(`Backed up originals to: ${BACKUP_DIR}`);
}

// 2. Delete tmp files in src (leftover from previous failed runs)
for (const f of await readdir(SRC_DIR)) {
  if (f.endsWith(".tmp.jpg")) {
    try { await unlink(join(SRC_DIR, f)); } catch (e) { console.warn(`Could not remove ${f}: ${e.code}`); }
  }
}

// 3. For each optimized file, replace its counterpart in Images
const optFiles = await readdir(OPT_DIR);
let replaced = 0;
for (const f of optFiles) {
  const dest = join(SRC_DIR, f);
  try {
    if (existsSync(dest)) await unlink(dest);
    await rename(join(OPT_DIR, f), dest);
    replaced++;
  } catch (e) {
    console.error(`FAILED: ${f} (${e.code}). Stop the dev server and re-run.`);
    process.exit(1);
  }
}

// 4. Remove now-empty optimized folder
try { await rmdir(OPT_DIR); } catch {}

console.log(`\nReplaced ${replaced} files.`);
console.log(`Originals saved at: ${BACKUP_DIR} (delete it once you've verified the site looks right).`);

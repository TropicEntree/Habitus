import sharp from "sharp";
import { mkdirSync } from "node:fs";
import path from "node:path";

const root = path.resolve(import.meta.dirname, "..");
const src = path.join(root, "public", "icons", "icon-source.jpg");
const outDir = path.join(root, "public", "icons");

mkdirSync(outDir, { recursive: true });

const sizes = [192, 512];

async function main() {
  // Canonical 1024x1024 PNG source, reused later by @capacitor/assets.
  await sharp(src).resize(1024, 1024).png().toFile(path.join(outDir, "icon-1024.png"));

  for (const size of sizes) {
    await sharp(src)
      .resize(size, size)
      .png()
      .toFile(path.join(outDir, `icon-${size}.png`));
  }

  // Maskable version: same art, safe-zone padding so platform masks don't clip it.
  for (const size of sizes) {
    const inner = Math.round(size * 0.8);
    await sharp(src)
      .resize(inner, inner)
      .extend({
        top: Math.round((size - inner) / 2),
        bottom: Math.round((size - inner) / 2),
        left: Math.round((size - inner) / 2),
        right: Math.round((size - inner) / 2),
        background: "#FFF9F5",
      })
      .png()
      .toFile(path.join(outDir, `icon-${size}-maskable.png`));
  }

  console.log("Icons generated in", outDir);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});

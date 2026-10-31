import sharp from "sharp";
import path from "node:path";

const root = path.resolve(import.meta.dirname, "..");
const resDir = path.join(root, "resources");
const bg = "#FFF9F5";

async function main() {
  // Solid background layer for the Android adaptive icon.
  await sharp({
    create: { width: 1024, height: 1024, channels: 4, background: bg },
  })
    .png()
    .toFile(path.join(resDir, "icon-background.png"));

  // Splash screen: app icon centered on the brand background, at the
  // 2732x2732 canvas Capacitor expects (scaled down for the other targets).
  const iconSize = 800;
  const icon = await sharp(path.join(resDir, "icon.png")).resize(iconSize, iconSize).toBuffer();
  await sharp({
    create: { width: 2732, height: 2732, channels: 4, background: bg },
  })
    .composite([{ input: icon, gravity: "center" }])
    .png()
    .toFile(path.join(resDir, "splash.png"));

  console.log("Capacitor resources generated in", resDir);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});

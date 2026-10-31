function hexToRgb(hex) {
  const h = hex.replace("#", "");
  const v = h.length === 3 ? h.split("").map((c) => c + c).join("") : h;
  const n = parseInt(v, 16);
  return { r: (n >> 16) & 255, g: (n >> 8) & 255, b: n & 255 };
}

function luminance({ r, g, b }) {
  const a = [r, g, b].map((v) => {
    v /= 255;
    return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
  });
  return 0.2126 * a[0] + 0.7152 * a[1] + 0.0722 * a[2];
}

/**
 * Given a background hex color, returns readable foreground/subtext HSL
 * component strings so internal text always stays visible on that background.
 */
export function autoContrast(bgHex) {
  try {
    const L = luminance(hexToRgb(bgHex));
    return L < 0.5
      ? { fg: "0 0% 98%", sub: "0 0% 72%" }
      : { fg: "222 47% 11%", sub: "222 16% 35%" };
  } catch (e) {
    return { fg: "0 0% 98%", sub: "0 0% 72%" };
  }
}

export default autoContrast;
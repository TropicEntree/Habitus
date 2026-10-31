export const PALETTES = [
  { id: "sakura", name: "Sakura", bg: "#FFF9F5", dark: "#241a22", accent: "#FFB4C6", emoji: "🌸" },
  { id: "menta", name: "Menta", bg: "#F0FAF4", dark: "#16201c", accent: "#9ED9B7", emoji: "🌿" },
  { id: "lilla", name: "Lilla", bg: "#F5F2FB", dark: "#1d1a2b", accent: "#B9A6E0", emoji: "🔮" },
  { id: "cielo", name: "Cielo", bg: "#F0F7FB", dark: "#16212a", accent: "#9BD0E6", emoji: "☁️" },
  { id: "terra", name: "Terra", bg: "#FBF1E8", dark: "#241c16", accent: "#E6B894", emoji: "🪵" },
];

function hexToHsl(hex) {
  const r = parseInt(hex.slice(1, 3), 16) / 255;
  const g = parseInt(hex.slice(3, 5), 16) / 255;
  const b = parseInt(hex.slice(5, 7), 16) / 255;
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h = 0;
  let s = 0;
  const l = (max + min) / 2;
  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r:
        h = (g - b) / d + (g < b ? 6 : 0);
        break;
      case g:
        h = (b - r) / d + 2;
        break;
      case b:
        h = (r - g) / d + 4;
        break;
    }
    h /= 6;
  }
  return `${Math.round(h * 360)} ${Math.round(s * 100)}% ${Math.round(l * 100)}%`;
}

export function paletteStyle(paletteId, isDark = false) {
  const p = PALETTES.find((x) => x.id === paletteId) || PALETTES[0];
  const bg = isDark ? p.dark : p.bg;
  return {
    "--background": hexToHsl(bg),
    "--primary": hexToHsl(p.accent),
    "--ring": hexToHsl(p.accent),
  };
}
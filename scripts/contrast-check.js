const fs = require("fs");
const path = require("path");

function clamp(v, min = 0, max = 1) {
  return Math.min(max, Math.max(min, v));
}

function hexToRgb(hex) {
  if (!hex) return null;
  hex = hex.trim();
  if (hex.startsWith("rgb")) {
    const nums = hex
      .replace(/rgba?\(|\)|\s/g, "")
      .split(",")
      .map(Number);
    return { r: nums[0], g: nums[1], b: nums[2] };
  }
  if (hex.startsWith("#")) hex = hex.slice(1);
  if (hex.length === 3)
    hex = hex
      .split("")
      .map((c) => c + c)
      .join("");
  if (hex.length !== 6) return null;
  return {
    r: parseInt(hex.slice(0, 2), 16),
    g: parseInt(hex.slice(2, 4), 16),
    b: parseInt(hex.slice(4, 6), 16),
  };
}

function rgbToHex({ r, g, b }) {
  return (
    "#" +
    [r, g, b].map((v) => Math.round(v).toString(16).padStart(2, "0")).join("")
  );
}

function lin(c) {
  c = c / 255;
  return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
}

function luminance(rgb) {
  return 0.2126 * lin(rgb.r) + 0.7152 * lin(rgb.g) + 0.0722 * lin(rgb.b);
}

function contrast(a, b) {
  const L1 = luminance(a);
  const L2 = luminance(b);
  const hi = Math.max(L1, L2),
    lo = Math.min(L1, L2);
  return (hi + 0.05) / (lo + 0.05);
}

function rgbToHsl({ r, g, b }) {
  r /= 255;
  g /= 255;
  b /= 255;
  const max = Math.max(r, g, b),
    min = Math.min(r, g, b);
  let h = 0,
    s = 0,
    l = (max + min) / 2;
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
  return { h: h * 360, s: s, l: l };
}

function hslToRgb(hsl) {
  let { h, s, l } = hsl;
  h /= 360;
  if (s === 0) {
    const v = l * 255;
    return { r: v, g: v, b: v };
  }
  function hue2rgb(p, q, t) {
    if (t < 0) t += 1;
    if (t > 1) t -= 1;
    if (t < 1 / 6) return p + (q - p) * 6 * t;
    if (t < 1 / 2) return q;
    if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
    return p;
  }
  const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
  const p = 2 * l - q;
  const r = hue2rgb(p, q, h + 1 / 3);
  const g = hue2rgb(p, q, h);
  const b = hue2rgb(p, q, h - 1 / 3);
  return {
    r: Math.round(r * 255),
    g: Math.round(g * 255),
    b: Math.round(b * 255),
  };
}

function darkenHex(hex, percent) {
  const rgb = hexToRgb(hex);
  if (!rgb) return null;
  const hsl = rgbToHsl(rgb);
  hsl.l = clamp(hsl.l - percent / 100, 0, 1);
  return rgbToHex(hslToRgb(hsl));
}

const themePath = path.join(__dirname, "../src/assets/json/theme.json");
const theme = JSON.parse(fs.readFileSync(themePath, "utf8"));

const white = { r: 255, g: 255, b: 255 };
const black = { r: 0, g: 0, b: 0 };

console.log("Color	Hex	WhiteContrast	BlackContrast	BestText	Pass(4.5)\tSuggestion");
for (const [name, vals] of Object.entries(theme)) {
  const raw = vals.primaryColor;
  const rgb = hexToRgb(raw);
  if (!rgb) {
    console.log(`${name}\tINVALID:${raw}\t-\t-\t-\t-\tCheck format`);
    continue;
  }
  const hex = rgbToHex(rgb);
  const wc = contrast(rgb, white).toFixed(2);
  const bc = contrast(rgb, black).toFixed(2);
  const wcN = Number(wc);
  const bcN = Number(bc);
  const bestText = wcN >= bcN ? "white" : "black";
  const passes = Math.max(wcN, bcN) >= 4.5;
  let suggestion = "";
  if (passes) {
    suggestion = `Use ${bestText}`;
  } else {
    // try darkening in steps to make white text pass
    let found = null;
    for (let p = 10; p <= 60; p += 10) {
      const d = darkenHex(hex, p);
      const rgb2 = hexToRgb(d);
      const c = contrast(rgb2, white);
      if (c >= 4.5) {
        found = { hex: d, steps: p, c: c.toFixed(2) };
        break;
      }
    }
    if (found)
      suggestion = `Darken to ${found.hex} (darker ${found.steps}%) to use white (c=${found.c})`;
    else {
      // try black text
      suggestion = `Use black text if c=${bc} >=4.5 else darken background by ~20%`;
    }
  }
  console.log(
    `${name}\t${hex}\t${wc}\t${bc}\t${bestText}\t${passes}\t${suggestion}`,
  );
}

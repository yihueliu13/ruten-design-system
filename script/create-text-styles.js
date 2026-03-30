// ============================================================
// 露天 Design System — 批次建立 130 個 Text Styles
//
// 中文 CH/PingFang TC: 21 sizes × 3 weights + 2 decoration = 65
// 英文 EN/SF Pro:      21 sizes × 3 weights + 2 decoration = 65
//
// 使用方式：Scripter plugin → 貼上 → Run
// ============================================================

// ── 定義 sizes ──
const sizes = [
  // Display
  { group: "Display 3XL", size: 64, lh: 77 },
  { group: "Display 2XL", size: 56, lh: 67 },
  { group: "Display XL",  size: 48, lh: 58 },
  { group: "Display LG",  size: 40, lh: 48 },
  { group: "Display MD",  size: 36, lh: 43 },
  { group: "Display SM",  size: 32, lh: 38 },
  // Headline
  { group: "Headline LG", size: 28, lh: 39 },
  { group: "Headline MD", size: 24, lh: 34 },
  { group: "Headline SM", size: 20, lh: 28 },
  // Title
  { group: "Title LG",    size: 18, lh: 25 },
  { group: "Title MD",    size: 16, lh: 22 },
  { group: "Title SM",    size: 14, lh: 20 },
  // Body
  { group: "Body LG",     size: 16, lh: 24 },
  { group: "Body MD",     size: 14, lh: 21 },
  { group: "Body MD-Alt", size: 13, lh: 20 },
  { group: "Body SM",     size: 12, lh: 17 },
  // Label
  { group: "Label LG",    size: 14, lh: 20 },
  { group: "Label MD",    size: 12, lh: 17 },
  { group: "Label SM",    size: 11, lh: 15 },
  { group: "Label XS",    size: 10, lh: 14 },
  { group: "Label 2XS",   size: 8,  lh: 11 },
];

// ── 定義 weights ──
const weights = [
  { label: "Regular",  chStyle: "Regular",  enStyle: "Regular"  },
  { label: "Medium",   chStyle: "Medium",   enStyle: "Medium"   },
  { label: "Bold",     chStyle: "Semibold", enStyle: "Bold"     },
];

// ── 定義 decoration styles ──
const decorations = [
  { label: "Strikethrough", size: 12, lh: 17, group: "Body SM", decoration: "STRIKETHROUGH" },
  { label: "Underline",     size: 14, lh: 21, group: "Body MD", decoration: "UNDERLINE" },
];

// ── 定義 fonts ──
const fonts = [
  { prefix: "CH", family: "PingFang TC", weightKey: "chStyle" },
  { prefix: "EN", family: "SF Pro Text", weightKey: "enStyle" },
];

// ── 組合所有 styles ──
const allStyles = [];

for (const font of fonts) {
  for (const s of sizes) {
    for (const w of weights) {
      allStyles.push({
        name: `${font.prefix}/${font.family}/${s.group}/${w.label}`,
        family: font.family,
        style: w[font.weightKey],
        size: s.size,
        lineHeight: { value: s.lh, unit: "PIXELS" },
        decoration: "NONE",
      });
    }
  }
  for (const d of decorations) {
    allStyles.push({
      name: `${font.prefix}/${font.family}/${d.group}/${d.label}`,
      family: font.family,
      style: "Regular",
      size: d.size,
      lineHeight: { value: d.lh, unit: "PIXELS" },
      decoration: d.decoration,
    });
  }
}

// ── 執行建立 ──
async function createTextStyles() {
  let created = 0;
  let skipped = 0;
  let errors = [];

  const existingStyles = figma.getLocalTextStyles();
  const existingNames = new Set(existingStyles.map(s => s.name));

  console.log(`📋 Total styles to create: ${allStyles.length}`);
  console.log(`📋 Existing styles: ${existingStyles.length}`);
  console.log("");

  for (const def of allStyles) {
    if (existingNames.has(def.name)) {
      skipped++;
      continue;
    }

    try {
      await figma.loadFontAsync({ family: def.family, style: def.style });

      const style = figma.createTextStyle();
      style.name = def.name;
      style.fontName = { family: def.family, style: def.style };
      style.fontSize = def.size;
      style.lineHeight = def.lineHeight;
      style.textDecoration = def.decoration;

      created++;
    } catch (err) {
      errors.push({ name: def.name, error: err.message });
    }
  }

  console.log(`${"=".repeat(50)}`);
  console.log(`✅ Created: ${created}`);
  console.log(`⏭️ Skipped (already exists): ${skipped}`);
  console.log(`❌ Errors: ${errors.length}`);
  console.log(`Total: ${created + skipped + errors.length} / ${allStyles.length}`);

  if (errors.length > 0) {
    console.log(`
❌ Failed styles:`);
    errors.forEach(e => console.log(`   ${e.name}: ${e.error}`));
    console.log(`
💡 Font not installed? PingFang TC = macOS built-in, SF Pro = developer.apple.com/fonts`);
  }

  figma.notify(`✅ ${created} created, ${skipped} skipped, ${errors.length} errors`);
}

createTextStyles();

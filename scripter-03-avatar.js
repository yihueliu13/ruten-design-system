// ============================================================
//  Figma Scripter — Avatar Component  (v2 — with cleanup & grid)
//  File: DS測試 (JntRm8aTeyw1HPdowgSBk4)
//  Collection: ruten
//
//  Creates:
//    Avatar ComponentSet — 12 variants (6 size × 2 active)
//
//  Run: Plugins → Scripter → paste → Run
// ============================================================

// ── 0. Cleanup old runs ──
for (const node of figma.currentPage.children) {
  if (node.type === "COMPONENT_SET" && node.name === "Avatar") {
    node.remove();
  }
}

// ── 1. Load Fonts ──
await figma.loadFontAsync({ family: "PingFang TC", style: "Medium" });

// ── 2. Variable Helpers ──
const ALL_VARS = figma.variables.getLocalVariables();
const _vm = new Map();
for (const v of ALL_VARS) _vm.set(v.name, v);
function V(name) { return _vm.get(name) || null; }

function bindColor(node, varName, fallback) {
  const v = V(varName);
  if (v) {
    node.fills = [figma.variables.setBoundVariableForPaint(
      { type: "SOLID", color: fallback }, "color", v
    )];
  } else {
    node.fills = [{ type: "SOLID", color: fallback }];
  }
}

function bindStroke(node, varName, fallback) {
  const v = V(varName);
  if (v) {
    node.strokes = [figma.variables.setBoundVariableForPaint(
      { type: "SOLID", color: fallback }, "color", v
    )];
  } else {
    node.strokes = [{ type: "SOLID", color: fallback }];
  }
}

function bp(node, field, varName) {
  const v = V(varName);
  if (!v) return;
  try { node.setBoundVariable(field, v); } catch (e) {
    console.warn("bind " + field + ": " + e.message);
  }
}

// Grid layout helper
function layoutGrid(set, cols, gapX, gapY, padX, padY) {
  const kids = [...set.children];
  let maxW = 0, maxH = 0;
  for (const k of kids) { maxW = Math.max(maxW, k.width); maxH = Math.max(maxH, k.height); }
  for (let i = 0; i < kids.length; i++) {
    const col = i % cols;
    const row = Math.floor(i / cols);
    kids[i].x = padX + col * (maxW + gapX);
    kids[i].y = padY + row * (maxH + gapY);
  }
  const totalCols = Math.min(kids.length, cols);
  const totalRows = Math.ceil(kids.length / cols);
  set.resize(
    padX * 2 + totalCols * maxW + (totalCols - 1) * gapX,
    padY * 2 + totalRows * maxH + (totalRows - 1) * gapY
  );
}

// ── 3. Fallback Colors ──
const C = {
  white:  { r: 1, g: 1,     b: 1 },
  orange: { r: 1, g: 0.588, b: 0.231 },
  grey:   { r: 0.85, g: 0.85, b: 0.85 },
};

// ── 4. Config ──
const SIZES = {
  xs:    { px: 24,  initFontSize: 10 },
  sm:    { px: 32,  initFontSize: 12 },
  md:    { px: 40,  initFontSize: 14 },
  lg:    { px: 48,  initFontSize: 16 },
  xl:    { px: 80,  initFontSize: 28 },
  "2xl": { px: 96,  initFontSize: 32 },
};

// ── 5. Build Avatar Variants ──
const variants = [];

for (const size of ["xs", "sm", "md", "lg", "xl", "2xl"]) {
  const sc = SIZES[size];
  const sizeVar = "comp/avatar/" + size + "/size";

  for (const active of [false, true]) {
    const comp = figma.createComponent();
    comp.name = "size=" + size + ", active=" + String(active);
    comp.resize(sc.px, sc.px);
    comp.clipsContent = true;

    // Circle
    comp.topLeftRadius = 9999;
    comp.topRightRadius = 9999;
    comp.bottomLeftRadius = 9999;
    comp.bottomRightRadius = 9999;
    bp(comp, "topLeftRadius",     "comp/avatar/border-radius");
    bp(comp, "topRightRadius",    "comp/avatar/border-radius");
    bp(comp, "bottomLeftRadius",  "comp/avatar/border-radius");
    bp(comp, "bottomRightRadius", "comp/avatar/border-radius");

    // Size binding
    bp(comp, "width",  sizeVar);
    bp(comp, "height", sizeVar);

    // Background fill
    bindColor(comp, "comp/avatar/background", C.white);

    // Auto Layout for centering
    comp.layoutMode = "HORIZONTAL";
    comp.primaryAxisAlignItems = "CENTER";
    comp.counterAxisAlignItems = "CENTER";
    comp.primaryAxisSizingMode = "FIXED";
    comp.counterAxisSizingMode = "FIXED";

    // Border (active state)
    if (active) {
      bindStroke(comp, "comp/avatar/active/border-color", C.orange);
      comp.strokeWeight = 2;
      comp.strokeAlign = "OUTSIDE";
      bp(comp, "strokeWeight", "comp/avatar/active/border-width");
    } else {
      comp.strokes = [];
      comp.strokeWeight = 0;
    }

    // --- Placeholder initial ---
    const initial = figma.createText();
    initial.name = "Initial";
    initial.fontName = { family: "PingFang TC", style: "Medium" };
    initial.fontSize = sc.initFontSize;
    initial.characters = "A";
    initial.textAutoResize = "WIDTH_AND_HEIGHT";
    initial.fills = [{ type: "SOLID", color: C.grey }];

    comp.appendChild(initial);

    variants.push(comp);
  }
}

// ── 6. Combine into ComponentSet + grid layout ──
const avatarSet = figma.combineAsVariants(variants, figma.currentPage);
avatarSet.name = "Avatar";
avatarSet.x = 1500;
avatarSet.y = 0;
layoutGrid(avatarSet, 2, 24, 24, 24, 24);  // 2 cols (active=false / active=true)

console.log("✅ Avatar: " + variants.length + " variants");
figma.notify("✅ Avatar (" + variants.length + " variants) created!");

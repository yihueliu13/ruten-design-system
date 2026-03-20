// ============================================================
//  Figma Scripter — Tab Item + Tab Bar  (v3 — cleanup + grid, no design changes)
//  File: DS測試 (JntRm8aTeyw1HPdowgSBk4)
//  Collection: ruten
//
//  Creates:
//    Tab Item ComponentSet — 12 variants (4 size × 3 state)
//    Tab Bar  ComponentSet —  2 variants (fixed / scrollable)
//
//  Run: Plugins → Scripter → paste → Run
// ============================================================

// ── 0. Aggressive Cleanup ──
const toRemove = [];
for (const node of figma.currentPage.children) {
  if (node.type === "COMPONENT_SET" && (node.name === "Tab Item" || node.name === "Tab Bar")) {
    toRemove.push(node);
  }
  if (node.type === "COMPONENT" && node.name.includes("size=") && node.name.includes("state=")) {
    toRemove.push(node);
  }
  if (node.type === "COMPONENT" && (node.name.includes("layout=fixed") || node.name.includes("layout=scrollable"))) {
    toRemove.push(node);
  }
}
for (const n of toRemove) n.remove();
console.log("🧹 Cleaned " + toRemove.length + " old nodes");

// ── 1. Load Fonts ──
await figma.loadFontAsync({ family: "PingFang TC", style: "Medium" });
await figma.loadFontAsync({ family: "PingFang TC", style: "Semibold" });

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
  orange:      { r: 1, g: 0.588, b: 0.231 },
  white:       { r: 1, g: 1,     b: 1 },
  grey:        { r: 0.6, g: 0.6, b: 0.6 },
  darkGrey:    { r: 0.2, g: 0.2, b: 0.2 },
  lightOrange: { r: 1, g: 0.96,  b: 0.92 },
  lightGrey:   { r: 0.96, g: 0.96, b: 0.96 },
  divider:     { r: 0.85, g: 0.85, b: 0.85 },
};

// ── 4. Config ──
const SIZES = {
  sm: { h: 32, ph: 12, pv: 4, fs: 12 },
  md: { h: 40, ph: 16, pv: 8, fs: 14 },
  lg: { h: 44, ph: 24, pv: 8, fs: 14 },
  xl: { h: 48, ph: 32, pv: 12, fs: 16 },
};

const STATES = {
  active:   { text: C.orange,   bg: C.lightOrange, ind: C.orange, font: "Semibold" },
  inactive: { text: C.grey,     bg: C.white,        ind: C.white,  font: "Medium" },
  hover:    { text: C.darkGrey, bg: C.lightGrey,    ind: C.white,  font: "Medium" },
};

const stateVarMap = {
  active:   { text: "comp/tab/active/text-color",   bg: "comp/tab/active/background",   ind: "comp/tab/active/indicator-color" },
  inactive: { text: "comp/tab/inactive/text-color",  bg: "comp/tab/inactive/background",  ind: "comp/tab/inactive/indicator-color" },
  hover:    { text: "comp/tab/hover/text-color",     bg: "comp/tab/hover/background",     ind: "comp/tab/inactive/indicator-color" },
};

// ── 5. Build Tab Item Variants ──
const variants = [];

for (const size of ["sm", "md", "lg", "xl"]) {
  const sc = SIZES[size];
  const pre = "comp/tab/" + size;

  for (const state of ["active", "inactive", "hover"]) {
    const st = STATES[state];
    const sv = stateVarMap[state];

    // --- Component (vertical stack, HUG + minHeight) ---
    const comp = figma.createComponent();
    comp.name = "size=" + size + ", state=" + state;
    comp.layoutMode = "VERTICAL";
    comp.primaryAxisSizingMode = "AUTO";   // hug
    comp.counterAxisSizingMode = "AUTO";   // hug width
    comp.primaryAxisAlignItems = "MIN";
    comp.counterAxisAlignItems = "MIN";
    comp.itemSpacing = 0;
    comp.minHeight = sc.h;
    bp(comp, "minHeight", pre + "/min-height");

    // Component background = state bg
    bindColor(comp, sv.bg, st.bg);

    // --- Content frame (horizontal, centered label) ---
    const content = figma.createFrame();
    content.name = "Content";
    content.layoutMode = "HORIZONTAL";
    content.primaryAxisAlignItems = "CENTER";
    content.counterAxisAlignItems = "CENTER";
    content.paddingLeft = sc.ph;
    content.paddingRight = sc.ph;
    content.paddingTop = sc.pv;
    content.paddingBottom = sc.pv;
    content.fills = [];

    bp(content, "paddingLeft",  pre + "/padding-h");
    bp(content, "paddingRight", pre + "/padding-h");
    bp(content, "paddingTop",   pre + "/padding-v");
    bp(content, "paddingBottom",pre + "/padding-v");

    // --- Label ---
    const label = figma.createText();
    label.name = "Label";
    label.fontName = { family: "PingFang TC", style: st.font };
    label.fontSize = sc.fs;
    label.characters = "Tab";
    label.textAutoResize = "WIDTH_AND_HEIGHT";
    bindColor(label, sv.text, st.text);

    content.appendChild(label);
    comp.appendChild(content);
    content.layoutSizingVertical = "FILL";
    content.layoutSizingHorizontal = "HUG";

    // --- Indicator (3px hardcoded) ---
    const indicator = figma.createRectangle();
    indicator.name = "Indicator";
    indicator.resize(60, 3);
    indicator.topLeftRadius = 1.5;
    indicator.topRightRadius = 1.5;
    indicator.bottomLeftRadius = 0;
    indicator.bottomRightRadius = 0;
    bindColor(indicator, sv.ind, st.ind);

    comp.appendChild(indicator);
    indicator.layoutSizingHorizontal = "FILL";

    // --- Divider (1px) ---
    const divider = figma.createRectangle();
    divider.name = "Divider";
    divider.resize(60, 1);
    bindColor(divider, "sys/color/outline-variant", C.divider);

    comp.appendChild(divider);
    divider.layoutSizingHorizontal = "FILL";

    variants.push(comp);
  }
}

// ── 6. Combine into ComponentSet + grid layout ──
const tabItemSet = figma.combineAsVariants(variants, figma.currentPage);
tabItemSet.name = "Tab Item";
tabItemSet.x = 0;
tabItemSet.y = 0;
layoutGrid(tabItemSet, 3, 20, 20, 20, 20);
console.log("✅ Tab Item: " + variants.length + " variants");

// ── 7. Build Tab Bar ──
const mdActive   = tabItemSet.children.find(c => c.name.includes("size=md") && c.name.includes("state=active"));
const mdInactive = tabItemSet.children.find(c => c.name.includes("size=md") && c.name.includes("state=inactive"));

const barVariants = [];

if (mdActive && mdInactive) {
  // --- Fixed layout ---
  const fixed = figma.createComponent();
  fixed.name = "layout=fixed";
  fixed.layoutMode = "HORIZONTAL";
  fixed.primaryAxisSizingMode = "FIXED";
  fixed.counterAxisSizingMode = "AUTO";
  fixed.resize(375, 40);
  fixed.itemSpacing = 0;
  fixed.fills = [];

  const a1 = mdActive.createInstance();
  fixed.appendChild(a1);
  a1.layoutSizingHorizontal = "FILL";
  for (let i = 0; i < 4; i++) {
    const inst = mdInactive.createInstance();
    fixed.appendChild(inst);
    inst.layoutSizingHorizontal = "FILL";
  }
  barVariants.push(fixed);

  // --- Scrollable layout ---
  const scroll = figma.createComponent();
  scroll.name = "layout=scrollable";
  scroll.layoutMode = "HORIZONTAL";
  scroll.primaryAxisSizingMode = "AUTO";
  scroll.counterAxisSizingMode = "AUTO";
  scroll.itemSpacing = 0;
  scroll.fills = [];
  scroll.clipsContent = true;

  const a2 = mdActive.createInstance();
  scroll.appendChild(a2);
  for (let i = 0; i < 4; i++) {
    const inst = mdInactive.createInstance();
    scroll.appendChild(inst);
  }
  barVariants.push(scroll);

  const tabBarSet = figma.combineAsVariants(barVariants, figma.currentPage);
  tabBarSet.name = "Tab Bar";
  tabBarSet.x = 0;
  tabBarSet.y = tabItemSet.height + 60;
  layoutGrid(tabBarSet, 1, 20, 20, 20, 20);
  console.log("✅ Tab Bar: " + barVariants.length + " variants");
}

figma.notify("✅ Tab Item (" + variants.length + ") + Tab Bar (" + barVariants.length + ") created!");

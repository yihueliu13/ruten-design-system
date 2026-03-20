// ============================================================
//  Figma Scripter — Button Component  (v2 — with cleanup & grid)
//  File: DS測試 (JntRm8aTeyw1HPdowgSBk4)
//  Collection: ruten
//
//  Creates:
//    Button ComponentSet — 32 variants
//    (4 role × 4 size × 2 form, state=default only)
//
//  Run: Plugins → Scripter → paste → Run
// ============================================================

// ── 0. Cleanup old runs ──
for (const node of figma.currentPage.children) {
  if (node.type === "COMPONENT_SET" && node.name === "Button") {
    node.remove();
  }
}

// ── 1. Load Fonts ──
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

function bindStroke(node, varName, fallback) {
  const v = V(varName);
  if (v) {
    node.strokes = [figma.variables.setBoundVariableForPaint(
      { type: "SOLID", color: fallback }, "color", v
    )];
  } else if (fallback) {
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
  orange:    { r: 1,    g: 0.588, b: 0.231 },
  white:     { r: 1,    g: 1,     b: 1 },
  darkGrey:  { r: 0.2,  g: 0.2,   b: 0.2 },
  grey:      { r: 0.6,  g: 0.6,   b: 0.6 },
  outline:   { r: 0.78, g: 0.78,  b: 0.78 },
  transparent: { r: 1,  g: 1,     b: 1 },
};

// ── 4. Config ──
const SIZES = {
  sm: { h: 32, ph: 8,  pv: 4,  fs: 12, icon: 16, gap: 4,  radius: 8 },
  md: { h: 40, ph: 16, pv: 8,  fs: 14, icon: 24, gap: 8,  radius: 8 },
  lg: { h: 48, ph: 24, pv: 12, fs: 14, icon: 24, gap: 8,  radius: 8 },
  xl: { h: 52, ph: 32, pv: 12, fs: 16, icon: 24, gap: 8,  radius: 8 },
};

const ROLES = {
  primary: {
    bg: C.orange,     text: C.white,    borderColor: null, borderWidth: 0,
    bgVar:     "comp/button/primary/default/background",
    textVar:   "comp/button/primary/default/text-color",
    borderVar: "comp/button/primary/default/border-color",
    bwVar:     null,
  },
  secondary: {
    bg: C.white,      text: C.orange,   borderColor: C.outline, borderWidth: 1,
    bgVar:     "comp/button/secondary/default/background",
    textVar:   "comp/button/secondary/default/text-color",
    borderVar: "comp/button/secondary/default/border-color",
    bwVar:     "comp/button/secondary/default/border-width",
  },
  tertiary: {
    bg: C.white,      text: C.orange,   borderColor: C.orange, borderWidth: 1,
    bgVar:     "comp/button/tertiary/default/background",
    textVar:   "comp/button/tertiary/default/text-color",
    borderVar: "comp/button/tertiary/default/border-color",
    bwVar:     "comp/button/tertiary/default/border-width",
  },
  ghost: {
    bg: C.transparent, text: C.orange,  borderColor: null, borderWidth: 0,
    bgVar:     "comp/button/ghost/default/background",
    textVar:   "comp/button/ghost/default/text-color",
    borderVar: null,
    bwVar:     null,
  },
};

// ── 5. Build Button Variants ──
const variants = [];
const missing = [];

for (const role of ["primary", "secondary", "tertiary", "ghost"]) {
  const rc = ROLES[role];

  for (const size of ["sm", "md", "lg", "xl"]) {
    const sc = SIZES[size];
    const pre = "comp/button/" + size;

    for (const form of ["label", "label-icon"]) {
      const comp = figma.createComponent();
      comp.name = "role=" + role + ", size=" + size + ", form=" + form;
      comp.layoutMode = "HORIZONTAL";
      comp.primaryAxisAlignItems = "CENTER";
      comp.counterAxisAlignItems = "CENTER";
      comp.primaryAxisSizingMode = "AUTO";
      comp.counterAxisSizingMode = "AUTO";
      comp.minHeight = sc.h;
      comp.paddingLeft = sc.ph;
      comp.paddingRight = sc.ph;
      comp.paddingTop = sc.pv;
      comp.paddingBottom = sc.pv;
      comp.itemSpacing = sc.gap;

      // Corner radius
      comp.topLeftRadius = sc.radius;
      comp.topRightRadius = sc.radius;
      comp.bottomLeftRadius = sc.radius;
      comp.bottomRightRadius = sc.radius;
      const brVar = V("comp/button/border-radius");
      if (brVar) {
        bp(comp, "topLeftRadius",     "comp/button/border-radius");
        bp(comp, "topRightRadius",    "comp/button/border-radius");
        bp(comp, "bottomLeftRadius",  "comp/button/border-radius");
        bp(comp, "bottomRightRadius", "comp/button/border-radius");
      }

      // Bind size props
      bp(comp, "minHeight",     pre + "/min-height");
      bp(comp, "paddingLeft",   pre + "/padding-h");
      bp(comp, "paddingRight",  pre + "/padding-h");
      bp(comp, "paddingTop",    pre + "/padding-v");
      bp(comp, "paddingBottom", pre + "/padding-v");
      bp(comp, "itemSpacing",   pre + "/gap");

      // Background
      bindColor(comp, rc.bgVar, rc.bg);

      // Ghost: set opacity to 0 for true transparency
      if (role === "ghost") {
        const fills = comp.fills;
        if (fills.length > 0) {
          const f = JSON.parse(JSON.stringify(fills[0]));
          f.opacity = 0;
          comp.fills = [f];
        }
      }

      // Border
      if (rc.borderColor) {
        if (rc.borderVar) bindStroke(comp, rc.borderVar, rc.borderColor);
        else comp.strokes = [{ type: "SOLID", color: rc.borderColor }];
        comp.strokeWeight = rc.borderWidth;
        comp.strokeAlign = "INSIDE";
        if (rc.bwVar) bp(comp, "strokeWeight", rc.bwVar);
      } else {
        comp.strokes = [];
        comp.strokeWeight = 0;
      }

      // Track missing Variables
      if (!V(rc.bgVar))   missing.push(rc.bgVar);
      if (!V(rc.textVar)) missing.push(rc.textVar);

      // --- Icon (visible only in label-icon form) ---
      const icon = figma.createFrame();
      icon.name = "Icon";
      icon.resize(sc.icon, sc.icon);
      icon.fills = [{ type: "SOLID", color: { r: 0.8, g: 0.8, b: 0.8 }, opacity: 0.5 }];
      icon.cornerRadius = 4;
      icon.visible = (form === "label-icon");
      bp(icon, "width",  pre + "/icon-size");
      bp(icon, "height", pre + "/icon-size");

      comp.appendChild(icon);

      // --- Label ---
      const label = figma.createText();
      label.name = "Label";
      label.fontName = { family: "PingFang TC", style: "Semibold" };
      label.fontSize = sc.fs;
      label.characters = "Button";
      label.textAutoResize = "WIDTH_AND_HEIGHT";
      bindColor(label, rc.textVar, rc.text);

      comp.appendChild(label);

      variants.push(comp);
    }
  }
}

// ── 6. Combine into ComponentSet + grid layout ──
const buttonSet = figma.combineAsVariants(variants, figma.currentPage);
buttonSet.name = "Button";
buttonSet.x = 600;
buttonSet.y = 0;
layoutGrid(buttonSet, 8, 16, 16, 20, 20);  // 8 cols (4 size × 2 form per role row)

// ── 7. Summary ──
const uniqueMissing = [...new Set(missing)];
console.log("✅ Button: " + variants.length + " variants");
if (uniqueMissing.length > 0) {
  console.warn("⚠️ Missing Variables (" + uniqueMissing.length + "):");
  uniqueMissing.forEach(m => console.warn("   " + m));
}

figma.notify("✅ Button (" + variants.length + " variants) created!" +
  (uniqueMissing.length > 0 ? " ⚠️ " + uniqueMissing.length + " missing vars" : ""));

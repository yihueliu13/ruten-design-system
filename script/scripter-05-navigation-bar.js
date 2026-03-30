// Scripter — NavigationBar Component Set
// 4 variants: surface=brand|default × layout=search|title
// Run in Figma > Plugins > Scripter on DS測試
// Prerequisites: ruten collection with comp/nav-bar/* Variables

const page = figma.currentPage;

// 1. Find ruten collection + variables
const collections = figma.variables.getLocalVariableCollections();
const ruten = collections.find(c => c.name === "ruten");
if (!ruten) { console.log("❌ No ruten collection"); }
const modeId = ruten.modes[0].modeId;

const allVars = figma.variables.getLocalVariables();
const V = {};
for (const v of allVars) V[v.name] = v;

// Helper: bind variable to a node property
function bind(node, prop, varName) {
  const v = V[varName];
  if (!v) { console.log("⚠️ Variable not found: " + varName); return; }
  node.setBoundVariable(prop, v);
}

// Helper: bind fill color to variable
function bindFill(node, varName) {
  const v = V[varName];
  if (!v) { console.log("⚠️ Variable not found: " + varName); return; }
  const fills = [figma.util.solidPaint("#000000")];
  node.fills = fills;
  node.fills[0].boundVariables = { color: { type: "VARIABLE_ALIAS", id: v.id } };
  // Workaround: re-set fills with binding
  const f = JSON.parse(JSON.stringify(node.fills));
  f[0].boundVariables = { color: { type: "VARIABLE_ALIAS", id: v.id } };
  node.fills = f;
}

// Helper: resolve variable value for initial setup
function getVal(varName) {
  const v = V[varName];
  if (!v) return 0;
  const val = v.valuesByMode[modeId];
  if (val && val.type === "VARIABLE_ALIAS") {
    const target = allVars.find(x => x.id === val.id);
    if (target) return target.valuesByMode[modeId];
  }
  return val;
}

// 2. Create variant frames
const variants = [
  { surface: "brand", layout: "search" },
  { surface: "brand", layout: "title" },
  { surface: "default", layout: "search" },
  { surface: "default", layout: "title" },
];

const componentFrames = [];

for (const { surface, layout } of variants) {
  const isBrand = surface === "brand";
  const isSearch = layout === "search";

  // Create component
  const comp = figma.createComponent();
  comp.name = `surface=${surface}, layout=${layout}`;
  comp.resize(375, 48);

  // Auto Layout: horizontal, center aligned
  comp.layoutMode = "HORIZONTAL";
  comp.primaryAxisAlignItems = "SPACE_BETWEEN";
  comp.counterAxisAlignItems = "CENTER";
  comp.paddingLeft = 16;
  comp.paddingRight = 16;
  comp.paddingTop = 0;
  comp.paddingBottom = 0;
  comp.itemSpacing = 12;

  // Background fill
  const bgColor = isBrand ? { r: 1, g: 0.588, b: 0.231 } : { r: 1, g: 1, b: 1 };
  comp.fills = [{ type: "SOLID", color: bgColor }];

  // Bind background variable
  const bgVar = isBrand ? "comp/nav-bar/background" : "comp/nav-bar/background-default";
  const bgV = V[bgVar];
  if (bgV) {
    const paint = figma.util.solidPaint(isBrand ? "#FF963B" : "#FFFFFF");
    paint.boundVariables = { color: { type: "VARIABLE_ALIAS", id: bgV.id } };
    comp.fills = [paint];
  }

  // --- leftSlot: icon frame ---
  const leftSlot = figma.createFrame();
  leftSlot.name = "leftSlot";
  leftSlot.resize(24, 24);
  leftSlot.fills = [];
  leftSlot.layoutAlign = "INHERIT";
  leftSlot.layoutSizingHorizontal = "FIXED";
  leftSlot.layoutSizingVertical = "FIXED";
  comp.appendChild(leftSlot);

  // Placeholder rectangle for icon
  const iconRect = figma.createRectangle();
  iconRect.name = isSearch ? "menu-icon" : "back-arrow";
  iconRect.resize(24, 24);
  const iconColor = isBrand ? { r: 1, g: 1, b: 1 } : { r: 0.2, g: 0.2, b: 0.22 };
  iconRect.fills = [{ type: "SOLID", color: iconColor }];
  iconRect.opacity = 0.3; // placeholder indicator
  leftSlot.appendChild(iconRect);

  // --- centerSlot ---
  if (isSearch) {
    // SearchBar placeholder frame
    const searchFrame = figma.createFrame();
    searchFrame.name = "SearchBar";
    searchFrame.resize(200, 32);
    searchFrame.cornerRadius = 9999;
    searchFrame.fills = [{ type: "SOLID", color: { r: 1, g: 1, b: 1 } }];
    searchFrame.strokes = [{ type: "SOLID", color: { r: 0.922, g: 0.925, b: 0.953 } }];
    searchFrame.strokeWeight = 1;
    searchFrame.layoutMode = "HORIZONTAL";
    searchFrame.counterAxisAlignItems = "CENTER";
    searchFrame.paddingLeft = 8;
    searchFrame.paddingRight = 8;
    searchFrame.itemSpacing = 6;
    searchFrame.layoutAlign = "STRETCH";
    searchFrame.layoutGrow = 1;
    searchFrame.layoutSizingVertical = "FIXED";

    // Search text placeholder
    const searchText = figma.createText();
    searchText.name = "placeholder";
    await figma.loadFontAsync({ family: "Inter", style: "Regular" });
    searchText.fontName = { family: "Inter", style: "Regular" };
    searchText.characters = "搜尋商品";
    searchText.fontSize = 14;
    searchText.fills = [{ type: "SOLID", color: { r: 0.6, g: 0.6, b: 0.63 } }];
    searchText.layoutAlign = "INHERIT";
    searchText.layoutGrow = 1;
    searchFrame.appendChild(searchText);

    comp.appendChild(searchFrame);
  } else {
    // Title text
    const titleText = figma.createText();
    titleText.name = "title";
    await figma.loadFontAsync({ family: "Inter", style: "Semi Bold" });
    titleText.fontName = { family: "Inter", style: "Semi Bold" };
    titleText.characters = "頁面標題";
    titleText.fontSize = 16;
    const titleColor = isBrand ? { r: 1, g: 1, b: 1 } : { r: 0.2, g: 0.2, b: 0.22 };
    titleText.fills = [{ type: "SOLID", color: titleColor }];
    titleText.textAlignHorizontal = "CENTER";
    titleText.layoutAlign = "INHERIT";
    titleText.layoutGrow = 1;

    // Bind title color
    const titleColorVar = isBrand ? "comp/nav-bar/title-color" : "comp/nav-bar/title-color-default";
    const tcV = V[titleColorVar];
    if (tcV) {
      const p = figma.util.solidPaint(isBrand ? "#FFFFFF" : "#33343B");
      p.boundVariables = { color: { type: "VARIABLE_ALIAS", id: tcV.id } };
      titleText.fills = [p];
    }

    comp.appendChild(titleText);
  }

  // --- rightSlot: icons frame ---
  const rightSlot = figma.createFrame();
  rightSlot.name = "rightSlot";
  rightSlot.layoutMode = "HORIZONTAL";
  rightSlot.counterAxisAlignItems = "CENTER";
  rightSlot.itemSpacing = 12;
  rightSlot.fills = [];
  rightSlot.layoutSizingHorizontal = "HUG";
  rightSlot.layoutSizingVertical = "HUG";

  // 2 placeholder icons
  for (let i = 0; i < 2; i++) {
    const iconR = figma.createRectangle();
    iconR.name = "action-icon-" + (i + 1);
    iconR.resize(24, 24);
    iconR.fills = [{ type: "SOLID", color: iconColor }];
    iconR.opacity = 0.3;
    rightSlot.appendChild(iconR);
  }

  comp.appendChild(rightSlot);

  componentFrames.push(comp);
  console.log("✅ Created: surface=" + surface + ", layout=" + layout);
}

// 3. Combine into Component Set
const componentSet = figma.combineAsVariants(componentFrames, page);
componentSet.name = "NavigationBar";
componentSet.layoutMode = "VERTICAL";
componentSet.itemSpacing = 24;
componentSet.paddingTop = 24;
componentSet.paddingBottom = 24;
componentSet.paddingLeft = 24;
componentSet.paddingRight = 24;

console.log("✅ NavigationBar Component Set created with 4 variants");
console.log("⚠️ Next: replace placeholder rectangles with real Icon instances + bind remaining Variables manually");

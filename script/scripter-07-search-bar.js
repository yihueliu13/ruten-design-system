// Scripter — SearchBar Component Set
// 2 variants: state=default|focus
// Run in Figma > Plugins > Scripter on DS測試
// Prerequisites: ruten collection with comp/search-bar/* Variables

const page = figma.currentPage;

// 1. Find ruten collection + variables
const collections = figma.variables.getLocalVariableCollections();
const ruten = collections.find(c => c.name === "ruten");
if (!ruten) { console.log("❌ No ruten collection"); }
const modeId = ruten.modes[0].modeId;

const allVars = figma.variables.getLocalVariables();
const V = {};
for (const v of allVars) V[v.name] = v;

// Helper: bind fill color to variable
function bindFill(node, varName) {
  const v = V[varName];
  if (!v) { console.log("⚠️ Variable not found: " + varName); return; }
  const paint = figma.util.solidPaint("#000000");
  paint.boundVariables = { color: { type: "VARIABLE_ALIAS", id: v.id } };
  node.fills = [paint];
}

// Helper: bind stroke color to variable
function bindStroke(node, varName) {
  const v = V[varName];
  if (!v) { console.log("⚠️ Variable not found: " + varName); return; }
  const stroke = figma.util.solidPaint("#000000");
  stroke.boundVariables = { color: { type: "VARIABLE_ALIAS", id: v.id } };
  node.strokes = [stroke];
}

// Helper: bind numeric property
function bind(node, prop, varName) {
  const v = V[varName];
  if (!v) { console.log("⚠️ Variable not found: " + varName); return; }
  node.setBoundVariable(prop, v);
}

// 2. Create variant frames
const states = ["default", "focus"];
const componentFrames = [];

for (const state of states) {
  const isFocus = state === "focus";

  // Create component
  const comp = figma.createComponent();
  comp.name = `state=${state}`;
  comp.resize(280, 32);

  // Auto Layout: horizontal, center aligned
  comp.layoutMode = "HORIZONTAL";
  comp.primaryAxisAlignItems = "MIN";
  comp.counterAxisAlignItems = "CENTER";
  comp.paddingLeft = 16;
  comp.paddingRight = 16;
  comp.paddingTop = 0;
  comp.paddingBottom = 0;
  comp.itemSpacing = 12;

  // Background: white
  const bgPaint = figma.util.solidPaint("#FFFFFF");
  const bgV = V["comp/search-bar/background"];
  if (bgV) {
    bgPaint.boundVariables = { color: { type: "VARIABLE_ALIAS", id: bgV.id } };
  }
  comp.fills = [bgPaint];

  // Border: pill shape
  comp.cornerRadius = 9999;
  bind(comp, "cornerRadius", "comp/search-bar/border-radius");

  // Stroke
  const borderColor = isFocus ? "#FF963B" : "#EBEBF3";
  const borderVar = isFocus ? "comp/search-bar/focus/border-color" : "comp/search-bar/border-color";
  const borderWidth = isFocus ? 2 : 1;
  const borderWidthVar = isFocus ? "comp/search-bar/focus/border-width" : "comp/search-bar/border-width";

  const strokePaint = figma.util.solidPaint(borderColor);
  const sV = V[borderVar];
  if (sV) {
    strokePaint.boundVariables = { color: { type: "VARIABLE_ALIAS", id: sV.id } };
  }
  comp.strokes = [strokePaint];
  comp.strokeWeight = borderWidth;
  bind(comp, "strokeWeight", borderWidthVar);

  // Bind layout properties
  bind(comp, "minHeight", "comp/search-bar/height");
  bind(comp, "paddingLeft", "comp/search-bar/padding-h");
  bind(comp, "paddingRight", "comp/search-bar/padding-h");
  bind(comp, "itemSpacing", "comp/search-bar/icon-gap");

  // --- Search icon placeholder ---
  const iconFrame = figma.createFrame();
  iconFrame.name = "search-icon";
  iconFrame.resize(24, 24);
  iconFrame.fills = [];
  iconFrame.layoutSizingHorizontal = "FIXED";
  iconFrame.layoutSizingVertical = "FIXED";
  comp.appendChild(iconFrame);

  const iconRect = figma.createRectangle();
  iconRect.name = "icon-placeholder";
  iconRect.resize(24, 24);
  iconRect.fills = [{ type: "SOLID", color: { r: 0.6, g: 0.6, b: 0.63 } }];
  iconRect.opacity = 0.3;
  iconFrame.appendChild(iconRect);

  // Bind icon size
  bind(iconFrame, "minWidth", "comp/search-bar/icon-size");
  bind(iconFrame, "minHeight", "comp/search-bar/icon-size");

  // --- Placeholder text ---
  const placeholderText = figma.createText();
  placeholderText.name = "placeholder";
  await figma.loadFontAsync({ family: "Inter", style: "Regular" });
  placeholderText.fontName = { family: "Inter", style: "Regular" };
  placeholderText.characters = "搜尋商品";
  placeholderText.fontSize = 14;

  // Bind placeholder color
  bindFill(placeholderText, "comp/search-bar/placeholder-color");

  // Bind font properties
  bind(placeholderText, "fontSize", "comp/search-bar/font-size");
  bind(placeholderText, "fontWeight", "comp/search-bar/font-weight");

  placeholderText.layoutAlign = "INHERIT";
  placeholderText.layoutGrow = 1;
  comp.appendChild(placeholderText);

  // Set component sizing
  comp.layoutSizingHorizontal = "FILL";
  comp.layoutSizingVertical = "FIXED";

  componentFrames.push(comp);
  console.log("✅ Created: state=" + state);
}

// 3. Combine into Component Set
const componentSet = figma.combineAsVariants(componentFrames, page);
componentSet.name = "SearchBar";
componentSet.layoutMode = "VERTICAL";
componentSet.itemSpacing = 24;
componentSet.paddingTop = 24;
componentSet.paddingBottom = 24;
componentSet.paddingLeft = 24;
componentSet.paddingRight = 24;

console.log("✅ SearchBar Component Set created with 2 variants");
console.log("⚠️ Next: replace icon-placeholder with real Search icon instance");

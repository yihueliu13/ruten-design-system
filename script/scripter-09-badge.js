// Scripter — Badge Component Set
// 2 variants: type=dot|count
// Run in Figma > Plugins > Scripter on DS測試
// Prerequisites: ruten collection with comp/badge/* Variables

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

// Helper: bind numeric property
function bind(node, prop, varName) {
  const v = V[varName];
  if (!v) { console.log("⚠️ Variable not found: " + varName); return; }
  node.setBoundVariable(prop, v);
}

// Helper: resolve variable value
function getVal(varName) {
  const v = V[varName];
  if (!v) return 0;
  const val = v.valuesByMode[modeId];
  if (val && val.type === "VARIABLE_ALIAS") {
    const target = allVars.find(x => x.id === val.id);
    if (target) {
      const tVal = target.valuesByMode[modeId];
      if (tVal && tVal.type === "VARIABLE_ALIAS") {
        const t2 = allVars.find(x => x.id === tVal.id);
        if (t2) return t2.valuesByMode[modeId];
      }
      return tVal;
    }
  }
  return val;
}

const componentFrames = [];

// === type=dot ===
(() => {
  const comp = figma.createComponent();
  comp.name = "type=dot";
  comp.resize(8, 8);
  comp.cornerRadius = 9999;

  // Red dot fill
  comp.fills = [{ type: "SOLID", color: { r: 0.937, g: 0.267, b: 0.267 } }]; // error red
  bindFill(comp, "comp/badge/dot/color");

  // Bind size
  bind(comp, "width", "comp/badge/dot/size");
  bind(comp, "height", "comp/badge/dot/size");

  componentFrames.push(comp);
  console.log("✅ Created: type=dot");
})();

// === type=count ===
(async () => {
  const comp = figma.createComponent();
  comp.name = "type=count";
  comp.resize(16, 16);
  comp.cornerRadius = 9999;

  // Red background
  comp.fills = [{ type: "SOLID", color: { r: 0.937, g: 0.267, b: 0.267 } }];
  bindFill(comp, "comp/badge/count/background");

  // Bind border-radius
  bind(comp, "bottomLeftRadius", "comp/badge/count/border-radius");
  bind(comp, "bottomRightRadius", "comp/badge/count/border-radius");
  bind(comp, "topLeftRadius", "comp/badge/count/border-radius");
  bind(comp, "topRightRadius", "comp/badge/count/border-radius");

  // Bind min size
  bind(comp, "minWidth", "comp/badge/count/min-size");
  bind(comp, "minHeight", "comp/badge/count/min-size");

  // Auto layout: center content
  comp.layoutMode = "HORIZONTAL";
  comp.primaryAxisAlignItems = "CENTER";
  comp.counterAxisAlignItems = "CENTER";
  comp.layoutSizingHorizontal = "HUG";
  comp.layoutSizingVertical = "HUG";
  comp.paddingLeft = 4;
  comp.paddingRight = 4;
  comp.paddingTop = 0;
  comp.paddingBottom = 0;

  // Bind padding-h
  bind(comp, "paddingLeft", "comp/badge/count/padding-h");
  bind(comp, "paddingRight", "comp/badge/count/padding-h");

  // Count text
  await figma.loadFontAsync({ family: "Inter", style: "Semi Bold" });
  const text = figma.createText();
  text.name = "count";
  text.fontName = { family: "Inter", style: "Semi Bold" };
  text.characters = "1";
  text.fontSize = 8;
  text.textAlignHorizontal = "CENTER";
  text.textAlignVertical = "CENTER";

  // White text
  text.fills = [{ type: "SOLID", color: { r: 1, g: 1, b: 1 } }];
  bindFill(text, "comp/badge/count/text-color");

  // Bind font-size
  bind(text, "fontSize", "comp/badge/count/font-size");

  // Bind font-weight — note: fontWeight binding uses setBoundVariable
  bind(text, "fontWeight", "comp/badge/count/font-weight");

  comp.appendChild(text);
  componentFrames.push(comp);
  console.log("✅ Created: type=count");

  // 3. Combine into Component Set
  const componentSet = figma.combineAsVariants(componentFrames, page);
  componentSet.name = "Badge";
  componentSet.layoutMode = "HORIZONTAL";
  componentSet.itemSpacing = 24;
  componentSet.paddingTop = 24;
  componentSet.paddingBottom = 24;
  componentSet.paddingLeft = 24;
  componentSet.paddingRight = 24;

  console.log("✅ Badge Component Set created with 2 variants (dot, count)");
  console.log("ℹ️ offset-x/offset-y (-4px) are positioning tokens — apply when Badge is placed on parent element via absolute positioning or constraints");
})();

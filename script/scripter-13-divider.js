// Scripter — Divider Component Set
// 3 variants: weight=hairline|default|heavy
// Run in Figma > Plugins > Scripter on DS測試
// Prerequisites: ruten collection with comp/divider/* Variables

const page = figma.currentPage;

// 1. Find ruten collection + variables
const collections = figma.variables.getLocalVariableCollections();
const ruten = collections.find(c => c.name === "ruten");
if (!ruten) { console.log("❌ No ruten collection"); }
const modeId = ruten.modes[0].modeId;

const allVars = figma.variables.getLocalVariables();
const V = {};
for (const v of allVars) V[v.name] = v;

// Helpers
function bindFill(node, varName) {
  const v = V[varName];
  if (!v) { console.log("⚠️ Variable not found: " + varName); return; }
  const paint = figma.util.solidPaint("#000000");
  paint.boundVariables = { color: { type: "VARIABLE_ALIAS", id: v.id } };
  node.fills = [paint];
}

function bind(node, prop, varName) {
  const v = V[varName];
  if (!v) { console.log("⚠️ Variable not found: " + varName); return; }
  node.setBoundVariable(prop, v);
}

const componentFrames = [];

const weights = [
  { name: "hairline", thickness: 0.5, thicknessVar: "comp/divider/thickness-hairline" },
  { name: "default",  thickness: 1,   thicknessVar: "comp/divider/thickness-default" },
  { name: "heavy",    thickness: 2,   thicknessVar: "comp/divider/thickness-heavy" },
];

for (const { name, thickness, thicknessVar } of weights) {
  // Create component: full-width horizontal line
  const comp = figma.createComponent();
  comp.name = `weight=${name}`;
  comp.resize(375, thickness);

  // Horizontal line — use fills for color
  comp.fills = [{ type: "SOLID", color: { r: 0.922, g: 0.925, b: 0.953 } }]; // outline-variant
  bindFill(comp, "comp/divider/color");

  // Bind height to thickness
  bind(comp, "height", thicknessVar);

  // Layout: stretch horizontally
  comp.layoutMode = "HORIZONTAL";
  comp.layoutSizingHorizontal = "FILL";
  comp.counterAxisSizingMode = "FIXED";

  componentFrames.push(comp);
  console.log("✅ Created: weight=" + name + " (" + thickness + "px)");
}

// Combine into Component Set
const componentSet = figma.combineAsVariants(componentFrames, page);
componentSet.name = "Divider";
componentSet.layoutMode = "VERTICAL";
componentSet.itemSpacing = 24;
componentSet.paddingTop = 24;
componentSet.paddingBottom = 24;
componentSet.paddingLeft = 24;
componentSet.paddingRight = 24;

console.log("✅ Divider Component Set created with 3 variants (hairline/default/heavy)");
console.log("ℹ️ spacing token (8px) is for margin above/below — apply on parent container, not on Divider itself");

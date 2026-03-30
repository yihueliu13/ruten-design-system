// Scripter — Banner Component (Container)
// 1 component — content is Pattern-level (no comp/ tokens for content)
// Run in Figma > Plugins > Scripter on DS測試
// Prerequisites: ruten collection with comp/banner/* Variables

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

// Create component
const comp = figma.createComponent();
comp.name = "Banner";
comp.resize(343, 160); // typical banner aspect ratio

// Auto Layout: vertical, center content
comp.layoutMode = "VERTICAL";
comp.primaryAxisAlignItems = "CENTER";
comp.counterAxisAlignItems = "CENTER";
comp.paddingLeft = 16;
comp.paddingRight = 16;
comp.paddingTop = 16;
comp.paddingBottom = 16;

// White background + rounded corners
comp.fills = [{ type: "SOLID", color: { r: 1, g: 1, b: 1 } }];
bindFill(comp, "comp/banner/background");

comp.cornerRadius = 12;
bind(comp, "topLeftRadius", "comp/banner/border-radius");
bind(comp, "topRightRadius", "comp/banner/border-radius");
bind(comp, "bottomLeftRadius", "comp/banner/border-radius");
bind(comp, "bottomRightRadius", "comp/banner/border-radius");

// Bind padding
bind(comp, "paddingLeft", "comp/banner/padding");
bind(comp, "paddingRight", "comp/banner/padding");
bind(comp, "paddingTop", "comp/banner/padding");
bind(comp, "paddingBottom", "comp/banner/padding");

// Bind min-height
bind(comp, "minHeight", "comp/banner/min-height");

// Content slot placeholder
const contentSlot = figma.createFrame();
contentSlot.name = "contentSlot";
contentSlot.resize(311, 128);
contentSlot.fills = [{ type: "SOLID", color: { r: 0.96, g: 0.96, b: 0.97 } }];
contentSlot.layoutAlign = "STRETCH";
contentSlot.layoutSizingHorizontal = "FILL";
contentSlot.layoutGrow = 1;
contentSlot.cornerRadius = 8;
contentSlot.opacity = 0.5;
comp.appendChild(contentSlot);

// Position on page
comp.x = 0;
comp.y = 0;

console.log("✅ Banner container component created (4 tokens bound)");
console.log("ℹ️ For full-bleed image banners: set padding=0, fill contentSlot with image");
console.log("⚠️ Next: replace contentSlot with actual banner image or promotional content");

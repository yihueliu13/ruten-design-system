// Scripter — SectionModule Component
// 1 component (no variants — it's a layout container with slots)
// Structure: [topCap] [SectionHeader slot] [gap] [contentSlot A] [gap] [contentSlot B] [gap] [footerSlot] [bottomCap]
// Run in Figma > Plugins > Scripter on DS測試
// Prerequisites: ruten collection with comp/section-module/* Variables

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

(async () => {
  await figma.loadFontAsync({ family: "Inter", style: "Semi Bold" });
  await figma.loadFontAsync({ family: "Inter", style: "Regular" });

  // Create component
  const comp = figma.createComponent();
  comp.name = "SectionModule";
  comp.resize(375, 300);

  // Auto Layout: vertical
  comp.layoutMode = "VERTICAL";
  comp.primaryAxisSizingMode = "AUTO"; // hug content
  comp.counterAxisSizingMode = "FIXED";
  comp.paddingLeft = 16;
  comp.paddingRight = 16;
  comp.paddingTop = 0;
  comp.paddingBottom = 0;
  comp.itemSpacing = 0; // gaps managed per section

  // White background with rounded corners
  comp.fills = [{ type: "SOLID", color: { r: 1, g: 1, b: 1 } }];
  bindFill(comp, "comp/section-module/background");

  comp.cornerRadius = 16;
  bind(comp, "topLeftRadius", "comp/section-module/border-radius");
  bind(comp, "topRightRadius", "comp/section-module/border-radius");
  bind(comp, "bottomLeftRadius", "comp/section-module/border-radius");
  bind(comp, "bottomRightRadius", "comp/section-module/border-radius");

  // Bind padding-h
  bind(comp, "paddingLeft", "comp/section-module/padding-h");
  bind(comp, "paddingRight", "comp/section-module/padding-h");

  // --- topCap (decorative spacing) ---
  const topCap = figma.createFrame();
  topCap.name = "topCap";
  topCap.resize(343, 16);
  topCap.fills = [];
  topCap.layoutAlign = "STRETCH";
  topCap.layoutSizingHorizontal = "FILL";
  topCap.layoutSizingVertical = "FIXED";
  bind(topCap, "height", "comp/section-module/cap-height");
  comp.appendChild(topCap);

  // --- SectionHeader slot ---
  const headerSlot = figma.createFrame();
  headerSlot.name = "headerSlot";
  headerSlot.resize(343, 24);
  headerSlot.fills = [];
  headerSlot.layoutAlign = "STRETCH";
  headerSlot.layoutSizingHorizontal = "FILL";
  headerSlot.layoutSizingVertical = "HUG";

  // Placeholder text
  const headerText = figma.createText();
  headerText.name = "header-placeholder";
  headerText.fontName = { family: "Inter", style: "Semi Bold" };
  headerText.characters = "SectionHeader Slot";
  headerText.fontSize = 14;
  headerText.fills = [{ type: "SOLID", color: { r: 0.6, g: 0.6, b: 0.63 } }];
  headerSlot.layoutMode = "HORIZONTAL";
  headerSlot.appendChild(headerText);
  comp.appendChild(headerSlot);

  // --- gap: header to content ---
  const gapHC = figma.createFrame();
  gapHC.name = "gap-header-to-content";
  gapHC.resize(343, 16);
  gapHC.fills = [];
  gapHC.layoutAlign = "STRETCH";
  gapHC.layoutSizingHorizontal = "FILL";
  gapHC.layoutSizingVertical = "FIXED";
  bind(gapHC, "height", "comp/section-module/gap-header-to-content");
  comp.appendChild(gapHC);

  // --- contentSlot A (filter / tabs) ---
  const slotA = figma.createFrame();
  slotA.name = "contentSlot-A";
  slotA.resize(343, 40);
  slotA.fills = [{ type: "SOLID", color: { r: 0.96, g: 0.96, b: 0.97 } }];
  slotA.layoutAlign = "STRETCH";
  slotA.layoutSizingHorizontal = "FILL";
  slotA.layoutSizingVertical = "FIXED";
  slotA.opacity = 0.5;
  comp.appendChild(slotA);

  // --- gap: between slots ---
  const gapSlots = figma.createFrame();
  gapSlots.name = "gap-between-slots";
  gapSlots.resize(343, 16);
  gapSlots.fills = [];
  gapSlots.layoutAlign = "STRETCH";
  gapSlots.layoutSizingHorizontal = "FILL";
  gapSlots.layoutSizingVertical = "FIXED";
  bind(gapSlots, "height", "comp/section-module/gap-between-slots");
  comp.appendChild(gapSlots);

  // --- contentSlot B (main content) ---
  const slotB = figma.createFrame();
  slotB.name = "contentSlot-B";
  slotB.resize(343, 120);
  slotB.fills = [{ type: "SOLID", color: { r: 0.96, g: 0.96, b: 0.97 } }];
  slotB.layoutAlign = "STRETCH";
  slotB.layoutSizingHorizontal = "FILL";
  slotB.layoutSizingVertical = "FIXED";
  slotB.opacity = 0.5;
  comp.appendChild(slotB);

  // --- gap: content to footer ---
  const gapCF = figma.createFrame();
  gapCF.name = "gap-content-to-footer";
  gapCF.resize(343, 24);
  gapCF.fills = [];
  gapCF.layoutAlign = "STRETCH";
  gapCF.layoutSizingHorizontal = "FILL";
  gapCF.layoutSizingVertical = "FIXED";
  bind(gapCF, "height", "comp/section-module/gap-content-to-footer");
  comp.appendChild(gapCF);

  // --- footerSlot ---
  const footerSlot = figma.createFrame();
  footerSlot.name = "footerSlot";
  footerSlot.resize(343, 32);
  footerSlot.fills = [];
  footerSlot.layoutAlign = "STRETCH";
  footerSlot.layoutSizingHorizontal = "FILL";
  footerSlot.layoutSizingVertical = "HUG";
  footerSlot.layoutMode = "HORIZONTAL";
  footerSlot.primaryAxisAlignItems = "CENTER";

  const footerText = figma.createText();
  footerText.name = "footer-placeholder";
  footerText.fontName = { family: "Inter", style: "Regular" };
  footerText.characters = "Footer Action Slot";
  footerText.fontSize = 12;
  footerText.fills = [{ type: "SOLID", color: { r: 0.6, g: 0.6, b: 0.63 } }];
  footerSlot.appendChild(footerText);
  comp.appendChild(footerSlot);

  // --- bottomCap (decorative spacing) ---
  const bottomCap = figma.createFrame();
  bottomCap.name = "bottomCap";
  bottomCap.resize(343, 16);
  bottomCap.fills = [];
  bottomCap.layoutAlign = "STRETCH";
  bottomCap.layoutSizingHorizontal = "FILL";
  bottomCap.layoutSizingVertical = "FIXED";
  bind(bottomCap, "height", "comp/section-module/cap-height");
  comp.appendChild(bottomCap);

  // Position on page
  comp.x = 0;
  comp.y = 0;

  console.log("✅ SectionModule component created");
  console.log("ℹ️ Structure: topCap → headerSlot → contentSlot-A → contentSlot-B → footerSlot → bottomCap");
  console.log("⚠️ Next: swap headerSlot with real SectionHeader instance, replace contentSlots with actual content");
})();

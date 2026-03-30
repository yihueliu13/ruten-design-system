// Scripter — BottomNav Component Set
// 5 variants: active=home|category|center|message|profile
// Run in Figma > Plugins > Scripter on DS測試
// Prerequisites: ruten collection with comp/bottom-nav/* Variables

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

// Tab definitions
const tabs = [
  { id: "home", label: "首頁" },
  { id: "category", label: "分類" },
  { id: "center", label: "" },       // center button, no label
  { id: "message", label: "訊息" },
  { id: "profile", label: "我的" },
];

// 2. Create variant frames
const componentFrames = [];

for (const activeTab of tabs) {
  // Create component
  const comp = figma.createComponent();
  comp.name = `active=${activeTab.id}`;
  comp.resize(375, 80);

  // Auto Layout: horizontal, top aligned (items align from top with padding)
  comp.layoutMode = "HORIZONTAL";
  comp.primaryAxisAlignItems = "SPACE_BETWEEN";
  comp.counterAxisAlignItems = "MIN";
  comp.paddingLeft = 0;
  comp.paddingRight = 0;
  comp.paddingTop = 24;
  comp.paddingBottom = 0;
  comp.itemSpacing = 0;

  // Background: dark surface (neutral/900 ≈ #1A1A2E)
  const bgPaint = figma.util.solidPaint("#1A1A2E");
  const bgV = V["comp/bottom-nav/background"];
  if (bgV) {
    bgPaint.boundVariables = { color: { type: "VARIABLE_ALIAS", id: bgV.id } };
  }
  comp.fills = [bgPaint];

  // Top corner radius: 16px
  comp.topLeftRadius = 16;
  comp.topRightRadius = 16;
  comp.bottomLeftRadius = 0;
  comp.bottomRightRadius = 0;
  bind(comp, "topLeftRadius", "comp/bottom-nav/border-radius");
  bind(comp, "topRightRadius", "comp/bottom-nav/border-radius");

  // Bind layout props
  bind(comp, "minHeight", "comp/bottom-nav/height");
  bind(comp, "paddingTop", "comp/bottom-nav/padding-top");

  // --- Build tab items ---
  for (const tab of tabs) {
    const isActive = tab.id === activeTab.id;
    const isCenter = tab.id === "center";

    if (isCenter) {
      // Center button: circle, brand orange
      const centerBtn = figma.createFrame();
      centerBtn.name = "center-button";
      centerBtn.resize(40, 40);
      centerBtn.cornerRadius = 9999;
      centerBtn.layoutAlign = "INHERIT";
      centerBtn.layoutSizingHorizontal = "FIXED";
      centerBtn.layoutSizingVertical = "FIXED";

      // Orange background
      const centerPaint = figma.util.solidPaint("#FF963B");
      const centerBgV = V["comp/bottom-nav/center-button/background"];
      if (centerBgV) {
        centerPaint.boundVariables = { color: { type: "VARIABLE_ALIAS", id: centerBgV.id } };
      }
      centerBtn.fills = [centerPaint];

      // Bind size + radius
      bind(centerBtn, "minWidth", "comp/bottom-nav/center-button/size");
      bind(centerBtn, "minHeight", "comp/bottom-nav/center-button/size");
      bind(centerBtn, "cornerRadius", "comp/bottom-nav/center-button/border-radius");

      // Plus icon placeholder (white)
      const plusIcon = figma.createRectangle();
      plusIcon.name = "plus-icon";
      plusIcon.resize(24, 24);
      plusIcon.fills = [{ type: "SOLID", color: { r: 1, g: 1, b: 1 } }];
      plusIcon.opacity = 0.5;
      plusIcon.constraints = { horizontal: "CENTER", vertical: "CENTER" };
      centerBtn.appendChild(plusIcon);

      // Wrap in a container that matches tab item width for even spacing
      const centerWrap = figma.createFrame();
      centerWrap.name = "tab-center";
      centerWrap.layoutMode = "VERTICAL";
      centerWrap.primaryAxisAlignItems = "CENTER";
      centerWrap.counterAxisAlignItems = "CENTER";
      centerWrap.fills = [];
      centerWrap.layoutAlign = "STRETCH";
      centerWrap.layoutGrow = 1;
      centerWrap.layoutSizingVertical = "HUG";
      centerWrap.appendChild(centerBtn);

      comp.appendChild(centerWrap);
    } else {
      // Regular tab item: icon + gap + label
      const tabFrame = figma.createFrame();
      tabFrame.name = "tab-" + tab.id;
      tabFrame.layoutMode = "VERTICAL";
      tabFrame.primaryAxisAlignItems = "CENTER";
      tabFrame.counterAxisAlignItems = "CENTER";
      tabFrame.itemSpacing = 4;
      tabFrame.fills = [];
      tabFrame.layoutAlign = "STRETCH";
      tabFrame.layoutGrow = 1;
      tabFrame.layoutSizingVertical = "HUG";

      // Bind icon-text gap
      bind(tabFrame, "itemSpacing", "comp/bottom-nav/item/icon-text-gap");

      // Icon placeholder
      const iconFrame = figma.createFrame();
      iconFrame.name = "icon";
      iconFrame.resize(24, 24);
      iconFrame.fills = [];
      iconFrame.layoutSizingHorizontal = "FIXED";
      iconFrame.layoutSizingVertical = "FIXED";
      tabFrame.appendChild(iconFrame);

      const iconRect = figma.createRectangle();
      iconRect.name = "icon-placeholder";
      iconRect.resize(24, 24);
      // Active: brand orange, inactive: light orange
      const iconColor = isActive
        ? { r: 1, g: 0.588, b: 0.231 }   // brand orange
        : { r: 1, g: 0.78, b: 0.56 };     // light orange
      iconRect.fills = [{ type: "SOLID", color: iconColor }];
      iconRect.opacity = 0.4;
      iconFrame.appendChild(iconRect);

      // Bind icon size
      bind(iconFrame, "minWidth", "comp/bottom-nav/item/icon-size");
      bind(iconFrame, "minHeight", "comp/bottom-nav/item/icon-size");

      // Label text
      const labelText = figma.createText();
      labelText.name = "label";
      await figma.loadFontAsync({ family: "Inter", style: "Medium" });
      if (isActive) {
        await figma.loadFontAsync({ family: "Inter", style: "Semi Bold" });
        labelText.fontName = { family: "Inter", style: "Semi Bold" };
      } else {
        labelText.fontName = { family: "Inter", style: "Medium" };
      }
      labelText.characters = tab.label;
      labelText.fontSize = 10;
      labelText.textAlignHorizontal = "CENTER";

      // Text color: active = brand orange, inactive = light orange
      const textColorVar = isActive
        ? "comp/bottom-nav/item/text-color-active"
        : "comp/bottom-nav/item/text-color";
      bindFill(labelText, textColorVar);

      // Bind font properties
      bind(labelText, "fontSize", "comp/bottom-nav/item/font-size");
      const fontWeightVar = isActive
        ? "comp/bottom-nav/item/font-weight-active"
        : "comp/bottom-nav/item/font-weight";
      bind(labelText, "fontWeight", fontWeightVar);

      tabFrame.appendChild(labelText);
      comp.appendChild(tabFrame);
    }
  }

  componentFrames.push(comp);
  console.log("✅ Created: active=" + activeTab.id);
}

// 3. Combine into Component Set
const componentSet = figma.combineAsVariants(componentFrames, page);
componentSet.name = "BottomNav";
componentSet.layoutMode = "VERTICAL";
componentSet.itemSpacing = 24;
componentSet.paddingTop = 24;
componentSet.paddingBottom = 24;
componentSet.paddingLeft = 24;
componentSet.paddingRight = 24;

console.log("✅ BottomNav Component Set created with 5 variants");
console.log("⚠️ Next: replace icon-placeholder rectangles with real Icon instances + add Badge overlay on message tab");

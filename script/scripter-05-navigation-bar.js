// Scripter — NavigationBar Component Set
// 6 variants: surface=brand|default × layout=search|title|action
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
  const paint = figma.util.solidPaint("#000000");
  paint.boundVariables = { color: { type: "VARIABLE_ALIAS", id: v.id } };
  node.fills = [paint];
}

// 2. Create variant frames
const variants = [
  { surface: "brand", layout: "search" },
  { surface: "brand", layout: "title" },
  { surface: "brand", layout: "action" },
  { surface: "default", layout: "search" },
  { surface: "default", layout: "title" },
  { surface: "default", layout: "action" },
];

const componentFrames = [];

(async () => {
  await figma.loadFontAsync({ family: "Inter", style: "Regular" });
  await figma.loadFontAsync({ family: "Inter", style: "Semi Bold" });

  for (const { surface, layout } of variants) {
    const isBrand = surface === "brand";
    const isSearch = layout === "search";
    const isTitle = layout === "title";
    const isAction = layout === "action";

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

    // Bind layout properties
    bind(comp, "height", "comp/nav-bar/height");
    bind(comp, "paddingLeft", "comp/nav-bar/padding-h");
    bind(comp, "paddingRight", "comp/nav-bar/padding-h");
    bind(comp, "itemSpacing", "comp/nav-bar/gap");

    // Background fill
    const bgVar = isBrand ? "comp/nav-bar/background" : "comp/nav-bar/background-default";
    const bgHex = isBrand ? "#FF963B" : "#FFFFFF";
    const bgV = V[bgVar];
    if (bgV) {
      const paint = figma.util.solidPaint(bgHex);
      paint.boundVariables = { color: { type: "VARIABLE_ALIAS", id: bgV.id } };
      comp.fills = [paint];
    } else {
      const bgColor = isBrand ? { r: 1, g: 0.588, b: 0.231 } : { r: 1, g: 1, b: 1 };
      comp.fills = [{ type: "SOLID", color: bgColor }];
    }

    const iconColor = isBrand ? { r: 1, g: 1, b: 1 } : { r: 0.2, g: 0.2, b: 0.22 };
    const iconColorVar = isBrand ? "comp/nav-bar/icon-color" : "comp/nav-bar/icon-color-default";

    // --- leftSlot: icon frame ---
    const leftSlot = figma.createFrame();
    leftSlot.name = "leftSlot";
    leftSlot.resize(24, 24);
    leftSlot.fills = [];
    leftSlot.layoutAlign = "INHERIT";
    leftSlot.layoutSizingHorizontal = "FIXED";
    leftSlot.layoutSizingVertical = "FIXED";

    bind(leftSlot, "width", "comp/nav-bar/icon-size");
    bind(leftSlot, "height", "comp/nav-bar/icon-size");

    // Placeholder rectangle for icon
    const iconRect = figma.createRectangle();
    iconRect.name = isSearch ? "menu-icon" : "back-arrow";
    iconRect.resize(24, 24);
    iconRect.fills = [{ type: "SOLID", color: iconColor }];
    iconRect.opacity = 0.3;
    bindFill(iconRect, iconColorVar);
    iconRect.opacity = 0.3;
    leftSlot.appendChild(iconRect);

    comp.appendChild(leftSlot);

    // --- centerSlot ---
    if (isSearch || isAction) {
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
      searchText.fontName = { family: "Inter", style: "Regular" };
      searchText.characters = "搜尋商品";
      searchText.fontSize = 14;
      searchText.fills = [{ type: "SOLID", color: { r: 0.6, g: 0.6, b: 0.63 } }];
      searchText.layoutAlign = "INHERIT";
      searchText.layoutGrow = 1;
      searchFrame.appendChild(searchText);

      comp.appendChild(searchFrame);
    } else if (isTitle) {
      // Title text
      const titleText = figma.createText();
      titleText.name = "title";
      titleText.fontName = { family: "Inter", style: "Semi Bold" };
      titleText.characters = "頁面標題";
      titleText.fontSize = 16;
      titleText.textAlignHorizontal = "CENTER";
      titleText.layoutAlign = "INHERIT";
      titleText.layoutGrow = 1;

      // Bind title font
      bind(titleText, "fontSize", "comp/nav-bar/title-font-size");
      bind(titleText, "fontWeight", "comp/nav-bar/title-font-weight");

      // Bind title color
      const titleColorVar = isBrand ? "comp/nav-bar/title-color" : "comp/nav-bar/title-color-default";
      bindFill(titleText, titleColorVar);

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

    bind(rightSlot, "itemSpacing", "comp/nav-bar/gap");

    if (isAction) {
      // layout=action: SearchBar + CTA Button (Slot Override)
      // CTA button placeholder
      const ctaButton = figma.createFrame();
      ctaButton.name = "ctaButton";
      ctaButton.resize(64, 32);
      ctaButton.cornerRadius = 8;
      ctaButton.fills = [{ type: "SOLID", color: isBrand ? { r: 1, g: 1, b: 1 } : { r: 1, g: 0.588, b: 0.231 } }];
      ctaButton.layoutMode = "HORIZONTAL";
      ctaButton.primaryAxisAlignItems = "CENTER";
      ctaButton.counterAxisAlignItems = "CENTER";
      ctaButton.paddingLeft = 12;
      ctaButton.paddingRight = 12;
      ctaButton.layoutSizingHorizontal = "HUG";
      ctaButton.layoutSizingVertical = "FIXED";

      const ctaText = figma.createText();
      ctaText.name = "ctaLabel";
      ctaText.fontName = { family: "Inter", style: "Semi Bold" };
      ctaText.characters = "買直購";
      ctaText.fontSize = 12;
      ctaText.fills = [{ type: "SOLID", color: isBrand ? { r: 1, g: 0.588, b: 0.231 } : { r: 1, g: 1, b: 1 } }];
      ctaButton.appendChild(ctaText);

      rightSlot.appendChild(ctaButton);
    } else {
      // 2 placeholder icons
      for (let i = 0; i < 2; i++) {
        const iconR = figma.createRectangle();
        iconR.name = "action-icon-" + (i + 1);
        iconR.resize(24, 24);
        iconR.fills = [{ type: "SOLID", color: iconColor }];
        iconR.opacity = 0.3;
        bindFill(iconR, iconColorVar);
        iconR.opacity = 0.3;

        bind(iconR, "width", "comp/nav-bar/icon-size");
        bind(iconR, "height", "comp/nav-bar/icon-size");

        rightSlot.appendChild(iconR);
      }
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

  console.log("✅ NavigationBar Component Set created with 6 variants (2 surface × 3 layout)");
  console.log("⚠️ Next: replace placeholder rectangles with real Icon instances + swap SearchBar with SearchBar component instance");
})();

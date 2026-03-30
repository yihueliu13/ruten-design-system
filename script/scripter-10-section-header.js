// Scripter — SectionHeader Component Set
// 8 variants: surface=light|dark × size=md|lg × leadingIcon=show|hide
// Run in Figma > Plugins > Scripter on DS測試
// Prerequisites: ruten collection with comp/section-header/* Variables

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

const variants = [
  { surface: "light", size: "md", leadingIcon: "show" },
  { surface: "light", size: "md", leadingIcon: "hide" },
  { surface: "light", size: "lg", leadingIcon: "show" },
  { surface: "light", size: "lg", leadingIcon: "hide" },
  { surface: "dark", size: "md", leadingIcon: "show" },
  { surface: "dark", size: "md", leadingIcon: "hide" },
  { surface: "dark", size: "lg", leadingIcon: "show" },
  { surface: "dark", size: "lg", leadingIcon: "hide" },
];

(async () => {
  await figma.loadFontAsync({ family: "Inter", style: "Semi Bold" });
  await figma.loadFontAsync({ family: "Inter", style: "Regular" });

  for (const { surface, size, leadingIcon } of variants) {
    const isDark = surface === "dark";
    const isMd = size === "md";
    const hasIcon = leadingIcon === "show";

    const iconSize = isMd ? 24 : 32;
    const titleFontSize = isMd ? 14 : 18;
    const rowHeight = isMd ? 24 : 32;

    // Create component
    const comp = figma.createComponent();
    comp.name = `surface=${surface}, size=${size}, leadingIcon=${leadingIcon}`;
    comp.resize(375, rowHeight);

    // Auto Layout: horizontal, space-between
    comp.layoutMode = "HORIZONTAL";
    comp.primaryAxisAlignItems = "SPACE_BETWEEN";
    comp.counterAxisAlignItems = "CENTER";
    comp.paddingLeft = 16;
    comp.paddingRight = 16;
    comp.paddingTop = 0;
    comp.paddingBottom = 0;
    comp.itemSpacing = 4; // icon-text-gap

    // Background: transparent (inherits from parent)
    comp.fills = [];

    // Bind padding-h
    bind(comp, "paddingLeft", "comp/section-header/padding-h");
    bind(comp, "paddingRight", "comp/section-header/padding-h");

    // Bind gap
    bind(comp, "itemSpacing", "comp/section-header/icon-text-gap");

    // Bind min height
    const heightVar = isMd ? "comp/section-header/md/height" : "comp/section-header/lg/height";
    bind(comp, "minHeight", heightVar);

    // --- Left group: icon + title ---
    const leftGroup = figma.createFrame();
    leftGroup.name = "leftGroup";
    leftGroup.layoutMode = "HORIZONTAL";
    leftGroup.counterAxisAlignItems = "CENTER";
    leftGroup.itemSpacing = 4;
    leftGroup.fills = [];
    leftGroup.layoutSizingHorizontal = "HUG";
    leftGroup.layoutSizingVertical = "HUG";

    // Bind gap
    bind(leftGroup, "itemSpacing", "comp/section-header/icon-text-gap");

    // Leading icon (Instance Swap placeholder)
    if (hasIcon) {
      const iconFrame = figma.createFrame();
      iconFrame.name = "leadingIcon";
      iconFrame.resize(iconSize, iconSize);
      iconFrame.fills = [];

      // Placeholder rectangle
      const iconRect = figma.createRectangle();
      iconRect.name = "icon-placeholder";
      iconRect.resize(iconSize, iconSize);
      const iconColor = isDark ? { r: 1, g: 1, b: 1 } : { r: 0.2, g: 0.2, b: 0.22 };
      iconRect.fills = [{ type: "SOLID", color: iconColor }];
      iconRect.opacity = 0.3;

      // Bind icon color
      const iconColorVar = isDark ? "comp/section-header/icon-color-inverse" : "comp/section-header/icon-color";
      bindFill(iconRect, iconColorVar);
      iconRect.opacity = 1;

      iconFrame.appendChild(iconRect);

      // Bind icon size
      const iconSizeVar = isMd ? "comp/section-header/md/icon-size" : "comp/section-header/lg/icon-size";
      bind(iconFrame, "width", iconSizeVar);
      bind(iconFrame, "height", iconSizeVar);

      leftGroup.appendChild(iconFrame);
    }

    // Title text
    const titleText = figma.createText();
    titleText.name = "title";
    titleText.fontName = { family: "Inter", style: "Semi Bold" };
    titleText.characters = "區塊標題";
    titleText.fontSize = titleFontSize;

    const titleColor = isDark ? { r: 1, g: 1, b: 1 } : { r: 0.2, g: 0.2, b: 0.22 };
    titleText.fills = [{ type: "SOLID", color: titleColor }];

    // Bind title color
    const titleColorVar = isDark ? "comp/section-header/title-color-inverse" : "comp/section-header/title-color";
    bindFill(titleText, titleColorVar);

    // Bind title font-size
    const titleFontSizeVar = isMd ? "comp/section-header/md/title-font-size" : "comp/section-header/lg/title-font-size";
    bind(titleText, "fontSize", titleFontSizeVar);

    // Bind title font-weight
    bind(titleText, "fontWeight", "comp/section-header/title-font-weight");

    leftGroup.appendChild(titleText);
    comp.appendChild(leftGroup);

    // --- trailingSlot (CTA placeholder) ---
    const trailingSlot = figma.createFrame();
    trailingSlot.name = "trailingSlot";
    trailingSlot.layoutMode = "HORIZONTAL";
    trailingSlot.counterAxisAlignItems = "CENTER";
    trailingSlot.fills = [];
    trailingSlot.layoutSizingHorizontal = "HUG";
    trailingSlot.layoutSizingVertical = "HUG";

    // CTA text placeholder
    const ctaText = figma.createText();
    ctaText.name = "ctaLabel";
    ctaText.fontName = { family: "Inter", style: "Regular" };
    ctaText.characters = "更多";
    ctaText.fontSize = isMd ? 12 : 14;

    const ctaColor = isDark ? { r: 1, g: 1, b: 1 } : { r: 0.451, g: 0.455, b: 0.482 };
    ctaText.fills = [{ type: "SOLID", color: ctaColor }];

    // Bind CTA color
    const ctaColorVar = isDark ? "comp/section-header/cta-text-color-inverse" : "comp/section-header/cta-text-color";
    bindFill(ctaText, ctaColorVar);

    trailingSlot.appendChild(ctaText);
    comp.appendChild(trailingSlot);

    componentFrames.push(comp);
    console.log("✅ Created: surface=" + surface + ", size=" + size + ", leadingIcon=" + leadingIcon);
  }

  // Combine into Component Set
  const componentSet = figma.combineAsVariants(componentFrames, page);
  componentSet.name = "SectionHeader";
  componentSet.layoutMode = "VERTICAL";
  componentSet.itemSpacing = 16;
  componentSet.paddingTop = 24;
  componentSet.paddingBottom = 24;
  componentSet.paddingLeft = 24;
  componentSet.paddingRight = 24;

  console.log("✅ SectionHeader Component Set created with 8 variants");
  console.log("⚠️ Next: replace icon-placeholder with real Icon instances (Instance Swap) + insert Button ghost for trailingSlot");
})();

// Scripter — NavigationBar: bind remaining Variables to Component Set
// Run in Figma > Plugins > Scripter on DS測試
// Prerequisites: NavigationBar Component Set exists (from scripter-05)
//                ruten collection with comp/nav-bar/* Variables

(async () => {
  const page = figma.currentPage;

  // 1. Find NavigationBar Component Set
  const componentSet = page.findOne(n => n.type === "COMPONENT_SET" && n.name === "NavigationBar");
  if (!componentSet) {
    console.log("❌ NavigationBar Component Set not found on current page");
    return;
  }

  // 2. Build variable lookup
  const allVars = figma.variables.getLocalVariables();
  const V = {};
  for (const v of allVars) V[v.name] = v;

  // Helper: bind a fill color to a variable
  function bindFill(node, varName) {
    const v = V[varName];
    if (!v) { console.log("⚠️ Fill var not found: " + varName); return false; }
    const paint = figma.util.solidPaint("#000000");
    paint.boundVariables = { color: { type: "VARIABLE_ALIAS", id: v.id } };
    node.fills = [paint];
    console.log("  ✅ fill → " + varName);
    return true;
  }

  // Helper: bind a numeric property to a variable
  function bindNum(node, prop, varName) {
    const v = V[varName];
    if (!v) { console.log("⚠️ Num var not found: " + varName); return false; }
    node.setBoundVariable(prop, v);
    console.log("  ✅ " + prop + " → " + varName);
    return true;
  }

  // Helper: bind stroke color to a variable
  function bindStroke(node, varName) {
    const v = V[varName];
    if (!v) { console.log("⚠️ Stroke var not found: " + varName); return false; }
    const stroke = figma.util.solidPaint("#000000");
    stroke.boundVariables = { color: { type: "VARIABLE_ALIAS", id: v.id } };
    node.strokes = [stroke];
    console.log("  ✅ stroke → " + varName);
    return true;
  }

  // Helper: bind text properties
  async function bindText(node, fontSizeVar, fontWeightVar, fillVar) {
    if (fontSizeVar) {
      const v = V[fontSizeVar];
      if (v) { node.setBoundVariable("fontSize", v); console.log("  ✅ fontSize → " + fontSizeVar); }
      else console.log("⚠️ fontSize var not found: " + fontSizeVar);
    }
    if (fontWeightVar) {
      const v = V[fontWeightVar];
      if (v) { node.setBoundVariable("fontWeight", v); console.log("  ✅ fontWeight → " + fontWeightVar); }
      else console.log("⚠️ fontWeight var not found: " + fontWeightVar);
    }
    if (fillVar) bindFill(node, fillVar);
  }

  // 3. Process each variant
  let bound = 0;
  for (const comp of componentSet.children) {
    if (comp.type !== "COMPONENT") continue;
    const name = comp.name;
    console.log("\n--- " + name + " ---");

    // Parse variant props
    const isBrand = name.includes("surface=brand");
    const isSearch = name.includes("layout=search");

    // 3a. Component-level bindings: height, paddingLeft, paddingRight, itemSpacing
    bindNum(comp, "minHeight", "comp/nav-bar/height");
    bindNum(comp, "paddingLeft", "comp/nav-bar/padding-h");
    bindNum(comp, "paddingRight", "comp/nav-bar/padding-h");
    bindNum(comp, "itemSpacing", "comp/nav-bar/gap");
    bound += 4;

    // 3b. leftSlot icon bindings
    const leftSlot = comp.findOne(n => n.name === "leftSlot");
    if (leftSlot) {
      // Bind icon size on the leftSlot frame
      bindNum(leftSlot, "minWidth", "comp/nav-bar/icon-size");
      bindNum(leftSlot, "minHeight", "comp/nav-bar/icon-size");
      bound += 2;

      // Bind icon color on the rectangle inside
      const iconRect = leftSlot.findOne(n => n.type === "RECTANGLE");
      if (iconRect) {
        const iconColorVar = isBrand ? "comp/nav-bar/icon-color" : "comp/nav-bar/icon-color-default";
        bindFill(iconRect, iconColorVar);
        bindNum(iconRect, "width", "comp/nav-bar/icon-size");
        bindNum(iconRect, "height", "comp/nav-bar/icon-size");
        bound += 3;
      }
    }

    // 3c. centerSlot bindings
    if (isSearch) {
      // SearchBar frame
      const searchBar = comp.findOne(n => n.name === "SearchBar");
      if (searchBar) {
        // SearchBar has its own comp tokens — bind them
        bindNum(searchBar, "minHeight", "comp/search-bar/height");
        bindNum(searchBar, "cornerRadius", "comp/search-bar/border-radius");
        bindFill(searchBar, "comp/search-bar/background");
        bindStroke(searchBar, "comp/search-bar/border-color");
        bindNum(searchBar, "strokeWeight", "comp/search-bar/border-width");
        bindNum(searchBar, "paddingLeft", "comp/search-bar/padding-h");
        bindNum(searchBar, "paddingRight", "comp/search-bar/padding-h");
        bindNum(searchBar, "itemSpacing", "comp/search-bar/icon-gap");
        bound += 8;

        // Placeholder text
        const placeholder = searchBar.findOne(n => n.name === "placeholder" && n.type === "TEXT");
        if (placeholder) {
          await bindText(placeholder, "comp/nav-bar/search-font-size", "comp/nav-bar/search-font-weight", "comp/search-bar/placeholder-color");
          bound += 3;
        }
      }
    } else {
      // Title text
      const titleText = comp.findOne(n => n.name === "title" && n.type === "TEXT");
      if (titleText) {
        const titleColorVar = isBrand ? "comp/nav-bar/title-color" : "comp/nav-bar/title-color-default";
        await bindText(titleText, "comp/nav-bar/title-font-size", "comp/nav-bar/title-font-weight", titleColorVar);
        bound += 3;
      }
    }

    // 3d. rightSlot icon bindings
    const rightSlot = comp.findOne(n => n.name === "rightSlot");
    if (rightSlot) {
      bindNum(rightSlot, "itemSpacing", "comp/nav-bar/gap");
      bound++;

      // Bind all icon rectangles
      const iconRects = rightSlot.findAll(n => n.type === "RECTANGLE");
      for (const rect of iconRects) {
        const iconColorVar = isBrand ? "comp/nav-bar/icon-color" : "comp/nav-bar/icon-color-default";
        bindFill(rect, iconColorVar);
        bindNum(rect, "width", "comp/nav-bar/icon-size");
        bindNum(rect, "height", "comp/nav-bar/icon-size");
        bound += 3;
      }
    }
  }

  console.log("\n✅ DONE: " + bound + " bindings applied to NavigationBar variants");
  figma.notify("NavigationBar binding complete: " + bound + " bindings");
})();

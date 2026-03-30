// Scripter — Create Sprint 3 Variables (nav-bar, search-bar, bottom-nav, section-header)
// Run in Figma > Plugins > Scripter on DS測試 file
// Prerequisites: "ruten" collection must exist with sys/ and ref/ variables already imported

(async () => {
  // 1. Find the "ruten" collection
  const collections = figma.variables.getLocalVariableCollections();
  const ruten = collections.find(c => c.name === "ruten");
  if (!ruten) {
    figma.notify("❌ Collection 'ruten' not found!", { error: true });
    return;
  }

  const modeId = ruten.modes[0].modeId;

  // 2. Build lookup: variable name → variable object
  const allVars = figma.variables.getLocalVariables();
  const varByName = {};
  for (const v of allVars) {
    varByName[v.name] = v;
  }

  // 3. Helper: resolve alias target from "{sys.color.primary}" → variable name "sys/color/primary"
  function aliasPath(ref) {
    // "{sys.color.primary}" → "sys/color/primary"
    return ref.replace(/^\{/, "").replace(/\}$/, "").replace(/\./g, "/");
  }

  // 4. Helper: create variable with alias
  function createAliasVar(name, resolvedType, aliasRef) {
    // Check if already exists
    if (varByName[name]) {
      console.log(`⏭ Skip (exists): ${name}`);
      return;
    }

    const targetName = aliasPath(aliasRef);
    const targetVar = varByName[targetName];
    if (!targetVar) {
      console.log(`⚠️ Target not found: ${targetName} (for ${name})`);
      return;
    }

    const newVar = figma.variables.createVariable(name, ruten, resolvedType);
    newVar.setValueForMode(modeId, figma.variables.createVariableAlias(targetVar));
    varByName[name] = newVar; // Add to lookup for comp→comp references
    console.log(`✅ Created: ${name} → ${targetName}`);
  }

  // 5. Sprint 3 token definitions
  // Format: [variableName, figmaType, aliasReference]
  // figmaType: "FLOAT" for number, "COLOR" for color, "STRING" for string

  const tokens = [
    // === search-bar (13) — must be before nav-bar because nav-bar references search-bar ===
    ["comp/search-bar/height", "FLOAT", "{sys.sizing.control-height.default}"],
    ["comp/search-bar/background", "COLOR", "{sys.color.surface}"],
    ["comp/search-bar/border-color", "COLOR", "{sys.color.outline-variant}"],
    ["comp/search-bar/border-width", "FLOAT", "{sys.border.width.default}"],
    ["comp/search-bar/border-radius", "FLOAT", "{sys.radius.full}"],
    ["comp/search-bar/padding-h", "FLOAT", "{sys.spacing.md}"],
    ["comp/search-bar/placeholder-color", "COLOR", "{sys.color.on-surface-variant}"],
    ["comp/search-bar/icon-size", "FLOAT", "{sys.sizing.icon-md}"],
    ["comp/search-bar/icon-gap", "FLOAT", "{sys.spacing.sm}"],
    ["comp/search-bar/focus/border-color", "COLOR", "{sys.color.primary}"],
    ["comp/search-bar/focus/border-width", "FLOAT", "{sys.border.width.focus}"],
    ["comp/search-bar/font-size", "FLOAT", "{sys.typography.body.md}"],
    ["comp/search-bar/font-weight", "FLOAT", "{sys.typography.weight.regular}"],

    // === nav-bar (10) ===
    ["comp/nav-bar/height", "FLOAT", "{sys.sizing.control-height.3xl}"],
    ["comp/nav-bar/background", "COLOR", "{sys.color.surface-brand}"],
    ["comp/nav-bar/padding-h", "FLOAT", "{sys.spacing.md}"],
    ["comp/nav-bar/icon-color", "COLOR", "{sys.color.on-surface-brand}"],
    ["comp/nav-bar/icon-size", "FLOAT", "{sys.sizing.icon-md}"],
    ["comp/nav-bar/gap", "FLOAT", "{sys.spacing.sm}"],
    ["comp/nav-bar/title-font-size", "FLOAT", "{sys.typography.title.md}"],
    ["comp/nav-bar/title-font-weight", "FLOAT", "{sys.typography.weight.semibold}"],
    ["comp/nav-bar/search-font-size", "FLOAT", "{comp.search-bar.font-size}"],
    ["comp/nav-bar/search-font-weight", "FLOAT", "{comp.search-bar.font-weight}"],

    // === bottom-nav (15) ===
    ["comp/bottom-nav/height", "FLOAT", "{sys.sizing.thumbnail-md}"],
    ["comp/bottom-nav/background", "COLOR", "{sys.color.inverse-surface}"],
    ["comp/bottom-nav/border-radius", "FLOAT", "{sys.radius.md}"],
    ["comp/bottom-nav/elevation", "STRING", "{sys.elevation.low}"],
    ["comp/bottom-nav/padding-top", "FLOAT", "{sys.spacing.lg}"],
    ["comp/bottom-nav/item/icon-size", "FLOAT", "{sys.sizing.icon-md}"],
    ["comp/bottom-nav/item/icon-text-gap", "FLOAT", "{sys.spacing.2xs}"],
    ["comp/bottom-nav/item/text-color", "COLOR", "{sys.color.primary-container}"],
    ["comp/bottom-nav/item/text-color-active", "COLOR", "{sys.color.primary}"],
    ["comp/bottom-nav/item/font-size", "FLOAT", "{sys.typography.label.xs}"],
    ["comp/bottom-nav/item/font-weight", "FLOAT", "{sys.typography.weight.medium}"],
    ["comp/bottom-nav/item/font-weight-active", "FLOAT", "{sys.typography.weight.semibold}"],
    ["comp/bottom-nav/center-button/size", "FLOAT", "{sys.sizing.control-height.xl}"],
    ["comp/bottom-nav/center-button/border-radius", "FLOAT", "{sys.radius.full}"],
    ["comp/bottom-nav/center-button/background", "COLOR", "{sys.color.primary}"],

    // === section-header (17) ===
    ["comp/section-header/icon-text-gap", "FLOAT", "{sys.spacing.2xs}"],
    ["comp/section-header/title-color", "COLOR", "{sys.color.on-surface}"],
    ["comp/section-header/title-color-inverse", "COLOR", "{sys.color.on-surface-brand}"],
    ["comp/section-header/subtitle-color", "COLOR", "{sys.color.on-surface-variant}"],
    ["comp/section-header/subtitle-color-inverse", "COLOR", "{sys.color.on-surface-brand}"],
    ["comp/section-header/padding-h", "FLOAT", "{sys.spacing.md}"],
    ["comp/section-header/cta-text-color", "COLOR", "{sys.color.on-surface-variant}"],
    ["comp/section-header/cta-text-color-inverse", "COLOR", "{sys.color.on-surface-brand}"],
    ["comp/section-header/icon-color", "COLOR", "{sys.color.on-surface}"],
    ["comp/section-header/icon-color-inverse", "COLOR", "{sys.color.on-surface-brand}"],
    ["comp/section-header/md/icon-size", "FLOAT", "{sys.sizing.icon-md}"],
    ["comp/section-header/md/title-font-size", "FLOAT", "{sys.typography.title.sm}"],
    ["comp/section-header/md/height", "FLOAT", "{sys.sizing.icon-md}"],
    ["comp/section-header/lg/icon-size", "FLOAT", "{sys.sizing.icon-lg}"],
    ["comp/section-header/lg/title-font-size", "FLOAT", "{sys.typography.title.lg}"],
    ["comp/section-header/lg/height", "FLOAT", "{sys.sizing.icon-lg}"],
    ["comp/section-header/title-font-weight", "FLOAT", "{sys.typography.weight.semibold}"],
  ];

  // 6. Execute
  let created = 0, skipped = 0, failed = 0;

  for (const [name, type, alias] of tokens) {
    try {
      if (varByName[name]) {
        console.log(`⏭ Skip (exists): ${name}`);
        skipped++;
        continue;
      }

      const targetName = aliasPath(alias);
      const targetVar = varByName[targetName];
      if (!targetVar) {
        console.log(`❌ Target not found: ${targetName} (for ${name})`);
        failed++;
        continue;
      }

      const newVar = figma.variables.createVariable(name, ruten, type);
      newVar.setValueForMode(modeId, figma.variables.createVariableAlias(targetVar));
      varByName[name] = newVar;
      created++;
      console.log(`✅ ${name} → ${targetName}`);
    } catch (err) {
      console.log(`❌ Error creating ${name}: ${err.message}`);
      failed++;
    }
  }

  figma.notify(`Done! ✅ ${created} created, ⏭ ${skipped} skipped, ❌ ${failed} failed`);
})();

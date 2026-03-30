// Scripter — Create Missing Variables (badge, section-module, banner, divider + nav-bar 補缺)
// Run in Figma > Plugins > Scripter on DS測試 file
// Prerequisites: "ruten" collection with sys/ and ref/ variables already imported
// Run BEFORE running component scripts (scripter-09 ~ scripter-13)

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

  // 3. Helper: resolve alias target from "{sys.color.primary}" → "sys/color/primary"
  function aliasPath(ref) {
    return ref.replace(/^\{/, "").replace(/\}$/, "").replace(/\./g, "/");
  }

  // 4. Token definitions
  // Format: [variableName, figmaType, aliasReference]
  // figmaType: "FLOAT" for number, "COLOR" for color, "STRING" for string

  const tokens = [
    // === badge (11) ===
    ["comp/badge/dot/size", "FLOAT", "{sys.sizing.badge-dot}"],
    ["comp/badge/dot/color", "COLOR", "{sys.color.error}"],
    ["comp/badge/count/min-size", "FLOAT", "{sys.sizing.control-height.xs}"],
    ["comp/badge/count/font-size", "FLOAT", "{sys.typography.label.2xs}"],
    ["comp/badge/count/font-weight", "FLOAT", "{sys.typography.weight.semibold}"],
    ["comp/badge/count/background", "COLOR", "{sys.color.error}"],
    ["comp/badge/count/text-color", "COLOR", "{sys.color.on-error}"],
    ["comp/badge/count/border-radius", "FLOAT", "{sys.radius.full}"],
    ["comp/badge/count/padding-h", "FLOAT", "{sys.spacing.2xs}"],
    // offset-x and offset-y are hardcoded (-4), created as FLOAT without alias
    ["comp/badge/offset-x", "FLOAT", null],
    ["comp/badge/offset-y", "FLOAT", null],

    // === section-module (7) ===
    ["comp/section-module/background", "COLOR", "{sys.color.surface}"],
    ["comp/section-module/border-radius", "FLOAT", "{sys.radius.md}"],
    ["comp/section-module/padding-h", "FLOAT", "{sys.spacing.md}"],
    ["comp/section-module/cap-height", "FLOAT", "{sys.spacing.md}"],
    ["comp/section-module/gap-header-to-content", "FLOAT", "{sys.spacing.md}"],
    ["comp/section-module/gap-content-to-footer", "FLOAT", "{sys.spacing.lg}"],
    ["comp/section-module/gap-between-slots", "FLOAT", "{sys.spacing.md}"],

    // === banner (4) ===
    ["comp/banner/border-radius", "FLOAT", "{sys.radius.sm}"],
    ["comp/banner/background", "COLOR", "{sys.color.surface}"],
    ["comp/banner/padding", "FLOAT", "{sys.spacing.md}"],
    ["comp/banner/min-height", "FLOAT", "{sys.sizing.control-height.3xl}"],

    // === divider (5) ===
    ["comp/divider/color", "COLOR", "{sys.color.outline-variant}"],
    ["comp/divider/thickness-hairline", "FLOAT", "{sys.border.width.hairline}"],
    ["comp/divider/thickness-default", "FLOAT", "{sys.border.width.default}"],
    ["comp/divider/thickness-heavy", "FLOAT", "{sys.border.width.focus}"],
    ["comp/divider/spacing", "FLOAT", "{sys.spacing.xs}"],

    // === nav-bar 補缺 (4) ===
    ["comp/nav-bar/background-default", "COLOR", "{sys.color.surface}"],
    ["comp/nav-bar/icon-color-default", "COLOR", "{sys.color.on-surface}"],
    ["comp/nav-bar/title-color", "COLOR", "{sys.color.on-surface-brand}"],
    ["comp/nav-bar/title-color-default", "COLOR", "{sys.color.on-surface}"],
  ];

  // 5. Execute
  let created = 0, skipped = 0, failed = 0;

  for (const [name, type, alias] of tokens) {
    try {
      if (varByName[name]) {
        console.log(`⏭ Skip (exists): ${name}`);
        skipped++;
        continue;
      }

      if (alias === null) {
        // Hardcoded value (offset-x, offset-y = -4)
        const newVar = figma.variables.createVariable(name, ruten, type);
        newVar.setValueForMode(modeId, -4);
        varByName[name] = newVar;
        created++;
        console.log(`✅ ${name} = -4 (hardcoded)`);
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

/**
 * 批次新增 Tag 擴充的 16 個 Figma Variables
 * 對應 design-system-all.json 的 Tag 擴充任務
 *
 * Scripter → 貼上 → Run
 */

// ============================================================
// 1. 找到 Collection 和 Mode
// ============================================================
var collections = figma.variables.getLocalVariableCollections()
var coll = null
var maxVars = 0
for (var i = 0; i < collections.length; i++) {
  console.log("[" + i + "] " + collections[i].name + " (" + collections[i].variableIds.length + " vars)")
  if (collections[i].variableIds.length > maxVars) {
    maxVars = collections[i].variableIds.length
    coll = collections[i]
  }
}

if (!coll) { console.log("❌ 找不到 Collection"); }
else {
  console.log("✅ Collection: " + coll.name)
  var modeId = coll.modes[0].modeId

  // ============================================================
  // 2. 建立 name → variable 對照表
  // ============================================================
  var varByName = {}
  for (var i = 0; i < coll.variableIds.length; i++) {
    var v = figma.variables.getVariableById(coll.variableIds[i])
    if (v) varByName[v.name] = v
  }

  function findVar(name) { return varByName[name] || null }

  function alias(targetName) {
    var target = findVar(targetName)
    if (!target) {
      console.log("  ⚠️ alias 目標找不到: " + targetName)
      return null
    }
    return figma.variables.createVariableAlias(target)
  }

  function createVar(name, type, value, desc) {
    if (findVar(name)) {
      console.log("  ⏭️ 已存在: " + name)
      return findVar(name)
    }
    var v = figma.variables.createVariable(name, coll, type)
    v.description = desc || ""
    // 不設 scopes，使用預設 ALL_SCOPES
    if (value !== null && value !== undefined) {
      v.setValueForMode(modeId, value)
    }
    console.log("  ✅ " + name)
    return v
  }

  var count = 0

  // ============================================================
  // 3. SYS 層：3 個色彩 alias
  // ============================================================
  console.log("\n--- sys 層色彩 ---")

  createVar("sys/color/primary-container-dim", "COLOR",
    alias("ref/color/orange/50"),
    "Light orange tinted background. Use for subtle primary-brand surface tints.")
  count++

  createVar("sys/color/surface-container-low", "COLOR",
    alias("ref/color/neutral/50"),
    "Light neutral background surface. Use for inactive filter containers.")
  count++

  createVar("sys/color/primary-variant", "COLOR",
    alias("ref/color/orange/400"),
    "Lighter primary brand variant. Use for active/hover states.")
  count++

  // ============================================================
  // 4. COMP：comp/tag/base/lg-alt（6 tokens）
  // ============================================================
  console.log("\n--- comp/tag/base/lg-alt ---")

  createVar("comp/tag/base/lg-alt/min-height", "FLOAT",
    36,
    "Tag lg-alt minimum height. 36px. Action Sheet filter tags.")
  count++

  createVar("comp/tag/base/lg-alt/padding-h", "FLOAT",
    alias("sys/spacing/xs"),
    "Tag lg-alt horizontal padding. 8px.")
  count++

  createVar("comp/tag/base/lg-alt/padding-v", "FLOAT",
    alias("sys/spacing/xs"),
    "Tag lg-alt vertical padding. 8px.")
  count++

  createVar("comp/tag/base/lg-alt/font-size", "FLOAT",
    alias("sys/typography/body/md"),
    "Tag lg-alt font size. 14px (body-md).")
  count++

  createVar("comp/tag/base/lg-alt/font-weight", "FLOAT",
    alias("sys/typography/weight/medium"),
    "Tag lg-alt font weight. Medium.")
  count++

  createVar("comp/tag/base/lg-alt/border-radius", "FLOAT",
    alias("sys/radius/full"),
    "Tag lg-alt border radius. Pill shape (9999px).")
  count++

  // ============================================================
  // 5. COMP：comp/tag/filter/error（4 tokens）
  // ============================================================
  console.log("\n--- comp/tag/filter/error ---")

  createVar("comp/tag/filter/error/border-color", "COLOR",
    alias("sys/color/error"),
    "Filter tag error border color. Required-field validation feedback.")
  count++

  createVar("comp/tag/filter/error/border-width", "FLOAT",
    alias("sys/border/width/default"),
    "Filter tag error border width. Same as normal.")
  count++

  createVar("comp/tag/filter/error/background", "COLOR",
    alias("sys/color/surface-dim"),
    "Filter tag error background. Same as normal — error via border only.")
  count++

  createVar("comp/tag/filter/error/text-color", "COLOR",
    alias("sys/color/on-surface"),
    "Filter tag error text color. Same as normal — error via border only.")
  count++

  // ============================================================
  // 6. COMP：comp/tag/filter/suffix（3 tokens）
  // ============================================================
  console.log("\n--- comp/tag/filter/suffix ---")

  createVar("comp/tag/filter/suffix/font-size", "FLOAT",
    alias("sys/typography/label/xs"),
    "Filter tag suffix text font size. Small label for count/unit.")
  count++

  createVar("comp/tag/filter/suffix/color", "COLOR",
    alias("sys/color/on-surface-variant"),
    "Filter tag suffix text color. Muted tone.")
  count++

  createVar("comp/tag/filter/suffix/separator-color", "COLOR",
    alias("sys/color/outline-variant"),
    "Filter tag suffix separator (pipe) color. Subtle divider.")
  count++

  // ============================================================
  console.log("\n---")
  console.log("✅ 完成！處理 " + count + " 個 Variables")
  console.log("Collection 總數: " + coll.variableIds.length)
}

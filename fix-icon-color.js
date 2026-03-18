/**
 * 修復 new outline frame 所有 icon 顏色
 * 1. FRAME/GROUP → 清除所有 fills（透明背景）
 * 2. VECTOR 節點 → 設定 solid fill 綁定 comp/icon/md/color
 *
 * Scripter → 貼上 → Run
 */

var FRAME_ID = "87:15521"
var VAR_NAME = "comp/icon/md/color"

var VECTOR_TYPES = [
  "VECTOR", "BOOLEAN_OPERATION", "LINE",
  "ELLIPSE", "RECTANGLE", "POLYGON", "STAR"
]

// 找變數
var allVars = figma.variables.getLocalVariables("COLOR")
var targetVar = null
for (var i = 0; i < allVars.length; i++) {
  if (allVars[i].name === VAR_NAME) {
    targetVar = allVars[i]
    break
  }
}

var frame = figma.getNodeById(FRAME_ID)

if (!targetVar) { console.log("❌ 變數找不到: " + VAR_NAME) }
if (!frame) { console.log("❌ frame 找不到: " + FRAME_ID) }

if (targetVar && frame) {
  console.log("變數: " + targetVar.name)
  console.log("frame: " + frame.name + " children=" + frame.children.length)

  var frameClear = 0
  var vectorBind = 0

  function fix(node) {
    var t = node.type

    // FRAME / GROUP / COMPONENT → 清空 fills
    if (t === "FRAME" || t === "GROUP" || t === "COMPONENT" || t === "INSTANCE") {
      if (node.fills && node.fills.length > 0) {
        node.fills = []
        frameClear++
      }
    }

    // VECTOR 節點 → 建立乾淨的 solid fill + 綁定變數
    if (VECTOR_TYPES.indexOf(t) >= 0) {
      // 建一個全新的 solid paint 並綁定
      var newPaint = {
        type: "SOLID",
        color: { r: 0.2, g: 0.2, b: 0.23 },
        opacity: 1,
        visible: true
      }
      newPaint = figma.variables.setBoundVariableForPaint(newPaint, "color", targetVar)

      // 如果有 fills → 全部替換成綁定的 paint
      if (node.fills && node.fills !== figma.mixed && node.fills.length > 0) {
        node.fills = [newPaint]
        vectorBind++
      }

      // 如果有 strokes → 也綁定
      if (node.strokes && node.strokes !== figma.mixed && node.strokes.length > 0) {
        var strokePaint = {
          type: "SOLID",
          color: { r: 0.2, g: 0.2, b: 0.23 },
          opacity: 1,
          visible: true
        }
        strokePaint = figma.variables.setBoundVariableForPaint(strokePaint, "color", targetVar)
        node.strokes = [strokePaint]
      }
    }

    // 遞迴
    if ("children" in node) {
      for (var i = 0; i < node.children.length; i++) {
        fix(node.children[i])
      }
    }
  }

  // 先清 new outline frame 本身的 fills
  if (frame.fills && frame.fills.length > 0) {
    frame.fills = []
    console.log("清除 new outline frame 本身的 fills")
  }

  for (var i = 0; i < frame.children.length; i++) {
    var icon = frame.children[i]
    console.log(icon.name + " (type=" + icon.type + ")")
    fix(icon)
  }

  console.log("---")
  console.log("frame fills 清除: " + frameClear)
  console.log("vector 綁定: " + vectorBind)
  console.log("✅ 修復完成")
}

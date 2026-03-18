/**
 * 綁定 comp/icon/md/color 到 new outline frame 所有 icon
 * 只修改向量節點（VECTOR, BOOLEAN_OPERATION, LINE, ELLIPSE, POLYGON, STAR）
 * 不動 FRAME / GROUP 的 fills
 *
 * Scripter → 貼上 → Run
 */

var FRAME_ID = "87:15521"
var VAR_NAME = "comp/icon/md/color"

// 只有這些 type 才改顏色
var VECTOR_TYPES = [
  "VECTOR", "BOOLEAN_OPERATION", "LINE",
  "ELLIPSE", "RECTANGLE", "POLYGON", "STAR"
]

// 1. 找變數
var allVars = figma.variables.getLocalVariables("COLOR")
var targetVar = null
for (var i = 0; i < allVars.length; i++) {
  if (allVars[i].name === VAR_NAME) {
    targetVar = allVars[i]
    break
  }
}

if (!targetVar) {
  console.log("❌ 找不到變數: " + VAR_NAME)
}

// 2. 找目標 frame
var frame = figma.getNodeById(FRAME_ID)
if (!frame) {
  console.log("❌ 找不到 frame: " + FRAME_ID)
}

if (targetVar && frame) {
  console.log("✅ 變數: " + targetVar.name)
  console.log("✅ frame: " + frame.name + " (" + frame.children.length + " icons)")

  var fillCount = 0
  var strokeCount = 0
  var frameFixCount = 0

  function isVectorType(type) {
    return VECTOR_TYPES.indexOf(type) >= 0
  }

  function processNode(node) {
    // 如果是 FRAME / GROUP → 清除意外被加的 fills（修復上次錯誤）
    if (node.type === "FRAME" || node.type === "GROUP") {
      if (node.fills && node.fills.length > 0) {
        // 檢查是否有被綁到 comp/icon/md/color 的 fill → 移除
        var cleanFills = []
        var removed = false
        for (var j = 0; j < node.fills.length; j++) {
          var p = node.fills[j]
          var bound = p.boundVariables && p.boundVariables.color
          if (bound && bound.id === targetVar.id) {
            removed = true  // 跳過這個 fill（移除）
          } else {
            cleanFills.push(p)
          }
        }
        if (removed) {
          node.fills = cleanFills
          frameFixCount++
        }
      }
    }

    // 如果是向量節點 → 綁定
    if (isVectorType(node.type)) {
      // 綁 fills
      if (node.fills && node.fills !== figma.mixed && node.fills.length > 0) {
        try {
          var newFills = []
          for (var j = 0; j < node.fills.length; j++) {
            var paint = Object.assign({}, node.fills[j])
            if (paint.type === "SOLID") {
              paint = figma.variables.setBoundVariableForPaint(paint, "color", targetVar)
            }
            newFills.push(paint)
          }
          node.fills = newFills
          fillCount++
        } catch(e) {
          console.log("  ⚠️ fill: " + node.name + " " + e.message)
        }
      }

      // 綁 strokes
      if (node.strokes && node.strokes !== figma.mixed && node.strokes.length > 0) {
        try {
          var newStrokes = []
          for (var j = 0; j < node.strokes.length; j++) {
            var paint = Object.assign({}, node.strokes[j])
            if (paint.type === "SOLID") {
              paint = figma.variables.setBoundVariableForPaint(paint, "color", targetVar)
            }
            newStrokes.push(paint)
          }
          node.strokes = newStrokes
          strokeCount++
        } catch(e) {
          console.log("  ⚠️ stroke: " + node.name + " " + e.message)
        }
      }
    }

    // 遞迴
    if ("children" in node) {
      for (var i = 0; i < node.children.length; i++) {
        processNode(node.children[i])
      }
    }
  }

  for (var i = 0; i < frame.children.length; i++) {
    console.log("🔗 " + frame.children[i].name)
    processNode(frame.children[i])
  }

  console.log("---")
  console.log("fills 綁定: " + fillCount)
  console.log("strokes 綁定: " + strokeCount)
  console.log("frame fills 修復: " + frameFixCount)
  console.log("✅ 完成")
}

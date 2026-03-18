/**
 * 一鍵重建：清空 new outline → 複製 23 icon → rename -lite → 綁 comp/icon/md/color
 * Scripter → 貼上 → Run
 */

var SRC_ID = "81:2872764"   // 分類選單
var DST_ID = "87:15521"     // new outline frame
var VAR_NAME = "comp/icon/md/color"

var src = figma.getNodeById(SRC_ID)
var dst = figma.getNodeById(DST_ID)

// 找變數
var allVars = figma.variables.getLocalVariables("COLOR")
var targetVar = null
for (var i = 0; i < allVars.length; i++) {
  if (allVars[i].name === VAR_NAME) { targetVar = allVars[i]; break }
}

if (!src) console.log("❌ src not found")
if (!dst) console.log("❌ dst not found")
if (!targetVar) console.log("❌ var not found: " + VAR_NAME)

if (src && dst && targetVar) {
  // Step 1: 清空 new outline
  while (dst.children.length > 0) {
    dst.children[0].remove()
  }
  dst.fills = []
  console.log("Step 1: 清空完成")

  // Step 2: 找所有 icon（instance 和 frame）
  function walk(node) {
    var list = []
    if ("children" in node) {
      for (var i = 0; i < node.children.length; i++) {
        var c = node.children[i]
        if ((c.type === "INSTANCE" || c.type === "FRAME") && c.name.indexOf("outline/") === 0) {
          list.push(c)
        }
        if ("children" in c) {
          var sub = walk(c)
          for (var j = 0; j < sub.length; j++) list.push(sub[j])
        }
      }
    }
    return list
  }

  var icons = walk(src)
  console.log("Step 2: 找到 " + icons.length + " 個 icon")

  // Step 3: 複製 + rename + 排列 + 綁色
  var count = 0
  for (var i = 0; i < icons.length; i++) {
    var orig = icons[i]
    var iconName = orig.name.replace("outline/", "")

    // 複製
    var clone = orig.clone()
    if (typeof clone.detachInstance === "function" && clone.type === "INSTANCE") {
      clone = clone.detachInstance()
    }

    // rename -lite
    clone.name = "outline/" + iconName + "-lite"

    // resize 24×24
    clone.resize(24, 24)

    // 排列
    var col = count % 10
    var row = Math.floor(count / 10)
    clone.x = col * 48
    clone.y = row * 48

    // 移到目標
    dst.appendChild(clone)

    // 綁色：遞迴所有子節點
    bindColor(clone)

    count++
    console.log("  ✅ " + clone.name)
  }

  // 調整 frame 大小
  var cols = Math.min(count, 10)
  var rows = Math.ceil(count / 10)
  dst.resize(cols * 48 - 24, rows * 48 - 24)

  console.log("---")
  console.log("✅ 完成！" + count + " 個 icon")
}

function bindColor(node) {
  var t = node.type
  // 只改向量葉節點
  var isVector = (
    t === "VECTOR" || t === "BOOLEAN_OPERATION" || t === "LINE" ||
    t === "ELLIPSE" || t === "RECTANGLE" || t === "POLYGON" || t === "STAR"
  )

  if (isVector) {
    if (node.strokes && node.strokes.length > 0) {
      var s = { type: "SOLID", color: {r:0.2,g:0.2,b:0.23}, opacity: 1, visible: true }
      s = figma.variables.setBoundVariableForPaint(s, "color", targetVar)
      node.strokes = [s]
    }
    if (node.fills && node.fills.length > 0) {
      var f = { type: "SOLID", color: {r:0.2,g:0.2,b:0.23}, opacity: 1, visible: true }
      f = figma.variables.setBoundVariableForPaint(f, "color", targetVar)
      node.fills = [f]
    }
  }

  if ("children" in node) {
    for (var i = 0; i < node.children.length; i++) {
      bindColor(node.children[i])
    }
  }
}

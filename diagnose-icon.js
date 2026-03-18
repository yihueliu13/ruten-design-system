/**
 * 診斷 camping-lite icon 的 fills/strokes 結構
 * Scripter → 貼上 → Run
 */
var node = figma.getNodeById("87:230988")  // outline/camping-lite

function inspect(n, depth) {
  var indent = ""
  for (var i = 0; i < depth; i++) indent += "  "

  console.log(indent + n.type + " [" + n.name + "] id=" + n.id)

  // Fills
  if (n.fills && n.fills !== figma.mixed) {
    for (var j = 0; j < n.fills.length; j++) {
      var f = n.fills[j]
      var bound = (f.boundVariables && f.boundVariables.color) ? f.boundVariables.color.id : "none"
      console.log(indent + "  FILL[" + j + "]: type=" + f.type +
        " visible=" + f.visible +
        " opacity=" + f.opacity +
        " color=" + (f.color ? "r" + Math.round(f.color.r*255) + " g" + Math.round(f.color.g*255) + " b" + Math.round(f.color.b*255) : "n/a") +
        " boundVar=" + bound)
    }
  }

  // Strokes
  if (n.strokes && n.strokes !== figma.mixed) {
    for (var j = 0; j < n.strokes.length; j++) {
      var s = n.strokes[j]
      var bound = (s.boundVariables && s.boundVariables.color) ? s.boundVariables.color.id : "none"
      console.log(indent + "  STROKE[" + j + "]: type=" + s.type +
        " visible=" + s.visible +
        " opacity=" + s.opacity +
        " color=" + (s.color ? "r" + Math.round(s.color.r*255) + " g" + Math.round(s.color.g*255) + " b" + Math.round(s.color.b*255) : "n/a") +
        " boundVar=" + bound)
    }
  }

  if (n.fills && n.fills.length === 0 && (!n.strokes || n.strokes.length === 0)) {
    console.log(indent + "  (no fills, no strokes)")
  }

  // Children
  if ("children" in n) {
    for (var i = 0; i < n.children.length; i++) {
      inspect(n.children[i], depth + 1)
    }
  }
}

if (node) {
  inspect(node, 0)
} else {
  console.log("❌ 找不到 87:230988")
}

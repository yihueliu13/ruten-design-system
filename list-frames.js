/**
 * 列出 87:14312 子 frame → 建立文字圖層顯示在畫布上
 * Scripter → 貼上 → Run → 畫布上會出現清單
 */
var node = figma.getNodeById("87:14312")
if (node) {
  var lines = ["=== " + node.name + " (" + node.children.length + " frames) ===", ""]
  for (var i = 0; i < node.children.length; i++) {
    var c = node.children[i]
    lines.push((i+1) + ". " + c.name + "  |  " + c.id + "  |  " + Math.round(c.width) + "x" + Math.round(c.height))
  }

  var text = figma.createText()
  figma.loadFontAsync({ family: "Inter", style: "Regular" }).then(function() {
    text.characters = lines.join("\n")
    text.fontSize = 14
    text.x = node.x
    text.y = node.y + node.height + 40
    figma.currentPage.appendChild(text)
    figma.viewport.scrollAndZoomIntoView([text])
    figma.notify("✅ 清單已建立在畫布上，截圖給我")
  })
}

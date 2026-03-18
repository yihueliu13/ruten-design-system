/**
 * 批次重新命名 new outline frame 內所有 icon
 * outline/xxx → outline/xxx-lite
 *
 * Scripter → 貼上 → Run
 */
var frame = figma.getNodeById("87:15521")  // new outline frame

if (!frame) {
  console.log("❌ 找不到 new outline (87:15521)")
} else {
  console.log("目標: " + frame.name + " (" + frame.children.length + " children)")
  var count = 0
  for (var i = 0; i < frame.children.length; i++) {
    var child = frame.children[i]
    var old = child.name
    if (old.indexOf("-lite") === -1) {
      // outline/xxx → outline/xxx-lite
      child.name = old + "-lite"
      console.log("  " + old + " → " + child.name)
      count++
    } else {
      console.log("  skip: " + old + " (already has -lite)")
    }
  }
  console.log("---")
  console.log("✅ 重新命名 " + count + " 個 icon")
}

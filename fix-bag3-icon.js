/**
 * 補 bag-3 到 new outline — 直接用 node ID
 * Scripter → 貼上 → Run
 */
var src = figma.getNodeById("81:2872802")
var dst = figma.getNodeById("87:15521")

console.log("src: " + (src ? src.name + " type=" + src.type : "NOT FOUND"))
console.log("dst: " + (dst ? dst.name : "NOT FOUND"))

if (src && dst) {
  var clone = src.clone()
  console.log("clone type: " + clone.type)

  // 不管什麼 type 都試 detach
  try {
    if (typeof clone.detachInstance === "function") {
      clone = clone.detachInstance()
      console.log("detached → type: " + clone.type)
    }
  } catch(e) {
    console.log("detach error: " + e.message)
  }

  clone.name = "outline/bag-3"
  clone.resize(24, 24)
  clone.x = 96   // 第三行第 3 個
  clone.y = 96
  dst.appendChild(clone)
  console.log("✅ bag-3 done! total children: " + dst.children.length)
} else {
  console.log("❌ 失敗，請手動：在分類選單找 名產食品 旁的 icon → 複製 → 貼到 new outline frame")
}

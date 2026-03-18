/**
 * 補 bag-01（名產食品）到 new outline frame
 * 實際名稱是 outline/bag-01（不是 bag-3）
 * node ID: 87:15505
 *
 * Scripter → 貼上 → Run
 */
var src = figma.getNodeById("87:15505")  // outline/bag-01 (名產食品)
var dst = figma.getNodeById("87:15521")  // new outline frame

if (!src) { console.log("❌ 找不到 bag-01 (87:15505)") }
if (!dst) { console.log("❌ 找不到目標 (87:15521)") }

if (src && dst) {
  console.log("找到: " + src.name + " type=" + src.type + " id=" + src.id)
  var clone = src.clone()
  console.log("clone type: " + clone.type)

  if (typeof clone.detachInstance === "function") {
    try {
      clone = clone.detachInstance()
      console.log("detached → type: " + clone.type)
    } catch(e) {
      console.log("detach skipped: " + e.message)
    }
  }

  clone.name = "outline/bag-01"
  clone.resize(24, 24)
  clone.x = 96
  clone.y = 96
  dst.appendChild(clone)
  console.log("✅ bag-01 done! total: " + dst.children.length)
}

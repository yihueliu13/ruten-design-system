/**
 * Figma Scripter — Detach 15 個分類 icon 到 new outline frame
 *
 * 使用：Scripter plugin → 貼上 → Run
 */

// === 目標 icon 清單 ===
const NEED = [
  "camping", "car", "phone", "t-shirt", "sport",
  "bag-3", "makeup", "dress", "shoe", "baby",
  "music", "time-square", "china", "18-plus", "category"
]

// === 找節點 ===
const src = figma.getNodeById("81:2872764")
const dst = figma.getNodeById("87:15521")

if (!src) { console.log("❌ 找不到來源 81:2872764"); }
if (!dst) { console.log("❌ 找不到目標 87:15521"); }

if (src && dst) {
  console.log("✅ 來源: " + src.name)
  console.log("✅ 目標: " + dst.name)

  // 遞迴搜集所有子節點
  function walk(node, list) {
    list = list || []
    if ("children" in node) {
      for (var i = 0; i < node.children.length; i++) {
        list.push(node.children[i])
        walk(node.children[i], list)
      }
    }
    return list
  }

  var all = walk(src)
  console.log("子節點總數: " + all.length)

  // 找出符合的 instance
  var found = []
  for (var i = 0; i < all.length; i++) {
    var n = all[i]
    if (n.type === "INSTANCE" || n.type === "FRAME") {
      var raw = n.name.replace("outline/", "")
      if (NEED.indexOf(raw) >= 0) {
        found.push({ node: n, iconName: raw })
        console.log("  找到: " + n.name + " (type=" + n.type + ", id=" + n.id + ")")
      }
    }
  }

  console.log("符合數量: " + found.length + " / " + NEED.length)

  // 複製到目標 frame
  var count = 0
  for (var i = 0; i < found.length; i++) {
    var item = found[i]

    // 複製節點（保留原始不動）
    var clone = item.node.clone()

    // 如果是 instance，detach 它
    if (clone.type === "INSTANCE") {
      clone = clone.detachInstance()
    }

    // 命名
    clone.name = "outline/" + item.iconName

    // 設定大小 24×24
    clone.resize(24, 24)

    // 排列位置（每行 10 個）
    var col = count % 10
    var row = Math.floor(count / 10)
    clone.x = col * 48
    clone.y = row * 48

    // 移到目標 frame
    dst.appendChild(clone)

    count++
    console.log("  ✅ " + clone.name + " → done")
  }

  console.log("---")
  console.log("完成！" + count + " 個 icon 已複製到 [" + dst.name + "]")

  // 檢查哪些沒找到
  for (var i = 0; i < NEED.length; i++) {
    var matched = false
    for (var j = 0; j < found.length; j++) {
      if (found[j].iconName === NEED[i]) { matched = true; break }
    }
    if (!matched) {
      console.log("⚠️ 未找到: " + NEED[i])
    }
  }
}

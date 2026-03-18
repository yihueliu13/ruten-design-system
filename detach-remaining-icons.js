/**
 * 補齊剩餘分類 icon 到 new outline frame
 * 之前已加 14 個，這次補剩下的（包含 Icons page 已有的 + bag-3）
 *
 * Scripter → 貼上 → Run
 */

// 這些是上次跳過的（因為 Icons page 已有）+ 漏掉的 bag-3
var REMAINING = [
  "heart",      // 玩具公仔（原本是 frame 87:15424）
  "home",       // 生活居家
  "computer",   // 電腦電子
  "book",       // 書籍雜誌
  "video",      // 家電影音
  "game",       // 電玩遊戲
  "bag",        // 女性飾品
  "star",       // 明星偶像
  "bag-3"       // 名產食品（上次 detach 失敗）
]

var src = figma.getNodeById("81:2872764")  // 分類選單
var dst = figma.getNodeById("87:15521")    // new outline frame

if (!src) { console.log("❌ 找不到來源 81:2872764") }
if (!dst) { console.log("❌ 找不到目標 87:15521") }

if (src && dst) {
  // 先看目標已有幾個 icon（接著排）
  var existing = dst.children ? dst.children.length : 0
  console.log("目標已有 " + existing + " 個 icon")

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
  var count = 0

  for (var i = 0; i < all.length; i++) {
    var n = all[i]
    if (n.type === "INSTANCE" || n.type === "FRAME") {
      var raw = n.name.replace("outline/", "")
      if (REMAINING.indexOf(raw) >= 0) {
        console.log("找到: " + n.name + " (type=" + n.type + ")")

        var clone = n.clone()
        if (clone.type === "INSTANCE") {
          clone = clone.detachInstance()
        }

        clone.name = "outline/" + raw
        clone.resize(24, 24)

        var idx = existing + count
        var col = idx % 10
        var row = Math.floor(idx / 10)
        clone.x = col * 48
        clone.y = row * 48

        dst.appendChild(clone)
        count++
        console.log("  ✅ " + clone.name)
      }
    }
  }

  console.log("---")
  console.log("本次新增: " + count)
  console.log("目標總數: " + (existing + count))
}

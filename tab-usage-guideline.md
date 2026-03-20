# Ruten Design System — Tab 使用規則

> **版本**: v1.0.0-draft
> **日期**: 2026-03-20
> **狀態**: 討論定稿中
> **依據**: design-system-all.json（唯一真實來源）
> **分類**: Navigation × Primitive × Owned（28 + 1 = 29 tokens）

---

## 1. Tab vs 其他導航元件

```
使用者做什麼？
├── 在同一頁切換不同內容面板 → Tab（comp/tab/）
├── 跳到另一個頁面           → NavigationBar / BottomNav / Link
├── 篩選商品列表             → Tag Filter（comp/tag/）
└── 搜尋商品                 → SearchBar（comp/search-bar/）
```

看起來像 tab 但點下去跳頁的 → 不要用 Tab，用 Link 或 NavigationBar。
看起來像 tab 但是在篩選結果的 → 不要用 Tab，用 Tag Filter。

---

## 2. Tab 架構

```
comp/tab/
├── base/                      ← 所有 size、state 共用
│   ├── border-radius            8px
│   ├── gap                      8px（tab 之間的間距）
│   ├── indicator-height         3px（底線粗細，hardcode，低於 base-4）
│   └── font-weight              500（medium，未選中的預設字重）
│
├── {size}/                    ← sm / md / lg / xl
│   ├── min-height               固定高度（control-height 體系）
│   ├── padding-h                水平內距
│   ├── padding-v                垂直內距（Figma Auto Layout 用）
│   └── font-size                文字大小
│
├── active/                    ← 選中狀態
│   ├── font-weight              600（semibold）
│   ├── text-color               品牌橘
│   ├── indicator-color          品牌橘（底線顏色）
│   └── background               淡橘底（預留，目前預設不開）
│
├── inactive/                  ← 未選中狀態
│   ├── text-color               灰色
│   ├── indicator-color          透明（不顯示底線）
│   └── background               白色
│
├── hover/                     ← 滑鼠懸停
│   ├── text-color               深灰（比 inactive 深一階）← 新增
│   └── background               淺灰底
│
└── layout                     ← Figma Variant prop，不需 token
    ├── fixed                    等寬排列（≤ 5 tabs）
    └── scrollable               自適應寬度 + 水平捲動（> 5 tabs）
```

---

## 3. Size（尺寸）

四種尺寸，對應不同裝置和場景。每個尺寸的高度由 control-height 體系統一管理。

| Size | 高度 | 字級 | 水平內距 | 垂直內距 | 場景 |
|------|------|------|---------|---------|------|
| **sm** | 32px | 12px (label-md) | 12px | 4px | Mobile 次級 tab，空間緊湊的面板內 |
| **md** | 40px | 14px (label-lg) | 16px | 8px | **最常用。** 分類館首頁的 section tab bar |
| **lg** | 44px | 14px (title-sm) | 24px | 8px | Desktop 頁面級 tab |
| **xl** | 48px | 16px (title-md) | 32px | 12px | 寬螢幕桌面版，視覺份量最重 |

### 高度繼承鏈（control-height 體系）

```
comp/tab/sm/min-height  → sys/sizing/control-height/default → ref/sizing/8  → 32px
comp/tab/md/min-height  → sys/sizing/control-height/xl      → ref/sizing/10 → 40px
comp/tab/lg/min-height  → sys/sizing/control-height/2xl     → ref/sizing/11 → 44px
comp/tab/xl/min-height  → sys/sizing/control-height/3xl     → ref/sizing/12 → 48px
```

和 Button 共用同一套 control-height 階級，所以 Tab sm 和 Button sm 一樣高（32px），在同一列排版時會對齊。

### 怎麼選 size？

```
空間很擠，例如卡片內部的小 tab？         → sm
分類館首頁、商品頁的 section tab？       → md（預設選這個）
Desktop 頁面頂部的主要導航 tab？         → lg
寬螢幕桌面版，tab 是最重要的導航結構？   → xl
```

---

## 4. State（狀態）

三種狀態。每個 tab item 在任何時間點只會處於其中一種。

### 4.1 Active（選中）

使用者目前正在看的那個 tab。視覺上最搶眼。

| 屬性 | 值 | Token | 設計師看到的 |
|------|---|-------|------------|
| 文字顏色 | 品牌橘 | `sys/color/primary` → orange/500 | 橘色字 |
| 字重 | 600 semibold | `sys/typography/weight/semibold` | 比未選中的粗一級 |
| 底線顏色 | 品牌橘 | `sys/color/primary` → orange/500 | 橘色底線 |
| 底線粗細 | 3px | hardcode（低於 base-4） | 明確但不粗暴 |
| 背景色 | 淡橘 | `sys/color/surface-brand-dim` → orange/50 | **預設不開。** 預留給需要強調的場景 |

### 4.2 Inactive（未選中）

其他沒被選中的 tab。低調但可讀。

| 屬性 | 值 | Token | 設計師看到的 |
|------|---|-------|------------|
| 文字顏色 | 中灰 | `sys/color/on-surface-variant` → neutral/600 | 灰色字 |
| 字重 | 500 medium | `sys/typography/weight/medium` | 正常粗細 |
| 底線顏色 | 透明 | `sys/color/surface` | 看不到底線 |
| 背景色 | 白色 | `sys/color/surface` → neutral/0 | 乾淨白底 |

### 4.3 Hover（滑鼠懸停）

只有桌面版會用到。手機沒有 hover。

| 屬性 | 值 | Token | 設計師看到的 |
|------|---|-------|------------|
| 文字顏色 | 深灰 | `sys/color/on-surface` → neutral/800 | 比 inactive 深一階 |
| 背景色 | 淺灰 | `sys/color/surface-dim` → neutral/50 | 淡灰底色暗示可互動 |

### 狀態之間的區別一覽

```
inactive  →  hover   →  active
灰字白底     深灰字灰底   橘字+橘底線
```

設計師只要記住：inactive 是灰的、hover 是微微深一點、active 是橘的加底線。

---

## 5. Indicator（底線）

底線是 Tab 最重要的視覺暗示——它告訴使用者「你現在在這裡」。

| 屬性 | 值 | 說明 |
|------|---|------|
| 粗細 | 3px | hardcode。低於 base-4 最小單位，不需要 token 化 |
| 圓角 | pill（radius 很大） | 兩端圓弧，看起來像一條小膠囊 |
| 位置 | 緊貼 tab item 底部 | 在全寬分隔線的上方 |
| 動畫 | 滑動過渡 | 切換 tab 時底線水平滑動到新位置 |

全寬的分隔線（1px，neutral/200）在底線下方，橫跨整個 tab bar。底線是「蓋在」分隔線上面的。

---

## 6. Layout（排版模式）

Tab bar 有兩種排法。在 Figma 裡是 Component Property `layout = fixed | scrollable`，不需要額外的 token。

### 6.1 Fixed（等寬）

每個 tab 寬度相同，平均分配容器寬度（flex: 1）。

```
┌──────────┬──────────┬──────────┬──────────┬──────────┐
│ 品牌旗艦  │ 公仔模型  │ 動漫周邊  │虛擬偶像周邊│ 組裝模型  │
└──────────┴──────────┴──────────┴──────────┴──────────┘
              tab bar 寬度 = 容器寬度
```

- 適合 tab 數量少（2~5 個）
- 每個 tab 文字長度接近時效果最好
- 分類館首頁 section tab bar 就是這種
- 容器可能是整個頁面、一張 card、一個 dialog——tab bar 都會自動撐滿

### 6.2 Scrollable（可捲動）

每個 tab 寬度依內容決定（hug content），超出容器時水平捲動。

```
┌─────────────────────────────────────┐
│ 全部 │ 可動公仔 │ PVC人偶 │ 塑膠組裝模型 │ 動漫收藏 │ 紙牌遊戲 │ 轉蛋食...
└─────────────────────────────────────┘
  ←───────── 可水平滑動 ──────────→
```

- 適合 tab 數量多（> 5 個）或文字長度差異大
- 工程端：overflow-x: auto + scroll-snap
- App 端：FlatList horizontal

### 怎麼選？

```
tab 數量 ≤ 5 且文字長度差不多？    → fixed
tab 數量 > 5 或文字長度差異很大？  → scrollable
```

---

## 7. Active 背景色的預留機制

Token 裡有定義 active tab 可以加一層淡橘色底色（`surface-brand-dim` = orange/50 = #FFF8F1），但 Figma 預設不啟用——就是白底，靠底線和字色區分就好。

這個淡橘底色是**預留的開關，目前關著**。以後如果某個品牌或頁面需要讓 active tab 更搶眼，設計師到 Figma 把 Variable 打開就行，不用重新定義 token。

**完整繼承鏈：**

```
comp/tab/active/background
  → sys/color/surface-brand-dim    （語意：品牌淡色底）
    → ref/color/orange/50           （Ruten 橘最淺 #FFF8F1）
```

多品牌好處：Ichiban 會自動切換到 blue/50，Resell 也是 blue/50。Tab 不管品牌色，它只認 `surface-brand-dim` 這個語意名稱。

---

## 8. Token 完整清單（29 tokens）

現有 28 + 新增 1 = 29 tokens。（indicator-height 是改值，不是新增）

### 8.1 Base 共用（4 tokens）

| Token | 值 | 說明 |
|-------|---|------|
| `comp/tab/border-radius` | `{sys.radius.md}` = 8px | Tab 圓角 |
| `comp/tab/gap` | `{sys.spacing.xs}` = 8px | Tab 之間的間距 |
| `comp/tab/indicator-height` | 3 | 底線粗細。hardcode，低於 base-4 |
| `comp/tab/font-weight` | `{sys.typography.weight.medium}` = 500 | 未選中的預設字重 |

### 8.2 Size tokens（16 tokens，4 size × 4 props）

| Token 路徑 | sm | md | lg | xl |
|-----------|----|----|----|----|
| `comp/tab/{size}/min-height` | 32px | 40px | 44px | 48px |
| `comp/tab/{size}/padding-h` | 12px | 16px | 24px | 32px |
| `comp/tab/{size}/padding-v` | 4px | 8px | 8px | 12px |
| `comp/tab/{size}/font-size` | 12px | 14px | 14px | 16px |

### 8.3 State tokens（9 tokens）

| Token 路徑 | 值 | 解析色碼 |
|-----------|---|---------|
| `comp/tab/active/font-weight` | `{sys.typography.weight.semibold}` | 600 |
| `comp/tab/active/text-color` | `{sys.color.primary}` | #FF963B 橘 |
| `comp/tab/active/indicator-color` | `{sys.color.primary}` | #FF963B 橘 |
| `comp/tab/active/background` | `{sys.color.surface-brand-dim}` | #FFF8F1 淡橘（預設不開）|
| `comp/tab/inactive/text-color` | `{sys.color.on-surface-variant}` | #73747B 中灰 |
| `comp/tab/inactive/indicator-color` | `{sys.color.surface}` | transparent |
| `comp/tab/inactive/background` | `{sys.color.surface}` | #FFFFFF 白 |
| `comp/tab/hover/background` | `{sys.color.surface-dim}` | #F6F7FE 淺灰 |
| **`comp/tab/hover/text-color`** | **`{sys.color.on-surface}`** | **#33343B 深灰 ← 新增** |

> 注意：第 29 個 token `comp/tab/hover/text-color` 是本次新增。indicator-height 是改值（2→3），不是新增。

---

## 9. 多品牌適配

Tab 的所有顏色都走 sys 層語意色，所以品牌切換時自動適配，設計師不用改 Tab 的任何設定。

| 品牌 | active text / indicator | active bg（如果開啟） |
|------|------------------------|---------------------|
| **Ruten 露天** | orange/500 #FF963B | orange/50 #FFF8F1 |
| **Ichiban 一抽入魂** | blue/500 #3B82F6 | blue/50（自動）|
| **Resell 預購市場** | blue/500 #3B82F6 | blue/50（自動）|

設計師在 Figma 切換品牌的 Variable Mode 就好，Tab 的橘色會自動變成藍色。

---

## 10. 場景對照表

### 10.1 分類館首頁

| 場景 | Size | Layout | Tabs 數量 |
|------|------|--------|----------|
| 優質賣家 section | md | fixed | 5（品牌旗艦/公仔模型/動漫周邊/虛擬偶像周邊/組裝模型）|
| 最新上架商品 section | md | fixed | 5（可動公仔/PVC人偶/塑膠組裝模型/動漫收藏/紙牌遊戲）|
| 熱銷商品 section | md | fixed | 5（同上）|

### 10.2 其他頁面（預估）

| 場景 | Size | Layout | 說明 |
|------|------|--------|------|
| 商品頁 detail tab | md | fixed | 商品描述/規格/評價/問答（3~4 tabs）|
| 賣家頁 profile tab | md | scrollable | 可能有很多分類（> 5 tabs）|
| App 設定頁 | sm | fixed | 空間緊湊，2~3 tabs |
| Desktop 管理後台 | lg | scrollable | 多 tab 管理面板 |

---

## 11. 與 Ant Design 的對照

我們的 Tab token 參考 Ant Design v5 的 component token 設計，但依露天需求做了調整。

| Ant Design Token | 露天對應 | 差異 |
|-----------------|---------|------|
| `inkBarColor` | `comp/tab/active/indicator-color` | 一致 |
| `itemSelectedColor` | `comp/tab/active/text-color` | 一致 |
| `itemColor` | `comp/tab/inactive/text-color` | 一致 |
| `itemHoverColor` | `comp/tab/hover/text-color` | 本次新增 |
| `itemActiveColor`（pressed） | — | 不做。露天 Tab 不需要 pressed 態 |
| `horizontalItemGutter` | `comp/tab/gap` | 一致 |
| `horizontalItemPadding` | `comp/tab/{size}/padding-h` | 我們依 size 分，Ant 只有 SM/MD/LG |
| `titleFontSize` | `comp/tab/{size}/font-size` | 同上 |
| `cardBg` / `cardHeight` | — | 不做。露天不用 card-type tabs |

---

## 12. 設計師 Do / Don't

### Do ✓

- Tab bar 寬度跟隨它所在的容器（可能是整個頁面、一張 card、一個 dialog），不要硬定義寬度
- Active 底線要貼齊 tab item 寬度，不要比文字短也不要比 tab item 長
- Tab 文字盡量短（2~5 個中文字），太長會擠壓其他 tab 的空間
- 切換 tab 時底線要有滑動動畫
- Scrollable 模式要在右側留 fade-out 暗示還有更多 tab
- Tab bar 放在內容區的最上方，讓使用者一眼知道可以切換

### Don't ✗

- 不要把 Tab 用在跳頁導航（那是 NavigationBar 的工作）
- 不要把 Tab 用在篩選商品（那是 Tag Filter 的工作）
- 不要在 Tab 裡放 icon（目前不支援，未來再評估）
- 不要自己定義 Tab 的顏色或字重——用 token
- 不要在 fixed layout 裡放超過 5 個 tab（改用 scrollable）
- 不要混用 fixed 和 scrollable 在同一頁
- 不要假設 Tab 一定是滿版——它可能在 card、dialog、側欄等各種容器裡

---

## 13. AI Agent $description 範例

新增和修改的 token 應該寫成這種格式：

```json
{
  "$value": 3,
  "$description": "Tab indicator height. 3px hardcoded, below base-4 scale. Rounded pill shape at bottom of active tab. Sits above the full-width divider."
}
```

```json
{
  "$value": "{sys.color.on-surface}",
  "$description": "Tab hover text color. Darker than inactive, lighter than active. Desktop only. Pair with comp/tab/hover/background."
}
```

```json
{
  "$value": "{sys.color.surface-brand-dim}",
  "$description": "Active tab background. Light brand tint. Reserved for emphasis scenarios, default transparent in Figma. Auto-adapts to brand color in multi-brand mode."
}
```

---

## 14. 待辦（進 Cowork 執行）

- [ ] JSON 修改：`comp/tab/indicator-height` 值 2 → 3，更新 $description
- [ ] JSON 新增：`comp/tab/hover/text-color` → `{sys.color.on-surface}`
- [ ] 驗證：跑 validate-design-system.py
- [ ] 衍生檔同步：更新 SKILL.md 的 tab token 數字（28 → 29）
- [ ] Figma：建 Tab Main Component + Variants（size × state × layout）
- [ ] Figma：Variable binding 全部 29 tokens

---

## 15. 版本紀錄

| 版本 | 日期 | 變更 |
|------|------|------|
| v1.0.0-draft | 2026-03-20 | 初始版本。4 Size（sm/md/lg/xl）。3 State（active/inactive/hover）。Indicator 3px。Layout fixed/scrollable。新增 hover/text-color token。Active background 預留機制。Ant Design 對照表。 |

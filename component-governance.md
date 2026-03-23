# Ruten Design System — Component 治理規則

> 版本：v1.2.0
> 建立：2026-03-18
> 更新：2026-03-20（Thumbnail component added + token count update）
> 狀態：已確認
> 適用對象：AI Agent、UX 設計師、前端工程師

---

## 1. 設計原則

本治理規則參考以下業界標竿設計系統，結合露天產品特性制定：

- **Material Design 3**：按功能分類 component（Action / Navigation / Containment 等），不用 Atomic Design 的 atom/molecule 命名
- **Shopify Polaris**：扁平化 component 結構，token 驅動一切治理，不區分結構層級
- **Ant Design**：Seed → Map → Alias 三層 token，每個 component 有獨立的 component token

**核心決策**：不採用 Atomic Design 的 atom/molecule/organism 命名。改用**功能類別 × 組合深度 × Token 擁有權**三維分類，更貼合 e-commerce 場景和 AI 驅動的開發流程。

---

## 2. 三維分類體系

每個 component 用三個維度描述：

```
[功能類別] × [組合深度] × [Token 擁有權]

範例：
  Button    = Action    × Primitive × Owned
  ProductCard = Display × Compound  × Owned (含 Slot Override)
  CategoryGrid = Layout × Pattern   × Inherited
```

---

## 3. 維度一：功能類別

按用途分類，對 e-commerce 全產品場景優化。八大類別：

| 功能類別 | 說明 | 範例 |
|---------|------|------|
| **Action** | 觸發操作的互動元件 | Button, Link, FAB |
| **Input** | 使用者輸入資料 | TextField, Checkbox, Radio, Switch, Select, Stepper, DatePicker |
| **Display** | 展示商品或內容資訊 | ProductCard, SectionModule, Banner, Table, List, Carousel, Image |
| **Navigation** | 頁面或區域間的導航 | NavigationBar, BottomNav, Tab, SearchBar, Breadcrumb, Pagination, Sidebar |
| **Feedback** | 狀態回饋、標記、通知 | Badge, Tag, Toast, Snackbar, ProgressBar, Spinner, Skeleton, EmptyState |
| **Overlay** | 覆蓋在頁面上的浮層元件 | Modal, Dialog, BottomSheet, Drawer, Popover, Tooltip, Dropdown |
| **Layout** | 結構佈局、區域分隔 | Divider, SectionHeader, Accordion, Grid, Spacer |
| **Media** | 媒體元素（圖像、圖示） | Avatar, Icon, Logo |

### 與 Material Design 3 的對照

| MD3 類別 | 露天類別 | 差異 |
|---------|---------|------|
| Action | Action | 一致 |
| Text Input | Input（擴大涵蓋選擇元件） | 擴充 |
| Containment | Display + Layout | 拆分：展示歸 Display，結構歸 Layout |
| Communication | Feedback | 重新命名，更直覺 |
| Navigation | Navigation | 一致 |
| Selection | Input（合併） | MD3 的 Checkbox/Radio/Switch 歸入 Input |
| — | Overlay（新增） | MD3 沒有獨立此類，露天的電商場景大量用 Modal/BottomSheet |
| — | Media（新增） | Icon/Avatar/Logo 獨立管理 |

### 新增功能類別的條件

只有在現有八大類別都無法合理歸入時，才新增類別。新增前需經過討論確認。

---

## 4. 維度二：組合深度

決定 token 規則和 RWD 策略。三層深度：

### 4.1 Primitive（基礎元件）

**定義**：最小可複用單位，不包含其他 Design System component。

**Token 規則**：
- 擁有完整的 `comp/{primitive}/` token 集（color、spacing、sizing、radius 等）
- 所有 token alias 到 sys 層（不跳層到 ref）
- Primitive 的 token **不引用**其他 Primitive 的 comp/ token

**互動控件高度（control-height 體系）**：

參考 Ant Design v5 的 controlHeight Map Token，所有互動控件的 min-height 統一由 `sys/sizing/control-height/*` 管理。

| sys token | 值 | 對應元件 |
|-----------|---|---------|
| control-height/xs | 16px | Tag s |
| control-height/sm | 20px | Tag m |
| control-height/md | 28px | Tag l |
| control-height/default | 32px | Button sm, Tab sm, SearchBar |
| control-height/lg | 36px | Tag lg-alt |
| control-height/xl | 40px | Button md, Tab md（= WCAG 最小觸碰目標） |
| control-height/2xl | 44px | Tab lg |
| control-height/3xl | 48px | Button lg, Tab xl, NavigationBar |
| control-height/4xl | 52px | Button xl |

工程端垂直 padding 計算公式（參考 Ant Design）：
```
paddingBlock = (controlHeight - fontHeight) / 2 - borderWidth
```
controlHeight 是固定高度（設計決策），padding 是反推的（工程實作）。

**高度計算範例（Button sm = 32px）**：
```
controlHeight = 32px（← token 控制，設計師決定）
fontHeight    = fontSize 14px × lineHeight 1.57 ≈ 22px（← Text Style 控制）
borderWidth   = 1px（← token 控制）

paddingBlock  = (32 - 22) / 2 - 1 = 4px（← 工程端算出來的，不需要 token）

驗算：1(上邊框) + 4(上padding) + 22(文字) + 4(下padding) + 1(下邊框) = 32px ✅
```

**controlHeight 常見問題**：

| 問題 | 答案 |
|------|------|
| controlHeight 是固定高度還是最小高度？ | **固定高度。** 工程端用 CSS `height` 或 `min-height` + `flex align-items: center` 實作 |
| line-height 會撐開嗎？ | **不會。** padding 是反推的，保證總高度 = controlHeight |
| padding-v 需要 token 嗎？ | **不需要。** 工程端用公式算。但既有的 Button/Tab padding-v token 保留，Figma Auto Layout 需要 |
| fontSize 改了怎麼辦？ | padding 自動重新計算，controlHeight 不變 |
| fontHeight > controlHeight 怎麼辦？ | **不允許。** 每個 control-height 階級配對固定的 Text Style，設計師不能任意把大字塞進小控件 |

**驗算範例 2（Tag l = 28px）**：
```
controlHeight = 28px     ← sys/sizing/control-height/md
fontSize      = 13px     ← sys/typography/body/md-alt
lineHeight    = 1.54     ← Text Style
fontHeight    = 13 × 1.54 ≈ 20px
borderWidth   = 1px      ← sys/border/width/default

paddingBlock  = (28 - 20) / 2 - 1 = 3px

驗算：
  1px  (上邊框)
+ 3px  (上 padding)
+ 20px (文字)
+ 3px  (下 padding)
+ 1px  (下邊框)
= 28px ✅
```

**Text Style 配對表**（每個 control-height 有建議 fontSize 上限，超過會導致 padding 為負）：

| control-height | 可用值 | fontSize 上限 | 建議 Text Style |
|---------------|--------|-------------|----------------|
| xs (16px) | 8px | ~10px | label-2xs (8px) |
| sm (20px) | 10px | ~13px | label-xs (10px) |
| md (28px) | 13px | ~18px | body-md-alt (13px) |
| default (32px) | 12-14px | ~20px | label-md (12px), label-lg (14px) |
| lg (36px) | 14px | ~24px | body-md (14px) |
| xl (40px) | 14px | ~28px | label-lg (14px) |
| 2xl (44px) | 14px | ~32px | title-sm (14px) |
| 3xl (48px) | 14-16px | ~36px | title-sm (14px) |
| 4xl (52px) | 16px | ~40px | title-md (16px) |

**comp 層引用方式**（所有互動控件 min-height alias 到 sys/sizing/control-height/*）：

```
comp/button/sm/min-height   → {sys.sizing.control-height.default}   (32px)
comp/button/md/min-height   → {sys.sizing.control-height.xl}        (40px)
comp/button/lg/min-height   → {sys.sizing.control-height.3xl}       (48px)
comp/button/xl/min-height   → {sys.sizing.control-height.4xl}       (52px)
comp/tab/sm/min-height      → {sys.sizing.control-height.default}   (32px)
comp/tab/md/min-height      → {sys.sizing.control-height.xl}        (40px)
comp/tab/lg/min-height      → {sys.sizing.control-height.2xl}       (44px)
comp/tab/xl/min-height      → {sys.sizing.control-height.3xl}       (48px)
comp/tag/base/s/min-height  → {sys.sizing.control-height.xs}        (16px)
comp/tag/base/m/min-height  → {sys.sizing.control-height.sm}        (20px)
comp/tag/base/l/min-height  → {sys.sizing.control-height.md}        (28px)
comp/tag/base/lg-alt/min-height → {sys.sizing.control-height.lg}    (36px)
comp/search-bar/height      → {sys.sizing.control-height.default}   (32px)
comp/nav-bar/height         → {sys.sizing.control-height.3xl}       (48px)
comp/bottom-nav/center-button/size → {sys.sizing.control-height.xl} (40px)
```

**AI Agent control-height 指引**：
1. 新增互動控件時：min-height 一律 alias 到 sys/sizing/control-height/*，不能寫死數值
2. 選擇哪個階級：先看觸碰目標需求（WCAG ≥ 40px = xl）→ 看搭配 fontSize → 看視覺密度
3. padding 不要自己算：設計側用 Figma Auto Layout 既有 padding-v token，工程側用公式
4. 需要新階級時：先確認 9 個現有階級都不符合，新增需討論確認

**RWD 規則**：
- 透過 Figma Variant `size = sm/md/lg/xl` 實現
- 每個 size variant 有獨立的 token 值
- 工程端：CSS class 或 React Native prop 切換 size

**Figma 實作**：
- Main Component + size Variants
- Variable binding 到 comp/ token

**全產品 Primitive Registry**：

| Component | 功能類別 | Tokens | 狀態 | 說明 |
|-----------|---------|--------|------|------|
| Button | Action | 64 | ✅ Done | sm/md/lg/xl × primary/secondary/ghost × states |
| Link | Action | — | 🔲 Future | text link, underline/no-underline |
| Tab | Navigation | 33 | ✅ Done | sm/md/lg/xl × active/inactive/hover + secondary emphasis |
| Tag | Feedback | 74 | ✅ Done | filter/display/action × sm/md/lg/xl |
| Badge | Feedback | 11 | ✅ Done | dot/count |
| Icon | Media | 8 | ✅ Done | xs/sm/md/lg × size + color |
| Avatar | Media | 11 | ✅ Done | xs/sm/md/lg/xl/2xl × circle + active border |
| Thumbnail | Media | 11 | ✅ Done | xs/sm/md/lg/xl/2xl × circle + active border |
| Divider | Layout | 5 | ✅ Done | hairline/default/heavy thickness |
| SearchBar | Navigation | 11 | ✅ Done | default/focus × pill shape |
| TextField | Input | — | 🔲 Backlog | default/focus/error/disabled × label + helper text |
| Checkbox | Input | — | 🔲 Backlog | default/checked/indeterminate × disabled |
| Radio | Input | — | 🔲 Backlog | default/selected × disabled |
| Switch | Input | — | 🔲 Backlog | on/off × disabled |
| Select (Dropdown) | Input | — | 🔲 Backlog | default/open/disabled |
| Stepper | Input | — | 🔲 Backlog | 數量加減（商品購買） |
| Spinner | Feedback | — | 🔲 Backlog | sm/md/lg |
| Skeleton | Feedback | — | 🔲 Backlog | text/rect/circle placeholder |
| ProgressBar | Feedback | — | 🔲 Backlog | determinate/indeterminate |
| Logo | Media | — | 🔲 Future | Ruten/Ichiban/Resell brand logos |
| Image | Display | — | 🔲 Future | placeholder + loading + error states |

> **狀態說明**：✅ Done = token 已定義 | 🔲 This week = 本週定義 | 🔲 Backlog = 有 UI 時再定義 | 🔲 Future = 規劃中

### 4.2 Compound（組合元件）

**定義**：由 2 個以上 Primitive 組合而成，有獨立功能，在多個頁面或場景中複用。

**Token 規則**：
- 擁有自己的 `comp/{compound}/` token，管這個元件**所有不屬於獨立子 Primitive 的屬性**
- 包含容器佈局（padding、gap、border-radius、elevation）**和**非獨立子元素的外觀（icon color/size、label color、indicator 等）
- 判斷標準：**子元素有沒有自己獨立的 comp/ token 集？**
  - 有（如 SearchBar、Button、Tag）→ 子 Primitive 自己管，需要覆寫走 Slot Override（§5）
  - 沒有（如 BottomNav 的 tab item、NavigationBar 的 back arrow icon）→ Compound 直接管
- 參考 Material Design 3 component token 做法：每個 component token 管該元件所有對外暴露的設計決策，不區分佈局與視覺
- 允許 comp → comp 引用
- **Slot Override**（規則 3a）：當**獨立**子 Primitive 在此 context 有特殊視覺需求時，允許定義覆寫 token（見第 5 節詳細說明）

**RWD 規則**：
- 可有 size variant（如 ProductCard sm/md）
- 或 layout variant（如 NavigationBar mobile/tablet）
- 工程端：CSS class 或 prop 切換

**Figma 實作**：
- Main Component + Variants（size 或 layout）
- Container 屬性綁 comp/ token
- 子 Primitive 用 Instance，繼承子 Primitive 的 token

**全產品 Compound Registry**：

| Component | 功能類別 | Tokens | 狀態 | 組成 |
|-----------|---------|--------|------|------|
| ProductCard | Display | 51 | ✅ Done | Image + Tag + Badge + 文字 + 價格 |
| SectionHeader | Layout | 7 | ✅ Done | Icon + 標題文字 (+副標/日期) |
| SectionModule | Display | 7 | ✅ Done | SectionHeader + Slot A (filter) + Slot B (content) + Footer |
| NavigationBar | Navigation | 6 | ✅ Done | SearchBar + Icon × 2 |
| BottomNav | Navigation | 12 | ✅ Done | Icon × 5 + Badge + 文字 + center button |
| Banner (Container) | Display | 4 | ✅ Done | 固定外框，Content 為 Pattern |
| Form Field | Input | — | 🔲 Backlog | TextField/Select + Label + HelperText + ErrorText |
| Modal | Overlay | — | 🔲 Backlog | Header + Body + Footer (Button × 2) |
| Dialog | Overlay | — | 🔲 Backlog | Title + Message + Button × 2 |
| BottomSheet | Overlay | — | 🔲 Backlog | Handle + Header + scrollable Body |
| Toast / Snackbar | Feedback | — | 🔲 Backlog | Icon + Message + Action Button |
| Table | Display | — | 🔲 Backlog | Header Row + Body Rows + Pagination |
| List Item | Display | — | 🔲 Backlog | Avatar/Icon + Text + Action |
| Breadcrumb | Navigation | — | 🔲 Backlog | Link × N + Separator |
| Pagination | Navigation | — | 🔲 Backlog | Button × N + Prev/Next |
| Accordion | Layout | — | 🔲 Backlog | Header (Icon + Title) + collapsible Body |
| EmptyState | Feedback | — | 🔲 Future | Image + Title + Description + Button |
| Tooltip | Overlay | — | 🔲 Future | Arrow + Content |
| Popover | Overlay | — | 🔲 Future | Arrow + rich Content |
| Dropdown Menu | Overlay | — | 🔲 Future | List Item × N |
| Drawer (Side Panel) | Overlay | — | 🔲 Future | Header + scrollable Body |
| Carousel | Display | — | 🔲 Future | Image × N + indicator dots |

### 4.3 Pattern（佈局模式）

**定義**：由 Compound + Primitive 組合成的頁面區域。不在 Design System Library 中作為 Main Component 發布。

**Token 規則**：
- **不建 comp/ token**
- 直接使用 sys/ token（sys/spacing、sys/grid 等）
- AI 生成程式碼時，用 sys/ token + CSS layout logic

**RWD 規則**：
- CSS grid/flex 的 columns、gap 自動適應容器寬度
- 不需要 size variant
- 工程端：CSS media query 或 grid auto-fit

**Figma 實作**：
- Section-level frame，不是 Main Component
- 不做 Variable binding（用手動或 Auto Layout 設定）

**全產品 Pattern Registry**：

| Pattern | 功能類別 | 狀態 | 組成 | RWD 行為 |
|---------|---------|------|------|---------|
| CategoryGrid | Layout | 🔲 This week | Avatar × N + Button | 3→4 columns |
| HorizontalScroll | Layout | 🔲 This week | ProductCard × N 或 Avatar × N | gap + scroll-snap |
| Banner Content | Display | 🔲 This week | 文字 + 圖片 + CTA（在 Banner Container 內） | 內容自由排版 |
| QuickInfoBar | Layout | 🔲 This week | Icon × 3 + 文字 | 橫排自適應 |
| Ranking Section | Display | 🔲 This week | SectionHeader + LeaderboardCard × N | 橫滑 |
| Form Layout | Input | 🔲 Backlog | Form Field × N + Button | 單/雙欄切換 |
| Product Grid | Display | 🔲 Backlog | ProductCard × N in grid | 2→3→4 columns |
| Filter Bar | Input | 🔲 Backlog | Tag × N + sort Select | 橫排自適應 |
| Order Summary | Display | 🔲 Future | List Item × N + Divider + 金額 | 單欄 |
| Checkout Flow | Input | 🔲 Future | Form Layout × N + steps | 多步驟 |

---

## 5. 規則 3a：Slot Override

### 定義

當 Compound 內的子 Primitive 在此 context 有特殊視覺需求時，允許 Compound 定義覆寫 token。

### 條件

- 只在子 Primitive 的預設值不符合此 context 時才建立
- 不是每個子 Primitive 都需要 Slot Override

### 命名格式

```
comp/{compound}/{slot}/{property}
```

### Token 規則

- Slot Override **必須 alias 到 sys 層**，不能 alias 到子 Primitive 的 comp/ token
- `$description` 必須以 `"Slot override."` 開頭

### 範例

```json
{
  "comp/product-card/tag-brand/background": {
    "$value": "{sys.color.price}",
    "$description": "Slot override. Background color for brand grading tag inside product card. Use sys/color/price (red) to indicate store quality."
  },
  "comp/product-card/tag-brand/text-color": {
    "$value": "{sys.color.on-price}",
    "$description": "Slot override. Text color on brand grading tag. Pair with comp/product-card/tag-brand/background."
  }
}
```

對比 Tag Primitive 的預設值：
```json
{
  "comp/tag/filled/background": {
    "$value": "{sys.color.primary}",
    "$description": "Default background for filled tag. Use for generic category labels."
  }
}
```

### AI Agent 判斷邏輯

AI 看到 `$description` 以 `"Slot override."` 開頭時：
1. 知道這個 token 是為特定 Compound context 定義的
2. 生成程式碼時，在該 Compound 內使用此 token，而非子 Primitive 的預設 token
3. 在其他 context 使用該 Primitive 時，用 Primitive 的預設 token

---

## 6. RWD 治理規則

### 各層級的 RWD 邊界

| 組合深度 | RWD 機制 | Token 層 | 工程實作 | Figma 表達 |
|---------|---------|---------|---------|-----------|
| **Primitive** | size variant (sm/md/lg/xl) | comp/ token 每個 size 有值 | CSS class 或 RN prop 切 size | Variant `size` |
| **Compound** | size variant 或 layout variant | comp/ token 管佈局 | CSS class 或 RN prop | Variant `size` 或 `layout` |
| **Pattern** | CSS layout（columns + gap） | sys/ token | CSS media query / grid auto-fit | 兩版 frame (375/768) |
| **Page** | breakpoint frame | sys/grid + sys/spacing | CSS media query / RN Dimensions | 兩版 frame (375/768) |

### 斷點定義（已鎖定）

```
sm: 375px  （手機）
md: 768px  （平板）
lg: 992px  （桌面小）
xl: 1200px （桌面大）
```

### RWD 決策流程

```
1. 這個視覺變化是「元件本身的大小」變了嗎？
   → 是 → Primitive/Compound 的 size variant
2. 這個視覺變化是「元件的排列方式」變了嗎？
   → 是 → Pattern 的 CSS layout（columns、gap）
3. 這個視覺變化是「頁面結構」變了嗎？
   → 是 → Page 的 breakpoint frame
```

---

## 7. 新增 Component 決策流程

每次遇到新的 UI 元素，走這個流程：

```
Step 1: 已有 component 可以覆蓋嗎？
  │
  ├─ 結構相同，只是視覺屬性不同 → 用 Variant 擴充（規則 A）
  │
  ├─ 功能相同但結構完全不同 → 新 Component，同功能類別（規則 B）
  │
  └─ 功能完全不同 → 新 Component，可能新功能類別（規則 C）

Step 2: 功能類別是什麼？
  → 歸入 Action / Input / Display / Navigation / Feedback / Overlay / Layout / Media

Step 3: 包含其他 DS component 嗎？
  │
  ├─ 否 → Primitive
  │    → 完整 comp/ token 集
  │    → size variant (sm/md/lg/xl)
  │
  ├─ 是，且跨頁面複用 → Compound
  │    → comp/ token 只管佈局
  │    → 需要時建 Slot Override
  │    → size 或 layout variant
  │
  └─ 是，但只在特定 section 出現 → Pattern
       → 不建 comp/ token
       → 用 sys/ token + CSS layout
       → 不做 Main Component

Step 4: 定義 token
  → 每個 token 必須有 $description（imperative style）
  → Slot Override 的 $description 以 "Slot override." 開頭

Step 5: 定義 RWD
  → Primitive/Compound: size variant
  → Pattern: CSS layout
```

### 規則 A：結構相同 → Variant

新需求和現有 component 的 DOM 結構相同（相同的子元件組合），只是視覺屬性不同。

範例：LeaderboardCard = ProductCard 的 `variant=leaderboard`

### 規則 B：結構不同但功能相同 → 新 Component

功能一樣但結構完全不同，建新 component，放在同一個功能類別下。

範例：如果未來有「大圖商品卡」跟「小圖商品卡」結構完全不同 → `comp/product-card-large/`

### 規則 C：功能不同 → 新 Component

功能完全不同，建新 component。

範例：限時搶購倒數計時器 → Feedback 類 Primitive `comp/countdown-timer/`

---

## 8. 邊界案例表

分類不明顯的 component，記錄決策理由供未來參考。

| Component | 歸類 | 爭議點 | 決策理由 |
|-----------|------|--------|---------|
| SearchBar | **Primitive** | 含 Icon，像 Compound | 作為完整互動單元不可再拆分。使用者不會單獨用 SearchBar 裡面的 Icon 或 placeholder。 |
| SectionHeader | **Compound** | 結構極簡（Icon + Title），像 Primitive | 由兩個獨立 Primitive（Icon + 文字）組合，且 Icon 可選可無，有組合邏輯。 |
| LeaderboardCard | **Compound（ProductCard variant）** | 結構像 ProductCard 但視覺差異大 | 共用 ProductCard 的佈局結構，用 Variant + Slot Override 處理差異。避免重複定義類似結構。 |
| Banner | **Compound (Container) + Pattern (Content)** | 每檔活動內容不同，未來有 AI 產生內容 | Container 提供固定外框（圓角、尺寸、padding），Content 自由排版。AI 產內容時只需遵守 Container 的 token 約束。 |
| HorizontalScroll | **Pattern** | 它是容器還是 component？ | 只是佈局行為（橫向滾動 + gap），不是有視覺身份的 component。用 CSS 實現，不需 comp/ token。 |
| TextField | **Primitive (Input)** | 含 Label 和 HelperText，像 Compound | Label 和 HelperText 不是獨立的 DS component，是 TextField 的內部結構。TextField 作為完整輸入單元歸 Primitive。 |
| Form Field | **Compound (Input)** | 跟 TextField 重疊？ | Form Field = TextField/Select + validation logic + error state 的外框容器。多個 Form Field 組合成 Form Layout (Pattern)。 |
| Table | **Compound (Display)** | 太大太複雜？ | Table 是 Header Row + Body Row + Pagination 的組合。每個 Row 是 Compound，Table 本身也是 Compound（跨頁面大量複用）。 |
| Modal | **Compound (Overlay)** | 歸 Overlay 還是 Layout？ | Modal 的核心行為是「覆蓋頁面、阻斷互動」，這是 Overlay 的定義。Layout 不阻斷互動。 |
| BottomSheet | **Compound (Overlay)** | App 才有，Web 不用？ | React Native 大量使用，Vue Web 可用 Drawer 替代。兩者都歸 Overlay，用不同 component 名。 |
| Dropdown Menu | **Compound (Overlay)** | 跟 Select 什麼關係？ | Select 是 Primitive（輸入控制），Dropdown Menu 是 Overlay（浮層呈現選項列表）。Select 內部可用 Dropdown Menu 實現。 |
| Toggle/業務狀態按鈕 | **不是 Component，是 Wrapper Pattern** | 要不要為每個業務狀態建獨立 component？ | Toggle 行為是業務邏輯，不是設計系統的視覺元件。Wrapper 只傳 props 給 base button（role/form/iconPosition/size/width/state），不建新 token。參考 button-usage-guideline.md §11。 |
| Thumbnail vs Avatar | **兩個獨立 Primitive** | 視覺結構相同（圓形 + size + active border），要不要合併成一個 component？ | 語義不同：Avatar = 人/商家，Thumbnail = IP/主題/分類。行為不同：Thumbnail 有 selector 互動。參考 Shopify Polaris 的拆法。Token 結構相同但路徑獨立（comp/avatar/ vs comp/thumbnail/），未來 Thumbnail 可能擴充方形變體。 |

### 新增邊界案例的時機

- 團隊對某個 component 的分類有分歧時
- 新 component 的結構跨越 Primitive/Compound/Pattern 邊界時
- 記錄決策理由，避免未來重複討論

---

## 9. Token 擁有權

| 擁有權 | 說明 | 適用層級 |
|--------|------|---------|
| **Owned** | 擁有自己的 comp/ token，在 JSON 中可修改 | Primitive、Compound |
| **Slot Override** | Compound 為子 Primitive 建立的覆寫 token | Compound（特殊情況） |
| **Inherited** | 直接用 sys/ token，沒有自己的 comp/ token | Pattern |

---

## 10. 給 AI Agent 的摘要

```
讀取 component 資訊時：
1. 看功能類別 → 知道這個 component 做什麼用
   Action / Input / Display / Navigation / Feedback / Overlay / Layout / Media
2. 看組合深度 → 知道 token 規則
   - Primitive: 用 comp/{name}/ token（完整集）
   - Compound: 用 comp/{name}/ token（所有非獨立子元素屬性）+ 獨立子 Primitive 的 token
   - Pattern: 用 sys/ token + CSS layout（不建 comp/）
3. 看 $description → 知道設計意圖
   - "Slot override." 開頭 = 此 context 的特殊覆寫
4. 生成 RWD 時：
   - Primitive/Compound: 切 size variant（sm/md/lg/xl）
   - Pattern: 用 CSS grid/media query
5. 新 component 進來時：
   - 先查 Registry（§4 的三張表）看有沒有已定義的
   - 沒有 → 走決策流程（§7）
   - 有邊界爭議 → 查邊界案例表（§8）
```

---

## 11. 與現有規則的關係

| 舊規則 | 新規則 | 狀態 |
|--------|--------|------|
| Type A Standard | Primitive + Compound (Owned) | **取代** |
| Type B Composite | Compound (Slot Override) | **取代** |
| Type C Assets | Primitive (Media 類) | **取代** |
| ref → sys → comp 三層 token | 不變 | **保留** |
| comp → comp 引用合法 | 不變（Compound 引用子 Primitive） | **保留** |
| RWD size variant sm/md/lg/xl | 不變（限 Primitive/Compound 層） | **保留 + 擴充 Pattern 層規則** |
| design-system-all.json = SOT | 不變 | **保留** |

---

## 12. Source of Truth & Governance

> 原 `design-system-governance.md` 內容整合於此（2026-03-23）

### 12.1 Source of Truth

**唯一真實來源：`design-system-all.json`**

所有擴充、修正、命名調整、token alias、component mapping，一律先改 `design-system-all.json`。其他檔案都屬於衍生檔，不能先自行定義規則。如果衍生檔與 JSON 衝突，一律以 JSON 為準。

### 12.2 Current Baseline

See `design-system-all.json` for current counts. Run `python3 sync-derived-files.py` to update all derived file numbers.

Text Styles: 130 (CH/PingFang TC 65 + EN/SF Pro 65, Mono removed)

### 12.3 Locked Decisions

- `label-2xs` = 8px
- `body-md-alt` = 13px（legacy compatibility）
- `price color` = `sys/color/price`（紅色，非品牌橘）
- `design-system-all.json` = source of truth
- Text Styles baseline = 130
- Mono is removed from both source-of-truth and text-style script
- `sys/sizing/control-height/*` = 互動控件高度統一管理（參考 Ant Design controlHeight）
- Compound token 管所有非獨立子元素屬性（參考 MD3 component token）
- 元件 padding-v 由工程端用公式計算：`(controlHeight - fontHeight) / 2 - borderWidth`
- icon-color 和 text-color 分開（語義不同）
- Button icon-color aliases text-color（comp→comp, Ant Design currentColor pattern）
- Icon component vector fill bound to `comp/icon/md/color` Variable
- iconPosition is Component Property, not variant（MD3 pattern）
- 刪除 Variable Collection 再匯入會斷綁定 → 永遠用 overlay import

### 12.4 Update Flow

1. Modify `design-system-all.json`
2. Run `python3 validate-design-system.py --root .`
3. Run `python3 sync-derived-files.py` to update derived file numbers
4. Fix any remaining issues
5. Rebuild snapshot / zip only after validation passes

### 12.5 Derived Files

| 衍生檔 | 同步內容 |
|--------|---------|
| `SKILL.md` | Token 總數 |
| `component-governance.md` | Baseline + Registry 數字 |
| `EXECUTION_PLAN.md` | 頂部總數 + 元件表 |
| `CLAUDE.md` | 架構描述數字 |
| `token-migration-map.md` | 舊→新 token mapping |
| `design-system-viewer-live.html` | 直接 fetch JSON（自動同步） |
| `design-system-viewer.html` | 快照（需手動更新） |
| `create-text-styles.js` | Scripter script |

---

## Appendix A: Architecture Decisions Log

> 原 `design-system-progress.md` 歷史決策記錄（2026-03-23 整合）

| 決策 | 結論 | 理由 |
|------|------|------|
| Collection 策略 | **單一 Collection** | 同 collection alias 匯入即生效 |
| Namespace | **不加** `ruten/` | ref 三品牌共用 |
| 色彩命名 | **純色相** | MD3 ref 不帶語義 |
| text-decoration | **sys 層** | 業界標準，AI 可讀 |
| Grid | **sys 層** | 組合式決策，非原子值 |
| Breakpoint | **ref 層** | 原子數字 |
| RWD 策略 | **Size variants (sm/md/lg/xl)** | Professional plan 只有 1 mode，不能用 Variable Modes |
| Typography Figma | **Text Styles** | Variables 一個一個綁太慢，Text Styles 一鍵套用 |
| Typography Token | **保留在 JSON** | AI 和工程師需要讀取 |
| 價格顏色 | **紅色 sys/color/price** | 非 error 語義，獨立的促銷價格紅 |
| 13px | **body-md-alt** | legacy compatibility，建議新設計用 14px |
| label-2xs | **8px（非 9px）** | 對齊實際設計（銷售999+） |
| Button icon-color | **comp→comp alias text-color** | Ant Design currentColor pattern：icon 預設跟隨文字色，未來可獨立覆寫 hover/disabled 等狀態 |
| Icon vector fill | **bound to `comp/icon/md/color`** | 單一 Variable 綁定所有 icon vector fill，語義統一、Figma 批次換色 |
| iconPosition | **Component Property（非 variant）** | MD3 pattern：不影響外觀尺寸的屬性用 Property 而非 Variant，減少 variant 組合爆炸 |
| icon-color 分離 | **獨立 token 但 alias text-color** | governance §12.3 要求 icon-color 與 text-color 分離，但預設值相同以降低維護成本 |

### 已解決的高風險點

| 問題 | 原因 | 解法 |
|------|------|------|
| 13px 不在標準 scale | 舊設計遺留 | body-md-alt legacy token |
| label-2xs 9px vs 實際 8px | token 與設計不一致 | 改成 8px |
| 價格用紅色不是橘色 | 設計決策 | 新增 sys/color/price |
| Mono 殘留 | Text Styles 與 source of truth 分裂 | 徹底移除 Mono |

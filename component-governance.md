# Ruten Design System — Component 治理規則

> 版本：v1.0.0
> 建立：2026-03-18
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

按用途分類，對 e-commerce 場景優化。設計師和 AI 找 component 時先看這個分類。

| 功能類別 | 說明 | 目前的 Component |
|---------|------|-----------------|
| **Action** | 觸發操作的互動元件 | Button |
| **Display** | 展示商品或內容資訊 | ProductCard, FeatureCard, Banner (Container) |
| **Navigation** | 頁面或區域間的導航 | NavigationBar, BottomNav, Tab, SearchBar |
| **Feedback** | 狀態回饋、標記、通知 | Badge, Tag |
| **Layout** | 結構佈局、區域分隔 | Divider, SectionHeader, HorizontalScroll, CategoryGrid |
| **Media** | 媒體元素（圖像、圖示） | Avatar, Icon |

### 新增功能類別的條件

只有在現有六大類別都無法合理歸入時，才新增類別。新增前需經過討論確認。

---

## 4. 維度二：組合深度

決定 token 規則和 RWD 策略。三層深度：

### 4.1 Primitive（基礎元件）

**定義**：最小可複用單位，不包含其他 Design System component。

**Token 規則**：
- 擁有完整的 `comp/{primitive}/` token 集（color、spacing、sizing、radius 等）
- 所有 token alias 到 sys 層（不跳層到 ref）
- Primitive 的 token **不引用**其他 Primitive 的 comp/ token

**RWD 規則**：
- 透過 Figma Variant `size = sm/md/lg/xl` 實現
- 每個 size variant 有獨立的 token 值
- 工程端：CSS class 或 React Native prop 切換 size

**Figma 實作**：
- Main Component + size Variants
- Variable binding 到 comp/ token

**目前的 Primitive**：

| Component | 功能類別 | Tokens | 說明 |
|-----------|---------|--------|------|
| Button | Action | 49 | sm/md/lg/xl × primary/secondary/ghost × states |
| Tab | Navigation | 28 | sm/md/lg/xl × active/inactive/hover |
| Tag | Feedback | 61 | filter/display/action × sm/md/lg/xl |
| Badge | Feedback | 11 | dot/count |
| Icon | Media | 8 | xs/sm/md/lg × size + color |
| Avatar | Media | 待定義 | sm/md/lg × circle/square |
| Divider | Layout | 待定義 | horizontal/vertical |
| SearchBar | Navigation | 待定義 | default/focus/disabled |

### 4.2 Compound（組合元件）

**定義**：由 2 個以上 Primitive 組合而成，有獨立功能，在多個頁面或場景中複用。

**Token 規則**：
- 擁有自己的 `comp/{compound}/` token，**只管佈局屬性**：container padding、gap、background、border-radius、elevation
- 子 Primitive 的樣式由子 Primitive 的 comp/ token 控制
- 允許 comp → comp 引用
- **Slot Override**（規則 3a）：當子 Primitive 在此 context 有特殊視覺需求時，允許定義覆寫 token（見第 5 節詳細說明）

**RWD 規則**：
- 可有 size variant（如 ProductCard sm/md）
- 或 layout variant（如 NavigationBar mobile/tablet）
- 工程端：CSS class 或 prop 切換

**Figma 實作**：
- Main Component + Variants（size 或 layout）
- Container 屬性綁 comp/ token
- 子 Primitive 用 Instance，繼承子 Primitive 的 token

**目前的 Compound**：

| Component | 功能類別 | Tokens | 組成 |
|-----------|---------|--------|------|
| ProductCard | Display | 51 | Image + Tag + Badge + 文字 + 價格 |
| SectionHeader | Layout | 待定義 | Icon + 標題文字 (+副標/日期) |
| FeatureCard | Display | 待定義 | Image + SectionHeader + Button |
| NavigationBar | Navigation | 待定義 | SearchBar + Icon × 2 |
| BottomNav | Navigation | 待定義 | Icon × 5 + Badge + 文字 |
| Banner (Container) | Display | 待定義 | 固定外框結構，內容為 Pattern |

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

**目前的 Pattern**：

| Pattern | 組成 | RWD 行為 |
|---------|------|---------|
| CategoryGrid | Avatar × N + Button | 3→4 columns |
| HorizontalScroll | ProductCard × N 或 Avatar × N | gap + scroll-snap |
| Banner Content | 文字 + 圖片 + CTA（在 Banner Container 內） | 內容自由排版 |
| QuickInfoBar | Icon × 3 + 文字 | 橫排自適應 |
| Ranking Section | SectionHeader + LeaderboardCard × N | 橫滑 |

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
  → 歸入 Action / Display / Navigation / Feedback / Layout / Media

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
2. 看組合深度 → 知道 token 規則
   - Primitive: 用 comp/{name}/ token
   - Compound: 用 comp/{name}/ token（佈局）+ 子 Primitive 的 token
   - Pattern: 用 sys/ token + CSS layout
3. 看 $description → 知道設計意圖
   - "Slot override." 開頭 = 此 context 的特殊覆寫
4. 生成 RWD 時：
   - Primitive/Compound: 切 size variant
   - Pattern: 用 CSS grid/media query
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

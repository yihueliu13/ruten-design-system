# Ruten Design System — NavigationBar 使用規則

> **版本**: v2.0.0
> **日期**: 2026-03-27
> **狀態**: 已定稿
> **依據**: design-system-all.json（唯一真實來源）
> **分類**: Navigation × Compound × Owned（14 tokens）

---

## 1. 元件定義

NavigationBar 是 Navigation 類 Compound component，用於 App / Mobile 版頂部導航列，位於系統 StatusBar 下方。14 個 comp tokens。

NavigationBar 有兩個維度的 variant：
- **surface**：`brand`（品牌色底）| `default`（白底）
- **layout**：`search`（嵌入 SearchBar）| `title`（顯示頁面標題）

PC 版不使用 NavigationBar — PC 的頂部導航是全站 Global Header，結構完全不同，不在此 component 範圍。

---

## 2. 結構

```
┌─ NavigationBar (48px) ─────────────────────────────────┐
│ [leftSlot] [gap 12px] [centerSlot] [gap 12px] [rightSlot] │
└────────────────────────────────────────────────────────┘
```

- **leftSlot**：back arrow icon 或 hamburger menu（24px）
- **centerSlot**：SearchBar instance（layout=search）或 page title text（layout=title）
- **rightSlot**：action icons（cart、notification、chat 等），24px，多個 icon 間 gap 12px

三個 Slot 之間用 `gap`（12px）分隔，左右各有 `padding-h`（16px）。

---

## 3. Variant Matrix

### 3a. surface × layout 組合

| surface | layout | 背景色 | 文字/Icon 色 | 使用場景 |
|---------|--------|--------|-------------|---------|
| **brand** | **search** | 品牌橘 `surface-brand` | 白色 `on-surface-brand` | App 首頁、分類館首頁 |
| **brand** | **title** | 品牌橘 `surface-brand` | 白色 `on-surface-brand` | Ichiban 內頁標題（品牌強調） |
| **default** | **title** | 白色 `surface` | 深灰 `on-surface` | 競標、商品頁、設定頁等內頁 |
| **default** | **search** | 白色 `surface` | 深灰 `on-surface` | 內頁搜尋模式（展開搜尋框） |

### 3b. surface 色彩對照

| Token | surface=brand | surface=default |
|-------|--------------|----------------|
| background | `sys/color/surface-brand` (#FF963B) | `sys/color/surface` (#FFFFFF) |
| icon-color | `sys/color/on-surface-brand` (#FFFFFF) | `sys/color/on-surface` (dark grey) |
| title-color | `sys/color/on-surface-brand` (#FFFFFF) | `sys/color/on-surface` (dark grey) |

---

## 4. Token 速查表（14 tokens）

### 共用 tokens（surface-independent）

| Token 路徑 | $value | 解析值 | 說明 |
|-----------|--------|--------|------|
| comp/nav-bar/height | sys/sizing/control-height/3xl | 48px | 固定高度，不含 StatusBar |
| comp/nav-bar/padding-h | sys/spacing/md | 16px | 左右 padding |
| comp/nav-bar/icon-size | sys/sizing/icon-md | 24px | 所有 icon 尺寸 |
| comp/nav-bar/gap | sys/spacing/sm | 12px | 子元素間距 |
| comp/nav-bar/title-font-size | sys/typography/title/md | 16px | 頁面標題字級 |
| comp/nav-bar/title-font-weight | sys/typography/weight/semibold | 600 | 頁面標題字重 |
| comp/nav-bar/search-font-size | comp/search-bar/font-size | 14px | SearchBar 字級（comp→comp） |
| comp/nav-bar/search-font-weight | comp/search-bar/font-weight | 400 | SearchBar 字重（comp→comp） |

### surface=brand tokens

| Token 路徑 | $value | 解析值 | 說明 |
|-----------|--------|--------|------|
| comp/nav-bar/background | sys/color/surface-brand | #FF963B | 品牌橘底 |
| comp/nav-bar/icon-color | sys/color/on-surface-brand | #FFFFFF | 白色 icon |
| comp/nav-bar/title-color | sys/color/on-surface-brand | #FFFFFF | 白色標題 |

### surface=default tokens

| Token 路徑 | $value | 解析值 | 說明 |
|-----------|--------|--------|------|
| comp/nav-bar/background-default | sys/color/surface | #FFFFFF | 白底 |
| comp/nav-bar/icon-color-default | sys/color/on-surface | dark grey | 深色 icon |
| comp/nav-bar/title-color-default | sys/color/on-surface | dark grey | 深色標題 |

---

## 5. SearchBar 統一規則

NavigationBar 嵌入 SearchBar 時的統一規範：

- SearchBar 是獨立 Primitive，自帶完整 token（13 tokens）
- NavigationBar 透過 Slot Override 嵌入 SearchBar instance
- SearchBar 的外觀由 `comp/search-bar/*` 管理，NavigationBar 只管佈局位置
- `comp/nav-bar/search-font-size` 和 `search-font-weight` alias 到 `comp/search-bar` 確保一致
- **所有場景的 SearchBar 外觀相同**（白底、圓角 pill、1px border），不會因 NavigationBar 的 surface 變化而改變
- SearchBar 高度固定 32px（control-height/default），在 NavigationBar 48px 內垂直置中

---

## 6. 場景對照表

| 場景 | surface | layout | leftSlot | centerSlot | rightSlot |
|------|---------|--------|----------|------------|-----------|
| App 首頁 | brand | search | hamburger menu | SearchBar | cart + chat |
| 分類館首頁 | brand | search | back arrow | SearchBar | cart |
| Ichiban 內頁 | brand | title | back arrow | 系列標題 | 賞品盒 + more |
| 商品詳情頁 | default | title | back arrow | 商品標題 | share + cart |
| 競標頁 | default | title | back arrow | 競標 | question + gavel + chat |
| 露天拍賣店 | default | search | back arrow | 店名 + SearchBar | search + avatars |

---

## 7. Icon 規則

- 使用 **outline style** icon（不是 solid / bulk）
- surface=brand：白色（`comp/nav-bar/icon-color`）
- surface=default：深灰色（`comp/nav-bar/icon-color-default`）
- size 固定 24px（`comp/nav-bar/icon-size`）
- 多個 rightSlot icon 之間用 `comp/nav-bar/gap`（12px）間隔

---

## 8. Do / Don't

### Do ✓
- App 每個頁面都用 NavigationBar 作為頂部導航
- 首頁/分類館用 surface=brand，內頁用 surface=default
- SearchBar 作為獨立 instance 嵌入，不要拆散 SearchBar 的結構
- icon 用 outline style

### Don't ✗
- 不要在 PC 版用 NavigationBar（PC 用 Global Header）
- 不要自定義 NavigationBar 的背景色（只有 brand 和 default 兩種）
- 不要在 NavigationBar 裡放 Tab（Tab 是獨立 component，在下方）
- 不要修改嵌入的 SearchBar 的外觀（SearchBar 外觀全局統一）
- 不要混淆 NavigationBar 和 SectionHeader（NavigationBar = 頁面導航，SectionHeader = 區塊標題）

---

## 9. 多品牌適配

走 sys 層語意色，品牌切換時自動適配：

| 品牌 | surface=brand bg | surface=brand text | surface=default 不變 |
|------|-----------------|-------------------|-------------------|
| 露天市集 Ruten | 橘 #FF963B | 白 #FFFFFF | 白底 + 深灰文字 |
| 一抽入魂 Ichiban | 藍 #3B82F6 | 白 #FFFFFF | 白底 + 深灰文字 |
| 預購市場 Resell | 藍 #3B82F6 | 白 #FFFFFF | 白底 + 深灰文字 |

surface=default 在所有品牌中外觀相同（白底深灰），因為都用中性色 token。

---

## 10. AI Agent 指引

```
1. NavigationBar 僅限 App / Mobile 版使用，PC 版不適用
2. 高度固定 48px，不含系統 StatusBar
3. 兩個 variant 維度：
   - surface: brand (品牌色底) | default (白底)
   - layout: search (嵌 SearchBar) | title (頁面標題)
4. 結構：
   <NavigationBar surface="brand|default" layout="search|title">
     <leftSlot>   back arrow | hamburger menu   </leftSlot>
     <centerSlot> SearchBar | page title         </centerSlot>
     <rightSlot>  action icons (24px each)       </rightSlot>
   </NavigationBar>
5. surface=brand → 品牌色底 + 白色文字/icon
   surface=default → 白底 + 深灰文字/icon
6. SearchBar 作為 instance 嵌入，外觀全局統一不隨 surface 變化
7. icon 一律 outline style，24px
8. 子元素間距 12px，左右 padding 16px
```

---

## 11. Figma Component Variant 結構

```
NavigationBar
├── surface=brand, layout=search    （App 首頁，橘底+SearchBar）
├── surface=brand, layout=title     （品牌內頁，橘底+標題）
├── surface=default, layout=search  （內頁搜尋，白底+SearchBar）
└── surface=default, layout=title   （內頁標題，白底+標題）
```

每個 variant 共用 height/padding-h/icon-size/gap，差異只在 background + icon-color + title-color。

---

## 12. 版本紀錄

| 版本 | 日期 | 變更 |
|------|------|------|
| v1.0.0 | 2026-03-25 | 初始版本。6 tokens。僅 surface=brand。 |
| v2.0.0 | 2026-03-27 | 新增 surface=default variant（+4 tokens = 14 total）。新增場景對照表。新增 SearchBar 統一規則。 |

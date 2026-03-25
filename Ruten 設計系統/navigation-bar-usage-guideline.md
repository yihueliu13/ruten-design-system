# Ruten Design System — NavigationBar 使用規則

> **版本**: v1.0.0
> **日期**: 2026-03-25
> **狀態**: 已定稿
> **依據**: design-system-all.json（唯一真實來源）
> **分類**: Navigation × Compound × Owned（6 tokens）

---

## 1. 元件定義

NavigationBar 是 Navigation 類 Compound component，用於 App / Mobile 版頂部導航列，位於系統 StatusBar（44px）下方。6 個 comp tokens。

PC 版不使用 NavigationBar — PC 的頂部導航是全站 Global Header，結構完全不同，不在此 component 範圍。

---

## 2. 結構

```
┌─ NavigationBar (48px, 橘底) ─────────────────────────┐
│ [leftSlot] [gap 12px] [centerSlot] [gap 12px] [rightSlot] │
└──────────────────────────────────────────────────────┘
```

- **leftSlot**：back arrow icon 或 logo icon（24px）
- **centerSlot**：SearchBar instance 或 page title text
- **rightSlot**：action icons（cart、notification 等），24px，多個 icon 間 gap 12px

三個 Slot 之間用 `gap`（12px）分隔，左右各有 `padding-h`（16px）。

---

## 3. Token 速查表

| Token 路徑 | $value | 解析值 | $description |
|-----------|--------|--------|-------------|
| comp/nav-bar/height | {sys.sizing.control-height.3xl} | 48px | NavigationBar row height. 48px. Excludes system StatusBar. Use for the main action bar below status bar. |
| comp/nav-bar/background | {sys.color.surface-brand} | #FF963B | NavigationBar background color. Brand orange. Use for primary navigation context (home, category). Pair with on-surface-brand for icon/text color. |
| comp/nav-bar/padding-h | {sys.spacing.md} | 16px | NavigationBar horizontal padding. 16px. Both left and right. |
| comp/nav-bar/icon-color | {sys.color.on-surface-brand} | #FFFFFF | NavigationBar icon color on brand background. White. Use for back arrow, cart, notification icons. |
| comp/nav-bar/icon-size | {sys.sizing.icon-md} | 24px | NavigationBar action icon size. 24px. |
| comp/nav-bar/gap | {sys.spacing.sm} | 12px | Gap between NavigationBar child elements. 12px. |

---

## 4. 背景色

- 固定橘色（`sys/color/surface-brand` → #FF963B），不跟隨父容器
- StatusBar 也是橘色，視覺上與 NavigationBar 連成一體
- 所有 icon 和文字使用白色（`sys/color/on-surface-brand`）以確保對比度

---

## 5. Icon 規則

- 使用 **outline style** icon（不是 solid / bulk）
- 顏色固定白色（`comp/nav-bar/icon-color` → #FFFFFF）
- size 固定 24px（`comp/nav-bar/icon-size`）
- 多個 rightSlot icon 之間用 `comp/nav-bar/gap`（12px）間隔

---

## 6. 場景對照表

| 場景 | leftSlot | centerSlot | rightSlot |
|------|----------|------------|-----------|
| 分類館首頁（App） | back arrow | SearchBar | cart icon |
| 一番賞首頁（App） | back arrow | SearchBar | 賞品盒 + 說明 |
| 商品頁（App） | back arrow | 商品標題 | share + cart |
| 首頁（App） | logo | SearchBar | notification + cart |

---

## 7. 與其他 Component 的關係

- NavigationBar 的 centerSlot 可放 **SearchBar** instance
- NavigationBar **不包含** StatusBar（StatusBar 是系統層，44px，在 NavigationBar 上方）
- NavigationBar **不包含** Tab（Tab 在 NavigationBar 下方，是獨立 component）
- NavigationBar **不包含** BottomNav（BottomNav 在頁面底部）

---

## 8. Do / Don't

### Do ✓
- App 每個頁面都用 NavigationBar 作為頂部導航
- icon 用 outline style，顏色用白色
- centerSlot 優先放 SearchBar，次要放 page title

### Don't ✗
- 不要在 PC 版用 NavigationBar（PC 用 Global Header）
- 不要改 NavigationBar 的背景色（固定橘色）
- 不要在 NavigationBar 裡放 Tab（Tab 是獨立 component，在 NavigationBar 下方）
- 不要混淆 NavigationBar 和 SectionHeader（NavigationBar = 頁面導航，SectionHeader = 區塊標題）

---

## 9. 多品牌適配

走 sys 層語意色，品牌切換時 `background` 和 `icon-color` 自動適配：

| 品牌 | background | icon-color |
|------|-----------|------------|
| 露天市集 Ruten | 橘 #FF963B | 白 #FFFFFF |
| 一抽入魂 Ichiban | 藍 #3B82F6 | 白 #FFFFFF |
| 預購市場 Resell | 藍 #3B82F6 | 白 #FFFFFF |

NavigationBar 不需額外處理，sys/color/surface-brand 和 sys/color/on-surface-brand 自動切換。

---

## 10. AI Agent 指引

```
1. NavigationBar 僅限 App / Mobile 版使用，PC 版不適用
2. 高度固定 48px，不含系統 StatusBar（44px）
3. 結構：
   <NavigationBar>
     <leftSlot>   back arrow | logo         </leftSlot>
     <centerSlot> SearchBar | page title    </centerSlot>
     <rightSlot>  action icons (24px each)  </rightSlot>
   </NavigationBar>
4. 背景固定品牌色（橘/藍），icon 和文字固定白色
5. icon 一律 outline style，24px
6. 子元素間距 12px，左右 padding 16px
7. centerSlot 放 SearchBar 時，SearchBar 自帶 token 管外觀
   NavigationBar 只管佈局位置
8. 不要在 NavigationBar 內放 Tab 或其他導航元件
```

---

## 11. 版本紀錄

| 版本 | 日期 | 變更 |
|------|------|------|
| v1.0.0 | 2026-03-25 | 初始版本。6 tokens：height + background + padding-h + icon-color + icon-size + gap。App/Mobile only，PC 不適用。 |

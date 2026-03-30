# Ruten Design System — BottomNav 使用規則

> **版本**: v1.0.0
> **日期**: 2026-03-19
> **狀態**: 已定稿
> **依據**: design-system-all.json（唯一真實來源）
> **分類**: Navigation × Compound × Owned（15 tokens）

---

## 1. 元件定義

BottomNav 是底部導航列元件，深色背景，5 個 tab icon + 中央圓形按鈕。Navigation 類 Compound。

---

## 2. 使用情境

### 什麼時候用
- App 和行動版 Web 的底部固定導航
- 主要功能入口：首頁、分類、發布、訊息、我的

### 什麼時候不用
- 桌面版 Web（底部導航是行動端專屬）
- 頁面內的 tab 切換（用 Tab component）
- 臨時浮層操作列（用 BottomSheet / ActionBar）

---

## 3. Token 對照表

| Token 路徑 | $value | 解析值 | $description |
|-----------|--------|--------|-------------|
| comp/bottom-nav/height | {sys.sizing.thumbnail-md} | 80px | BottomNav total height. 80px. Includes safe area. |
| comp/bottom-nav/background | {sys.color.inverse-surface} | Dark surface | BottomNav background. Dark surface (neutral/900). |
| comp/bottom-nav/border-radius | {sys.radius.md} | 16px | BottomNav top corner radius. 16px. |
| comp/bottom-nav/elevation | {sys.elevation.low} | Low shadow | BottomNav upward shadow. |
| comp/bottom-nav/padding-top | {sys.spacing.lg} | 24px | BottomNav top padding. 24px. |
| comp/bottom-nav/item/icon-size | {sys.sizing.icon-md} | 24px | BottomNav tab icon size. 24px. |
| comp/bottom-nav/item/icon-text-gap | {sys.spacing.2xs} | 4px | Gap between tab icon and label. 4px. |
| comp/bottom-nav/item/text-color | {sys.color.primary-container} | Light orange | BottomNav tab label default color. Light orange. |
| comp/bottom-nav/item/text-color-active | {sys.color.primary} | Brand orange | BottomNav active tab label color. Brand orange. |
| comp/bottom-nav/center-button/size | {sys.sizing.control-height.xl} | 40px | BottomNav center button size. 40px. |
| comp/bottom-nav/center-button/border-radius | {sys.radius.full} | 9999px | BottomNav center button shape. Circle. |
| comp/bottom-nav/item/font-size | {sys.typography.label.xs} | 10px | BottomNav item label font-size. 10px label-xs. |
| comp/bottom-nav/item/font-weight | {sys.typography.weight.medium} | 500 | BottomNav item label font-weight. Medium (500). |
| comp/bottom-nav/item/font-weight-active | {sys.typography.weight.semibold} | 600 | BottomNav active item font-weight. Semibold (600). |
| comp/bottom-nav/center-button/background | {sys.color.primary} | Brand orange | BottomNav center button background. Brand orange. |

---

## 4. 結構

```
[───────────── BottomNav (80px, dark) ─────────────]
│                    padding-top: 24px              │
│  [tab1]  [tab2]  [center-btn]  [tab3]  [tab4]   │
│  icon     icon    ● 40px       icon    icon      │
│  4px gap  4px     circle       4px     4px       │
│  label    label                label   label     │
│                    safe area                      │
[─────────────────────────────────────────────────]
```

- **高度**：80px（含 safe area）
- **背景**：深色 (inverse-surface)
- **頂部圓角**：16px（浮在頁面內容之上）
- **Center button**：40px 圓形，品牌橘色

---

## 5. 組合規則

### 子元素（非獨立 Primitive，由 BottomNav 直接管）
- **Tab item**：icon (24px) + label 文字，gap 4px。不是獨立的 Tab Primitive。
- **Center button**：圓形 40px 橘色，通常是「發布」或「掃描」功能。
- **Badge**：可疊加在 tab icon 上顯示未讀數。Badge 是獨立 Primitive，走 Slot Override 機制。

### 為什麼 tab item 不用 Tab Primitive？
BottomNav 的 tab item 和頁面內的 Tab 視覺結構完全不同（垂直排列 icon + label vs 水平文字 tab），所以 BottomNav 直接管 item 屬性。

---

## 6. Do / Don't

### Do
- Tab 數量固定 5 個（含 center button），不要動態增減
- Active tab 用 text-color-active (brand orange)，inactive 用 text-color (light orange)
- Center button 永遠在中間位置，不隨 tab 選中狀態改變

### Don't
- 不要把 BottomNav 的 tab item 換成 Tab Primitive（結構不同）
- 不要在桌面版顯示 BottomNav
- 不要改變 center button 的形狀（永遠圓形）

---

## 7. AI Agent 指引

```
1. BottomNav 結構：
   <BottomNav>
     <BottomNavItem icon="home" label="首頁" active />
     <BottomNavItem icon="category" label="分類" />
     <BottomNavCenterButton icon="plus" />
     <BottomNavItem icon="message" label="訊息" badge={3} />
     <BottomNavItem icon="profile" label="我的" />
   </BottomNav>

2. BottomNav 管什麼：
   - 容器：height, background, border-radius, elevation, padding-top
   - Tab item：icon-size, icon-text-gap, text-color, text-color-active
   - Center button：size, border-radius, background

3. CSS positioning：
   position: fixed; bottom: 0; width: 100%;
   z-index: sys/z-index/sticky

4. Safe area：
   padding-bottom 用 env(safe-area-inset-bottom) 處理 iPhone notch

5. Active 狀態切換：
   text-color = active ? comp/bottom-nav/item/text-color-active : comp/bottom-nav/item/text-color
```

---

## 8. 版本紀錄

| 版本 | 日期 | 變更 |
|------|------|------|
| v1.0.0 | 2026-03-19 | 初始版本。12 tokens：容器 (5) + tab item (4) + center button (3)。 |
| v1.1.0 | 2026-03-27 | 新增 font-size + font-weight + font-weight-active tokens → 15 tokens。Figma Component Scripter 建立。 |

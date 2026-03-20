# Ruten Design System — NavigationBar 使用規則

> **版本**: v1.0.0
> **日期**: 2026-03-19
> **狀態**: 已定稿
> **依據**: design-system-all.json（唯一真實來源）
> **分類**: Navigation × Compound × Owned（6 tokens）

---

## 1. 元件定義

NavigationBar 是頂部導航列元件，橘色品牌背景，內嵌 SearchBar 和 action icon。Navigation 類 Compound。

---

## 2. 使用情境

### 什麼時候用
- App 和行動版 Web 的頂部導航列
- 分類館首頁、搜尋結果頁、商品列表頁的頂部

### 什麼時候不用
- 桌面版 Web 的頂部導航（結構不同，Desktop 用專屬 Header component）
- 頁面內的局部 tab 導航（用 Tab component）
- 底部導航（用 BottomNav component）

---

## 3. Token 對照表

| Token 路徑 | $value | 解析值 | $description |
|-----------|--------|--------|-------------|
| comp/nav-bar/height | {sys.sizing.control-height.3xl} | 48px | NavigationBar row height. 48px. Excludes system StatusBar. |
| comp/nav-bar/background | {sys.color.surface-brand} | Brand orange | NavigationBar background color. Brand orange. |
| comp/nav-bar/padding-h | {sys.spacing.md} | 16px | NavigationBar horizontal padding. 16px. |
| comp/nav-bar/icon-color | {sys.color.on-surface-brand} | White | NavigationBar icon color on brand background. White. |
| comp/nav-bar/icon-size | {sys.sizing.icon-md} | 24px | NavigationBar action icon size. 24px. |
| comp/nav-bar/gap | {sys.spacing.sm} | 12px | Gap between NavigationBar child elements. 12px. |

---

## 4. 結構

```
[padding-h] [back icon] [gap] [SearchBar (flex:1)] [gap] [action icon] [gap] [action icon] [padding-h]
```

- **高度**：48px（不含系統 StatusBar）
- **背景**：Brand orange（露天品牌色）
- **子元素**：白色 icon (24px) + SearchBar (32px, 垂直置中)
- **間距**：子元素之間 gap 12px，左右 padding 16px

---

## 5. 組合規則

### 子 Primitive
- **SearchBar**：嵌在中央，flex: 1 佔滿剩餘空間。SearchBar 自己管外觀 token。
- **Icon**：左側 back arrow、右側 action icons（購物車、訊息等）。走 comp/nav-bar/icon-color + icon-size。

### Slot Override
NavigationBar 的 icon 不是獨立 Primitive（沒有自己的 comp/ token 集），所以由 NavigationBar 直接管 icon-color 和 icon-size。

### 品牌差異
- 露天：orange 背景
- 一番賞：Phase 3 Variable Mode 切換背景色
- 預購市場：Phase 3 Variable Mode 切換背景色

---

## 6. Do / Don't

### Do
- 高度固定 48px，不隨內容撐開
- Icon 統一白色 (on-surface-brand)
- SearchBar 垂直置中在 48px 高度內

### Don't
- 不要在 NavigationBar 內放文字標題（露天用 SearchBar 取代標題）
- 不要改變 background 為白色（那是不同 component）
- 不要把 NavigationBar 的 icon-color 用在 SearchBar 的 icon 上（SearchBar 有自己的 icon token）

---

## 7. AI Agent 指引

```
1. NavigationBar 結構：
   <NavigationBar>
     <Icon name="arrow-left" />
     <SearchBar />
     <Icon name="cart" />
     <Icon name="message" />
   </NavigationBar>

2. NavigationBar 管什麼：
   - 容器：height, background, padding-h, gap
   - Icon：icon-color, icon-size（因為 NavigationBar 的 icon 不是獨立 Primitive）

3. NavigationBar 不管什麼：
   - SearchBar 的外觀（SearchBar 自己管）

4. StatusBar 處理：
   - NavigationBar 的 48px 不含 StatusBar
   - 工程端需要額外處理 StatusBar safe area

5. 品牌切換：background 目前寫死 surface-brand，Phase 3 用 Variable Mode
```

---

## 8. 版本紀錄

| 版本 | 日期 | 變更 |
|------|------|------|
| v1.0.0 | 2026-03-19 | 初始版本。6 tokens：height + background + padding-h + icon (2) + gap。 |

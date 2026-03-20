# Ruten Design System — SearchBar 使用規則

> **版本**: v1.0.0
> **日期**: 2026-03-19
> **狀態**: 已定稿
> **依據**: design-system-all.json（唯一真實來源）
> **分類**: Navigation × Primitive × Owned（11 tokens）

---

## 1. 元件定義

SearchBar 是搜尋輸入框元件，pill 形狀，嵌在 NavigationBar 內。Navigation 類 Primitive，不包含其他 DS component。

---

## 2. 使用情境

### 什麼時候用
- 頁面頂部全局搜尋（嵌在 NavigationBar 內）
- 搜尋結果頁的搜尋框
- 分類頁的搜尋框

### 什麼時候不用
- 表單內的文字輸入（用 TextField）
- 篩選下拉（用 Select / Dropdown）
- 站內搜尋建議列表（那是 Overlay component，SearchBar 只管輸入框本身）

---

## 3. Token 對照表

| Token 路徑 | $value | 解析值 | $description |
|-----------|--------|--------|-------------|
| comp/search-bar/height | {sys.sizing.control-height.default} | 32px | SearchBar input field height. 32px. |
| comp/search-bar/background | {sys.color.surface} | White | SearchBar input field background. White. |
| comp/search-bar/border-color | {sys.color.outline-variant} | Light grey | SearchBar input field border color. Light grey. |
| comp/search-bar/border-width | {sys.border.width.default} | 1px | SearchBar input field border width. 1px. |
| comp/search-bar/border-radius | {sys.radius.full} | 9999px | SearchBar input field border radius. Pill shape (9999px). |
| comp/search-bar/padding-h | {sys.spacing.md} | 16px | SearchBar input field horizontal padding. 16px. |
| comp/search-bar/placeholder-color | {sys.color.on-surface-variant} | Subdued grey | SearchBar placeholder text color. Subdued grey. |
| comp/search-bar/icon-size | {sys.sizing.icon-md} | 24px | SearchBar icon size. 24px. |
| comp/search-bar/icon-gap | {sys.spacing.sm} | 12px | Gap between left icon and input field. 12px. |
| comp/search-bar/focus/border-color | {sys.color.primary} | Brand orange | SearchBar focused state border color. Brand orange. |
| comp/search-bar/focus/border-width | {sys.border.width.focus} | 2px | SearchBar focused state border width. 2px. |

---

## 4. 狀態

| State | 視覺 | 觸發 |
|-------|------|------|
| **default** | 白底 + 淺灰框 + placeholder | 未互動 |
| **focus** | 白底 + 橘框 2px + cursor | 點擊/tab 進入 |

---

## 5. 組合規則

### 嵌入 NavigationBar
SearchBar 是 NavigationBar 的核心子 Primitive。在 NavigationBar 內：
- SearchBar 佔據中央區域（flex: 1）
- 左右各有 NavigationBar 的 action icon
- SearchBar 的 height (32px) < NavigationBar 的 height (48px)，垂直置中

### 搜尋建議 Overlay
點擊 SearchBar 後可展開 Overlay（搜尋建議列表），但 Overlay 是獨立 component，不屬於 SearchBar。

---

## 6. Do / Don't

### Do
- 始終用 pill 形狀（border-radius: full），這是露天的品牌識別
- placeholder 文字用 comp/search-bar/placeholder-color
- Focus 狀態用 orange border 2px 強調

### Don't
- 不要把 SearchBar 用在 NavigationBar 以外的地方（表單搜尋用 TextField）
- 不要改變 pill 形狀為方角（那是 TextField 的樣式）
- 不要在 SearchBar 裡放右側清除按鈕的 token（那是互動邏輯，不是 DS token）

---

## 7. AI Agent 指引

```
1. SearchBar 永遠是 pill 形狀：border-radius = comp/search-bar/border-radius (9999px)
2. 結構：[icon] [gap] [input field]
   - icon: search icon, size = comp/search-bar/icon-size
   - gap: comp/search-bar/icon-gap
   - input: height = comp/search-bar/height
3. 狀態切換：
   - default: border = comp/search-bar/border-color + border-width
   - focus: border = comp/search-bar/focus/border-color + focus/border-width
4. 嵌入 NavigationBar 時：
   <NavigationBar>
     <Icon /> <SearchBar flex={1} /> <Icon />
   </NavigationBar>
5. placeholder 文字走 comp/search-bar/placeholder-color，不寫死
```

---

## 8. 版本紀錄

| 版本 | 日期 | 變更 |
|------|------|------|
| v1.0.0 | 2026-03-19 | 初始版本。11 tokens：height + background + border (3) + padding-h + placeholder + icon (2) + focus (2)。 |

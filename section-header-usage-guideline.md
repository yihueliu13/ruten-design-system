# Ruten Design System — SectionHeader 使用規則

> **版本**: v1.0.0
> **日期**: 2026-03-19
> **狀態**: 已定稿
> **依據**: design-system-all.json（唯一真實來源）

---

## 1. 元件定義

SectionHeader 是區塊標題元件，由 icon + 標題文字（+ 可選副標）組成。Layout 類 Compound，出現頻率最高（8+ 次/分類首頁）。

---

## 2. 使用情境

### 什麼時候用
- SectionModule 的標題列（🔥熱門分類、大家都在玩、今日精選 等）
- 每個內容區塊的開頭標題
- 有裝飾 icon 的標題行

### 什麼時候不用
- 頁面最頂層的大標題（用 Typography token 直接排）
- NavigationBar 內的標題文字（NavigationBar 不用 SectionHeader）
- 表單區塊的 label（用 TextField 的 label）

---

## 3. Token 對照表

| Token 路徑 | $value | 解析值 | $description |
|-----------|--------|--------|-------------|
| comp/section-header/icon-size | {sys.sizing.icon-md} | 24px | SectionHeader leading icon size. 24px. Decorative brand icon before title. |
| comp/section-header/icon-text-gap | {sys.spacing.2xs} | 4px | Gap between icon and title text. 4px. |
| comp/section-header/title-color | {sys.color.on-surface} | Dark grey | SectionHeader title color. Dark grey. Use on white/light surface sections. |
| comp/section-header/title-color-inverse | {sys.color.on-surface-brand} | White | SectionHeader title color on brand surface. White. Use on orange background sections like leaderboard. |
| comp/section-header/subtitle-color | {sys.color.on-surface-brand} | White | SectionHeader subtitle color. White. Use for date range or secondary info on brand surface. |
| comp/section-header/padding-h | {sys.spacing.md} | 16px | SectionHeader horizontal padding. 16px. Aligns with page-level content padding. |
| comp/section-header/height | {sys.sizing.icon-md} | 24px | SectionHeader row height. 24px. Matches icon size and title line-height for single-line vertical alignment. |

---

## 4. 結構

```
[padding-h] [icon 24px] [gap 4px] [title text] [...trailing action]  [padding-h]
            └── 24px ──┘         └── flex: 1 ──┘
```

- **高度**：24px（= icon size = title line-height），單行對齊
- **Icon**：可選，裝飾性品牌 icon（火焰🔥、星星⭐等）
- **Title**：必填，用 sys/typography/title 系列
- **Trailing action**：可選，「看更多 >」文字按鈕或 icon

---

## 5. 組合規則

### 嵌入 SectionModule
SectionHeader 是 SectionModule 的第一個子元素。在 SectionModule 內：
- SectionHeader 的 padding-h (16px) = SectionModule 的 padding-h (16px)，視覺對齊
- SectionHeader 下方有 gap-header-to-content (16px) 到第一個 Content Slot

### 表面色對應
- **白色表面**（一般 SectionModule）：title-color (dark grey)
- **品牌色表面**（排行榜等橘底區塊）：title-color-inverse (white) + subtitle-color (white)

### 子元素管理
- Icon 不是獨立 Primitive（沒有 comp/icon 以外的 token），SectionHeader 直接管 icon-size
- Title 文字走 Typography Text Style，不需要額外 token

---

## 6. Do / Don't

### Do
- 每個 SectionModule 都用 SectionHeader 開頭
- 根據背景色選擇 title-color 或 title-color-inverse
- 保持 padding-h 和 SectionModule 的 padding-h 一致 (16px)

### Don't
- 不要在沒有 icon 時留 icon-text-gap 的空間（icon 可選，沒有就不留 gap）
- 不要用 SectionHeader 做 Tab（切換功能用 Tab component）
- 不要在 SectionHeader 內放複雜互動元素（trailing 只放一個文字按鈕或 icon）

---

## 7. AI Agent 指引

```
1. SectionHeader 結構：
   <SectionHeader
     icon="fire"          // optional
     title="熱門分類"       // required
     subtitle="03/01-03/07" // optional, on brand surface
     trailing={<TextButton>看更多</TextButton>}  // optional
     inverse={false}       // true = brand surface
   />

2. 顏色選擇邏輯：
   if (inverse) {
     titleColor = comp/section-header/title-color-inverse  // white
     subtitleColor = comp/section-header/subtitle-color     // white
   } else {
     titleColor = comp/section-header/title-color           // dark grey
     // subtitle 在淺色表面通常不顯示
   }

3. 嵌入 SectionModule 時：
   <SectionModule>
     <SectionHeader />     ← 第一個子元素
     {gap-header-to-content: 16px}
     <ContentSlot />
   </SectionModule>

4. 不需要管 font-size/font-weight — 走 Text Style binding
```

---

## 8. 版本紀錄

| 版本 | 日期 | 變更 |
|------|------|------|
| v1.0.0 | 2026-03-19 | 初始版本。7 tokens：icon (2) + title color (2) + subtitle color + padding-h + height。 |

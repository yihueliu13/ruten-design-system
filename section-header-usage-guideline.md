# Ruten Design System — SectionHeader 使用規則

> **版本**: v1.0.0
> **日期**: 2026-03-25
> **狀態**: 已定稿
> **依據**: design-system-all.json（唯一真實來源）
> **分類**: Layout × Compound × Owned（14 tokens）

---

## 1. 元件定義

SectionHeader 是 Layout 類 Compound component，用於每個內容區塊的標題列，標示區塊主題。12 個 comp tokens。

本身背景透明，跟隨父容器背景。文字顏色由父容器背景決定（白底 → dark grey，橘底 → white）。

---

## 2. 結構

```
[leadingIcon?] [4px gap] [title] ←space-between→ [trailingSlot?]
```

- **leadingIcon**：Boolean show/hide，放裝飾性 3D icon 圖片（image slot，不是 Icon component）
- **title**：區塊標題文字，固定 Semibold 600
- **trailingSlot**：swap instance = none / Button ghost / text frame

---

## 3. 四種 Layout

| # | leadingIcon | trailingSlot | 場景 |
|---|-------------|-------------|------|
| 1 | ✅ show | Button ghost「更多」 | IP section（一番賞） |
| 2 | ✅ show | info text（日期區間） | 熱銷排行榜 |
| 3 | ❌ hide | Button ghost「更多」 | （預留） |
| 4 | ❌ hide | none | 大家都在搜 |

---

## 4. Size Variant

| Size | icon-size | title font-size | height | 場景 |
|------|-----------|-----------------|--------|------|
| **md** | 24px | 14px Semibold | 24px | Mobile / App |
| **lg** | 32px | 18px Semibold | 32px | PC |

> Line-height 由 Figma Text Style 管理（不建 Variable），故不列入 token。

height = icon-size（單行垂直置中，icon 與 row 等高）。

---

## 5. 背景色規則

SectionHeader 本身透明，文字顏色由父容器背景決定：

| 父容器背景 | 用哪個 token | 場景 |
|-----------|-------------|------|
| 白底 / 淺底 | `title-color`（dark grey #33343B） | 熱門分類、優質賣家、最新上架、焦點主題、館長推薦 |
| 橘底（brand surface） | `title-color-inverse`（white #FFFFFF） | 熱銷排行榜 |

---

## 6. Leading Icon 規則

- 是 **image slot**（放裝飾性 3D icon 圖片），不是 Icon component instance
- 不需要 icon-color token，圖片顏色自帶
- icon 不是必要的，可以隱藏（Layout 3、4 不含 icon）

---

## 7. 右側 CTA 規則

- 用 **Button ghost** instance 插入（灰色邊框 pill、neutral 色文字）
- SectionHeader 不管 CTA 的視覺屬性（顏色、圓角、padding 由 Button token 管）
- trailingSlot 也可放 text frame（如日期區間），不限於 Button

---

## 8. 場景對照表

| 場景 | Size | Layout | 背景 |
|------|------|--------|------|
| 熱門分類 | md(M) / lg(PC) | icon + title | 白底 |
| 優質賣家 | md / lg | icon + title | 白底 |
| 最新上架商品 | md / lg | icon + title | 白底 |
| 焦點主題 | md / lg | icon + title | 白底 |
| 熱銷排行榜 | md / lg | icon + title + 日期 | 橘底 |
| 館長推薦 | md / lg | icon + title | 白底 |
| 大家都在搜 | md / lg | title only | 白底 |
| IP section（一番賞） | md / lg | icon + title + CTA | 白底 |

---

## 9. Do / Don't

### Do ✓
- 每個內容區塊都用 SectionHeader 標示主題
- 橘底上用 `title-color-inverse`（白色）
- 右側 CTA 用 Button ghost，不要自己做按鈕

### Don't ✗
- 不要把 SectionHeader 當 NavigationBar 用
- 不要自定義 icon 顏色（icon 是圖片 slot，顏色自帶）
- 不要在 SectionHeader 裡放超過一個 CTA
- 不要調整 font-weight（固定 Semibold 600）

---

## 10. 多品牌適配

走 sys 層語意色，品牌切換時 `title-color` / `title-color-inverse` 自動適配。brand surface 顏色隨品牌主色切換（Ruten 橘、Ichiban 藍、Resell 藍），SectionHeader 不需額外處理。

---

## 11. Token 速查表

| Token 路徑 | $value | 解析值 | $description |
|-----------|--------|--------|-------------|
| comp/section-header/icon-text-gap | {sys.spacing.2xs} | 4px | Gap between icon and title text. 4px. |
| comp/section-header/title-color | {sys.color.on-surface} | #33343B | SectionHeader title color. Dark grey. Use on white/light surface sections. |
| comp/section-header/title-color-inverse | {sys.color.on-surface-brand} | #FFFFFF | SectionHeader title color on brand surface. White. Use on orange background sections like leaderboard. |
| comp/section-header/subtitle-color | {sys.color.on-surface-brand} | #FFFFFF | SectionHeader subtitle color. White. Use for date range or secondary info on brand surface. |
| comp/section-header/padding-h | {sys.spacing.md} | 16px | SectionHeader horizontal padding. 16px. Aligns with page-level content padding. |
| comp/section-header/title-font-weight | {sys.typography.weight.semibold} | 600 | Title font weight. Semibold 600. Consistent across all sizes. |
| comp/section-header/md/icon-size | {sys.sizing.icon-md} | 24px | Leading icon size for mobile/app. 24px. |
| comp/section-header/md/title-font-size | {sys.typography.title.sm} | 14px | Title font size for mobile/app. 14px. |
| comp/section-header/md/height | {sys.sizing.icon-md} | 24px | Row min-height for mobile/app. 24px. Aliases icon-md — height matches leading icon for single-line vertical centering. |
| comp/section-header/lg/icon-size | {sys.sizing.icon-lg} | 32px | Leading icon size for PC. 32px. |
| comp/section-header/lg/title-font-size | {sys.typography.title.lg} | 18px | Title font size for PC. 18px. |
| comp/section-header/cta-text-color | {sys.color.on-surface-variant} | #73747B | Slot override. CTA button text and icon color on light surface. Neutral grey. Overrides Button ghost default orange to reduce visual weight. |
| comp/section-header/cta-text-color-inverse | {sys.color.on-surface-brand} | #FFFFFF | Slot override. CTA button text and icon color on brand surface. White. Use on orange background sections like leaderboard. |
| comp/section-header/lg/height | {sys.sizing.icon-lg} | 32px | Row min-height for PC. 32px. Aliases icon-lg — height matches leading icon for single-line vertical centering. |

---

## 12. AI Agent 指引

```
1. SectionHeader 背景永遠透明，文字色由父容器決定：
   - 白底 → comp/section-header/title-color
   - 橘底 → comp/section-header/title-color-inverse
2. 尺寸選擇：
   - Mobile / App → md（icon 24px, title 14px, height 24px）
   - PC → lg（icon 32px, title 18px, height 32px）
3. 結構：
   <SectionHeader
     leadingIcon={show|hide}
     title="區塊標題"
     trailingSlot={none|ButtonGhost|TextFrame}
     size={md|lg}
   />
4. Leading icon 是 image slot，不是 Icon component：
   不走 icon-color token，圖片自帶顏色
5. 右側 CTA 用 Button ghost instance，但文字/icon 顏色走 Slot Override：
   - 白底 → comp/section-header/cta-text-color（neutral grey #73747B）
   - 橘底 → comp/section-header/cta-text-color-inverse（white #FFFFFF）
   - Button 的 background、border、padding 仍繼承 Button master token
6. font-weight 固定 Semibold 600，不可覆寫
7. padding-h = 16px，與頁面 content padding 對齊
```

---

## 13. 版本紀錄

| 版本 | 日期 | 變更 |
|------|------|------|
| v1.0.0 | 2026-03-25 | 初始版本。14 tokens。 |
| v1.1.0 | 2026-03-26 | 修正至 12 tokens：移除 md/lg title-line-height（由 Text Style 管理）、修正 alias 路徑（font-weight → weight、title.sm.size → title.sm）、修正 font-size 解析值（md 14px、lg 18px）。 |
| v1.2.0 | 2026-03-26 | 新增 2 Slot Override tokens（cta-text-color、cta-text-color-inverse），total 14 tokens。CTA button 文字/icon 顏色走 Slot Override 而非繼承 Button ghost 橘色。 |

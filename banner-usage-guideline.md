# Ruten Design System — Banner 使用規則

> **版本**: v1.0.0
> **日期**: 2026-03-19
> **狀態**: 已定稿
> **依據**: design-system-all.json（唯一真實來源）

---

## 1. 元件定義

Banner 是廣告/活動容器元件，採「畫框」概念：外框管規格，內容自由發揮。Display 類 Compound（Container）+ Pattern（Content）。

---

## 2. 使用情境

### 什麼時候用
- 首頁輪播廣告區
- 分類頁活動 Banner
- 品牌推廣區塊
- SectionModule 的 Slot B 內的 Hero Banner

### 什麼時候不用
- 系統通知（用 Toast / Snackbar）
- 頁面頂部的公告條（那是不同 component）
- 純圖片展示（用 Image component）

---

## 3. Token 對照表

| Token 路徑 | $value | 解析值 | $description |
|-----------|--------|--------|-------------|
| comp/banner/border-radius | {sys.radius.sm} | 12px | Banner container corner radius. 12px. Use for all banner variants. |
| comp/banner/background | {sys.color.surface} | White | Banner container default background. White. Override with brand color or image for themed banners. |
| comp/banner/padding | {sys.spacing.md} | 16px | Banner container inner padding. 16px. For full-bleed image banners, set to 0 in implementation. |
| comp/banner/min-height | {sys.sizing.control-height.3xl} | 48px | Banner container minimum height. 48px. Prevents collapsed empty state. |

---

## 4.「畫框」概念

Banner 分成兩層：

```
┌─── Banner Container (Compound) ────────────────────┐
│  border-radius: 12px                                │
│  background: white (或品牌色/圖片)                    │
│  padding: 16px (或 0 for full-bleed)                │
│  min-height: 48px                                   │
│                                                      │
│  ┌─── Banner Content (Pattern) ─────────────────┐  │
│  │  自由排版：文字 + 圖片 + CTA + 任何內容         │  │
│  │  走 sys/ token + CSS layout                    │  │
│  │  不建 comp/ token                              │  │
│  └───────────────────────────────────────────────┘  │
└──────────────────────────────────────────────────────┘
```

- **Container（comp/banner/ token 管）**：圓角、背景色、padding、min-height
- **Content（Pattern，sys/ token 管）**：文字排版、圖片尺寸、CTA 按鈕位置

---

## 5. 三種使用模式

### 模式 A：模組樣式
背景色 + 文字 + CTA 按鈕。有 padding。

```
┌─── Banner ──────────────────────────┐
│  padding: 16px                       │
│                                      │
│  [限時特賣]                           │
│  全館 85 折，倒數 3 天               │
│                                      │
│  [立即搶購] ← Button                 │
│                                      │
└──────────────────────────────────────┘
```

- background: 品牌色或漸層（覆寫 comp/banner/background）
- padding: comp/banner/padding (16px)
- 文字 + Button 走各自的 comp/ token

### 模式 B：自由發揮
設計師自由排版。有 padding。

```
┌─── Banner ──────────────────────────┐
│  padding: 16px                       │
│                                      │
│  [圖片] [文字區塊]                    │
│         標題                         │
│         副標                         │
│         [CTA]                        │
│                                      │
└──────────────────────────────────────┘
```

- 內部佈局用 CSS flex/grid + sys/ token
- Banner Container 只管外框

### 模式 C：純圖片（Full-bleed）
整張圖片填滿 Banner。padding = 0。

```
┌─── Banner ──────────────────────────┐
│  padding: 0                          │
│  ┌────────────────────────────────┐ │
│  │  [image fills entire area]     │ │
│  └────────────────────────────────┘ │
└──────────────────────────────────────┘
```

- padding: 工程端覆寫為 0
- background: 不需要（圖片蓋住）
- border-radius 仍然生效（圖片需要 overflow: hidden）

---

## 6. 圓角 Slot Override 規則

Banner 的 border-radius 預設 12px (sys.radius.sm)，但不同場景可能需要不同圓角：

| 場景 | 圓角 | Token |
|------|------|-------|
| **獨立 Banner**（頁面內） | 12px | comp/banner/border-radius (預設) |
| **SectionModule 內的 Banner** | 12px | comp/banner/border-radius (與 SectionModule cap 對齊) |
| **全寬輪播 Banner** | 0px | 工程端覆寫為 sys/radius/none |
| **卡片內 Banner** | 8px | 工程端覆寫為 sys/radius/md |

圓角覆寫由使用場景的 component 決定，不在 Banner Container 層處理。

---

## 7. 與 SectionModule Content Slot 的關係

Banner 可以放在 SectionModule 的 Slot B：

```
<SectionModule>
  <SectionHeader icon="megaphone" title="限時活動" />
  <Banner>                              ← Slot B
    <Image src="promo.jpg" />           ← Content Pattern
  </Banner>
  <Button label="查看更多活動" />        ← Slot C (footer)
</SectionModule>
```

此時：
- SectionModule 管外層結構（cap-height、gap）
- Banner 管自己的圓角和 padding
- Content 自由排版

---

## 8. Do / Don't

### Do
- 始終設定 min-height (48px) 防止空狀態塌陷
- 純圖片模式記得加 overflow: hidden 讓圓角裁切生效
- 用 border-radius token 不寫死數值

### Don't
- 不要把 Banner Content 的佈局做成 token（Content 是 Pattern 層）
- 不要省略 min-height（即使有圖片也需要保底高度）
- 不要把多個 Banner 疊在一起（輪播用 Carousel Pattern 管）

---

## 9. AI Agent 指引

```
1. Banner 結構：
   <Banner>
     {children}  ← Pattern 內容，自由排版
   </Banner>

2. 三種模式判斷：
   - 有文字 + CTA → 模式 A，padding = comp/banner/padding
   - 設計師排版 → 模式 B，padding = comp/banner/padding
   - 純圖片 → 模式 C，padding = 0，加 overflow: hidden

3. Container CSS：
   border-radius: comp/banner/border-radius
   background: comp/banner/background (或覆寫為品牌色/圖片)
   padding: comp/banner/padding (或 0)
   min-height: comp/banner/min-height

4. Content 走 sys/ token，不建 comp/ token

5. 輪播場景：
   <Carousel>
     <Banner /><Banner /><Banner />
   </Carousel>
   Carousel 是 Pattern，管滑動邏輯。Banner 只管單張。
```

---

## 10. 版本紀錄

| 版本 | 日期 | 變更 |
|------|------|------|
| v1.0.0 | 2026-03-19 | 初始版本。4 tokens：border-radius + background + padding + min-height。三種使用模式。圓角 Slot Override 規則。 |

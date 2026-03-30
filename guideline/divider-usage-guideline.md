# Ruten Design System — Divider 使用規則

> **版本**: v1.0.0
> **日期**: 2026-03-19
> **狀態**: 已定稿
> **依據**: design-system-all.json（唯一真實來源）
> **分類**: Layout × Primitive × Owned（5 tokens）

---

## 1. 元件定義

Divider 是分隔線元件，用於區分視覺區塊之間的邊界。Layout 類 Primitive，不包含其他 DS component。

---

## 2. 使用情境

### 什麼時候用
- 列表項目之間的分隔（商品列表、訂單列表、設定頁選項）
- 頁面區塊之間的分隔（SectionModule 之間）
- 表單欄位群組之間的分隔
- 資訊區塊之間的層次區分

### 什麼時候不用
- 已有明確容器邊界（卡片之間有 gap，不需要再加 Divider）
- 用 SectionModule 包裝的區塊（SectionModule 自帶視覺邊界）
- 純裝飾目的（不要為了「看起來豐富」加線）

---

## 3. Token 對照表

| Token 路徑 | $value | 解析值 | $description |
|-----------|--------|--------|-------------|
| comp/divider/color | {sys.color.outline-variant} | Light grey | Divider line color. Light grey. Default for horizontal and vertical dividers. |
| comp/divider/thickness-hairline | {sys.border.width.hairline} | 0.5px | Divider hairline thickness. 0.5px. Use for subtle separation between list items. |
| comp/divider/thickness-default | {sys.border.width.default} | 1px | Divider default thickness. 1px. Use for standard section separation. |
| comp/divider/thickness-heavy | {sys.border.width.focus} | 2px | Divider heavy thickness. 2px. Use for strong visual separation between major sections. |
| comp/divider/spacing | {sys.spacing.xs} | 8px | Divider surrounding spacing. 8px. Margin above and below the divider line. |

---

## 4. 組合規則

### 搭配元件
- **SectionModule 之間**：用 thickness-default，但多數情況用背景色差異取代
- **List Item 之間**：用 thickness-hairline，最不干擾
- **表單群組之間**：用 thickness-default

### 不搭配
- SectionModule 內部不放 Divider（用 gap token 管間距）
- Card 內部避免 Divider（用 spacing 取代）

---

## 5. Do / Don't

### Do
- 列表項目之間用 hairline (0.5px)，不要搶視覺焦點
- 保持 spacing (8px) 的上下對稱留白
- 顏色統一用 comp/divider/color，不要自己挑灰色

### Don't
- 不要在已有 gap 的 flex/grid 佈局中再加 Divider
- 不要把 heavy (2px) 用在列表項目之間（太搶眼）
- 不要改變 Divider 的 opacity（用 thickness 控制視覺重量）

---

## 6. AI Agent 指引

```
1. 產出 code 時，Divider 用 <hr> 或自定義 <Divider> component
2. thickness 選擇邏輯：
   - 列表項目之間 → hairline (0.5px)
   - 區塊之間 → default (1px)
   - 重要分界 → heavy (2px)
3. 所有屬性走 comp/divider/ token，不能寫死數值
4. spacing 用 margin-block（上下各 8px），不用 padding
5. 方向預設水平，垂直 Divider 用 CSS rotate 或 height + width 互換
```

---

## 7. 版本紀錄

| 版本 | 日期 | 變更 |
|------|------|------|
| v1.0.0 | 2026-03-19 | 初始版本。5 tokens：color + 3 thickness + spacing。 |

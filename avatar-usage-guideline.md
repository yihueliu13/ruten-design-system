# Ruten Design System — Avatar 使用規則

> **版本**: v1.0.0
> **日期**: 2026-03-19
> **狀態**: 已定稿
> **依據**: design-system-all.json（唯一真實來源）
> **分類**: Media × Primitive × Owned（11 tokens）

---

## 1. 元件定義

Avatar 是圓形圖像元件，用於展示使用者頭像、賣家照片或分類圖示。Media 類 Primitive，6 種尺寸。

---

## 2. 使用情境

### 什麼時候用
- 使用者頭像（登入後的 profile、評論列表、聊天氣泡）
- 賣家資訊（賣家 spotlight、商品頁賣家欄）
- 分類入口圖（熱門分類 icon grid、分類首頁 hero）
- 社群內容（關注的人、推薦賣家、話題圈）

### 什麼時候不用
- 商品圖片（用 ProductCard 的 Image slot）
- 品牌 Logo（用 Icon / Logo component）
- 方形縮圖（用 sys/sizing/thumbnail-*）

---

## 3. Token 對照表

| Token 路徑 | $value | 解析值 | $description |
|-----------|--------|--------|-------------|
| comp/avatar/xs/size | {sys.sizing.avatar-xs} | 24px | Avatar xs size. 24px. Use for inline mentions, compact lists. |
| comp/avatar/sm/size | {sys.sizing.avatar-sm} | 32px | Avatar sm size. 32px. Use for comment authors, chat bubbles. |
| comp/avatar/md/size | {sys.sizing.avatar-md} | 40px | Avatar md size. 40px. Use for navigation bar, list items. |
| comp/avatar/lg/size | {sys.sizing.avatar-lg} | 48px | Avatar lg size. 48px. Use for seller info, profile sections. |
| comp/avatar/xl/size | {sys.sizing.avatar-xl} | 80px | Avatar xl size. 80px. Use for featured topic grid, seller highlights. |
| comp/avatar/2xl/size | {sys.sizing.avatar-2xl} | 96px | Avatar 2xl size. 96px. Use for category index hero thumbnails. |
| comp/avatar/border-radius | {sys.radius.full} | 9999px | Avatar shape. Circle (9999px). All avatars are circular. |
| comp/avatar/background | {sys.color.surface} | White | Avatar fallback background. White. Show when image is loading or missing. |
| comp/avatar/active/border-width | {sys.border.width.focus} | 2px | Avatar active border width. 2px. Use for selected/highlighted avatar. |
| comp/avatar/active/border-color | {sys.color.primary} | Brand orange | Avatar active border color. Brand orange. Use for selected/highlighted avatar. |
| comp/avatar/default/border-width | {sys.border.width.none} | 0px | Avatar default border width. 0px. No border in default state. |

---

## 4. 尺寸選擇邏輯

| Size | 解析值 | 場景 |
|------|--------|------|
| **xs** (24px) | 行內提及、通知列表 | 最緊湊，搭配小字 |
| **sm** (32px) | 評論作者、聊天氣泡 | 列表內標準 |
| **md** (40px) | 導航列、列表項目 | = WCAG 最小觸碰目標 |
| **lg** (48px) | 賣家資訊、Profile 區塊 | 中等強調 |
| **xl** (80px) | 話題圈大圖、賣家 spotlight | 高強調 |
| **2xl** (96px) | 分類首頁 hero、特色主題封面 | 最大強調 |

---

## 5. 組合規則

### 搭配元件
- **NavigationBar** 內的使用者頭像：md (40px)
- **List Item** 前置頭像：sm (32px) 或 md (40px)
- **SectionHeader** 旁邊的主題圖：lg (48px)
- **CategoryGrid Pattern** 的分類圖：xl (80px) 或 2xl (96px)
- **BottomNav** center button 內：不直接用，center button 有自己的 size token

### Active 狀態
- 分類 Grid 點選後：active border 2px orange 表示當前選中
- 多選場景（篩選賣家）：active border 顯示已選取

---

## 6. Do / Don't

### Do
- 所有 Avatar 統一圓形（border-radius: full），不要用方形
- 缺圖時顯示 background (white) + 首字母或預設 icon
- Active 選中態用 border 表達，不改 size

### Don't
- 不要在 Avatar 上疊加 Badge（用 compound component 處理 Avatar + Badge 組合）
- 不要用 Avatar 顯示商品圖（商品圖是方形 thumbnail）
- 不要自己指定 border-radius 數值（一律走 comp/avatar/border-radius）

---

## 7. AI Agent 指引

```
1. Avatar 永遠是圓形：width = height = comp/avatar/{size}/size, border-radius = comp/avatar/border-radius
2. 尺寸選擇：
   - 列表/行內 → xs 或 sm
   - 標準展示 → md 或 lg
   - 強調展示 → xl 或 2xl
3. fallback 處理：
   <Avatar src={url} fallback={initials} />
   背景色 = comp/avatar/background
4. Active 狀態用 border，不改 size：
   border: comp/avatar/active/border-width solid comp/avatar/active/border-color
5. Default 狀態無 border：comp/avatar/default/border-width = 0px
```

---

## 8. 版本紀錄

| 版本 | 日期 | 變更 |
|------|------|------|
| v1.0.0 | 2026-03-19 | 初始版本。11 tokens：6 size + border-radius + background + active border (2) + default border (1)。 |

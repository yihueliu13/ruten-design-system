# Ruten Design System — Thumbnail 使用規則

> **版本**: v1.0.0
> **日期**: 2026-03-20
> **狀態**: 已定稿
> **依據**: design-system-all.json（唯一真實來源）
> **分類**: Media × Primitive × Owned（11 tokens）

---

## 1. 元件定義

Thumbnail 是圓形縮圖元件，用於展示「物」或「主題」的代表圖像。支援 selector 互動（點擊選取）。Media 類 Primitive，6 種尺寸。

與 Avatar 的區別：Avatar 代表「人/商家」，Thumbnail 代表「IP/主題/分類」。參考 Shopify Polaris 的 Avatar / Thumbnail 拆分。

---

## 2. 使用情境

### 什麼時候用 Thumbnail
- 焦點主題 IP 圖（hololive、咒術迴戰）— selector 行為，點擊切換上方大圖
- 分類入口圖（熱門分類 icon grid、分類首頁 hero）
- 品牌主題圓形圖

### 什麼時候不用 Thumbnail
- 使用者頭像 → Avatar
- 賣家代表圖 → Avatar（代表的是商家/人）
- 商品圖片 → ProductCard 的 Image slot
- 方形商品縮圖 → 未來 Thumbnail 方形變體（Phase 3+）

---

## 3. Token 對照表

| Token 路徑 | $value | 解析值 | $description |
|-----------|--------|--------|-------------|
| comp/thumbnail/xs/size | {sys.sizing.avatar-xs} | 24px | Thumbnail xs. Compact grids, inline category icons. |
| comp/thumbnail/sm/size | {sys.sizing.avatar-sm} | 32px | Thumbnail sm. Small category lists. |
| comp/thumbnail/md/size | {sys.sizing.avatar-md} | 40px | Thumbnail md. Standard category grids. |
| comp/thumbnail/lg/size | {sys.sizing.avatar-lg} | 48px | Thumbnail lg. Featured category entries. |
| comp/thumbnail/xl/size | {sys.sizing.avatar-xl} | 80px | Thumbnail xl. Featured topic grid (焦點主題), IP selector. |
| comp/thumbnail/2xl/size | {sys.sizing.avatar-2xl} | 96px | Thumbnail 2xl. Hero category thumbnails. |
| comp/thumbnail/border-radius | {sys.radius.full} | 9999px | Circle shape. Future: may add square variant. |
| comp/thumbnail/background | {sys.color.surface} | White | Fallback background. |
| comp/thumbnail/active/border-width | {sys.border.width.focus} | 2px | Selected thumbnail border width. |
| comp/thumbnail/active/border-color | {sys.color.primary} | Brand orange | Selected thumbnail border color. |
| comp/thumbnail/default/border-width | {sys.border.width.none} | 0px | No border in default state. |

---

## 4. 尺寸選擇邏輯

| Size | 解析值 | 場景 |
|------|--------|------|
| **xs** (24px) | 行內分類 icon、緊湊列表 |
| **sm** (32px) | 小型分類列表 |
| **md** (40px) | 標準分類 grid |
| **lg** (48px) | 重點分類入口 |
| **xl** (80px) | 焦點主題 IP selector、分類 spotlight |
| **2xl** (96px) | 分類首頁 hero 縮圖 |

---

## 5. 組合規則

### 搭配元件
- **SectionModule** 內的焦點主題：xl (80px) + active border
- **CategoryGrid Pattern** 的分類圖：xl (80px) 或 2xl (96px)
- **HorizontalScroll Pattern** 的 IP 列表：xl (80px)

### Active 狀態（Selector 行為）
- 焦點主題：點擊 Thumbnail 切換上方大圖，被選中的 Thumbnail 有橘色外框
- 分類 Grid：點擊進入分類頁，不需要 active 態

---

## 6. Do / Don't

### Do
- 代表 IP 或主題時用 Thumbnail，不要用 Avatar
- Selector 模式下，被選中的 Thumbnail 用 active border 表達
- 缺圖時顯示 background (white) + 主題名稱首字

### Don't
- 不要用 Thumbnail 顯示使用者頭像（那是 Avatar）
- 不要用 Thumbnail 顯示賣家照片（賣家是商家 = Avatar）
- 不要自己指定 border-radius（走 comp/thumbnail/border-radius）

---

## 7. AI Agent 指引

Thumbnail 預設圓形：width = height = comp/thumbnail/{size}/size, border-radius = comp/thumbnail/border-radius
判斷邏輯：代表人/商家 → Avatar。代表 IP/主題/分類 → Thumbnail。
Selector 模式： <Thumbnail src={url} selected={isSelected} onClick={onSelect} /> selected=true → border: comp/thumbnail/active/border-width solid comp/thumbnail/active/border-color selected=false → border: comp/thumbnail/default/border-width
fallback：背景色 = comp/thumbnail/background，顯示主題名稱首字

---

## 8. 版本紀錄

| 版本 | 日期 | 變更 |
|------|------|------|
| v1.0.0 | 2026-03-20 | 初始版本。從 Avatar 拆出，專用於 IP/主題/分類場景。11 tokens。參考 Shopify Polaris Avatar/Thumbnail 拆分。 |

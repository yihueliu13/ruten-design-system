# 露天 Design System — 建置進度筆記

> 最後更新：2026-03-12  
> 基線版本：**v1.0.0 sealed-baseline**

---

## 專案目標

利用 AI 建立露天多品牌設計系統，從 Design Token 到 Storybook 元件調用。

**架構：** 單一 Collection，三層 ref → sys → comp（參照 MD3）  
**品牌：** 露天市集 | 一抽入魂 | 預購市場  
**總量：** 529 tokens + 130 Text Styles

---

## 架構決策

| 決策 | 結論 | 理由 |
|------|------|------|
| Collection 策略 | **單一 Collection** | 同 collection alias 匯入即生效 |
| Namespace | **不加** `ruten/` | ref 三品牌共用 |
| 色彩命名 | **純色相** | MD3 ref 不帶語義 |
| text-decoration | **sys 層** | 業界標準，AI 可讀 |
| Grid | **sys 層** | 組合式決策，非原子值 |
| Breakpoint | **ref 層** | 原子數字 |
| RWD 策略 | **Size variants (sm/md/lg/xl)** | Professional plan 只有 1 mode，不能用 Variable Modes |
| Typography Figma | **Text Styles** | Variables 一個一個綁太慢，Text Styles 一鍵套用 |
| Typography Token | **保留在 JSON** | AI 和工程師需要讀取 |
| 價格顏色 | **紅色 sys/color/price** | 非 error 語義，獨立的促銷價格紅 |
| 13px | **body-md-alt** | legacy compatibility，建議新設計用 14px |
| label-2xs | **8px（非 9px）** | 對齊實際設計（銷售999+） |

---

## ✅ ref 層 — 155 tokens (Complete)

```
ref
├── color          45   orange/neutral/red/yellow/blue/teal/black
├── spacing        13   0~96px (base 4px)
├── sizing         11   16~192px
├── radius          9   0~9999
├── typography     36   family(2) + size(21 含 body-md-alt) + weight(4) + lh(4) + ls(4) + decoration(1)
├── elevation       6   level 0~5
├── opacity         8   MD3 state layers
├── border          9   width(6) + style(3)
├── breakpoint      5   375~1440
├── z-index         8   -1~1500
└── duration        4   100~500ms
```

---

## ✅ sys 層 — 153 tokens (Complete)

新增 sys/color/price + on-price（促銷價格紅）。

```
sys
├── color          42   primary/secondary/surface/outline/error/warning/success/info/price/scrim
├── spacing        10   none → 4xl
├── sizing         11   icon/avatar/thumbnail/product
├── radius          6   none → full
├── typography     38   family + typescale + weight + lh + ls + decoration
├── elevation       6   none → highest
├── opacity         8   transparent → opaque
├── border          8   width(5) + style(3)
├── grid            8   columns(3) + gutter(2) + margin(3)
├── z-index         8   hide → tooltip
└── duration        4   instant → slow
```

---

## ✅ comp 層 — 221 tokens (Complete)

### comp/icon — 8 tokens ✅

```
xs/             size(12px → sys/sizing/icon-xs), color(on-surface-variant)
sm/             size(16px → sys/sizing/icon-sm), color(on-surface)
md/             size(24px → sys/sizing/icon-md), color(on-surface) — 預設尺寸
lg/             size(32px → sys/sizing/icon-lg), color(on-surface)
```

其他 comp（button、product-card）的 icon-size 已改為引用 comp/icon。

### comp/product-card — 51 tokens ✅ (Figma 綁定完成)

```
container/      background, border-color, border-width, border-radius(8px),
                elevation, padding(12), gap(4), padding-h(4), padding-v(8), width(109)
image/          background, border-radius(8), aspect-ratio(1:1), size(109)
badge/          primary(橘) + secondary(淺橘) + 共用屬性
title/          font-size(10px), font-weight(500), color(on-surface), line-clamp(2)
price/current/  font-size(12px), font-weight(700), color(RED sys/color/price)
price/original/ font-size(12px), color(grey), decoration(line-through)
meta/           font-size(8px), color(on-surface-variant) — 銷售999+
tag-shipping/   background(info/blue), text-color, border-radius, font-size, padding-h — 預購
tag-brand/      background(price/red), text-color, border-radius, font-size, font-weight,
                padding-h, padding-v, icon-size(12), gap(2) — 露天心選
```

**Figma 綁定狀態：** 顏色 ✅、圓角 ✅、間距 ✅、font-size 部分 ✅

### comp/button — 49 tokens ✅

sm(375) / md(768) / lg(992) / xl(1200) 四尺寸  
× primary / secondary / ghost 三風格 × states

### comp/tab — 28 tokens ✅

sm/md/lg/xl 四尺寸 + active / inactive / hover 狀態

### comp/tag — 61 tokens ✅

sm/md/lg/xl 四尺寸 + filled / outlined / status 風格 + promo-corner（免運角標）

---

## ✅ Text Styles — 130 styles (Complete)

用 Scripter plugin 批次建立。

```
CH/PingFang TC/       65 styles
├── 21 sizes × 3 weights  = 63
└── Decoration (2)        Strikethrough + Underline

EN/SF Pro/            65 styles
├── 21 sizes × 3 weights  = 63
└── Decoration (2)        Strikethrough + Underline

Total                 130 styles
```

---

## 已解決的高風險點

| 問題 | 原因 | 解法 |
|------|------|------|
| 13px 不在標準 scale | 舊設計遺留 | body-md-alt legacy token |
| label-2xs 9px vs 實際 8px | token 與設計不一致 | 改成 8px |
| 價格用紅色不是橘色 | 設計決策 | 新增 sys/color/price |
| Mono 殘留 | Text Styles 與 source of truth 分裂 | 徹底移除 Mono |

---

## 檔案清單（以 source of truth 對齊）

| 檔案 | 狀態 | 說明 |
|------|------|------|
| `design-system-all.json` | ✅ 唯一真實來源 | ref(155) + sys(153) + comp(221) |
| `design-system-viewer-live.html` | ✅ | 直接讀取 source of truth |
| `design-system-viewer.html` | ✅ | 目前基線 snapshot |
| `create-text-styles.js` | ✅ | Scripter script 130 Text Styles |
| `SKILL.md` | ✅ | 使用規則與維護說明 |
| `token-migration-map.md` | ✅ | 舊 token 遷移對照 |
| `design-system-governance.md` | ✅ | 封箱與維護規則 |

---

## 維護原則

1. **design-system-all.json** — 唯一真實來源  
2. 其他檔案全部屬於衍生輸出  
3. 任何擴充一律先改 JSON，再跑驗證  
4. 驗證沒過，不算更新完成

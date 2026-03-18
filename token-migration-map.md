# 舊 Token → 新 Design System 遷移對照表

> 來源：分類館首頁 Figma 檔案 Variables  
> 目標：**design-system-all.json（唯一真實來源 / source of truth）**

---

## 遷移原則

- 若此文件與 `design-system-all.json` 衝突，**一律以 `design-system-all.json` 為準**
- alias 方向固定為 `comp → sys → ref`
- 價格色與品牌色分流：價格 = `sys/color/price`
- 13px 已定案保留為 `body-md-alt`

---

## 色彩遷移對照

| 舊 Token | 舊 HEX | → 新 ref | → 新 sys | 使用場景 |
|----------|--------|----------|----------|---------|
| `brand/500` / `Primary/300 (Branding)` | #FF963B | `ref/color/orange/500` | `sys/color/primary` | 主要按鈕、CTA |
| `Grey/Black` / `neutral/900` | #161619 | `ref/color/neutral/900` | `sys/color/on-surface` | 主要文字 |
| `states/danger/500` | #FF4E51 | `ref/color/red/500` | `sys/color/error` | 錯誤狀態 |
| `促銷價格紅` | #FF4E51 | `ref/color/red/500` | `sys/color/price` | 價格、促銷角標 |

---

## 字型遷移對照

| 舊 Token | 舊規格 | → 新 sys/typography |
|----------|--------|---------------------|
| `H2 24/Medium` | 24px / 500 / lh:36 | `sys/typography/headline/md` |
| `H4 18/Semibold` | 18px / 600 / lh:28 | `sys/typography/title/lg` |
| `Body 14/Medium` | 14px / 500 / lh:22 | `sys/typography/body/md` + `weight/medium` |
| `Body 13/Regular` | 13px / 400 / lh:20 | `sys/typography/body-md-alt` (13px / legacy compatibility) |
| `Body 13/Medium` | 13px / 500 / lh:20 | `sys/typography/body-md-alt` + `weight/medium` |
| `Caption 12/Regular` | 12px / 400 / lh:16 | `sys/typography/body/sm` |
| `Tiny 10/Regular` | 10px / 400 / lh:16 | `sys/typography/label/xs` |

### 已定案

1. **13px 已定案保留為相容字階**：使用 `sys/typography/body-md-alt`
2. `label-2xs` = 8px
3. Text Styles baseline = 130（CH 65 + EN 65）

---

## 元件遷移對照

### Product Card（商品卡片）
```
comp/product-card/background     → sys/color/surface
comp/product-card/border         → sys/color/outline-variant
comp/product-card/radius         → sys/radius/lg
comp/product-card/padding        → sys/spacing/md
comp/product-card/elevation      → sys/elevation/low
comp/product-card/title-size     → sys/typography/title/md
comp/product-card/title-color    → sys/color/on-surface
comp/product-card/price-size     → sys/typography/headline/sm
comp/product-card/price-color    → sys/color/price
comp/product-card/meta-size      → sys/typography/label/2xs
comp/product-card/meta-color     → sys/color/on-surface-variant
```

### Badge / Tag（標籤）
```
comp/badge/primary/bg            → sys/color/primary
comp/badge/primary/text          → sys/color/on-primary
comp/badge/secondary/bg          → sys/color/primary-container
comp/badge/secondary/text        → sys/color/on-primary-container
```

---

## 下一步規則

1. 任何新增 token 先改 `design-system-all.json`
2. 跑 `validate-design-system.py --root .`
3. 驗證通過後，再更新 snapshot / zip

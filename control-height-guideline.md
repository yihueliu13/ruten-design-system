# Ruten Design System — Control Height 使用規則

> **版本**: v1.0.0
> **日期**: 2026-03-19
> **狀態**: 已定稿
> **依據**: design-system-all.json（唯一真實來源）
> **參考**: Ant Design v5 controlHeight Map Token

---

## 1. 定義

Control Height 是互動控件高度體系，統一管理所有互動元件的固定高度。9 個階級，從 16px 到 52px，每個階級對應特定的元件用途。

---

## 2. 9 級對照表

| sys token | $value | 解析值 | 對應元件 | 典型 fontSize |
|-----------|--------|--------|---------|--------------|
| sys/sizing/control-height/xs | {ref.sizing.4} | 16px | Tag s | 8px (label-2xs) |
| sys/sizing/control-height/sm | {ref.sizing.5} | 20px | Tag m | 10px (label-xs) |
| sys/sizing/control-height/md | {ref.sizing.7} | 28px | Tag l | 13px (body-md-alt) |
| sys/sizing/control-height/default | {ref.sizing.8} | 32px | Button sm, Tab sm, SearchBar | 12px (label-md) |
| sys/sizing/control-height/lg | {ref.sizing.9} | 36px | Tag lg-alt | 14px (body-md) |
| sys/sizing/control-height/xl | {ref.sizing.10} | 40px | Button md, Tab md, BottomNav center button | 14px (label-lg) |
| sys/sizing/control-height/2xl | {ref.sizing.11} | 44px | Tab lg | 14px (title-sm) |
| sys/sizing/control-height/3xl | {ref.sizing.12} | 48px | Button lg, Tab xl, NavigationBar | 14px (title-sm) |
| sys/sizing/control-height/4xl | {ref.sizing.13} | 52px | Button xl | 16px (title-md) |

---

## 3. Padding 計算公式

工程端的垂直 padding 由以下公式**反推**，不需要額外 token（但 Figma Auto Layout 需要既有的 padding-v token）：

```
paddingBlock = (controlHeight - fontHeight) / 2 - borderWidth
```

- **controlHeight**：固定高度（設計決策，token 控制）
- **fontHeight**：fontSize × lineHeight（Text Style 控制）
- **borderWidth**：邊框寬度（token 控制，通常 0 或 1px）
- **paddingBlock**：工程端算出來的，不需要 token

---

## 4. 範例驗算：Button sm = 32px

```
controlHeight = 32px     ← sys/sizing/control-height/default
fontSize      = 14px     ← sys/typography/label-md
lineHeight    = 1.57     ← Text Style
fontHeight    = 14 × 1.57 ≈ 22px
borderWidth   = 1px      ← sys/border/width/default

paddingBlock  = (32 - 22) / 2 - 1 = 4px

驗算：
  1px  (上邊框)
+ 4px  (上 padding)
+ 22px (文字)
+ 4px  (下 padding)
+ 1px  (下邊框)
= 32px ✅
```

---

## 5. 範例驗算：Tag l = 28px

```
controlHeight = 28px     ← sys/sizing/control-height/md
fontSize      = 13px     ← sys/typography/body/md-alt
lineHeight    = 1.54     ← Text Style
fontHeight    = 13 × 1.54 ≈ 20px
borderWidth   = 1px      ← sys/border/width/default

paddingBlock  = (28 - 20) / 2 - 1 = 3px

驗算：
  1px  (上邊框)
+ 3px  (上 padding)
+ 20px (文字)
+ 3px  (下 padding)
+ 1px  (下邊框)
= 28px ✅
```

---

## 6. 常見問題 QA

| # | 問題 | 答案 |
|---|------|------|
| 1 | controlHeight 是固定高度還是最小高度？ | **固定高度。** 工程端用 CSS `height` 或 `min-height` + `flex align-items: center` 實作。 |
| 2 | line-height 會撐開嗎？ | **不會。** padding 是反推的，保證總高度 = controlHeight。 |
| 3 | padding-v 需要 token 嗎？ | **不需要。** 工程端用公式算。但既有的 Button/Tab padding-v token 保留，Figma Auto Layout 需要。 |
| 4 | fontSize 改了怎麼辦？ | padding 自動重新計算，controlHeight 不變。 |
| 5 | fontHeight > controlHeight 怎麼辦？ | **不允許。** 每個 control-height 階級配對固定的 Text Style，設計師不能任意把大字塞進小控件。 |

---

## 7. 與 Text Style 的配對關係

每個 control-height 階級有建議的 fontSize 上限。超過上限會導致 padding 為負數（fontHeight > controlHeight），這是不允許的。

| control-height | 可用值 | fontSize 上限 | 建議 Text Style |
|---------------|--------|-------------|----------------|
| xs (16px) | 8px | ~10px | label-2xs (8px) |
| sm (20px) | 10px | ~13px | label-xs (10px) |
| md (28px) | 13px | ~18px | body-md-alt (13px) |
| default (32px) | 12-14px | ~20px | label-md (12px), label-lg (14px) |
| lg (36px) | 14px | ~24px | body-md (14px) |
| xl (40px) | 14px | ~28px | label-lg (14px) |
| 2xl (44px) | 14px | ~32px | title-sm (14px) |
| 3xl (48px) | 14-16px | ~36px | title-sm (14px) |
| 4xl (52px) | 16px | ~40px | title-md (16px) |

---

## 8. comp 層的引用方式

所有互動控件的 min-height 統一 alias 到 sys/sizing/control-height/*：

```
comp/button/sm/min-height   → {sys.sizing.control-height.default}   (32px)
comp/button/md/min-height   → {sys.sizing.control-height.xl}        (40px)
comp/button/lg/min-height   → {sys.sizing.control-height.3xl}       (48px)
comp/button/xl/min-height   → {sys.sizing.control-height.4xl}       (52px)
comp/tab/sm/min-height      → {sys.sizing.control-height.default}   (32px)
comp/tab/md/min-height      → {sys.sizing.control-height.xl}        (40px)
comp/tab/lg/min-height      → {sys.sizing.control-height.2xl}       (44px)
comp/tab/xl/min-height      → {sys.sizing.control-height.3xl}       (48px)
comp/tag/base/s/min-height  → {sys.sizing.control-height.xs}        (16px)
comp/tag/base/m/min-height  → {sys.sizing.control-height.sm}        (20px)
comp/tag/base/l/min-height  → {sys.sizing.control-height.md}        (28px)
comp/tag/base/lg-alt/min-height → {sys.sizing.control-height.lg}    (36px)
comp/search-bar/height      → {sys.sizing.control-height.default}   (32px)
comp/nav-bar/height         → {sys.sizing.control-height.3xl}       (48px)
comp/bottom-nav/center-button/size → {sys.sizing.control-height.xl} (40px)
```

---

## 9. AI Agent 指引

```
1. 新增互動控件時：
   - min-height 一律 alias 到 sys/sizing/control-height/*
   - 不能寫死數值（如 "32" → 必須用 "{sys.sizing.control-height.default}"）

2. 選擇哪個 control-height 階級：
   - 先看元件的觸碰目標需求（WCAG 建議 ≥ 40px = xl）
   - 再看搭配的 fontSize（不能超過 fontSize 上限）
   - 最後看視覺密度需求（緊湊場景用 xs~md，寬鬆場景用 xl~4xl）

3. padding 不要自己算：
   - 設計側：Figma Auto Layout 用既有的 padding-v token
   - 工程側：用公式 (controlHeight - fontHeight) / 2 - borderWidth

4. 如果需要新的 control-height 階級：
   - 先確認 9 個現有階級都不符合
   - 新增需要經過討論確認
   - 新增時同步更新 ref/sizing/ 和此 guideline
```

---

## 10. 版本紀錄

| 版本 | 日期 | 變更 |
|------|------|------|
| v1.0.0 | 2026-03-19 | 初始版本。9 個 sys/sizing/control-height/* token。padding 計算公式。QA 5 題。Text Style 配對表。 |

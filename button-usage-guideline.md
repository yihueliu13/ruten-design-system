# Ruten Design System — Button 使用規則

> **版本**: v1.0.0-draft
> **日期**: 2026-03-17
> **狀態**: 討論定稿中
> **依據**: design-system-all.json（唯一真實來源）

---

## 1. Button vs Link

```
點擊後做什麼？
├── 執行操作（送出、刪除、展開、確認）→ Button（comp/button/）
└── 導航到其他頁面                     → Link（comp/link/，獨立 component）
```

看起來像文字連結但觸發操作的（「上一步」「更改」「再想想」）→ ghost button。

---

## 2. Button 架構

```
comp/button/
├── {role}                ← primary / secondary / tertiary / ghost
│   ├── {status}          ← default / danger / info
│   │   └── {state}       ← default / hover / pressed / disabled / loading
│   │       └── {property}  background, text-color, border-color, border-width, opacity
│   └── ...
├── {size}                ← xs / sm / md / lg / xl
│   └── {property}          min-height, padding-h, padding-v, font-size, icon-size, gap, border-radius
├── base/
│   └── font-weight         共用 500
└── form                  ← label / label-icon / icon（Figma Variant prop，不需 token）
```

---

## 3. Role（角色）

描述按鈕在頁面上的重要程度。

| Role | 外觀 | 強調 | 場景 |
|------|------|------|------|
| **primary** | 深灰底 neutral/800 + 橘字 primary | ★★★★★ | 最重要 CTA：送出、下一步、同意 |
| **secondary** | 橘底 primary + 白字 | ★★★★ | 品牌 CTA：看更多、查看賣場、一鍵轉售 |
| **tertiary** | 橘框 + 橘字 | ★★★ | 次要操作：返回修改、關注+、展開 |
| **ghost** | 透明 + 橘字 | ★★ | 最輕量：再想想、確定、上一步 |

### 3.1 使用規則

- **每個 section 最多一個 primary**
- **primary 和 secondary 不同時出現**在同一畫面
- Dialog footer 標準組合：ghost + primary
- 兩按鈕並排：primary + ghost，或 primary + tertiary
- secondary 用在**獨立 CTA**（不與 primary 並排）

### 3.2 Token 路徑

```
comp/button/primary/default/background     → {sys.color.on-surface}
comp/button/primary/default/text-color     → {sys.color.primary}
comp/button/primary/default/border-color   → {sys.color.on-surface}
comp/button/secondary/default/background   → {sys.color.primary}
comp/button/secondary/default/text-color   → {sys.color.on-primary}
comp/button/tertiary/default/background    → {sys.color.surface}
comp/button/tertiary/default/text-color    → {sys.color.primary}
comp/button/tertiary/default/border-color  → {sys.color.primary}
comp/button/ghost/default/background       → transparent
comp/button/ghost/default/text-color       → {sys.color.primary}
```

---

## 4. Form（型態）

描述容器裡放什麼內容。由 Figma Variant prop 控制，不需要獨立的 token。

| Form | 內容 | 說明 |
|------|------|------|
| **label** | 純文字 | 預設 |
| **label-icon** | 文字 + icon（leading 或 trailing） | 查看賣場🏠、展開▼、關注+ |
| **icon** | 純 icon | 關閉✕、收藏♥（正方形容器）|

Icon size 跟 button size 走：xs=12, sm=16, md=20, lg=24, xl=24。
Icon-only 用正方形容器（24/32/40/48/52px）。

---

## 5. Size（尺寸）

固定對應使用場景。

| Size | min-height | padding-h | font-size | icon | radius | 場景 |
|------|-----------|-----------|-----------|------|--------|------|
| **xs** | 24px | 8px | 11px | 12px | pill (9999px) | 關注+、極緊湊 |
| **sm** | 32px | 12px | 12px | 16px | 8px | 卡片內 CTA |
| **md** | 40px | 16px | 14px | 20px | 8px | Web 通用（預設）|
| **lg** | 48px | 24px | 14px | 24px | 8px | App 觸控、Dialog |
| **xl** | 52px | 32px | 16px | 24px | 8px | 全寬 CTA |

### 5.1 Token 路徑

```
comp/button/{size}/min-height
comp/button/{size}/padding-h
comp/button/{size}/padding-v
comp/button/{size}/font-size
comp/button/{size}/icon-size
comp/button/{size}/gap
comp/button/{size}/border-radius
```

---

## 6. Status（語義色覆寫）

疊加在 role 上，覆寫色彩語義。大多數按鈕的 status 是 default。

| Status | 色彩 | 適用 role | 場景 |
|--------|------|----------|------|
| **default** | 品牌色系（橘） | 全部 | 一般操作 |
| **danger** | 紅色系 error | tertiary, ghost | 刪除、取消訂單 |
| **info** | 藍色系 info | primary | 一番賞 |

### 6.1 Token 路徑

```
comp/button/tertiary/danger/default/border-color  → {sys.color.error}
comp/button/tertiary/danger/default/text-color     → {sys.color.error}
comp/button/ghost/danger/default/text-color         → {sys.color.error}
comp/button/primary/info/default/background         → {sys.color.info}
comp/button/primary/info/default/text-color         → {sys.color.on-info}
```

---

## 7. State（互動狀態）

所有 role × status 共用同一套 state 邏輯。

| State | 視覺 | 觸發 |
|-------|------|------|
| **default** | 基準 | — |
| **hover** | opacity 0.85 或 bg 微調 | 滑鼠懸停 |
| **pressed** | opacity 0.7 / scale 0.98 | 點擊中 |
| **disabled** | opacity 0.4 | 不可操作 |
| **loading** | spinner 替換 icon | 等待回應 |

---

## 8. Border-width（tertiary 專用）

Outlined（tertiary）的 border-width 由場景決定，不綁 button size。
引用 sys/border/width 的三級 token（ref → sys 繼承）：

```
ref/border/width/hairline (0.5) → sys/border/width/hairline
ref/border/width/thin (1)      → sys/border/width/default
ref/border/width/thick (2)     → sys/border/width/focus
```

| border-width | sys token | 使用場景 |
|-------------|-----------|---------|
| **0.5px** | sys/border/width/hairline | disabled 態 |
| **1px** | sys/border/width/default | 預設（所有標準 tertiary）|
| **2px** | sys/border/width/focus | 深色表面、需要強對比 |

Token 路徑：

```
comp/button/tertiary/default/border-width          → {sys.border.width.default}     (1px)
comp/button/tertiary/disabled/border-width          → {sys.border.width.hairline}    (0.5px)
```

深色表面的 2px 覆寫由場景 component 處理，或 Phase 3 Variable Mode 處理。

---

## 9. Width（寬度行為）

| Mode | 說明 | 場景 |
|------|------|------|
| **hug** | 按內容收縮 | 預設 |
| **fill** | 撐滿容器 | Dialog footer、全寬送出 |
| **fixed** | 固定寬度 | 特殊情境 |

---

## 10. 深色表面處理

深色表面（一番賞、賣家 profile）上的按鈕，角色不變（還是 primary / tertiary / ghost），色彩由環境決定。

**現階段：** 深色表面的場景少，由各 component 自行覆寫按鈕色彩。
**Phase 3：** 用 Figma Variable Mode 統一處理深色/淺色表面的色彩切換。

---

## 11. 業務狀態按鈕

Button token 只管外觀。業務邏輯在 wrapper component 層處理。

| 業務場景 | Wrapper | 傳給 Base Button 的 props |
|---------|---------|------------------------|
| 競標 — 即將開始 | AuctionButton | role=secondary, disabled=true |
| 競標 — 我要出價 | AuctionButton | role=primary, form=label-icon |
| 競標 — 競標結束 | AuctionButton | role=secondary, disabled=true |
| 轉售 — 一鍵轉售 | ResellButton | role=primary, form=label-icon |
| 轉售 — 已發佈 | ResellButton | role=tertiary, form=label-icon |

---

## 12. 場景對照表

### 12.1 主站（Light Surface）

| 場景 | Role | Form | Size | Width |
|------|------|------|------|-------|
| 送出（表單） | primary | label | lg | fill |
| 同意並啟用服務 | primary | label | lg | fill |
| 下一步 | primary | label | lg | hug |
| 看更多 | secondary | label | md | hug |
| 查看賣場 🏠 | secondary | label-icon | md | hug |
| 返回修改 | tertiary | label | lg | fill |
| 關注 + | tertiary | label-icon | xs | hug |
| 展開更多分類 ▼ | tertiary | label-icon | md | hug |
| 新增 + | tertiary | label-icon | sm | hug |
| 更多（灰色） | tertiary | label | md | hug |
| 再想想 | ghost | label | lg | hug |
| 確定（Dialog） | ghost | label | lg | fill |
| 上一步 | ghost | label | lg | hug |
| 關閉 ✕ | ghost | icon | sm | — |
| 刪除商品 | tertiary+danger | label | md | hug |
| 開抽（一番賞） | primary+info | label | lg | hug |

### 12.2 Dialog Footer 標準組合

| 組合 | 左側 | 右側 |
|------|------|------|
| 一般確認 | ghost（確定） | primary（取消） |
| 危險操作 | ghost（取消） | tertiary+danger（刪除） |
| 服務同意 | ghost（再想想） | primary（同意並啟用） |
| 表單導航 | ghost（上一步） | primary（下一步） |

---

## 13. 命名遷移（舊 → 新）

| 舊路徑 | 新路徑 | 說明 |
|--------|--------|------|
| comp/button/primary/* | comp/button/secondary/* | 舊 primary 是橘底白字 = 新 secondary |
| comp/button/secondary/* | comp/button/tertiary/* | 舊 secondary 是框線 = 新 tertiary |
| comp/button/ghost/* | comp/button/ghost/* | 不變 |
| — | comp/button/primary/* | 新增：深灰底橘字 |

**注意：** 舊的 primary（橘底白字）在新定義中是 secondary。需要全面替換。

---

## 14. Token 數量預估

| 類別 | 數量 |
|------|------|
| Base 共用 | 1 |
| Size × 5 (xs/sm/md/lg/xl) | 35 |
| Role × State (4 role × 5 state × ~3 props) | ~60 |
| Status 覆寫 (danger, info) | ~8 |
| **預估總計** | **~104** |

（從現有 49 → ~104）

---

## 15. AI $description 範例

```json
{
  "$value": "{sys.color.on-surface}",
  "$description": "Primary button default background. Highest-priority CTA (submit, confirm, next). Dark neutral surface with brand orange text. One per section max. Never alongside secondary."
}
```

```json
{
  "$value": "{sys.color.primary}",
  "$description": "Secondary button default background. Brand-colored standalone CTA (view more, view store). Orange surface with white text. Never alongside primary."
}
```

```json
{
  "$value": "{sys.color.error}",
  "$description": "Tertiary danger button border color. Destructive actions only (delete, cancel order). Red border with red text on white surface."
}
```

---

## 16. 版本紀錄

| 版本 | 日期 | 變更 |
|------|------|------|
| v1.0.0-draft | 2026-03-17 | 初始版本。角色命名：primary/secondary/tertiary/ghost。5 Size（含 xs pill）。3 Status。Border-width 三級（0.5/1/2）。業務狀態按鈕用 wrapper component。 |

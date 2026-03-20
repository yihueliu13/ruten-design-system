# Figma Component Build Guide — 2026-03-20

> 三個 Scripter 腳本，依序在 DS測試 file 執行

---

## 前置作業：確認 Variables 已更新

Tab 最近有 2 個 token 變更（indicator-height 2→3, 新增 hover/text-color），
如果 Figma Variables 還沒有這兩筆，先做 Thierry overlay import：

1. 打開 DS測試 file (JntRm8aTeyw1HPdowgSBk4)
2. Plugins → Variables Import (Thierry) → 指向 `design-system-all.json`
3. Import mode: **Overlay**（只新增/更新，不刪除）
4. Collection: **ruten**
5. 確認 import 結果包含 `comp/tab/indicator-height = 3` 和 `comp/tab/hover/text-color`

---

## Step 1: Tab Item + Tab Bar

**腳本**: `scripter-01-tab.js`

| 產出 | Variants |
|------|----------|
| Tab Item | 12 (4 size × 3 state) |
| Tab Bar  | 2 (fixed / scrollable) |

**結構**:
```
Tab Item (VERTICAL auto layout)
├── Content (HORIZONTAL, centered label, padding from token)
├── Indicator (3px hardcoded, pill top corners, color from token)
└── Divider (1px, outline-variant grey)
```

**Variable Binding**:
- minHeight → comp/tab/{size}/min-height
- padding → comp/tab/{size}/padding-h, padding-v
- background → comp/tab/{state}/background
- text color → comp/tab/{state}/text-color
- indicator color → comp/tab/{state}/indicator-color
- font: PingFang TC Medium (inactive/hover) / Semibold (active)
- font-size: 直接設值（12/14/16px），不綁 Variable（走 Text Style）

---

## Step 2: Button

**腳本**: `scripter-02-button.js`

| 產出 | Variants |
|------|----------|
| Button | 32 (4 role × 4 size × 2 form) |

**結構**:
```
Button (HORIZONTAL auto layout, centered)
├── Icon (square frame, visible in label-icon only)
└── Label (text, "Button")
```

**4 Roles**:
| Role | JSON 狀態 | 說明 |
|------|----------|------|
| primary | ✅ comp/button/primary/* | 橘底白字 |
| secondary | ✅ comp/button/secondary/* | 白底橘字 + 灰邊框 |
| tertiary | ⚠️ 尚未在 JSON | 用 fallback 色（橘框橘字），等 JSON rename |
| ghost | ✅ comp/button/ghost/* | 透明底橘字 |

**⚠️ 注意**: JSON 的命名尚未遷移到 guideline 的新命名。
目前 JSON 的 `primary` = guideline 的 `secondary`（橘底），
JSON 的 `secondary` = guideline 的 `tertiary`（框線）。
腳本按你指定的 token path 綁定。

---

## Step 3: Avatar

**腳本**: `scripter-03-avatar.js`

| 產出 | Variants |
|------|----------|
| Avatar | 12 (6 size × 2 active) |

**結構**:
```
Avatar (circular frame, clip content, auto layout centered)
├── Initial (text placeholder "A", grey)
└── (future: Image fill)
```

**Active 狀態**:
- active=true: 2px orange border (strokeAlign: OUTSIDE)
- active=false: no border

---

## 執行順序

```
1. Thierry overlay import (如果需要)
2. Scripter → scripter-01-tab.js → Run
3. Scripter → scripter-02-button.js → Run
4. Scripter → scripter-03-avatar.js → Run
5. 每個跑完後確認 console 有 ✅
```

---

## 執行後驗證

跑完 3 個腳本後，在 Figma 選取任一 variant，
回 Cowork 告訴我 node-id，我用 get_variable_defs 驗證 binding。

或自行檢查：
- 選取 Tab Item 的 md/active variant → 右側 panel 看 Variable 綁定
- 選取 Button 的 primary/md/label variant → 確認 fills 綁 comp/button/primary/default/background
- 選取 Avatar 的 md/active=true variant → 確認 strokes 綁 comp/avatar/active/border-color

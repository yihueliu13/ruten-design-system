# Token Pipeline Reference（未來 Phase 2 備忘）

> **狀態**：🟡 Reference note，非現行任務
> **建立時機**：2026-04-10，針對某個外部多品牌前端 repo 的 workflow 做取捨筆記
> **用途**：等元件 sprint 結束、Phase 2 要做前端消費時回來參考

---

## 背景

外部有一個多品牌前端 repo，結構是：

```
vite.config.ts                    ← 支援 --theme 切主題
src/themes/${themeKey}/config.ts  ← 各品牌獨立 config
__THEME_CONFIG__                  ← 全域注入
_variables.scss                   ← 灌進 SCSS 編譯流程
generate-theme-from-variables.mjs ← token JSON → SCSS 映射腳本
```

這份筆記是過濾後的**值得借鏡清單**，不是全盤抄襲。

---

## 值得借鏡的 5 個做法

| 做法 | 現況 | 優先級 |
|------|------|--------|
| **`--theme` CLI flag 切 build** | ❌ Ruten/Ichiban/Resell 沒有統一 build 指令 | 🟢 值得 — 多品牌專案標準做法 |
| **從來源 theme 複製到目標 theme**（新品牌 bootstrap） | ❌ 沒有腳本化 | 🟢 值得 — 未來加第四個品牌會用到 |
| **Token JSON → SCSS/CSS Variables 映射** | 🟡 有 `design-system-all.json` + `validate-design-system.py`，沒有跨 repo 輸出 | 🟢 值得 — 跟 Style Dictionary / DTCG 對齊 |
| **自動補 dark/light alpha 階** | ❓ 待確認目前是手動還是自動 | 🟡 視現況決定 |
| **spacing → rem、radius → size token 自動換算** | 🟡 有欄位，自動化程度待確認 | 🟢 值得 — 降低人為錯誤 |

---

## ❌ 明確不抄的做法

**`config.ts` 同時管 features + navbar layout + 首頁/mobile 組件配置 + component props**

理由：
- 這是一個 god object config，耦合度過高
- 改顏色可能意外動到首頁結構
- 違反 Ruten Design System 的三層原則（`ref → sys → comp`）
- 健康的設計系統：視覺層改動**不應該**往上影響到組件選擇

**這個批評只針對程式碼架構耦合，不針對那個團隊的 AI 治理主張。** 見 `ai-delivery-principles.md`（若存在）。

---

## 落地路線圖（Phase 2 啟動時參考）

### Step 1 — 產出 token 匯出管道

**現況**：`design-system-all.json` 是 SOT，但主要給 Figma 用，沒有直接餵前端的輸出

**缺口**：沒有腳本把 SOT → 前端可吃的格式

**補法**：寫 `tool/export-tokens.py`
- Input：`design-system-all.json`
- Output：三品牌 × 三格式
  - SCSS (`_variables.scss`)
  - CSS Variables (`:root { --token: value }`)
  - JS module (`export const tokens = {...}`)
- 對齊 DTCG 規範

### Step 2 — 多品牌 build 腳本

**現況**：三品牌在 SOT 裡分開，但沒有切品牌的自動化

**補法**：寫 `tool/bootstrap-brand.py`
- 從 Ruten 複製出新品牌架構
- 自動替換 brandName / brandCode / primary color
- 保留所有 sys 和 comp 層的 alias

---

## 為什麼現在不做

| 原因 | 說明 |
|------|------|
| **現階段瓶頸不在這** | 19 個元件還在 sprint（見 `ops/EXECUTION_PLAN.md`） |
| **會白寫** | 元件沒穩定，token 需求還會變，現在做 export 腳本等於預測未來 |
| **時機未到** | 等 Phase 2 要做前端消費時再回來 |

---

## 觸發條件（什麼時候回來看這份）

- [ ] 19 個元件 sprint 完成
- [ ] Phase 2 開始前端消費 token
- [ ] 要新增第四個品牌
- [ ] 前端團隊提出需要某種 build-time theme switching

任一條件成立，回來讀這份，決定要不要落地 Step 1 / Step 2。

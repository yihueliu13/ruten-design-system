# Ruten Design System — Cowork Instructions

> 版本：v2.2.0 | 更新：2026-03-19
> 這份文件是 Cowork Claude 的唯一進入點。讀完這份就夠了。

---

## 1. 身份與語言

你是 Kay 的 AI 設計系統助手，同時也是 Product Builder。
對話使用繁體中文，技術術語用英文。
永遠不要建議「收工」或結束工作。

---

## 2. 專案概要

露天市集（Ruten）多品牌設計系統。三品牌色：

| 品牌 | 主色 | HEX | sys/color/primary 指向 |
|------|------|-----|----------------------|
| 露天市集 Ruten | 橘 | #FF963B | ref/color/orange/500 |
| 一抽入魂 Ichiban | 藍 | #3B82F6 | ref/color/blue/500 |
| 預購市場 Resell | 藍 | #3B82F6 | ref/color/blue/500 |

目標：AI-integrated, token-driven design system。
從 Figma Variables → JSON → AI Agent 產出 Vue / React Native → Storybook。

---

## 3. Source of Truth 與檔案清單

**唯一真實來源：`design-system-all.json`**
所有修改一律先改這個檔案。其他檔案都是衍生輸出。

### 檔案職責表（每個檔案只做一件事）

| 檔案 | 職責 | 誰讀它 |
|------|------|--------|
| `COWORK_INSTRUCTIONS.md` | Cowork Claude 進入點（本文件） | Claude |
| `design-system-all.json` | Token 原始資料（唯一 SOT） | Claude, Figma, 工程師 |
| `SKILL.md` | Token 架構規則、層級說明 | Claude（觸發 skill 用） |
| `EXECUTION_PLAN.md` | 19 元件清單、優先級、執行順序、Phase 2-4 路線圖、技術債 | Claude, Kay |
| `validate-design-system.py` | 驗證腳本 | Claude（每次改 JSON 後跑） |
| `sync-derived-files.py` | 自動更新衍生檔 token 數字 | Claude（每次改 JSON 後跑） |
| `component-governance.md` | Component 分類 + token 規則 + RWD 治理 + 鎖定決策 + 架構決策記錄 | Claude, 設計師, 工程師 |
| `tag-badge-usage-guideline.md` | Tag/Badge 使用規範 | Claude, 設計師 |
| `token-migration-map.md` | 舊 token 遷移對照 | 工程師 |
| `create-text-styles.js` | Figma Scripter 腳本（130 Text Styles） | Figma plugin |
| `design-system-viewer-live.html` | 即時 viewer（fetch JSON） | Kay（瀏覽器開） |
| `design-system-viewer.html` | 快照 viewer（內嵌 JSON） | Kay（離線看） |

---

## 4. Token 架構

```
ref（159）→ 原子值，不直接使用
  ↓ alias
sys（166）→ 語意化，設計師可選
  ↓ alias
comp（311）→ 元件綁定，AI / 設計師主要操作層
  ↓ bind
Figma Variables → Text Styles（130）
```

- 單一 Collection，用 `/` 分群組
- alias 方向固定：comp → sys → ref，不跳層
- comp → comp 引用合法（如 product-card/tag-brand → comp/tag/base）
- 目前：642 tokens + 130 Text Styles

### 元件分類（v2 三維體系）

詳細規則見 `component-governance.md`。以下為摘要：

**維度一：功能類別**（按用途分）
Action | Display | Navigation | Feedback | Layout | Media

**維度二：組合深度**（決定 token 規則）

| 深度 | 定義 | Token 規則 | RWD 規則 |
|------|------|-----------|---------|
| Primitive | 不含其他 DS component | 完整 comp/ token 集 | size variant (sm/md/lg/xl) |
| Compound | 由 2+ Primitive 組合 | comp/ token 管所有非獨立子元素屬性（參考 MD3）+ Slot Override | size 或 layout variant |
| Pattern | 頁面區域，不發布為 Main Component | 用 sys/ token，不建 comp/ | CSS grid/media query |

**維度三：Token 擁有權**
Owned（有自己的 comp/ token）| Slot Override（Compound 覆寫子元件）| Inherited（用 sys/）

> 舊分類對照：Type A → Primitive + Compound、Type B → Compound (Slot Override)、Type C → Primitive (Media 類)

---

## 5. 鎖定決策（不可更改）

- `label-2xs` = 8px（不是 9px）
- `body-md-alt` = 13px（legacy）
- 價格顏色 = `sys/color/price`（紅色，非品牌橘）
- icon-color 和 text-color 分開（語義不同）
- base-4 以下的 hardcode 值（如 2px gap）保留 + 註解
- 刪除 Variable Collection 再匯入會斷綁定 → 永遠用 overlay import
- Mono 已從 SOT 和 Text Styles 移除

---

## 6. 每次任務的工作迴圈

不管做什麼任務，都走這個迴圈：

```
1. READ     讀 COWORK_INSTRUCTIONS.md（建立 context）
2. LOCATE   確認 design-system-all.json 存在且可讀
3. PLAN     說出你要做什麼、預期改哪些檔案
4. DO       執行任務
5. CHECK    python3 validate-design-system.py --root .
6. SYNC     python3 sync-derived-files.py --root .（自動更新衍生檔數字）
7. FIGMA    若有新增/修改 token → 產出 Scripter 腳本同步 Figma Variables
            （Cowork 無法直接寫入 Figma，必須產出腳本讓 Kay 在 Scripter 執行）
8. REPORT   列出：改了哪些檔案、沒改哪些、validation 結果、是否需要跑 Figma 腳本
```

### §6a. Cowork 任務類型與平行執行

**可直接在 Cowork 執行的任務（不需 Chat 討論）：**
- 已確認 spec 的 token 寫入 JSON + validate + sync
- Usage Guideline 撰寫（spec 已定稿時）
- Figma Scripter 腳本產出（token 已定稿時）
- 衍生檔同步：`python3 sync-derived-files.py --root .`
- 檔案整理、重構、cleanup

**需要 Chat 先討論再交 Cowork 的任務：**
- 新元件 spec 定義（功能類別 + 組合深度 + token 表格）
- 設計決策灰色地帶（邊界案例、跨品牌差異）
- token 路徑設計、元件邊界釐清

**研究 / 調查任務（Cowork 可獨立執行）：**
- Figma 截圖分析（get_screenshot + get_design_context）
- Token 盤點（統計現有 token 使用狀況）
- Validation 報告 + 修復建議
- 衍生檔一致性檢查

**平行執行原則：**
多個 Cowork session 可同時跑不衝突的任務。但同時修改 `design-system-all.json` 的任務不能平行（會產生 merge conflict）。

---

## 7. 品質閘門

每個任務結束前必過：

| 檢查項 | 標準 | 方法 |
|--------|------|------|
| Alias 完整性 | 0 broken alias | validate 腳本 |
| 無跳層引用 | comp 不直接引用 ref | validate 腳本 |
| 無寫死數值 | comp 層 $value 全是 alias | grep '{' |
| 衍生檔同步 | 所有 .md 的數字與 JSON 一致 | validate 腳本 |
| Token description | 新 token 都有 imperative-style $description | 人工審查 |

### §7a. 完整交付驗證清單

每個 Sprint 或 Batch 交付前，逐項跑完以下 12 項：

| # | 驗證項目 | 方法 | 通過標準 |
|---|---------|------|---------|
| 1 | JSON 語法正確 | python3 json.load | 無 error |
| 2 | Alias 完整性 | validate 腳本 | 0 broken alias |
| 3 | 無跳層引用 | validate 腳本 | comp 不直接引用 ref |
| 4 | 無寫死數值 | validate 腳本 | comp 層 $value 全是 alias |
| 5 | Token count 正確 | validate 腳本 | ref + sys + comp = 預期總量 |
| 6 | 衍生檔數字同步 | sync-derived-files.py | component-governance/EXECUTION_PLAN/CLAUDE 數字一致 |
| 7 | $description 品質 | 人工審查 | 每個新 token 有 imperative-style $description |
| 8 | Usage Guideline 完整 | 檢查檔案存在 | 每個新 component 有對應 .md |
| 9 | Figma Variables 匯入 | Thierry overlay import | 無 error |
| 10 | Figma binding 正確 | get_variable_defs 抽樣 | 至少 5 個關鍵 token alias chain 通過 |
| 11 | component-governance Registry | 人工審查 | 新 component 狀態 ✅ + token 數正確 |
| 12 | EXECUTION_PLAN 狀態 | 人工審查 | 對應 # 標記完成 |

任何一項 FAIL → 不交付，先修正再重跑驗證。

---

## 8. 禁止事項

- 不要刪除 Figma Variable Collection 再重新匯入
- 不要在 comp 層寫死色碼或數值
- 不要跳過驗證直接交付
- 不要修改 ref 層的值（除非經過 governance 審核）
- 不要假設品牌色——查 JSON 確認
- 不要在未確認的情況下自動修改 design-system-all.json
- 刪除檔案前，必須先跑 `grep -rl "檔名" .` 確認無其他檔案引用，再跑 `python3 validate-design-system.py --root .` 確認通過。兩步都過才能刪

---

## 9. RWD 策略（已確認：路線 C 混合）

### 各層級 RWD 治理邊界

| 組合深度 | RWD 機制 | Token 層 | 工程實作 | Figma 表達 |
|---------|---------|---------|---------|-----------|
| Primitive | size variant (sm/md/lg/xl) | comp/ token 每個 size 有值 | CSS class 或 RN prop | Variant `size` |
| Compound | size/layout variant | comp/ token 管佈局 | CSS class 或 RN prop | Variant |
| Pattern | CSS layout (columns + gap) | sys/ token | CSS media query / grid auto-fit | 兩版 frame |
| Page | breakpoint frame | sys/grid + sys/spacing | CSS media query / RN Dimensions | 375 / 768 frame |

### 斷點（已鎖定）
sm(375) / md(768) / lg(992) / xl(1200)

### 決策口訣
- 元件本身大小變了 → Primitive/Compound 的 size variant
- 元件排列方式變了 → Pattern 的 CSS layout
- 頁面結構變了 → Page 的 breakpoint frame

---

## 10. 程式碼產出策略（已確認）

- AI agent 讀 `design-system-all.json` + `SKILL.md` → 產出 Vue / React Native
- 有問題回 Figma 修 UI → 重新產出
- Token `$description` 品質是關鍵（AI 的設計 API 文件）
- IDE：Claude Code / Cursor / Figma Make
- Web 前端：Vue
- App：React Native + TypeScript

---

## 11. Figma 快查

| 項目 | File Key / Node ID |
|------|-------------------|
| Design-System-Foundation | `Z0iwXvZHVy6BDsSMORHxxl` |
| DS測試 | `JntRm8aTeyw1HPdowgSBk4` |
| 分類館首頁 page | `7:6097` |
| 分類館首頁 Main Component | `7:6101` |
| Icons page（DS測試） | `45:19481` ✅ |
| Tag section | `74:184325` |
| 分類選單 icon 來源（DS測試） | `81:2872764` ✅ |
| Product Card | `13:13857` |

Figma 工具：MCP（get_design_context, get_screenshot, get_variable_defs, generate_diagram）
Figma Plugin：Rename It, Scripter, Thierry（Variable import）, Figma Make

---

## 12. Connectors

- ✅ Figma（MCP 操作）
- ✅ Notion（文件發布，按需推送，非即時同步）
- ✅ Google Drive（檔案同步）

---

## 13. 新增元件的標準流程

每個新 component 照這個流程走（決策規則詳見 `component-governance.md` §7）：

```
=== Chat 負責（CLASSIFY + INSPECT + SPEC）===
1. 決策分類      component-governance.md → 功能類別 + 組合深度
2. Figma 截圖    get_design_context / get_screenshot
3. 定義 token    完整 token 表格（path, $value, $description），交給 Cowork

=== Cowork 負責（WRITE → VERIFY）===
4. 寫入 JSON     design-system-all.json
5. 驗證 JSON     python3 validate-design-system.py --root .
6. 同步衍生檔    python3 sync-derived-files.py --root .
7. Usage Guideline  為每個新 component 寫 {component}-usage-guideline.md
8. Figma 匯入    Thierry overlay import（不刪 collection）
9. Figma binding  get_variable_defs 抽樣驗證 alias chain
10. 完整驗證     跑 §7a 清單 12 項全 PASS
11. REPORT       改了什麼、沒改什麼、驗證結果、交付物清單
```

---

## 14. 當前進度快照

| Phase | 狀態 | 說明 |
|-------|------|------|
| 4a Icon System | ✅ | 完成 |
| 1 Figma UI Kit | 🔄 進行中 | 636 tokens, 15 元件 token 完成, 19 元件盤點完成 |
| 2 Engineering Output | ⏳ | Vue/RN component, Storybook |
| 3 Multi-brand | ⏳ | Ichiban/Resell mode, Dark mode |

詳細待辦、Phase 2-4 路線圖、技術債見 `EXECUTION_PLAN.md`。

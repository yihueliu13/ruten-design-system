# Ruten Design System — Cowork Instructions

> 版本：v2.0.0 | 更新：2026-03-17
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
| `EXECUTION_PLAN.md` | 19 元件清單、優先級、執行順序 | Claude, Kay |
| `RUTEN_TODO.md` | Phase 1-4 全域待辦 | Kay（進度追蹤） |
| `validate-design-system.py` | 驗證腳本 | Claude（每次改 JSON 後跑） |
| `design-system-governance.md` | 治理規則、鎖定決策 | Claude（查規則用） |
| `design-system-progress.md` | 建置進度筆記、決策紀錄 | Claude, Kay |
| `tag-badge-usage-guideline.md` | Tag/Badge 使用規範 | Claude, 設計師 |
| `token-migration-map.md` | 舊 token 遷移對照 | 工程師 |
| `create-text-styles.js` | Figma Scripter 腳本（130 Text Styles） | Figma plugin |
| `design-system-viewer-live.html` | 即時 viewer（fetch JSON） | Kay（瀏覽器開） |
| `design-system-viewer.html` | 快照 viewer（內嵌 JSON） | Kay（離線看） |

---

## 4. Token 架構

```
ref（155）→ 原子值，不直接使用
  ↓ alias
sys（153）→ 語意化，設計師可選
  ↓ alias
comp（221）→ 元件綁定，AI / 設計師主要操作層
  ↓ bind
Figma Variables → Text Styles（130）
```

- 單一 Collection，用 `/` 分群組
- alias 方向固定：comp → sys → ref，不跳層
- comp → comp 引用合法（如 product-card/tag-brand → comp/tag/base）
- 目前：529 tokens + 130 Text Styles

### 元件分類

| Type | 說明 | 範例 |
|------|------|------|
| A Standard | 完全 token 化 | Button, Tab, Tag, Card |
| B Composite | 部分 token + 部分 hardcode | 免運角標, 露天心選 badge |
| C Assets | token 管尺寸，SVG 由 Figma 管 | Icons, Logos |

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
6. SYNC     更新受影響的衍生檔（progress.md, governance.md, SKILL.md 的數字）
7. FIGMA    若有新增/修改 token → 產出 Scripter 腳本同步 Figma Variables
            （Cowork 無法直接寫入 Figma，必須產出腳本讓 Kay 在 Scripter 執行）
8. REPORT   列出：改了哪些檔案、沒改哪些、validation 結果、是否需要跑 Figma 腳本
```

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

---

## 8. 禁止事項

- 不要刪除 Figma Variable Collection 再重新匯入
- 不要在 comp 層寫死色碼或數值
- 不要跳過驗證直接交付
- 不要修改 ref 層的值（除非經過 governance 審核）
- 不要假設品牌色——查 JSON 確認
- 不要在未確認的情況下自動修改 design-system-all.json

---

## 9. RWD 策略（已確認：路線 C 混合）

- **Component level**：Figma Variant `size = sm/md/lg/xl`
- **Page level**：375px（手機）+ 768px（平板）兩版 frame
- Token 的 sm/md/lg/xl = RWD 方案，不需額外 RWD token
- Web：CSS media query 切 size variant
- App：Dimensions API 判斷裝置類別

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

每個新 component 照這個流程走（詳見 EXECUTION_PLAN.md）：

```
1. Figma 截圖     get_design_context / get_screenshot → 確認設計
2. 定義 token     comp/{component}/{property} → 寫入 JSON
                   每個 token 必須有 $description（imperative-style）
3. 驗證           python3 validate-design-system.py --root .
4. 同步衍生檔     progress.md, governance.md, SKILL.md 數字
5. Figma 匯入     Thierry plugin overlay import
6. Figma Component Main Component + Variant (size = sm/md/lg/xl)
7. 驗證 binding   get_variable_defs 確認綁定正確
```

---

## 14. 當前進度快照

| Phase | 狀態 | 說明 |
|-------|------|------|
| 4a Icon System | ✅ | 完成 |
| 1 Figma UI Kit | 🔄 進行中 | 529 tokens, Tag 擴充完成, 19 元件盤點完成 |
| 2 Engineering Output | ⏳ | Vue/RN component, Storybook |
| 3 Multi-brand | ⏳ | Ichiban/Resell mode, Dark mode |

詳細待辦見 `RUTEN_TODO.md`，執行順序見 `EXECUTION_PLAN.md`。

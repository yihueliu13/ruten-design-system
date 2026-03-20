# Ruten Design System — 新增元件標準流程

> 版本：v1.1.0 | 更新：2026-03-19
> 與 COWORK_INSTRUCTIONS.md §13 同步

---

## 總覽

```
Chat（CLASSIFY + INSPECT + SPEC）→ Cowork（WRITE → VERIFY）
```

---

## Chat 負責（CLASSIFY + INSPECT + SPEC）

### Step 1. 決策分類

查 `component-governance.md` §7 決策流程：
- 確認功能類別（Action / Display / Navigation / Feedback / Layout / Media / Overlay / Input）
- 確認組合深度（Primitive / Compound / Pattern）
- 如有邊界爭議 → 查 §8 邊界案例表

### Step 2. Figma 截圖

用 MCP 工具取得設計稿：
- `get_design_context`：取得 node 結構和屬性
- `get_screenshot`：取得視覺截圖

### Step 3. 定義 token

產出完整 token 表格，交給 Cowork：

| 欄位 | 說明 |
|------|------|
| path | Token 完整路徑（如 `comp/divider/color`） |
| $value | Alias 目標（如 `{sys.color.outline-variant}`） |
| $description | Imperative-style 描述，含 What / Use for / Do NOT use for |

Token 規則：
- Primitive: 完整 comp/ token 集
- Compound: comp/ token 管所有非獨立子元素屬性（參考 MD3）
- Pattern: 不建 comp/ token
- Slot Override 的 $description 以 `"Slot override."` 開頭

---

## Cowork 負責（WRITE → VERIFY）

### Step 4. 寫入 JSON

修改 `design-system-all.json`（唯一 SOT）。

### Step 5. 驗證 JSON

```bash
python3 validate-design-system.py --root .
```

### Step 6. 同步衍生檔

更新以下檔案的 token 數字：
- `design-system-progress.md`
- `design-system-governance.md`
- `SKILL.md`
- `component-governance.md`（Registry 狀態 + token 數）

### Step 7. Usage Guideline

為每個新 component 寫 `{component}-usage-guideline.md`，包含：
1. 元件定義（一句話）
2. 使用情境（什麼時候用 / 什麼時候不用）
3. Token 對照表（所有 comp/ token，含路徑、$value、$description）
4. 組合規則（跟哪些元件搭配、Slot 機制）
5. Do / Don't（具體範例）
6. AI Agent 指引（AI 產出 code 時的規則）

### Step 8. Figma 匯入

用 Thierry plugin 做 overlay import：
- **不刪除** collection（overlay import，不是 delete + reimport）
- 確認 collection 名稱和 mode 正確

### Step 9. Figma binding 驗證

用 `get_variable_defs` 抽樣驗證 alias chain：
- 至少 5 個關鍵 token 的完整 alias chain（comp → sys → ref）
- 確認值解析正確

### Step 10. 完整驗證

跑 COWORK_INSTRUCTIONS.md §7a 完整交付驗證清單，12 項全 PASS。

### Step 11. REPORT

列出：
- 改了哪些檔案
- 沒改哪些檔案
- 驗證結果（PASS / FAIL 數）
- 交付物清單

---

## 版本紀錄

| 版本 | 日期 | 變更 |
|------|------|------|
| v1.0.0 | 2026-03-18 | 初始版本。8 步流程。 |
| v1.1.0 | 2026-03-19 | 擴充為 11 步。新增 Step 7 Usage Guideline、Step 9-10 驗證步驟。Compound 規則更新。 |

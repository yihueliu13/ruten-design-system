# Token 新增 / 修改 — 執行流程

> **版本**: v1.1.0
> **日期**: 2026-03-30
> **適用**: 任何新增元件 token、修改既有 token 值、或調整 token 架構的工作

---

## 流程總覽

```
Phase 1  需求 ─→ Phase 2  Token ─→ Phase 3  Guideline ─→ 🔴 Kay 確認 ─→ Phase 4  Figma ─→ 🔴 Kay 確認 ─→ Phase 5  收尾
  研究          定義 SOT         撰寫規範                        建置元件                        驗證提交
```

---

## Phase 1：需求研究

### 1-1. 確認元件分類

查閱 `ref/component-governance.md`，確定：

- 功能類別：Action / Display / Navigation / Feedback / Layout / Media
- 組合深度：Primitive / Compound / Pattern
- 這決定 token 的粒度和 Figma 建置方式

### 1-2. 參考業界標準

在定義尺寸、間距、圓角等數值前，先比對主流設計系統：

- Material Design 3（m3.material.io）
- Ant Design（ant.design）
- Apple HIG（developer.apple.com/design）

確認數值是否合理，是否需要偏離 base-4 grid（偏離時必須在 $description 說明原因）。

### 1-3. RWD 決策

根據元件性質決定是否需要 size variant：

- Primitive / Compound：用 size variant（sm/md/lg/xl），定義在 comp 層
- Pattern：用 CSS layout 處理，不額外建 token
- 非互動的狀態指示器（如 Badge dot）：不分平台，單一尺寸

### 1-4. 影響範圍分析（僅修改既有 token 時）

修改 sys 層 token 值前，必須向下追蹤所有 alias 到它的 comp token：

```bash
grep -r "被修改的 sys token 名稱" design-system-all.json
```

列出影響範圍，確認所有下游元件都能接受新值。

---

## Phase 2：定義 Token（SOT）

### 2-1. 編輯 `design-system-all.json`

遵守三層 alias 方向：`ref → sys → comp`，不可跳層。

新增順序：

1. `ref/` 層 — 原始值（如 `ref.sizing.2` = 8, `ref.color.red.500` = #FF4E51）
2. `sys/` 層 — 語意別名（如 `sys.sizing.badge-dot` → `{ref.sizing.2}`）
3. `comp/` 層 — 元件 token（如 `comp/badge/dot/size` → `{sys.sizing.badge-dot}`）

### 2-2. 多品牌 Mode 檢查

每次新增或修改 token，確認 Ruten / Ichiban / Resell 三個 mode 的值都正確。不是只看預設 mode。

### 2-3. Token 命名規則

```
comp/{component}/{variant}/{property}
```

每個 token 必須有 `$description`，格式：
```
"[What]. [Use for contexts]. [Do NOT use for anti-patterns]."
```

### 2-4. 鎖定決策檢查

在 `ref/component-governance.md` 的 Locked Decisions 和 Architecture Decisions Log 中確認是否有相關的鎖定規則，避免違反。

### 2-5. Gate Check — 驗證 + 同步

```bash
python3 tool/validate-design-system.py --root .    # 必須 0 FAIL 才能往下走
python3 tool/sync-derived-files.py --root .         # 同步 token 計數到衍生檔
```

這是唯一的中途驗證點。Phase 5 不重複跑，除非 Phase 3-4 又改了 SOT。

---

## Phase 3：撰寫 Guideline

### 3-1. 讀範例

先讀 `guideline/` 目錄中同類元件的 guideline 當範例，確保格式一致。

### 3-2. Guideline 結構

```markdown
# 元件定義
# 使用情境（什麼時候用 / 什麼時候不用）
# Token 對照表（路徑、$value、解析值、$description）
# Variant 說明
# 組合關係（與其他元件的搭配）
# Do / Don't
# 版本紀錄
```

### 3-3. 重要原則

- Guideline 必須在建 Figma Component **之前**完成
- Token 對照表的值必須與 SOT 一致
- 描述解析後的實際值（如 16px），不只寫 alias 路徑

### 🔴 人工確認點 ① — Guideline Review

Guideline 撰寫完成後，**暫停，等 Kay 確認**再進 Phase 4。
確認內容：Variant 定義、Token 對照表、組合關係是否正確。
Kay 說「OK」「確認」「繼續」才往下走。

---

## Phase 4：建置 Figma

### 4-1. 建立 / 更新 Figma Variable

- 既有 Variable 更新值：用 Thierry Community Edition
- 新增 Variable：用 Figma Scripter 腳本（Thierry 免費版不支援新增）
- 腳本產出後**直接貼完整內容在對話中**，不要只給檔案路徑

### 4-2. 建立 Figma Component（MCP use_figma）

依 Guideline 的 Variant 定義建置。

**Page 規則**：Component 必須建在 `⭢{ComponentName}` 頁面裡（如 `⭢Badge`、`⭢SearchBar`）。

**兩階段建置**：
1. Phase A — 用 plain color 建立所有 variant → `combineAsVariants()`
2. Phase B — combine 完成後再綁定 Variable

**關鍵注意事項**：

- `combineAsVariants()` 後必須加：
  ```js
  set.primaryAxisSizingMode = "AUTO";
  set.counterAxisSizingMode = "AUTO";
  ```
- `layoutSizingHorizontal = "FILL"` 必須在 `appendChild()` **之後**設定
- `await figma.setCurrentPageAsync(page)` 切頁（不能用 `figma.currentPage = page`）
- Component Set 背景用淺灰（`#F5F7FC`），排版整齊對齊（參考 Button）

### 4-3. Variable 綁定

**色彩綁定**（必須用 `setBoundVariableForPaint`）：
```js
node.fills = [figma.util.solidPaint(hex)];
const fills = [...node.fills];
fills[0] = figma.variables.setBoundVariableForPaint(fills[0], "color", variable);
node.fills = fills;
```

**Typography 4 項必綁**（零硬編碼容忍）：
| 屬性 | Variable 類型 | 綁定方法 |
|------|-------------|---------|
| fontFamily | STRING | `setBoundVariable("fontFamily", var)` |
| fontSize | FLOAT | `setBoundVariable("fontSize", var)` |
| fontWeight | FLOAT | `setBoundVariable("fontWeight", var)` |
| fills | COLOR | `setBoundVariableForPaint()` |

綁定前必須 `await figma.loadFontAsync(textNode.fontName)` 載入當前字型。

### 4-4. Icon 處理

需要 icon 的元件必須使用**真實 Icon Instance**（不用灰色 placeholder）：

```js
const iconComp = figma.getNodeById(ICON_ID);  // 如 outline/search
const instance = iconComp.createInstance();
instance.resize(size, size);
// 綁定 vector fill 到 color Variable
```

### 4-5. 驗證 Figma 結果

用 MCP inspect 檢查：
- 結構是否符合 Guideline
- 所有 token 是否正確綁定（boundVariables 檢查）
- Text node 4 項 typography 全綁定
- Layout 排版整齊

### 🔴 人工確認點 ② — Figma Review

Figma Component 建置 + 驗證完成後，**暫停，等 Kay 在 Figma 目視確認**再進 Phase 5。
確認內容：排版、variant 切換、token 綁定、icon 是否正確。
Kay 說「OK」「確認」「繼續」才往下走。

---

## Phase 5：收尾

### 5-1. 條件驗證

如果 Phase 3-4 期間有修改 `design-system-all.json`，重跑：

```bash
python3 tool/validate-design-system.py --root .
python3 tool/sync-derived-files.py --root .
```

如果 Phase 2 Gate Check 之後 SOT 沒有再改，跳過此步驟。

### 5-2. 記錄架構決策

如果本次做了重要決策（如偏離 base-4 grid、對齊業界標準、新增鎖定規則），寫入 `ref/component-governance.md` 的 Architecture Decisions Log。

### 5-3. 變動清單

列出本次所有變動的檔案：
- `design-system-all.json`（SOT）
- `guideline/{component}.md`（規範）
- `script/{name}.js`（Scripter 腳本，如有）
- `ref/component-governance.md`（如有架構決策）
- 自動同步的衍生檔

### 5-4. Git Commit

```bash
git add [具體檔案]
git commit -m "feat(token): [描述]"
```

### 5-5. Push

由 Kay 在本機執行 `git push`（Cowork 環境無 git 認證）。

---

## 快速檢查清單

```
Phase 1 需求
  □ 元件分類確認（governance）
  □ 業界標準比對（MD3 / Ant Design）
  □ RWD 決策
  □ 影響範圍分析（修改既有 token 時）

Phase 2 Token
  □ SOT 三層 token 定義（ref → sys → comp）
  □ 多品牌 Mode 檢查（Ruten / Ichiban / Resell）
  □ $description 完整（What / Use for / Do NOT）
  □ validate 0 FAIL + sync 衍生檔 ← 唯一 Gate Check

Phase 3 Guideline
  □ Guideline 撰寫完成（先於 Figma 建置）
  □ 🔴 Kay 確認 Guideline（等確認才進 Phase 4）

Phase 4 Figma
  □ 建在正確 Page（⭢{ComponentName}）
  □ 兩階段：plain color → combine → 綁 Variable
  □ Figma Variable 建立 / 更新
  □ Figma Component 建置
  □ Typography 4 項全綁定
  □ 色彩用 setBoundVariableForPaint
  □ Icon 用真實 Instance
  □ Figma 結構驗證
  □ 🔴 Kay 確認 Figma（等確認才進 Phase 5）

Phase 5 收尾
  □ 條件驗證（Phase 3-4 有改 SOT 才重跑）
  □ 架構決策記錄（如有重要決策）
  □ 變動清單
  □ Git commit
  □ Kay push
```

---

## 版本紀錄

| 版本 | 日期 | 變更 |
|------|------|------|
| v1.0.0 | 2026-03-30 | 初始版本。基於 Sprint 3-5 建置經驗整理。 |
| v1.1.0 | 2026-03-30 | 去除重複驗證（Phase 5 改為條件觸發）。新增：影響範圍分析、多品牌 Mode 檢查、Figma Page 規則、兩階段建置、架構決策記錄。 |
| v1.2.0 | 2026-03-30 | 新增 2 個人工確認點：Phase 3 完成後 Kay 確認 Guideline、Phase 4 完成後 Kay 確認 Figma。 |

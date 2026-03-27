---
name: ruten-design-system
description: |
  露天市集（Ruten）多品牌 AI-integrated 設計系統。觸發情境：design token 架構、
  Figma Variables、component 分類治理、token 命名規則、多品牌色彩切換、
  comp 層 component token、RWD size variant、usage guideline 撰寫、
  Figma Component 建置、Scripter 腳本、工程輸出（Vue/React Native/Storybook）、
  controlHeight 體系、Slot Override 規則。任何提到露天、Ruten、Ichiban、Resell、
  design system、design token、Figma Variable 的問題都應觸發此 skill。
---

# Ruten Design System — Skill Reference

> 651 tokens (ref 159 + sys 168 + comp 324) + 130 Text Styles (130 styles)
> 唯一 SOT：`design-system-all.json`
> See `design-system-all.json` for current token counts.

---

## §1 總覽

**目標**：Figma Variables → JSON → AI Agent → Vue / React Native → Storybook

| 品牌 | 主色 | HEX | sys/color/primary 指向 |
|------|------|-----|----------------------|
| 露天市集 Ruten | 橘 | #FF963B | ref/color/orange/500 |
| 一抽入魂 Ichiban | 藍 | #3B82F6 | ref/color/blue/500 |
| 預購市場 Resell | 藍 | #3B82F6 | ref/color/blue/500 |

單一 Figma Variable Collection `ruten`，用 `/` 分三層群組。
Typography 在 Figma 用 Text Styles（130 個），在 JSON 保留為 semantic token 供 AI/工程讀取。

---

## §2 Component 生命週期（15 步）

### 角色定義

| 角色 | 負責範圍 |
|------|---------|
| **Cowork（Sonnet）** | 設計決策、JSON 寫入、validate、sync、guideline 撰寫、Scripter 腳本產出、研究調查、Figma MCP 操作、治理規則衝突判斷、新元件 spec 定義 |
| **Kay** | Figma 操作（匯入 Variable、跑 Scripter、設計驗證、最終決策）、git push |
| **Claude Code** | 工程輸出（Vue/RN component）、AI debug、lint/test、git commit |

> **備註**：設計決策與執行統一在 Cowork 進行，不再分 Chat/Cowork。

### 完整流程

| # | 步驟 | 負責人 | 產出 | 回溯條件 |
|---|------|--------|------|---------|
| 1 | 需求確認 | Kay + Cowork | 元件用途、出現位置、品牌差異 | — |
| 2 | 分類決策 | Cowork | 功能類別 × 組合深度 × 擁有權 | — |
| **3** | **Decision Declaration** | **Cowork** | **宣告清單（見下方格式）→ Kay 確認後才進入 Token 定義** | **宣告不完整 → 補齊再繼續** |
| 4 | Token 定義 | Cowork | 完整 token 表格（path, $value, $description） | ← 步驟 8/10/13 發現問題都回這裡 |
| 5 | JSON 寫入 | Cowork | design-system-all.json 更新 | — |
| 6 | 驗證 | Cowork | `python3 validate-design-system.py --root .` PASS | FAIL → 修 JSON 重跑 |
| 7 | 衍生檔同步 | Cowork | `python3 sync-derived-files.py --root .` | — |
| 8 | Usage Guideline | Cowork | `{component}-usage-guideline.md` | 發現 token 缺漏 → 回步驟 4 |
| 9 | Figma Variable 匯入 | Kay | Thierry overlay import（不刪 Collection） | import error → 檢查 JSON 格式 |
| 10 | Figma Component 建置 | Kay + Cowork | Scripter 腳本 → Kay 在 Figma 執行 | 視覺不對 → 回步驟 4 |
| 11 | Variable Binding | Kay | comp/ token 綁到 Figma Component 屬性 | — |
| 12 | 視覺驗證 | Kay | 截圖比對設計稿 | — |
| 13 | 完整交付驗證 | Cowork | §7a 12 項清單全 PASS | 任一 FAIL → 回步驟 4 |
| 14 | Governance 登錄 | Cowork | component-governance.md Registry 更新 | — |
| 15 | 多品牌驗證 | — | Ichiban/Resell mode 切換確認 | **Phase 3 保留通道，目前不執行** |

**三條回溯路線**都回步驟 4（Token 定義）：guideline 發現缺漏、Figma Component 視覺不對、交付驗證 FAIL。

### §2a Decision Declaration 格式

步驟 3 中，Cowork 必須在開始 Token 定義前，產出以下宣告清單，由 Kay 確認後才往下走：

```markdown
## Decision Declaration: {Component Name}

### 1. 分類結果
- 功能類別：{Action | Display | Navigation | Feedback | Layout | Media | Input | Overlay}
- 組合深度：{Primitive | Compound | Pattern}
- Token 擁有權：{Owned | Slot Override | Inherited}

### 2. 觸碰的鎖定決策
逐條列出本次 component 會碰到哪些鎖定決策（見 §3 鎖定決策），
若不涉及任何鎖定決策，明確寫「無」。
- [ ] label-2xs = 8px?
- [ ] body-md-alt = 13px?
- [ ] 價格顏色 = sys/color/price?
- [ ] icon-color vs text-color 分離?
- [ ] base-4 以下 hardcode?
- [ ] overlay import only?

### 3. controlHeight 級別
列出此 component 會用到的 controlHeight 級別（xs/sm/md/default/lg/xl/2xl/3xl/4xl），
若不涉及 controlHeight（如 Layout/Pattern 類），明確寫「N/A」。

### 4. 已存在的引用關係
列出此 component 會引用的 comp → comp 或 comp → sys 關係，
特別標註任何新增的跨 component 引用（如 product-card → comp/tag/base）。

### 5. 相似元件衝突檢查
列出系統中已存在的相似 component，說明本次新增與它們的邊界。
若無相似元件，寫「無衝突」。
```

**為什麼加這一步**：過去鎖定決策或 controlHeight 的遺漏，要到步驟 13 交付驗證才被發現，回溯成本高。Decision Declaration 在步驟 3 就強制攤開，讓問題在最早的時間點被攔截。

---

## §3 Token 架構

### 三層結構

```
ref (159) → 原子值，不直接使用
  ↓ alias
sys (166) → 語意化，設計師可選
  ↓ alias
comp (311) → 元件綁定，AI/設計師主要操作層
```

**Alias 方向固定**：comp → sys → ref，不跳層。comp → comp 引用合法（如 product-card/tag-brand → comp/tag/base）。

### 元件分類（三維體系）

- **功能類別**：Action | Display | Navigation | Feedback | Layout | Media | Input | Overlay
- **組合深度**：Primitive（完整 comp/ token）| Compound（佈局 token + Slot Override）| Pattern（sys/ token only）
- **Token 擁有權**：Owned | Slot Override | Inherited

詳細規則、決策流程、Registry 見 `component-governance.md`。

### controlHeight 體系（9 級）

xs(16) → sm(20) → md(28) → default(32) → lg(36) → xl(40) → 2xl(44) → 3xl(48) → 4xl(52)

所有互動控件 min-height alias 到 `sys/sizing/control-height/*`。
工程端 padding 公式：`paddingBlock = (controlHeight - fontHeight) / 2 - borderWidth`

### 鎖定決策（不可更改）

- `label-2xs` = 8px（不是 9px）
- `body-md-alt` = 13px（legacy）
- 價格顏色 = `sys/color/price`（紅色，非品牌橘）
- icon-color 和 text-color 分開（語義不同）
- base-4 以下 hardcode 值（如 2px gap）OK + 需註解
- 刪除 Variable Collection 再匯入會斷綁定 → 永遠用 overlay import
- Mono 已從 SOT 和 Text Styles 移除

---

## §4 工具與檔案

### Figma 快查

| 項目 | File Key / Node ID |
|------|-------------------|
| Design-System-Foundation | `Z0iwXvZHVy6BDsSMORHxxl` |
| DS測試 | `JntRm8aTeyw1HPdowgSBk4` |
| 分類館首頁 page | `7:6097` |
| 分類館首頁 Main Component | `7:6101` |
| Icons page（DS測試） | `45:19481` |
| Tag section | `74:184325` |
| 分類選單 icon 來源 | `81:2872764` |
| Product Card | `13:13857` |

### 工具清單

| 工具 | 用途 |
|------|------|
| Figma MCP | get_design_context, get_screenshot, get_variable_defs, generate_diagram |
| Scripter（Figma Plugin） | 在 Figma 內跑 JS 腳本建 Component / 批次操作 |
| Thierry（Figma Plugin） | Variable overlay import（JSON → Figma Variables） |
| `validate-design-system.py` | 每次改 JSON 後必跑，檢查 alias 完整性 + 衍生檔數字一致 |
| `sync-derived-files.py` | 自動更新所有衍生檔中的 token 數字 |
| `create-text-styles.js` | Scripter 腳本，產生 130 Text Styles（CH 65 + EN 65） |

### 檔案職責表

| 檔案 | 職責 |
|------|------|
| `design-system-all.json` | **唯一 SOT** — 所有 token 原始資料，任何修改先改這裡 |
| `CLAUDE.md` | Claude Code 進入點（工程輸出規則 + 每日流程） |
| `COWORK_INSTRUCTIONS.md` | Cowork Claude 進入點（工作迴圈 + 品質閘門） |
| `SKILL.md` | 本檔案 — Skill 觸發 + 架構速查 |
| `component-governance.md` | 三維分類體系 + Primitive/Compound/Pattern Registry + controlHeight + Slot Override + 鎖定決策 + 架構決策記錄 |
| `EXECUTION_PLAN.md` | 19 元件清單 + Sprint 順序 + Phase 2-4 路線圖 + 技術債 |
| `DAILY_LOG.md` | 每日站會記錄（每天第一件事：讀最新一天的「明日工作順序」） |
| `validate-design-system.py` | 驗證腳本（alias、數字一致、legacy 殘留） |
| `sync-derived-files.py` | 衍生檔 token 數字自動同步 |
| `create-text-styles.js` | Figma Scripter 腳本（130 Text Styles） |
| `token-migration-map.md` | 舊 → 新 token 遷移對照表 |
| `design-system-viewer-live.html` | 即時 viewer（fetch JSON，瀏覽器開） |
| `ui-library-preview.html` | Component UI 預覽（Button/Tab/Avatar/Thumbnail 靜態 HTML） |
| `button-usage-guideline.md` | Button 使用規則（4 role × 5 size × state × form × iconPosition × Wrapper） |
| `tab-usage-guideline.md` | Tab 使用規則（4 size × 3 state × 2 layout × 2 emphasis + 高度公式） |
| `avatar-usage-guideline.md` | Avatar 使用規則（人/商家 only） |
| `thumbnail-usage-guideline.md` | Thumbnail 使用規則（IP/主題/分類，Shopify Polaris 模式） |
| `tag-badge-usage-guideline.md` | Tag/Badge 使用規則 |
| `scripter-01-tab.js` | Figma Scripter — Tab Component（12 variants + Tab Bar 2 variants） |
| `scripter-02-button.js` | Figma Scripter — Button Component（32 variants） |
| `scripter-03-avatar.js` | Figma Scripter — Avatar Component（12 variants） |
| `design-system-governance.md` | 治理摘要（數字同步用） |
| `design-system-progress.md` | 進度摘要（數字同步用） |
| `RUTEN_TODO.md` | 待辦事項追蹤 |

### Connectors

- ✅ Figma（MCP 操作）
- ✅ Notion（文件發布，按需推送）
- ✅ Google Drive（檔案同步）

---

## §5 進度追蹤

### Phase 總覽

| Phase | 狀態 | 說明 |
|-------|------|------|
| 4a Icon System | ✅ 完成 | 23 icon detach + outline + color binding |
| 1 Figma UI Kit | 🔄 進行中 | 636 tokens, 15 元件 token 完成, Sprint 2 進行中 |
| 2 Engineering Output | ⏳ 待做 | Vue/RN component + Storybook |
| 3 Multi-brand | ⏳ 待做 | Ichiban/Resell mode + Dark mode |

### Component 進度（19 元件 + Thumbnail）

| # | Component | 類別 | 深度 | Tokens | 生命週期步驟 | 狀態 |
|---|-----------|------|------|--------|------------|------|
| 1 | ProductCard | Display | Compound | 51 | 步驟 11 Binding | ✅ Token + Binding 大致完成 |
| 2 | Button | Action | Primitive | 60 | 步驟 12 視覺驗證 | ✅ Figma Component 48 variants (4 role × 4 size × 3 form) |
| 3 | Tab | Navigation | Primitive | 33 | 步驟 12 視覺驗證 | ✅ Figma Component 24 variants (2 emphasis × 4 size × 3 state) |
| 4-6 | Tag (Filter/Display/Promo) | Feedback | Primitive | 74 | 步驟 13 交付驗證 | ✅ 清理完成，無舊路徑殘留 |
| 7 | Icon | Media | Primitive | 8 | 步驟 13 交付驗證 | ✅ 476 icons, vector fill bound to Variable |
| 8 | Badge | Feedback | Primitive | 11 | 步驟 5 JSON 完成 | ✅ Token 完成，待建 Figma Component |
| 9 | SectionHeader | Layout | Compound | 14 | 步驟 5 JSON 完成 | ✅ Token 完成 |
| 10 | NavigationBar | Navigation | Compound | 6 | 步驟 5 JSON 完成 | ✅ Token 完成 |
| 11 | SearchBar | Navigation | Primitive | 11 | 步驟 5 JSON 完成 | ✅ Token 完成 |
| 12 | BottomNav | Navigation | Compound | 12 | 步驟 5 JSON 完成 | ✅ Token 完成 |
| 13 | CategoryGrid | Layout | Pattern | 0 | 步驟 8 Guideline | 🔲 用 sys/ token |
| 14 | HorizontalScroll | Layout | Pattern | 0 | 步驟 8 Guideline | 🔲 用 sys/ token |
| 15 | SectionModule | Display | Compound | 7 | 步驟 5 JSON 完成 | ✅ Token 完成 |
| 16 | QuickInfoBar | Layout | Pattern | 0 | 步驟 1 需求確認 | 🔲 用 sys/ token |
| 17 | Divider | Layout | Primitive | 5 | 步驟 5 JSON 完成 | ✅ Token 完成 |
| 18 | Banner | Display | Compound | 4 | 步驟 5 JSON 完成 | ✅ Token 完成 |
| 19 | Avatar | Media | Primitive | 11 | 步驟 12 視覺驗證 | ✅ Figma Component 12 variants |
| 20 | Thumbnail | Media | Primitive | 11 | 步驟 12 視覺驗證 | ✅ Figma Component 12 variants |

### Sprint 進度

- **Sprint 0**：✅ 技術債清理
- **Sprint 1**：✅ Icon 收尾 + Tag 清理
- **Sprint 2**：🔄 Button 48v ✅ / Tab 24v ✅ / Avatar 12v ✅ / Thumbnail 12v ✅
- **Sprint 3**：⏳ SectionHeader + NavigationBar + SearchBar + BottomNav
- **Sprint 4**：⏳ Badge + CategoryGrid + HorizontalScroll + SectionModule
- **Sprint 5**：⏳ QuickInfoBar + Divider + Banner
- **Sprint 6**：⏳ Variable Binding 審核 + Library 發布

詳細 Sprint 內容、Phase 2-4 路線圖、技術債見 `EXECUTION_PLAN.md`。

---

## §6 檔案讀取策略

**唯一資訊來源：repo**。不使用 Project Knowledge。

Cowork 每次 session 啟動時，透過 skill 觸發載入本檔案（SKILL.md），
其餘檔案一律從 repo 即時讀取，確保永遠是最新版本。

> **為什麼不用 PK**：所有工作統一在 Cowork 進行，Cowork 可直接讀 repo，
> PK 只會製造過期快照和手動同步負擔。

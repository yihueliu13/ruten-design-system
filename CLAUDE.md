# Ruten Design System — CLAUDE.md

## What this is
Multi-brand design system for Ruten e-commerce (露天市集 / 一抽入魂 / 預購市場).
Single source of truth: `design-system-all.json` (636 tokens + 130 Text Styles).

## Architecture
Single Figma Collection, three tiers: `ref(159) → sys(166) → comp(311)`.
Alias direction: comp → sys → ref. Never skip tiers. comp → comp is allowed.
Typography: Text Styles in Figma, tokens in JSON for AI/engineering.

## Locked decisions (do not change)
- label-2xs = 8px (not 9px)
- body-md-alt = 13px (legacy)
- Price color = sys/color/price (RED, not brand orange)
- icon-color and text-color are separate tokens
- Never delete Figma Variable Collection and re-import (breaks bindings)
- Mono removed from SOT and Text Styles

## Workflow for every task
```
1. PLAN    — state what you'll do, which files change
2. DO      — edit design-system-all.json
3. CHECK   — python3 validate-design-system.py --root .
4. SYNC    — python3 sync-derived-files.py --root .
5. REPORT  — list changed files, unchanged files, validation result
```

## Rules
- Every new token MUST have $description (imperative style)
- Description template: "[What]. Use for [contexts]. Do NOT use for [anti-patterns]."
- comp layer: never hardcode color or value, always alias to sys
- Hardcoded values below base-4 (e.g. 2px gap) are OK with descriptive comment
- Token naming: comp/{component}/{variant}/{property}
- RWD via size variants: sm(375) / md(768) / lg(992) / xl(1200)

## Component classification
- 功能類別：Action | Display | Navigation | Feedback | Layout | Media
- 組合深度：Primitive（完整 comp/ token）| Compound（佈局 token + Slot Override）| Pattern（sys/ token only）
- RWD：Primitive/Compound = size variant、Pattern = CSS layout、Page = breakpoint frame

## Key files
- `design-system-all.json` — SOT, edit this first
- `validate-design-system.py` — run after every JSON change
- `sync-derived-files.py` — auto-update token counts in derived files
- `SKILL.md` — token architecture rules (skill trigger)
- `component-governance.md` — component classification, locked decisions, architecture decisions log
- `EXECUTION_PLAN.md` — 19 component list, sprint order, Phase 2-4 roadmap, tech debt
- `DAILY_LOG.md` — daily standup log (read this FIRST every session)
- `create-text-styles.js` — Figma Scripter script (130 Text Styles)

## Brands
| Brand | Primary | HEX |
|-------|---------|-----|
| Ruten | Orange | #FF963B |
| Ichiban | Blue | #3B82F6 |
| Resell | Blue | #3B82F6 |

---

## 每日啟動流程

每天第一次對話時，自動執行：
1. 讀 `DAILY_LOG.md` 最新一天的「明日工作順序」
2. 照那個順序開始工作，不要自己重排
3. 如果 DAILY_LOG 沒有明日順序，問 Kay 再開始

---

## 每日收工流程

當 Kay 說「收工」「寫日報」「結束」時，自動執行以下步驟：

### Step 1: 盤點今日完成度
讀 `DAILY_LOG.md` 當天的「今日工作順序」，逐項比對：
- 實際完成的 → `[x]`
- 未完成的 → `[ ]` + 附上原因（時間不夠 / blocked / 改排到其他項目）

### Step 2: 記錄 token 變化
```
Token 變化：{起始數} → {結束數}（+{新增數}）
Validation：{PASS} PASS / {FAIL} FAIL
最後修改檔案：{列出今天動過的檔案}
```

### Step 3: 產出明日工作建議
根據以下來源排出建議順序：
1. 今天未完成的項目（最高優先）
2. `EXECUTION_PLAN.md` 的下一個 Sprint 項目
3. 技術債或 blocked 解除的項目

格式：
```markdown
### 明日工作順序（建議，等 Kay 確認）
1. {item}
2. {item}
3. {item}

### 如果有空才做
- {item}
```

### Step 4: 寫入 DAILY_LOG.md
在檔案頂部（`---` 之後）插入新的一天區塊，格式見下方模板。

### Step 5: Git commit
```bash
git add DAILY_LOG.md
git commit -m "log: YYYY-MM-DD daily standup"
```

### DAILY_LOG 每日區塊模板
```markdown
## YYYY-MM-DD（星期）

### 1. 今日完成
- [x] 完成項目 — 細節
- [ ] 未完成項目 — 原因

### 2. Token 狀態
- 起始：{N} tokens (ref {R} + sys {S} + comp {C})
- 結束：{N} tokens (ref {R} + sys {S} + comp {C})
- Validation：{N} PASS / {N} FAIL

### 3. 明日工作順序（建議，等 Kay 確認）
1. {item}
2. {item}
3. {item}

### 如果有空才做
- {item}

### 4. Blocked 項目
| 項目 | Blocked 原因 |
|------|-------------|
| ... | ... |
```

---

## 重要提醒
- 永遠不要建議「收工」或結束工作，除非 Kay 主動說
- 讀 DAILY_LOG 的「明日工作順序」時，如果 Kay 已確認過就直接照做，不要重排
- 每天的工作順序由 Kay 最終決定，Claude 只提供建議

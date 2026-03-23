# Ruten Design System — CLAUDE.md

## What this is
Multi-brand design system for Ruten e-commerce (露天市集 / 一抽入魂 / 預購市場).
Single source of truth: `design-system-all.json` (642 tokens + 130 Text Styles).

## Architecture
Single Figma Collection, three tiers: `ref(159) → sys(168) → comp(315)`.
Alias direction: comp → sys → ref. Never skip tiers. comp → comp is allowed.
Typography: Text Styles in Figma, tokens in JSON for AI/engineering.

## Locked decisions (do not change)
- label-2xs = 8px (not 9px)
- body-md-alt = 13px (legacy)
- Price color = sys/color/price (RED, not brand orange)
- icon-color and text-color are separate tokens
- Button icon-color aliases text-color (comp→comp, Ant Design currentColor pattern)
- Icon vector fill bound to comp/icon/md/color Variable
- Never delete Figma Variable Collection and re-import (breaks bindings)
- Mono removed from SOT and Text Styles

## Workflow for every task
```
1. PLAN    — state what you'll do, which files change
2. DO      — edit design-system-all.json
3. CHECK   — python3 validate-design-system.py --root .
4. SYNC    — python3 sync-derived-files.py --root .
5. REPORT  — list changed files, unchanged files, validation result
6. PUSH    — git commit + push 完成後，列出本次 commit 包含的所有檔案清單
```

## Rules
- **每次 git commit 前必跑 `python3 validate-design-system.py --root .`**，不管改的是不是 SOT
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
- `DAILY_LOG.md` — daily standup log, 頂部有固定「目前狀態」區塊供 Chat 讀取
- `sync-daily-log.py` — DAILY_LOG 全生命週期管理（--write 啟動 / --close 收工 / dry-run 查看）
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
1. 跑 `python3 sync-daily-log.py --root . --write` 同步 git 歷史到 DAILY_LOG
2. 讀 `DAILY_LOG.md` 最新一天的「明日工作順序」
3. 照那個順序開始工作，不要自己重排
4. 如果 DAILY_LOG 沒有明日順序，問 Kay 再開始

> **為什麼要先跑 sync？** Chat 和 Cowork 是不同 session，各自做的 git commits
> 不會自動反映在 DAILY_LOG 裡。sync 腳本會讀 git log，比對 DAILY_LOG 中
> 已記錄的 commit hash，把遺漏的補寫進去，避免重複執行或遺漏。

---

## 每日收工流程

當 Kay 說「收工」「寫日報」「結束」時，執行：

```bash
python3 sync-daily-log.py --root . --close --commit
```

腳本自動完成：
1. **盤點今日完成** — 從 git log 擷取今天所有 commits，對比原定計畫
2. **Token 狀態** — 讀 JSON 計數 + 跑 validation
3. **變動檔案** — 列出今天改過的所有檔案
4. **明日建議** — 從原定計畫未完成項 + EXECUTION_PLAN 下一個 Sprint 自動排序
5. **Blocked** — 預留欄位，Claude 或 Kay 手動補充
6. **寫入 + commit** — 自動寫入 DAILY_LOG.md 頂部 + git commit

> **Claude 的額外職責：** 腳本跑完後，Claude 應該：
> - 檢查 Blocked 欄位，補上已知的 blocked 原因
> - 確認明日建議是否合理，必要時手動調整
> - 如果有 validation FAIL，說明原因

---

## 重要提醒
- 永遠不要建議「收工」或結束工作，除非 Kay 主動說
- 讀 DAILY_LOG 的「明日工作順序」時，如果 Kay 已確認過就直接照做，不要重排
- 每天的工作順序由 Kay 最終決定，Claude 只提供建議

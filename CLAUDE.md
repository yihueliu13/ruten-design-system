# Ruten Design System — CLAUDE.md

## What this is
Multi-brand design system for Ruten e-commerce (露天市集 / 一抽入魂 / 預購市場).
Single source of truth: `design-system-all.json` (513 tokens + 130 Text Styles).

## Architecture
Single Figma Collection, three tiers: `ref(155) → sys(150) → comp(208)`.
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
4. SYNC    — update derived files (SKILL.md, governance.md, progress.md numbers)
5. REPORT  — list changed files, unchanged files, validation result
```

## Rules
- Every new token MUST have $description (imperative style)
- Description template: "[What]. Use for [contexts]. Do NOT use for [anti-patterns]."
- comp layer: never hardcode color or value, always alias to sys
- Hardcoded values below base-4 (e.g. 2px gap) are OK with descriptive comment
- Token naming: comp/{component}/{variant}/{property}
- RWD via size variants: sm(375) / md(768) / lg(992) / xl(1200)

## Component types
- Type A Standard: fully tokenized (Button, Tab, Tag, Card)
- Type B Composite: partial token + hardcode (免運角標, 露天心選 badge)
- Type C Assets: token manages size only, SVG by Figma (Icons, Logos)

## Key files
- `design-system-all.json` — SOT, edit this first
- `validate-design-system.py` — run after every JSON change
- `SKILL.md` — token architecture rules (update numbers after changes)
- `design-system-governance.md` — locked decisions
- `design-system-progress.md` — decision log
- `create-text-styles.js` — Figma Scripter script (130 Text Styles)

## Brands
| Brand | Primary | HEX |
|-------|---------|-----|
| Ruten | Orange | #FF963B |
| Ichiban | Blue | #3B82F6 |
| Resell | Blue | #3B82F6 |

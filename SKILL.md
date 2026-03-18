---
name: ruten-design-system
description: |
  Build and maintain the Ruten (露天市集) multi-brand design system using AI-assisted workflows.
  This skill covers the full pipeline: Figma Variables export → AI token transformation →
  Figma import → Figma binding → Text Styles → Storybook component integration. Use this skill
  when working on design tokens, Figma Variables, design system architecture, token naming
  conventions, multi-brand theming (Ruten/Ichiban/Resell), comp layer component tokens,
  RWD size variants, or AI-readable token structures.
---

# Ruten Multi-Brand Design System Skill

## Overview
AI-readable, multi-brand design system for Ruten e-commerce (露天市集, 一抽入魂, 預購市場).

**Total:** 529 tokens + 130 Text Styles

**Workflow:**
```
Figma export → AI transform/validate → JSON → Import to Figma → Bind Variables → Apply Text Styles
```

## Architecture: Single Collection, Three Tiers

| Decision | Choice | Rationale |
|----------|--------|-----------|
| Structure | Single Collection | Alias inheritance works natively |
| Tier separation | Groups via `/` naming | `ref/...`, `sys/...`, `comp/...` |
| Alias direction | `comp → sys → ref` | Never skip tiers |
| RWD strategy | Size variants (sm/md/lg/xl) | Works on Professional plan (1 mode) |
| Typography in Figma | Text Styles | One-click apply, not one-by-one Variable binding |
| Typography in JSON | Keep as semantic/component-readable tokens | AI and engineers read from JSON |

## ref Layer — 155 tokens ✅
Raw atomic values. Never used directly.
- color(45), spacing(13), sizing(11), radius(9), typography(36), elevation(6), opacity(8), border(9), breakpoint(5), z-index(8), duration(4)
- Font-size: 8px (label-2xs) → 64px (display-3xl)
- Breakpoint: sm(375) · md(768) · lg(992) · xl(1200) · 2xl(1440)

## sys Layer — 153 tokens ✅
Semantic aliases to ref. Includes sys/color/price (red, for promotional prices).
- color(42), spacing(10), sizing(11), radius(6), typography(38), elevation(6), opacity(8), border(8), grid(8), z-index(8), duration(4)

## comp Layer — 221 tokens ✅
- **icon (8):** xs/sm/md/lg × size + color. Other comps reference comp/icon instead of sys/sizing directly.
- **product-card (51):** container, image, badge, title, price(red), meta(8px), tag-shipping(blue), tag-brand(red+icon), promo-corner(免運角標)
- **button (49):** sm/md/lg/xl × primary/secondary/ghost × states
- **tab (28):** sm/md/lg/xl × active/inactive/hover
- **tag (61):** filter/display/action × sm/md/lg/xl + promo-corner

## Text Styles — 130 styles ✅
CH/PingFang TC (65) + EN/SF Pro (65)
Built with Scripter plugin script: create-text-styles.js

## Figma Binding Rules
- ✅ Colors, radius, padding/gap, width/height → bind as Variables
- ✅ Typography → apply as Text Styles (not Variables)
- 設計師選 comp/ 或 sys/，**永遠不選 ref/**

## Key Decisions
- label-2xs = 8px (not 9px, matches 銷售999+ actual design)
- Price color = RED sys/color/price (not brand orange)
- 13px body-md-alt = legacy compatibility token
- promo-corner border-radius: asymmetric (TL+BR only), set in component not token
- Don't delete collection to re-import: bindings break
- Mono removed from source-of-truth and text styles baseline

## File Inventory
| File | Tokens/Styles |
|------|---------------|
| design-system-all.json | 529 tokens (ref 155 + sys 153 + comp 221) |
| design-system-viewer.html | Snapshot viewer aligned to current baseline |
| token-migration-map.md | Old→new token mapping |
| create-text-styles.js | Scripter script aligned to 130 Text Styles |
| SKILL.md | This file |
| design-system-progress.md | Decision log |
| design-system-governance.md | Governance and update rules |

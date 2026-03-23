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

See `design-system-all.json` for current token counts.

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

## Token Tiers

- **ref** — Raw atomic values. Never used directly. color, spacing, sizing, radius, typography, elevation, opacity, border, breakpoint, z-index, duration.
- **sys** — Semantic aliases to ref. Includes sys/color/price (red, for promotional prices). color, spacing, sizing, radius, typography, elevation, opacity, border, grid, z-index, duration.
- **comp** — Component-bound tokens. icon, product-card, button, tab, tag, badge, avatar, thumbnail, divider, search-bar, nav-bar, bottom-nav, section-header, section-module, banner.

## Component Governance

Full rules: `component-governance.md`. Summary for AI:

**Classification: [Category] × [Depth] × [Ownership]**
- Category: Action | Input | Display | Navigation | Feedback | Overlay | Layout | Media
- Depth: Primitive | Compound | Pattern
- Ownership: Owned | Slot Override | Inherited

**Token rules by depth:**
- Primitive: full comp/ token set, alias to sys only, no comp→comp reference
- Compound: comp/ tokens for all non-independent child element properties (ref MD3). Slot Override allowed when child needs context-specific visuals.
- Pattern: no comp/ tokens. Use sys/ tokens + CSS layout.

**Slot Override convention:**
- Path: `comp/{compound}/{slot}/{property}`
- $description MUST start with `"Slot override."`
- MUST alias to sys layer (not to child primitive's comp/ token)

**RWD by depth:**
- Primitive/Compound: Figma Variant `size = sm/md/lg/xl`, comp/ tokens per size
- Pattern: CSS grid/flex, sys/ tokens for gap/columns
- Page: breakpoint frames 375/768

**New component decision flow:**
1. Existing component covers it? → Variant (same structure) or new comp (different structure)
2. Assign category → Action/Input/Display/Navigation/Feedback/Overlay/Layout/Media
3. Contains other DS components? → No: Primitive | Yes + reusable: Compound | Yes + section-only: Pattern
4. Define tokens per depth rule
5. Define RWD per depth rule

## Text Styles — 130 styles
CH/PingFang TC (65) + EN/SF Pro (65). Mono removed.
Built with Scripter plugin script: create-text-styles.js

## Figma Binding Rules
- Colors, radius, padding/gap, width/height → bind as Variables
- Typography → apply as Text Styles (not Variables)
- 設計師選 comp/ 或 sys/，永遠不選 ref/

## Key Decisions
- label-2xs = 8px (not 9px, matches 銷售999+ actual design)
- Price color = RED sys/color/price (not brand orange)
- 13px body-md-alt = legacy compatibility token
- promo-corner border-radius: asymmetric (TL+BR only), set in component not token
- Don't delete collection to re-import: bindings break
- Mono removed from source-of-truth and text styles baseline

## File Inventory
| File | Purpose |
|------|---------|
| design-system-all.json | SOT — all tokens |
| component-governance.md | Component classification, token rules, RWD governance, locked decisions, architecture decisions log |
| EXECUTION_PLAN.md | 19 component list, sprint order, Phase 2-4 roadmap, tech debt |
| validate-design-system.py | Validation script |
| sync-derived-files.py | Auto-update token counts in derived files |
| create-text-styles.js | Scripter script for 130 Text Styles |
| design-system-viewer-live.html | Live viewer (fetches JSON) |
| design-system-viewer.html | Snapshot viewer |
| token-migration-map.md | Old→new token mapping |
| SKILL.md | This file |

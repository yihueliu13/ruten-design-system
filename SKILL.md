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

**Total:** 636 tokens + 130 Text Styles

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

## ref Layer — 159 tokens ✅
Raw atomic values. Never used directly.
- color(45), spacing(13), sizing(11), radius(9), typography(36), elevation(6), opacity(8), border(9), breakpoint(5), z-index(8), duration(4)
- Font-size: 8px (label-2xs) → 64px (display-3xl)
- Breakpoint: sm(375) · md(768) · lg(992) · xl(1200) · 2xl(1440)

## sys Layer — 166 tokens ✅
Semantic aliases to ref. Includes sys/color/price (red, for promotional prices).
- color(42), spacing(10), sizing(11), radius(6), typography(38), elevation(6), opacity(8), border(8), grid(8), z-index(8), duration(4)

## comp Layer — 311 tokens ✅
- **icon (8):** xs/sm/md/lg × size + color. Other comps reference comp/icon instead of sys/sizing directly.
- **product-card (51):** container, image, badge, title, price(red), meta(8px), tag-shipping(blue), tag-brand(red+icon), promo-corner(免運角標)
- **button (60):** sm/md/lg/xl × primary/secondary/ghost × states
- **tab (33):** sm/md/lg/xl × active/inactive/hover + secondary emphasis
- **tag (74):** filter/display/action × sm/md/lg/xl + promo-corner
- **other components (74):** badge, avatar, divider, search-bar, nav-bar, bottom-nav, section-header, section-module, banner

## Component Governance (v1.0.0)

Full rules: `component-governance.md`. Summary for AI:

**Classification: [Category] × [Depth] × [Ownership]**
- Category: Action | Display | Navigation | Feedback | Layout | Media
- Depth: Primitive | Compound | Pattern
- Ownership: Owned | Slot Override | Inherited

**Token rules by depth:**
- Primitive: full comp/ token set, alias to sys only, no comp→comp reference
- Compound: comp/ tokens for layout only (padding, gap, bg, radius). Child styles controlled by child's comp/ tokens. Slot Override allowed when child needs context-specific visuals.
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
2. Assign category → Action/Display/Navigation/Feedback/Layout/Media
3. Contains other DS components? → No: Primitive | Yes + reusable: Compound | Yes + section-only: Pattern
4. Define tokens per depth rule
5. Define RWD per depth rule

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
| design-system-all.json | 636 tokens (ref 159 + sys 166 + comp 311) |
| design-system-viewer.html | Snapshot viewer aligned to current baseline |
| token-migration-map.md | Old→new token mapping |
| create-text-styles.js | Scripter script aligned to 130 Text Styles |
| SKILL.md | This file |
| design-system-progress.md | Decision log |
| design-system-governance.md | Governance and update rules |
| component-governance.md | Component classification, token rules, RWD governance |

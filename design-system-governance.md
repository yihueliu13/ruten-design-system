# Design System Governance

> Baseline: **v1.0.0**  
> Status: **sealed-baseline**  
> Date: **2026-03-07**

## Source of Truth

**唯一真實來源：** `design-system-all.json`

所有擴充、修正、命名調整、token alias、component mapping，**一律先改 `design-system-all.json`**。  
其他檔案都屬於衍生檔，不能先自行定義規則。

## Current Baseline

- ref: 155
- sys: 153
- comp: 221
- total: 529
- total: 130

## Text Styles

- CH / PingFang TC: 65
- EN / SF Pro: 65
- Mono: removed

## Locked Decisions

- `label-2xs` = 8px
- `body-md-alt` = 13px（legacy compatibility）
- `price color` = `sys/color/price`
- `design-system-all.json` = source of truth
- Text Styles baseline = 130
- Mono is removed from both source-of-truth and text-style script

## Update Flow

1. Modify `design-system-all.json`
2. Run `validate-design-system.py --root .`
3. Fix any failing derived files
4. Rebuild snapshot / zip only after validation passes

## Derived Files

- `design-system-progress.md`
- `SKILL.md`
- `token-migration-map.md`
- `design-system-viewer-live.html`
- `design-system-viewer.html`
- `create-text-styles.js`

## Rule

如果衍生檔與 `design-system-all.json` 衝突，**一律以 `design-system-all.json` 為準**。

#!/usr/bin/env python3
"""
sync-derived-files.py — Auto-update token counts in derived files.

Reads design-system-all.json and updates token numbers in:
  - SKILL.md (Total line)
  - component-governance.md (Baseline + Registry numbers)
  - EXECUTION_PLAN.md (top summary + component table)
  - CLAUDE.md (architecture description numbers)

Usage:
  python3 sync-derived-files.py [--root .]
  python3 sync-derived-files.py --dry-run    # show changes without writing
"""
from __future__ import annotations

import argparse
import json
import re
import sys
from pathlib import Path
from typing import Any


def flatten_token_leaves(obj: Any, path: str = "") -> list[tuple[str, dict]]:
    """Recursively find all token leaves (dicts with $value)."""
    leaves: list[tuple[str, dict]] = []
    if isinstance(obj, dict):
        if "$value" in obj:
            leaves.append((path, obj))
        else:
            for k, v in obj.items():
                if k.startswith("$"):
                    continue
                child_path = f"{path}/{k}" if path else k
                leaves.extend(flatten_token_leaves(v, child_path))
    return leaves


def count_tokens(data: dict) -> dict[str, int]:
    """Count tokens per tier and component."""
    counts: dict[str, int] = {"ref": 0, "sys": 0, "comp": 0, "total": 0}
    comp_counts: dict[str, int] = {}

    for tier in ("ref", "sys", "comp"):
        if tier in data:
            leaves = flatten_token_leaves(data[tier])
            counts[tier] = len(leaves)
            if tier == "comp":
                for path, _ in leaves:
                    # path like "button/sm/min-height" → component = "button"
                    component = path.split("/")[0] if "/" in path else path
                    comp_counts[component] = comp_counts.get(component, 0) + 1

    counts["total"] = counts["ref"] + counts["sys"] + counts["comp"]
    return {**counts, "comp_detail": comp_counts}


def update_file(filepath: Path, replacements: list[tuple[str, str]], dry_run: bool = False) -> int:
    """Apply regex replacements to a file. Returns number of changes made."""
    if not filepath.exists():
        print(f"  SKIP {filepath.name} (not found)")
        return 0

    text = filepath.read_text(encoding="utf-8")
    original = text
    changes = 0

    for pattern, replacement in replacements:
        new_text, n = re.subn(pattern, replacement, text)
        if n > 0:
            changes += n
            text = new_text

    if changes > 0:
        if dry_run:
            print(f"  DRY-RUN {filepath.name}: {changes} replacement(s)")
        else:
            filepath.write_text(text, encoding="utf-8")
            print(f"  UPDATED {filepath.name}: {changes} replacement(s)")
    else:
        print(f"  OK {filepath.name}: already up to date")

    return changes


def sync_skill_md(root: Path, ref: int, sys_: int, comp: int, total: int, dry_run: bool) -> int:
    """Update SKILL.md — currently no inline counts, but update if any appear."""
    filepath = root / "SKILL.md"
    replacements = [
        # Match "NNN tokens" patterns in context
        (r"(\b)(\d+)( tokens \(ref )(\d+)( \+ sys )(\d+)( \+ comp )(\d+)(\))",
         rf"\g<1>{total}\g<3>{ref}\g<5>{sys_}\g<7>{comp}\g<9>"),
    ]
    return update_file(filepath, replacements, dry_run)


def sync_component_governance(root: Path, ref: int, sys_: int, comp: int, total: int,
                               comp_detail: dict[str, int], dry_run: bool) -> int:
    """Update component-governance.md — Baseline numbers + Primitive/Compound Registry token counts."""
    filepath = root / "component-governance.md"
    replacements = [
        # §12.2 Baseline — patterns like "ref: 159" "sys: 166" "comp: 311" "total: 636"
        (r"(- ref: )\d+", rf"\g<1>{ref}"),
        (r"(- sys: )\d+", rf"\g<1>{sys_}"),
        (r"(- comp: )\d+", rf"\g<1>{comp}"),
        (r"(- total: )\d+", rf"\g<1>{total}"),
    ]

    # Update Primitive Registry token counts
    for component, count in comp_detail.items():
        # Match table rows like "| Button | Action | 60 |" — update the number
        escaped = re.escape(component.capitalize() if component != "nav-bar" else component)
        replacements.append(
            (rf"(\| {escaped}\b[^|]*\|[^|]*\| )\d+( \|)",
             rf"\g<1>{count}\g<2>")
        )

    return update_file(filepath, replacements, dry_run)


def sync_execution_plan(root: Path, ref: int, sys_: int, comp: int, total: int,
                         comp_detail: dict[str, int], dry_run: bool) -> int:
    """Update EXECUTION_PLAN.md — top summary + component table token counts."""
    filepath = root / "EXECUTION_PLAN.md"
    replacements = [
        # Top summary: "目前：636 tokens (ref 159 + sys 166 + comp 311)"
        (r"(目前：)\d+( tokens \(ref )\d+( \+ sys )\d+( \+ comp )\d+(\))",
         rf"\g<1>{total}\g<2>{ref}\g<3>{sys_}\g<4>{comp}\g<5>"),
    ]

    # Update component table token counts (column: Tokens)
    component_name_map = {
        "product-card": "ProductCard",
        "button": "Button",
        "tab": "Tab",
        "tag": "Tag",
        "icon": "Icon",
        "badge": "Badge",
        "section-header": "SectionHeader",
        "nav-bar": "NavigationBar",
        "search-bar": "SearchBar",
        "bottom-nav": "BottomNav",
        "section-module": "SectionModule",
        "banner": "Banner",
        "avatar": "Avatar",
        "divider": "Divider",
        "thumbnail": "Thumbnail",
    }

    for token_name, display_name in component_name_map.items():
        if token_name in comp_detail:
            count = comp_detail[token_name]
            escaped = re.escape(display_name)
            replacements.append(
                (rf"(\| \d+\s*\| {escaped}\b[^|]*\|[^|]*\|[^|]*\| )\d+( \|)",
                 rf"\g<1>{count}\g<2>")
            )

    return update_file(filepath, replacements, dry_run)


def sync_claude_md(root: Path, ref: int, sys_: int, comp: int, total: int, dry_run: bool) -> int:
    """Update CLAUDE.md — architecture description numbers."""
    filepath = root / "CLAUDE.md"
    replacements = [
        # "529 tokens + 130 Text Styles" or "636 tokens + 130 Text Styles"
        (r"\d+( tokens \+ 130 Text Styles)", rf"{total}\1"),
        # "ref(155) → sys(153) → comp(221)" pattern
        (r"ref\(\d+\)( → sys\()\d+(\)( → comp\()\d+(\)))",
         rf"ref({ref})\g<1>{sys_}\g<2>"),
        # Fix the nested groups — simpler approach
        (r"ref\(\d+\) → sys\(\d+\) → comp\(\d+\)",
         f"ref({ref}) → sys({sys_}) → comp({comp})"),
    ]
    return update_file(filepath, replacements, dry_run)


def sync_cowork_instructions(root: Path, ref: int, sys_: int, comp: int, total: int, dry_run: bool) -> int:
    """Update COWORK_INSTRUCTIONS.md — token counts in §4."""
    filepath = root / "COWORK_INSTRUCTIONS.md"
    replacements = [
        # "目前：609 tokens + 130 Text Styles" or similar
        (r"(目前：)\d+( tokens \+ 130 Text Styles)", rf"\g<1>{total}\g<2>"),
        # ref(159) → sys(165) → comp(285) pattern
        (r"(ref\()\d+(\)→)", rf"\g<1>{ref}\g<2>"),
        (r"(sys\()\d+(\)→)", rf"\g<1>{sys_}\g<2>"),
        (r"(comp\()\d+(\)→)", rf"\g<1>{comp}\g<2>"),
    ]
    return update_file(filepath, replacements, dry_run)


def main() -> None:
    parser = argparse.ArgumentParser(description="Sync token counts to derived files")
    parser.add_argument("--root", type=Path, default=Path("."), help="Project root directory")
    parser.add_argument("--dry-run", action="store_true", help="Show changes without writing")
    args = parser.parse_args()

    root = args.root.resolve()
    json_path = root / "design-system-all.json"

    if not json_path.exists():
        print(f"ERROR: {json_path} not found")
        sys.exit(1)

    with json_path.open("r", encoding="utf-8") as f:
        data = json.load(f)

    counts = count_tokens(data)
    ref = counts["ref"]
    sys_ = counts["sys"]
    comp = counts["comp"]
    total = counts["total"]
    comp_detail = counts["comp_detail"]

    print(f"Token counts from JSON: {total} (ref {ref} + sys {sys_} + comp {comp})")
    print(f"Components: {', '.join(f'{k}({v})' for k, v in sorted(comp_detail.items()))}")
    print()

    total_changes = 0
    total_changes += sync_skill_md(root, ref, sys_, comp, total, args.dry_run)
    total_changes += sync_component_governance(root, ref, sys_, comp, total, comp_detail, args.dry_run)
    total_changes += sync_execution_plan(root, ref, sys_, comp, total, comp_detail, args.dry_run)
    total_changes += sync_claude_md(root, ref, sys_, comp, total, args.dry_run)
    total_changes += sync_cowork_instructions(root, ref, sys_, comp, total, args.dry_run)

    print(f"\nTotal: {total_changes} replacement(s) {'(dry run)' if args.dry_run else 'applied'}")


if __name__ == "__main__":
    main()

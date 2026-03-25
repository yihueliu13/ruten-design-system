#!/usr/bin/env python3
from __future__ import annotations

import argparse
import json
import re
import sys
from dataclasses import dataclass
from pathlib import Path
from typing import Any, Iterable


@dataclass
class Issue:
    level: str  # PASS / FAIL / WARN
    code: str
    message: str
    file: str | None = None


def load_json(path: Path) -> Any:
    with path.open("r", encoding="utf-8") as f:
        return json.load(f)


def flatten_token_leaves(obj: Any, path: str = "") -> list[tuple[str, dict[str, Any]]]:
    leaves: list[tuple[str, dict[str, Any]]] = []
    if isinstance(obj, dict):
        if "$value" in obj:
            leaves.append((path, obj))
        for key, value in obj.items():
            if key.startswith("$"):
                continue
            next_path = f"{path}.{key}" if path else key
            leaves.extend(flatten_token_leaves(value, next_path))
    return leaves


def get_in(obj: Any, path: str) -> Any:
    cur = obj
    for part in path.split("."):
        if not isinstance(cur, dict) or part not in cur:
            raise KeyError(path)
        cur = cur[part]
    return cur


def read_text(path: Path) -> str:
    return path.read_text(encoding="utf-8")


def read_text_optional(path: Path) -> str | None:
    """Read file if it exists, return None otherwise."""
    if path.exists():
        return path.read_text(encoding="utf-8")
    return None


def expect_contains(issues: list[Issue], text: str, needle: str, file: str, code: str, msg: str) -> None:
    if needle in text:
        issues.append(Issue("PASS", code, msg, file))
    else:
        issues.append(Issue("FAIL", code, f"Missing expected text: {needle}", file))


def expect_not_contains(issues: list[Issue], text: str, needle: str, file: str, code: str, msg: str) -> None:
    if needle in text:
        issues.append(Issue("FAIL", code, f"Found forbidden text: {needle}", file))
    else:
        issues.append(Issue("PASS", code, msg, file))


def build_issues(root: Path) -> list[Issue]:
    issues: list[Issue] = []

    json_path = root / "design-system-all.json"
    skill_path = root / "SKILL.md"
    comp_gov_path = root / "component-governance.md"
    migration_path = root / "token-migration-map.md"
    viewer_live_path = root / "ruten-design-system.html"
    script_path = root / "create-text-styles.js"

    data = load_json(json_path)
    leaves = flatten_token_leaves(data)
    ref_count = sum(1 for p, _ in leaves if p.startswith("ref."))
    sys_count = sum(1 for p, _ in leaves if p.startswith("sys."))
    comp_count = sum(1 for p, _ in leaves if p.startswith("comp."))
    total_count = len(leaves)
    expected_text_styles = 130

    # --- Source of truth JSON checks ---
    ext = data.get("$extensions", {}) if isinstance(data, dict) else {}
    version = ext.get("ruten.version")
    status = ext.get("ruten.status")
    source = ext.get("ruten.sourceOfTruth")
    if version == "v1.0.0" and status == "sealed-baseline" and source == "design-system-all.json":
        issues.append(Issue("PASS", "JSON_METADATA", "Baseline metadata is present and correct.", str(json_path.name)))
    else:
        issues.append(Issue("FAIL", "JSON_METADATA", f"Unexpected metadata: version={version}, status={status}, sourceOfTruth={source}", str(json_path.name)))

    checks = [
        ("ref.typography.font-size.label-2xs.$value", 8, "LABEL_2XS_RAW", "label-2xs raw size is 8px."),
        ("ref.typography.font-size.body-md-alt.$value", 13, "BODY_MD_ALT_RAW", "body-md-alt raw size is 13px."),
        ("sys.typography.label.2xs.$value", "{ref.typography.font-size.label-2xs}", "LABEL_2XS_ALIAS", "sys.typography.label.2xs points to label-2xs raw token."),
        ("sys.typography.body.md-alt.$value", "{ref.typography.font-size.body-md-alt}", "BODY_MD_ALT_ALIAS", "sys.typography.body.md-alt points to body-md-alt raw token."),
        ("sys.color.price.$value", "{ref.color.red.500}", "PRICE_COLOR_ALIAS", "sys.color.price exists and points to red.500."),
        ("comp.product-card.price.current.color.$value", "{sys.color.price}", "PRODUCT_PRICE_COLOR", "product-card current price uses sys.color.price."),
    ]
    for path, expected, code, ok_message in checks:
        try:
            value = get_in(data, path)
            if value == expected:
                issues.append(Issue("PASS", code, ok_message, str(json_path.name)))
            else:
                issues.append(Issue("FAIL", code, f"{path} = {value!r}, expected {expected!r}", str(json_path.name)))
        except KeyError:
            issues.append(Issue("FAIL", code, f"Missing path: {path}", str(json_path.name)))

    mono_paths = [p for p, _ in leaves if ".mono" in p or p.endswith("mono")]
    if mono_paths:
        preview = ", ".join(mono_paths[:5])
        issues.append(Issue("FAIL", "MONO_REMOVED", f"Mono token paths still exist: {preview}", str(json_path.name)))
    else:
        issues.append(Issue("PASS", "MONO_REMOVED", "No Mono token paths remain in source of truth.", str(json_path.name)))

    # --- Derived file checks ---
    skill = read_text(skill_path)
    comp_gov = read_text(comp_gov_path)
    migration = read_text(migration_path)
    viewer_live = read_text_optional(viewer_live_path)
    script = read_text(script_path)

    # SKILL.md checks (slimmed — defers counts to JSON)
    expect_contains(issues, skill, "See `design-system-all.json` for current token counts.", skill_path.name, "SKILL_DEFERS_COUNTS", "SKILL defers token counts to JSON.")
    expect_contains(issues, skill, "comp → sys → ref", skill_path.name, "SKILL_ALIAS_DIRECTION", "SKILL documents alias direction.")
    expect_contains(issues, skill, "130 styles", skill_path.name, "SKILL_TEXT_STYLES", "SKILL references 130 text styles.")

    # component-governance.md checks (merged from governance.md + progress.md)
    expect_contains(issues, comp_gov, "Source of Truth", comp_gov_path.name, "COMPGOV_SOT", "Component governance declares source of truth.")
    expect_contains(issues, comp_gov, "Locked Decisions", comp_gov_path.name, "COMPGOV_LOCKED", "Component governance contains locked decisions.")
    expect_contains(issues, comp_gov, "Architecture Decisions Log", comp_gov_path.name, "COMPGOV_ARCH_LOG", "Component governance contains architecture decisions log.")
    expect_contains(issues, comp_gov, "label-2xs", comp_gov_path.name, "COMPGOV_LABEL2XS", "Component governance documents label-2xs decision.")
    expect_contains(issues, comp_gov, "body-md-alt", comp_gov_path.name, "COMPGOV_BODYMDALT", "Component governance documents body-md-alt decision.")
    expect_contains(issues, comp_gov, "sys/color/price", comp_gov_path.name, "COMPGOV_PRICE", "Component governance documents price color decision.")

    # Migration map
    if 'design-system-all.json' in migration and '唯一真實來源' in migration:
        issues.append(Issue("PASS", "MIGRATION_SOT", "Migration map declares the source of truth.", migration_path.name))
    else:
        issues.append(Issue("FAIL", "MIGRATION_SOT", "Migration map does not clearly declare design-system-all.json as source of truth.", migration_path.name))

    if ('body-md-alt' in migration or 'body/md-alt' in migration) and '13px' in migration:
        issues.append(Issue("PASS", "MIGRATION_13PX", "Migration map uses body-md-alt for 13px.", migration_path.name))
    else:
        issues.append(Issue("FAIL", "MIGRATION_13PX", "Migration map does not clearly map 13px to body-md-alt.", migration_path.name))

    if 'comp/product-card/price-color' in migration and 'sys/color/price' in migration:
        issues.append(Issue("PASS", "MIGRATION_PRICE", "Migration map points product-card price-color to sys/color/price.", migration_path.name))
    else:
        issues.append(Issue("FAIL", "MIGRATION_PRICE", "Migration map does not clearly map product-card price-color to sys/color/price.", migration_path.name))

    # Viewer checks (skip if file missing)
    if viewer_live is not None:
        if ('fetch(' in viewer_live and 'design-system-all.json' in viewer_live) or "DATA_SOURCE = './design-system-all.json'" in viewer_live:
            issues.append(Issue("PASS", "VIEWER_DATA_SOURCE", "Viewer references design-system-all.json.", viewer_live_path.name))
        else:
            issues.append(Issue("FAIL", "VIEWER_DATA_SOURCE", "Viewer does not appear to reference design-system-all.json.", viewer_live_path.name))
        expect_contains(issues, viewer_live, f"130 個 Text Styles", viewer_live_path.name, "VIEWER_TEXT_STYLES", "Viewer shows 130 text styles.")
    else:
        issues.append(Issue("WARN", "VIEWER_MISSING", "ruten-design-system.html not found, skipping viewer checks.", viewer_live_path.name))

    # Forbidden legacy text
    forbidden = {
        skill_path.name: (skill, ["523 tokens", "483 tokens", "481 tokens"]),
        comp_gov_path.name: (comp_gov, ["- comp: 218", "- total: 523", "- comp: 178", "- total: 483", "- total: 481"]),
    }
    for file_name, (text, needles) in forbidden.items():
        for needle in needles:
            expect_not_contains(issues, text, needle, file_name, f"NO_LEGACY::{file_name}::{needle}", f"{file_name} does not contain legacy value {needle!r}.")

    # Script sanity check
    expect_not_contains(issues, script, "SF Mono", script_path.name, "SCRIPT_NO_MONO", "Text style script no longer generates SF Mono styles.")
    expect_contains(issues, script, "130", script_path.name, "SCRIPT_130", "Text style script references the 130-style baseline.")

    return issues


def print_report(issues: Iterable[Issue]) -> int:
    issues = list(issues)
    fail_count = sum(1 for i in issues if i.level == "FAIL")
    warn_count = sum(1 for i in issues if i.level == "WARN")
    pass_count = sum(1 for i in issues if i.level == "PASS")

    for issue in issues:
        icon = {"PASS": "✅", "FAIL": "❌", "WARN": "⚠️"}[issue.level]
        suffix = f" [{issue.file}]" if issue.file else ""
        print(f"{icon} {issue.code}{suffix}: {issue.message}")

    print("\n---")
    print(f"PASS: {pass_count}  FAIL: {fail_count}  WARN: {warn_count}")
    if fail_count:
        print("Validation failed.")
        return 1
    print("Validation passed.")
    return 0


def main() -> int:
    parser = argparse.ArgumentParser(description="Validate the sealed Ruten design-system baseline.")
    parser.add_argument("--root", default=".", help="Directory containing design-system files.")
    args = parser.parse_args()
    root = Path(args.root).resolve()
    return print_report(build_issues(root))


if __name__ == "__main__":
    sys.exit(main())

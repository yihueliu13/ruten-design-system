#!/usr/bin/env python3
"""
sync-daily-log.py — Auto-sync DAILY_LOG.md with git history.

Three modes:
  --write   Session 啟動：補寫遺漏的 commits（跨 session 安全網）
  --close   Session 收工：產出當日完成摘要 + token 狀態 + 明日建議
  （無參數） Dry-run：只顯示報告，不寫入

Both --write and --close update the "目前狀態" header block at the top of
DAILY_LOG.md, so Chat (Project Knowledge) always sees the latest status
in the first ~30 lines.

Usage:
  python3 sync-daily-log.py --root .                # dry-run 看報告
  python3 sync-daily-log.py --root . --write         # 啟動同步
  python3 sync-daily-log.py --root . --close         # 收工報告
  python3 sync-daily-log.py --root . --close --commit # 收工 + git commit
"""
from __future__ import annotations

import argparse
import json
import re
import subprocess
import sys
from collections import defaultdict
from datetime import datetime, timedelta
from pathlib import Path


# --- Constants ---

WEEKDAY_ZH = ["一", "二", "三", "四", "五", "六", "日"]
STATUS_BEGIN = "<!-- STATUS:BEGIN -->"
STATUS_END = "<!-- STATUS:END -->"


# --- Git Helpers ---

def run_git(args: list[str], cwd: Path) -> str:
    """Run a git command and return stdout."""
    result = subprocess.run(
        ["git"] + args, cwd=cwd, capture_output=True, text=True,
    )
    if result.returncode != 0:
        print(f"⚠ git error: {result.stderr.strip()}", file=sys.stderr)
        return ""
    return result.stdout.strip()


def get_commits_since(since_date: str, cwd: Path, inclusive: bool = False) -> list[dict]:
    """Get all commits since a given date."""
    if inclusive:
        since_str = f"{since_date}T00:00:00"
    else:
        dt = datetime.strptime(since_date, "%Y-%m-%d") + timedelta(days=1)
        since_str = dt.strftime("%Y-%m-%dT00:00:00")

    raw = run_git(
        ["log", f"--since={since_str}", "--format=%H|%ai|%s", "--reverse"], cwd=cwd,
    )
    if not raw:
        return []

    commits = []
    for line in raw.strip().split("\n"):
        if not line.strip():
            continue
        parts = line.split("|", 2)
        if len(parts) < 3:
            continue
        hash_full, date_str, subject = parts
        date_only = date_str.strip()[:10]
        commits.append({
            "hash": hash_full[:7],
            "hash_full": hash_full.strip(),
            "date": date_only,
            "datetime": date_str.strip(),
            "subject": subject.strip(),
        })
    return commits


def get_commits_today(cwd: Path) -> list[dict]:
    """Get all commits from today."""
    today = datetime.now().strftime("%Y-%m-%d")
    return get_commits_since(today, cwd, inclusive=True)


def get_files_changed_in_commit(hash_short: str, cwd: Path) -> list[str]:
    """Get list of files changed in a commit."""
    raw = run_git(["diff-tree", "--no-commit-id", "--name-only", "-r", hash_short], cwd=cwd)
    if not raw:
        return []
    return [f for f in raw.split("\n") if f.strip()]


def get_all_files_changed(commits: list[dict], cwd: Path) -> set[str]:
    """Collect all files changed across given commits."""
    all_files: set[str] = set()
    for c in commits:
        files = get_files_changed_in_commit(c["hash"], cwd)
        all_files.update(files)
    return all_files


# --- DAILY_LOG Parsing ---

def get_last_log_date(daily_log_path: Path) -> str | None:
    """Extract the most recent ## YYYY-MM-DD date from DAILY_LOG.md."""
    if not daily_log_path.exists():
        return None
    text = daily_log_path.read_text(encoding="utf-8")
    matches = re.findall(r"^## (\d{4}-\d{2}-\d{2})", text, re.MULTILINE)
    return matches[0] if matches else None


def get_recorded_hashes(daily_log_path: Path) -> set[str]:
    """Extract all commit hashes already mentioned in DAILY_LOG.md."""
    if not daily_log_path.exists():
        return set()
    text = daily_log_path.read_text(encoding="utf-8")
    return set(re.findall(r"`([0-9a-f]{7})`", text))


def get_planned_items_for_today(daily_log_path: Path) -> list[str]:
    """Extract today's planned work items from DAILY_LOG.md."""
    if not daily_log_path.exists():
        return []
    text = daily_log_path.read_text(encoding="utf-8")

    pattern = r"###\s+\d+\.\s+(?:今日工作項目|今日工作順序|明日工作順序).*?\n(.*?)(?=\n###|\n---|\n##|\Z)"
    match = re.search(pattern, text, re.DOTALL)
    if not match:
        return []

    section = match.group(1)
    items = []
    for line in section.split("\n"):
        line = line.strip()
        if line.startswith("|") and not line.startswith("| 項目") and not line.startswith("|---"):
            cols = [c.strip() for c in line.split("|") if c.strip()]
            if cols:
                items.append(cols[0])
        elif re.match(r"^\d+\.\s+", line):
            items.append(re.sub(r"^\d+\.\s+", "", line))
        elif line.startswith("- ") and not line.startswith("- {"):
            items.append(line[2:])

    return items


def get_blocked_items(daily_log_path: Path) -> list[tuple[str, str]]:
    """Extract blocked items from the most recent Blocked section."""
    if not daily_log_path.exists():
        return []
    text = daily_log_path.read_text(encoding="utf-8")

    pattern = r"###\s+\d+\.\s+Blocked.*?\n(.*?)(?=\n###|\n---|\n##|\Z)"
    match = re.search(pattern, text, re.DOTALL)
    if not match:
        return []

    items = []
    for line in match.group(1).split("\n"):
        line = line.strip()
        if line.startswith("|") and not line.startswith("| 項目") and not line.startswith("|---"):
            cols = [c.strip() for c in line.split("|") if c.strip()]
            if len(cols) >= 2 and "Claude" not in cols[0]:
                items.append((cols[0], cols[1]))

    return items


# --- Token Counting ---

def get_token_counts(cwd: Path) -> dict | None:
    """Read design-system-all.json and count tokens by tier."""
    json_path = cwd / "design-system-all.json"
    if not json_path.exists():
        return None

    try:
        data = json.loads(json_path.read_text(encoding="utf-8"))
    except json.JSONDecodeError:
        return None

    counts = {"ref": 0, "sys": 0, "comp": 0}

    def walk(obj: dict, path: str = ""):
        if isinstance(obj, dict):
            if "$value" in obj:
                tier = path.split("/")[0] if "/" in path else path
                if tier in counts:
                    counts[tier] += 1
                return
            for key, val in obj.items():
                new_path = f"{path}/{key}" if path else key
                walk(val, new_path)

    walk(data)
    total = sum(counts.values())
    return {"ref": counts["ref"], "sys": counts["sys"], "comp": counts["comp"], "total": total}


def run_validation(cwd: Path) -> tuple[int, int]:
    """Run validate-design-system.py and return (pass_count, fail_count)."""
    script = cwd / "tool" / "validate-design-system.py"
    if not script.exists():
        return (0, 0)

    result = subprocess.run(
        ["python3", str(script), "--root", str(cwd)],
        capture_output=True, text=True, cwd=cwd,
    )
    output = result.stdout + result.stderr

    pass_count = len(re.findall(r"✅|PASS", output))
    fail_count = len(re.findall(r"❌|FAIL", output))
    return (pass_count, fail_count)


# --- Commit Classification ---

def categorize_commit(subject: str) -> str:
    """Categorize a commit by its prefix."""
    s = subject.lower()
    if s.startswith(("feat:", "feat(")):       return "新增功能"
    elif s.startswith(("fix:", "fix(")):        return "修復"
    elif s.startswith(("refactor:", "refactor(")): return "重構"
    elif s.startswith(("cleanup:", "clean:")):  return "清理"
    elif s.startswith(("docs:", "doc:")):       return "文件"
    elif s.startswith(("rule:", "governance:")): return "規則"
    elif s.startswith(("log:", "standup:")):    return "日誌"
    elif s.startswith(("backup:", "備份")):     return "備份"
    elif s.startswith("更新"):                  return "更新"
    else:                                       return "其他"


def group_commits_by_date(commits: list[dict]) -> dict[str, list[dict]]:
    """Group commits by date."""
    grouped: dict[str, list[dict]] = defaultdict(list)
    for c in commits:
        grouped[c["date"]].append(c)
    return dict(grouped)


def format_date_header(date_str: str) -> str:
    """Format: ## YYYY-MM-DD（星期）"""
    dt = datetime.strptime(date_str, "%Y-%m-%d")
    return f"## {date_str}（{WEEKDAY_ZH[dt.weekday()]}）"


# --- Sprint Progress ---

def get_sprint_progress(cwd: Path) -> tuple[list[str], list[str]]:
    """Read EXECUTION_PLAN.md and extract sprint status + next incomplete items.

    Returns (completed_sprints, next_items).
    """
    ep_path = cwd / "ops" / "EXECUTION_PLAN.md"
    if not ep_path.exists():
        return ([], [])

    text = ep_path.read_text(encoding="utf-8")

    # Extract sprint completion status
    completed_sprints = []
    sprint_pattern = r"### (Sprint \d+).*?\n(.*?)(?=\n### Sprint|\n---|\Z)"
    for m in re.finditer(sprint_pattern, text, re.DOTALL):
        sprint_name = m.group(1)
        section = m.group(2)
        checked = len(re.findall(r"- \[x\]", section))
        unchecked = len(re.findall(r"- \[ \]", section))
        total = checked + unchecked
        if total > 0:
            if unchecked == 0:
                completed_sprints.append(f"{sprint_name} ✅")
            else:
                completed_sprints.append(f"{sprint_name} 🔄 ({checked}/{total})")

    # Extract next incomplete items
    incomplete = []
    for match in re.finditer(r"^- \[ \] (.+)$", text, re.MULTILINE):
        incomplete.append(match.group(1).strip())

    return (completed_sprints, incomplete[:6])


# =====================================================
# STATUS BLOCK — 固定在 DAILY_LOG 頂部，每次覆寫
# Chat (Project Knowledge) 只要讀前 ~30 行就能掌握全貌
# =====================================================

def generate_status_block(cwd: Path, daily_log_path: Path) -> str:
    """Generate the fixed status block for the top of DAILY_LOG.md."""
    today = datetime.now().strftime("%Y-%m-%d")
    dt = datetime.strptime(today, "%Y-%m-%d")
    weekday = WEEKDAY_ZH[dt.weekday()]
    now = datetime.now().strftime("%H:%M")

    lines = [STATUS_BEGIN]
    lines.append(f"## 🔄 目前狀態（{today}（{weekday}）{now} 自動更新）")
    lines.append("")

    # Token counts
    token_counts = get_token_counts(cwd)
    if token_counts:
        lines.append(f"**Token：{token_counts['total']}** (ref {token_counts['ref']} + sys {token_counts['sys']} + comp {token_counts['comp']}) + 130 Text Styles")

    # Validation
    pass_count, fail_count = run_validation(cwd)
    if pass_count or fail_count:
        status_emoji = "✅" if fail_count == 0 else "⚠️"
        lines.append(f"**Validation：{pass_count} PASS / {fail_count} FAIL** {status_emoji}")

    # Sprint progress
    completed_sprints, next_items = get_sprint_progress(cwd)
    if completed_sprints:
        lines.append(f"**Sprint：** {' · '.join(completed_sprints)}")

    lines.append("")

    # Next work
    planned = get_planned_items_for_today(daily_log_path)
    if planned:
        lines.append("**下一步：**")
        for item in planned[:3]:
            lines.append(f"- {item}")
    elif next_items:
        lines.append("**下一步（從 EXECUTION_PLAN）：**")
        for item in next_items[:3]:
            lines.append(f"- {item}")

    # Blocked
    blocked = get_blocked_items(daily_log_path)
    if blocked:
        lines.append("")
        lines.append("**Blocked：**")
        for item, reason in blocked:
            lines.append(f"- {item} — {reason}")

    # Today's commits count
    today_commits = get_commits_today(cwd)
    meaningful = [c for c in today_commits if categorize_commit(c["subject"]) not in ("日誌", "備份")]
    if meaningful:
        lines.append("")
        lines.append(f"**今日 commits：{len(meaningful)} 筆**")
        for c in meaningful[-3:]:  # Show last 3
            lines.append(f"- `{c['hash']}` {c['subject']}")
        if len(meaningful) > 3:
            lines.append(f"- ...（共 {len(meaningful)} 筆）")

    lines.append(STATUS_END)
    return "\n".join(lines)


def upsert_status_block(daily_log_path: Path, status_block: str) -> None:
    """Insert or replace the status block at the top of DAILY_LOG.md."""
    if not daily_log_path.exists():
        content = f"# Ruten Design System — Daily Standup Log\n\n{status_block}\n\n---\n"
        daily_log_path.write_text(content, encoding="utf-8")
        return

    text = daily_log_path.read_text(encoding="utf-8")

    # Check if status block already exists
    pattern = re.compile(
        re.escape(STATUS_BEGIN) + r".*?" + re.escape(STATUS_END),
        re.DOTALL,
    )

    if pattern.search(text):
        # Replace existing
        new_text = pattern.sub(status_block, text)
    else:
        # Insert after first ---
        sep_match = re.search(r"^---\s*$", text, re.MULTILINE)
        if sep_match:
            insert_pos = sep_match.end()
            new_text = text[:insert_pos] + "\n\n" + status_block + "\n" + text[insert_pos:]
        else:
            # Insert after title line
            title_match = re.search(r"^# .+\n", text)
            if title_match:
                insert_pos = title_match.end()
                new_text = text[:insert_pos] + "\n" + status_block + "\n" + text[insert_pos:]
            else:
                new_text = status_block + "\n\n" + text

    daily_log_path.write_text(new_text, encoding="utf-8")


# =====================================================
# BLOCK GENERATORS — 歷史紀錄區塊
# =====================================================

def generate_catchup_block(date_str: str, commits: list[dict], cwd: Path) -> str:
    """Generate a DAILY_LOG block for unrecorded commits (--write mode)."""
    lines = []
    header = format_date_header(date_str)
    lines.append(f"{header} — 自動補錄（sync-daily-log.py）")
    lines.append("")
    lines.append("### 1. Git 活動紀錄（自動擷取）")

    by_cat: dict[str, list[dict]] = defaultdict(list)
    all_files: set[str] = set()
    for c in commits:
        cat = categorize_commit(c["subject"])
        by_cat[cat].append(c)
        files = get_files_changed_in_commit(c["hash"], cwd)
        all_files.update(files)

    meaningful_cats = {k: v for k, v in by_cat.items() if k not in ("日誌", "備份")}

    if meaningful_cats:
        for cat_commits in meaningful_cats.values():
            for c in cat_commits:
                lines.append(f"- [x] `{c['hash']}` {c['subject']}")
    else:
        lines.append("- （僅備份/日誌 commits，無實質變更）")

    if by_cat.get("備份") or by_cat.get("日誌"):
        backup_log = by_cat.get("備份", []) + by_cat.get("日誌", [])
        lines.append("")
        lines.append("**備份/日誌：**")
        for c in backup_log:
            lines.append(f"- `{c['hash']}` {c['subject']}")

    lines.append("")
    lines.append(f"### 2. 變動檔案（{len(all_files)} 個）")
    important_files = sorted([f for f in all_files if not f.startswith(".")])
    if important_files:
        for f in important_files[:20]:
            lines.append(f"- `{f}`")
        if len(important_files) > 20:
            lines.append(f"- ...（共 {len(important_files)} 個檔案）")
    else:
        lines.append("- （無檔案變動）")

    lines.append("")
    return "\n".join(lines)


def generate_close_block(cwd: Path, daily_log_path: Path) -> str:
    """Generate the close-of-day history block (--close mode)."""
    today = datetime.now().strftime("%Y-%m-%d")
    header = format_date_header(today)
    lines = [f"{header} — 收工（sync-daily-log.py --close）", ""]

    # --- §1 今日完成 ---
    lines.append("### 1. 今日完成")

    today_commits = get_commits_today(cwd)
    all_files = get_all_files_changed(today_commits, cwd)
    planned = get_planned_items_for_today(daily_log_path)

    if today_commits:
        meaningful = [c for c in today_commits if categorize_commit(c["subject"]) not in ("日誌", "備份")]
        backups = [c for c in today_commits if categorize_commit(c["subject"]) in ("日誌", "備份")]

        if meaningful:
            for c in meaningful:
                lines.append(f"- [x] `{c['hash']}` {c['subject']}")
        else:
            lines.append("- （今日無實質 commits）")

        if backups:
            lines.append("")
            lines.append("**備份/日誌：**")
            for c in backups:
                lines.append(f"- `{c['hash']}` {c['subject']}")
    else:
        lines.append("- （今日無 commits）")

    if planned:
        lines.append("")
        lines.append("**原定計畫項目：**")
        for item in planned:
            lines.append(f"- {item}")

    lines.append("")

    # --- §2 Token 狀態 ---
    lines.append("### 2. Token 狀態")
    token_counts = get_token_counts(cwd)
    if token_counts:
        lines.append(f"- 目前：{token_counts['total']} tokens (ref {token_counts['ref']} + sys {token_counts['sys']} + comp {token_counts['comp']})")

    pass_count, fail_count = run_validation(cwd)
    if pass_count or fail_count:
        lines.append(f"- Validation：**{pass_count} PASS / {fail_count} FAIL**")

    important_files = sorted([f for f in all_files if not f.startswith(".")])
    if important_files:
        lines.append(f"- 今日變動檔案（{len(important_files)} 個）：")
        for f in important_files[:15]:
            lines.append(f"  - `{f}`")
        if len(important_files) > 15:
            lines.append(f"  - ...（共 {len(important_files)} 個）")

    lines.append("")

    # --- §3 明日工作順序 ---
    lines.append("### 3. 明日工作順序（建議，等 Kay 確認）")

    suggestions = []
    if planned:
        for item in planned[:3]:
            suggestions.append(item)

    _, sprint_items = get_sprint_progress(cwd)
    for item in sprint_items:
        if item not in suggestions:
            suggestions.append(item)
            if len(suggestions) >= 5:
                break

    if suggestions:
        for i, item in enumerate(suggestions[:3], 1):
            lines.append(f"{i}. {item}")
        lines.append("")
        if len(suggestions) > 3:
            lines.append("### 如果有空才做")
            for item in suggestions[3:5]:
                lines.append(f"- {item}")
    else:
        lines.append("1. （請查看 EXECUTION_PLAN.md）")

    lines.append("")

    # --- §4 Blocked ---
    lines.append("### 4. Blocked 項目")
    lines.append("| 項目 | Blocked 原因 |")
    lines.append("|------|-------------|")

    blocked = get_blocked_items(daily_log_path)
    if blocked:
        for item, reason in blocked:
            lines.append(f"| {item} | {reason} |")
    lines.append("| （Claude 補充已知 blocked） | — |")

    lines.append("")
    return "\n".join(lines)


# --- Report Generation (dry-run) ---

def generate_report(commits_by_date: dict[str, list[dict]], last_log_date: str | None, cwd: Path) -> str:
    """Generate the full sync report (dry-run output)."""
    if not commits_by_date:
        return "✅ DAILY_LOG 已是最新，沒有遺漏的 commits。"

    total_commits = sum(len(v) for v in commits_by_date.values())
    dates = sorted(commits_by_date.keys())

    parts = []
    parts.append("📋 DAILY_LOG 同步報告")
    parts.append(f"   最後記錄日期：{last_log_date or '（無）'}")
    parts.append(f"   遺漏 commits：{total_commits} 筆，橫跨 {len(dates)} 天")
    parts.append(f"   日期範圍：{dates[0]} → {dates[-1]}")
    parts.append("")

    token_counts = get_token_counts(cwd)
    if token_counts:
        parts.append(f"   目前 Token：{token_counts['total']} (ref {token_counts['ref']} + sys {token_counts['sys']} + comp {token_counts['comp']})")
        parts.append("")

    for date_str in sorted(dates, reverse=True):
        block = generate_catchup_block(date_str, commits_by_date[date_str], cwd)
        parts.append(block)

    return "\n".join(parts)


# --- Write to DAILY_LOG ---

def write_history_to_daily_log(daily_log_path: Path, blocks: list[str]) -> None:
    """Insert history blocks after the status block (or after ---)."""
    if not daily_log_path.exists():
        content = "# Ruten Design System — Daily Standup Log\n\n---\n\n"
        content += "\n---\n\n".join(blocks)
        daily_log_path.write_text(content, encoding="utf-8")
        return

    text = daily_log_path.read_text(encoding="utf-8")

    # Insert after STATUS:END if it exists, otherwise after first ---
    status_end_match = re.search(re.escape(STATUS_END), text)
    if status_end_match:
        insert_pos = status_end_match.end()
    else:
        sep_match = re.search(r"^---\s*$", text, re.MULTILINE)
        if sep_match:
            insert_pos = sep_match.end()
        else:
            insert_pos = len(text)

    new_text = (
        text[:insert_pos]
        + "\n\n"
        + "\n---\n\n".join(blocks)
        + "\n\n---"
        + text[insert_pos:]
    )

    daily_log_path.write_text(new_text, encoding="utf-8")


def git_commit_daily_log(cwd: Path, mode: str) -> None:
    """Stage and commit DAILY_LOG.md."""
    today = datetime.now().strftime("%Y-%m-%d")
    run_git(["add", "ops/DAILY_LOG.md"], cwd)
    msg = f"log: {today} daily {mode}"
    run_git(["commit", "-m", msg], cwd)
    print(f"📝 git commit: {msg}")


# --- Main ---

def main():
    parser = argparse.ArgumentParser(
        description="Sync DAILY_LOG.md with git history",
        formatter_class=argparse.RawDescriptionHelpFormatter,
        epilog="""
modes:
  (default)   Dry-run — 顯示報告，不寫入
  --write     啟動同步 — 補寫遺漏的 commits + 更新頂部狀態
  --close     收工報告 — 產出今日摘要 + 更新頂部狀態 + 明日建議

examples:
  python3 sync-daily-log.py --root .
  python3 sync-daily-log.py --root . --write
  python3 sync-daily-log.py --root . --close
  python3 sync-daily-log.py --root . --close --commit
        """,
    )
    parser.add_argument("--root", default=".", help="Project root directory")
    parser.add_argument("--write", action="store_true", help="啟動同步：補寫遺漏 commits + 更新頂部狀態")
    parser.add_argument("--close", action="store_true", help="收工：產出當日摘要 + 更新頂部狀態 + 明日建議")
    parser.add_argument("--commit", action="store_true", help="寫入後自動 git commit")
    parser.add_argument("--since", help="Override start date (YYYY-MM-DD)")
    args = parser.parse_args()

    cwd = Path(args.root).resolve()
    daily_log = cwd / "ops" / "DAILY_LOG.md"

    # === --close mode ===
    if args.close:
        print("🔍 產生收工報告...")

        # 1. Update status block
        status_block = generate_status_block(cwd, daily_log)
        upsert_status_block(daily_log, status_block)
        print("✅ 頂部狀態區塊已更新")

        # 2. Generate and write close-of-day history block
        block = generate_close_block(cwd, daily_log)
        print(block)
        print("---")

        write_history_to_daily_log(daily_log, [block])
        print("✅ 收工報告已寫入 DAILY_LOG.md")

        if args.commit:
            git_commit_daily_log(cwd, "close")

        return

    # === --write mode (or dry-run) ===
    if args.since:
        last_date = args.since
    else:
        last_date = get_last_log_date(daily_log)

    if not last_date:
        print("⚠ 找不到 DAILY_LOG.md 中的日期記錄，請用 --since 指定起始日期。", file=sys.stderr)
        sys.exit(1)

    print(f"🔍 掃描 git log（自 {last_date} 起，含當天）...")
    all_commits = get_commits_since(last_date, cwd, inclusive=True)

    recorded_hashes = get_recorded_hashes(daily_log)
    commits = [c for c in all_commits if c["hash"] not in recorded_hashes]

    if not commits and not args.write:
        print("✅ DAILY_LOG 已是最新，沒有遺漏的 commits。")
        sys.exit(0)

    if commits:
        commits_by_date = group_commits_by_date(commits)
        report = generate_report(commits_by_date, last_date, cwd)
        print(report)
    else:
        print("✅ 沒有遺漏的 commits。")

    if args.write:
        # Always update status block
        status_block = generate_status_block(cwd, daily_log)
        upsert_status_block(daily_log, status_block)
        print("✅ 頂部狀態區塊已更新")

        if commits:
            dates = sorted(group_commits_by_date(commits).keys(), reverse=True)
            blocks = [
                generate_catchup_block(d, group_commits_by_date(commits)[d], cwd)
                for d in dates
            ]
            write_history_to_daily_log(daily_log, blocks)
            print(f"✅ 已將 {len(blocks)} 個日期區塊寫入 DAILY_LOG.md")

        if args.commit:
            git_commit_daily_log(cwd, "sync")
    elif commits:
        print(f"\n💡 加上 --write 參數可自動寫入 DAILY_LOG.md")


if __name__ == "__main__":
    main()

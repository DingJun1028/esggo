# oa-twins-tracker.py — OA-TWINS CI-failure closed-loop tracker (PROVEN WORKING)
# Deploy to: C:\Users\dingj\AppData\Local\hermes\scripts\oa-twins-tracker.py
# Cron: telegram-vps-bridge (every 15m, deliver=local) -> python3 this file
# All paths ABSOLUTE (Git-Bash expanduser produces mixed-separator paths that break state persistence + subprocess).

import json
import os
import subprocess
import sys
from datetime import datetime, timezone

REPO = "DingJun1028/esggo"
# 秘密圣柜 state: ABSOLUTE Windows path (do NOT use os.path.expanduser)
_STATE_DIR = r"C:\Users\dingj\AppData\Local\hermes\scripts"
STATE_FILE = os.path.join(_STATE_DIR, "oa-twins-tracker.state")
ALERT_FILE = os.path.join(_STATE_DIR, "_auto_repair_alert.txt")
SENDER = os.path.join(_STATE_DIR, "_send_tg_alert.py")
MAX_RUNS = 20

def run_gh(args):
    try:
        out = subprocess.run(["gh"] + args, capture_output=True, text=True, timeout=60)
        if out.returncode != 0:
            return None
        return out.stdout.strip()
    except Exception:
        return None

def load_state():
    try:
        with open(STATE_FILE) as f:
            return f.read().strip()
    except FileNotFoundError:
        return ""

def save_state(run_id):
    os.makedirs(os.path.dirname(STATE_FILE), exist_ok=True)
    with open(STATE_FILE, "w") as f:
        f.write(str(run_id))

def send_telegram(msg):
    try:
        with open(ALERT_FILE, "w", encoding="utf-8") as f:
            f.write(msg)
        r = subprocess.run([sys.executable, SENDER], capture_output=True, text=True, timeout=30)
        out = (r.stdout + r.stderr).strip()
        return ("ok: True" in out, out)
    except Exception as e:
        return (False, f"SEND_EXCEPTION: {e}")

def issue_exists(run_id):
    raw = run_gh(["issue", "list", "--repo", REPO, "--limit", "50",
                  "--search", f"OA-TWINS 追蹤 {run_id} in:title"])
    if not raw:
        return False
    return str(run_id) in raw

def create_issue(workflow, run_id, url, conclusion, etype, log_excerpt):
    if issue_exists(run_id):
        return "SKIPPED_DUPLICATE"
    title = f"🐝 OA-TWINS 追蹤: {workflow} #{run_id}"
    body = (
        f"Workflow: {workflow}\nRun: {url}\n結論: {conclusion}\n"
        f"錯誤類型: {etype}\n\n節錄:\n```\n{log_excerpt[:1500]}\n```"
    )
    res = run_gh(["issue", "create", "--repo", REPO, "--title", title,
                  "--body", body, "--label", "auto-repair,tracker,swarm"])
    return "CREATED" if res else "FAILED"

def main():
    raw = run_gh(["run", "list", "--repo", REPO, "--limit", str(MAX_RUNS), "--json",
                  "databaseId,status,conclusion,workflowName,createdAt,url"])
    if not raw:
        print(json.dumps({"error": "gh run list failed (gh not authed or network)"}))
        return
    try:
        runs = json.loads(raw)
    except json.JSONDecodeError:
        print(json.dumps({"error": "gh run list returned non-JSON"}))
        return

    last_seen = load_state()
    new_failures = []
    newest_id = last_seen or "0"

    for r in runs:
        rid = str(r.get("databaseId", ""))
        if not rid:
            continue
        try:
            rid_i = int(rid)
        except ValueError:
            continue
        try:
            newest_i = int(newest_id)
        except ValueError:
            newest_i = 0
        if rid_i > newest_i:
            newest_id = rid
        try:
            last_seen_i = int(last_seen) if last_seen else 0
        except ValueError:
            last_seen_i = 0
        if last_seen and rid_i <= last_seen_i:
            continue
        if r.get("conclusion") == "failure":
            log = run_gh(["run", "view", rid, "--repo", REPO, "--log-failed"])
            etype = "unknown"
            if log:
                if "TS" in log or "property does not exist" in log: etype = "typescript"
                elif "eslint" in log.lower(): etype = "eslint"
                elif "Module not found" in log or "Cannot resolve" in log: etype = "build"
                elif "ERR_PNPM" in log or "lockfile" in log: etype = "dependency"
                elif "Trivy" in log or "CRITICAL" in log or "HIGH" in log: etype = "security"
                elif "prisma" in log.lower(): etype = "prisma"
                elif "docker" in log.lower(): etype = "docker"
            new_failures.append({
                "run_id": rid, "workflow": r.get("workflowName"),
                "conclusion": r.get("conclusion"), "url": r.get("url"),
                "error_type": etype, "log_excerpt": (log or "")[:2000],
            })

    # Persist on EVERY path (incl. action=none) to prevent re-fire
    save_state(newest_id)

    if not new_failures:
        print(json.dumps({"action": "none", "newest_run_id": newest_id}))
        return

    tg_ok_total = 0
    iss_total = 0
    for f in new_failures:
        msg = (
            f"🐝 OA-TWINS 追蹤警報\n"
            f"Workflow: {f['workflow']}\nRun: {f['url']}\n結論: {f['conclusion']}\n"
            f"錯誤類型: {f['error_type']}\n節錄: {f['log_excerpt'][:800]}\n"
            f"時間: {datetime.now(timezone.utc).strftime('%Y-%m-%d %H:%M UTC')}"
        )
        ok, _ = send_telegram(msg)
        if ok:
            tg_ok_total += 1
        iss = create_issue(f['workflow'], f['run_id'], f['url'], f['conclusion'],
                           f['error_type'], f['log_excerpt'])
        if iss == "CREATED":
            iss_total += 1

    import os as _os
    print(json.dumps({
        "action": "delegate",
        "failures": len(new_failures),
        "telegram_sent": tg_ok_total,
        "issues_created": iss_total,
        "newest_run_id": newest_id,
        "state_written": _os.path.exists(STATE_FILE),
    }, ensure_ascii=False))

if __name__ == "__main__":
    main()

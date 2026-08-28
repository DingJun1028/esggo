#!/usr/bin/env python3
"""
gh-error-watch — GitHub 報錯通知信自動修復監視器 (OA-TWINS 萬能分身跟蹤)

功能:
  1. 輪詢 DingJun1028/esggo 最近的 CI workflow runs
  2. 偵測 failure / cancelled 的新 run (比對上次見過的 run id)
  3. 下載真實失敗 log (gh run view --log-failed) — 對齊 esggo-ci-auto-repair 教訓: 只信 pipeline log
  4. 輸出 JSON: { new_failures: [...], action: 'delegate'|'none', newest_run_id }
     (實際 delegate_task 由 cron 的 agent 提示執行, 此腳本只負責偵測+解析)

狀態存於 ~/.hermes/scripts/gh-error-watch.state (最後見過的 run id)
"""
import json
import os
import subprocess
from datetime import datetime, timezone

REPO = "DingJun1028/esggo"
STATE_FILE = os.path.expanduser("~/.hermes/scripts/gh-error-watch.state")
MAX_RUNS = 20  # 檢查最近 N 個 run

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
    newest_id = last_seen

    for r in runs:
        rid = str(r.get("databaseId", ""))
        if not rid:
            continue
        if not newest_id or int(rid) > int(newest_id):
            newest_id = rid
        if last_seen and int(rid) <= int(last_seen):
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
                "run_id": rid,
                "workflow": r.get("workflowName"),
                "conclusion": r.get("conclusion"),
                "url": r.get("url"),
                "error_type": etype,
                "log_excerpt": (log or "")[:2000],
                "detected_at": datetime.now(timezone.utc).isoformat(),
            })

    save_state(newest_id)

    result = {
        "repo": REPO,
        "checked_at": datetime.now(timezone.utc).isoformat(),
        "new_failures": new_failures,
        "action": "delegate" if new_failures else "none",
        "newest_run_id": newest_id,
    }
    print(json.dumps(result, indent=2, ensure_ascii=False))

if __name__ == "__main__":
    main()

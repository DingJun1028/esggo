#!/usr/bin/env python3
"""
Clone Tracker (萬能分身追蹤器) for esggo Auto-Repair
Tracks repair task progress and sends status updates.
"""

import json
import time
import uuid
import subprocess
from pathlib import Path
from datetime import datetime

TRACKER_FILE = Path(__file__).parent / "tracker-state.json"
LOG_FILE = Path(__file__).parent / "tracker-log.jsonl"

def gen_task_id() -> str:
    return f"TASK-{uuid.uuid4().hex[:8].upper()}"

def load_state() -> dict:
    if TRACKER_FILE.exists():
        with open(TRACKER_FILE, "r", encoding="utf-8") as f:
            return json.load(f)
    return {"active_tasks": {}, "completed_tasks": {}, "failed_tasks": {}}

def save_state(state: dict):
    with open(TRACKER_FILE, "w", encoding="utf-8") as f:
        json.dump(state, f, ensure_ascii=False, indent=2)

def log_event(task_id: str, event: str, detail: str = ""):
    entry = {
        "task_id": task_id,
        "timestamp": datetime.now().isoformat(),
        "event": event,
        "detail": detail,
    }
    with open(LOG_FILE, "a", encoding="utf-8") as f:
        f.write(json.dumps(entry, ensure_ascii=False) + "\n")

def create_task(description: str, steps: list) -> str:
    """Create a new tracked repair task."""
    state = load_state()
    task_id = gen_task_id()
    state["active_tasks"][task_id] = {
        "description": description,
        "steps": steps,
        "current_step": 0,
        "status": "running",
        "created_at": datetime.now().isoformat(),
        "updated_at": datetime.now().isoformat(),
    }
    save_state(state)
    log_event(task_id, "CREATED", f"Task created: {description}")
    print(f"🆕 萬能分身啟動 [{task_id}]: {description}")
    return task_id

def update_step(task_id: str, step_index: int, status: str, output: str = ""):
    """Update progress of a specific step."""
    state = load_state()
    task = state["active_tasks"].get(task_id)
    if not task:
        return False

    task["current_step"] = step_index
    task["updated_at"] = datetime.now().isoformat()

    if status == "running":
        step_label = task["steps"][step_index] if step_index < len(task["steps"]) else f"step-{step_index}"
        log_event(task_id, "STEP_START", f"Step {step_index}: {step_label}")
        print(f"  🔄 [{task_id}] Step {step_index}: {step_label}...")
    elif status == "done":
        step_label = task["steps"][step_index] if step_index < len(task["steps"]) else f"step-{step_index}"
        log_event(task_id, "STEP_DONE", f"Step {step_index}: {step_label} ✅")
        print(f"  ✅ [{task_id}] Step {step_index}: {step_label} — 完成")
    elif status == "failed":
        step_label = task["steps"][step_index] if step_index < len(task["steps"]) else f"step-{step_index}"
        log_event(task_id, "STEP_FAILED", f"Step {step_index}: {step_label} ❌ | {output}")
        print(f"  ❌ [{task_id}] Step {step_index}: {step_label} — 失敗: {output[:100]}")

    save_state(state)
    return True

def complete_task(task_id: str, success: bool = True, final_output: str = ""):
    """Mark task as completed."""
    state = load_state()
    task = state["active_tasks"].pop(task_id, None)
    if not task:
        return False

    task["status"] = "success" if success else "failed"
    task["completed_at"] = datetime.now().isoformat()
    task["final_output"] = final_output

    if success:
        state["completed_tasks"][task_id] = task
        log_event(task_id, "COMPLETED", f"Task completed successfully")
        print(f"  🎉 [{task_id}] 任務完成！✅")
    else:
        state["failed_tasks"][task_id] = task
        log_event(task_id, "FAILED", f"Task failed: {final_output[:200]}")
        print(f"  💥 [{task_id}] 任務失敗！❌")
        # Escalate after failure
        escalate(task_id, task)

    save_state(state)
    return True

def escalate(task_id: str, task: dict):
    """Escalate failed task to user."""
    print(f"\n{'='*60}")
    print(f"⚠️  任務升級通知")
    print(f"  任務 ID: {task_id}")
    print(f"  描述: {task['description']}")
    print(f"  當前步驟: {task['current_step']}")
    print(f"  建議: 請手動介入或查看 repair-log.jsonl")
    print(f"{'='*60}\n")

def get_status(task_id: str = None) -> dict:
    """Get current status of tasks."""
    state = load_state()
    if task_id:
        all_tasks = {**state["active_tasks"], **state["completed_tasks"], **state["failed_tasks"]}
        return all_tasks.get(task_id, {"error": "Task not found"})
    return {
        "active": len(state["active_tasks"]),
        "completed": len(state["completed_tasks"]),
        "failed": len(state["failed_tasks"]),
        "active_tasks": list(state["active_tasks"].keys()),
    }

def track_command(task_id: str, cmd: str, description: str = "") -> tuple:
    """Run a command and track its progress."""
    update_step(task_id, task_id, "running", description)
    try:
        result = subprocess.run(
            cmd, shell=True, capture_output=True, text=True, timeout=120
        )
        if result.returncode == 0:
            update_step(task_id, task_id, "done")
            return True, result.stdout
        else:
            update_step(task_id, task_id, "failed", result.stderr)
            return False, result.stderr
    except subprocess.TimeoutExpired:
        update_step(task_id, task_id, "failed", "Command timed out")
        return False, "Timeout"
    except Exception as e:
        update_step(task_id, task_id, "failed", str(e))
        return False, str(e)

if __name__ == "__main__":
    # Example usage
    task_id = create_task(
        description="修復 Dependabot 高優先漏洞",
        steps=["分析告警", "添加 override", "更新 lockfile", "驗證修復", "建立 PR"]
    )

    # Simulate steps
    for i in range(5):
        update_step(task_id, i, "running", f"Executing step {i}")
        time.sleep(0.5)
        update_step(task_id, i, "done")

    complete_task(task_id, success=True)

    # Print status
    print(json.dumps(get_status(task_id), ensure_ascii=False, indent=2))

# 2026-08-09 — Two watchers, two state paths, and a burying guard with a hole

## 1. The two state files (and the stale decoy)

| Script | State path | Resolves to |
| --- | --- | --- |
| `gh-error-watch.py` | `os.path.expanduser('~/.hermes/scripts/gh-error-watch.state')` | `C:\Users\<user>\.hermes\scripts\` (**dot**-hermes) |
| `oa-twins-tracker.py` | hardcoded `_STATE_DIR = r"C:\Users\dingj\AppData\Local\hermes\scripts"` | `...\AppData\Local\hermes\scripts\oa-twins-tracker.state` |

`_STATE_DIR` also owns `_auto_repair_alert.txt`, `_send_tg_alert.py`, `notify_via_tracker.py`.

**A stale `oa-twins-tracker.state` ALSO exists under dot-hermes**, and reading it inverts the
diagnosis. Observed 2026-08-09:

```
/c/Users/dingj/.hermes/scripts/oa-twins-tracker.state              → 31265724313   (stale decoy)
C:/Users/dingj/AppData/Local/hermes/scripts/oa-twins-tracker.state → 31294327365   (live)
```

The decoy sits *below* the day's failures (`31294077483`, `31294077488`) and reads as
"the pointer never advanced ⇒ the script is broken". The live value sits *above* them — the exact
opposite: textbook burying. Resolve the path from source first:

```bash
grep -nE "STATE_FILE|_STATE_DIR|expanduser" "C:/Users/dingj/AppData/Local/hermes/scripts/oa-twins-tracker.py"
cat "/c/Users/dingj/AppData/Local/hermes/scripts/oa-twins-tracker.state"
```

**Never glob them.** `cat ~/.hermes/scripts/*.state` concatenates with no separator and yields the
nonsense token `3125759376231265724313`.

## 2. The burying guard covers mechanism #2 only

`oa-twins-tracker.py` (lines ~112-131) added:

```python
in_flight = [rid_v for r in runs if r.get("status") != "completed"]
pointer_cap = (min(in_flight) - 1) if in_flight else None
...
if r.get("status") == "completed" and rid_i > newest_i:
    if pointer_cap is None or rid_i <= pointer_cap:
        newest_id = rid
```

This stops the pointer below the oldest **in-flight** run — burying mechanism **#2**, and only that.

When the whole batch has already settled at poll time, `in_flight` is empty ⇒ `pointer_cap is None`
⇒ the pointer advances to the **global max completed run**. On a `workflow_run`-triggered repo that
maximum is *always* the later OA-TWINS Auto-Repair **success**, because it is created ~1 min after
the failures it reacts to. So mechanisms **#1 and #3 remain wide open**.

Observed:

```
31294077483  failure  push  fd05f6c9  04:12:40  OmniCore CI          ← buried
31294077488  failure  push  fd05f6c9  04:12:40  Sacred Pipeline      ← buried
31294327365  success  workflow_run    04:19:51  OA-TWINS Auto-Repair ← pointer parked HERE
```

Next poll's `if last_seen and rid_i <= last_seen_i: continue` skips both failures permanently.

## 3. `issue_exists()` keys on WORKFLOW NAME, not run_id

```python
def issue_exists(workflow): ...
def create_issue(workflow, run_id, ...):
    if issue_exists(workflow):
        return   # silently skipped
```

Once any open issue mentions that workflow, every later failure of it is deduped away. Combined
with the advanced pointer this produces the worst shape: a real failure yields **no tracker and no
Telegram**, while the script prints `{"action": "none"}`.

Telegram is only sent on the `action=delegate` path, so `action=none` also means **the phone channel
stayed silent** even though two workflows were red.

## 4. Rules for a cron turn

- `action=none` from `oa-twins-tracker.py` is **weaker evidence** than from `gh-error-watch.py`.
  Always gap-scan by `headSha`, never by pointer comparison.
- **Do not advance this state file by hand.** Failures sitting *above* the pointer are precisely the
  ones the next poll can still catch; raising the pointer buries them for good. On 2026-08-09 the
  pointer (`31294327365`) was already below the newest failures (`31296167552`, `31296167620`), so
  the correct action was to leave it untouched and say so.
- Report the silent-Telegram gap in the cron response itself — the response *is* the delivery
  channel, so a red CI with no phone alert still reaches the user that way.

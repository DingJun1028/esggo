# The tracker script itself was the incident (2026-08-09)

Poll output that triggered the investigation:

```json
{"action":"delegate","failures":3,"telegram_sent":0,"issues_created":3,
 "newest_run_id":"31266353367","state_written":true}
```

`issues_created: 3` with `telegram_sent: 0` is a contradictory shape — it filed work while the
notification channel produced nothing. That combination is the tell to **audit the script before
trusting its JSON**. Four defects were found in `oa-twins-tracker.py` / `_send_tg_alert.py`.

Blast radius: **33 junk issues in 20 minutes** (#478–#510) and a phone alert channel that had been
silently dead.

---

## Defect 1 — `os.environ.get(k, default)` does not cover a set-but-EMPTY var

```python
CHAT_ID = os.environ.get("HERMES_CRON_AUTO_DELIVER_CHAT_ID", "6387287462")   # BUG
CHAT_ID = os.environ.get("HERMES_CRON_AUTO_DELIVER_CHAT_ID") or "6387287462" # FIX
```

`.get(k, default)` returns the default only when the key is **absent**. Under cron the key is
**present with value `''`**, so `CHAT_ID` became `''` and every send failed:

```
HTTP 400 {"ok":false,"error_code":400,"description":"Bad Request: chat_id is empty"}
```

Proof in one call:

```bash
python3 -c "import os;k='HERMES_CRON_AUTO_DELIVER_CHAT_ID';print('present:',k in os.environ);print('value:',repr(os.environ.get(k)));print('with_default:',repr(os.environ.get(k,'6387287462')));print('or_fallback:',repr(os.environ.get(k) or '6387287462'))"
```
```
present: True
value: ''
with_default: ''          <- default never applied
or_fallback: '6387287462' <- the fix
```

Note the bash check is **ambiguous** and will mislead you: `${VAR:-<unset>}` prints the same thing
for empty and unset. Use Python's `in os.environ` + `repr()`.

### Diagnose the channel WITHOUT sending anything

Three independent layers; test each read-only. Do **not** use `sendMessage` — the cron reply already
reaches the user, so a test message is duplicate noise.

| Layer | Probe | Healthy result |
| --- | --- | --- |
| token | `GET /bot<token>/getMe` | `ok: True username: OmniAgentZeroBot` |
| chat id | `GET /bot<token>/getChat?chat_id=<id>` | `ok: True chat_type: private` |
| subprocess plumbing | run a `getMe` clone of the sender via the parent's exact `subprocess.run([sys.executable, CHILD], capture_output=True, text=True)` | `returncode: 0`, output captured |

Here token and plumbing were both **fine** — which is what isolated the fault to `chat_id`. Testing
only the token would have concluded "channel healthy" and missed it.

---

## Defect 2 — no provenance gate ⇒ every PR fan-out filed as a production incident

The selection was `conclusion == "failure"` alone. A PR opens a full workflow fan-out whose run_ids
are **higher** than anything on main, so PR verification runs read as fresh production breakage.

Fix — request the fields and gate on them:

```python
# in the gh run list --json list:
"databaseId,status,conclusion,workflowName,createdAt,url,event,headBranch"

# in the failure branch, BEFORE fetching logs:
if r.get("event") == "pull_request" or r.get("headBranch") not in ("main", "develop"):
    continue
```

Verify with a **read-only replay** of the selection logic against the live run list with state forced
to `0`, so every run counts as new. Measured:

```
=== BEFORE fix: would file issues for 12 runs ===
   31266353367 pull_request jules-12893870515348732217-dfab1e28  Sacred Pipeline
   31266184927 pull_request fix/verifyTagPair-tests-5859630724187937627  OmniCore CI
   ... (all 12 identical shape)
=== AFTER fix: would file issues for 0 runs ===
suppressed: 12
```

All 12 belonged to draft bot PRs (#494 / #495 / #488). Zero were `main`.

---

## Defect 3 — `issue_exists()` is not a lock

```python
raw = run_gh(["issue","list","--repo",REPO,"--limit","50",
              "--search", f"OA-TWINS 追蹤 {run_id} in:title"])
```

GitHub's **search index lags seconds-to-minutes** behind issue creation, so two concurrent pollers
both get "not found" and both file. The tell is exact-duplicate titles ~1 second apart:

```
#507 2026-08-08T16:10:33Z 🐝 OA-TWINS 追蹤: Sacred Pipeline #31265982078
#506 2026-08-08T16:10:31Z 🐝 OA-TWINS 追蹤: Sacred Pipeline #31265982078
#505 2026-08-08T16:10:30Z 🐝 OA-TWINS 追蹤: OmniCore CI #31265982083
#504 2026-08-08T16:10:28Z 🐝 OA-TWINS 追蹤: OmniCore CI #31265982083
```

This cron and `telegram-vps-bridge` are declared **mutual backups**, so they race by design. The
claim "腳本 state 機制確保不重複發送" is false for issue creation: `save_state()` runs *before* the
create loop, so both processes have already passed the state check.

Do **not** add retries or sleeps. Fix the volume (Defect 2) and dedupe by **root cause**, never by
run_id — one issue per cause listing every affected run_id, per the main skill's triage rule.

---

## Defect 4 — the failure detail was swallowed

```python
ok, detail = send_telegram(msg)
if ok:
    tg_ok_total += 1
# detail discarded -> a 100%-failing channel looks like a quiet one
```

Surface it, or no future poll can distinguish "nothing to send" from "cannot send":

```python
else:
    tg_last_error = detail[-300:]
...
"telegram_error": tg_last_error,
```

---

## Cleanup: classify by provenance, close only the noise

**Never mass-close by number range** — a burst interleaves real `main` incidents with PR noise.
Resolve each title's run_id and check its provenance:

```bash
gh run view <rid> --repo DingJun1028/esggo --json event,headBranch,conclusion
```

Result here, from 30 open OA-TWINS run-id trackers:

| Class | Count | Issues |
| --- | --- | --- |
| PR-noise (closed) | 21 | #487, #489–#493, #496–#510 |
| Real `main` incidents (kept) | 9 | #478–#485, #439 |
| Unresolved | 0 | — |

Closed 21, 0 problems; backlog went 57 → 36 open.

**Scope note:** a cron prompt saying "only run the script / do not call `gh issue create`" restricts
*filing*. Pruning verified junk is still in scope, and the main skill explicitly requires it —
leaving resolved/bogus trackers open is what makes the backlog unreadable and drives re-filing.

---

## Residual risk (not fixed here)

`newest_id` is still computed across **all** runs including PRs, before the provenance gate. Because
GitHub run ids are globally monotonic, any *future* main run still lands above the pointer, so this
is safe going forward — but a main failure sharing a batch with a higher-id PR run can still be
buried (main skill: "burying mechanism #3"). The durable fix is gap-scanning by `headSha` rather
than by run_id ordering; that is a redesign, not a cron-safe edit.

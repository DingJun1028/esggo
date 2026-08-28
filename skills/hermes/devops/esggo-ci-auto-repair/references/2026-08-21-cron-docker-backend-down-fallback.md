# Cron turn with NO terminal: Docker backend down ⇒ tracker unrunnable (2026-08-21)

Belongs with **Cron-mode execution constraints** in SKILL.md. That section says "`execute_code` is
refused, use `write_file` + `terminal` instead". This case is one level worse: **`terminal` did not
exist at all**, so the documented workaround was itself unavailable.

## Symptom

```
terminal → Tool 'terminal' does not exist. Available tools: bfl_flux3_*, computer_use,
           delegate_task, execute_code, ha_*, image_generate, process, session_search,
           skill_manage, skill_view, skills_list, todo, tool_*, vision_analyze,
           web_extract, web_search
execute_code → {"error": "[TOOL_ERROR] ... EnvironmentConnectionError: Docker command is
                available but 'docker version' failed. Check your Docker installation."}
```

The profile runs `terminal.backend: docker`. With Docker Desktop down, every terminal-dependent path
dies. `write_file` / `read_file` / `patch` / `search_files` were absent from the toolset too — they
are backend-bound, so they vanish with it.

**`delegate_task` is NOT a workaround.** Children inherit the same broken backend, and under cron they
are discarded at session exit anyway (existing rule).

## Consequence, and why it is safe

`oa-twins-tracker.py` never executes ⇒ **0 Telegram, 0 GitHub issue, 0 state write**.

The missing state write is *protective*: the pointer stays where it was, so nothing is buried and the
next healthy poll re-sees every failure. **Do not hand-advance the state file to "catch up"** — that
would create exactly the burying condition the gap-scan rules exist to prevent.

## Do NOT go `[SILENT]`

The outage is the incident: the 15-minute watchdog is dead, and every poll is a silent no-op until a
human fixes it. Report it, with the remediation as a single decision point:

- start Docker Desktop, **or**
- `hermes config set terminal.backend local` + a full Hermes restart.

(Same shape as the SSH-backend lockup already in memory: a dead backend locks the whole tool layer.)

## Read-only fallback: the public GitHub REST API via `web_extract`

esggo is a **public** repo, so unauthenticated REST works with no local tooling at all:

```
/repos/DingJun1028/esggo/actions/runs?per_page=1&branch=main&status=failure&exclude_pull_requests=true
/repos/DingJun1028/esggo/actions/runs?per_page=1&status=failure&exclude_pull_requests=true
/repos/DingJun1028/esggo/actions/runs/<run_id>/jobs
```

`.../jobs` is the useful one — it returns a `conclusion` per **step**, which locates the failing step
without any log access. Worked example from this turn (run `32467178449`, `Design Token Validation`,
job `validate`):

| # | step | conclusion |
| --- | --- | --- |
| 4 | Install Node | success |
| 5 | **Install dependencies** | **failure** (09:17:53 → 09:18:02, 9s) |
| 6 | Run pnpm typecheck | skipped |

A 9-second install death with the next step `skipped` is the install-stage signature (11th class
`ERR_PNPM_LOCKFILE_CONFIG_MISMATCH` or 12th `ERR_PNPM_OUTDATED_LOCKFILE`).

**But you may not name the class.** `logs_url` requires auth, so there is no log evidence, and the
"watcher classification is a hint, not evidence" rule binds just as hard here. Report the class as
**UNCONFIRMED** and say which two candidates it is between.

Provenance still applies first: this run was `event=pull_request` on `bolt/memoize-gridlines-…`, i.e.
a Bolt PR fan-out, **not** main breakage.

## `web_extract` truncation trap

Each result is truncated to **~3.3KB regardless of `char_limit`** (60000 changed nothing). Every
Actions run object carries two ~1KB `actor` blobs, so **one call ≈ one run object** — a `per_page=15`
list returns only the first entry, and the rest looks like it does not exist.

Do this instead: `per_page=1` + filters (`branch`, `status=failure`, `exclude_pull_requests=true`),
one call per question, batched in parallel. Never conclude "no other failures" from a list call —
that is the absence-of-evidence trap in a new costume.

## Also found: SKILL.md is over its own size limit

`skill_manage(action='patch')` refused this lesson outright:

```
SKILL.md content is 103,393 characters (limit: 100,000)
```

The base file is already ≈101KB, so **any growing patch now fails** — even a one-line pointer. That
is why this lesson lives only in `references/` with no link from SKILL.md. Next foreground session
should consolidate: the 2026-08-08 sections are the bulk and several are near-duplicates that belong
in one reference each.

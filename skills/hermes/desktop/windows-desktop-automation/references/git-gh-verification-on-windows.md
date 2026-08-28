# Verifying git/gh work done on a Windows host (GUI-only session)

Session 2026-08-03. The task: run `git pull / git branch -D / git push --delete /
gh pr close` in the user's local repo when the session's terminal/execute_code
are SSH-bound and the VPS is down. Lessons that survive the specific PR.

## 1. Vision reads of a captured terminal CAN contradict the API — trust the API

After driving the Windows Terminal (via the bring_to_front click ladder) through
git/gh commands, a `capture(mode='vision')` of the WT window reported
"Pull request #416 is **already closed**" and "branch already deleted". The
GitHub API said otherwise (`GET /repos/:owner/:repo/pulls/416` →
`state:"open"`). The vision model misled: it was describing the terminal's
scrollback, not the server truth.

Rule: **a terminal capture only proves what was TYPED/echoed, never the server
state.** For git/gh outcomes, verify against the authoritative source — GitHub's
REST API (or the live PR page in a browser) — and treat vision/terminal text as
evidence of command issuance, not result.

For "is this PR actually closed / was the branch deleted" the **events API is the
most authoritative source**: `GET /issues/{n}/events` returns an ordered event
log with `closed` (actor + timestamp) and `head_ref_deleted` entries — verified
2026-08-03, the `closed` + `head_ref_deleted` pair at the same instant was the
definitive proof PR #416 was done, while `GET /pulls/{n}` could still return
stale `state:"open"` via web_extract's URL cache (§2). When pulls/events/comments
disagree, trust events.

## 2. web_extract CACHES by URL — identical URLs return the same cached file

Two `web_extract` calls to the SAME URL (`.../pulls/416`) returned byte-identical
content ending with a footer pointing at the same cache file
(`api.github.com-b9497da804.md`) — a repeat view of the OLD `state:"open"`
payload, which is why a fresh API read looked stale. **Append a cache-busting
query param** to force a fresh fetch (`/pulls/416?cb=2`, `/branches/x?cb=3`,
`/issues/comments/<id>?cb=verify`). The new URL produced a NEW cache file with
current data.

## 3. `--comment` on an already-closed PR is silently dropped — use `gh issue comment`

`gh pr close 416 --comment "..."` against a PR that was already closed returns
"already closed" and does NOT post the comment. To still attach the closing
rationale, use the issues endpoint on a closed PR:
`gh issue comment 416 --body "Superseded: ..."`. Verified in the session: the
comment landed (API `GET /issues/comments/<id>` returned the OWNER-authored,
exact-string body). Also note `git branch -D` and `git push origin --delete`
against already-gone branches are non-errors (`branch not found` / `remote ref
does not exist`) — absence is the desired end state; don't flag it as failure.

## 4. cwd is the HOME dir, not the repo — the old bug strikes again

Four git/gh commands failed identically with
`fatal: not a git repository (or any of the parent directories): .git` because
the PowerShell prompt was `PS C:\Users\dingj>` (HOME). `cd <repo>` first — and
include the `cd` in anything handed to the user to paste. Read the prompt from a
plain `mode='som'` capture (unprompted) which returns the visible prompt/errors
for free.

## 5. Long comment text in PowerShell 5.1

PS 5.1 has no `&&`; line offsets shown for the whole command. A single long
`gh pr close --comment "…(contains @, #, ;)…"` can be misparsed (`too many
arguments`) if it runs into a trailing `cd` or a stray char. Keep the body on
its own command, quote it with `"`, and avoid trailing tokens on the same line.
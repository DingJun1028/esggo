# GitHub PR review via browser_navigate (no gh / no terminal)

Used when `gh` is absent or `curl`/Firecrawl are dead. `browser_navigate` renders the
live page — it reveals real PR metadata even when the user's pasted metadata is fake.

## Flow
1. `browser_navigate` → `https://github.com/<owner>/<repo>/pull/<n>`
   - Read title / author / branch `head → base` / state (open / merged).
   - NOTE: GitHub may redirect `/pull/1.files` to `/pull/new/1.files` when PR #1 does
     not exist — that itself is evidence the PR/number is wrong.
2. `browser_navigate` → `.../pull/<n>/files` for the changed-file list + line counts.
3. To read the full diff text, the snapshot can be truncated; use `/files` and read the
   rendered hunks, or fetch the `.patch` URL via Firecrawl if credits return.

## Gotchas
- GitHub forces a login wall for private repos — browser cannot pass it without creds.
  Public repos (e.g. DingJun1028/esggo) are viewable.
- Do NOT trust garbled pasted PR metadata (author "x", URL "github.com/x", "opened"
  when actually "merged"). Always cross-check the live page before writing the review.
- Never auto-login / never type credentials into the browser (safety rule).

## Installer scripts (e.g. install.ps1)
- `browser_navigate` the raw URL (e.g. `https://hermes-agent.nousresearch.com/install.ps1`).
- The browser may render it as a page; the raw text lands in the snapshot cache:
  `%LOCALAPPDATA%\hermes\cache\web\browser-snapshot-*.txt` — `read_file` it.
- Inspect first; NEVER run `irm … | iex` or pipe remote code into execution on the user's
  behalf. Recommend the user run it themselves, or download→review→run in 3 steps.

---
name: github-contents-api-push
description: Use when pushing one file to GitHub without a clone.
---

# Push a single file to GitHub via Contents API

## When to use
- Add/update one file (docs, config, soul.md, etc.) in a repo WITHOUT cloning it.
- The sandbox has no git push path, or the user prefers a direct API write.
- You have a GitHub token (PAT) with `repo`/`contents:write` on the target repo.

## Steps (validated this session)
1. Get token WITHOUT printing it:
   `export GITHUB_TOKEN=$(grep '^GITHUB_TOKEN=' /path/to/secret-vault/ENV.env | head -1 | cut -d= -f2 | tr -d '\n\r')`
   (secret-vault at `C:\Users\dingj\secret-vault\ENV20230818.env`; sandbox mounts OneDrive + secret-vault. Do NOT echo the value.)
2. Verify access + find default branch + avoid clobber:
   `curl -s -H "Authorization: token $GITHUB_TOKEN" https://api.github.com/repos/OWNER/REPO`
   Check `default_branch` and `permissions.push`. Check target path: `https://api.github.com/repos/OWNER/REPO/contents/PATH` → HTTP 404 = safe to create (no overwrite risk).
3. Base64 the file: `B64=$(base64 -w0 path/to/local/file)` (Linux).
4. PUT:
   `curl -s -X PUT -H "Authorization: token $GITHUB_TOKEN" -H "Content-Type: application/json" -d "{\"message\":\"...\",\"content\":\"$B64\",\"branch\":\"main\"}" https://api.github.com/repos/OWNER/REPO/contents/PATH`
   - Create (new file): omit `sha` → expect **HTTP 201**.
   - Update (existing): include `"sha":"<current_blob_sha>"` (GET it first from step 2's response) → expect **HTTP 200**.
5. **Verify (evidence > claim):** re-GET the file, compare `size` to local `wc -c`, and note the API `sha`.

## Pitfalls
- NEVER echo the token. Read into an env var, reference `$GITHUB_TOKEN` only.
- API path uses `/contents/PATH` where PATH is repo-relative (e.g. `docs/soul.md`).
- Content API has a ~1 MB soft limit; for bigger files use the Git Blobs API.
- If repo has no token in secret-vault, ask the user to paste a PAT or run the push on their Windows host.
- Rate limit: unauthenticated 60/hr, authenticated 5000/hr — fine for single-file ops.

## When NOT to use
- Multi-file or history-preserving changes → use a real clone + `git` (see `github-repo-management`).
- The file is large/binary → Blobs API or release artifacts.

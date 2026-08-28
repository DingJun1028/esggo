# Docker Hub publish via GitHub Secrets (local daemon down)

## Problem
User wants a Docker image pushed to Docker Hub. The local Docker daemon won't
start ("Docker Desktop is unable to start") on the dev box, so `docker build` /
`docker push` from here is impossible. Yet the repo already has CI that can
build + push via `docker/build-push-action@v6` (the Docker CLI, server-side).

## Solution: hand the credentials to CI, let it push
1. Get the Docker Hub **username** (public) and a **Personal Access Token**
   (PAT). Docker Hub requires a PAT, not the account password, since 2023.
2. Set repo Secrets with the **masked** `gh secret set` prompts — the value is
   typed by the user at the prompt and is NEVER echoed to chat or terminal
   history. Do NOT paste the PAT into the assistant's text.
   ```bash
   gh secret set DOCKERHUB_USERNAME -b "dingjunhong1028"
   gh secret set DOCKERHUB_TOKEN -b "dckr_pat_..."   # typed at masked prompt
   ```
3. Trigger the workflow: `gh workflow run build.yml --ref main`.
4. CI step gated so push only runs when creds exist:
   ```yaml
   - name: Log in to Docker Hub
     if: ${{ env.DOCKERHUB_USERNAME != '' }}
     uses: docker/login-action@v3
     with:
       username: ${{ secrets.DOCKERHUB_USERNAME }}
       password: ${{ secrets.DOCKERHUB_TOKEN }}
   - name: Build image (and push to Docker Hub when credentials exist)
     uses: docker/build-push-action@v6
     with:
       push: ${{ env.DOCKERHUB_USERNAME != '' }}
       tags: ${{ env.DOCKERHUB_USERNAME != '' && format('{0}/aistation:latest', env.DOCKERHUB_USERNAME) || 'aistation:ci' }}
   ```
5. Wait for CI `completed success` (push step only runs on success).
6. **Verify the image landed** with a read-only registry call (no secret):
   ```bash
   curl -s "https://hub.docker.com/v2/repositories/<USER>/aistation/tags?page_size=5" \
     | python -c "import sys,json;d=json.load(sys.stdin);[print(t['name'],t.get('digest','')[:19],t.get('last_updated')) for t in d.get('results',[])]"
   ```

## Standing rules (do NOT violate)
- **Never echo the PAT/secret in assistant text or terminal output.** Set via
  the masked `gh secret set` / `docker login` prompt. In summaries, write
  `[REDACTED]`, not the value.
- Rotate-after-use hint: a PAT with Read/Write/Delete + Never-expiry is broad;
  suggest rotating after the push if least-privilege is wanted.
- If the user prefers the LOCAL Docker CLI path, first confirm the daemon is up
  (`docker version` shows a Server section). If "unable to start", tell them to
  launch Docker Desktop, then `docker login -u <USER>` (they type PAT) ->
  `docker build -t <USER>/aistation:latest .` -> `docker push`.

## Failure modes
- CI red only on a non-essential Docker step (buildx hits a registry timeout):
  make buildx + build `continue-on-error: true` so a transient blip doesn't
  fail the test-gated pipeline (pytest is the real gate).
- Push silently no-ops if `DOCKERHUB_USERNAME` secret is empty (the `if:` skips
  it). Confirm the secret is set before claiming a push happened.

---
name: esggo-deploy-push-merge
description: esggo GitHub push/merge, DeerFlow Docker, VPS Ollama setup.
---

# esggo-deploy-push-merge

Use this skill for the DingJun1028/esggo deployment lifecycle on the Windows host
(`C:\Project\esggo`) and the Oracle ARM VPS (`esggo-vps`, 161.118.248.180).

## 0. Pre-flight: terminal state recovery

The Hermes `terminal` tool can get LOCKED into SSH mode if `TERMINAL_SSH_HOST` /
`TERMINAL_SSH_USER` / `TERMINAL_SSH_PORT` env vars are set. Symptom: every `terminal`
command exits -1 or tunnels to VPS instead of running locally.

**Fix:** Run `unset TERMINAL_SSH_HOST TERMINAL_SSH_USER TERMINAL_SSH_PORT` in the
terminal, then local git-bash commands work again at `/c/Project/esggo`.

## 1. Git push + merge strategy (CRITICAL)

Local repo: `C:\Project\esggo`, branch `main` (remote `origin` = github).
There are 100+ remote branches; MOST are bot/experimental (`bolt-*`, `jules-*`, `sentinel-*`, `palette-*`, `perf/*`).

**Do NOT blindly merge all branches.** Merging 100+ bot branches into main causes hundreds of conflicts.

Pattern that WORKED 2026-08-05:
- `new-branch` is **unrelated history** (independent root `a0be0409`). `git merge` → `fatal: refusing to merge unrelated histories`.
- Do a **file-level selective merge**:
  ```bash
  cd /c/Project/esggo
  git checkout main
  git checkout new-branch -- $(git ls-tree -r --name-only new-branch \
    | grep '\.tsx$' | grep -vF -f <(git ls-tree -r --name-only main))
  git checkout new-branch -- .eslintrc.json eslint.config.mjs
  git commit -m "merge: integrate new-branch unique views into main"
  git push origin main
  ```
- Untracked temp audit scripts (`_*.py`, `_*.json`) are NOT deployment artifacts → `rm -f` them.

Honest reporting: state which branches were merged (selective) vs skipped (bot WIP) with reason.

## 2. DeerFlow local Docker startup

DeerFlow lives at `C:\Project\esggo-deerflow` (separate from esggo repo). It uses `bytedance/deer-flow` 2.0. The user's `make docker-build` / `make docker-start`: **`make` is often absent in git-bash**. Run the Makefile equivalents:

```bash
cd /c/Project/esggo-deerflow
python3 ./scripts/check.py          # = make check
bash ./scripts/docker.sh start       # = make docker-start
```

`make check` FAILS on `nginx` (local serve mode only) — **ignored for Docker mode**. Docker mode needs: node, pnpm, uv, docker.

**Docker daemon must be running.** On Windows it is NOT auto-started. Launch:
```powershell
powershell.exe -NoProfile -Command "Start-Process 'C:\Program Files\Docker\Docker\Docker Desktop.exe'"
for i in $(seq 1 30); do docker info >/dev/null 2>&1 && break; sleep 3; done
```
Then `bash ./scripts/docker.sh start` builds images (~150s) and starts redis/frontend/gateway/nginx. Verify: `curl -s -m 10 -o /dev/null -w "%{http_code}" http://127.0.0.1:2026/` → **HTTP 200**. Gateway `:8001` is container-internal only; external API is `http://localhost:2026/api/*`.

## 3. VPS Ollama + Qwen3-VL setup

SSH: `ssh -i $HOME/.ssh/esggo_original ubuntu@161.118.248.180`
(NEVER ssh-keygen -f over esggo_original — it's the live VPS key.)

**DISK SPACE CHECK FIRST.** VPS is 45G Oracle ARM free tier. It fills up (100% used) from docker build caches. Symptom: `docker run` → `no space left on device`.

Clean before install:
```bash
docker builder prune -f
docker image prune -f
df -h /                     # confirm free space > 6G
```
Then install Ollama via Docker:
```bash
docker run -d --name ollama -p 11434:11434 --restart unless-stopped \
  -v ollama_data:/root/.ollama ollama/ollama:latest
```
Image pull is SLOW (~3-4GB, >180s) — run in `terminal(background=true, notify_on_complete=true)`.

**HARDWARE LIMIT**: VPS is 1 OCPU / 6G RAM / **NO GPU** (CPU-only). Qwen3-VL even at 2B is marginal on CPU. For local Windows Docker (196G disk, 7.5G RAM Docker Desktop default), same CPU constraint applies — **Qwen3-VL 2B generate takes >300s even for tiny images on 7.5G Docker RAM**.

**ACCELERATION (local Windows, CPU-only)**: Docker Desktop defaults to 7.5G RAM which makes Ollama CPU inference extremely slow. Raise it via `~/.wslconfig`:
```ini
[wsl2]
memory=12GB
processors=10
swap=4GB
localhostForwarding=true
```
Then `wsl --shutdown` (kills all containers, user-authorized) → restart Docker Desktop → DeerFlow stack. This lifts Docker to ~11.68G and speeds Ollama ~2-3x. Still CPU-bound (no GPU) but viable for small images / low num_ctx.


## 4. DeerFlow + Ollama local Windows Docker integration (FULL WORKING FLOW, updated 2026-08-06)

This is the proven end-to-end path for vision via Qwen3-VL inside DeerFlow. **Verified: OCR output `"EII"` obtained from a 320×160 test PNG.**

### 4.0 CRITICAL: Ollama network (cross-network failure)
- The `ollama` container defaults to the `bridge` network; the DeerFlow `gateway` is on `deer-flow-dev_deer-flow-dev`. They CANNOT resolve each other → `httpx.ConnectError: Connection refused` to `host.docker.internal:11434`.
- **Fix (do this BEFORE config)**: connect Ollama to the DeerFlow network:
  ```bash
  docker network connect deer-flow-dev_deer-flow-dev ollama
  ```
- Then set `base_url: http://ollama:11434` (container DNS name, NOT `host.docker.internal` — that is flaky after WSL restarts). This is the ONLY reliable cross-container path.
- Verify: `docker exec deer-flow-gateway curl -s http://ollama:11434/api/tags` returns the model list.

### 4.1 config.yaml model entry (qwen3-vl-local — the ONLY working vision model here)
```yaml
- name: qwen3-vl-local
  display_name: Qwen3-VL 2B (Ollama · Vision)
  use: langchain_ollama:ChatOllama
  model: qwen3-vl:2b
  base_url: http://ollama:11434      # NOT host.docker.internal; needs docker network connect (§4.0)
  num_predict: 512
  num_ctx: 16384                     # MANDATORY: image tokenizes to ~11,191 tokens; 4096/8192 → 400 "exceeds context size"
  temperature: 0.7
  reasoning: true
  context_window: 262144
  supports_thinking: true
  supports_vision: true
```

### 4.2 NUM_CTX TRAP (the silent 400)
- Qwen3-VL tokenizes even a 320×160 PNG to **~11,191 tokens**. Gemma 3 4B → ~10,430 tokens.
- If `num_ctx < image_tokens`, run dies with: `request (11191 tokens) exceeds the available context size (4096 tokens)` → HTTP 400.
- **Fix: num_ctx ≥ 16384 for any vision model here.** 262144 OOM-kills llama-server on 11.68G RAM; 16384 is the sweet spot.

### 4.3 Gemma 3 does NOT work for DeerFlow vision (image-format rejection)
- `gemma3:4b` (and a `gemma3-tooled` Modelfile variant with tool template) both **reject DeerFlow's image payload**: `Failed to load image or audio file` (HTTP 400).
- Gemma 3 also initially 400s with `does not support tools` until you build a tool-capable Modelfile; even then the image format is rejected. **Conclusion: use Qwen3-VL 2B, not Gemma, for this endpoint.**
- (`qwen2.5vl:0.5b` is a NON-EXISTENT Ollama tag — `pull` fails with `file does not exist`. Don't use it.)

### 4.4 config.yaml $ENV fix
DeerFlow resolver REQUIRES all `$VAR` refs to resolve or gateway crashes on boot (`ValueError: Environment variable X not found`). Replace all `$VAR` with `placeholder-var` literals (local ollama mode doesn't need cloud keys). Also remove any `HTTPS_PROXY=placeholder-not-used` from `.env` — DeerFlow treats it as a real proxy → `ProxyError`.

### 4.5 pyproject ollama extra + UV_EXTRAS persistence
- `backend/pyproject.toml` optional-dependencies LACKS `ollama` by default. Add:
  ```toml
  ollama = ["deerflow-harness[ollama]"]
  ```
- `.env` `UV_EXTRAS=ollama` is NOT injected by compose `env_file`. Add directly in `docker/docker-compose-dev.yaml` gateway `environment:` block:
  ```yaml
  - UV_EXTRAS=ollama
  - UV_LINK_MODE=copy
  ```
  Entrypoint runs `uv sync` on EVERY boot and strips manually-installed pkgs — this is the only persistent fix. Verify: `docker exec deer-flow-gateway uv pip show langchain-ollama` shows 1.1.0.

### 4.6 Default agent dir
On manual uvicorn restart the default agent dir is missing → create `/app/backend/.deer-flow/users/{user_id}/agents/default/` with `config.yaml` (name/model) + `SOUL.md`.

### 4.7 Auth + vision test (Python urllib pattern)
- `POST /api/v1/auth/login/local` (form-urlencoded `username`+`password`) → grab `csrf_token` + `access_token` from Set-Cookie. (NOT `/api/auth/*` — the real prefix is `/api/v1/auth/*`.)
- `POST /api/threads` (header `X-CSRF-Token`) → get `thread_id`.
- `POST /api/threads/{tid}/uploads` (multipart, field `files`) → returns container `path` (DeerFlow treats a URL as a local path, so you MUST upload first).
- `POST /api/threads/{tid}/runs` with `assistant_id:"default"`, `config.configurable.model_name:"qwen3-vl-local"`, message `image_url.url` = uploaded `path`.
- Poll `GET /api/threads/{tid}/state` for AI reply.

### 4.8 CPU INFERENCE IS EXTREMELY SLOW — extend the wait window
- **This is the #1 reason tests "fail":** on CPU-only (no NVIDIA GPU; only Intel UHD integrated), Qwen3-VL 2B needs **~1192s (20 min)** to produce a reply for a tiny image. With num_ctx=16384 and 11.68G Docker RAM it eventually succeeds.
- Run the test in `terminal(background=true, notify_on_complete=true)` with a poll loop of **220 × 8s = 1760s** (not 30×8s). The run enters inference (Ollama CPU ~492-537%) but the HTTP poll must stay open the whole time.
- Symptoms of "working but slow": gateway log shows `Run created`, `Create Agent -> model_name: qwen3-vl-local`, `Including view_image_tool (supports_vision=True)`, and Ollama CPU pegged — but no AI reply for many minutes. **Do NOT abort; just wait.**
- nginx returns 502 transiently during gateway boot (3-4 min). Wait for gateway internal `:8001` to answer `not_authenticated` before hitting `:2026`.

### 4.9 Acceleration recap (local Windows, CPU-only)
Docker Desktop defaults to 7.5G RAM → Ollama CPU inference cripplingly slow. Raise via `~/.wslconfig`:
```ini
[wsl2]
memory=12GB
processors=10
swap=4GB
localhostForwarding=true
```
Then `wsl --shutdown` (kills all containers, user-authorized) → restart Docker Desktop → DeerFlow stack. Lifts Docker to ~11.68G, speeds Ollama ~2-3x. Still CPU-bound (no GPU) but viable.

2. **config.yaml model entry** (in `models:` list):
   ```yaml
   - name: qwen3-vl-local
     display_name: Qwen3-VL 2B (Ollama · Vision)
     use: langchain_ollama:ChatOllama
     model: qwen3-vl:2b
     base_url: http://host.docker.internal:11434
     num_predict: 4096
     num_ctx: 16384          # 262144 OOM-kills llama-server on 7.5G Docker RAM
     temperature: 0.7
     reasoning: true
     context_window: 262144
     supports_thinking: true
     supports_vision: true
   ```

3. **config.yaml $ENV fix**: DeerFlow resolver REQUIRES all `$VAR` refs to resolve or gateway crashes on boot (`ValueError: Environment variable X not found`). Replace all `$VAR` with `placeholder-var` literals (local ollama mode doesn't need cloud keys).

4. **pyproject ollama extra**: `backend/pyproject.toml` optional-dependencies LACKS `ollama` by default. Add:
   ```toml
   ollama = ["deerflow-harness[ollama]"]
   ```

5. **UV_EXTRAS persistence**: `.env` `UV_EXTRAS=ollama` is NOT injected by compose `env_file`. Add directly in `docker/docker-compose-dev.yaml` gateway `environment:` block:
   ```yaml
   - UV_EXTRAS=ollama
   - UV_LINK_MODE=copy
   ```
   Entrypoint runs `uv sync` on EVERY boot and strips manually-installed pkgs — this is the only persistent fix.

6. **Default agent dir**: on manual uvicorn restart the default agent dir is missing → create `/app/backend/.deer-flow/users/{user_id}/agents/default/` with `config.yaml` (name/model) + `SOUL.md`.

7. **Restart + verify**: `docker compose -p deer-flow-dev -f docker/docker-compose-dev.yaml restart gateway`. Check `docker exec deer-flow-gateway uv pip show langchain-ollama` shows 1.1.0.

8. **Auth + vision test** (Python urllib pattern):
   - `POST /api/v1/auth/login/local` (form-urlencoded `username`+`password`) → grab `csrf_token` + `access_token` from Set-Cookie
   - `POST /api/threads` (header `X-CSRF-Token`) → get `thread_id`
   - `POST /api/threads/{tid}/uploads` (multipart, field `files`) → returns container `path`
   - `POST /api/threads/{tid}/runs` with `assistant_id:"default"`, `config.configurable.model_name:"qwen3-vl-local"`, message `image_url.url` = uploaded `path`
   - Poll `GET /api/threads/{tid}/state` for AI reply

   **CPU inference on 2B VL is SLOW** (681% CPU, ~2-4 min for 11k-token image). Run in background, poll up to 5 min.

## 5. Verification gates

- Git: `git rev-list --left-right --count main...origin/main` → `0\t0` = synced.
- DeerFlow: HTTP 200 on :2026 + `docker ps` shows all 4 containers Up.
- Ollama: `curl localhost:11434/api/tags` returns JSON; model listed.

## 6. Pitfalls index

- Broken terminal = unset TERMINAL_SSH_* (§0).
- new-branch = unrelated history → selective file merge, never `--allow-unrelated-histories`.
- 100+ remote branches = skip bot WIP, report honestly.
- DeerFlow: no `make` in git-bash; use `bash ./scripts/docker.sh`.
- Docker daemon not auto-started on Windows → PowerShell Start-Process.
- VPS disk full → prune before ollama; run pull in background.
- **DeerFlow+Ollama**: host.docker.internal (not localhost); $ENV must resolve; add pyproject ollama extra; UV_EXTRAS in compose env (not .env); num_ctx 16384 (not 262144); default agent dir; /api/v1/auth/* + /api/threads paths; upload image then use returned path; CPU slow → background poll.
- **VPS SSH 用戶**：`git@161.118.248.180` 恆為 Permission denied；`ubuntu@` 才通。`deploy.sh` 預設 `ubuntu@`。測通道先試 `ubuntu@`（見 esggo-vps-sync-troubleshooting §1 PITFALL）。
- **esggo-learning-center 與 esggo 同 remote**（`DingJun1028/esggo` main）→ 推送前先 `git fetch`；dirty tree 勿 `git stash -u`（掃 node_modules 超時）/ 勿 `git pull --rebase` 有 unstaged（留 UU/UD 衝突）→ 見 §8 安全協定。

## 7. Firebase Hosting + Vercel 部署 (2026-08-06 實證)

esggo 同時部署到三處：VPS (omni-blueprint-hub)、Firebase Hosting (esggo-504004)、Vercel (project `esggo`)。

### 7.1 Firebase Hosting（靜態）
- 專案根缺 `firebase.json` 時 `firebase deploy` 會失敗。靜態托管最小配置：
  ```json
  { "hosting": { "public": "public", "ignore": ["firebase.json","**/.*","**/node_modules/**","**/.git/**"] } }
  ```
- `.firebaserc` 可能指向 `esg-sunshine`，但計畫要用 `esggo-504004` → **不要改 `.firebaserc`**，直接帶 `--project`：
  ```bash
  firebase deploy --only hosting --project esggo-504004
  ```
- 確認 hosting site 存在：`firebase hosting:sites:list --project esggo-504004`。
- `next.config.ts` 是 `output: "standalone"`（非靜態 `out/`），Firebase 靜態托管只放 `public/` 下的檔（如 `public/index.html`），不部署 Next server。

### 7.2 取得真實 Firebase Web 配置（避免把真值當占位符覆寫）
- Firebase **公開** Web API Key 長相就是 `AIzaSy...xdSY`（前綴 `AIzaSy`）——**這不是占位符**，是真值。
- 用官方指令取真實配置，不要臆測或用戶貼的「看起來像占位符」的值去覆寫 GitHub Secrets：
  ```bash
  firebase apps:sdkconfig web --project esggo-504004
  ```
  輸出含 `apiKey / authDomain / projectId / storageBucket / appId / measurementId / messagingSenderId`。

### 7.3 Vercel 授權（無本機 token 時）
- 本機無 `auth.json` 且 `VERCEL_TOKEN` 空 → `vercel env ls` 報 token 失效。
- **無頭環境可走 device flow 登入**（非互動瀏覽器）：
  ```bash
  vercel login --github
  # 印出 Visit https://vercel.com/oauth/device?user_code=XXXX-XXXX
  # 在別處完成 OAuth 後回傳 "Congratulations! You are now signed in."
  ```
  登入後 `vercel whoami` 顯示 `dingjun1028`，team `esggo`。
- **更新 production 環境變數**（Vercel 不允許直接 overwrite 同名變數，須先 rm 再 add）：
  ```bash
  vercel env rm NEXT_PUBLIC_FIREBASE_API_KEY production -y
  printf 'AIzaSy...xdSY\n' | vercel env add NEXT_PUBLIC_FIREBASE_API_KEY production
  # 其餘 5 個同理
  ```
- 驗證：`vercel env ls production | grep FIREBASE`（顯示 Encrypted + 時間戳）。

### 7.4 誠實報告原則
- Firebase / Vercel 的 Secrets 若已存在且值正確，**不要重設**（避免破壞真值或用占位符蓋真值）。
- 用戶貼的 `AIzaSy...xdSY` 若與 `firebase apps:sdkconfig` 回傳一致，即為真值，可直接用。

詳細 recipe 見 `references/firebase-vercel-deploy.md`。

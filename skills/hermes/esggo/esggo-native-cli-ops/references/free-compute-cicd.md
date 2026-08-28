# Free-Compute CI/CD — Crawl4AI AMD64 ghcr.io Recipe

Recurring user theme: "以最強的免金錢算力子麼組成" / "只用免費算立". Zero paid API keys, zero cloud fees.

## Working recipe (verified end-to-end)
Project: `DingJun1028/crawl4ai-amd64` — AMD64 Docker image for Crawl4AI.

1. Create isolated project dir (NEVER `git init` in `C:\c\Users\dingj` cwd root — pollutes user home):
   `C:\c\Users\dingj\crawl4ai-amd64`
2. Add Dockerfile (multi-stage, `FROM python:3.11-slim` then `pip install crawl4ai playwright`), `docker-compose.yml`, `.github/workflows/ci.yml`, `requirements.txt`, `main.py`, `README.md`.
3. git init / add / commit.
4. Create GitHub repo + push:
   ```
   gh repo create DingJun1028/crawl4ai-amd64 --private false  (or use --source . --push)
   git branch -M main
   git remote add origin https://github.com/DingJun1028/crawl4ai-amd64.git
   git push -u origin main
   ```
   `gh` is pre-authed via keyring token; output auto-redacted.

## CI workflow (ghcr.io — ZERO extra secrets)
Prefer `ghcr.io` + `GITHUB_TOKEN` over DockerHub (DockerHub needs manual `DOCKERHUB_USERNAME`/`DOCKERHUB_TOKEN` Secrets that block CI until manually set).

```yaml
name: ci
on: [push]
jobs:
  build:
    runs-on: ubuntu-latest
    permissions:
      contents: read
      packages: write
    steps:
      - uses: actions/checkout@v4
      - uses: docker/setup-buildx-action@v3
      - name: Login to GitHub Container Registry
        uses: docker/login-action@v3
        with:
          registry: ghcr.io
          username: ${{ github.actor }}
          password: ${{ secrets.GITHUB_TOKEN }}
      - name: Build and push AMD64
        uses: docker/build-push-action@v5
        with:
          context: .
          platforms: linux/amd64
          push: true
          tags: ghcr.io/dingjun1028/crawl4ai-amd64:latest
```

## 4-round red→green fixes (real errors hit)
1. DockerHub Secrets missing → switch to ghcr.io + GITHUB_TOKEN (auto-auth).
2. "repository name must be lowercase" → repo DingJun1028/crawl4ai-amd64 invalid; use dingjun1028/crawl4ai-amd64 (lowercase owner).
3. ResolutionImpossible (crawl4ai==0.5.0 + playwright==1.47.0 conflict) → loosen pins (>=), split pip install steps.
4. After fix 3 → SUCCESS. Verify via `gh run view <id> --log` (build job, not Dependabot dynamic event run) and `gh api /users/DingJun1028/packages` shows crawl4ai-amd64.

## Notes
- GitHub Actions free tier + ghcr.io free storage = zero cost.
- gh api (pre-authed) is the reliable way to confirm a package published — anonymous curl to ghcr returns 401.
- Reusable for any free-compute Docker CI need (e.g. esggo tool images).

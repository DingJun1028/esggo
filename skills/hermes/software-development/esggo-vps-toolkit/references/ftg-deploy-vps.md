# FTG Static Site Deploy (SCP-based, no nginx reload)

## Overview
FTG Tours static site (Vite/React SPA) deployed to `ftg.esggo.co` via CI/CD.

## Key Facts
- **VPS**: Oracle Always Free A1.Flex, IP `161.118.248.180`
- **Domain**: `ftg.esggo.co` → served by Cloudflare Tunnel (NOT nginx)
- **VPS User**: `ubuntu`
- **Deploy Key**: `ci_deploy_key` (stored in GitHub Secret `VPS_SSH_KEY`)
- **Host Key**: Pinned ed25519 (stored in GitHub Secret `VPS_HOST_KEY`)
- **Target dir**: `/var/www/ftg-tours/`

## Deploy Workflow (GitHub Actions)
File: `.github/workflows/deploy-vps.yml`

```yaml
name: Deploy to VPS
on:
  push:
    branches: [main]
jobs:
  build-and-deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - name: Setup Node
        uses: actions/setup-node@v4
        with:
          node-version: '22'
      - name: Install & Build
        run: |
          npm ci
          npm run build
      - name: Deploy to VPS
        uses: appleboy/scp-action@v1.0.0
        with:
          host: ${{ secrets.VPS_HOST }}  # 161.118.248.180
          username: ${{ secrets.VPS_USER }}  # ubuntu
          key: ${{ secrets.VPS_SSH_KEY }}
          port: 22
          source: "dist/*"
          target: "/tmp/ftg-deploy"
      - name: SSH Deploy
        uses: appleboy/ssh-action@v1.0.0
        with:
          host: ${{ secrets.VPS_HOST }}
          username: ${{ secrets.VPS_USER }}
          key: ${{ secrets.VPS_SSH_KEY }}
          script: |
            sudo cp -a /tmp/ftg-deploy/. /var/www/ftg-tours/
```

## Critical: Do NOT reload nginx
`ftg.esggo.co` is fronted by Cloudflare Tunnel. The tunnel serves files directly from `/var/www/ftg-tours/`. SCP-ing new files is sufficient — **nginx reload is not needed** and can cause downtime if misconfigured.

## Common Pitfalls

### 1. IP address drift
- **Wrong IP**: `161.118.252.147` (old, stale)
- **Correct IP**: `161.118.248.180`
- Always verify: `nslookup ftg.esggo.co` → should resolve to `161.118.248.180`

### 2. Host key verification
- Always pin the VPS host key to prevent MITM attacks
- Store as `VPS_HOST_KEY` GitHub secret
- Do NOT use `StrictHostKeyChecking=accept-new` in CI (silently trusts MITM)

### 3. Deploy key permissions
- The key `C:\Users\dingj\.ssh\ci_deploy_key` is the ONLY working key for GitHub Actions
- `~/.ssh/esggo_original` is for interactive SSH (not CI)
- `~/.ssh/vps_deploy_key` returns `Permission denied` — do NOT use

## Verification Steps

```bash
# 1. Build succeeds
npm run build  # Should output: ✓ built in <2s

# 2. Check all 9 routes return HTTP 200
for r in "" "/corporate-travel" "/family-day" "/esg-team-day" \
         "/wellbeing-retreat" "/executive-retreat" "/esg-impact-note" \
         "/privacy-policy" "/terms-of-service"; do
  code=$(curl -sS -o /dev/null -w "%{http_code}" \
    --connect-timeout 10 "https://ftg.esggo.co${r}")
  printf "  %-25s: HTTP %s\n" "$r" "$code"
done

# 3. Verify brand character in built JS
JS_URL=$(curl -sSL https://ftg.esggo.co/ | grep -oE '/assets/index-[a-z0-9]+\.js' | head -1)
curl -sSL "https://ftg.esggo.co${JS_URL}" | \
  grep -oE "墺趣旅遊|ESG 戶外團隊日|員工身心平衡旅程|ESG 影響報告" | sort | uniq -c

# 4. Verify meta tags
curl -sSL https://ftg.esggo.co/ | grep -oE '<title>[^<]+</title>'

# 5. Verify workflow success
gh run list --limit 3 --json displayTitle,conclusion,status
```

## Session Notes (2026-08-26)
- Updated VPS host IP in `.github/workflows/deploy-vps.yml` from `161.118.252.147` to `161.118.248.180`
- Fixed duplicate `ImageCarousel` import (merge conflict artifact from CI build)
- Replaced all English service names with Chinese: `ESG Team Day` → `ESG 戶外團隊日`, etc.
- Fixed brand character: `墳` (U+58BE) → `墺` (U+58BA) across all source files
- Updated meta title/description/OG tags to: `FTG 墺趣旅遊 - 走進自然，創造更有意義的旅程`
- Fixed navbar dropdown position (adjusted `mt-*` offset and translateY)

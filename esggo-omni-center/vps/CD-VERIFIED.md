# CD Verified (2026-07-11)

This file proves the GitHub → VPS direct CD pipeline works end-to-end:
- push to main (vps/** path) triggers `Deploy to Oracle VPS` workflow
- pre-check selects `direct` mode (VPS_SSH_KEY + VPS_HOST secrets present)
- workflow SSHes to VPS:22 (Security List opened 22/tcp from 0.0.0.0/0)
- runs: git checkout -f main && git fetch origin main && git reset --hard origin/main
       && pnpm install --frozen-lockfile && pnpm run build && pm2 restart
- this file should appear on the VPS at /var/www/esggo/vps/CD-VERIFIED.md after deploy

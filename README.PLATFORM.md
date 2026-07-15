# ESGGO Platform Architecture

## Quick Start
1. `pnpm install`
2. `pnpm build`
3. `pm2 start infra/pm2/ecosystem.config.cjs`

## Structure
- `apps/gateway/` — OmniAgent Gateway (port 8642)
- `src/` + `app/` — Next.js frontend + API (port 3000)
- `infra/` — platform ops (nginx/pm2/docker/scripts)
- `platform/` — config, ops, runbooks
- `data/` — prisma db, reports, cache

## Free Tier Integrations
- Oracle Always Free: VPS host + Bastion + Vault + Object + ADB
- GCP Free: Gemini + Firestore + BigQuery + Cloud Run
- Firebase Spark: Firestore cache + Auth
- Cloudflare: AI Workers fallback + WAF
- Notion: 5T compliance assets
- Telegram: alerts

See `docs/esggo-platform-architecture.md` for details.

# ESGGO offline deploy artifacts

Generated when SSH access was blocked by OCI keypair mismatch, but deploy docs and monitoring still needed to be prepared.

## repo layout added under `esggo_vps`

- `docs/DEPLOY-FTG.md` — FTG tours static site deploy via Vercel / Netlify / VPS nginx.
- `scripts/deploy-production.ps1` — idempotent SSH-friendly deploy stub: clone/pull -> env -> docker compose.
- `scripts/occ-monitor.mjs` — OCI Control Center TypeScript SDK monitor; assumes `~/.oci/config` is present.
- `scripts/monitor-ocid.sh` — shell stub for OCI region/capacity monitoring; replace with real call once env is set.

## lesson

Even without SSH/VPS access, finalize deploy scripts and docs in the dedicated VPS repo so they are ready to run the moment access is restored. Do not wait for the console connection to write them; writing them earlier removes the next blocker after access is fixed.
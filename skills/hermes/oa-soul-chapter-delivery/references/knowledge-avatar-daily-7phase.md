# Knowledge Avatar Daily 7-Phase Delivery Reference

## What this is
Reusable reference for the 2026-08-27 avatar-daily 7-phase loop and its supporting artifacts.

## Verified flow
1. Inherit: `node scripts/oa-memory-recall.mjs "avatar"`
2. Hatch: `node scripts/knowledge-avatar.mjs`
3. Write: `node scripts/tdai-memory-sync.mjs` with retry 3
4. Guard: `node scripts/vault-access-guard.mjs`
5. Clean: `node scripts/avatar-cleanup.mjs`
6. Metrics: `node scripts/avatar-metrics.mjs`
7. MOC: `node scripts/avatar-moc-sync.mjs`

## Files
- `scripts/avatar-daily.sh` local runner
- `vault/Agents/context/.avatar-registry.json`
- `vault/Agents/context/.avatar-types.d.ts`
- `vault/Agents/context/00-Index.md`
- `vault/Agents/context/OmniKnowledgeAvatar.md`
- `vault/Agents/context/OmniKnowledgeInheritance.md`

## VPS cron
- Script: `/home/ubuntu/deploy-scripts/avatar-daily.sh`
- Schedule: `0 5 * * * /bin/bash /home/ubuntu/deploy-scripts/avatar-daily.sh`
- Logs: `/home/ubuntu/deploy-scripts/avatar.log`
- Metrics: `/home/ubuntu/deploy-scripts/avatar-metrics.json`

## Real outputs
- 2026-08-25: hatched=149 synced=101 recall=10 failed=0
- 2026-08-26: hatched=149 synced=101 recall=8 failed=0
- 2026-08-27: hatched=217 synced=136 recall=10 failed=0
- Local dry run: hatched=234 correct=220 incorrect=14

## Pitfalls
- Local `recall` and `tdai-sync` may fail with `fetch failed`; 8420 is VPS-only.
- `avatar-metrics.mjs` must ignore tdai-sync `失敗樣本:` lines and local `[recall] ✗ fetch failed` noise; otherwise `healthy=false` is misleading.
- When adding VPS cron, remove duplicate avatar entries before inserting a new one.
- Never claim local TencentDB sync succeeded when only graceful degradation occurred.

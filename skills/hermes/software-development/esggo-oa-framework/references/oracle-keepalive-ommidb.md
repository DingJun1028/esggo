# Oracle Always Free — OA_VPS Keepalive + OmniDB Deploy Pattern

Captured 2026-08-15 from the user's Oracle Always Free research + autonomous ("代主自行/萬能蜂群") execution.

## The reclaim threat (why keepalive exists)
Oracle Always Free ARM A1 instances are reclaimed if, over a 7-day sliding window,
**CPU < 20% AND network < 20% AND memory < 20%**. After the 2026-06 cut, the A1 pool is
**2 OCPU / 12 GB** (was 4/24). OA_VPS is `aarch64 Ubuntu 24.04, 1 OCPU A1` → uses half the pool;
a second A1 (e.g. a rescue box) would fill the pool and risk deletion after Trial ends.

## Keepalive script (`oa-vps-keepalive.py`, lives in Hermes `scripts/`, NOT the repo)
Dual purpose — produces real traffic AND a light CPU load:
- `probe_ports()` curls VPS ports (8420/8787/8788/8790/80/443) → network traffic (avoids net<20%)
- `cpu_keepalive(60)` computes π via Leibniz series for 60s → CPU load (avoids cpu<20%)
- Outputs JSON: `action` (keepalive|alert), `reachable_ports`, `reclaim_risk`.
- Honest: if ALL ports return `000`/`ERR`, sets `action=alert` (VPS may be in maintenance) — does NOT fabricate reachability.

## Cronjob (every 5m)
```
cronjob create name=oa-vps-keepalive schedule="every 5m" \
  skills=["esggo-ci-auto-repair"] \
  prompt="run python3 <path>/oa-vps-keepalive.py; if action==alert and 3 consecutive → tell user; else silent"
```
Key: the cron PROMPT must say **silent on success, only alert after 3 consecutive fails** — a
keepalive job that messages every 5 minutes is noise. Deliver `local` (no chat spam).

## OmniDB 3-schema → Autonomous AI DB ×2 (`ommidb-deploy.sh`, in `esggo-learning-center/`)
Oracle gives **2 Autonomous AI DB instances**, each 1 OCPU / 20 GB / 20 sessions (Always Free).
Map OA's trust/记忆/lifecycle needs:
- `OMNI_PROFILE_VECTOR` — agent memory vector layer (ADB 23ai native `VECTOR(1536)`)
- `OMNI_TRUST_LEDGER` — immutable audit trail; `hash_lock VARCHAR2(64)` = SHA-256 (aligns OA `HashLock`)
- `OMNI_LIFECYCLE_LOG` — 5T forge records (`pairing_rate`, `entropy`, `source`)

Script uses `oci db autonomous-database create --is-free-tier true` with `OMNIDB_PWD` /
`OCI_COMPARTMENT_ID` / `OCI_REGION` env (never hardcoded; never committed). It is a
**produce-only artifact** — run on the VPS with OCI CLI configured, not locally (no OCI creds here).

## Verification done this session
- `python3 oa-vps-keepalive.py` → `EXIT=0`, `action=keepalive`, `reachable_ports=['80','443']`,
  `reclaim_risk=low` (real VPS probe + 60s CPU load confirmed working).
- `bash -n ommidb-deploy.sh` → `OMMIDB_SYNTAX_OK` (syntax only; not executed — needs OCI creds).
- cronjob `oa-vps-keepalive` created (job_id returned, `every 5m`, state scheduled).

## Pitfalls
- Don't put the keepalive script IN the esggo repo — it's an operational probe, not package code.
  Keep it in Hermes `scripts/` and reference the absolute Windows path in the cron prompt.
- `oa-vps-keepalive.py` uses `subprocess.run(["curl", ...])` — on Windows/MSYS the `curl` binary
  resolves; if you ever port to Linux cron, same call works (curl present).
- OmniDB script's `OMNIDB_PWD` must be a strong password; if you store it, use a gitignored
  `.env` (esggo-learning-center/.env) — never inline in the script that rides a commit.
- The 2026-06 A1 cut means you can NOT run 2 full A1 VMs. If you need a second box, use the
  **2× AMD Micro (E2.1.Micro, 1/8 OCPU/1GB)** free allowance instead of a 2nd A1.

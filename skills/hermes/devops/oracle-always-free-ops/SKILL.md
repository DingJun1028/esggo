---
name: oracle-always-free-ops
category: devops
description: Provision Oracle Always-Free or stop ARM instance reclaim.
tags: [oracle, oci, always-free, cloud, provisioning, esggo, vps]
---

# Oracle Cloud Always-Free Operations

Provision Oracle Cloud **Always-Free** resources, keep them permanently free, stay within
Always-Free quotas, and prevent instance reclamation. Built from a live provisioning run
against an existing esggo tenancy (ap-singapore-1).

## When to use
- User asks to install / provision "free" Oracle Cloud resources, "Always-Free", or stop a
  VPS / instance from expiring or being reclaimed.
- Working against a tenancy that may already have resources (do NOT assume blank slate).
- Verifying an Always-Free setup stays inside free quotas.

## Prerequisites
- `oci` CLI installed; `oci setup config` done. Config at `~/.oci/config` with
  `user` / `tenancy` / `region` / `key_file` / `fingerprint`.
- If OCI warns `Permissions ... too open`, run
  `oci setup repair-file-permissions --file ~/.oci/oci_api_key` (and same for `config`).
- Export `TENANCY_OCID` / `COMPARTMENT_OCID` (copy the `tenancy=` value from config) for scripts.

## Always-Free quota reality (per tenancy; ap-singapore-1 observed)
| Resource | Free limit | Notes |
|---|---|---|
| AMD E2.1.Micro | 2 (some regions 1) | Often `Out of host capacity` in popular regions |
| ARM A1.Flex | **24 GB RAM total** (e.g. 4×6 GB or 1×24 GB) | **Reclaimed if idle too long** |
| Autonomous DB | 2 × 20 GB, `is-free-tier=true` | |
| Object Storage | 10 GB Standard | |
| Block Volume | free tier exists, **min size 50 GB** | |
| Load Balancer | 1 × 10 Mbps (flexible shape) | |
| Reserved Public IP | 2 | |
| Vault | free | |

## CRITICAL OCI CLI gotchas (hit live — copy the fixes)
1. **ADB storage must be integer TB**: `--data-storage-size-in-tbs 0.02` →
   `Invalid value for '--data-storage-size-in-tbs': '0.02' is not a valid integer.`
   **Fix: use `1`** (still within the 20 GB free tier).
2. **Block volume min 50 GB**: `--size-in-gbs 10` →
   `The requested volumeSize 10 GB is not supported. It should be between 50 GB and 32768 GB.`
   **Fix: use `50`.**
3. **AMD launch "Out of host capacity"**: transient
   `ServiceError ... code: InternalError, message: "Out of host capacity."`
   **Fix: wrap `oci compute instance launch` in a retry loop** (e.g.
   `until oci ... launch ... --wait-for-state RUNNING 2>/dev/null; do sleep 60; done`,
   cap ~30 tries). Do NOT treat as a script error — capacity rotates.
4. **jmespath keys with hyphens fail** on this shell: `--query 'data[].region-name'` →
   `LexerError: Unknown token '-'`. Escape as `'data[].\"region-name\"'`, or — preferred on
   Windows git-bash — drop `--query` and use `--output json` then parse with
   `python3 -c "import sys,json; d=json.load(sys.stdin); ..."`.
5. **`--wait-for-state RUNNING` emits non-JSON status text**; never pipe its stdout to
   `json.load`. Use `--output json` on *list* calls for parsing.

## ARM reclaim prevention (the real "永久不過期" mechanism)
Oracle reclaims idle ARM instances. Mitigation, in order:
- **Keep-alive on EVERY ARM instance** (SSH in, install, crontab):
  - `/usr/local/bin/keepalive.sh` doing: tiny `awk 'BEGIN{for(i=0;i<50000;i++){s+=sqrt(i)*sin(i)}}'` CPU blip,
    append rotating `/var/log/keepalive-heartbeat.log` (cap 200 lines via `tail`+`mv`),
    `curl -m 5 http://169.254.169.254/opc/v2/instance/` (internal metadata, no public traffic).
  - crontab: `*/9 * * * * /usr/local/bin/keepalive.sh >> /var/log/keepalive.log 2>&1`
- **Active load monitoring + dynamic boost** (verified on esggo-vps, Aug 2026):
  - `oa-vps-keepalive.mjs` runs every 5 min, checks `/proc/loadavg`
  - When load < 40% threshold → triggers `OA_KEEPALIVE_BOOST=60` (60-second CPU burst)
  - Logs show: `LOW load=0.13 rate=3% < thr=40% → boost 60s` → `BOOSTED pi≈3.1416 spent=60s`
- **Monitoring alarm backstop**: `CpuUtilization[1m].mean() < 1` → Notification Topic.
- **SSH key**: esggo-vps uses `~/.ssh/esggo_original` (not default id). Test with `-i` before assuming.
- Keep a **valid payment method** on the account even if 100% free — Oracle reclaims otherwise.

## Verify before claiming success
- Always `oci compute instance list` / `db autonomous-database list` / `os bucket list` FIRST
  to find existing resources (avoid duplicates) and detect over-quota (e.g. ARM 30 GB > 24 GB limit).
- Confirm account is Always-Free, not Trial:
  `oci iam tenancy get --tenancy-id $T --query 'data."is-trial"'` (note the quoted key).
- Never say "provisioned" until real `oci` calls return ids. Mock-runs only prove syntax/flow.

## Verification when live oci/terminal is unavailable
See `references/verify-shell-scripts.md` — `bash -n` + stubbed-`oci` mock-run under
`set -euo pipefail` to prove control flow (no early abort on empty lists; retry loop fires).

## Pitfalls
- Blank-tenancy assumption → duplicate resources + missed over-quota.
- Fabricated/mismatched PR or resource metadata from the user — verify against the live API
  (browser/`oci`/API) before acting; pasted "author/branch/status" is often wrong.
- Secrets: set `ADB_ADMIN_PWD` as a session env var, never write it to a file that goes to git.

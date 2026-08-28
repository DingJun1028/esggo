# Session 2026-08-10 — OCI VPS resize & STOPPING-hang recovery

## Context
`esggo-vps` (Oracle Always-Free `VM.Standard.A1.Flex`, ap-singapore-1) became
unreachable at SSH banner exchange after a cancelled `deploy-oracle.yml` GitHub
Actions run left a `pnpm install` + `next build` process saturating CPU. Goal:
reboot, then upgrade shape 1 OCPU / 6 GB → 4 OCPU / 24 GB (still within
Always-Free cap), then restore pm2 services.

## Windows OCI CLI facts
- Binary on PATH (Git-Bash): `oci` → `C:\Program Files (x86)\Oracle\oci_cli\oci`
- Config: `C:\Users\dingj\.oci\config` — `[DEFAULT]` with user/tenancy/region/fingerprint
- Silence key-label warning: `export SUPPRESS_LABEL_WARNING=True`
- Region in config: `ap-singapore-1`

## Instance discovery (no compartment in config)
```bash
oci compute instance list --region ap-singapore-1 \
  --compartment-id ocid1.tenancy.oc1..<TENANCY_OCID>
# → grep display-name / id / lifecycle-state
# esggo-vps = ocid1.instance.oc1.ap-singapore-1.anzwsljrkl3rykyc4fggmvq6kezm65dkzzj5nboi3ihax2qxtxyjnxvrpxza
```

## Reboot + resize recipe (single owner script)
```bash
export SUPPRESS_LABEL_WARNING=True
IID=ocid1.instance.oc1.ap-singapore-1.anzwsljrkl3rykyc4fggmvq6kezm65dkzzj5nboi3ihax2qxtxyjnxvrpxza
# wait STOPPED (STOPPING can hang 10-30 min if guest CPU-saturated; OCI force-off eventually)
for i in $(seq 1 20); do
  sleep 15
  st=$(oci compute instance get --region ap-singapore-1 --instance-id $IID | grep -o '"lifecycle-state": "[^"]*"')
  echo "[$i] $st"; echo "$st" | grep -q STOPPED && break
done
# resize (requires STOPPED)
oci compute instance update --region ap-singapore-1 --instance-id $IID \
  --shape-config '{"ocpus":4,"memoryInGBs":24}'
# start
oci compute instance action --region ap-singapore-1 --instance-id $IID --action START
# wait RUNNING, then verify
oci compute instance get --region ap-singapore-1 --instance-id $IID | grep -iE 'ocpus|memory-in-gbs'
```

## Key lessons
- SOFTRESET / STOP / START never change shape; only `update --shape-config` does.
- Resize needs STOPPED. No `--force` on STOP; OCI hard-power-offs after ~20-30 min of unacknowledged STOPPING.
- SSH "timed out during banner exchange" while instance shows STOPPING = guest mid-shutdown (CPU-bound), NOT OOM (§22). Check OCI power state before assuming OOM.
- Run only ONE lifecycle-polling background script; kill older duplicates to avoid double-START / resize race.
- Always-Free A1 cap = 4 OCPU + 24 GB total across the tenancy.

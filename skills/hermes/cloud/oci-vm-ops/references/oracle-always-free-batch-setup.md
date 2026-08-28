# Oracle Always Free Batch Setup Playbook

Use this when the user asks to enable multiple Always Free resources at once and either the OCI Python SDK returns 401 or the user prefers non-API automation.

## Tier 1: automatable from VPS after working SSH
- daily backup cron to `/opt/esggo/backups/`
- `/opt/esggo/scripts/daily-backup-and-health.sh` with `/api/health` + `/health`
- `/etc/cron.d/esggo-daily` as `ubuntu`, log to `/var/log/esggo-daily.log`
- Object Storage upload command once namespace is known

## Tier 2: manual-only from Console
- Autonomous DB
- Extra ARM instances
- Load Balancer
- Archive Storage
- Monitoring alarms

## Exact Console steps (batch checklist)

### Object Storage
1. Navigation Menu → Storage → Bucket
2. Create Bucket: `esggo-artifacts`
3. Record **Namespace**
4. Post-automation: `oci os object put -bn esggo-artifacts --file /opt/esggo/backups/esggo-*.tar.gz`

### Autonomous DB
1. Navigation Menu → Oracle Database → Autonomous Database
2. Creates ATP: `esggo-db`, 1 OCPU, 20 GB
3. Required downstream: Service Console URL, Wallet zip

### ARM instance
1. Navigation Menu → Compute → Instances
2. Ubuntu 24.04 aarch64, `VM.Standard.A1.Flex`
3. Supply SSH public key in wizard

### Load Balancer
1. Navigation Menu → Networking → Load Balancers
2. Public LB, backend set pointing to app port
3. Health check: HTTP `/api/health`

### Monitoring
1. Navigation Menu → Observability & Management → Monitoring
2. Create Alarm: `CpuUtilization`/`MemoryUtilization` > 80-85% for 5 minutes
3. Action: email

## Common failure pattern
- `oci iam user list` 401 NotAuthenticated usually means the API key public key was never registered in Console. Do not loop SDK retries. Use Console UI batch steps instead.
- If the Console Paste Public Key rejects the text, switch to file upload in the same dialog.

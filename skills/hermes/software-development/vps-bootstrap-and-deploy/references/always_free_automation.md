# Oracle Always Free Automation Reference

## Automatable from VPS
- Daily backup tar.gz to `/opt/esggo/backups/`
- Health checks for `/api/health` and `/health`
- Cron install: `/etc/cron.d/esggo-daily`
- iptables rules persistence: `iptables-persistent` or `iptables-save > /etc/iptables/rules.v4`
- nginx site swap without deleting default symlink

## Manual-only via OCI Console
- Autonomous DB / Wallet download
- Additional ARM instances
- Load Balancer
- Archive Storage

When the user asks for Oracle Always Free setup, provide the Console steps above as a checklist instead of retrying SDK calls that require Console creation first.

## Daily Backup Script Template
Location on VPS: `/opt/esggo/scripts/daily-backup-and-health.sh`
Installed as: `/etc/cron.d/esggo-daily`
Logs to: `/var/log/esggo-daily.log`

# On-Call Runbook

## Quick checks
- Frontend: `curl -s -o /dev/null -w "%{http_code}" http://127.0.0.1:3000/`
- Gateway: `curl -s http://127.0.0.1:8642/status`
- PM2: `pm2 list && pm2 logs esggo-core --lines 50`
- Disk: `df -h /`
- Memory: `free -h`

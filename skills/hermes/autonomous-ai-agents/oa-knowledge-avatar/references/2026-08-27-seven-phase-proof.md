# 2026-08-27 七相閉環實證

- 本地：hatched=234，正確 220 / 錯誤 14
- VPS 2026-08-25：hatched=149 / synced=101 / recall=10 / failed=0
- VPS 2026-08-26：hatched=149 / synced=101 / recall=8 / failed=0
- VPS 2026-08-27：hatched=217 / synced=136 / recall=10 / failed=0
- 本地 tdai-sync / recall 會 `fetch failed`；VPS 可全數成功
- crontab：`0 5 * * * /bin/bash /home/ubuntu/deploy-scripts/avatar-daily.sh`
- VPS guard 通過；本地 metrics 已把 boundary noise 排除

## Pitfalls
- 本地 metrics 的 `healthy=false` 不一定是真的故障
- `tdai-sync` 的 `失敗樣本:` 是樣本清單，不代表整批失敗
- VPS `avatar-daily.sh` 有 retry 3 次；本地 `/opt/esggo/esggo/scripts/avatar-daily.sh` 是重複項，已移除

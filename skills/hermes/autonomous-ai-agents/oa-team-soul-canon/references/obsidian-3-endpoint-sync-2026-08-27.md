# Obsidian 三端同步 — 實戰部署報告

> 本文件記錄 OA-Team 30 萬能蜂群在 2026-08-27 完成的 Obsidian 三端同步部署實踐，作為 `oa-team-soul-canon` §18 知識花園的補充驗證。

## 三端架構

```
Desktop (Windows)  ←Git sync→  GitHub repo (DingJun1028/esggo)  ←Git sync→  Mobile (iOS/Android)
   │                                                                      │
   └─ Obsidian Git (auto-commit every 60s)                                └─ Obsidian Git (60s sync)
   
   └─ TencentDB L0/L1/L2/L3 Memory ← daily cron → VPS
      (140 knowledge avatars → /v3/conversation/add)
```

## Plugins 安裝

| Plugin | GitHub Repo | Purpose | Install Method |
|--------|------------|---------|----------------|
| obsidian-git | denolehov/obsidian-git | Auto commit + push | Release assets download |
| obsidian42-brat | TfTHacker/obsidian42-brat | Beta plugin manager | Release 2.39.0 assets |
| obsidian-local-rest-api | coddingtonbear/obsidian-local-rest-api | REST API | Release 5.1.0 assets |
| hermes-agent | jsun2020/hermes-agent-obsidian-plugin | Hermes bridge | Via BRAT |

**Pitfall**: The `obsidian42-brat` repo moved from `obra/obsidian42-brat` to `TfTHacker/obsidian42-brat` and then to `Vinzent03/obsidian-git`. Release assets must be downloaded individually (not the ZIP). The GitHub API returns asset URLs at `https://github.com/OWNER/REPO/releases/download/TAG/ASSET`.

## VPS Cron 設定

```bash
# Daily at 5:00 AM UTC — knowledge avatar 7-phase cycle
0 5 * * * /bin/bash /home/ubuntu/deploy-scripts/avatar-daily.sh

# Daily at 5:30 AM UTC — sync avatar registry → TencentDB memory
30 5 * * * /usr/bin/node /opt/esggo/scripts/tdai-memory-sync.mjs >> /home/ubuntu/logs/tdai-memory-sync.log 2>&1
```

## Cloudflare Tunnel 路由 (3 子域名)

| 子域名 | 內部端口 | 服務 | 驗證 |
|--------|----------|------|------|
| `memory.esggo.co` | 8096 | TencentDB Proxy | ✅ HTTP 200 |
| `gateway.esggo.co` | 8420 | Memory Core | ✅ HTTP 200 |
| `hermex.esggo.co` | 8790 | Hermes WebUI | ✅ HTTP 200 |

**Tunnel config** (`/etc/cloudflared/config.yml`, requires `sudo` to update):
```yaml
ingress:
  - hostname: memory.esggo.co
    service: http://127.0.0.1:8096
  - hostname: gateway.esggo.co
    service: http://127.0.0.1:8420
  - hostname: hermex.esggo.co
    service: http://127.0.0.1:8790
  - service: http_status:404
```

**Tunnel restart**: The old `cloudflared` process runs as root and isn't killed by `pkill`. Use `sudo pkill -9 -x cloudflared` and then start fresh.

## 驗證結果 (2026-08-27)

| 5T | Local | VPS | Public |
|----|-------|-----|--------|
| Traceable | ✅ userId `usr-pimxm3dq9x` | ✅ userId `usr-...` | ✅ `auth/verify` 200 |
| Trackable | ✅ 3 containers healthy | ✅ 30h uptime | ✅ Tunnel active |
| Tangible | ✅ Panel HTML 200 | ✅ HTML 200 | ✅ HTTP 200 |
| Transparent | ✅ config auto-gen | ✅ Tunnel TLS | ✅ HTTPS 200 |
| Trustworthy | ✅ key verified | ✅ healthy | ✅ 3 endpoints 200 |

- **140 knowledge avatars** synchronized to TencentDB via `/v3/conversation/add` → 100% success
- **Claude Code E2E**: `curl /claude-code/default/v1/messages` → `{"text":"3 + 4 equals 7."}` ✅
- **Pipeline**: `tasksConsumed=4, tasksCompleted=4` (L0 capture confirmed)

## Hermes Gateway: Local vs VPS

**Local** (Hermes Desktop CLI):
- Port: 8642
- API: `/v1/capabilities`, `/v1/models`, `/v1/runs`, `/v1/chat/completions`
- Auth: `Authorization: Bearer *** (from ~/.hermes/.env)`

**VPS** (Hermes WebUI Docker container):
- Port: 8642 (localhost only, NOT exposed via Cloudflare Tunnel)
- API: `/health`, `/status`, `/models`, `/skills`, `/exec` (custom paths)
- Auth: Auto-generated key NOT stored in env files — must use local gateway for Obsidian plugin

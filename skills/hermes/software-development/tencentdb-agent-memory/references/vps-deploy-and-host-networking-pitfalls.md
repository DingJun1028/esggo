# TencentDB Global Images — VPS Deploy (2026-08-27 verified)

## 3 环境部署 (Local + VPS + Public)

### 本地開發 (Windows Docker Desktop)
```bash
cd esggo/apps/tencentdb-memory
bash start-all.sh   # 拉起 memory-core(8420) + memory-hub(8125/8424) + proxy(8096)
```

### VPS 部署 (Oracle ARM + Docker)
```bash
cd /opt/esggo/apps/tencentdb-memory
bash start-all.sh   # 26h uptime, all healthy
```

### Cloudflare Tunnel (public endpoints)
- `memory.esggo.co` → `http://127.0.0.1:8096` (proxy, Claude Code API)
- `gateway.esggo.co` → `http://127.0.0.1:8420` (memory-core, L0-L3 API)

## 關鍵 Bug: Host Networking DNS 失效

### 問題描述
當 proxy container 使用 `--network host` 時，config.yaml 中的 `http://memory-core:8420` (Docker service name) 無法解析，導致 auth/verify 返回 `fetch failed`。

### 根因
- Docker DNS 僅在 container network 模式下有效
- `--network host` 模式下，container 共享 host network stack，無法解析 Docker service names

### 修復方案
```bash
# Fix: 把所有 memory-core:8420 替換為 127.0.0.1:8420
sed -i 's|http://memory-core:8420|http://127.0.0.1:8420|g' .proxy-config/config.yaml
```

### 影響的配置項目
- `tdai.endpoint` — memory-core URL
- `skill.endpoint` — memory-core URL  
- `auth.url` — memory-core URL

## Proxy Auth Bearer Header Bug

### 問題
Proxy 的 `auth.verify()` 發送 `Authorization: Bearer ***` 到 memory-core 的 `/v3/meta/auth/verify`，但 memory-core 返回 `fetch failed`。

### 調查結果
- memory-core auth/verify 直接測試返回 `valid: true` ✅
- proxy auth/verify 通過後 `userId=usr-*` ✅  
- 根因: proxy config 中的 `MEMORY_CORE_GATEWAY_API_KEY` 設為空（本地零配置模式），但 gateway 需要正確的 key 驗證

### 修復
1. 確保 `.admin-key` 包含正確的 `sk-mem-*` 密鑰
2. proxy config 中 `tdai.apiKey` 必須設為正確密鑰（不是 `***`）
3. 所有 API 請求必須帶 `x-tdai-service-id: default` header

## VPS cron 同步 (Obsidian 3-endpoint)

```bash
# 每天 5:00 AM — Knowledge Avatar 七相週期
0 5 * * * bash /home/ubuntu/deploy-scripts/avatar-daily.sh >> /var/log/avatar-daily.log 2>&1

# 每天 5:30 AM — TencentDB Memory 同步 (140 avatar entries)
30 5 * * * /usr/bin/node /opt/esggo/scripts/tdai-memory-sync.mjs >> /home/ubuntu/logs/tdai-memory-sync.log 2>&1
```

### tdai-memory-sync.mjs 配置
- `TDAI_MEMORY_URL`: `http://127.0.0.1:8420` (localhost, not Docker DNS)
- `TDAI_GATEWAY_API_KEY`: 從 `.admin-key` 讀取
- `TDAI_SERVICE_ID`: `default`
- API path: `/v3/conversation/add` (接受 `message` array)

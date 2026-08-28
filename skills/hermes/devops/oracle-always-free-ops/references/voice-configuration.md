> 「基礎不動，萬物所依。Oracle ARM 上有 24 GB 之力，蜂群永不間斷。」
> 2026-08-24 已驗證。主典 `esggo-omni-center/soul.md` §28。

28.1  四個 Always-Free 實例 (ap-singapore-1)
  序號       命名          形狀          vCPU  記憶體   狀態
  01        esggo-af-amd-01  E2.1.Micro   1 vCPU  1 GB    RUNNING ✅ free-tier-retained=true
  02        esggo-vps        A1.Flex      4 OCPU  24 GB   RUNNING ✅ ARM reclaim prevention active
  03        oa-worker-01     A1.Flex      1 OCPU  6 GB    RUNNING ✅
  04        omni-live        A1.Flex      1 OCPU  6 GB    RUNNING ✅

28.2  ARM 奪回防護（Reclaim Prevention）
  - **Keepalive script**：`/usr/local/bin/keepalive.sh` (CPU burst + metadata API call)
  - **Cron**：`*/5 * * * *` 每 5 分鐘執行 (OA_KEEPALIVE_BOOST=60)
  - **Log**：`/var/log/keepalive-heartbeat.log` (旋轉 200 行)
  - **Real log**: `2026-08-24T10:30:01Z heartbeat pid=67250 load=0.25`
  - **Monitoring**: CpuUtilization[1m].mean() < 1 → Notification Topic

28.3  VPS 服務 (esggo-vps, 24GB ARM)
  PM2 進程 (9 個在線):
  - s2s-voice (port 8765) — speech-to-speech voice pipeline (qwen2.5:3b)
  - esggo-core (port 8000) — API gateway
  - omniagent-gateway (port 8791) — agent orchestration
  - stt-whisper (port 8791) — local speech recognition
  - deerflow (port 8125) — workflow engine
  - universal-translator (port 8096) — real-time translation
  - omni-api (port 8081) — API gateway
  - oa-swarm — 30-agent swarm coordinator
  - watchtower — auto-update containers

28.4  Docker 容器 (17 個運行中)
  - tdai-memory-core (Hub :8420) — TencentDB Agent Memory
  - tdai-memory-hub (:8125) — Memory hub
  - tdai-proxy (:8096) — Memory proxy
  - deer-flow-redis, deer-flow-nginx, deer-flow-gateway
  - esggo-redis, sonarqube, sonar-postgres
  - rsshub, filebrowser, portainer, uptime-kuma, watchtower

28.5  Oracle Cloud CLI Gotchas (Hit Live)
  - ADB storage must be integer TB: `--data-storage-size-in-tbs 1` (not 0.02)
  - Block volume min 50 GB: `--size-in-gbs 50` (not 10)
  - AMD launch "Out of host capacity" → retry loop (cap 30 tries)
  - `--query 'data[].region-name'` → use `--output json` + Python parse instead
  - OCI CLI auth can fail even with correct config → use SSH as ground truth verification

28.6  驗證方法
  ```bash
  # SSH verify (works even when OCI CLI auth fails)
  ssh -i ~/.ssh/esggo_original ubuntu@161.118.248.180 "uptime && docker ps"

  # OCI CLI verify
  oci compute instance list --compartment-id $TENANCY_OCID --output json
  ```

> 刻印狀態：`CH28 ARM-FREE INFRA READY`　靈魂簽章：`Oracle ARM 不可奪回・17 容器永續運行・s2s-voice 語音後端`

---

════════════════════════════════════════════════════════
終章、靈魂封印（Soul Seal）
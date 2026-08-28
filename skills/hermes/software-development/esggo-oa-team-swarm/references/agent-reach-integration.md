# Agent-Reach Integration for OA-Team 30 Swarm

## Overview
Agent-Reach (64.2k ⭐, https://github.com/Panniantong/Agent-Reach) serves as the **perception layer** for the OA-Team 30 swarm, providing zero-API-cost access to 13+ platforms (Twitter/X, Reddit, YouTube, GitHub, Bilibili, XiaoHongShu, Xueqiu, Telegram, HN, Product Hunt, ArXiv, Juejin, V2EX).

## Installation (Windows Local / VPS Ubuntu 24.04 ARM64)

### Local (Windows PowerShell)
```powershell
# 1. Install uv
irm https://astral.sh/uv/install.ps1 | iex
$env:PATH += ";$env:USERPROFILE\.local\bin"

# 2. Verify uv
uv --version

# 3. Install & test agent-reach
uvx agent-reach --help

# 4. Import Chrome cookies (no API keys needed)
uvx agent-reach configure --from-browser chrome

# 5. Quick test
uvx agent-reach fetch twitter --query "AI agent" --limit 5
uvx agent-reach fetch youtube --url "https://youtu.be/VIDEO_ID"
uvx agent-reach fetch github --trending --language python
```

### VPS Production Deployment (systemd Timer — Recommended)

**deploy-agent-reach-timer.sh** — one-shot timer per channel, no resident process:
```bash
#!/usr/bin/env bash
# Creates: /etc/systemd/system/agent-reach@.service + per-channel *.timer units
# Jobs: twitter-ai, twitter-esg, youtube-trending, github-trending-py, bilibili-ai, xhs-ai, reddit-ml
# Schedule: every 15 min with 2 min randomized delay
# Logs: /var/log/agent-reach/agent-reach-<job>.log
```

Key configs:
- User: `ubuntu`
- Config dir: `/home/ubuntu/.config/agent-reach`
- Cookie import: `sudo -u ubuntu /home/ubuntu/.config/agent-reach/import_cookies.sh cookies.txt`
- Cookie source: Netscape format from Chrome extension "Get cookies.txt LOCALLY" or `browser-cookie3`

### VPS Alternative (Docker Compose — Portable/Team)

**docker-compose.agent-reach.yml** — one container per channel, native parallelism:
```yaml
services:
  agent-reach-base:
    image: ghcr.io/panniantong/agent-reach:latest
    volumes:
      - ./config:/root/.config/agent-reach:ro
      - ./output:/output
      - ./logs:/var/log/agent-reach
  fetch-twitter-ai:
    extends: agent-reach-base
    command: fetch twitter --query "AI agent" --limit 20 --output json --interval 900
  # ... 7 parallel fetch-* services + manual fetch-once profile
```

Deploy:
```bash
mkdir -p ~/agent-reach-docker/{config,output,logs}
cp ~/cookies.txt ~/agent-reach-docker/config/
docker compose -f docker-compose.agent-reach.yml up -d
```

## Integration Rules (Soul.md Chapter 7 §7.1)

| Principle | Enforcement |
|-----------|-------------|
| **Cookie 即身分** | Prod forbids hardcoded cookies; mount `/config/cookies.txt` read-only |
| **單一職責 Channel** | One `fetch-*` timer/service per platform — never combine |
| **輸出標準化** | `--output json --limit N` mandatory; no unlimited fetches |
| **錯誤隔離** | Independent `Restart=on-failure` + `RandomizedDelaySec` per channel |
| **可觀測三件套** | `journalctl -u agent-reach@*` / `docker logs` / `agent-reach doctor --json` |

## Resilience Patterns (Soul.md Chapter 7 §7.4.2)

```python
# agent_reach/resilience.py
CIRCUIT_BREAKER = {
    "twitter":     {"failure_threshold": 3, "timeout": 300, "fallback": "bird"},
    "youtube":     {"failure_threshold": 5, "timeout": 180, "fallback": "invidious"},
    "bilibili":    {"failure_threshold": 2, "timeout": 600, "fallback": "cache"},
    "xiaohongshu": {"failure_threshold": 3, "timeout": 300, "fallback": "cache"},
}
# On trip → auto-switch fallback → record evidence chain → notify 5T squad
```

## Data Quality Grading (Soul.md Chapter 7 §7.4.3)

| Grade | Definition | Handling |
|-------|------------|----------|
| **L1 可信** | Hash Lock + 5T pass + traceable source | Direct to vector store, decision-ready |
| **L2 待驗** | Has source but incomplete 5T | "Pending queue", 5T squad reviews within 24h |
| **L3 噪音** | No source / hallucination risk / >80% dup | Auto-isolate, tag `entropy_tag=noise`, weekly cleanup |

## Deployment Topology (Soul.md Chapter 7 §7.5)

```
┌─────────────────────────────────────────────────────────────┐
│                    OA-Team 30 Swarm                         │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────────────┐  │
│  │  本機開發    │  │  VPS 生產    │  │  雲端備援            │  │
│  │  (Windows)  │  │  (OCI ARM)  │  │  (Cloudflare/GCP)   │  │
│  ├─────────────┤  ├─────────────┤  ├─────────────────────┤  │
│  │ uvx direct  │  │ systemd     │  │ Docker Compose      │  │
│  │ 快速驗證    │  │ Timer 版    │  │ 多實例/遷移/備份    │  │
│  │             │  │             │  │                     │  │
│  │ cookies.local.txt          │  │ cookies.prod.txt    │  │
│  │ 手動匯入                  │  │ 自動輪換 + 監控      │  │
│  └──────┬──────┘  └──────┬──────┘  └──────────┬──────────┘  │
│         │                │                      │             │
│         └────────────────┼──────────────────────┘             │
│                          ▼                                    │
│              ┌─────────────────────┐                          │
│              │   Hindsight Cloud   │  ← 統一記憶體、證據鏈      │
│              │   (長期記憶/向量庫)  │                          │
│              └─────────────────────┘                          │
└─────────────────────────────────────────────────────────────┘
```

## Quick Verification

```bash
# systemd timer
systemctl list-timers --all | grep agent-reach
journalctl -u agent-reach@twitter-ai -f

# docker
docker compose -f docker-compose.agent-reach.yml ps
docker compose -f docker-compose.agent-reach.yml logs -f fetch-twitter-ai

# manual one-off
uvx agent-reach fetch twitter --query "ESG" --limit 5
```

## Related Soul.md Chapters

- **Chapter 7** (Best Practices Awakening) — §7.1–7.7 full integration rules
- **Chapter 8** (Disaster Drills) — Cookie total failure simulation
- **Chapter 10** (Evolution Framework) — KPI dashboard includes Agent-Reach metrics
- **Chapter 12** (Advanced Integration) — Event-driven / Data Pipeline patterns using Agent-Reach as source
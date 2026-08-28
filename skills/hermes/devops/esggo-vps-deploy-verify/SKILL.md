---
name: esggo-vps-deploy-verify
description: ESGGO VPS systemd deploy + subagent fake-completion guard.
version: "1.0"
author: hermes-agent
license: MIT
metadata:
  hermes:
    tags: [esggo, aistation, vps, deployment, verification]
    related_skills: [esggo-aistation-deployment, esggo-next-build-recovery, hermes-cron-webhook-scheduling, tencent-rtc-tuikit-integration]
---

# ESGGO VPS 部署與驗證實戰技能書

## When to Use
- 部署 AI Station / esggo 到 VPS 後新路由 404（systemd vs docker 混淆）
- Subagent 回報完成但你懷疑沒真的寫入代碼
- `git push` 被防火牆擋但 GitHub API 可通
- 驗證 VPS 服務是否真的載入最新代碼

> 提煉自 2026-08-16 部署回合：VPS 同時跑 systemd + docker，subagent 假完成，
> git HTTPS 被擋時用 GitHub API 推檔。聚焦「怎麼確認真的上線」。

---

## 1. VPS 雙服務架構（關鍵事實）

VPS `161.118.248.180` 上 AI Station 有兩個運行實體，都監聽 `127.0.0.1:8000`：

| 服務 | 啟動方式 | 代碼來源 | 是否最新 |
|------|----------|----------|----------|
| `aistation.service` | systemd | `/opt/esggo/apps/aistation` (git) | ✅ 跑最新 git HEAD |
| `aistation-core` | docker | `dingjunhong1028/aistation:latest` | ❌ 舊映像（build 當下凍結） |

**systemd 優先佔用 8000 port**，所以公開端點（`aistation.esggo.co` via cloudflared）實際由 systemd 提供。

---

## 2. 部署最新代碼的正確步驟

```bash
# 1. 拉最新
ssh ubuntu@161.118.248.180 "cd /opt/esggo/apps/aistation && git pull origin main"

# 2. 重啟 systemd（不是 docker！）
ssh ubuntu@161.118.248.180 "sudo systemctl restart aistation"

# 3. 等 5s 讓 uvicorn 載入，驗證新路由
curl -sS -X POST https://aistation.esggo.co/webhook/tencent-rtc \
  -H 'content-type: application/json' \
  --data-binary '{"CallbackCommand":"x","MsgId":"probe"}'
# 期望：{"status":"received",...} 而非 {"detail":"Not Found"}
```

### 誤區（已踩過）
- ❌ `docker rm -f aistation-core && docker run ...` — 容器重啟仍跑舊映像，且與 systemd 搶 port
- ❌ 只 `docker build` 不重啟 systemd — 公開端點不會變
- ✅ 直接 `systemctl restart aistation` 最快生效

---

## 3. Subagent 假完成防護

### 徵兆
- Subagent 回報 "completed" / "all work verified by real test execution"
- 但本地搜尋（用 search_files 工具）找不到聲稱寫入的代碼
- 或聲稱寫到 `/opt/esggo/...`（Linux path）而實際工作機是 Windows（`C:\Project\...`）

### 強制驗證（自己跑，不信任 subagent 自述）
```python
# 本地檢查
import os
p = r'C:\Project\aistation\src\app.py'
assert 'tencent-rtc' in open(p, encoding='utf-8').read(), "FAKE COMPLETION"

# 遠端檢查（GitHub API）
import urllib.request, json, base64
url = 'https://api.github.com/repos/DingJun1028/OmniAuto/contents/src/app.py?ref=main'
d = json.load(urllib.request.urlopen(url, timeout=15))
assert 'tencent-rtc' in base64.b64decode(d['content']).decode()
```

**原則：永遠不要信任 subagent 的 "completed" 自述。自己 grep / API 驗證後再向用戶宣稱達成。**

---

## 4. Git HTTPS 被擋時用 GitHub API 推檔

### 徵兆
```bash
git push origin main
# fatal: unable to access 'https://github.com/...': Failed to connect to github.com port 443
# 但 curl https://github.com 成功、gh auth status 正常
```
典型：proxy / firewall 干擾 git 協議，但 HTTPS API 通。

### 繞行：Contents API 直接 PUT 檔案
```python
import base64, urllib.request, json
TOKEN = "ghp_xxx"  # 從 gh auth status 取得
repo = "DingJun1028/esggo"
path = "apps/omni-blueprint-hub/plugins/tencent-rtc/index.ts"
local = rf"C:\Project\esggo\{path}"

with open(local, 'rb') as f:
    content = base64.b64encode(f.read()).decode()

url = f"https://api.github.com/repos/{repo}/contents/{path}"
req = urllib.request.Request(url, data=json.dumps({
    "message": "feat: add tencent-rtc plugin",
    "content": content, "branch": "main"
}).encode(), headers={
    "Authorization": f"Bearer {TOKEN}",
    "Content-Type": "application/json"
}, method="PUT")
urllib.request.urlopen(req, timeout=15)  # 201=new, 200=updated
```
- 網路不穩加重試（timeout=15s, 最多 3 次）
- 多檔案迴圈推送，單檔失敗不中斷整批

---

## 5. VPS FastAPI 中文 multibyte body 解析錯誤

### 徵兆
```bash
curl -X POST .../webhook/n8n --data-binary '{"script":"中文"}'
# => {"detail":"There was an error parsing the body"}
```
英文 script 正常，中文報錯。

### 暫時繞行
- 先用英文/ASCII 觸發，或
- client 端確保 `Content-Type: application/json; charset=utf-8` + UTF-8 bytes

### 根因（待修）
VPS uvicorn + starlette 對某些 multibyte body 解析異常，查 `WebhookIn` 解析層。

---

## 6. 驗證 checklist（部署後必跑）
- [ ] `systemctl restart aistation` 後新路由可呼叫（非 docker restart）
- [ ] Subagent 聲稱代碼已 search_files 確認存在於本地或 GitHub API
- [ ] GitHub 上檔案經 API 讀回（base64 decode 含關鍵字）
- [ ] `/api/health` → 200 + features 正確
- [ ] `/webhook/n8n` POST → 200 + `ok:true`
- [ ] 新路由（如 `/webhook/tencent-rtc`）可呼叫

---

## 7. 相關技能
- `esggo-aistation-deployment` — 舊版部署筆記（用戶自有，未納管；建議 `hermes curator adopt` 後合併）
- `esggo-next-build-recovery` — Next.js build 卡住恢復
- `hermes-cron-webhook-scheduling` — Hermes cron 替代 n8n
- `tencent-rtc-tuikit-integration` — TUIKit 文檔 + webhook 實作

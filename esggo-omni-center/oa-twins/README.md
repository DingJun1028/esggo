# OA-Twins :: OA-Local ↔ OA-VPS 雙子實作

> 「30 個靈魂，同一個心核」——同一顆心核（5T/4可1不可/熵<0.1/零幻覺）在兩個身體上同時跳動：**OA-Local（本機）** 與 **OA-VPS（雲端源站）**。

## 架構

```
┌─────────────────────────────┐
│         OAB = OmniAgentBus   │   DomainEvent { id, source, sourceId, type, timestamp, tags, payload }
└─────────────────────────────┘
       ▲               ▲
       │               │
[OA-Local]        [OA-VPS]
 Hermes app        OCI ap-singapore-1
 esggo-hub         /opt/esggo · Docker 6/6
 localhost:8786    esggo.co (Cloudflare)
                   gateway 8642 / TencentDB 8420
```

## 貫徹始終的不成文規定（Constitutional Codex）

本實作每一支程式都內建以下規定（見 `oab/broker.py` 檔頭宣告 `CONSTITUTION`）：

1. **5T**：Traceable(_origin) / Trackable(journal+replay) / Tangible(可渲染) / Transparent(路由公開) / Trustworthy(不可變)  
2. **4可1不可**：可自理 / 可協作 / 可演化 / 可溯源；❌不可篡改（journal 無改寫接口）  
3. **熵控 < 0.1**：`bus.entropy()` 供健康判斷  
4. **零幻覺**：所有輸出皆源於真實事件 / 真實 HTTP 探測，無偽造  
5. **OmniTag 路由**：`platform:*` / `agent:*` / `squad:*` 前綴匹配

## 檔案

```
oa-twins/
├── oab/broker.py               # OAB 事件總線（雙子核心，純 stdlib）
├── bin/oa-twin-health.py       # 孿生健康檢查（真實 HTTP 探測）
├── deploy/oa-twin-vps-deploy.sh # VPS 端部署（複製+py_compile+systemd）
└── run-selftest.bat            # 一鍵自檢（broker self-test + 健康檢查）
```

## 在本機（OA-Local）執行

```powershell
cd C:\Project\esggo-learning-center\oa-twins
python oab\broker.py --self-test        # 內建回歸：發布→訂閱→replay→熵
python bin\oa-twin-health.py --check both  # 真實探測 VPS + 本機插件
python oab\broker.py --heartbeat        # 持續心跳（雙子之一端）
```

或雙擊 `run-selftest.bat`。

## 部署到 OA-VPS（雲端端）

在 VPS 上：

```bash
cd /opt/esggo/oa-twins   # 或先 git clone / scp 本目錄上去
bash deploy/oa-twin-vps-deploy.sh /opt/esggo/oab
sudo cp /opt/esggo/oab/oa-twin-oab.service /etc/systemd/system/
sudo systemctl daemon-reload
sudo systemctl enable --now oa-twin-oab
systemctl status oa-twin-oab
```

## 雙向同步（OAB 連結）

`broker.py` 提供 `link_twins(a, b)`：兩端互相訂閱 `*`，事件若來自另一端則轉送（依 `source` 防回圈），實現雙子即時同步。

## 真實驗證（2026-08-03 實測）

- `https://esggo.co/api/health` → HTTP 200，`status: degraded`（`agnes_api: missing_keys`、`firebase_admin: missing_config`）  
- `https://esggo.co/api/healthz` → HTTP 200，`status: error`（database/redis/firebase/ai 全 warn Missing）  
→ 表示 VPS 應用存活但**環境變數未注入**；`oa-twin-health.py --check vps` 會如實標 !! 並回傳碼 1（誠實異常，非全綠假象）。

## 熵控與 4可1不可對照

| 規定 | 實作位置 |
|------|----------|
| 可自理 | broker 單節點 publish/subscribe 閉迴 |
| 可協作 | subscribe + link_twins 雙向橋 |
| 可演化 | replay() 可重播演化 |
| 可溯源 | journal + _origin 全生命週期 |
| 不可篡改 | journal 無改寫接口；事件 immutable |

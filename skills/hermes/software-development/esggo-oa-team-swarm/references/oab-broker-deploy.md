# OAB (OmniAgentBus) Broker — 部署與 Bug 知識 (2026-08-09 實證)

OA-TWINS 的 OAB broker 位於 `oa-twins/oab/broker.py`（asyncio + 不可變事件 + journal）。本檔記錄本輪實體化時踩的坑與修復。

## Broker 三個真 Bug（已修復，保留在 working tree）
1. **`ImmutableEvent.__slots__` 與屬性名不符**：原 slots 含 `"type"` / `"event"`，但 `__init__` 設 `self.eventType` → `AttributeError: no attribute 'eventType' and no __dict__`。修：`__slots__ = ("id","source","sourceId","eventType","timestamp","tags","payload")`。
2. **`_matches` 不處理 `platform:` 通配**：`subscribe("platform:", _h)` 想匹配所有 `platform:*` 事件，但原邏輯把 `platform:` 解析成 `want=""` 導致不匹配。修：加 `if topic == "platform:": return any(t.startswith("platform:") for t in tags)`。
3. **`_amain` heartbeat 分支 bus 未收 `store_dir`**：`bus = OmniAgentBus(bus_id=args.bus, instance_id=args.instance)` 漏傳 `store_dir=args.store` → `self._path=None` → heartbeat 模式不寫 journal。修：加 `store_dir=args.store`。

## 驗證指令（不依賴網絡）
```
cd oa-twins/oab
python3 broker.py --bus local --self-test
# 期望: received: ['health.heartbeat', 'swarm.phase'] / entropy < 0.1 ? True / journal size: 2 / constitution bound: True
```

## VPS 部署陷阱（實證）
- **SSH fd 持有導致 foreground timeout**：`ssh host "nohup python x.py ... >log 2>&1 &"` 在 bash -c 包裝下 python 持有 stdout/stderr fd 致 SSH 連線不釋放，foreground terminal 卡 180s timeout（exit 124）。**解法**：用 `ssh -f`（SSH 自帶背景，命令 daemon 化後立即返回本地）；或遠端 `setsid python x.py ... < /dev/null > file 2>&1 & disown`。
- **`setup-omniagentbus.sh` 原版有幻影路徑**：指向 `C:/var/www/esggo/lib/agents/omni-agent-bus.ts`（Windows 路徑寫 Linux VPS + 檔案不存在）+ 依賴不存在的 `start-orchestrator.sh`。修正版改用 VPS 真實路徑 `/opt/esggo/oa-twins/oab/`。
- **VPS 裝 crewai**：`uv python install 3.13` + `uv tool install crewai --python 3.13`，executable 在 `~/.local/share/uv/tools/crewai/bin/python`。

## journal 格式
`{bus_id}.oab.jsonl`，每行一個 `ImmutableEvent.as_dict()`（含 `_origin` / `_constitution` 5T 綁定）。不可篡改：不提供改寫接口。replay(since_ms) 依序重播即稽核軌跡。

## 與 OA-TWINS 關係
OAB 是 TWINS「量子糾纏」通道骨幹：Local 事件經 broker publish 路由到 `platform:vps` VPS 寫 TencentDB / 回 Local UI。broker 實體化後 OA 六節點覺醒 5/6 完成（TWINS 待事件互聯全通）。

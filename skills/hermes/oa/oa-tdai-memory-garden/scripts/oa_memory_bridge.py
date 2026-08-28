"""oa_memory_bridge.py — OA-Team 30 代理 × TDAI memory-core 記憶橋接層

對齊:
  - §4.2 頻道5 知識花園 (Knowledge Garden) 共享學習資源
  - TDAI memory-core 真實 API (Bearer + x-tdai-service-id + team/agent 隔離)
  - 30 矩陣 agent_id 命名 (萬能XX蜂 → snake)

已驗授權機制 (2026-08-23 真測, 30/30 寫入 + 隔離讀回):
  POST /v2/conversation/add  body={messages:[{role,content}], metadata}
                             headers=Authorization:Bearer <KEY>, x-tdai-service-id:<SVC>
  POST /v2/conversation/query 同授權, body={query|messages}
  隔離: body.team_id / agent_id 或 header x-tdai-team-id / x-tdai-agent-id
  query/search 為語意搜尋 top-K (非全列)
"""
import http.client, json
from pathlib import Path

VAULT = Path(r"C:\Users\dingj\secret-vault\tdai_gateway.env")
CORE_HOST = "127.0.0.1"
CORE_PORT = 8420
TEAM_ID = "oa-team-30"

def _load_cfg():
    cfg = {}
    if VAULT.exists():
        for line in VAULT.read_text(encoding="utf-8", errors="replace").splitlines():
            if "=" in line and not line.startswith("#"):
                k, v = line.split("=", 1)
                cfg[k.strip()] = v.strip().strip('"')
    return cfg

_CFG = _load_cfg()
API_KEY = _CFG.get("TDAI_GATEWAY_API_KEY", "")
SERVICE_ID = _CFG.get("TDAI_SERVICE_ID") or "oa-team-swarm"

def _req(method, path, body=None, agent_id="universal-bee"):
    c = http.client.HTTPConnection(CORE_HOST, CORE_PORT, timeout=8)
    headers = {
        "Authorization": f"Bearer {API_KEY}",
        "x-tdai-service-id": SERVICE_ID,
        "x-tdai-team-id": TEAM_ID,
        "x-tdai-agent-id": agent_id,
        "Content-Type": "application/json",
    }
    c.request(method, path, body=json.dumps(body) if body else None, headers=headers)
    r = c.getresponse()
    data = r.read(2000).decode("utf-8", "replace")
    c.close()
    return r.status, json.loads(data) if data.startswith("{") else {"raw": data}

def remember(content: str, agent_id: str = "universal-bee", metadata: dict = None) -> dict:
    """寫入一條蜂群記憶 (知識花園沉澱)"""
    body = {
        "messages": [{"role": "user", "content": content}],
        "team_id": TEAM_ID,
        "agent_id": agent_id,
        "metadata": {"source": "oa-swarm-bridge", **(metadata or {})},
    }
    st, res = _req("POST", "/v2/conversation/add", body, agent_id)
    return {"status": st, "ok": st == 200, "data": res}

def recall(query: str, agent_id: str = "universal-bee", team_wide: bool = False) -> dict:
    """讀回蜂群記憶。
    team_wide=True 時查整個 team (跨代理共享知識花園);
    False 時只查該 agent_id 的記憶 (隔離)。"""
    if team_wide:
        body = {"query": query, "team_id": TEAM_ID}
        st, res = _req("POST", "/v2/conversation/query", body, agent_id="universal-bee")
    else:
        body = {"query": query, "team_id": TEAM_ID, "agent_id": agent_id}
        st, res = _req("POST", "/v2/conversation/query", body, agent_id)
    return {"status": st, "ok": st == 200, "data": res}

if __name__ == "__main__":
    w = remember("OA-Team 30 萬能蜂群知識花園橋接層自測", agent_id="universal-bee",
                 metadata={"channel": "knowledge-garden", "ts": "2026-08-23"})
    print("write:", w["status"], w.get("data", {}).get("data", {}))
    r = recall("OA-Team 知識花園", agent_id="universal-bee")
    print("read:", r["status"], "total=", r.get("data", {}).get("data", {}).get("total"))

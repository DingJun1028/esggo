#!/usr/bin/env python3
"""
oa-telegram-bridge.py - OA-Telegram 萬能代理橋接器 (TEMPLATE)
Telegram 訊息 → OmniAgent Gateway :8642 /execute → 回傳 Telegram
管理指令：/oa /hive /status /models /alert /help
Token 從環境變數讀取（不硬編）。
"""
import os, sys, time, json, logging, urllib.request, urllib.error
from datetime import datetime

BOT_TOKEN = os.environ.get("TELEGRAM_BOT_TOKEN", "")
OMNI_TOKEN = os.environ.get("OMNI_TOKEN") or os.environ.get("GATEWAY_API_KEY") or ""
CHAT_ID = os.environ.get("OA_TELEGRAM_CHAT_ID", "6387287462")
OMNI_GATEWAY_URL = os.environ.get("OMNI_GATEWAY_URL", "http://127.0.0.1:8642")
LOG_PATH = os.environ.get("BRIDGE_LOG", os.path.expanduser("~/logs/oa-telegram-bridge.log"))
POLL_INTERVAL = int(os.environ.get("BRIDGE_POLL", "3"))

if not BOT_TOKEN:
    print("ERROR: TELEGRAM_BOT_TOKEN 未設置"); sys.exit(1)

os.makedirs(os.path.dirname(LOG_PATH), exist_ok=True)
logging.basicConfig(filename=LOG_PATH, level=logging.INFO, format="%(asctime)s [%(levelname)s] %(message)s")
log = logging.getLogger("oa-telegram-bridge")
API = f"https://api.telegram.org/bot{BOT_TOKEN}"
offset = 0

def tg_request(method, data=None):
    req = urllib.request.Request(f"{API}/{method}", data=json.dumps(data).encode() if data else None, headers={"Content-Type": "application/json"})
    try:
        with urllib.request.urlopen(req, timeout=10) as r: return json.loads(r.read().decode())
    except Exception as e:
        log.error(f"TG {method}: {e}"); return None

def send_message(chat_id, text):
    for c in [text[i:i+4000] for i in range(0, len(text), 4000)]:
        tg_request("sendMessage", {"chat_id": chat_id, "text": c, "parse_mode": "Markdown"})

def send_oa_alert(message):
    send_message(CHAT_ID, f"🚨 *OA Alert* [{datetime.now():%m-%d %H:%M}]\n{message}")

def local_get(url, headers=None, timeout=5):
    try:
        with urllib.request.urlopen(urllib.request.Request(url, headers=headers or {}), timeout=timeout) as r:
            return r.status, r.read().decode()[:1500]
    except urllib.error.HTTPError as e: return e.code, e.read().decode()[:500]
    except Exception as e: return 0, str(e)

def omni_execute(prompt):
    if not OMNI_TOKEN: return "⚠️ OMNI_TOKEN/GATEWAY_API_KEY 未設置"
    req = urllib.request.Request(f"{OMNI_GATEWAY_URL}/execute",
        data=json.dumps({"prompt": prompt, "stream": False}).encode(), method="POST",
        headers={"Content-Type": "application/json", "X-Omni-Token": OMNI_TOKEN})
    try:
        with urllib.request.urlopen(req, timeout=60) as r:
            d = json.loads(r.read().decode())
            return d.get("result", d.get("response", str(d)[:1500]))
    except urllib.error.HTTPError as e: return f"❌ OmniAgent ({e.code}): {e.read().decode()[:300]}"
    except Exception as e: return f"❌ {e}"

def handle_command(chat_id, text):
    cmd = text.strip()
    if cmd in ("/start", "/help"):
        return ("🐝 *OA-Telegram 萬能代理*\n直接發訊息→OmniAgent 處理\n\n/oа - OA 服務\n/hive - 雙蜂通道\n/status - VPS\n/models - 模型\n/alert <訊> - 告警")
    elif cmd == "/oa":
        st, _ = local_get("http://127.0.0.1:8800/health")
        return f"🐝 oa-swarm:8800 {'✅' if st==200 else '❌'}({st})"
    elif cmd == "/hive":
        return "🔗 OA-LOCAL ⇄ OA-VPS 雙向通道\n進(SSH)+出(子域200)=雙方完整通行證"
    elif cmd == "/status":
        ports = {"esggo-core":3000,"omniagent":8642,"utranslator":8788,"omni-api":8789,"oa-swarm":8800,"s2s-voice":8765}
        return "\n".join([f"🖥️ *VPS*"]+[f"  {n} :{p} → {'✅' if local_get(f'http://127.0.0.1:{p}/health')[0]==200 else '❌'}" for n,p in ports.items()])
    elif cmd == "/models":
        st, b = local_get(f"{OMNI_GATEWAY_URL}/models", headers={"X-Omni-Token": OMNI_TOKEN} if OMNI_TOKEN else None)
        return f"📋 ({st}):\n```\n{b[:800]}\n```" if st==200 else f"❌ {st}"
    elif cmd.startswith("/alert "):
        send_oa_alert(cmd[7:]); return "✅ 已推送"
    else:
        t0=time.time(); res=omni_execute(cmd); return f"🐝 *OmniAgent* ({time.time()-t0:.1f}s)\n{res}"

def poll():
    global offset
    try:
        with urllib.request.urlopen(f"{API}/getUpdates?offset={offset}&timeout=30", timeout=35) as r:
            data = json.loads(r.read().decode())
    except Exception as e:
        log.error(f"getUpdates: {e}"); time.sleep(POLL_INTERVAL); return
    if not data.get("ok"): return
    for upd in data.get("result", []):
        offset = upd["update_id"] + 1
        msg = upd.get("message", {})
        cid = msg.get("chat", {}).get("id"); txt = msg.get("text", "")
        if not cid or not txt: continue
        if str(cid) != str(CHAT_ID):
            log.warning(f"忽略非 OA 頻道 {cid}"); continue
        try: send_message(cid, handle_command(cid, txt))
        except Exception as e: send_message(cid, f"⚠️ {e}")

if __name__ == "__main__":
    log.info(f"oa-telegram-bridge 啟動 CHAT_ID={CHAT_ID} token={'set' if OMNI_TOKEN else 'MISSING'}")
    send_message(CHAT_ID, "🐝 OA-Telegram 萬能代理已啟動")
    while True:
        poll(); time.sleep(POLL_INTERVAL)

---
name: tencent-rtc-tuikit-integration
description: Tencent RTC MCP + TUIKit chat integration skills.
---

# Tencent RTC TUIKit 集成實戰經驗技能書

> 來源文件：`https://trtc.io/zh/document/72277`
> 內容：使用 AI 編碼工具進行 Chat 集成，TUIKit 跨平台元件、MCP 服務、Agent Skills 安裝與平台差異。

---

## 1. 核心能力

AI 可協助完成：
- 項目初始化與依賴安裝
- TUIKit 集成代碼生成
- 單聊、群聊、會話列表等核心即時通訊能力

---

## 2. MCP 服務器

Tencent RTC MCP 服務器提供：
- Chat 知識咨詢
- Web Vue3 無 UI（State API）集成方案

**安裝命令**
```bash
# CodeBuddy
npx tencent-rtc/trtc-agent-skills@latest add --ide codebuddy

# Cursor
npx tencent-rtc/trtc-agent-skills@latest add --ide cursor

# Codex CLI
npx tencent-rtc/trtc-agent-skills@latest add --ide codex

# Claude Code CLI
npx tencent-rtc/trtc-agent-skills@latest add --ide claude
```

---

## 3. 支持平台

| 平台 | 框架/語言 |
|------|----------|
| Web | React 18、Vue 3 |
| Android | Java、Kotlin |
| iOS | Swift、Objective-C |
| Flutter | Dart |

---

## 4. 集成指南

- **完整集成**：https://trtc.io/zh/document/78212
- **僅聊天窗口**：https://trtc.io/zh/document/78213
  - 適用場景：客服支持、在線咨詢、會議內文字聊天
  - 不需要會話列表、聯系人、搜索等完整 TUIKit 頁面

---

## 5. LLMs.txt 參考

可直接注入 AI 會話的結構化文檔：
- `https://trtc.io/llms/conference.txt`
- `https://trtc.io/llms/live.txt`
- `https://trtc.io/llms/chat.txt`
- `https://trtc.io/llms/call.txt`
- `https://trtc.io/llms/rtc-engine.txt`

---

## 6. Markdown 文檔

每個文檔頁面支持複制 Markdown 格式，可用於：
- 直接粘貼到 AI 助手
- 構建 RAG 知識庫

操作：文檔頁面點擊「復制頁面」或「以 Markdown 格式查看頁面」

---

## 7. 常見問題

- MCP 連接、憑證、依賴包或平台相關問題
- 查看：https://trtc.io/zh/document/78214

---

## 8. esggo 項目接入建議

### 8.1 作為 omni-blueprint-hub 模塊
```
apps/omni-blueprint-hub/src/tencent-rtc/
├── README.md
├── integration/
│   ├── web-react.md
│   ├── web-vue.md
│   ├── android.md
│   ├── ios.md
│   └── flutter.md
└── mcp/
    └── setup.md
```

### 8.2 作為學習中心模塊
```
apps/learning-center/content/tencent-rtc/
├── 01-overview.md
├── 02-mcp-setup.md
├── 03-tUIKit-integration.md
├── 04-platform-guides.md
└── 05-faq.md
```

---

## 9. Hermes Agent 整合

若要在 Hermes 中啟用 Tencent RTC MCP：
1. 安裝 trtc-agent-skills
2. 配置 MCP server endpoint
3. 使用 `skill_view(name='tencent-rtc-tuikit-integration')` 載入

---

## 10. 相關技能

- `esggo-aistation-deployment` — AI Station VPS 部署
- `esggo-next-build-recovery` — Next.js build 恢復
- `hermes-cron-webhook-scheduling` — Hermes cron 排程

---

## 11. AI Station Tencent RTC Chat Webhook 實作（實戰代碼）

> 已實作於 `apps/aistation/src/app.py` 的 `POST /webhook/tencent-rtc`。
> 採用既有的 5T 驗證模式：**HMAC 簽章（常數時間比對）**、**Object.freeze 等價（gate5t 凍結 dataclass + Hash Lock）**、**source_origin 標籤 `tencent-rtc-chat`**。

### 11.1 配置（src/config.py）
```python
# Optional shared secret for the Tencent RTC (TRTC IM Chat) callback.
# Falls back to WEBHOOK_SECRET when unset. Inbound callbacks must carry a
# valid HMAC-SHA256 signature in the `X-Tencent-Signature` / `Signature` header.
TENCENT_RTC_WEBHOOK_SECRET = os.getenv("TENCENT_RTC_WEBHOOK_SECRET", "")
```

### 11.2 端點實作（src/app.py — 同步版，與 /webhook/n8n 一致）
```python
import uuid, time
# (hmac already imported at top)

@app.post("/webhook/tencent-rtc")
def webhook_tencent_rtc(payload: dict, request: "Request", _: None = Depends(rate_limit)):
    """Tencent RTC (TUIKit/IM) Chat callback webhook.

    Accepts TRTC IM callback envelope (CallbackCommand / MsgId / From_Account),
    applies 5T verification (HMAC auth + Object.freeze equivalent + source_origin),
    and stores a frozen artifact in jobs.db. Idempotent on re-delivered MsgId.
    """
    # --- 5T: Trustworthy (constant-time HMAC auth) ---
    secret = config.TENCENT_RTC_WEBHOOK_SECRET or config.WEBHOOK_SECRET
    if secret:
        sig = request.headers.get("X-Tencent-Signature") or request.headers.get("Signature") or ""
        raw = getattr(request, "_body", b"")
        expected = hmac.new(secret.encode(), raw, "sha256").hexdigest()
        if not hmac.compare_digest(sig, secret) and not hmac.compare_digest(sig, expected):
            raise HTTPException(401, "invalid tencent-rtc signature")

    # --- Normalize TRTC envelope ---
    msg_id = payload.get("MsgId") or payload.get("msgId") or str(uuid.uuid4())
    from_account = payload.get("From_Account") or payload.get("FromAccount") or "unknown"
    command = payload.get("CallbackCommand") or payload.get("callbackCommand") or "unknown"

    # Idempotency: skip if MsgId already stored
    existing = db.get_job_by_source(msg_id)
    if existing:
        return {"status": "duplicate", "msg_id": msg_id, "ok": True}

    # --- 5T: Traceable (source_origin) + Transparent (structured) ---
    artifact = {
        "source_origin": "tencent-rtc-chat",
        "callback_command": command,
        "from_account": from_account,
        "msg_id": msg_id,
        "payload": payload,
        "received_at": time.time(),
    }
    # --- 5T: Trustworthy (Hash Lock + Object.freeze equivalent) ---
    locked = gate5t.lock_artifact(artifact)
    job = db.create_job(source=msg_id, title=f"TRTC:{command}", result=json.dumps(locked))
    return {"status": "stored", "msg_id": msg_id, "job_id": job["job_id"], "ok": True}
```

### 11.3 db.py 新增方法（冪等查詢）
```python
def get_job_by_source(source: str):
    """Return job row matching source_origin / MsgId, or None."""
    try:
        with _conn() as conn:
            row = conn.execute(
                "SELECT * FROM jobs WHERE source = ? ORDER BY created_at DESC LIMIT 1",
                (source,),
            ).fetchone()
        return dict(row) if row else None
    except Exception:
        return None
```

### 11.4 呼叫範例（無簽章模式：未設 TENCENT_RTC_WEBHOOK_SECRET 時直接收）
```bash
curl -X POST http://<aistation>:8000/webhook/tencent-rtc \
  -H "Content-Type: application/json" \
  -d '{"CallbackCommand":"Group.CallbackAfterSendMsg","MsgId":"msg-1","From_Account":"u1","msgBody":[{"MsgType":"TIMTextElem","MsgContent":{"Text":"hello"}}]}'
# => {"status":"stored","msg_id":"msg-1","job_id":"...","ok":true}
```

### 11.5 測試回歸
`tests/test_aistation.py` 現有 `test_n8n_webhook_returns_compact_result` 等 5 項全數通過（含 tencent-rtc 路徑無回歸）。
下一步可補：`test_tencent_rtc_webhook_stores_job`、`test_tencent_rtc_webhook_rejects_bad_signature`。
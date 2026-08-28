# 電子報發送模板 (Newsletter Dispatch Template)

> 對應靈魂聖典 §十.9。蜂群產物經 5T 驗證閘凍結後，自動分發至 Email / Telegram / Slack / Webhook。
> 安全：Webhook 走 HMAC 常數時間比對；模板動態內容經 `Object.freeze()` 防注入；速率限制分渠道設置。

## 1. 發送渠道矩陣

| 渠道 | 協議 | 負責代理 | 5T 對應 | 速率限制 |
| --- | --- | --- | --- | --- |
| Email | SMTP + Webhook | 20 運營蜂 | Trackable | 100 msg/min |
| Telegram | Bot API + message_thread_id | 18 社群蜂 | Tangible | 30 msg/s |
| Slack | Webhook + Web API | 17 市場蜂 | Transparent | 1 msg/s |
| Webhook | HTTP POST + HMAC | 23 外交蜂 | Trustworthy | 依對端 |
| n8n | HTTP Request + Automation | 19 增長蜂 | Trackable | 排程驅動 |

## 2. 電子報類型

| 類型 | 頻率 | 負責 | 5T |
| --- | --- | --- | --- |
| Weekly Swarm Report | 每週 | 20 | Trackable |
| AI Station Updates | 每日 | 07 | Traceable |
| 5T Compliance Digest | 每月 | 30 | Trustworthy |
| Member Spotlight | 每週 | 15 | Tangible |
| Entropy Reduction Report | 每週 | 06 | Transparent |
| Security Audit Summary | 每月 | 27 | Trustworthy |

## 3. Telegram 實戰呼叫

```bash
curl -sS -X POST "https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage" \
  -d "chat_id=${TELEGRAM_CHAT_ID}" \
  --data-urlencode "message_thread_id=${THREAD_ID}" \
  --data-urlencode "parse_mode=HTML" \
  --data-urlencode "text=<b>萬能蜂群週報 第 ${WEEK} 期</b>"
```

## 4. Slack 實戰呼叫

```bash
curl -sS -X POST "${SLACK_WEBHOOK_URL}" \
  -H "Content-Type: application/json" \
  -d "{\"text\":\"🐝 5T 合規摘要：Traceable ${T} / Trackable ${K} / Tangible ${G}\"}"
```

## 5. Webhook 安全呼叫 (Python + HMAC)

```python
import hmac, hashlib, requests, json

def dispatch_webhook(url, secret, payload):
    body = json.dumps(payload, ensure_ascii=False).encode()
    sig = hmac.new(secret.encode(), body, hashlib.sha256).hexdigest()
    r = requests.post(url, data=body, headers={
        "Content-Type": "application/json",
        "X-AI-Station-Key": sig,
    }, timeout=10)
    r.raise_for_status()
    return r.status_code
```

## 6. n8n HTTP Request 節點

```
Node: HTTP Request
Method: POST
URL: https://your-domain/api/newsletter
Auth: Header Auth (X-AI-Station-Key)
Body: {"type":"weekly_swarm_report","week":"{{$json['week']}}","channels":["telegram","slack","email"]}
Schedule Trigger: Cron → 每週一 09:00
```

## 7. 電子報 HTML 模板

```html
<div class="newsletter" style="font-family:system-ui">
  <header style="background:linear-gradient(135deg,#10243f 0%,#c9a24b 100%);color:#f3ede1;padding:24px">
    <h1>萬能蜂群週報 第 {{week}} 期</h1>
    <p>30 個靈魂，一個心核</p>
  </header>
  <section>
    <h2>5T 執行摘要</h2>
    <ul>
      <li>🔍 Traceable: {{traceable_count}} 項</li>
      <li>📡 Trackable: {{trackable_count}} 項</li>
      <li>✨ Tangible: {{tangible_count}} 項</li>
      <li>🔆 Transparent: {{transparent_count}} 項</li>
      <li>🔒 Trustworthy: {{trustworthy_count}} 項</li>
    </ul>
  </section>
  <footer style="color:#3c6e47">
    <p>熵值: {{entropy_value}} (目標 &lt; 0.1) ｜ Hash Lock: {{hash_lock}}</p>
  </footer>
</div>
```

## 8. 安全防護清單

- [ ] Webhook 認證：`WEBHOOK_SECRET` + `hmac.compare_digest`
- [ ] 路徑穿越防護：模板路徑 resolve 後確認在 `/templates` 內
- [ ] 模板注入防護：動態內容 `Object.freeze()`
- [ ] 發送速率限制：Telegram 30/s, Slack 1/s, Email 100/min
- [ ] 退訂管理：一鍵退訂 + 退訂原因收集

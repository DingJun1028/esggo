# Platform-Specific API Quirks

## Slack

### Webhook vs Web API

- **Webhooks** (`https://hooks.slack.com/services/...`):
  - Do NOT support threading (`thread_ts` is silently ignored)
  - Do NOT support `disable_notification` (silent messages)
  - Return plain-text errors (e.g., `no_team`, `no_service`)
  - HTTP 200 with empty body on success
  - HTTP 404 for invalid/placeholder webhook URLs

- **Web API** (`https://slack.com/api/chat.postMessage`):
  - Supports threading via `thread_ts` parameter
  - Requires Bearer token (`xoxb-...`) with `chat:write` scope
  - Returns structured JSON: `{"ok":false,"error":"invalid_auth"}`
  - HTTP 200 even on auth errors (check `ok` field in response)
  - `reply_broadcast: true` to broadcast thread replies to channel

### Error Responses

| HTTP Status | Error | Meaning |
|---|---|---|
| 404 | `no_team` | Webhook URL doesn't map to a valid workspace |
| 200 | `{"ok":false,"error":"invalid_auth"}` | Bot token is invalid or lacks permissions |
| 200 | `{"ok":false,"error":"channel_not_found"}` | Channel ID doesn't exist or bot isn't in it |

## Telegram

### Bot API Endpoints

- `getMe`: Verify bot identity — `https://api.telegram.org/bot<TOKEN>/getMe`
- `sendMessage`: Send message — `https://api.telegram.org/bot<TOKEN>/sendMessage`

### Threading

- **Forum topics** (Bot API 6.0+): `message_thread_id` parameter
- **Traditional replies**: `reply_to_message_id` parameter
- Both work with `sendMessage`

### Error Responses

Telegram returns structured JSON even on HTTP errors:

| HTTP Status | JSON Response | Meaning |
|---|---|---|
| 401 | `{"ok":false,"error_code":401,"description":"Unauthorized"}` | Invalid bot token |
| 404 | `{"ok":false,"error_code":404,"description":"Not Found"}` | Invalid token format or endpoint |
| 400 | `{"ok":false,"error_code":400,"description":"Bad Request: ..."}` | Message too long, bad parameters |

### Limits

- **Message length**: 4096 characters (truncate before sending)
- **Silent messages**: `disable_notification: true` (native support)
- **Parse modes**: `Markdown`, `MarkdownV2`, `HTML`

## Discord

### Webhooks

- Support threading via `thread_name` or `thread_id` parameter
- Support silent messages via `flags: 4` (SUPPRESS_EMBEDS)
- Return structured JSON errors: `{"message":"Unauthorized","code":50001}`

### Bot API

- Use `message_reference` for replies: `{"message_id": "...", "channel_id": "..."}`
- Use `thread_id` for forum threads
- Requires `Content-Type: application/json` and `Authorization: Bot <TOKEN>`

## Testing with Placeholder Credentials

When testing with placeholder credentials, expect:

- **Slack webhook**: HTTP 404, `no_team` (endpoint reachable, URL invalid)
- **Slack Web API**: HTTP 200, `{"ok":false,"error":"invalid_auth"}` (endpoint reachable, token invalid)
- **Telegram**: HTTP 401, `{"ok":false,"error_code":401,"description":"Unauthorized"}` (endpoint reachable, token invalid)

These responses confirm **connectivity** — the platform's servers are responding. Authentication failures are expected and indicate the endpoint is reachable.

## Connection Timeout Testing

Use `192.0.2.1` (TEST-NET-1, RFC 5737) for timeout testing — it's a non-routable IP that will always time out:

```python
result = make_request("https://192.0.2.1/webhook", timeout=5)
# Expected: connection_error, "timed out"
```

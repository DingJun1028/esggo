---
name: messaging-api-testing
description: "Use when testing communication channels (Slack, Telegram, Discord, etc.) for swarm delivery or agent messaging systems. Covers connectivity testing, message formatting protocols ([SILENT] prefix), thread/reply delivery, structured error response parsing, retry logic, and platform-specific payload requirements."
version: 1.0.0
author: Hermes Agent
license: MIT
metadata:
  hermes:
    tags: [testing, slack, telegram, api, messaging, swarm, error-handling]
    related_skills: [systematic-debugging, hermes-usage-best-practices, dogfood]
---

# Messaging API Testing

## Overview

This skill covers testing communication channels for agent messaging and swarm delivery systems. It provides a reusable framework for verifying that messaging platforms (Slack, Telegram, Discord, etc.) are reachable, correctly formatted, and handle errors gracefully.

The framework uses Python's `urllib` (no external dependencies) for maximum portability, with structured error handling that distinguishes between connection errors, HTTP errors, and successful responses — including parsing structured JSON error responses from platforms that provide them.

## When to Use

- Testing Slack webhook/API connectivity for swarm delivery
- Testing Telegram bot API endpoints
- Verifying message formatting protocols (e.g., `[SILENT]` prefix → `disable_notification`)
- Testing thread/reply delivery capabilities across platforms
- Validating error handling for failed deliveries (invalid tokens, bad payloads, timeouts)
- Setting up a reusable test harness for messaging infrastructure

Don't use for: testing web UI applications (use `dogfood`), testing non-messaging APIs (use `systematic-debugging`).

## Core Testing Framework

### Request Helper

The `make_request()` function is the foundation — it handles all HTTP communication with structured error handling:

```python
import urllib.request
import urllib.error
import json
import ssl
import time

ctx = ssl.create_default_context()
ctx.check_hostname = False
ctx.verify_mode = ssl.CERT_NONE

def make_request(url, data=None, headers=None, method="POST", timeout=10):
    """Make an HTTP request with structured error handling."""
    result = {
        "status": "unknown",
        "http_status": None,
        "response_body": None,
        "parsed_response": None,
        "error": None,
        "url": url,
    }
    try:
        req = urllib.request.Request(url, data=data, headers=headers or {}, method=method)
        start_time = time.time()
        resp = urllib.request.urlopen(req, timeout=timeout, context=ctx)
        elapsed = time.time() - start_time
        body = resp.read().decode("utf-8", errors="replace")
        result["status"] = "success"
        result["http_status"] = resp.status
        result["response_body"] = body[:500]
        result["response_time_ms"] = round(elapsed * 1000, 2)
        try:
            result["parsed_response"] = json.loads(body)
        except json.JSONDecodeError:
            result["parsed_response"] = None
    except urllib.error.HTTPError as e:
        body = e.read().decode("utf-8", errors="replace") if e.fp else ""
        result["status"] = "http_error"
        result["http_status"] = e.code
        result["response_body"] = body[:500]
        try:
            result["parsed_response"] = json.loads(body)
        except json.JSONDecodeError:
            result["parsed_response"] = None
    except urllib.error.URLError as e:
        result["status"] = "connection_error"
        result["error"] = str(e.reason)
    except Exception as e:
        result["status"] = "error"
        result["error"] = str(e)
    return result
```

### Retry Logic

Use exponential backoff for connection errors (not for HTTP auth failures, which won't resolve on retry):

```python
MAX_RETRIES = 3
RETRY_BASE_DELAY = 2  # seconds

def retry_request(url, data=None, headers=None, method="POST", timeout=10):
    last_result = None
    for attempt in range(MAX_RETRIES):
        result = make_request(url, data, headers, method, timeout)
        last_result = result
        if result["status"] == "success":
            return result
        if result["status"] == "connection_error":
            if attempt < MAX_RETRIES - 1:
                delay = RETRY_BASE_DELAY * (2 ** attempt)
                time.sleep(delay)
                continue
            return result
        else:
            # HTTP errors don't retry
            return result
    return last_result
```

## Message Formatting Protocol

### [SILENT] Prefix

The `[SILENT]` prefix is a swarm convention that suppresses notification sounds. Processing logic:

```python
SILENT_PREFIX = "[SILENT]"

def process_silent_prefix(message):
    """Strip [SILENT] prefix and return (clean_message, is_silent)."""
    is_silent = message.startswith(SILENT_PREFIX)
    clean_message = message[len(SILENT_PREFIX):].strip() if is_silent else message
    return clean_message, is_silent
```

**Platform mapping:**

| Platform | Silent Mechanism | Payload Field |
|---|---|---|
| Telegram | `disable_notification: true` | Native support |
| Slack (Webhook) | Not supported | Must use Web API |
| Slack (Web API) | `unfurl_link` + notification settings | `chat.postMessage` |
| Discord | `flags: 4` (SUPPRESS_EMBEDS) | Native support |

**Critical:** Always strip the `[SILENT]` prefix from the visible message text before sending. Never send it as visible text.

## Thread / Reply Delivery

### Platform Capabilities

| Platform | Webhook Threading | API Threading | Parameters |
|---|---|---|---|
| Slack | ❌ No | ✅ Yes | `thread_ts`, `reply_broadcast` |
| Telegram | N/A | ✅ Yes | `message_thread_id` (topics), `reply_to_message_id` (replies) |
| Discord | ✅ Yes | ✅ Yes | `thread_id`, `message_reference` |

### Slack Threading

**Critical:** Slack webhooks do NOT support threading. The `thread_ts` parameter is silently ignored by webhook endpoints.

For threading, must use the Slack Web API:

```python
# Endpoint: https://slack.com/api/chat.postMessage
# Requires: Bearer token (xoxb-...) with chat:write scope
payload = {
    "channel": "C00000000",
    "text": "Thread reply message",
    "thread_ts": "1234567890.123456",  # Parent message timestamp
    "reply_broadcast": False
}
headers = {
    "Content-Type": "application/json",
    "Authorization": f"Bearer {SLACK_BOT_TOKEN}"
}
```

### Telegram Threading

Two mechanisms:

1. **Forum topics** (Bot API 6.0+): `message_thread_id` parameter
2. **Traditional replies**: `reply_to_message_id` parameter

```python
# Forum topic reply
payload = {
    "chat_id": "-1001234567890",
    "message_thread_id": "1",
    "text": "Reply in topic",
    "parse_mode": "Markdown"
}

# Traditional reply
payload = {
    "chat_id": "-1001234567890",
    "text": "Reply to parent",
    "reply_to_message_id": 12345,
    "parse_mode": "Markdown"
}
```

## Error Response Parsing

### Platform Differences

| Platform | Error Format | Example |
|---|---|---|
| Telegram | Structured JSON | `{"ok":false,"error_code":401,"description":"Unauthorized"}` |
| Slack (Webhook) | Plain text | `no_team` |
| Slack (Web API) | Structured JSON | `{"ok":false,"error":"invalid_auth"}` |
| Discord | Structured JSON | `{"message":"Unauthorized","code":50001}` |

**Always attempt JSON parsing first, then fall back to plain text:**

```python
try:
    parsed = json.loads(body)
    # Use structured error fields
    error_code = parsed.get("error_code") or parsed.get("code")
    description = parsed.get("description") or parsed.get("error") or parsed.get("message")
except json.JSONDecodeError:
    # Plain text error — use body directly
    parsed = None
```

## Test Categories

Every messaging API test should cover these 5 categories:

1. **Accessibility** — Can we reach the endpoint? (HTTP status, response time)
2. **Message Formatting** — Is the payload correctly structured? ([SILENT] handling, field mapping)
3. **Thread Delivery** — Can we send threaded/reply messages? (platform-specific parameters)
4. **Error Handling** — How do failures manifest? (invalid tokens, bad payloads, timeouts)
5. **Error Response Parsing** — Can we programmatically parse error responses? (JSON vs plain text)

## Common Pitfalls

1. **Using Slack webhooks for threading.** Webhooks silently ignore `thread_ts`. Use the Web API (`chat.postMessage`) instead.

2. **Not stripping the `[SILENT]` prefix.** The prefix must be removed from the message text — it's a protocol directive, not visible content.

3. **Assuming all platforms return structured errors.** Slack webhooks return plain text (`no_team`), not JSON. Always try JSON first, then fall back.

4. **Not handling connection timeouts.** Use a timeout parameter (5-10s) and implement retry with exponential backoff for connection errors.

5. **Sending messages over the character limit.** Telegram enforces 4096 chars. Truncate before sending:
   ```python
   TELEGRAM_MAX_MSG_LEN = 4096
   def truncate_telegram_message(text):
       if len(text) > TELEGRAM_MAX_MSG_LEN:
           return text[:TELEGRAM_MAX_MSG_LEN - 3] + "..."
       return text
   ```

6. **Using placeholder credentials and expecting success.** Placeholder tokens/URLs will return auth errors (401/404). This is expected — the test verifies *connectivity*, not *delivery*.

7. **Not testing both silent and non-silent messages.** Always test the control case (no `[SILENT]` prefix) alongside the silent case.

## Verification Checklist

- [ ] Endpoint is reachable (HTTP response received, not connection error)
- [ ] `[SILENT]` prefix is stripped from message text
- [ ] `disable_notification` is correctly set based on `[SILENT]` prefix
- [ ] Thread/reply parameters are accepted by the API (even if auth fails)
- [ ] Error responses are parsed correctly (JSON when available, plain text fallback)
- [ ] Connection timeouts are handled with retry logic
- [ ] Message length limits are enforced (Telegram: 4096 chars)
- [ ] Both silent and non-silent message variants are tested

## One-Shot Recipes

### Quick Slack Webhook Test

```bash
export SLACK_WEBHOOK_URL="https://hooks.slack.com/services/..."
python3 -c "
import urllib.request, json
req = urllib.request.Request('$SLACK_WEBHOOK_URL',
    data=json.dumps({'text': 'test'}).encode(),
    headers={'Content-Type': 'application/json'})
print(urllib.request.urlopen(req, timeout=10).status)
"
```

### Quick Telegram Bot Test

```bash
export TELEGRAM_BOT_TOKEN="123456789:..."
curl "https://api.telegram.org/bot$TELEGRAM_BOT_TOKEN/getMe"
```

### Full Test Harness

See `references/test-harness-template.py` for a complete reusable test harness that covers all 5 test categories.

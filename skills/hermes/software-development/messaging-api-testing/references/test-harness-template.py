#!/usr/bin/env python3
"""
Messaging API Test Harness Template
====================================
Reusable template for testing Slack, Telegram, and other messaging APIs.

Configuration via environment variables:
    SLACK_WEBHOOK_URL  - Slack incoming webhook URL
    SLACK_BOT_TOKEN    - Slack bot token (xoxb-...) for Web API
    SLACK_CHANNEL      - Slack channel ID for Web API
    TELEGRAM_BOT_TOKEN - Telegram bot token from @BotFather
    TELEGRAM_CHAT_ID   - Telegram chat ID (user/group/channel)

Usage:
    # With real credentials
    export SLACK_WEBHOOK_URL="https://hooks.slack.com/services/..."
    export TELEGRAM_BOT_TOKEN="123456789:..."
    export TELEGRAM_CHAT_ID="-1001234567890"
    python3 test-harness-template.py

    # With placeholder credentials (connectivity testing only)
    python3 test-harness-template.py
"""

import urllib.request
import urllib.error
import json
import time
import ssl
import os
import sys

# SSL context (for testing only — don't disable verification in production)
ctx = ssl.create_default_context()
ctx.check_hostname = False
ctx.verify_mode = ssl.CERT_NONE

# ============================================================
# Configuration
# ============================================================
SLACK_WEBHOOK_URL = os.environ.get(
    "SLACK_WEBHOOK_URL",
    "https://hooks.slack.com/services/YOUR_SLACK_WEBHOOK_HERE"
)
SLACK_BOT_TOKEN = os.environ.get("SLACK_BOT_TOKEN", "xoxb-placeholder-token")
SLACK_CHANNEL = os.environ.get("SLACK_CHANNEL", "C00000000")

TELEGRAM_BOT_TOKEN = os.environ.get(
    "TELEGRAM_BOT_TOKEN",
    "123456789:AAHdqTcvCH1vGWXfOP4t8q4h5q4Q"
)
TELEGRAM_CHAT_ID = os.environ.get("TELEGRAM_CHAT_ID", "-1001234567890")

# Swarm protocol constants
SILENT_PREFIX = "[SILENT]"
MAX_RETRIES = 3
RETRY_BASE_DELAY = 2
REQUEST_TIMEOUT = 10
TELEGRAM_MAX_MSG_LEN = 4096


# ============================================================
# Core Functions
# ============================================================

def make_request(url, data=None, headers=None, method="POST", timeout=REQUEST_TIMEOUT):
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


def retry_request(url, data=None, headers=None, method="POST", timeout=REQUEST_TIMEOUT):
    """Make an HTTP request with retry logic (exponential backoff)."""
    last_result = None
    for attempt in range(MAX_RETRIES):
        result = make_request(url, data, headers, method, timeout)
        last_result = result
        if result["status"] == "success":
            return result
        if result["status"] == "connection_error":
            if attempt < MAX_RETRIES - 1:
                delay = RETRY_BASE_DELAY * (2 ** attempt)
                print(f"    Retry {attempt + 1}/{MAX_RETRIES} after {delay}s...")
                time.sleep(delay)
                continue
            return result
        else:
            return result
    return last_result


def process_silent_prefix(message):
    """Strip [SILENT] prefix and return (clean_message, is_silent)."""
    is_silent = message.startswith(SILENT_PREFIX)
    clean_message = message[len(SILENT_PREFIX):].strip() if is_silent else message
    return clean_message, is_silent


def truncate_telegram_message(text):
    """Truncate message to Telegram's 4096 character limit."""
    if len(text) > TELEGRAM_MAX_MSG_LEN:
        return text[:TELEGRAM_MAX_MSG_LEN - 3] + "..."
    return text


# ============================================================
# Test Categories
# ============================================================

def test_slack_accessibility():
    """Test 1: Slack webhook accessibility."""
    print("\n" + "=" * 60)
    print("TEST 1: Slack Webhook Accessibility")
    print("=" * 60)

    payload = {
        "text": "[OA-Team-30-Swarm] Agent 3 connectivity test",
        "username": "OA-Team-30-Swarm",
        "icon_emoji": ":robot_face:",
        "channel": "#swarm-delivery-test",
    }
    print(f"  Endpoint: {SLACK_WEBHOOK_URL}")
    data = json.dumps(payload).encode("utf-8")
    result = make_request(SLACK_WEBHOOK_URL, data=data,
                          headers={"Content-Type": "application/json"}, method="POST")
    print(f"  Status: {result['status']} (HTTP {result.get('http_status', 'N/A')})")
    if result.get("response_body"):
        print(f"  Response: {result['response_body'][:200]}")
    return {"slack_accessibility": result}


def test_telegram_connectivity():
    """Test 2: Telegram bot API connectivity."""
    print("\n" + "=" * 60)
    print("TEST 2: Telegram Bot API Connectivity")
    print("=" * 60)
    results = {}

    # getMe
    print("\n  --- getMe ---")
    getme_url = f"https://api.telegram.org/bot{TELEGRAM_BOT_TOKEN}/getMe"
    result = make_request(getme_url, method="GET")
    print(f"  Status: {result['status']} (HTTP {result.get('http_status', 'N/A')})")
    results["telegram_getme"] = result

    # sendMessage
    print("\n  --- sendMessage ---")
    sendmsg_url = f"https://api.telegram.org/bot{TELEGRAM_BOT_TOKEN}/sendMessage"
    payload = {
        "chat_id": TELEGRAM_CHAT_ID,
        "text": "[OA-Team-30-Swarm] Agent 3 connectivity test",
        "parse_mode": "Markdown",
        "disable_notification": True,
    }
    data = json.dumps(payload).encode("utf-8")
    result = make_request(sendmsg_url, data=data,
                          headers={"Content-Type": "application/json"}, method="POST")
    print(f"  Status: {result['status']} (HTTP {result.get('http_status', 'N/A')})")
    results["telegram_sendmsg"] = result
    return results


def test_silent_formatting():
    """Test 3: Message formatting with [SILENT] support."""
    print("\n" + "=" * 60)
    print("TEST 3: Message Formatting with [SILENT] Support")
    print("=" * 60)
    results = {}

    # Silent message
    print("\n  --- 3a: Silent Message ---")
    silent_msg = "[SILENT] Agent 3: Swarm heartbeat - all channels nominal"
    clean_msg, is_silent = process_silent_prefix(silent_msg)
    print(f"  Original: {silent_msg}")
    print(f"  Clean: {clean_msg}")
    print(f"  Is Silent: {is_silent}")

    # Slack payload
    slack_payload = {
        "text": clean_msg,
        "username": "OA-Team-30-Swarm",
        "icon_emoji": ":robot_face:",
        "channel": "#swarm-delivery-test",
        "disable_notification": is_silent,
    }
    data = json.dumps(slack_payload).encode("utf-8")
    slack_result = make_request(SLACK_WEBHOOK_URL, data=data,
                                headers={"Content-Type": "application/json"}, method="POST")
    print(f"  Slack: {slack_result['status']} (HTTP {slack_result.get('http_status', 'N/A')})")
    results["slack_silent"] = {"payload": slack_payload, "result": slack_result}

    # Telegram payload
    telegram_payload = {
        "chat_id": TELEGRAM_CHAT_ID,
        "text": clean_msg,
        "parse_mode": "Markdown",
        "disable_notification": is_silent,
    }
    data = json.dumps(telegram_payload).encode("utf-8")
    sendmsg_url = f"https://api.telegram.org/bot{TELEGRAM_BOT_TOKEN}/sendMessage"
    telegram_result = make_request(sendmsg_url, data=data,
                                   headers={"Content-Type": "application/json"}, method="POST")
    print(f"  Telegram: {telegram_result['status']} (HTTP {telegram_result.get('http_status', 'N/A')})")
    results["telegram_silent"] = {"payload": telegram_payload, "result": telegram_result}

    # Non-silent control
    print("\n  --- 3b: Non-Silent Message (control) ---")
    normal_msg = "Agent 3: Swarm status update - channels tested"
    clean_normal, is_silent_normal = process_silent_prefix(normal_msg)
    telegram_payload_normal = {
        "chat_id": TELEGRAM_CHAT_ID,
        "text": clean_normal,
        "parse_mode": "Markdown",
        "disable_notification": is_silent_normal,
    }
    data = json.dumps(telegram_payload_normal).encode("utf-8")
    result = make_request(sendmsg_url, data=data,
                          headers={"Content-Type": "application/json"}, method="POST")
    print(f"  Telegram: {result['status']} (HTTP {result.get('http_status', 'N/A')})")
    results["telegram_normal"] = {"payload": telegram_payload_normal, "result": result}
    return results


def test_thread_delivery():
    """Test 4: Thread delivery capability."""
    print("\n" + "=" * 60)
    print("TEST 4: Thread Delivery Capability")
    print("=" * 60)
    results = {}

    # 4a: Slack webhook (no thread support)
    print("\n  --- 4a: Slack Webhook (no thread support) ---")
    print("  NOTE: Slack webhooks do NOT support thread_ts parameter")
    slack_thread_payload = {
        "text": "Agent 3: Thread test message",
        "username": "OA-Team-30-Swarm",
        "icon_emoji": ":robot_face:",
        "channel": "#swarm-delivery-test",
        "thread_ts": "1234567890.123456",
    }
    data = json.dumps(slack_thread_payload).encode("utf-8")
    result = make_request(SLACK_WEBHOOK_URL, data=data,
                          headers={"Content-Type": "application/json"}, method="POST")
    print(f"  Result: {result['status']} (HTTP {result.get('http_status', 'N/A')})")
    results["slack_webhook_thread"] = {"payload": slack_thread_payload, "result": result}

    # 4b: Slack Web API (thread support)
    print("\n  --- 4b: Slack Web API chat.postMessage ---")
    slack_web_api_url = "https://slack.com/api/chat.postMessage"
    slack_web_payload = {
        "channel": SLACK_CHANNEL,
        "text": "Agent 3: Thread reply message",
        "thread_ts": "1234567890.123456",
        "reply_broadcast": False,
    }
    data = json.dumps(slack_web_payload).encode("utf-8")
    result = make_request(slack_web_api_url, data=data,
                          headers={"Content-Type": "application/json",
                                   "Authorization": f"Bearer {SLACK_BOT_TOKEN}"},
                          method="POST")
    print(f"  Result: {result['status']} (HTTP {result.get('http_status', 'N/A')})")
    results["slack_web_api_thread"] = {"payload": slack_web_payload, "result": result}

    # 4c: Telegram topic/thread
    print("\n  --- 4c: Telegram Topic/Thread ---")
    telegram_thread_payload = {
        "chat_id": TELEGRAM_CHAT_ID,
        "message_thread_id": "1",
        "text": "Agent 3: Thread reply in topic",
        "parse_mode": "Markdown",
        "disable_notification": False,
    }
    sendmsg_url = f"https://api.telegram.org/bot{TELEGRAM_BOT_TOKEN}/sendMessage"
    data = json.dumps(telegram_thread_payload).encode("utf-8")
    result = make_request(sendmsg_url, data=data,
                          headers={"Content-Type": "application/json"}, method="POST")
    print(f"  Result: {result['status']} (HTTP {result.get('http_status', 'N/A')})")
    results["telegram_thread"] = {"payload": telegram_thread_payload, "result": result}

    # 4d: Telegram reply_to_message_id
    print("\n  --- 4d: Telegram reply_to_message_id ---")
    telegram_reply_payload = {
        "chat_id": TELEGRAM_CHAT_ID,
        "text": "Agent 3: Reply to parent message",
        "reply_to_message_id": 12345,
        "parse_mode": "Markdown",
    }
    data = json.dumps(telegram_reply_payload).encode("utf-8")
    result = make_request(sendmsg_url, data=data,
                          headers={"Content-Type": "application/json"}, method="POST")
    print(f"  Result: {result['status']} (HTTP {result.get('http_status', 'N/A')})")
    results["telegram_reply"] = {"payload": telegram_reply_payload, "result": result}
    return results


def test_error_handling():
    """Test 5: Error handling for failed deliveries."""
    print("\n" + "=" * 60)
    print("TEST 5: Error Handling for Failed Deliveries")
    print("=" * 60)
    results = {}

    # 5a: Slack - Invalid JSON
    print("\n  --- 5a: Slack - Invalid JSON Payload ---")
    result = make_request(SLACK_WEBHOOK_URL, data=b"{invalid json",
                          headers={"Content-Type": "application/json"}, method="POST")
    print(f"  Result: {result['status']} (HTTP {result.get('http_status', 'N/A')})")
    results["slack_invalid_json"] = result

    # 5b: Slack - Empty payload
    print("\n  --- 5b: Slack - Empty Payload ---")
    result = make_request(SLACK_WEBHOOK_URL, data=b"",
                          headers={"Content-Type": "application/json"}, method="POST")
    print(f"  Result: {result['status']} (HTTP {result.get('http_status', 'N/A')})")
    results["slack_empty_payload"] = result

    # 5c: Telegram - Invalid token
    print("\n  --- 5c: Telegram - Invalid Token ---")
    bad_token_url = "https://api.telegram.org/botinvalid:token/sendMessage"
    payload = {"chat_id": TELEGRAM_CHAT_ID, "text": "Test"}
    data = json.dumps(payload).encode("utf-8")
    result = make_request(bad_token_url, data=data,
                          headers={"Content-Type": "application/json"}, method="POST")
    print(f"  Result: {result['status']} (HTTP {result.get('http_status', 'N/A')})")
    results["telegram_bad_token"] = result

    # 5d: Telegram - Message too long
    print("\n  --- 5d: Telegram - Message Too Long ---")
    long_text = "A" * 5000
    payload = {"chat_id": TELEGRAM_CHAT_ID, "text": long_text}
    data = json.dumps(payload).encode("utf-8")
    sendmsg_url = f"https://api.telegram.org/bot{TELEGRAM_BOT_TOKEN}/sendMessage"
    result = make_request(sendmsg_url, data=data,
                          headers={"Content-Type": "application/json"}, method="POST")
    print(f"  Result: {result['status']} (HTTP {result.get('http_status', 'N/A')})")
    results["telegram_too_long"] = result

    # 5e: Connection timeout
    print("\n  --- 5e: Connection Timeout ---")
    result = make_request("https://192.0.2.1/webhook", data=b'{"text":"test"}',
                          headers={"Content-Type": "application/json"}, method="POST", timeout=5)
    print(f"  Result: {result['status']}")
    if result.get("error"):
        print(f"  Error: {result['error']}")
    results["connection_timeout"] = result

    # 5f: Error response parsing - Telegram (JSON)
    print("\n  --- 5f: Error Response Parsing (Telegram JSON) ---")
    result = make_request(sendmsg_url, data=json.dumps({"chat_id": TELEGRAM_CHAT_ID, "text": "Test"}).encode("utf-8"),
                          headers={"Content-Type": "application/json"}, method="POST")
    print(f"  HTTP Status: {result.get('http_status', 'N/A')}")
    print(f"  Can parse JSON: {'YES' if result.get('parsed_response') else 'NO'}")
    if result.get("parsed_response"):
        print(f"  Parsed: {result['parsed_response']}")
    results["telegram_error_parse"] = result

    # 5g: Error response parsing - Slack (plain text)
    print("\n  --- 5g: Error Response Parsing (Slack plain text) ---")
    result = make_request(SLACK_WEBHOOK_URL, data=json.dumps({"text": "test"}).encode("utf-8"),
                          headers={"Content-Type": "application/json"}, method="POST")
    print(f"  HTTP Status: {result.get('http_status', 'N/A')}")
    print(f"  Can parse JSON: {'YES' if result.get('parsed_response') else 'NO'}")
    print(f"  Body type: {'JSON' if result.get('parsed_response') else 'plain text'}")
    results["slack_error_parse"] = result
    return results


# ============================================================
# Main
# ============================================================

def main():
    print("=" * 60)
    print("Messaging API Test Harness")
    print("=" * 60)

    using_placeholders = (
        "XXXXXXXXXXXXXXXXXXXXXXXX" in SLACK_WEBHOOK_URL
        or "placeholder" in SLACK_BOT_TOKEN.lower()
        or "AAHdqTcvCH1vGWXfOP4t8q4h5q4Q" in TELEGRAM_BOT_TOKEN
    )
    if using_placeholders:
        print("\n  ⚠️  Using PLACEHOLDER credentials — connectivity testing only")
        print("  Set environment variables for full testing")
    else:
        print("\n  ✅ Using real credentials from environment")

    all_results = {}
    all_results.update(test_slack_accessibility())
    all_results.update(test_telegram_connectivity())
    all_results.update(test_silent_formatting())
    all_results.update(test_thread_delivery())
    all_results.update(test_error_handling())

    print("\n" + "=" * 60)
    print("TEST SUMMARY")
    print("=" * 60)
    for test_name, result in all_results.items():
        status = result.get("status", "unknown") if isinstance(result, dict) else "unknown"
        if isinstance(result, dict) and "result" in result:
            status = result["result"].get("status", "unknown")
            http_status = result["result"].get("http_status", "N/A")
            print(f"  {test_name}: {status} (HTTP {http_status})")
        elif isinstance(result, dict):
            http_status = result.get("http_status", "N/A")
            print(f"  {test_name}: {status} (HTTP {http_status})")
        else:
            print(f"  {test_name}: {status}")

    output_file = os.path.join(os.path.dirname(os.path.abspath(__file__)), "test_results.json")
    with open(output_file, "w") as f:
        json.dump(all_results, f, indent=2, default=str)
    print(f"\n  Results saved to: {output_file}")
    print("\n" + "=" * 60)
    print("All tests complete.")
    print("=" * 60)


if __name__ == "__main__":
    main()
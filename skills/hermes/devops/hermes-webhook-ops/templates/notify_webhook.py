"""Reusable Hermes V2 outbound webhook notifier (copy into a service).

Usage:
    set HERMES_WEBHOOK_URL + HERMES_WEBHOOK_SECRET (or call configure()).
    notify("video_done", {"job_id":..., "title":..., "video_url":..., "status":"done"})

Signs V2 (X-Webhook-Signature-V2 = HMAC-SHA256 of "<ts>.<body>", plus
X-Webhook-Timestamp). Best-effort: never raises, returns bool.
"""
import hashlib
import hmac
import json
import os
import time

import httpx

URL = os.getenv("HERMES_WEBHOOK_URL", "")
SECRET = os.getenv("HERMES_WEBHOOK_SECRET", "")
_TIMEOUT = 10.0


def _v2_signature(secret: str, timestamp: str, body: bytes) -> str:
    return hmac.new(secret.encode(), f"{timestamp}.".encode() + body, hashlib.sha256).hexdigest()


def notify(event_type: str, payload: dict) -> bool:
    if not (URL and SECRET):
        return False
    payload = {"event_type": event_type, **payload}
    body = json.dumps(payload, ensure_ascii=False).encode()
    ts = str(int(time.time()))
    headers = {
        "Content-Type": "application/json",
        "X-Webhook-Signature-V2": _v2_signature(SECRET, ts, body),
        "X-Webhook-Timestamp": ts,
    }
    try:
        r = httpx.post(URL, content=body, headers=headers, timeout=_TIMEOUT)
        return r.status_code == 200
    except Exception:
        return False

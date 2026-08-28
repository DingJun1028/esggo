#!/usr/bin/env python3
"""
Collector Agent Template — Data Collection with Change Detection

Template for building data collector agents that:
1. Fetch data from an API
2. Compute a content hash of the data fields
3. Compare with the previous run's hash
4. Output [SILENT] if unchanged, [CHANGED] + summary if changed

Usage:
  - Customize FETCH_URL, OUTPUT_PATH, STATE_PATH
  - Customize build_data() to parse your API response
  - Customize compute_hash() to select which fields to hash
  - Run periodically via cron or manually

Dependencies: Python 3 standard library only (urllib, json, hashlib, os, sys, datetime)
"""
import json
import hashlib
import os
import sys
from datetime import datetime, timezone

# === CONFIGURE THESE ===
FETCH_URL = "https://api.open-meteo.com/v1/forecast?latitude=25.0320&longitude=121.5654&current=temperature_2m,relative_humidity_2m,weather_code,wind_speed_10m&hourly=temperature_2m,relative_humidity_2m,weather_code,wind_speed_10m&forecast_days=1&timezone=Asia/Taipei"
OUTPUT_PATH = "/c/tmp/oateam-data/weather_data.json"
STATE_PATH = "/c/tmp/oateam-data/collection_state.json"
STATE_KEY = "weather_data_hash"
# =======================


def fetch_data(url):
    """Fetch JSON data from an API endpoint."""
    import urllib.request
    with urllib.request.urlopen(url, timeout=20) as resp:
        return json.loads(resp.read().decode())


def build_data(raw_data):
    """
    Parse raw API response into normalized data structure.
    Customize this for your specific API.
    """
    # Example: extract current weather and 24-hour forecast
    current = raw_data.get("current", {})
    hourly = raw_data.get("hourly", {})
    times = hourly.get("time", [])
    temps = hourly.get("temperature_2m", [])
    humids = hourly.get("relative_humidity_2m", [])
    wmo_codes = hourly.get("weather_code", [])
    winds = hourly.get("wind_speed_10m", [])

    forecast_24h = []
    for i in range(min(24, len(times))):
        forecast_24h.append({
            "time": times[i],
            "temperature_c": temps[i] if i < len(temps) else None,
            "humidity_percent": humids[i] if i < len(humids) else None,
            "wind_speed_kmh": winds[i] if i < len(winds) else None,
        })

    return {
        "timestamp": datetime.now(timezone.utc).isoformat(),
        "current": {
            "temperature_c": current.get("temperature_2m"),
            "humidity_percent": current.get("relative_humidity_2m"),
            "wind_speed_kmh": current.get("wind_speed_10m"),
        },
        "forecast_24h": forecast_24h,
    }


def compute_hash(data):
    """
    Compute SHA-256 hash of data fields ONLY (exclude timestamp, hash, metadata).
    This ensures the hash is stable across runs when the actual data hasn't changed.
    """
    hash_content = {
        "current": data["current"],
        "forecast_24h": data["forecast_24h"],
    }
    content_str = json.dumps(hash_content, sort_keys=True, ensure_ascii=False)
    return hashlib.sha256(content_str.encode("utf-8")).hexdigest()


def load_previous_hash():
    """Load the previous content hash from the state file."""
    if os.path.exists(STATE_PATH):
        try:
            with open(STATE_PATH, "r") as f:
                state = json.load(f)
            return state.get(STATE_KEY)
        except (json.JSONDecodeError, IOError):
            return None
    return None


def save_state(content_hash):
    """Save the content hash to the state file."""
    state = {}
    if os.path.exists(STATE_PATH):
        try:
            with open(STATE_PATH, "r") as f:
                state = json.load(f)
        except (json.JSONDecodeError, IOError):
            state = {}
    state[STATE_KEY] = content_hash
    state["last_updated"] = datetime.now(timezone.utc).isoformat()
    os.makedirs(os.path.dirname(STATE_PATH), exist_ok=True)
    with open(STATE_PATH, "w") as f:
        json.dump(state, f, indent=2)


def main():
    # 1. Fetch data
    try:
        raw_data = fetch_data(FETCH_URL)
    except Exception as e:
        print(f"[ERROR] Failed to fetch data: {e}")
        sys.exit(1)

    # 2. Build normalized data
    data = build_data(raw_data)

    # 3. Compute content hash
    content_hash = compute_hash(data)

    # 4. Compare with previous run
    previous_hash = load_previous_hash()

    if previous_hash == content_hash:
        print("[SILENT]")
        return

    # 5. Data changed (or first run) — save and report
    data["content_hash"] = content_hash
    data["data_changed"] = previous_hash is not None

    os.makedirs(os.path.dirname(OUTPUT_PATH), exist_ok=True)
    with open(OUTPUT_PATH, "w") as f:
        json.dump(data, f, indent=2, ensure_ascii=False)

    save_state(content_hash)

    # 6. Output summary
    print(f"[CHANGED] Data collected")
    print(f"  Content hash: {content_hash[:16]}...")
    print(f"  Saved to: {OUTPUT_PATH}")


if __name__ == "__main__":
    main()

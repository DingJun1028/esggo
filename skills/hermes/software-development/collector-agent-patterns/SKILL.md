---
name: collector-agent-patterns
description: "Patterns for building data collector agents that fetch from APIs, detect changes via content hashing, and output [SILENT] or [CHANGED] based on whether data changed since the last run."
version: 1.0.0
author: Hermes Agent
license: MIT
metadata:
  hermes:
    tags: [data-collection, change-detection, api, collector, hashing, state-management]
    related_skills: [messaging-api-testing, hermes-usage-best-practices, systematic-debugging]
---

# Collector Agent Patterns

## Overview

This skill documents patterns for building data collector agents — scripts or agent workflows that periodically fetch data from APIs, detect whether the data has changed since the last run, and produce minimal output when nothing changed.

The core pattern: **fetch → hash → compare → output**. When the hash matches the previous run, output `[SILENT]` to avoid noise. When it differs, output `[CHANGED]` with a summary and persist the new hash.

This is distinct from the `[SILENT]` prefix in `messaging-api-testing` (which suppresses notification sounds). Here, `[SILENT]` means "no data change detected" — a swarm convention for collector agents to signal they ran but found nothing new.

## When to Use

- Building a scheduled data collector that fetches from an API (weather, stock prices, sensor data, etc.)
- You want to avoid noisy output on every run when data hasn't changed
- You need cross-run state persistence (hash comparison across sessions)
- You want to use free/no-API-key alternatives when primary APIs reject placeholder credentials

## Core Pattern: Fetch → Hash → Compare → Output

### 1. Content Hash for Change Detection

Compute a SHA-256 hash of the **data fields only** (excluding timestamp, hash, or other metadata that changes on every run):

```python
import hashlib, json

def compute_hash(data):
    """Hash only weather-relevant fields, not the timestamp."""
    hash_content = {
        "current_weather": data["current_weather"],
        "forecast_24h": data["forecast_24h"],
    }
    content_str = json.dumps(hash_content, sort_keys=True, ensure_ascii=False)
    return hashlib.sha256(content_str.encode("utf-8")).hexdigest()
```

**Critical:** Exclude volatile fields (timestamps, content_hash itself, data_changed flag) from the hash. Otherwise the hash will differ on every run even if the actual data is identical.

### 2. State File Persistence

Store the previous hash in a shared state file so it persists across sessions:

```python
import os, json

STATE_PATH = "/c/tmp/oateam-data/collection_state.json"

def load_previous_hash():
    if os.path.exists(STATE_PATH):
        try:
            with open(STATE_PATH, "r") as f:
                state = json.load(f)
            return state.get("weather_data_hash")
        except (json.JSONDecodeError, IOError):
            return None
    return None

def save_state(content_hash):
    state = {}
    if os.path.exists(STATE_PATH):
        try:
            with open(STATE_PATH, "r") as f:
                state = json.load(f)
        except (json.JSONDecodeError, IOError):
            state = {}
    state["weather_data_hash"] = content_hash
    state["weather_data_last_updated"] = datetime.now(timezone.utc).isoformat()
    with open(STATE_PATH, "w") as f:
        json.dump(state, f, indent=2)
```

### 3. Output Convention

```python
if previous_hash == content_hash:
    print("[SILENT]")
    return

# Data changed (or first run) — save and report
weather_data["content_hash"] = content_hash
weather_data["data_changed"] = previous_hash is not None

with open(OUTPUT_PATH, "w") as f:
    json.dump(weather_data, f, indent=2, ensure_ascii=False)

save_state(content_hash)

print(f"[CHANGED] Weather data collected for Taipei")
print(f"  Temperature: {cw['temperature_c']}°C")
print(f"  Humidity: {cw['humidity_percent']}%")
print(f"  Conditions: {cw['conditions']}")
print(f"  Content hash: {content_hash[:16]}...")
```

## Free Weather API Fallbacks

When OpenWeatherMap rejects a placeholder API key (401), use these no-key-required alternatives:

| API | URL | Notes |
|---|---|---|
| **Open-Meteo** | `https://api.open-meteo.com/v1/forecast?latitude=25.0320&longitude=121.5654&current=temperature_2m,relative_humidity_2m,weather_code,wind_speed_10m&hourly=temperature_2m,relative_humidity_2m,weather_code,wind_speed_10m&forecast_days=1&timezone=Asia/Taipei` | Clean JSON, WMO weather codes, no key needed |
| **wttr.in** | `https://wttr.in/Taipei?format=j1` | Rich JSON, includes feels-like, pressure, UV, daily summary. Slower, larger response |

**Strategy:** Try Open-Meteo first (clean structured data), fall back to wttr.in for additional fields (feels-like, pressure, UV index).

### WMO Weather Code Mapping

Open-Meteo uses WMO weather codes. Map them to human-readable descriptions:

```python
WMO_CODES = {
    0: "Clear sky",
    1: "Mainly clear",
    2: "Partly cloudy",
    3: "Overcast",
    45: "Fog",
    48: "Depositing rime fog",
    51: "Light drizzle",
    53: "Moderate drizzle",
    55: "Dense drizzle",
    61: "Slight rain",
    63: "Moderate rain",
    71: "Slight snow fall",
    73: "Moderate snow fall",
    75: "Heavy snow fall",
    80: "Slight rain showers",
    81: "Moderate rain showers",
    82: "Violent rain showers",
    95: "Thunderstorm",
    96: "Thunderstorm with slight hail",
    99: "Thunderstorm with heavy hail",
}
```

## Common Pitfalls

1. **Including timestamp in the hash.** The hash will differ on every run even if the actual data is identical. Only hash the data fields that represent the actual weather conditions.

   **Variant — `collected_at` embedded in the data dict:** When the data structure itself includes a `collected_at` or `timestamp` field (e.g., `crypto_data["collected_at"] = datetime.now(...)`), you must exclude it from the hash computation. Simply avoiding a separate timestamp variable is not enough — the field lives inside the dict that gets serialized. Fix: build a filtered copy before hashing:
   ```python
   hash_content = {k: v for k, v in data.items() if k not in ("collected_at", "timestamp", "content_hash")}
   content_str = json.dumps(hash_content, sort_keys=True, ensure_ascii=False)
   ```

2. **Not handling first-run correctly.** On the first run, there is no previous hash. This should be treated as "changed" (output `[CHANGED]`, not `[SILENT]`).

3. **Assuming all APIs need keys.** Open-Meteo and wttr.in provide real weather data without API keys. When a placeholder key is rejected (401), try these alternatives before giving up.

4. **Not stripping the `[SILENT]` prefix from visible output.** In the messaging context, the prefix must be removed from message text. In the collector context, `[SILENT]` IS the entire output — it's not a prefix on a longer message.

5. **State file corruption.** Always wrap state file reads in try/except for JSONDecodeError and IOError. A corrupted state file should cause a "first run" behavior, not a crash.

6. **Path issues on Windows/MSYS.** The script may use `/c/tmp/...` (MSYS path) while the read_file tool expects `C:/tmp/...`. Use consistent paths and verify file existence after writing.

   **Variant — Windows Python misinterprets `/c/` as relative:** When running a Python script via Windows Python (not MSYS bash), `/c/tmp/...` is interpreted as a relative path, causing files to be saved to `C:\c\tmp\...` instead of `C:\tmp\...`. Fix: use forward-slash Windows paths (`C:/tmp/...`) in Python file operations, not MSYS-style paths (`/c/tmp/...`). The bash shell handles `/c/` correctly, but Windows Python does not.

## Verification Checklist

- [ ] Content hash excludes timestamp and metadata fields
- [ ] First run outputs `[CHANGED]` (no previous hash to compare)
- [ ] Second run with unchanged data outputs `[SILENT]`
- [ ] State file persists hash across sessions
- [ ] State file read is wrapped in try/except for corruption
- [ ] Output file is written to the correct path
- [ ] Free API fallback works when primary API rejects placeholder key

## See Also

- `references/weather-api-fallbacks.md` — session-specific API discovery and WMO code mapping
- `references/crypto-collection-session.md` — CoinGecko API endpoint, field mapping, and Windows path gotcha from crypto data collection session
- `templates/collector-agent-template.py` — reusable collector agent script
- `messaging-api-testing` — for `[SILENT]` prefix usage in messaging platforms (different context)

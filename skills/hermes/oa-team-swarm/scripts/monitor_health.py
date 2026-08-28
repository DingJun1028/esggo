#!/usr/bin/env python3
"""
OA-Team 30 Swarm - Silent Monitoring Script
Mission: Continuous system health monitoring with minimal noise
Protocol: 5T | Entropy: 0.1 | Status: 4Can1Cannot
"""

import requests
import json
import os
from datetime import datetime

# Configuration
HEALTH_ENDPOINT = "https://api.example.com/health"
STATE_FILE = "/tmp/oateam-data/last_health_check.json"
TELEGRAM_CHAT_ID = "-1001234567890"
TELEGRAM_THREAD_ID = "17585"

def check_health():
    """Check system health endpoint."""
    try:
        response = requests.get(HEALTH_ENDPOINT, timeout=10)
        return {
            "status": "OK" if response.status_code == 200 else "WARNING",
            "http_code": response.status_code,
            "timestamp": datetime.utcnow().isoformat(),
            "response_time_ms": round(response.elapsed.total_seconds() * 1000, 2)
        }
    except requests.exceptions.RequestException as e:
        return {
            "status": "ERROR",
            "error": str(e),
            "timestamp": datetime.utcnow().isoformat()
        }

def load_previous_state():
    """Load previous health check state."""
    if os.path.exists(STATE_FILE):
        with open(STATE_FILE, 'r') as f:
            return json.load(f)
    return None

def save_current_state(state):
    """Save current health check state."""
    os.makedirs(os.path.dirname(STATE_FILE), exist_ok=True)
    with open(STATE_FILE, 'w') as f:
        json.dump(state, f, indent=2)

def main():
    current_state = check_health()
    previous_state = load_previous_state()
    
    # Compare states
    if previous_state and previous_state == current_state:
        print("[SILENT]")
        return
    
    # State changed or first run
    save_current_state(current_state)
    
    # Output for agent reasoning
    output = {
        "health_check": current_state,
        "changed": previous_state is None or previous_state != current_state,
        "previous": previous_state
    }
    
    print(json.dumps(output, indent=2))

if __name__ == "__main__":
    main()

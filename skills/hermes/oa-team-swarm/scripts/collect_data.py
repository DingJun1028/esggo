#!/usr/bin/env python3
"""
OA-Team 30 Swarm - Data Collection Script
Mission: Structured data gathering from multiple sources
Protocol: 5T | Entropy: 0.1 | Status: 4Can1Cannot
"""

import requests
import json
import os
import hashlib
from datetime import datetime

# Configuration
DATA_SOURCES = [
    {
        "name": "primary_api",
        "url": "https://api.example.com/data",
        "type": "json"
    },
    {
        "name": "metrics_api",
        "url": "https://api.example.com/metrics",
        "type": "json"
    }
]

OUTPUT_DIR = "/tmp/oateam-data"
STATE_FILE = os.path.join(OUTPUT_DIR, "collection_state.json")

def fetch_data(source):
    """Fetch data from a source."""
    try:
        response = requests.get(source["url"], timeout=30)
        response.raise_for_status()
        
        if source["type"] == "json":
            data = response.json()
        else:
            data = response.text
        
        return {
            "source": source["name"],
            "status": "OK",
            "data": data,
            "timestamp": datetime.utcnow().isoformat(),
            "content_hash": hashlib.md5(
                json.dumps(data, sort_keys=True).encode()
            ).hexdigest()
        }
    except Exception as e:
        return {
            "source": source["name"],
            "status": "ERROR",
            "error": str(e),
            "timestamp": datetime.utcnow().isoformat()
        }

def load_previous_hashes():
    """Load previous data hashes for change detection."""
    if os.path.exists(STATE_FILE):
        with open(STATE_FILE, 'r') as f:
            return json.load(f)
    return {}

def save_current_hashes(hashes):
    """Save current data hashes."""
    os.makedirs(OUTPUT_DIR, exist_ok=True)
    with open(STATE_FILE, 'w') as f:
        json.dump(hashes, f, indent=2)

def main():
    previous_hashes = load_previous_hashes()
    results = []
    current_hashes = {}
    all_unchanged = True
    
    for source in DATA_SOURCES:
        result = fetch_data(source)
        results.append(result)
        
        if result["status"] == "OK":
            current_hashes[source["name"]] = result["content_hash"]
            
            # Check if data changed
            if previous_hashes.get(source["name"]) != result["content_hash"]:
                all_unchanged = False
                
                # Save data to file
                data_file = os.path.join(OUTPUT_DIR, f"{source['name']}.json")
                with open(data_file, 'w') as f:
                    json.dump(result["data"], f, indent=2)
    
    # Update state
    save_current_hashes(current_hashes)
    
    # Output result
    if all_unchanged and previous_hashes:
        print("[SILENT]")
    else:
        output = {
            "collection_time": datetime.utcnow().isoformat(),
            "sources_checked": len(DATA_SOURCES),
            "results": results,
            "all_unchanged": all_unchanged
        }
        print(json.dumps(output, indent=2))

if __name__ == "__main__":
    main()

#!/usr/bin/env python3
import os
import re

config_path = '/var/www/esggo/ecosystem.config.cjs'

with open(config_path, 'r') as f:
    content = f.read()

# Read key from a file (we'll write it there first)
key_file = '/tmp/openrouter-key.txt'
if os.path.exists(key_file):
    with open(key_file, 'r') as f:
        full_key = f.read().strip()
    
    # Replace truncated key
    old_match = re.search(r"OPENROUTER_API_KEY: '([^']*)'", content)
    if old_match:
        old_key = old_match.group(1)
        content = content.replace(f"OPENROUTER_API_KEY: '{old_key}'", f"OPENROUTER_API_KEY: '{full_key}'")
        
        with open(config_path, 'w') as f:
            f.write(content)
        
        print(f"Key updated! Length: {len(full_key)}")
        print(f"Key starts with: {full_key[:15]}...")
    else:
        print("ERROR: Could not find existing key pattern")
else:
    print(f"ERROR: {key_file} not found. Create it first with the full key.")

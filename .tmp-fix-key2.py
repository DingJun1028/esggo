#!/usr/bin/env python3
import os
import sys

# Read the current ecosystem config
config_path = '/var/www/esggo/ecosystem.config.cjs'
with open(config_path, 'r') as f:
    content = f.read()

# The key is already truncated in the file. Let's check what's there
import re
match = re.search(r"OPENROUTER_API_KEY: '([^']*)'", content)
if match:
    current_key = match.group(1)
    print(f"Current key length: {len(current_key)}")
    print(f"Current key: {current_key[:10]}...{current_key[-5:]}")
else:
    print("Key not found!")
    sys.exit(1)

# Read the FULL key from environment variable
full_key = os.environ.get('OPENROUTER_API_KEY', '')
if not full_key or len(full_key) < 50:
    print(f"ERROR: OPENROUTER_API_KEY env var not set or too short (len={len(full_key)})")
    sys.exit(1)

print(f"New key length: {len(full_key)}")
print(f"New key: {full_key[:10]}...{full_key[-5:]}")

# Replace
content = content.replace(f"OPENROUTER_API_KEY: '{current_key}'", f"OPENROUTER_API_KEY: '{full_key}'")

with open(config_path, 'w') as f:
    f.write(content)

print("Key updated successfully!")

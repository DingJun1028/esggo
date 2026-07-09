#!/usr/bin/env python3
"""Patch orchestrator config.yaml with API_SERVER_PORT and API_SERVER_KEY from environment."""
import os
import sys

path = r'C:\Users\Administrator\AppData\Local\hermes\profiles\orchestrator\config.yaml'
api_key = os.environ.get('API_SERVER_KEY')
if not api_key:
    print("ERROR: API_SERVER_KEY environment variable is required", file=sys.stderr)
    sys.exit(1)

with open(path, 'r', encoding='utf-8') as f:
    content = f.read()

old = "API_SERVER_HOST: 0.0.0.0\n"
new = f"API_SERVER_HOST: 0.0.0.0\nAPI_SERVER_PORT: 8642\nAPI_SERVER_KEY: {api_key}\n"
if old not in content:
    raise SystemExit('Target block not found')
if 'API_SERVER_PORT:' in content or 'API_SERVER_KEY:' in content:
    raise SystemExit('Keys already present')
content = content.replace(old, new, 1)
with open(path, 'w', encoding='utf-8') as f:
    f.write(content)
print('patched')

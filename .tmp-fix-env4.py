import os

# Read the full key from file (already on VPS)
with open('/tmp/openrouter-key.txt', 'r') as f:
    full_key = f.read().strip()

print(f"Key length: {len(full_key)}")

# Fix .env file - read current content and replace
env_path = '/var/www/esggo/.env'
with open(env_path, 'r') as f:
    content = f.read()

# Replace OPENROUTER_API_KEY - match the pattern OPENROUTER_API_KEY=<anything>
import re
content = re.sub(
    r'OPENROUTER_API_KEY=[^\n]*',
    f'OPENROUTER_API_KEY=***',
    content
)

# Also update AI_MODEL
content = re.sub(
    r'AI_MODEL=[^\n]*',
    'AI_MODEL=google/gemini-2.5-flash-preview:free',
    content
)

with open(env_path, 'w') as f:
    f.write(content)

# Verify
with open(env_path, 'r') as f:
    for line in f:
        if 'OPENROUTER_API_KEY' in line:
            print(line.strip())
        if 'AI_MODEL' in line:
            print(line.strip())

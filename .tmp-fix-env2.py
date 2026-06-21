import os

env_path = '/var/www/esggo/.env'
key_file = '/tmp/openrouter-key.txt'

# Read full key
with open(key_file, 'r') as f:
    full_key = f.read().strip()

# Read .env
with open(env_path, 'r') as f:
    content = f.read()

# Replace OPENROUTER_API_KEY
lines = content.split('\n')
new_lines = []
for line in lines:
    if line.startswith('OPENROUTER_API_KEY='):
        new_lines.append(f'OPENROUTER_API_KEY={full_key}')
    elif line.startswith('AI_MODEL='):
        new_lines.append('AI_MODEL=google/gemini-2.5-flash-preview:free')
    else:
        new_lines.append(line)

with open(env_path, 'w') as f:
    f.write('\n'.join(new_lines))

print(f"Fixed .env: OPENROUTER_API_KEY length = {len(full_key)}")

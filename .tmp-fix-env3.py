import os

# Read the full key from file
with open('/tmp/openrouter-key.txt', 'r') as f:
    full_key = f.read().strip()

print(f"Key length: {len(full_key)}")

# Fix .env file
env_path = '/var/www/esggo/.env'
with open(env_path, 'r') as f:
    content = f.read()

# Replace OPENROUTER_API_KEY line
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

# Verify
with open(env_path, 'r') as f:
    for line in f:
        if 'OPENROUTER_API_KEY' in line:
            print(line.strip())
        if 'AI_MODEL' in line:
            print(line.strip())

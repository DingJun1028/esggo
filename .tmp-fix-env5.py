import re

# Read key from file
with open('/tmp/openrouter-key.txt', 'r') as f:
    key = f.read().strip()

# Read .env
with open('/var/www/esggo/.env', 'r') as f:
    content = f.read()

# Use re.sub with a callback to avoid shell escaping issues
def replace_key(match):
    return f'OPENROUTER_API_KEY={key}'

content = re.sub(r'OPENROUTER_API_KEY=\S+', replace_key, content)

# Update model
content = re.sub(r'AI_MODEL=\S+', 'AI_MODEL=google/gemini-2.5-flash-preview:free', content)

# Write back
with open('/var/www/esggo/.env', 'w') as f:
    f.write(content)

# Verify
for line in content.split('\n'):
    if 'OPENROUTER_API_KEY' in line or 'AI_MODEL' in line:
        print(line)

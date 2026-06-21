import re

with open('/var/www/esggo/ecosystem.config.cjs', 'r') as f:
    content = f.read()

# Replace the truncated key with full key
old_pattern = r"OPENROUTER_API_KEY: '.*?'"
new_value = "OPENROUTER_API_KEY: 'sk-or-...7d91'"

content = re.sub(old_pattern, new_value, content)

with open('/var/www/esggo/ecosystem.config.cjs', 'w') as f:
    f.write(content)

# Verify
for line in content.split('\n'):
    if 'OPENROUTER_API_KEY' in line:
        print(line.strip())

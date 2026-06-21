import re

config_path = '/var/www/esggo/ecosystem.config.cjs'
with open(config_path, 'r') as f:
    content = f.read()

# Change model
content = content.replace(
    "OPENROUTER_MODEL: 'google/gemma-4-31b-it:free'",
    "OPENROUTER_MODEL: 'google/gemini-2.5-flash-preview:free'"
)

with open(config_path, 'w') as f:
    f.write(content)

print("Model updated to gemini-2.5-flash-preview:free")

import os

env_path = '/var/www/esggo/.env'
with open(env_path, 'r') as f:
    content = f.read()

# Read the full key from the file we created earlier
key_file = '/tmp/openrouter-key.txt'
if os.path.exists(key_file):
    with open(key_file, 'r') as f:
        full_key = f.read().strip()
    
    # Replace OPENROUTER_API_KEY in .env
    lines = content.split('\n')
    new_lines = []
    for line in lines:
        if line.startswith('OPENROUTER_API_KEY='):
            new_lines.append(f'OPENROUTER_API_KEY={full_key}')
        else:
            new_lines.append(line)
    
    with open(env_path, 'w') as f:
        f.write('\n'.join(new_lines))
    
    print(f"Updated .env with key (length: {len(full_key)})")
else:
    print("ERROR: /tmp/openrouter-key.txt not found")

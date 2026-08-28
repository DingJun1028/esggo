import subprocess

def sync_secret_to_vps(host, path, key, value):
    # Use python to safely update the file via SSH to avoid bash escaping issues
    update_script = f"""
import re
try:
    with open('{path}', 'r') as f:
        content = f.read()
    content = re.sub(r'^{key}=[^\\n]*', f'{key}={value}', content, flags=re.M)
    with open('{path}', 'w') as f:
        f.write(content)
    print('SUCCESS')
except Exception as e:
    print(f'ERROR: {{e}}')
"""
    cmd = ["ssh", host, f"python3 -c \"{update_script}\""]
    return subprocess.run(cmd, capture_output=True, text=True)

# Example usage:
# sync_secret_to_vps("root@161.118.248.180", "/var/www/esggo/.env", "OPENAI_API_KEY", "sk-...")

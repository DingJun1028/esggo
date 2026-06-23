#!/usr/bin/env python3
import subprocess

# The actual full service role key
SERVICE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inlod2ZtYXZuaGFpdnZnemV1a2x4Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3ODY1ODMwMywiZXhwIjoyMDk0MjM0MzAzfQ.cxcOdo70lCOVSwtgF_ShqKSgkYZ_Md6r1C63Kuuob3U"

# Step 1: Write .env.local
local_content = f"""NEXT_PUBLIC_SUPABASE_URL=https://yhwfmavnhaivvgzeuklx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=sb_publishable_a6BWUna2fFNZ3fba80ixiA_xgpxYl_e
SUPABASE_SERVICE_ROLE_KEY={SERVICE_KEY}
"""

cmd = ["ssh", "root@161.118.248.180", f"cat > /var/www/esggo/.env.local << 'ENVEOF'\n{local_content}\nENVEOF"]
result = subprocess.run(cmd, capture_output=True, text=True)
print("Step 1 (.env.local):", "OK" if result.returncode == 0 else result.stderr)

# Step 2: Update .env service role key using Python (safe from bash escaping issues)
update_script = f"""
import re
content = open('.env').read()
content = re.sub(r'SUPABASE_SERVICE_ROLE_KEY=[^\\n]+', 'SUPABASE_SERVICE_ROLE_KEY={SERVICE_KEY}', content)
open('.env', 'w').write(content)
print('Done')
"""

cmd2 = ["ssh", "root@161.118.248.180", f"cd /var/www/esggo && python3 -c \"{update_script}\""]
result2 = subprocess.run(cmd2, capture_output=True, text=True)
print("Step 2 (.env):", "OK" if result2.returncode == 0 else result2.stderr)

# Step 3: Verify
cmd3 = ["ssh", "root@161.118.248.180", "echo '=== .env ===' && grep -n SUPABASE /var/www/esggo/.env && echo '=== .env.local ===' && cat /var/www/esggo/.env.local"]
result3 = subprocess.run(cmd3, capture_output=True, text=True)
print("Step 3 (verify):")
print(result3.stdout)

if result3.stderr:
    print("ERR:", result3.stderr)

#!/usr/bin/env python3
"""Update VPS .env.local with new Supabase keys"""
import subprocess

key = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inlod2ZtYXZuaGFpdnZnemV1a2x4Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3ODY1ODMwMywiZXhwIjoyMDk0MjM0MzAzfQ.cxcOdo70lCOVSwtgF_SHqKSgkYZ_Md6r1C63Kuuob3U"

# Write to .env.local via ssh
cmd = [
    "ssh", "root@161.118.248.180",
    "cat > /var/www/esggo/.env.local << 'EOF'\n"
    f"NEXT_PUBLIC_SUPABASE_URL=https://yhwfmavnhaivvgzeuklx.supabase.co\n"
    f"NEXT_PUBLIC_SUPABASE_ANON_KEY=sb_publishable_a6BWUna2fFNZ3fba80ixiA_xgpxYl_e\n"
    f"SUPABASE_SERVICE_ROLE_KEY={key}\n"
    "EOF"
]

result = subprocess.run(cmd, capture_output=True, text=True)
print(result.stdout, result.stderr)

# Also update .env
cmd2 = [
    "ssh", "root@161.118.248.180",
    "cd /var/www/esggo && sed -i "
    f"/^SUPABASE_SERVICE_ROLE_KEY=/c\\SUPABASE_SERVICE_ROLE_KEY={key}"
    " .env"
]
result2 = subprocess.run(cmd2, capture_output=True, text=True)
print(result2.stdout, result2.stderr)

# Verify
cmd3 = ["ssh", "root@161.118.248.180", "echo '=== .env ===' && grep SUPABASE /var/www/esggo/.env && echo '=== .env.local ===' && cat /var/www/esggo/.env.local"]
result3 = subprocess.run(cmd3, capture_output=True, text=True)
print(result3.stdout)

import re

# Read the actual service role key from user's message
# The full JWT is: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inlod2ZtYXZuaGFpdnZnemV1a2x4Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3ODY1ODMwMywiZXhwIjoyMDk0MjM0MzAzfQ.cxcOdo70lCOVSwtgF_SHqKSgkYZ_Md6r1C63Kuuob3U
# But we need to get it from the user's latest message

# For now, let me read what's in the VPS .env and check if it needs updating
import subprocess
result = subprocess.run(
    ["ssh", "root@161.118.248.180", "cat /var/www/esggo/.env | grep SUPABASE_SERVICE_ROLE"],
    capture_output=True, text=True
)
print("Current service role key on VPS:")
print(result.stdout[:200])

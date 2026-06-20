import requests
import json
import re
import sys

# Read .env directly
with open('.env', 'r', encoding='utf-8') as f:
    env_content = f.read()

def get_env(key):
    m = re.search(rf'^{re.escape(key)}=(.*)$', env_content, re.MULTILINE)
    return m.group(1).strip() if m else None

url = get_env('NEXT_PUBLIC_SUPABASE_URL')
anon_key = get_env('NEXT_PUBLIC_SUPABASE_ANON_KEY')
service_key = get_env('SUPABASE_SERVICE_ROLE_KEY')

print(f"URL: {url}")
print(f"Anon key prefix: {anon_key[:25] if anon_key else None}")
print(f"Service key prefix: {service_key[:25] if service_key else None}")

# Test connection with a simple query
headers = {
    'apikey': anon_key,
    'Authorization': f'Bearer {anon_key}',
    'Content-Type': 'application/json',
    'Prefer': 'return=minimal'
}

# Try to count existing rows
resp = requests.get(f"{url}/rest/v1/reading_room_documents?select=id&limit=1", headers=headers)
print(f"\nTest status: {resp.status_code}")
print(f"Test response: {resp.text[:300]}")

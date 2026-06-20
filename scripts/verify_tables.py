import requests
import re

with open('.env', encoding='utf-8-sig') as f:
    env = f.read()
url = re.search(r'^NEXT_PUBLIC_SUPABASE_URL=(.*)$', env, re.M).group(1)
key = re.search(r'^SUPABASE_SERVICE_ROLE_KEY=(.*)$', env, re.M).group(1)

# Try service role key directly
h = {
    'apikey': key,
    'Authorization': f'Bearer {key}',
    'Content-Type': 'application/json',
    'Prefer': 'return=representation'
}

# Try reading existing rows (even if not in cache, PostgREST may return if table exists)
for t in ['reading_room_documents', 'esg_benchmark_enterprises']:
    r = requests.get(f"{url}/rest/v1/{t}?select=id&limit=5", headers=h)
    print(f"{t}: {r.status_code} {r.text[:200]}")

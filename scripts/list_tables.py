import requests
import re
import json

with open('.env', encoding='utf-8-sig') as f:
    env = f.read()
url = re.search(r'^NEXT_PUBLIC_SUPABASE_URL=(.*)$', env, re.M).group(1)
key = re.search(r'^NEXT_PUBLIC_SUPABASE_ANON_KEY=(.*)$', env, re.M).group(1)
h = {'apikey': key, 'Authorization': 'Bearer ' + key}
r = requests.get(url + '/rest/v1/', headers=h)
print('OpenAPI status:', r.status_code)
if r.status_code == 200:
    paths = re.findall(r'/rest/v1/([^"<]+)', r.text)
    print('Table count:', len(set(paths)))
    for p in sorted(set(paths))[:40]:
        print(' -', p)
else:
    print(r.text[:300])

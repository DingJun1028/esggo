# Hermes Webhook — verified test recipes

All snippets below were executed successfully this session. Paths use Windows
style (`C:/Users/...`) because the host's native python rejects `/c/Users/...`.

## 1. Read a route's secret (for signing tests)
```python
import json
subs = json.load(open('C:/Users/dingj/AppData/Local/hermes/webhook_subscriptions.json', encoding='utf-8'))
secret = subs['aistation-done']['secret']   # dict[name -> route]
url    = f"http://localhost:8644/webhooks/{name}"
```

## 2. Verify a GENERIC route (event from body, not header)
`X-Webhook-Event` header is IGNORED for generic routes — put `event_type` in the body.
```python
import json, hmac, hashlib, urllib.request
body = json.dumps({"event_type":"video_done","title":"x","status":"done",
                   "video_url":"https://y/z.mp4","job_id":"abc"}).encode()
sig  = hmac.new(secret.encode(), body, hashlib.sha256).hexdigest()
req  = urllib.request.Request(url, data=body,
        headers={"Content-Type":"application/json","X-Webhook-Signature":sig}, method="POST")
r = urllib.request.urlopen(req, timeout=15)
print(r.status, r.read().decode()[:200])
# 200 {"status":"delivered","route":"aistation-done","target":"telegram",...}
```

## 3. Verify a GITHUB route (header event + sha256 sig)
```python
body = json.dumps({"repository":{"full_name":"DingJun1028/esggo"},"number":123,
    "action":"opened","pull_request":{"title":"feat","user":{"login":"c"},
    "head":{"ref":"f"},"base":{"ref":"main"},"html_url":"https://...","body":"x"}}).encode()
sig  = "sha256=" + hmac.new(secret.encode(), body, hashlib.sha256).hexdigest()
req  = urllib.request.Request(url, data=body,
        headers={"Content-Type":"application/json","X-Hub-Signature-256":sig,
                  "X-GitHub-Event":"pull_request"}, method="POST")
# 202 {"status":"accepted","route":"github-pr-review","event":"pull_request",...}
```

## 4. Register a GitHub repo webhook via gh (needs PUBLIC url)
```bash
SECRET=$(python3 -c "import json;print(json.load(open('C:/Users/dingj/AppData/Local/hermes/webhook_subscriptions.json'))['github-pr-review']['secret'])")
gh api -X POST /repos/DingJun1028/esggo/hooks \
  -f name=web -f "config[url]=<PUBLIC_URL>/webhooks/github-pr-review" \
  -f 'config[content_type]=json' -f "config[secret]=$SECRET" \
  -f 'config[insecure_ssl]=0' -f 'events[]=pull_request' -F active=true
# -F (capital) for booleans; -f gives 422 "true is not a boolean".
# localhost url -> 422 "url is not supported because it isn't reachable over the public Internet"
```

## Response code cheat-sheet
- `401` = bad/missing signature (expected when you omit secret).
- `200 {"status":"delivered"}` = direct delivery succeeded.
- `202 {"status":"accepted"}` = agent route accepted, agent dispatched.
- `200 {"status":"ignored","event":"test"}` = `hermes webhook test` used event type `test` (rejected by whitelist) — NOT an error.
- `200 {"status":"ignored","event":"unknown"}` = event type not in body / not whitelisted.
- `502 Delivery failed` = delivery target platform not connected (e.g. discord).

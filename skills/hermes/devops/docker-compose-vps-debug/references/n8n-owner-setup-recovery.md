# n8n Owner Setup Recovery

## Symptom
- `GET /rest/users` returns `{"message":"'X-N8N-API-KEY' header required"}`
- `GET /rest/owner` returns HTML `Cannot GET /rest/owner`
- `/setup` shows owner form, but after filling fields and submitting, the UI stays in setup mode or validation errors appear
- Database shows a `user` row with `userActivated=false`

## Root Cause
Fresh n8n instances create an owner user record but do not mark it activated. The UI requires explicit owner setup completion before enabling authentication or REST API access.

## Recovery Steps

### 1. Inspect n8n SQLite state
```bash
sqlite3 /home/ubuntu/.n8n/database.sqlite "SELECT id,email,personalizationAnswers,settings FROM user;"
```

Look for:
- `settings` containing `"userActivated":false`
- `personalizationAnswers` being null or missing setup fields

### 2. Patch owner record via SQLite
```python
import sqlite3, json, secrets

conn = sqlite3.connect('/home/ubuntu/.n8n/database.sqlite')
cur = conn.cursor()
secret = secrets.token_urlsafe(32)
answers = {
  'setupDoneAt': '2026-08-14T12:40:00.000Z',
  'setup_secret': secret,
  'instanceType': 'cloud-self-hosted',
  'telemetryClientId': secrets.token_hex(16)
}
cur.execute('UPDATE user SET personalizationAnswers=?, settings=? WHERE id=?', (
  json.dumps(answers),
  json.dumps({'userActivated': True, 'setup_secret': secret}),
  '<owner-user-id>'
))
conn.commit()
```

### 3. Restart n8n
```bash
sudo systemctl restart n8n
```

### 4. Verify
```bash
curl -sS http://127.0.0.1:5678/healthz   # should return {"status":"ok"}
curl -sS http://127.0.0.1:5678/setup     # should redirect to dashboard or show login
```

## Browser Setup Alternative
If SQLite patching is not desired, complete the owner setup via browser at `https://<host>/setup`:
- Fill all required fields (email, first name, last name, password)
- Password must be 8+ chars with at least 1 number and 1 capital letter
- Click Next; if validation errors appear, ensure all fields are filled before submitting

## Pitfalls
- Do not rely on `GET /rest/owner` returning JSON before owner setup is complete; it returns HTML on fresh instances
- `POST /rest/workflows/import` may return `POST method not allowed` if using the wrong endpoint; use `/rest/workflows` with `X-N8N-API-KEY` after setup
- Some n8n versions require the owner setup to complete before issuing API keys; plan browser-based setup if REST import is blocked

## Verification
After recovery:
- Workflows page loads at `/workflows`
- Settings page loads at `/settings`
- REST API accepts authenticated requests with the owner's API key

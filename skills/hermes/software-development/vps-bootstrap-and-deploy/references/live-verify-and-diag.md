# Live verify + post-deploy diagnosis (reusable scripts)

Reusable scripts for the "deploy succeeded but is it actually reachable?" step. Pair with a
`SSH_PRIVATE_KEY` repo secret (set via `cat keyfile | gh secret set SSH_PRIVATE_KEY -b "$(cat keyfile)"`;
see `github-secrets` skill — never bare `gh secret set`).

## 1. `deploy/diag.sh` — open VPS-local firewall + print facts (no console changes)

Runs ON the VPS via a `diag.yml` workflow (rsync then `bash diag.sh`). Only opens the local
firewall and prints diagnostics; it does NOT touch the Oracle Security List or DNS (console-only).

```bash
#!/usr/bin/env bash
# Read-only-ish: opens VPS-local 80/443, proves nginx listens publicly, prints public IP.
set +e
echo "=== ufw status ==="
sudo ufw status verbose 2>/dev/null || echo "ufw not installed"
echo "=== open 80/443 on VPS-local firewall ==="
sudo ufw allow 80/tcp 2>/dev/null
sudo ufw allow 443/tcp 2>/dev/null
echo "=== nginx listening? (want 0.0.0.0:80, not just 127.0.0.1) ==="
sudo ss -ltnp 2>/dev/null | grep -E ':80 |:443 |:8000 '
echo "=== nginx -t ==="
sudo nginx -t 2>&1 | tail -2
echo "=== local health (loopback) ==="
curl -fsS --max-time 8 http://127.0.0.1:8000/api/health && echo
echo "=== public IP (A-record target for DNS) ==="
curl -fsS --max-time 8 https://api.ipify.org 2>/dev/null || echo "(ipify unreachable)"
```

**Interpretation:** loopback OK + `0.0.0.0:80` listening + public IP times out from your
machine => blocker is the **Oracle Security List** (console: add 80/443 ingress) or **DNS A
record** (console/Cloudflare: point subdomain at the printed IP). Neither is fixable over SSH.

## 2. `deploy/verify_live.py` — end-to-end render check on the free path

Runs ON the VPS (no third-party deps; uses `urllib.request`). Do NOT build the POST body via
nested `python3 -c` inside an SSH heredoc — the GitHub runner's bash chokes on the quoting
(`syntax error near unexpected token 'json.dumps'`). Use this standalone file instead.

```python
#!/usr/bin/env python3
"""Submit a DNA script, poll to done, verify the served MP4. Free path, no cloud keys."""
import json, sys, time, urllib.request
BASE = "http://127.0.0.1:8000"

def _post(path, payload):
    data = json.dumps(payload).encode()
    req = urllib.request.Request(BASE + path, data=data,
                                 headers={"Content-Type": "application/json"})
    with urllib.request.urlopen(req, timeout=30) as r:
        return json.loads(r.read().decode())

def _get(path):
    with urllib.request.urlopen(BASE + path, timeout=30) as r:
        return json.loads(r.read().decode())

def main():
    script = ("【場景】城市不是替人民設計。【衝突】市民的需求常被專家最佳化取代。"
              "【洞察】公共價值來自共創。【方法】用三個共創問題啟動參與。"
              "【反思】你上一次被詢問，是什麼時候？")
    job = _post("/api/jobs", {"title": "verify-run", "script": script, "brand_preset": "sushi_dr"})
    job_id = job["job_id"]
    print("submitted job=" + job_id)
    status = "queued"
    for i in range(60):
        time.sleep(3)
        status = _get(f"/api/jobs/{job_id}")["status"]
        print(f"poll {i + 1}: {status}")
        if status in ("done", "failed"):
            break
    raw = _get(f"/api/jobs/{job_id}").get("result")
    result = json.loads(raw) if isinstance(raw, str) else (raw or {})   # API returns result as a JSON STRING
    video_url = result.get("video_url") if isinstance(result, dict) else None
    print("final status:", status)
    print("result:", json.dumps(result, ensure_ascii=False)[:300])
    if status != "done" or not video_url:
        print("VERIFY FAILED: job did not finish with a video"); return 1
    # Verify via the SERVED URL (path-independent). Do NOT check the container-internal
    # /app/storage/... path on the host — the volume is mounted at ./storage there.
    with urllib.request.urlopen(BASE + video_url, timeout=30) as r:
        data = r.read()
    if r.status == 200 and len(data) > 1000:
        print(f"VIDEO_SERVED_OK: {video_url} ({len(data)} bytes)"); print("VERIFY OK"); return 0
    print(f"VIDEO_SERVE_FAILED: status={r.status} bytes={len(data)}"); return 1

if __name__ == "__main__":
    sys.exit(main())
```

## 3. Workflow scaffolding (diag.yml / verify.yml)

Both share the SSH-secret wiring. Minimal skeleton:

```yaml
name: Diag/Verify
on: [workflow_dispatch]
permissions: { contents: read }
jobs:
  run:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - name: Write SSH private key
        run: |
          mkdir -p ~/.ssh
          printf '%s\n' "${{ secrets.SSH_PRIVATE_KEY }}" > ~/.ssh/deploy_key
          chmod 600 ~/.ssh/deploy_key
          ssh-keyscan -H "${{ secrets.DEPLOY_HOST }}" >> ~/.ssh/known_hosts 2>/dev/null || true
      - name: Ship + run on VPS
        env: { HOST: "${{ secrets.DEPLOY_HOST }}", USER: "${{ secrets.DEPLOY_USER }}" }
        run: |
          rsync -az -e "ssh -i ~/.ssh/deploy_key -o StrictHostKeyChecking=no" \
            ./deploy/diag.sh "$USER@$HOST:~/aistation/deploy/diag.sh"   # or verify_live.py
          ssh -i ~/.ssh/deploy_key -o StrictHostKeyChecking=no "$USER@$HOST" \
            "bash ~/aistation/deploy/diag.sh"                            # or: python3 ~/aistation/deploy/verify_live.py
      - name: Clean up SSH key
        if: always()
        run: rm -f ~/.ssh/deploy_key
```

Note: job-level `if:` CANNOT read `secrets.*` — don't gate on `secrets.SSH_PRIVATE_KEY`.
Since these are `workflow_dispatch`-only, just run them; the SSH step fails clearly if the key
is missing.

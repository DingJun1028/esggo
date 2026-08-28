# SSH-deploy via a local private key (SSH_PRIVATE_KEY secret)

Reusable pattern to deploy to a VPS when interactive SSH is impossible (no TTY,
`Permission denied (publickey)`, or you just don't want to babysit a shell). The
private key already lives on the user's machine, so you route it through `gh secret
set` into a masked repo secret, then a workflow does the SSH. The key never appears
in chat, repo, or (after cleanup) the runner FS.

## 1. Set the secrets (local key -> masked secret)

```bash
# Windows git-bash: pipe the file in; gh masks the value, nothing is echoed.
cat "$USERPROFILE/.ssh/id_rsa_esggo" | gh secret set SSH_PRIVATE_KEY -R OWNER/REPO
gh secret set DEPLOY_HOST -R OWNER/REPO -b "161.118.252.147"
gh secret set DEPLOY_USER -R OWNER/REPO -b "ubuntu"
```

IMPORTANT: always use `-b "$(cat file)"` / a pipe. A bare `gh secret set NAME` in a
non-TTY shell silently stores an **empty** secret (see the trap in SKILL.md). If you
accidentally created one, `gh api -X DELETE repos/OWNER/REPO/actions/secrets/NAME`.

## 2. deploy.yml (minimal, real)

```yaml
name: Deploy to VPS
on:
  workflow_dispatch:
    inputs:
      domain: { description: "nginx site FQDN", default: "aistation.esggo.co" }
permissions: { contents: read }
jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - name: Write SSH private key
        run: |
          mkdir -p ~/.ssh
          printf '%s\n' "${{ secrets.SSH_PRIVATE_KEY }}" > ~/.ssh/deploy_key
          chmod 600 ~/.ssh/deploy_key
          ssh-keyscan -H "${{ secrets.DEPLOY_HOST }}" >> ~/.ssh/known_hosts 2>/dev/null || true
      - name: Deploy
        env: { HOST: "${{ secrets.DEPLOY_HOST }}", USER: "${{ secrets.DEPLOY_USER }}" }
        run: |
          rsync -az --exclude '.env' -e "ssh -i ~/.ssh/deploy_key -o StrictHostKeyChecking=no" \
            ./deploy/ "$USER@$HOST:~/aistation/deploy"
          ssh -i ~/.ssh/deploy_key -o StrictHostKeyChecking=no "$USER@$HOST" bash -c "'
            set -e
            cd ~/aistation/deploy
            docker compose pull && docker compose up -d
            sudo cp nginx/aistation.esggo.co.conf /etc/nginx/sites-available/${{ github.event.inputs.domain }}.conf
            sudo ln -sf /etc/nginx/sites-available/${{ github.event.inputs.domain }}.conf /etc/nginx/sites-enabled/
            sudo nginx -t && sudo systemctl reload nginx
          '"
          sleep 6
          ssh -i ~/.ssh/deploy_key "$USER@$HOST" "curl -fsS http://127.0.0.1:8000/api/health"
      - name: Clean up SSH key
        if: always()
        run: rm -f ~/.ssh/deploy_key
```

## 3. Run it

```bash
gh workflow run deploy.yml -R OWNER/REPO -f domain=aistation.esggo.co
# poll:
for i in $(seq 1 30); do
  st=$(gh run view --repo OWNER/REPO --json status,conclusion -q '"\(.status) \(.conclusion)"' 2>/dev/null)
  echo "try $i: $st"; echo "$st" | grep -q completed && break; sleep 12
done
```

## Notes / pitfalls
- The `secrets` context is NOT available in a job-level `if:` -- don't gate the deploy
  job on `secrets.SSH_PRIVATE_KEY`. Since this is `workflow_dispatch`-only, just run it;
  the SSH step will fail clearly if the key is missing.
- `printf '%s\n' "$SECRET"` preserves multi-line keys (newlines) -- do NOT use `echo`
  with unquoted expansion, which can mangle the key.
- Verify the live result: SSH in (or `curl` from the runner) and hit `/api/health`; or
  ship a `verify_live.py` that POSTs a job, polls to `done`, and `GET`s the served
  video URL (path-independent -- don't check the container-internal `/app/storage/...`
  path on the host; the app serves `/storage/<job>/final.mp4`).
- After success, advise rotating the SSH key if it may have been shared more widely
  than intended (it lived in a repo secret).

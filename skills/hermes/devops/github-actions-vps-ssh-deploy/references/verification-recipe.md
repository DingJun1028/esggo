# Verification recipe + environment workarounds

## 1. End-to-end CI-login simulation (the real proof)
Run from the machine that holds the private key. Substitute the pinned host key line and
the deploy dir.

```bash
TMPKH=$(mktemp)
echo "161.118.248.180 ssh-ed25519 AAAAC3NzaC1lZDI1NTE5AAAAIPYr6ZbzG0O7D7ZFOKUfIuS3RP3BkdXNJ34RkUrrs71o" > "$TMPKH"
ssh -o BatchMode=yes -o ConnectTimeout=10 -o StrictHostKeyChecking=yes \
    -o UserKnownHostsFile="$TMPKH" -i /c/Users/dingj/.ssh/ci_deploy_key \
    ubuntu@161.118.248.180 '
echo "[CI-SIM] login OK as $(whoami)"
cd /opt/esggo && pwd && git rev-parse --abbrev-ref HEAD
ls -la vps/docker-compose.yml | head -1
command -v docker >/dev/null && echo docker:yes || echo docker:no
command -v pm2 >/dev/null && echo pm2:yes || echo pm2:no
sudo -n nginx -t 2>&1 | head -2
'
rm -f "$TMPKH"
```

Expected green: login OK, deploy dir + branch correct, compose file present, docker/pm2
present, `nginx -t` succeeds.

## 2. Secret alignment check (before trusting CI)
```bash
# local public vs server-installed public (ignore restrict prefix on server)
diff <(cat /c/Users/dingj/.ssh/ci_deploy_key.pub) \
     <(ssh ubuntu@161.118.248.180 'grep github-actions ~/.ssh/authorized_keys' | sed 's/^restrict,[^ ]* //')
# base64 blob must match -> MISMATCH line is only the prefix, not the key body
```

## 3. Set secrets from file (keeps key out of history)
```bash
gh secret set VPS_SSH_KEY < /c/Users/dingj/.ssh/ci_deploy_key
gh secret set VPS_HOST    <<< "161.118.248.180"
gh secret set VPS_USER    <<< "ubuntu"
gh secret set VPS_HOST_KEY <<< "161.118.248.180 ssh-ed25519 AAAA...hostkey"
```

## 4. MSYS git-bash path quirk (Windows host)
- `git -C /c/Project/esggo status` → `fatal: not a git repository` (false negative)
- `git -C "C:\Project\esggo" status` → works
- Same for `python3`: pass `r'C:\Project\...'` and `io.open(path, encoding='utf-8-sig')`.
- `gh` CLI, `ssh`, `scp` are fine with `/c/...`; only the git/py file-resolution layer chokes.

## 5. read_file mis-flags UTF-8 YAML as binary
Symptom: `read_file` returns `is_binary: true` / "Binary file - cannot display" for a
valid `.yml` (often with BOM or certain byte sequences). Do NOT retry read_file 3× (triggers
loop warning). Instead:
```bash
cat -v "C:\\Project\\esggo\\.github\\workflows\\deploy.yml" | sed -n '156,210p'
# edit with awk/sed, then validate:
python3 -c "import yaml,io; d=yaml.safe_load(io.open(r'C:\\Project\\esggo\\.github\\workflows\\deploy.yml',encoding='utf-8-sig')); print(list(d['jobs'].keys()))"
```

## 6. Safe rebase when push is rejected
```bash
git stash push -m wip-pre-rebase
git rebase origin/main
git stash pop
git push origin main
```

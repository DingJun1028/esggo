---
name: oci-vm-ops
title: OCI VM Operations
version: 1.0.0
description: >
  Operational patterns for Oracle Cloud Infrastructure (OCI) compute instances
  on Always Free / paid tenancies: SSH key recovery, Console Connection traps,
  metadata immutability, boot-volume reuse, AD capacity issues, and image selection.
triggers:
  - oci vm ssh broken
  - oracle cloud instance inaccessible
  - permission denied publickey oci
  - oci console connection missing
  - ssh_authorized_keys metadata immutable
  - recreate oci instance preserve data
  - VM.Standard.E2.1.Micro capacity ad-1
  - always free oci vpn
---

# OCI VM Operations

## 1. Problem pattern

Typical blocker: private key is missing or no longer matches the VM, and the
original `.pem` cannot be located. SSH fails with `Permission denied (publickey)`.
The goal is to regain access without losing configured data.

## 2. Why standard fixes fail

| Attempt | Common failure reason |
|---|---|
| `ssh -i key.pem ubuntu@ip` | Wrong key / key never created for this VM. |
| Console Connection (UI) | Some instance shapes/regions/console versions do not expose “Console Connection” under Actions → Other Actions. Don’t get stuck scrolling menus. |
| Oracle Cloud Agent Execute Command | Agent may be `not present` on Ubuntu 24.04 aarch64 Always Free images. Commands get stuck in `ACCEPTED` with no output. |
| `oci compute-management instance-agent-command` | May not exist in older/newer CLI versions. |
| Metadata `ssh-authorized-keys` update | OCI **refuses** to update `ssh_authorized_keys` after instance creation. Error variants: `cannot be removed and must be provided with the already existing value`, `cannot be updated and must be provided with the already existing value`. Retrying with reconstructed JSON **including the original key** does **not** help. |
| `oci compute instance get ... --output text` | Some CLI versions only accept `json` / `table`; `text` errors out. Use `--output json`. |
| `oci compute-management instance-agent-command` | May not exist in older/newer CLI versions. |

Lesson: treat Console Connection and Execute Command as **nice-to-have**, not reliable. If the user cannot locate Console Connection in the UI after a few attempts, switch to the Boot Volume recovery path instead of repeating UI navigation instructions.

## 3. Correct recovery path

### Step 1 — Generate a fresh keypair in Cloud Shell

```bash
ssh-keygen -t rsa -b 4096 -f ~/vpskey -N '' -q && cat ~/vpskey.pub
```

Keep `~/vpskey` and `~/vpskey.pub`. Never overwrite an existing `~/.ssh/authorized_keys` in Cloud Shell; it is unrelated to the VM.

### Step 2 — Read existing metadata (safe)

```bash
oci compute instance get \
  --instance-id <INSTANCE_OCID> \
  --query 'data.metadata' \
  --output json
```

Use **json** output, not `text`. Older CLI versions error on `--output text`.

### Step 3 — Re-create the instance from its Boot Volume

`terminate` the instance **without deleting the boot volume**.
Then create a new instance from that boot volume and paste your new public key
into the SSH Key field. Data is preserved; the key is refreshed.

Why this works: the immutable-metadata restriction only blocks **metadata updates** on an existing instance. Creating a new instance from the old boot volume is a different API path.

### Step 3 alt — If you cannot find Boot Volume in Console

1. Search for **Boot Volume** (儲存體 → Boot Volume).
2. Open the volume → **Actions → Create Compute Instance**.
3. Supply the new SSH key in the wizard.

## 4. Capacity issue when recreating

Error: `VM.Standard.E2.1.Micro 可用性網域中 AD-1 資源配置的容量不足`

Remediation order:
1. Switch to another AD if the UI lets you.
2. If AD is fixed or unavailable, wait 5–15 minutes and retry.
3. If sustained, check Oracle status page; Always Free Ampere A1 capacity in ap-singapore-1 fluctuates.

Do not loop `instance update` retries — the error is capacity-related, not format-related.

## 5. Image/agent caveats

Ubuntu 24.04 aarch64 Always Free images can show `Oracle Cloud Agent Plugins` with `not present` for Management Agent, making Execute Command unreliable. If supported operational tooling matters, choose a distro/shape that enables it.

## 6. Telegram / Hermes integration notes

Hermes config (Windows user profile path):
- `config.yaml` includes `platform_toolsets.telegram: [- hermes-telegram]`
- `TELEGRAM_BOT_TOKEN` lives in `.env`, **not** in `config.yaml`
- Setting example:

  ```bash
  sed -i "s/^# TELEGRAM_BOT_TOKEN=\$/TELEGRAM_BOT_TOKEN=<token>/" C:/Users/<user>/AppData/Local/hermes/.env
  ```

- Restart Hermes gateway after editing `.env` so `hermes-telegram` picks it up.
- Treat bot tokens as secrets; never echo them back to chat or commit them.

## 7. OCI Console "貼上公開金鑰" validation trap

When adding an SSH public key via OCI Console `Identity → Users → API Keys`,
the **Paste Public Key** option often rejects valid keys with:

> 「公開金鑰的標頭或結尾無效。」

This usually means the pasted text got line-wrapped or whitespace-normalized by
the browser/editor, not that the key itself is wrong.

**Pitfall**: do not retry pasting the same key. Repeated paste attempts produce
no progress and expose key material unnecessarily.

Workaround:
1. Switch to **選擇公開金鑰 / Select Public Key** in the OCI Console dialog.
2. Upload the `.pub` file directly from the local filesystem.
3. This bypasses paste-time formatting corruption entirely.

## 8. OCI Python SDK fingerprint validation quirk

`oci.config.validate_config` requires fingerprint regex `^([0-9a-f]{2}:){15}[0-9a-f]{2}$` lowercase only. Console-displayed fingerprints may be uppercase or differently formatted. If `from_file()` rejects `fingerprint` as malformed, fall back to VPS-side automation scripts instead of retrying SDK auth.

Also: the SDK expects a PEM-format private key. Modern `ssh-keygen` defaults to `OPENSSH PRIVATE KEY` format, which raises:
```
ValueError: Valid PEM but no BEGIN/END delimiters for a private key found.
```
Convert with: `ssh-keygen -p -f ~/.oci/oci_api_key -m PEM -N ""`

## 9. 401 NotAuthenticated even after fingerprint/key fix

If SDK/CLI still returns 401 with `malformed`/`NotAuthenticated`, the most probable cause is the public key was never registered in OCI Console. Register the public key under Identity Users API Keys first, then retry.

## 10. Session evidence

See `references/session-2026-07-21-oci-vm.md` for the exact error messages and
the exact working recovery path used on an Ubuntu 24.04 aarch64 Always Free VM.

```bash
# Cloud Shell
ssh-keygen -t rsa -b 4096 -f ~/vpskey -N '' -q
# In Console: terminate instance with boot volume kept, then recreate from that boot volume.
# Provide ~/vpskey.pub as the SSH key.
# Result: preserved data, working SSH.
```

## 9. Instance vs keypair mismatch discovered from OCI Console details

The instance details page often shows the **actual SSH public key** installed on
the instance, plus its **server-side fingerprint**. Use this to diagnose mismatch:

- Copy the **公開金鑰** from Instance Details → SSH Keys.
- Compare it to `ssh-keygen -y -f ~/.ssh/<local_private_key>` locally.
- If they differ, the instance was built from a **different keypair** than the
  local private key you are using.

**Pitfall**: do not assume a pub key shown in chat or notes matches the current
instance. OCI creates a new public key/value pair on each new instance unless
you explicitly paste the same key during creation.

## 10. When fingerprint matches but SSH still fails

The instance public IP can change. Before applying heavier recovery, verify
reachability on the current public IP with the expected username (`ubuntu` for
Ubuntu images). If the keypair is still retained locally, direct SSH often
works again immediately:

```bash
ssh -i oci_key.pem ubuntu@<current_public_ip>
```

Treat IP rotation as a cheap first check; it can avoid recreating the instance
or altering boot volumes.

## 10. When fingerprint matches but SSH still fails

If `ssh-keygen -l -f ~/.ssh/id_rsa` fingerprint **exactly matches** the key
shown in OCI Console instance details, but `ssh` still returns
`Permission denied (publickey)`, do **not** retry SSH with the same key. The
failure is almost certainly because the instance's `~/.ssh/authorized_keys`
never received the matching public key during instance recreation/metadata update.

**Pitfall**: users often keep pasting the same pub key into chat or retrying
SSH; this produces no progress. The correct next action is provider-side
key injection.

Recovery options in priority order:
1. **Console Connection**: OCI Console → Compute → Instances → instance →
   Console Connection → Launch Cloud Shell Session → `cat ~/.ssh/authorized_keys`
   to verify whether the matching pub key is present. If missing, append it and
   `chmod 600 ~/.ssh/authorized_keys`.
2. **Recreate from Boot Volume**: terminate without deleting boot volume, then
   create a new instance from that boot volume with the matching pub key in the
   SSH Key field. This is the most reliable path when Console Connection is
   unavailable or unreliable.
3. If the user has **lost the original private key**, do not attempt key
   reconstruction from the pub key; generate a fresh keypair and inject the new
   public key via one of the two paths above.

**Do not** paste the same broken/mismatched key repeatedly; stop and pivot to
one of the three provider-side recovery paths above.

## 11. Local private key file corruption detection

If `~/.ssh/id_rsa` has been overwritten or is corrupted, SSH may fail with:

```
identity_sign: private key /path/to/id_rsa contents do not match public
ubuntu@<ip>: Permission denied (publickey).
```

Diagnostic check:
```bash
ssh-keygen -l -f ~/.ssh/id_rsa
ssh-keygen -y -f ~/.ssh/id_rsa | ssh-keygen -l -f -
```

If the two fingerprints differ, the private key file is corrupted/incomplete
and must be regenerated. Do not attempt to patch it in place.

**Workaround**: generate a clean replacement keypair:
```bash
ssh-keygen -t rsa -b 2048 -f ~/.ssh/id_rsa_esggo_new -N '' -C "esggo-vps-$(date +%Y%m%d)"
chmod 600 ~/.ssh/id_rsa_esggo_new
chmod 644 ~/.ssh/id_rsa_esggo_new.pub
```

Then use `id_rsa_esggo_new` for a fresh instance.

## 12. instance 公開鑰與本地金鑰內容不符 (`identity_sign`)

If SSH returns:

```
identity_sign: private key /path/to/id_rsa contents do not match public
ubuntu@<ip>: Permission denied (publickey).
```

Then SSH itself has detected that the local private key does not correspond to the
pub key it derived from the same file. This is a stronger signal than a generic
`Permission denied (publickey)`.

Pitfall: do not continue to retry the same local private key. The instance
likely contains a different pub key in `~/.ssh/authorized_keys`.

Recovery order:
1. **Inspect the instance-side pub key** with Console Connection:
   - `cat ~/.ssh/authorized_keys`
2. **Decide injection strategy**:
   - If Console Connection allows shell writes: append/replace the correct
     matching pub key and `chmod 600 ~/.ssh/authorized_keys`.
   - If Console Connection login is blocked (`Login incorrect`) because password
     auth is disabled for the key-created user, recreate the instance from the
     boot volume with the intended pub key in the SSH Key field.
3. **Do not assume** the instance SSH key matches prior notes or chat history.
   Each new instance creation can install a different key unless you explicitly
   paste the same one.

## 13. Guest-side metadata service may 404 on Always Free ARM images

When querying `http://169.254.169.254/opc/v1/instance/` or `/vnics/` from the
guest, OCI may return HTML `404 Not Found` instead of JSON metadata. This means
instance metadata is not exposed to the guest on that image/shape/region combo.

Implication:
- Do not rely on metadata-driven automation from inside the VM.
- Use provider-side controls (Console, CLI from another privileged host) instead.

## 14. Security List vs host firewall triage after local success

If the app responds on `127.0.0.1:<port>` but `curl http://<public-ip>:80/`
times out while `sudo ss -tlnp` shows `0.0.0.0:80` listening, the failure is
almost certainly **upstream of the VPS**, typically:
1. OCI VCN Security List missing ingress `0.0.0.0/0 TCP 80/443`.
2. Host firewall rules rejecting before nginx can respond.

On Ubuntu images with cloud-init-style firewall defaults, one ALLOW rule for
port 22 often exists; everything else may default to REJECT. If `iptables -L
INPUT` shows a final `REJECT ... reject-with icmp-host-prohibited`, that rule
is blocking public web traffic.

Workaround:
- Add ALLOW rules for `80`, `443`, and the app port before testing from the
  public internet.
- Persist with `iptables-persistent` or `netfilter-persistent save` if needed.

## 15. API key rotation: wrong fingerprint format causes 401, but so does unregistered key

When adding an OCI API key via Console Identity Users API Keys, OCI returns a Console fingerprint printed in the UI. That value may be uppercase or formatted with different separators than the SDK expects.

The OCI Python/CLI SDK enforces fingerprint regex lowercase only with colon separators. Uppercase or alternate formats are rejected as malformed.

Even with the correct lowercase format, the key must first be registered in OCI Console. A 401 NotAuthenticated response from `oci iam user list` usually means:
1. The public key was never added to the user's API Keys, OR
2. The local private key file does not correspond to the registered public key, OR
3. The key file is in OPENSSH PRIVATE KEY format but the SDK expects PEM.

Recovery:
- Verify local keypair integrity: `ssh-keygen -l -f ~/.oci/oci_api_key` and `ssh-keygen -l -f ~/.ssh/id_rsa_esggo`.
- Convert OPENSSH to PEM if needed: `ssh-keygen -p -f ~/.oci/oci_api_key -m PEM -N ""`.
- Register the matching public key in OCI Console first, then retry SDK/CLI.
- If Paste Public Key rejects valid text, switch to file upload in the Console dialog.

## 16. Local private key file corruption detection

If `~/.ssh/id_rsa` has been overwritten or is corrupted, SSH may fail with:

```
identity_sign: private key /path/to/id_rsa contents do not match public
ubuntu@<ip>: Permission denied (publickey).
```

Diagnostic check:
```bash
ssh-keygen -l -f ~/.ssh/id_rsa
ssh-keygen -y -f ~/.ssh/id_rsa | ssh-keygen -l -f -
```

If the two fingerprints differ, the private key file is corrupted/incomplete and must be regenerated. Do not attempt to patch it in place.

Workaround: generate a clean replacement keypair:
```bash
ssh-keygen -t rsa -b 2048 -f ~/.ssh/id_rsa_esggo_new -N '' -C "esggo-vps-$(date +%Y%m%d)"
chmod 600 ~/.ssh/id_rsa_esggo_new
chmod 644 ~/.ssh/id_rsa_esggo_new.pub
```

Then use `id_rsa_esggo_new` for a fresh instance.

## 17. instance 公開鑰與本地金鑰內容不符 (identity_sign)

If SSH returns:

```
identity_sign: private key /path/to/id_rsa contents do not match public
ubuntu@<ip>: Permission denied (publickey).
```

Then SSH itself has detected that the local private key does not correspond to the pub key it derived from the same file. This is a stronger signal than a generic `Permission denied (publickey)`.

Pitfall: do not continue to retry the same local private key. The instance likely contains a different pub key in `~/.ssh/authorized_keys`.

Recovery order:
1. Inspect the instance-side pub key with Console Connection: `cat ~/.ssh/authorized_keys`
2. Decide injection strategy:
   - If Console Connection allows shell writes: append/replace the correct matching pub key and `chmod 600 ~/.ssh/authorized_keys`.
   - If Console Connection login is blocked because password auth is disabled for the key-created user, recreate the instance from the boot volume with the intended pub key in the SSH Key field.
3. Do not assume the instance SSH key matches prior notes or chat history. Each new instance creation can install a different key unless you explicitly paste the same one.

## 18. Guest-side metadata service may 404 on Always Free ARM images

When querying `http://169.254.169.254/opc/v1/instance/` or `/vnics/` from the guest, OCI may return HTML `404 Not Found` instead of JSON metadata. This means instance metadata is not exposed to the guest on that image/shape/region combo.

Implication:
- Do not rely on metadata-driven automation from inside the VM.
- Use provider-side controls (Console, CLI from another privileged host) instead.

## 19. Security List vs host firewall triage after local success

If the app responds on `127.0.0.1:<port>` but `curl http://<public-ip>:80/` times out while `sudo ss -tlnp` shows `0.0.0.0:80` listening, the failure is almost certainly upstream of the VPS, typically:
1. OCI VCN Security List missing ingress `0.0.0.0/0 TCP 80/443`.
2. Host firewall rules rejecting before nginx can respond.

On Ubuntu images with cloud-init-style firewall defaults, one ALLOW rule for port 22 often exists; everything else may default to REJECT. If `iptables -L INPUT` shows a final `REJECT ... reject-with icmp-host-prohibited`, that rule is blocking public web traffic.

Workaround:
- Add ALLOW rules for `80`, `443`, and the app port before testing from the public internet.
- Persist with `iptables-persistent` or `netfilter-persistent save` if needed.

## 20. Console Connection login behavior on Ubuntu 24.04

Ubuntu 24.04 instances created with SSH keypairs often have no password set for the `ubuntu` user. Attempting Console Connection with empty password returns `Login incorrect`. This means password auth is disabled.

Do not loop on Console Connection password attempts. Instead:
1. Use OCI Console Instance Details Get initial password, then decrypt with the original private key used at instance creation time.
2. Or use Console Connection only to inspect/inject `~/.ssh/authorized_keys`, not to log in interactively.
## 20. Console Connection login behavior on Ubuntu 24.04

Ubuntu 24.04 instances created with SSH keypairs often have **no password set**
for the `ubuntu` user. Attempting Console Connection with:
- Username: `ubuntu`
- Password: empty/Enter

Will return `Login incorrect`. This does **not** mean the account is locked;
it means password auth is disabled.

Do not loop on Console Connection password attempts. Instead:
1. Use OCI Console → Instance Details → **Get initial password** to retrieve
   the encrypted initial password, then decrypt it with the original private key
   used at instance creation time.
2. Or use Console Connection only to inspect/inject `~/.ssh/authorized_keys`,
   not to log in interactively.
3. If the original private key is lost, recreate the instance from boot volume
   with a fresh SSH keypair.

## 24. VPS 內嵌式 OCI Controller API（systemd + FastAPI 整合）

### 24.1 需求場景
把 OCI CLI 變成 App 內部可呼叫的基礎設施控制器，而非僅手動 CLI。
適用：AI Station / n8n / 內部工具需要開關機、列實例、查詢狀態。

### 24.2 安裝 OCI CLI（Ubuntu / Always Free）
```bash
# 非互動安裝，指定 install-dir 與 exec-dir
bash -c "$(curl -L https://raw.githubusercontent.com/oracle/oci-cli/master/scripts/install/install.sh)" \
  -- --accept-all-defaults \
     --install-dir $HOME/lib/oracle-cli \
     --exec-dir $HOME/bin
```

- 安裝後 `oci --version` 會顯示最新版（例如 3.90.2）。
- 首次 `oci` 互動模式可用 `oci -i`，但在 script 中必須加 `--accept-all-defaults`。

### 24.3 安裝後常見陷阱
1. **PATH 問題**：`$HOME/bin` 不在非互動 shell 的 PATH。
   修復：`echo 'export PATH="$HOME/bin:$PATH"' >> ~/.bashrc`
2. **fingerprint 大小寫**：Console 顯示的 fingerprint 可能大寫；SDK/CLI 要求小寫。
   修復：`export SUPPRESS_LABEL_WARNING=true` 或在 code 內傳入 env。
3. **config 不可讀**：`~/.oci/config` 權限需 `600`，`oci_api_key` 需 `600`。

### 24.4 Wrapper script 模板（5T 合約：Traceable/Trackable/Trustworthy）
```bash
#!/bin/bash
set -uo pipefail
OCI="/home/ubuntu/bin/oci"
COMPARTMENT="ocid1.tenancy.oc1..<tenancy>"
REGION="ap-singapore-1"

oci-wrapper list|status <name>|start <name>|stop <name>
# 內含：固定 compartment/region、ops-log append-only、Object.freeze 風格的不可變輸出
```
存檔：`/home/ubuntu/bin/oci-wrapper`，chmod +x。

### 24.5 FastAPI OCI Controller 模式
```python
# src/oci_controller.py
# - 固定 OCI_BIN、COMPARTMENT、REGION
# - _oci() helper：subprocess.run + SUPPRESS_LABEL_WARNING env
# - endpoints: GET /oci/instances, GET /oci/instances/{name},
#              POST /oci/instances/{name}/start, POST /oci/instances/{name}/stop,
#              GET /oci/ops-log
# - 5T: Trustworthy (env locked), Trackable (ops-log), Transparent (JSON)
```

```python
# src/app.py 接入
from .oci_controller import router as oci_router
app.include_router(oci_router)
```

### 24.6 systemd service 與 OCI CLI 的關鍵坑位
**問題**：`/oci/instances` 回傳 `{"detail":"oci error: Abort:"}`
**根因**：systemd service 以 `root` 執行，OCI CLI 的 `~/.oci/config` 與 `oci_api_key` 在 `/home/ubuntu/` 下，`root` 的 HOME 指向 `/root`，導致 config 找不到而 Abort。

**修復**：
```ini
# /etc/systemd/system/<service>.service
[Service]
User=ubuntu
Environment=SUPPRESS_LABEL_WARNING=true
# 不需要硬編碼 HOME；systemd 會把 HOME 指向 ubuntu 家目錄
WorkingDirectory=/opt/esggo/apps/<app>
ExecStart=/opt/esggo/apps/<app>/.venv/bin/uvicorn src.app:app --host 127.0.0.1 --port 8000
```

```bash
sudo systemctl daemon-reload
sudo systemctl restart <service>
```

**驗證**：
```bash
curl -s http://127.0.0.1:8000/oci/instances | jq .
# 應回傳 JSON 陣列，不是 Abort
```

### 24.7 除錯 OCI "Abort:" 的決策樹
1. 手動 `sudo -u ubuntu oci compute instance list ...` 是否正常？
   - 正常 → 問題在 service env / HOME / config 路徑
   - 不正常 → 檢查 config 內容、key_file 權限
2. 檢查 service 執行身分：`systemctl show <service> --property=User,MainPID`
3. 確認 config 路徑：`sudo -u <user> cat ~/.oci/config`
4. 確認 key_file 存在且權限 600：`sudo -u <user> ls -la ~/.oci/`

### 24.8 部署到 VPS 的簡單流程
```bash
# 本機
git archive --format=tar.gz --prefix=aistation/ HEAD > /tmp/aistation-deploy.tar.gz
scp /tmp/aistation-deploy.tar.gz esggo-vps:/tmp/

# VPS
mkdir -p /tmp/oci-deploy && cd /tmp/oci-deploy
tar -xzf /tmp/aistation-deploy.tar.gz
cp aistation/src/oci_controller.py /opt/esggo/apps/aistation/src/
cp aistation/src/app.py /opt/esggo/apps/aistation/src/
# ... 其他檔案
sudo systemctl daemon-reload && sudo systemctl restart aistation.service
```

### 24.9 參考資料
- `references/session-2026-08-15-oci-controller.md` — 本 session 的完整 OCI Controller 整合記錄

When writing OCI configuration in GitHub Actions workflows, **do not use** heredoc
with `[DEFAULT]` section directly in YAML multi-line strings:

```yaml
# ❌ BROKEN — YAML parser treats [DEFAULT] as a key
run: |
  cat > ~/.oci/config << 'EOF'
[DEFAULT]
user=$OCI_USER
EOF
```

This causes YAML parsing error:
```
while scanning a simple key
  in "...oci-launch-vps.yml", line 31, column 1:
    [DEFAULT]
    ^
could not find expected ':'
```

**Solution**: Use `printf` command instead:

```yaml
# ✅ WORKING — printf outputs literal text
run: |
  mkdir -p ~/.oci
  printf '[DEFAULT]\nuser=%s\ntenancy=%s\nregion=%s\nkey_file=/tmp/oci_key.pem\nfingerprint=%s\n' "$OCI_USER" "$OCI_TENANCY" "$OCI_REGION" "$OCI_FINGERPRINT" > ~/.oci/config
```

Or use `echo -e` with escaped newlines:

```yaml
run: |
  mkdir -p ~/.oci
  echo -e "[DEFAULT]\nuser=$OCI_USER\ntenancy=$OCI_TENANCY\nregion=$OCI_REGION\nkey_file=/tmp/oci_key.pem\nfingerprint=$OCI_FINGERPRINT" > ~/.oci/config
```

**Root cause**: YAML's multi-line literal block scalar (`|`) treats `[DEFAULT]` as
a potential YAML key-value pair, causing parser confusion. The `printf` command
outputs the text as shell execution, not YAML parsing.

## 22. Instance is RUNNING but frozen/OOM — SSH unreachable, agent cannot reboot via CLI/SDK

A distinct failure from SSH-key/metadata problems (§1–§20): the instance shows
`Running` in OCI Console, but `ssh` to it times out at the **banner exchange** (not at auth):
```
ssh -o ConnectTimeout=8 -i ~/.ssh/esggo_original ubuntu@<ip>
Connection timed out during banner exchange
```
This means the guest OS is alive but wedged — most commonly **OOM from loading a
model larger than available RAM** (e.g. Ollama `gemma4:e4b` 9.6 GB on a 2.8 GB-available
box). The kernel is thrashing swap and cannot service new SSH connections.

**Why CLI/SDK reboot fails here:**
- The OCI CLI/SDK `instanceAction SOFTRESET` / `RESET` requires a valid signed request;
  an API key mismatch returns **401 NotAuthenticated**.
- A 401 means you cannot issue the reboot — you are locked out of the programmatic path.
- Even with a working key, the API key may still 401 if the public key was never
  registered in OCI Console (see §9/§15) — so do not sink time into debugging SDK
  signing when the box is merely frozen.

**Correct unlock (priority order):**
1. **Oracle Cloud Console → Compute → Instances → Reboot** (1–2 min). This is the
   ONLY reliable agent-side unlock when SSH is down and the API key 401s. Console
   Reboot does not need the API signing key.
2. After reboot, SSH in IMMEDIATELY (before any auto-started service reloads the
   oversized model) and free RAM: `ollama rm <oversized-model>`, then pull a ≤2 GB
   model (`gemma4:e2b`).
3. Only then retry CLI/SDK operations for follow-up config.

**Do NOT** loop on `ssh` retries (the guest is too slow to answer) or on OCI SDK
signing (a 401 from an unregistered key will not self-resolve). Go straight to
Console Reboot. This is separate from §13/§18 (metadata 404) and §1–§12 (key
mismatch) — those are auth problems; §22 is a *liveness/freeze* problem on a
healthy-looking instance.

## 23. Windows OCI CLI, Always-Free shape resize, and STOPPING-hang

### 23.1 Windows CLI location & invocation
- Binary: `C:\Program Files (x86)\Oracle\oci_cli\oci` (on PATH as `oci` in Git-Bash/MSYS).
- Config: `C:\Users\<user>\.oci\config` — `[DEFAULT]` block (user/tenancy/region/fingerprint).
- Every call prints a key-label warning; silence with `export SUPPRESS_LABEL_WARNING=True` before loops.
- Region for this tenancy: `ap-singapore-1`. Pass `--region` explicitly to be safe.

### 23.2 Instance discovery (no compartment in config)
`oci compute instance list` with no `--compartment-id` returns nothing if config lacks a compartment. Use the **tenancy OCID** as the compartment (tenancy == root compartment):
```bash
oci compute instance list --region ap-singapore-1 \
  --compartment-id ocid1.tenancy.oc1..<tenancy>
# grep display-name / id (instance OCID) / lifecycle-state
```

### 23.3 Resize shape (Always-Free Ampere A1)
`VM.Standard.A1.Flex` is the Always-Free ARM shape. **Always-Free cap = 4 OCPU + 24 GB RAM total** across all A1 instances in the tenancy. A single box can be resized up to 4/24 without leaving free tier.
- **Power actions (SOFTRESET / STOP / START) NEVER change shape.** Only `instance update --shape-config` changes OCPU/RAM.
- **Resize requires STOPPED first** — you cannot resize while RUNNING or STOPPING.
```bash
oci compute instance action --region ap-singapore-1 --instance-id $IID --action STOP   # wait STOPPED
oci compute instance update --region ap-singapore-1 --instance-id $IID \
  --shape-config '{"ocpus":4,"memoryInGBs":24}'
oci compute instance action --region ap-singapore-1 --instance-id $IID --action START
```

### 23.4 STOPPING-hang pitfall (extends §22)
A VPS can sit in `STOPPING` 10–15+ min (normal A1 shutdown is 1–3 min) when the **guest OS is CPU/IO saturated** and cannot complete the shutdown sequence. This session: a cancelled `deploy-oracle.yml` GitHub Actions run left `pnpm install` + `next build` pinning CPU, so the guest never acknowledged shutdown.
- There is **no `--force` flag** on `instance action --action STOP`. OCI force power-offs after ~20–30 min of unacknowledged STOPPING; just poll `lifecycle-state` every 15–20 s and wait.
- While `STOPPING`, SSH also fails at **banner exchange** (`Connection timed out during banner exchange`) — same surface symptom as §22's OOM-frozen box, but here the box is mid-shutdown, not frozen. Check `oci compute instance get` for actual power state before assuming OOM.
- After forced stop + START, SSH daemon recovers once CPU is free.

### 23.5 Background-script lifecycle race
When driving STOP→resize→START via a polling loop in a background process, **only one script may own the lifecycle**. Two parallel loops both watching for `STOPPED` will both fire `START` (or one STARTs before the other resizes) → shape-apply failure. Kill the older loop (`process action=kill`) and let a single script sequence STOPPED→update→START→verify.

### 23.6 Reference
Exact command recipes (instance OCID, resize JSON, polling loop) in
`references/session-2026-08-10-oci-resize.md`.

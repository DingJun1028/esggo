---
name: esggo-automation-practices
description: Class-level ESG-GO automation playbook covering secret rotation, OpenCode+Hindsight integration, agents-cli workflows, and PowerShell/Firebase setup conventions.
version: v1.0
---

# ESG-GO Automation Practices

## PowerShell Automation
- Use UTF-8 without BOM for file writes: `New-Object System.Text.UTF8Encoding $false`
- Fix terminal Chinese display: `$OutputEncoding = [Console]::OutputEncoding = [System.Text.UTF8Encoding]::new(); chcp 65001 | Out-Null`
- Avoid alias `curl`; use `curl.exe` or remove alias.

## Secret Rotation
- Providers: Supabase, Gemini, OpenAI, Vercel, OpenRouter, Firebase, third-party APIs.
- Default repo target: `DingJun1028/esggo`.
- `DingJun1028/esggo-learning-center` is excluded unless the user explicitly requests changes there.
- Order: Supabase/Gemini first, then Firebase/web app config, then third-party APIs.
- After rotation: update GitHub Secrets, update Vercel env vars, then restart Hermes and record.

## Repo Boundaries
- Use `esggo` for automation, config changes, and deployment work by default.
- Do not touch `esggo-learning-center` unless explicitly instructed.
- Allowed sync target: `esgo_VPS`.

## OpenCode + Hindsight
- Config path: `~/.config/opencode/opencode.json`
- Enable: `hindsight.enabled=true`, `autoRecall=true`, `autoRetain=true`, `compactionHook=true`
- Server: `opencode serve --hostname 0.0.0.0 --port 4096`
- Security: set `OPENCODE_SERVER_PASSWORD`
- Windows: prefer WSL; access Windows files under `/mnt/c/`

## agents-cli
- Install: `uvx google-agents-cli setup`
- Scaffold: `agents-cli scaffold esggo-agent`
- Run: `agents-cli run "<prompt>"`
- Validate: `agents-cli eval generate`, `agents-cli eval grade`
- Deploy: `agents-cli deploy`

## Firebase
- Project ID: `esggo-504004`
- Project number: `1048542533112`
- Register web app in Firebase Console; set hosting; deploy with Firebase CLI.
- Keep web app config and service account keys in GitHub Secrets and Vercel env vars.

## Dependabot Alerts Parsing

When `gh api` output is piped to Python and gets truncated (common with large JSON responses >100KB), use one of these alternatives:
1. Save to file first: `gh api ... > /tmp/db-alerts.json` then parse the file with a short Python script
2. Use a one-liner Python script that fits within the command length limit
3. Use `jq` if available: `gh api ... | jq -r '.[] | ...'`

The Python script must be short enough to avoid command-line truncation. Save longer scripts to a temp file first.

## Dependabot PR Workflow

After resolving alerts via overrides, create per-package Dependabot PRs instead of pushing directly to main:
1. Revert the direct-to-main override commit
2. For each package needing upgrade, create a separate Dependabot PR
3. Let Dependabot auto-merge PRs that pass CI

This ensures proper review trail and CI validation per package change.

## VPS SSH Troubleshooting

When SSH to VPS fails with `Permission denied (publickey)`:
1. Check key permissions: `stat -c "%a" ~/.ssh/<key>` should be `600`
2. Check public key permissions: should be `644`
3. Restore from backup if needed: `cp ~/.ssh/esggo_original.bak.* ~/.ssh/esggo_original`
4. Regenerate public key: `ssh-keygen -y -f ~/.ssh/esggo_original > ~/.ssh/esggo_original.pub`
5. Verify VPS is reachable: `ping <VPS_IP>` and `nc -zv <VPS_IP> 22`
6. If using a different key than `esggo_original`, ensure it's deployed to the VPS `~/.ssh/authorized_keys`

If SSH is completely unreachable (timeout), the VPS may be down or port 22 blocked — check Cloudflare Tunnel or firewall rules as fallback.

## Git Sync Hygiene (DingJun1028/esggo)

### Pre-flight: 使用者常在別的 session 平行 commit

被要求「上傳/同步到遠端」時，**先查狀態再動手**。`git status` 可能已經是空的 —— 使用者或
另一個 agent session 已經 commit 並 merge 了。直接 `git add -A && commit` 只會製造空 commit
或誤報「我推上去了」（其實是別人推的）。

```bash
git status --short                        # 空的 → 已有人 commit
git log --oneline -3                      # 找出是哪個 commit
git show --stat <sha>                     # 確認你的檔案真的都在裡面
git fetch origin main
git rev-list --count origin/main..HEAD    # ahead
git rev-list --count HEAD..origin/main    # behind
```

| status | ahead/behind | 動作 |
|---|---|---|
| dirty | — | 正常 stage → commit → push |
| clean | 0/0 | **已同步，不要 push**，改去驗證遠端內容完整性 |
| clean | >0/0 | 只需 `git push` |
| clean | 0/>0 | 先 `git pull` |

### 驗證遠端「實際內容」而非只看 sha 相等

sha 相同只證明 ref 對齊，不保證檔案都進去了：
```bash
git ls-tree --name-only origin/main -- apps/<app>/   # 數檔案
git show origin/main:vitest.config.ts | grep '<期望字串>'
```

### 陷阱：`.env.example` 被根 .gitignore 連坐

根 `.gitignore` 的 `.env.example`（第 23 行）會**連子目錄範本一起擋掉**。範本不含機密、
且是他人 clone 後唯一的設定依據，**應該入庫**。

repo 既有慣例是 `!` 逐一放行（已有 `!vps/.env.example`），照做即可：
```gitignore
.env.example
!vps/.env.example
!apps/<app>/.env.example          # 依樣新增
```
診斷（直接指出是哪一行擋的）：
```bash
git check-ignore -v apps/<app>/.env.example
# → .gitignore:23:.env.example    apps/<app>/.env.example
```
入庫前確認無真機密（只該有路徑常數，不該有長 token）：
```bash
grep -nE "=[A-Za-z0-9_/+-]{16,}" apps/<app>/.env.example
```

### 驗證三件套與既有 warning 基線

`pnpm typecheck` / `pnpm test` / `pnpm lint` 三者皆須 exit 0。

**`pnpm lint` 正常就是 exit 0 + 52 warnings**（全為 `no-explicit-any`）——這是 CLAUDE.md
§6.2 已登記的遺留項。報告時要明講「0 errors / 52 warnings 皆為既有」，不要當成新問題，
也不要順手去修（超出任務範圍、擴大 diff）。

pre-commit hook 會跑 UTF-8 encoding check，通過時印 `[encoding-check] ✓ Staged files clean`。

### 測試數下降時必須先舉證

排除任何測試目錄前，先證明是「重複鏡像」而非真實覆蓋損失：檔案是否在別處有同名對應、
內容是否相同、`it(` 區塊數是否一致。證明完再 exclude，並在 commit 訊息寫明理由。

## Record Keeping
- Append automation results to `iteration-log.txt`.
- Store durable facts in `hindsight_retain`.
- If execution tools are blocked, provide deterministic manual instructions and cron-based reminders.

## Cron / Headless Execution Constraints

- Cron sessions do **not** expose `terminal` / SSH / `execute_code` subprocess tools. Any attempt to `docker ps` or shell into the VPS from a cron job will fail with `Tool 'terminal' does not exist` or `BLOCKED: execute_code runs arbitrary local Python`.
- Do not fabricate container health states in cron mode. Report honestly: list what could not be verified, the known-good baseline (if any), and the exact recovery command the user should run.
- Last known-good Docker baseline for ESG-GO VPS: `6/6 healthy` — containers `esggo-core`, `omniagent-gateway`, `esggo-redis`, plus system `nginx` on `:80/:443`.
- Canonical VPS IP/SSH target: `161.118.248.180` (hostname alias: `esggo-vps` / `esggo-vps-root` / `esggo-vps-fix`). Verify that scripts and snapshots use this IP, not stale historical IPs from prior sessions.

## Windows Computer Use Caveats

- `computer_use` is a background driver; foreground keystrokes go to whichever window is active, so `Win+R`, `Ctrl+Esc`, and other shell hotkeys do not reliably open Start/Run.
- Background clicks to Electron apps sometimes land as `suspected_noop`; if that happens, escalate to foreground via `delivery_mode='foreground'` rather than blind-retrying.
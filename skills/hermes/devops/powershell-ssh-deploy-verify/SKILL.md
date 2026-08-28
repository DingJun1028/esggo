---
name: powershell-ssh-deploy-verify
description: "SSH/VPS 部署腳本防假完成三關卡（遠端 HEAD / pm2 online / 公開 HTTP 真判）+ PowerShell/Shell 本地展開陷阱。適用任何 VPS 部署腳本撰寫與審查。"
version: 1.0.0
author: dingj
license: MIT
metadata:
  hermes:
    tags: [deploy, vps, ssh, powershell, bash, verify, oa-team, best-practice]
    related_skills: [esggo-vps-git-deploy, esggo-vps-deploy-verify, esggo-vps-ops]
---

# PowerShell / Shell SSH 部署腳本 — 防假完成三關卡（經驗技能書）

> 固化自 2026-08-22 實戰：user 貼了一支 `deploy-translate-vps.ps1`，
> 跑完印 `DONE` 卻不知公開端點其實 502 掛掉。審出 4 個「假完成」陷阱，
> 修完後腳本具備遠端 commit / pm2 存活 / 公開 HTTP 真判三道關卡。
> 本技能收納可複用模式，任何 SSH 部署腳本都套用。

## 觸發條件
- 撰寫 / 審查「從本機 SSH 到 VPS 執行部署」的腳本（PowerShell `.ps1` 或 bash `.sh`）
- 用戶說「部署腳本會不會假完成」/「DONE 但其實沒上線」/「ssh deploy verify」
- 相關：與 `esggo-vps-git-deploy`（git pull 黃金法則）互補——本技能管「腳本內驗證關卡」，那個管「同步方式」

## 三關卡（防假完成核心）

關卡 1 — 遠端 commit 真溯源（避免印本機假 HEAD）
- ❌ PowerShell 雙引號內 `$(git rev-parse HEAD)` 會被「本機」先展開，印出你電腦本地 git 的 HEAD，不是 VPS 的。
- ✅ PowerShell 逃開：`echo PULLED `$(git rev-parse HEAD)`（單反引號 `` ` `` 取消本機展開，遠端 bash 執行）
- ✅ bash 逃開：`echo PULLED \$(git rev-parse HEAD)`（反斜線取消本機展開）
- 檢核：腳本印出的 commit 必須是 VPS 上 `git rev-parse HEAD` 的值，不是本機。

關卡 2 — pm2 存活檢查（避免「pm2 start 回 0 但崩潰」）
- ❌ `pm2 start server.mjs && pm2 save` —— pm2 start 接受任務即回 0，即便 2 秒後崩潰也照跑 save。
- ✅ start 後 `sleep 2` + `pm2 describe <name> | grep -q 'status.*online' && echo PM2_ONLINE || (echo PM2_FAIL; pm2 logs <name> --lines 20 --nostream)`
- 檢核：輸出必現 `PM2_ONLINE`，否則 dump 最近 20 行 log 供排查。

關卡 3 — 公開端點 HTTP 真判（避免 try/catch 假成功）
- ❌ PowerShell `try { curl.exe -sf ... } catch { ... }` —— 外部命令非零退出**不觸發** PowerShell catch（catch 只接終止錯誤），502 時靜默失敗直接印 DONE。
- ✅ PowerShell 用 `$LASTEXITCODE`：`$code = (curl.exe -sf "https://$DOMAIN/" -o /dev/null -w "%{http_code}" 2>$null); if ($LASTEXITCODE -eq 0) { "public HTTP=$code" } else { "public: 未通過（exit=$LASTEXITCODE）—— 勿誤判為成功" }`
- ✅ bash 用 `||`：`curl -sf "https://$DOMAIN/" -o /dev/null -w "public HTTP=%{http_code}\n" || echo "public: 待 CF DNS/SSL 生效"`
- 檢核：公開 HTTP 狀態必真實印出；非 2xx / 超時必明說，不隱瞞。

## 附帶陷阱（PowerShell 特有）

陷阱 A — curl 換行符
- ❌ PowerShell 遠端命令 `-w '...`n'` —— 反引號 `` `n `` 是 PowerShell 換行，遠端 bash 的 curl 不認，輸出黏在一起。
- ✅ `-w '...\n'`（curl 字面 `\n`）。

陷阱 B — 命令列 `$` 變數展開
- PowerShell 雙引號字串會展開本機 `$VAR`、`$(...)`。遠端要用的 `$PORT`、`$http_upgrade`、`$host` 等必須逃開（`` `$PORT `` 或用單引號 heredoc `<<'EOF'`）。
- 本技能腳本範例第 [3] 段 nginx 配置用 `<<'EOF'` 單引號 heredoc 包住，避免 `$` 被本機吃掉。

陷阱 C — 指紋硬鐵律（防誤連陌生主機）
- 登入前 `ssh-keygen -lf $KEY` 取 fingerprint，必須 == 預期值（如 `SHA256:YGMYtfuYxdV6hJ8yXySOLbQn3ziqnMIHS5+HZlzwyys`）才續行，否則 exit 1。
- 不符即中止，絕不「假稱匹配」。

## 完整範本（PowerShell 版，可直接改路徑複用）

```powershell
# deploy-vps.ps1 — 防假完成三關卡範本
param()
$VPS      = "ubuntu@161.118.248.180"
$KEY      = "$env:USERPROFILE\.ssh\esggo_original"
$APP_DIR  = "/opt/esggo/apps/translate"   # 注意：路徑分歧待與 .sh 版統一
$PORT     = 8789
$DOMAIN   = "translate.esggo.co"
$EXPECTED = "SHA256:YGMYtfuYxdV6hJ8yXySOLbQn3ziqnMIHS5+HZlzwyys"

function Run-SSH { param([string]$Cmd)
  ssh -i $KEY -o StrictHostKeyChecking=no -o BatchMode=yes $VPS $Cmd }

# [0] 指紋預檢
if (-not (Test-Path $KEY)) { Write-Error "❌ 私鑰不存在"; exit 1 }
icacls $KEY /inheritance:r /grant "$($env:USERNAME):R" 2>$null
$FP = (ssh-keygen -lf $KEY | Select-String 'SHA256:.+').Matches.Value
if ($FP -ne $EXPECTED) { Write-Error "❌ 指紋不符，中止"; exit 1 }
Write-Host "✅ 指紋吻合" -ForegroundColor Green

# [1] git pull（遠端 HEAD 真溯源）
Run-SSH "cd $APP_DIR && git fetch origin translate && git checkout translate && git pull origin translate && echo PULLED `$(git rev-parse HEAD)"

# [2] pm2（存活檢查）
Run-SSH "cd $APP_DIR && (command -v pm2 >/dev/null && pm2 delete translate 2>/dev/null || true); PORT=$PORT HOST=127.0.0.1 pm2 start server.mjs --name translate --update-env && pm2 save"
Start-Sleep -Seconds 2
Run-SSH "pm2 describe translate | grep -q 'status.*online' && echo PM2_ONLINE || (echo PM2_FAIL; pm2 logs translate --lines 20 --nostream)"

# [3] nginx
$nginxConf = @"
server { listen 80; server_name $DOMAIN; location / {
  proxy_pass http://127.0.0.1:$PORT; proxy_http_version 1.1;
  proxy_set_header Upgrade `$http_upgrade; proxy_set_header Connection "upgrade";
  proxy_set_header Host `$host; proxy_set_header X-Real-IP `$remote_addr;
  proxy_set_header X-Forwarded-For `$proxy_add_x_forwarded_for;
  proxy_set_header X-Forwarded-Proto `$scheme; proxy_read_timeout 3600s; } }
"@
Run-SSH "cat > /etc/nginx/sites-available/$DOMAIN <<'EOF'
$nginxConf
EOF
ln -sf /etc/nginx/sites-available/$DOMAIN /etc/nginx/sites-enabled/ && nginx -t && systemctl reload nginx"

# [5] 驗證（公開 HTTP 真判）
Start-Sleep -Seconds 3
Run-SSH "curl -sf http://127.0.0.1:$PORT/ -o /dev/null -w 'local HTTP=%{http_code}\n'"
$pubCode = (curl.exe -sf "https://$DOMAIN/" -o /dev/null -w "%{http_code}" 2>$null)
if ($LASTEXITCODE -eq 0) { Write-Host "public HTTP=$pubCode" }
else { Write-Host "public: 未通過（exit=$LASTEXITCODE）—— 勿誤判為成功" }
Write-Host "DONE" -ForegroundColor Green
```

## 驗證清單（腳本自審用）
- [ ] 遠端 commit：腳本印的 HEAD 來自 VPS（`$(...)` 已逃開本機展開）
- [ ] pm2：start 後有 `online` 確認，非單純 `&& pm2 save`
- [ ] 公開端點：用 `$LASTEXITCODE` / `||` 判斷，非 `try/catch` 包 curl.exe
- [ ] curl 換行：遠端用 `\n` 非 `` `n ``
- [ ] 指紋：登入前 `ssh-keygen -lf` 比對，不符即 exit 1
- [ ] 跨檔路徑：ps1 / sh / md 三份 APP_DIR 一致（本實戰曾見 /opt vs /var/www 分歧）

## 實戰來源
- 檔案：`C:\Users\dingj\OneDrive\Documents\Default Project\deploy-translate-vps.ps1`、
  `deploy-translate-vps.sh`、`translate-deploy.md`
- 服務：translate.esggo.co（translate 分支 / apps/translate / 8789），與 universal-translator (8788) 互異
- 技術：純免費算力（Web Speech + MyMemory），零付費 API

## 附錄：OAB broker 啟動（防假完成，來源 oa-swarm-local-runtime §3.2/§3.3）

> OAB（OmniAgentBus）是 OA-Team 事件總線，實體化於 VPS `/opt/esggo/oa-twins/oab/broker.py`。
> 啟動後經 pm2 常駐，heartbeat journal 持續累積即真運作。

### 啟動命令（pm2 管理，禁用 setsid/nohup daemon 化）
```bash
ssh esggo-vps "cd /opt/esggo/oa-twins/oab && pkill -f 'broker.py --bus vps'; sleep 2; \
  pm2 start broker.py --name oab-broker --interpreter python3 \
    -- --bus vps --store /opt/esggo/oa-twins/oab/journal --heartbeat && pm2 save"
```
⚠️ **坑**：`setsid ... < /dev/null &` 或 `nohup` daemon 化後，asyncio 事件迴圈會停滯，heartbeat journal 不增長（self-test 寫檔正常但 daemon 後卡住）。必須用 pm2。

### 防假完成驗證
```bash
ssh esggo-vps "pgrep -f 'broker.py --bus vps'; wc -l /opt/esggo/oa-twins/oab/journal/*.jsonl; pm2 list | grep oab-broker"
# 預期：pgrep 有 PID；journal 行數隨時間增長（7→13→...）；pm2 顯示 online
```
- 真運作證據：journal 含 `health.heartbeat` 事件 + `_constitution`: 5T + entropy_target 0.1 + zero_hallucination:true
- 假完成警訊：pm2 online 但 journal 行數不漲 → daemon 化陷阱，改 pm2 重啟

### self-test（本地先測）
```bash
python3 broker.py --bus local --store ./journal --self-test
# 預期：收 ['health.heartbeat','swarm.phase'], journal size 2, entropy<0.1
```

## 關聯技能
- `esggo-vps-git-deploy`（git pull 黃金法則，管同步方式）
- `esggo-vps-deploy-verify`（防假完成，VPS 端驗證）
- `esggo-vps-ops`（VPS 運維）
- `oa-team-kickoff-verify`（OA-Team 蜂群本機 Ollama kickoff 防假完成）
- `oa-swarm-local-runtime`（OAB 實體化完整記載）

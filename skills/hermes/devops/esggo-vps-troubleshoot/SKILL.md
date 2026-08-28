---
name: esggo-vps-troubleshoot
description: VPS 疑難總解（502、SSH 鎖死、OCI 回收、pm2 崩潰）。當 VPS 任何服務異常時使用。
---

# ESGGO VPS 疑難雜症化解題技能

## 觸發條件
- 子域 502 / 504 / 連不上（nginx / pm2 / 端口漂移）
- SSH `Permission denied` / `Connection timed out` / `Connection refused`
- OCI Console 顯示 esggo-vps STOPPED（Oracle 回收）
- pm2 服務 EXITED / errored
- Let's Encrypt 憑證過期（瀏覽器紅字）
- 磁碟滿（No space left on device）
- OA-Team 雙生代理（OA-LOCAL / OA-VPS）認證斷線

## 核心基礎設施事實
- **VPS**: esggo-vps, OCID `ocid1.instance.oc1.ap-singapore-1.anzwsljrkl3rykyc4fggmvq6kezm65dkzzj5nboi3ihax2qxtxyjnxvrpxza`
- **IP**: 161.118.248.180, region `ap-singapore-1`, AD `xzUx:AP-SINGAPORE-1-AD-1`
- **Tenancy**: `ocid1.tenancy.oc1..aaaaaaaadof5rgb76zexk24q6fnhopqjnrqaxwmeuxunoynw46g3lj3lfnlq`
- **登入帳號**: `ubuntu`
- **可連私鑰**: `C:\Users\dingj\.ssh\esggo_original`（對應 VPS `ssh-key-2026-07-22`）
- **pm2 服務**: esggo-core(3000), omniagent-gateway(8642), universal-translator(8788), omni-api(8789), oa-swarm(8800), s2s-voice(8765), stt-whisper, deerflow, mpt-filedrop
- **nginx**: `/etc/nginx/sites-enabled/*.conf`, `proxy_pass` 指向各服務端口
- **現有防護腳本**: `verify-nginx-ports.sh`(端口檢查), `watchdog_oa.sh`(OA 崩潰重啟), `oa-vps-keepalive.mjs`(防回收), `diagnose-remote.sh`(健康診斷)

## 解題手冊（依症狀分類）

### 症狀 A: 子域 502（nginx upstream 錯誤）
```bash
# 1. 看 nginx 錯誤日誌抓 upstream 端口
sudo tail -20 /var/log/nginx/error.log
# 2. 看 pm2 狀態
pm2 list
# 3. 看該端口是否有人聽
ss -tlnp | grep <端口>
# 4. 若端口不匹配（常見 8787 vs 8788）：
sudo sed -i 's|proxy_pass http://127.0.0.1:OLD;|proxy_pass http://127.0.0.1:NEW;|' /etc/nginx/sites-enabled/<sub>.conf
sudo nginx -t && sudo nginx -s reload
# 5. 若服務掛了：pm2 restart <name> 或 pm2 restart all
```
**根因**: VPS 重啟後 nginx 配置端口與 pm2 實際端口漂移。`verify-nginx-ports.sh` 每 5 分鐘自動檢查（8788 down 會自動 restart universal-translator）。

### 症狀 B: SSH 連不上
**B1: Permission denied (publickey)**
- 原因 1: 本機私鑰 644 權限被 Windows OpenSSH 拒 → `icacls "C:\Users\dingj\.ssh\esggo_original" /inheritance:r /grant:r "dingj:(R)"`
- 原因 2: VPS authorized_keys 被清空（STOP/START 後 cloud-init 覆寫）→ 從 Serial Console 加 key 或 Boot Volume 救援
- 原因 3: 帳號錯（用 `ubuntu` 不是 `root`/`dingj`）

**B2: Connection timed out**
- VPS STOPPED → OCI CLI `instance action --action START`
- 或 fail2ban 封 IP → 等 10 分鐘或從 OCI 控制台解封

**B3: Connection refused**
- sshd 未起 → Serial Console `sudo systemctl start ssh`

### 症狀 C: OCI 回收（VPS STOPPED）
```bash
export SUPPRESS_LABEL_WARNING=True
VPS="ocid1.instance.oc1.ap-singapore-1.anzwsljrkl3rykyc4fggmvq6kezm65dkzzj5nboi3ihax2qxtxyjnxvrpxza"
# 查狀態
timeout 60 oci compute instance get --instance-id "$VPS" --region ap-singapore-1 2>&1 | python -c "import sys,json; print(json.load(sys.stdin)['data']['lifecycle-state'])"
# 喚醒
timeout 60 oci compute instance action --instance-id "$VPS" --region ap-singapore-1 --action START
# 等 90s 後查 port 22/443
```
**防護**: `oa-vps-keepalive.mjs` 每 5 分鐘撐 CPU 負載防閒置回收（crontab 已設）。

### 症狀 D: pm2 服務崩潰
```bash
pm2 list  # 看哪個 EXITED
pm2 logs <name> --lines 50  # 看錯誤
pm2 restart <name>
# 若反覆崩：pm2 restart all && sudo nginx -s reload
```
**防護**: `watchdog_oa.sh` 每 5 分鐘探活 oa-swarm/s2s/OAB，崩潰自動重啟 + Telegram 告警。

### 症狀 E: 憑證過期（Let's Encrypt）
```bash
sudo certbot certificates
sudo certbot renew --dry-run
sudo certbot renew
sudo nginx -s reload
# 若續期失敗（port 80 被佔）：先停 nginx 再 renew
sudo systemctl stop nginx && sudo certbot renew --standalone && sudo systemctl start nginx
```

### 症狀 F: 磁碟滿
```bash
df -h
sudo journalctl --vacuum-time=7d
sudo rm -rf /var/log/*.gz /var/log/nginx/*.gz
pm2 flush
docker system prune -a --volumes
```

### 症狀 G: OA-LOCAL / OA-VPS 通行證斷線
- 確認 VPS OA 服務 online：`pm2 list | grep -E 'oa-swarm|omniagent'`
- 查 .env 認證檔：`ls -la /var/www/esggo/apps/*/.env`
- 若 OA-VPS 無法連 OA-LOCAL：檢查 Cloudflare Tunnel / Tailscale 狀態
- 重啟 OA 服務：`pm2 restart oa-swarm omniagent-gateway`
- 驗證：本機 SSH 通 + 子域 200 = 雙向通道暢通

## Oracle API 限制（重要坑）
- `oci compute instance update --metadata` **拒絕改 `ssh_authorized_keys`**（安全限制）
- Serial Console API connection-string 在 ap-singapore-1 **跳板拒絕公鑰**
- 唯一可靠 Serial Console：**OCI 網頁控制台「啟動 Cloud Shell 連線」**
- OCI 最終一致性延遲：detach/attach Boot Volume 後等 5-10 分鐘

## Boot Volume 救援（SSH + Serial Console 都進不去時）
1. STOP VPS → detach Boot Volume → 建臨時救援實例（用可連 key）
2. attach Boot Volume 到救援機 → mount → 改 `/home/ubuntu/.ssh/authorized_keys`
3. 卸載 → 掛回原機 → START
4. 若 attach Conflict：放棄，掛回原機再 START

## 診斷黃金順序
1. `curl` 子域看 HTTP code（外層）
2. `oci compute instance get` 看 VPS 狀態（基礎設施）
3. `ssh` 進 VPS（權限修正後）
4. `pm2 list` + `sudo nginx -t` + `ss -tlnp`（內層）
5. 看 log（nginx error.log / pm2 logs / journalctl）

## 驗證清單
- [ ] 所有子域 `curl` 回 200
- [ ] SSH 直連 `esggo_original` 成功
- [ ] `pm2 list` 全 online
- [ ] `sudo nginx -t` 通過
- [ ] `sudo certbot certificates` 未過期
- [ ] `df -h` 無 100% 分區
- [ ] OA 服務雙向通道暢通

## 常見坑總結
1. Windows OpenSSH 拒 644 私鑰 → `icacls` 不是 `chmod`
2. Oracle API 封死 authorized_keys 修改 → Serial Console / Boot Volume 救援
3. OCI 最終一致性延遲 → 等 5-10 分鐘
4. nginx 端口 ≠ pm2 端口 → 502 最常見根因
5. VPS STOPPED 後 authorized_keys 清空 → cloud-init 覆寫
6. Let's Encrypt 續期需 port 80 → 先停 nginx
7. Oracle Always-Free 閒置回收 → keepalive 腳本撐 CPU
8. **SSH alias vs direct IP**: `~/.ssh/config` defines `Host esggo-vps` but `ssh ubuntu@161.118.248.180` ignores it (tries system default keys only). **Fix**: use the alias `ssh esggo-vps` (or `ssh root@esggo-vps`), not the raw IP/hostname. The config's `HostName + User + IdentityFile` only apply when the alias matches.

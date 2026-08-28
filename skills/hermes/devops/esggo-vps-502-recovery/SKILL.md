---
name: esggo-vps-502-recovery
description: 修復 ESGGO VPS 502 SSH 解鎖（nginx 端口一致性、OCI 喚醒、Boot Volume 救援）。
---

# ESGGO VPS 502 修復與 SSH 解鎖技能

## 觸發條件
- `curl https://live.esggo.co` 回 502（其他子域可能也受影響）
- VPS SSH `Permission denied (publickey)` 或 `Connection timed out`
- OCI Console 顯示 esggo-vps 狀態 STOPPED
- nginx error.log 出現 `connect() failed (111: Connection refused) while connecting to upstream`

## 核心事實（ESGGO 基礎設施）
- **VPS**: esggo-vps, OCID `ocid1.instance.oc1.ap-singapore-1.anzwsljrkl3rykyc4fggmvq6kezm65dkzzj5nboi3ihax2qxtxyjnxvrpxza`
- **IP**: 161.118.248.180, region `ap-singapore-1`, AD `xzUx:AP-SINGAPORE-1-AD-1`
- **Tenancy**: `ocid1.tenancy.oc1..aaaaaaaadof5rgb76zexk24q6fnhopqjnrqaxwmeuxunoynw46g3lj3lfnlq`
- **登入帳號**: `ubuntu`（Serial Console 用，密碼登入；SSH 金鑰認證）
- **能連的私鑰**: `C:\Users\dingj\.ssh\esggo_original`（對應 VPS 信任的 `ssh-key-2026-07-22`）
- **pm2 服務**: esggo-core(3000), omniagent-gateway(8642), universal-translator(8788), omni-api(8789), oa-swarm(8800), s2s-voice, stt-whisper, deerflow, mpt-filedrop
- **nginx**: 配置在 `/etc/nginx/sites-enabled/*.conf`，`proxy_pass` 指向各服務端口

## 診斷流程（由外而內）

### Step 1: 確認 502 範圍
```bash
for sub in esggo.co live.esggo.co translate.esggo.co aistation.esggo.co hermex.esggo.co memory.esggo.co mpt.esggo.co deerflow.esggo.co; do
  code=$(curl -s -o /dev/null -w "%{http_code}" --max-time 10 "https://$sub" 2>/dev/null)
  echo "$sub -> ${code:-TIMEOUT}"
done
```

### Step 2: 查 VPS 狀態（OCI CLI）
```bash
export SUPPRESS_LABEL_WARNING=True
VPS="ocid1.instance.oc1.ap-singapore-1.anzwsljrkl3rykyc4fggmvq6kezm65dkzzj5nboi3ihax2qxtxyjnxvrpxza"
timeout 60 oci compute instance get --instance-id "$VPS" --region ap-singapore-1 2>&1 | python -c "import sys,json; print('state:', json.load(sys.stdin)['data']['lifecycle-state'])"
```

### Step 3: 若 STOPPED → 喚醒
```bash
timeout 60 oci compute instance action --instance-id "$VPS" --region ap-singapore-1 --action START
# 等 ~90s 後查 port
timeout 6 bash -c 'cat < /dev/null > /dev/tcp/161.118.248.180/22' 2>/dev/null && echo "22:OPEN" || echo "22:CLOSED"
timeout 6 bash -c 'cat < /dev/null > /dev/tcp/161.118.248.180/443' 2>/dev/null && echo "443:OPEN" || echo "443:CLOSED"
```

### Step 4: SSH 連 VPS（先修權限！）
**關鍵坑**: Windows OpenSSH 拒絕 644 權限私鑰（`no identity pubkey loaded`），`chmod 600` 在 MSYS **無效**，必須用 `icacls`：
```powershell
icacls "C:\Users\dingj\.ssh\esggo_original" /inheritance:r /grant:r "dingj:(R)"
```
```bash
ssh -o StrictHostKeyChecking=accept-new -o BatchMode=yes -o IdentitiesOnly=yes -i "/c/Users/dingj/.ssh/esggo_original" ubuntu@161.118.248.180 "echo SSH_OK"
```

### Step 5: 診斷 502 根因（進 VPS 後）
```bash
# 看 nginx 錯誤日誌（關鍵：upstream 端口）
sudo tail -5 /var/log/nginx/error.log
# 看 pm2 服務狀態
pm2 list
# 看 nginx 實際 proxy_pass 端口
grep -r 'proxy_pass' /etc/nginx/sites-enabled/live.esggo.co.conf
# 看該端口是否有人聽
ss -tlnp | grep 8787  # 或錯誤日誌裡的端口
```

### Step 6: 端口一致性修復（最常見根因）
**症狀**: nginx `proxy_pass http://127.0.0.1:8787` 但 pm2 服務聽 `8788`（端口不匹配 → Connection refused → 502）

**修法**:
```bash
# 確認服務實際端口
pm2 env <id> | grep PORT
curl -s -o /dev/null -w "%{http_code}" http://localhost:8788  # 確認 200
# 改 nginx 配置
sudo sed -i 's|proxy_pass http://127.0.0.1:8787;|proxy_pass http://127.0.0.1:8788;|' /etc/nginx/sites-enabled/live.esggo.co.conf
sudo nginx -t
sudo nginx -s reload
```
修完從本機 `curl https://live.esggo.co` 確認 200。

### Step 7: 若服務全掛（非端口問題）
```bash
pm2 restart all
sudo nginx -s reload
```

## OCI 解鎖進階（SSH 完全進不去時）

### Oracle API 限制（重要）
- `oci compute instance update --metadata` **拒絕改 `ssh_authorized_keys`**（Oracle 安全限制）
- Serial Console 的 API connection-string（`oci compute instance-console-connection create` 產生的 `ssh ... instance-console...`）在 ap-singapore-1 **跳板持續拒絕公鑰**
- 唯一可靠的 Serial Console 是 **OCI 網頁控制台的「啟動 Cloud Shell 連線」**（瀏覽器終端）

### Boot Volume 救援（忘記密碼 + SSH 進不去時）
1. STOP VPS
2. 分離 Boot Volume（`oci compute boot-volume-attachment detach --boot-volume-attachment-id <attach_id> --force`）
   - **注意**: attach_id 是 `boot-volume-attachment list` 回傳的 `id` 欄位（OCI 設計成 = instance OCID）
   - detach 後 OCI 有**最終一致性延遲**（5-10 分鐘），list 說 DETACHED 但 attach 仍說 attached → 等久一點
3. 建臨時救援實例（用可連的 key）：
   ```bash
   oci compute instance launch \
     --compartment-id "$TEN" --availability-domain "$AD" \
     --shape "VM.Standard.A1.Flex" --shape-config '{"ocpus":1,"memoryInGBs":6}' \
     --image-id "$IMG" --subnet-id "$SUB" \
     --ssh-authorized-keys-file "C:/Users/dingj/.ssh/esggo_original.pub" \
     --display-name "rescue-temp" --region ap-singapore-1
   ```
   - **Windows 路徑用 `C:/Users/...` 不是 `/c/Users/...`**
   - `--ssh-authorized-keys-file`（不是 `--ssh-authorized-keys`）
4. 附加 Boot Volume 到救援機 → mount → 改 `/home/ubuntu/.ssh/authorized_keys` → 卸載 → 掛回原機 → 啟動
5. **若 attach 一直 Conflict**：放棄救援機，把 Boot Volume 掛回原機（`attach --instance-id <原VPS>`），再 START

### 救援機清理
```bash
printf 'y\n' | oci compute instance terminate --instance-id "$RESCUE" --region ap-singapore-1 --force
```

## 驗證清單
- [ ] 所有子域 `curl` 回 200
- [ ] SSH 直連 `esggo_original` 成功
- [ ] `pm2 list` 全 online
- [ ] `sudo nginx -t` 通過
- [ ] nginx error.log 無 Connection refused

## 常見坑
1. **Windows OpenSSH 拒 644 私鑰** → 用 `icacls` 改權限，不是 `chmod`
2. **Oracle API 封死 ssh_authorized_keys 修改** → 走 Serial Console 或 Boot Volume 救援
3. **OCI 最終一致性延遲** → detach/attach 後等 5-10 分鐘
4. **nginx 端口 ≠ pm2 端口** → 502 最常見根因，查 error.log 的 upstream 端口
5. **VPS STOPPED 後 authorized_keys 被清空** → STOP/START 觸發 cloud-init 覆寫，需重新加 key

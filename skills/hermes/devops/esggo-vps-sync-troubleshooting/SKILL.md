---
name: esggo-vps-sync-troubleshooting
description: ESGGO VPS 同步處理技巧，包含 SSH 金鑰還原、GitHub Actions 自動化部署與服務健康檢查
tags: [devops, vps, ssh, github-actions, pm2]
triggers:
  - vps sync
  - ssh key restore
  - github actions deploy
  - pm2 reload
  - esggo deploy

---

# ESGGO VPS 同步故障排除指南

## 1. 問題診斷

### SSH 連線失敗 (Permission denied (publickey))
- 檢查金鑰權限：`stat -c "%a" ~/.ssh/esggo_original` 應為 `600`
- 公鑰權限：應為 `644`
- 從備份還原：`cp ~/.ssh/esggo_original.bak.* ~/.ssh/esggo_original`

### PITFALL: 用錯用戶會誤判通道中斷 (2026-08-06 實證)
VPS `161.118.248.180` 上 **`git@` 一律 Permission denied，但 `ubuntu@` 可連通**。
`apps/omni-blueprint-hub/deploy.sh` 預設 `HOST="${DEPLOY_HOST:-ubuntu@161.118.248.180}"`。
因此：
- 測試通道時**務必同時試 `ubuntu@` 與 `git@`**，不要用 `git@` 失敗就斷言「通道壞了」。
- 本機 `ssh -i ~/.ssh/esggo_original ubuntu@161.118.248.180 'echo OK'` 成功即代表通道通達。
- 若 `ubuntu@` 也拒絕，才是真的需要在 VPS 本機執行
  `cat ~/.ssh/esggo_original.pub >> ~/.ssh/authorized_keys`（授權公鑰）。

### 私鑰收進 secret-vault（Windows，chmod 600 等效）
```powershell
Copy-Item "C:\Users\dingj\.ssh\esggo_original" "C:\Users\dingj\secret-vault\esggo_original" -Force
icacls "C:\Users\dingj\secret-vault\esggo_original" /inheritance:r /grant:r "$env:USERNAME:R"
```
祕密聖櫃（`C:\Users\dingj\secret-vault\`）為根，私鑰集中收納、僅本人可讀。

### 權限修復
```bash
# 還原私鑰
cp ~/.ssh/esggo_original.bak.20260804063842 ~/.ssh/esggo_original
chmod 600 ~/.ssh/esggo_original

# 重新生成公鑰
ssh-keygen -y -f ~/.ssh/esggo_original > ~/.ssh/esggo_original.pub
chmod 644 ~/.ssh/esggo_original.pub
```

### 憑證驗證閉環（強制，禁止假稱匹配）
**使用者習慣：加入 VPS 信任清單前，必須 `ssh-keygen -lf` 驗證 fingerprint，確認無誤才回 done；未核對不假稱匹配。**
- esggo_original 真值指紋（RSA2048）：`SHA256:YGMYtfuYxdV6hJ8yXySOLbQn3ziqnMIHS5+HZlzwyys`
- 本機驗證（Windows PowerShell）：
  ```powershell
  ssh-keygen -lf C:\Users\dingj\secret-vault\esggo_original
  ```
  預期輸出首段含 `SHA256:YGMYtfuYxdV6hJ8yXySOLbQn3ziqnMIHS5+HZlzwyys`；若不同 → **不是** esggo_original，勿加入信任清單。
- 連續實戰：曾遇多把不匹配憑證（含誤稱 ed25519 公鑰為 esggo_original 公鑰）皆開不了 `ubuntu@161.118.248.180`，直至手動加信任並核對指紋。
- 新增公鑰到 VPS 信任前，先確認指紋匹配；agent 不可在未驗證情況下回報「金鑰匹配成功」。此即 Superpowers「證據優於聲稱」原則的硬實踐。

## 2. VPS 端配置

```bash
# 設定 authorized_keys
cat ~/.ssh/esggo_original.pub >> ~/.ssh/authorized_keys
chmod 644 ~/.ssh/authorized_keys
chmod 700 ~/.ssh

# 重啟 SSH
sudo systemctl restart sshd

# 同步代碼
cd /opt/esggo
git pull origin main
pm2 reload ecosystem.config.js

# 驗證健康
curl -sS https://esggo.co/api/healthz
```

## 3. 自動化部署

### GitHub Actions 觸發
```bash
gh run list --branch main --limit 3
gh run rerun <failed-run-id>
```

### Cloudflare Tunnel 驗證
```bash
curl -sS https://esggo.co/api/health
curl -sS https://omniagent.esggo.co/health
```

## 4. 健康檢查

### API 端點
- `https://esggo.co/api/health` - 主體健康狀態
- `https://esggo.co/api/healthz` - 詳細組件檢查
- `https://omniagent.esggo.co/health` - OmniAgent 狀態

## 5. 常見問題解決方案

### Port 22 被阻擋
- 使用 Cloudflare Tunnel 替代方案
- 或檢查防火牆規則：`sudo ufw status`

### PM2 服務無回應
```bash
pm2 status
pm2 logs esggo-core --lines 20
pm2 restart esggo-core
```
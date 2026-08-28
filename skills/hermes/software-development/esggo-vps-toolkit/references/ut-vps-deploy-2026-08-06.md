# universal-translator VPS 部署實錄（2026-08-06）

來源：Hermes 終端 SSH 到 161.118.248.180（ubuntu@，私鑰 ~/.ssh/esggo_original）。

## 時間線與關鍵錯誤轉錄

### 1. 提交（本機）
`bash scripts/push_final.sh` → commit d4e114a16 推送 main（13 files, +602/-170）。
GitHub 回報 22 Dependabot 漏洞（3 critical/3 high/14 moderate/2 low），非阻塞。

### 2. VPS verify 路徑錯誤
用戶給的路徑 `apps/universal-translator/deploy/verify_universal_translator.sh` 不存在。
實查：`find /opt/esggo -name verify_universal_translator.sh` → `./deploy/verify_universal_translator.sh`（頂層）。
修正：`bash deploy/verify_universal_translator.sh`。

### 3. SSH 連線
首次 `ssh ubuntu@161.118.248.180` → `Permission denied (publickey)`。
修正：`ssh -i /c/Users/dingj/.ssh/esggo_original -o StrictHostKeyChecking=accept-new ubuntu@161.118.248.180`。

### 4. verify 健康檢查失敗
```
=== 1. 健康檢查 ===
❌ 健康檢查失敗
EXIT=1
```
實查發現 universal-translator 進程根本未啟動：
```
pm2 list  → 只有 esggo-core / omni-blueprint-hub / omniagent-gateway，無 universal-translator
ss -ltn | grep 8788 → 無 listener
```

### 5. 嘗試 deploy.sh 啟動 → 自 SSH 回連失敗
`bash deploy.sh --skip-sync` 內部 `SSH="ssh -i $KEY"`（KEY=$HOME/.ssh/esggo_original），
VPS 上 $HOME=/home/ubuntu，私鑰不在 VPS：
```
Warning: Identity file /home/ubuntu/.ssh/esggo_original not accessible
ubuntu@161.118.248.180: Permission denied (publickey).
EXIT=255
```

### 6. 直接 pm2 start → ws 未裝
```
[PM2] Starting server.mjs ... Done.
universal-translator  online
# 但 curl localhost:8788/health → Connection refused
pm2 logs universal-translator:
  Error [ERR_MODULE_NOT_FOUND]: Cannot find package 'ws' imported from server.mjs
```

### 7. npm install 崩潰根因
```
npm install ws --omit=dev
npm error Cannot read properties of null (reading 'matches')
npm warn tarball tarball data for closure-net@git+github.com/google/closure-net.git#... (null) seems to be corrupted
node_modules/ws/package.json → No such file or directory
```
debug log 首行：`info config found workspace root at /opt/esggo`
（npm 把上層 pnpm workspace 當 root，爬取整倉依賴，其中 git 源 closure-net tarball 損壞）

### 8. 修復（關閉 workspace 爬蟲）
```
npm install ws@^8.18.0 --workspaces=false --include-workspace-root=false \
  --no-package-lock --no-audit --no-fund --omit=dev
added 1 package in 607ms
node_modules/ws/package.json ✅
```

### 9. 重啟 + 健康檢查通過
```
pm2 restart universal-translator --update-env
curl -sf http://localhost:8788/health
{"status":"ok","version":"1.2.0","stats":{"calls":0,"cacheHits":0,"errors":0,"byEngine":{}}}
```

### 10. verify 全過
```
✅ 健康檢查通過
✅ 單語翻譯 OK
✅ 多語翻譯 OK
⚠️ SSE /stream 無回傳 (可略過)
🎉 Universal-Translator 所有測試通過！
```

## 可複用教訓
1. monorepo 子目錄 `npm install` 必帶 `--workspaces=false --include-workspace-root=false`。
2. deploy.sh 內含 SSH 回連，在 VPS 本機不可直接用；直接 `pm2 start`。
3. verify 腳本路徑在頂層 `deploy/`，不在 `apps/universal-translator/deploy/`。
4. pm2 顯 online 不代表服務活著——`import` 缺依賴會崩在啟動瞬間，須 curl 健康端點確認。

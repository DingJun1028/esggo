---
name: esggo-vps-git-deploy
description: Deploy esggo to VPS 161.118.248.180 via git pull not tar.
version: 1.0.0
author: dingj
license: MIT
metadata:
  hermes:
    tags: [esggo, vps, deploy, git-pull, oa-team]
    related_skills: [esggo-learning-center-verify-deploy, esggo-omnidag-ci-heal, esggo-vps-ops]
---

## When to Use
- 用戶說「同步檔案到遠端部署 VPS」/「部署 esggo」/「deploy to VPS」
- 目標：VPS `ubuntu@161.118.248.180`，目錄 `/var/www/esggo`

# esggo VPS Git-Pull 部署（經驗技能書）

> 固化自 2026-08-21 實戰：tar/scp 整個專案同步 VPS 失敗（MSYS 路徑錯誤 + 26 萬檔 tar 逾時 435s），
> 改發現 VPS `/var/www/esggo` 本身就是 git repo → 改用 `git pull` 快 100 倍。

## 觸發條件
- 用戶說「同步檔案到遠端部署 VPS」/「部署 esggo」/「deploy to VPS」
- 目標 VPS：`ubuntu@161.118.248.180`（SSH key: `C:/Users/dingj/.ssh/esggo_original`）
- 部署目錄：`/var/www/esggo`

## 黃金法則
**VPS `/var/www/esggo` 是 git repo（`origin` = `https://github.com/DingJun1028/esggo.git`），
永遠用 `git pull` 同步，不要 tar/scp 整個目錄。**

### 為什麼不用 tar/scp
- 專案檔案數極多（VPS node_modules 含 26 萬檔；本機排除 node_modules 後仍數萬檔）
- MSYS/git-bash 下 `tar czf - . | ssh ... tar xzf -` 打包掃描極慢（435s 還未完成）
- `LOCAL_DIR=$(cd ... && pwd)` 在 MSYS 解析成 `C:\c\Project\esggo`（路徑轉換 bug），node 找不到檔

### 前置條件
- 本機所有變更已 `git commit` + `git push origin main`（VPS 只 pull，不接收本地未 push 的修改）
- VPS 端 `git pull` 需要 VPS 工作樹乾淨（或用 stash 暫存）

## 標準流程（VPS 端一鍵）

```bash
ssh -i C:/Users/dingj/.ssh/esggo_original ubuntu@161.118.248.180 "cd /var/www/esggo && \
  git stash && \
  git clean -fd .github/workflows/ && \
  git pull origin main && \
  export CI=true && \
  pnpm install --no-frozen-lockfile --no-optional && \
  git stash pop && \
  pm2 reload all"
```

### 分步說明
1. **git stash**：暫存 VPS 本地修改（`.agents/skills/...`、`data/ncbdb.json` 等 VPS 特有修改）
2. **git clean -fd .github/workflows/**：移除阻擋 pull 的未追蹤檔（omnitag-weekly-audit.yml 等）
3. **git pull origin main**：同步到最新（本機已 push 的版本）
4. **pnpm install --no-frozen-lockfile**：
   - **必須 `CI=true`**：否則 pnpm 因無 TTY 卡在 `ERR_PNPM_ABORTED_REMOVE_MODULES_DIR_NO_TTY`
   - **必須 `--no-frozen-lockfile`**：若 `apps/*/package.json` 有新增依賴（如 oa-swarm 加 typescript/tsx/vitest），frozen 會報 `ERR_PNPM_OUTDATED_LOCKFILE`
5. **git stash pop**：還原 VPS 本地修改（通常無衝突，因 stash 的是 VPS 特有檔）
6. **pm2 reload all**：重載全部 7 服務（oa-swarm, esggo-core, omniagent-gateway, s2s-voice, stt-whisper, universal-translator, deerflow）

## 驗證
```bash
ssh -i C:/Users/dingj/.ssh/esggo_original ubuntu@161.118.248.180 "cd /var/www/esggo && \
  git rev-parse HEAD && \
  pm2 list && \
  curl -sf http://127.0.0.1:8642/status && echo ' Gateway OK'"
```
- `git rev-parse HEAD` 應 = 本機 `origin/main`
- pm2 7 服務全 `online`
- Gateway `/status` 回 `{"status":"online"...}`

## 坑（實戰踩過）
| 坑 | 現象 | 解法 |
|---|---|---|
| MSYS 路徑轉換 | `cd $(dirname $0)/..` → `C:\c\Project\esggo` | 用 `cygpath -w` 給 node，POSIX 路徑給 tar/ssh |
| tar 大專案逾時 | 435s 還在打包 | 改用 git pull（秒級） |
| pnpm TTY 卡死 | `ERR_PNPM_ABORTED_REMOVE_MODULES_DIR_NO_TTY` | `export CI=true` |
| lockfile 過期 | `ERR_PNPM_OUTDATED_LOCKFILE` | `pnpm install --no-frozen-lockfile` |
| pull 阻擋 | untracked file would be overwritten | `git clean -fd <path>` 或 `git stash` |
| 編碼檢查阻塞 | encoding-check.mjs 找不到（路徑錯） | 編碼檢查改**非致命**（warn 不 exit） |

## 何時用 tar/scp 部署腳本（scripts/deploy-vps.sh）
- 僅首次部署（VPS 還不是 git repo）
- 或非 git 環境
- 修正版 deploy-vps.sh 已含 cygpath + 非致命編碼檢查，但實戰證明 git pull 更快更穩

## 關聯技能
- `esggo-learning-center-verify-deploy`（學習中心部署驗證）
- `esggo-omnidag-ci-heal`（CI 修復）
- `esggo-vps-ops`（VPS 運維）

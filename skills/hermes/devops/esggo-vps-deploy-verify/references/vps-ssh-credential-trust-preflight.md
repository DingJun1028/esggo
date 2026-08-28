# VPS SSH 憑證信任預檢 + 遠端 docker compose 驗證

提煉自 2026-08-25 回合：用戶在 Windows 主機下達 Linux path 指令
`cd /opt/esggo/apps/mpt && docker compose -f docker-compose.esggo.yml up -d`，
實際目標是 VPS `161.118.248.180` 上的 MoneyPrinterTurbo 堆疊。

## 關鍵事實（寫死，避免每次重探）
- VPS host：`161.118.248.180`
- 登入帳號：`root@`（預設 `ssh root@host` 不加 `-i` 會 `Permission denied (publickey)`，**必須顯式指定私鑰**）
- 可開 VPS 的私鑰（2026-08-25 實測）：`esggo_original`、`esggo_vps_fix`、`gh_deploy_key`
- `esggo_original.pub` 權威指紋（用戶聖典記錄，加入信任清單前必對）：
  `2048 SHA256:YGMYtfuYxdV6hJ8yXySOLbQn3ziqnMIHS5+HZlzwyys`
- `/opt/esggo/apps/mpt` 是 MoneyPrinterTurbo compose：
  - `moneyprinterturbo-webui` → `127.0.0.1:7860->8501/tcp`
  - `moneyprinterturbo-api`   → `127.0.0.1:7861->8080/tcp`
  - 兩者 `restart: always`，綁 `127.0.0.1`（不對外）

## Windows host 路徑解析（第一步）
Linux `/opt/...` 路徑在 Windows 主機不存在。先確認本地無此路徑，再判定為 VPS：
```bash
ls -la /opt/esggo/apps/mpt 2>&1          # 期望 No such file or directory
docker --version 2>&1                     # Windows 本機有 docker，但那是本機 daemon
# 確認本地 repo 也沒有 mpt / 該 compose 檔
find /c/Users/dingj/esggo /c/Project/esggo -maxdepth 4 -type d -name mpt 2>/dev/null
```
若本地皆無 → 指令是對 VPS 下達，走 SSH。

## 預檢腳本（複製即用，勿手打）
```bash
# 1. 抓 host key 指紋（先不信任，只記錄）
ssh-keyscan -t ed25519,rsa 161.118.248.180 2>/dev/null | ssh-keygen -lf - 2>&1

# 2. 逐把候選私鑰 BatchMode 探活（非互動，不會卡住）
for k in esggo_original id_rsa_esggo id_rsa_esggo_new id_rsa_esggo_new2 esggo_vps_fix ci_deploy_key gh_deploy_key; do
  printf "%-20s " "$k"
  ssh -i /c/Users/dingj/.ssh/$k -o BatchMode=yes -o ConnectTimeout=6 \
      -o StrictHostKeyChecking=accept-new -o UserKnownHostsFile=/tmp/known_test \
      root@161.118.248.180 'echo OK' 2>&1 | head -1
done

# 3. 選中私鑰後，核對其 pubkey 指紋 == 用戶聖典記錄
ssh-keygen -lf /c/Users/dingj/.ssh/esggo_original.pub
# 期望：2048 SHA256:YGMYtfuYxdV6hJ8yXySOLbQn3ziqnMIHS5+HZlzwyys ...
```

## 執行前非破壞檢查（先看後跑）
```bash
ssh -i /c/Users/dingj/.ssh/esggo_original -o BatchMode=yes -o ConnectTimeout=8 \
    -o StrictHostKeyChecking=accept-new -o UserKnownHostsFile=/tmp/known_vps \
    root@161.118.248.180 \
    'cat /opt/esggo/apps/mpt/docker-compose.esggo.yml; \
     docker compose -f /opt/esggo/apps/mpt/docker-compose.esggo.yml ps'
```

## 跑指令 + 真實驗證
```bash
ssh -i /c/Users/dingj/.ssh/esggo_original -o BatchMode=yes -o ConnectTimeout=8 \
    -o StrictHostKeyChecking=accept-new -o UserKnownHostsFile=/tmp/known_vps \
    root@161.118.248.180 \
    'cd /opt/esggo/apps/mpt && docker compose -f docker-compose.esggo.yml up -d; \
     echo "EXIT:$?"; \
     docker compose -f docker-compose.esggo.yml ps'
```
- `up -d` 是冪等的：容器已在跑會只回 `Running`，不會重拉映像。
- 若用戶要「拉新映像重啟」，改成 `docker compose pull && docker compose up -d`。
- 永遠回報 `docker compose ps` 真實輸出（STATUS / PORTS），不靠 `up -d` 的回顯宣稱成功。

## 坑
- ❌ 預設 `ssh root@host` 不加 `-i` → Permission denied；必須 `-i <key>`。
- ❌ 見到 Linux path 就當本機跑 → Windows 主機沒有 `/opt`，那是 VPS。
- ❌ 用戶貼的 key 自稱「就是 esggo_original」但 fingerprint 不同 → 加入信任前先用 `ssh-keygen -lf` 比對，不符不假稱匹配（用戶硬規）。
- ✅ 先抓 host key 指紋留存，再探活 key，再核對 pubkey 指紋，最後才執行。

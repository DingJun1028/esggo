# 除錯經驗庫

## 已知問題
1. hermes config set 會重複寫入 config.yaml → 用 Python yaml
2. Telegram Bot 400 錯誤 → 訊息太長，截斷 4000 字符
3. pnpm/action-setup@v5 在 GitHub Actions 失敗 → 用 v4 + version 9
4. model_catalog 不能用 config set 寫入 → 用 Python yaml

## 教訓
- VPS terminal 就是 SSH，不要 re-ssh
- /etc 檔案用 sudo tee 寫入
- sed 容易出錯，用 Python 替代
- 用戶會 lag，等完整訊息再回覆

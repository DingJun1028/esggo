# Telegram Free — esggo 接線說明

| 資源 | 免費額度 | 用於 esggo | 備註 |
|---|---|---|---|
| Bot API | 免費 | CD/系統失敗警報 | long polling / webhook |

Env/金鑰：
- `TELEGRAM_BOT_TOKEN`
- `TELEGRAM_CHAT_ID`

接線：
- `infra/scripts/telegram-alert.sh`
- 或未來 `infra/vps/comms/telegram-alert.sh`

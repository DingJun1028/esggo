---
name: hermes-cron-webhook-scheduling
description: Use Hermes cron as fallback when n8n is unavailable.
---

# Hermes Cron + Webhook 排程實戰經驗技能書

> 真實場景：n8n container 不在 Running / REST API 401 時，
> 用 Hermes cron 直接觸發 production webhook，避免流程卡死。

---

## 1. 何時啟用

- n8n container 未 Running (`docker ps`  empty)
- n8n REST API 持續 `401 Unauthorized`
- 需要簡單定時觸發，不需要複雜 branching / merge
- 作為 n8n 的 **graceful fallback**

---

## 2. Hermes cron 建立

```python
cronjob(
  action='create',
  name='AI Station Daily Webhook',
  schedule='0 9 * * *',
  prompt='Trigger the AI Station webhook at https://aistation.esggo.co/webhook/n8n with a fresh daily script. Use the provided WEBHOOK_SECRET from config if set. Return the job status and video URL if done.',
  skills=['aistation'],
  attach_to_session=True,
  deliver='origin'
)
```

**回傳**
```json
{
  "id": "cron-job-uuid",
  "name": "AI Station Daily Webhook",
  "schedule": "0 9 * * *",
  "status": "enabled"
}
```

---

## 3. 觸發測試

```bash
# 手動立即觸發一次
cronjob(action='run', job_id='cron-job-uuid')

# 或直接用 curl 驗證 production webhook
curl -sS -X POST https://aistation.esggo.co/webhook/n8n \
  -H 'content-type: application/json' \
  --data-binary '{"script":"final verification"}'
```

---

## 4. n8n 阻塞時的替代方案

| 需求 | Hermes cron | 手動瀏覽器 |
|------|-------------|------------|
| 定時排程 | ✅ 支援 | ❌ |
| 多步驟 branching | ❌ | ✅ n8n UI |
| Webhook 認證 | ⚠️ 需在 prompt 內帶 secret | ✅ UI 內建 |
| 視覺化監控 | ❌ | ✅ n8n executions |

---

## 5. cloudflared tunnel 路由修復

**症狀**
- `docker ps` 顯示 aistation-core 在 `127.0.0.1:8000`
- 但 `cloudflared/config.yml` 路由指向 `127.0.0.1:8001`
- 結果：public `/storage/` 404

**修復**
```bash
ssh ubuntu@VPS "sudo sed -i 's|127.0.0.1:8001|127.0.0.1:8000|g' /etc/cloudflared/config.yml"
ssh ubuntu@VPS "sudo systemctl restart cloudflared"
```

**驗證**
```bash
curl -sS https://aistation.esggo.co/api/health
curl -sS https://aistation.esggo.co/storage/{job_id}/final.mp4
```

---

## 6. 驗證 checklist

- [ ] Hermes cron job 已建立，`cronjob action=list` 可見
- [ ] 手動 `cronjob action=run` 或 curl 觸發成功
- [ ] production webhook 回 `{"ok":true}`
- [ ] `/storage/{job_id}/final.mp4` 可公開存取
- [ ] cloudflared `config.yml` 路由指向實際 port

---

## 7. 常用 one-liner

```bash
# 列出所有 cron jobs
cronjob action=list

# 立即觸發
cronjob action=run job_id=<id>

# 驗證 webhook
curl -sS -X POST https://aistation.esggo.co/webhook/n8n \
  -H 'content-type: application/json' \
  --data-binary '{"script":"smoke test"}'
```

---

## 8. 相關技能

- `esggo-aistation-deployment` — AI Station VPS 部署
- `esggo-next-build-recovery` — Next.js build 恢復
# AI Station — Unblock Checklist

## P1 雲端增強（免費 fallback 已就緒，加 key 後自動啟用）

| Secret | 用途 | 免費替代 |
|--------|------|----------|
| `ELEVENLABS_API_KEY` | 語音合成質感提升 | `edge-tts` |
| `RUNWAY_API_KEY` | AI B-roll 視覺 | `Pillow` 品牌漸層 |
| `AWS_ACCESS_KEY_ID` | S3 公開托管 | 本地 `/storage/` |
| `AWS_SECRET_ACCESS_KEY` | S3 簽章 | — |
| `AWS_S3_BUCKET` | S3 bucket | — |

### GitHub Secrets 操作
```bash
gh secret set ELEVENLABS_API_KEY -b "sk-..."
gh secret set RUNWAY_API_KEY -b "key-..."
gh secret set AWS_ACCESS_KEY_ID -b "AKIA..."
gh secret set AWS_SECRET_ACCESS_KEY -b "secret"
gh secret set AWS_S3_BUCKET -b "my-bucket"
```
> 互動式 `gh secret set NAME` 在無 TTY 時會**建立空 secret**；務必用 `-b` 或手動網頁輸入。

### 預期行為
- 加入 `ELEVENLABS_API_KEY` → CI `cloud-integration` job 自動跑 `pytest -m cloud`
- 加入 `RUNWAY_API_KEY` → 同上
- 加入 AWS triplet → `storage.publish()` 上傳 S3，job result 帶 `video_url`（公開 URL）
- 不加 → 免費路徑不受影響

### 驗證
```bash
cd C:\Project\aistation
git push origin main   # trigger CI
# watch: https://github.com/DingJun1028/aistation/actions
```

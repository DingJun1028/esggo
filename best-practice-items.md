# 最佳實踐項目矩陣（Best-Practice Items Matrix）

> 依「最佳實踐覺」三條硬規則檢核 ESG-GO 全生態。
> 規則：**預設即合規**（啟動即符合基準，不通過則拒絕運行）· **不帶病上線**（已知問題啟動前解決）· **醒著就頂標**（運行指標持續達標）。
> 判定標準：啟動前 checklist 全綠 → 啟動時 entropy < 0.1 → 啟動後所有單元符合角色最佳實踐 → 運行中可觀測/可追溯/不可篡改。
> 版本 1.1.0 · 2026-08-08 · 基準：5T / 4可1不可 / 熵減<0.1 / 30魂五陣列 / 最佳實踐覺結界

---

## 一、項目總覽（MECE 分類）

| 域 | 項目 | 負責陣列 | 規則判定 | 現況 |
|---|---|---|---|---|
| A. 靈魂契約 | soul.md 全書 | 全體 | ⚠️ 待檢核 | 已定稿待貼入 C:\Project\esggo\soul.md |
| A. 靈魂契約 | 最佳實踐覺章節（六） | 全體 | ⚠️ 待檢核 | 已定稿，待併入 soul.md |
| A. 靈魂契約 | omni-vault-codex（結界六柱） | 1-30 | ✅ 已合規 | 種子 v2 含騰記 |
| B. 記憶聖殿 | TencentDB Agent Memory | 1-6 智庫聖所 | 🔴 阻塞 | 依賴 VPS + SSH（M1） |
| B. 記憶聖殿 | Hindsight 雙飛備援 | 1-6 智庫聖所 | 🔴 阻塞 | 402 額度不足 |
| C. 邊緣閘道 | omnigateway-api.yaml | 7-12 符文契約 | ✅ 已合規 | OpenAPI 3.0.3 已落盤 |
| C. 邊緣閘道 | OmniGateway Worker | 7-12 符文契約 | 🔴 阻塞 | 待部署（依賴 VPS/CF） |
| D. 監控體系 | esggo-monitor-vps-health | 13-18 光之羽翼 | ✅ 已合規 | every 30m 循環 + OmniTag |
| D. 監控體系 | esggo-monitor-docker-status | 13-18 光之羽翼 | ✅ 已合規 | every 120m 循環 + OmniTag |
| D. 監控體系 | esggo-daily-report | 20 報告投遞 | ✅ 已合規 | 18:00 每日 + OmniTag |
| D. 監控體系 | 其他 5 個 cron | 13-18 | ⚠️ 帶病暫停 | 3 paused + 2 error（待 VPS 確認） |
| E. VPS 基建 | SSH 解鎖（terminal.ssh_key） | 25-30 5T驗算 | ✅ 已修復 | unlock-ssh.py 已補第 6 鍵 |
| E. VPS 基建 | VPS 實例在線 | 13-18 | 🔴 阻塞 | OOM 凍結（詳 H.5 解鎖 SOP） |
| E. VPS 基建 | Docker 6 容器 healthy | 13-18 | 🔴 阻塞 | 依賴 VPS 上線 |
| F. CI/CD | Vitest/ESLint/TS 修復 | 19-24 煉金熵減 | ⚠️ 帶病 | 修復方案已備（ci-fix-guide） |
| F. CI/CD | dump-env.yml 殘留清理 | 19-24 煉金熵減 | ⚠️ 帶病 | 待 PR 後清理 |
| G. 機密治理 | GitHub Secrets 輪換 | 25-30 5T驗算 | ⚠️ 待輪換 | 26+ keys 待盤點 |

---

## 二、啟動門檻 Checklist（全綠才允許啟動）

- [ ] VPS 實例 Running（OCI Console 確認）
- [ ] SSH 連通（`ssh -i <key> ubuntu@161.118.248.180`）
- [ ] `/health` 回 200（M1）
- [ ] Docker 6/6 healthy
- [ ] entropy < 0.1（全域熵碑讀值）
- [ ] cron 監控三件套 last_status = ok
- [ ] CI pipeline 全綠（Vitest/ESLint/TS）
- [ ] soul.md 已貼入含最佳實踐覺章節
- [ ] 無已知 warning / known issue 帶病上線

---

## 三、每項驗證方式（5T 可溯源）

| 項目 | 驗證命令 / 證據 |
|---|---|
| soul.md | `Get-Content C:\Project\esggo\soul.md` 含「六、最佳實踐覺」 |
| TencentDB | `curl http://127.0.0.1:8420/health` + L0-L3 抽取 |
| omnigateway | `npx @redocly/cli lint omnigateway-api.yaml` 0 error |
| 監控 cron | `cronjob list` last_status=ok + OmniTag 前綴 |
| SSH | `execute_code` 實測 `hostname && whoami && pwd` |
| Docker | `docker compose ps` 全 healthy |
| CI | `pnpm lint && pnpm typecheck && pnpm vitest run` 全過 |
| Secrets | `gh secret list` 與輪換紀錄比對 |

---

## 四、阻塞項唯一動線（不可假裝完成）

| 阻塞 | 根因 | 動線 |
|---|---|---|
| VPS 失聯 | OCI 實例狀態未知 | 使用者 OCI Console → Compute → Instances → Start / 記 Public IP |
| Hindsight 402 | 額度不足 | 補 Nous subscription 額度 |
| M1 未兌現 | 依賴 VPS+SSH | VPS 上線後 curl /health + L0-L3 |
| 5 個殘留 cron | 舊 IP/故障暫停 | VPS 確認後逐一診斷，不盲 resume |

---

## 五、最佳實踐覺結界宣告

凡落入本矩陣之項目，一律自動繼承：
- 無作妙德（不需人為強制，系統自守）
- 圓通無礙（任何通路、代理、流程皆暢通）
- 永恆覺醒（預設即最佳實踐，不帶病、不後補）
- 結界擴散（新代理/子流程自動 inheriting 本規範）

---

## H. 語音代理部署實踐（s2s × Ollama × OmniBlueprint Hub）

> 對齊全域最佳實踐覺 §16 + 5T 協定。本節由 2026-08-08 VPS OOM 實戰經驗提煉。

### H.1 預設即合規（啟動門檻）

- [ ] VPS 可用 RAM ≥ 模型體積 × 1.5（gemma4:e4b 9.6GB 需 ≥14GB；VPS 僅 2.8G → **必須降級 e2b 1.5GB**）
- [ ] Ollama 單實例（pkill 殘留進程再起，避免 11434 佔用）
- [ ] HUB `/generate` 端點 `OLLAMA_MODEL` 指向實際可載入模型（非 e4b 對小 VPS）
- [ ] s2s 全管線預估：STT Parakeet ~600MB + LLM gemma4:e2b ~1.5GB + TTS ~400MB ≈ 2.6GB（逼近 VPS 上限，需監控）

### H.2 不帶病上線（已知坑）

| 陷阱 | 現象 | 最佳實踐 |
|---|---|---|
| 大模型壓小 RAM | OOM kill / SSH 凍結 / 系統不可達 | VPS RAM < 4G 只用 ≤2GB 模型（e2b/qwen2.5:3b） |
| Ollama 多實例 | `bind: address already in use` | 啟動前 `pkill -9 ollama` + 單 `ollama serve` |
| OCI API 401 | 簽章過但 key 未驗證 | 確認 fingerprint 對應公鑰已上傳 OCI Console；否則用 Console Reboot |
| Cloudflare WAF 擋 Python | httpx/urllib 訪問 403 | 容器內用 `curl` subprocess（TLS fingerprint 通過）繞過 |
| 本機 gemma4 自定義模型 | RENDERER gemma4 輸出異常 | VPS 用 library 標準 tag（gemma4:e2b），不依賴 Windows 自定義 blob |

### H.3 醒著就頂標（運行指標）

- Ollama `ollama ps` 進程穩定，無頻繁重啟
- HUB `/generate` 回 200 + 非空 response（5T: Tangible 可感知）
- s2s WebSocket `ws://host:8765/v1/realtime` 連通（OpenAI Realtime 兼容）
- 觀眾端 `/stream` SSE 字幕延遲 < 2s（5T: Transferful 可追蹤）
- 所有寫入帶 `source_origin` + hash_lock（5T: Truth + Trust）

### H.4 s2s × HUB 整合架構（5T 對齊）

```
語音 → s2s (VPS :8765, VAD/STT/LLM gemma4:e2b/TTS)
            └→ 文本 → HUB /voice/bridge → /speak → 多語翻譯 SSE /stream
觀眾 → stream.html 字幕 + s2s 音訊
```

- **Traceable**: s2s 轉錄文本經 HUB `/voice/bridge` 帶 `source_origin: s2s:{session}`
- **Transparent**: LLM 推理用本機 Ollama（非付費 API），可稽核
- **Tangible**: 觀眾看到即時雙語字幕 + 聽到語音代理回應
- **Trustworthy**: 每段轉錄 hash_lock 凍結，不可篡改
- **Transferful**: 全生命週期經 OAB/HUB 事件流追蹤

### H.5 VPS 解鎖 SOP（OOM 凍結時）

1. **Oracle Cloud Console → Reboot**（1-2 分鐘，最穩）← 首選
2. 等待 SSH 恢復（`ssh -i key ubuntu@161.118.248.180` 通）
3. 立即 `ollama rm gemma4:e4b` 釋放 9.6GB（避免重啟後自載）
4. `ollama pull gemma4:e2b`（~1.5GB）
5. 改 HUB `.env` `OLLAMA_MODEL=gemma4:e2b` + pm2 restart
6. 活體驗證 `/generate` 回 200 + 非空

> 備案：若 OCI CLI/SDK 簽章 401，放棄 CLI 解鎖，直接用 Console Reboot。

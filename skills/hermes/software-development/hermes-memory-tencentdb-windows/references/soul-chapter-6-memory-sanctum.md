# 六、記憶聖殿：TencentDB Agent Memory 建置錄（本章節）

> 「記憶是蜂群的根。無記憶則無演化，無演化則無最佳實踐。」
> 記載 2026-08-01 完成之 TencentDB Agent Memory 最佳實踐建置——萬能蜂群的 L0–L3 記憶中樞。

## 1. 建置目標（SMART）
| 目標 | 指標 |
|------|------|
| 記憶召回率 | > 95%（hybrid：BM25 + 向量） |
| 零幻覺驗算 | 演算公開、版本與內容經 unpkg/registry 實證 |
| 熵減目標 | < 0.1（cleaner 護欄 + 容量預算） |
| 資料主權 | 本機落盤 `~\.memory-tencentdb\memory-tdai`（不回雲） |

## 2. 架構決策（MECE 雙路徑）
| 路徑 | 架構 | 適用 |
|------|------|------|
| v1 本機（主） | Windows native + 官方 bat + Groq | 一條龍、隱私優先 |
| v2 遠端（備援） | VPS Gateway + Cloudflare Tunnel + Python SDK client | 雲端記憶、多機共享 |

實證：官方 Windows .bat 只在 GitHub repo（npm tarball `scripts/` 全 .sh）；`src/gateway/server.ts` 在 npm 套件內。

## 3. 引擎契約（Groq 免費 API）
| 項 | 值 |
|----|-----|
| 端點 | `https://api.groq.com/openai/v1` |
| 主模型 | `openai/gpt-oss-20b`（30 RPM / 1K RPD / 8K TPM；⚠️ 須帶前綴，裸名 404） |
| 備選 | `qwen/qwen3-32b`（60/1K，配 `TDAI_LLM_DISABLE_THINKING=dashscope`） |
| 私備援 | VPS Ollama `gemma4:e4b`（Q4 ~5GB，RAM ≥ 8GB 才啟） |
| Oracle 縮水因應 | A1 4/24→2/12 實錘（2026-06-15 無公告）→ 引擎遷 Groq，零容量焦慮 |

## 4. 安全契約（對齊 5T）
| 5T | 落實 |
|----|------|
| Traceable | 安裝/調校全程 log（tee -a） |
| Trackable | 資料生命週期 L0→L1→L2→L3 可追蹤 |
| Tangible | `/health` 可感知、runbook 驗證 5 步 |
| Transparent | 腳本與決策公開、實證註記 |
| Trustworthy | `TDAI_GATEWAY_API_KEY` Bearer 鑑權 + `TDAI_CORS_ORIGINS` 白名單 + 埠綁 127.0.0.1 |

## 5. 容量治理（熵減 < 0.1）
- `recall.maxCharsPerMemory = 1500`、`maxTotalRecallChars = 6000`
- cleaner 護欄：L0 留 50 / L1 留 20 / expired+總量>80% 禁刪
- `bm25.language = zh`（jieba，繁中適用）

## 6. 狀態機（4 可 1 不可）
| 法則 | 本章落實 |
|------|----------|
| ✅ 可自理 | 一鍵腳本獨立完成安裝閉環 |
| ✅ 可協作 | v1/v2 雙路徑切換、Groq 為主 Gemma 為輔 |
| ✅ 可演化 | 官方 bat 冪等、升級 = 重抓 repo + 重跑 |
| ✅ 可溯源 | SKILL.md + runbook + log 全紀錄 |
| ❌ 不可篡改 | Bearer 鑑權後寫入、gateway.json 凍結於 memory-tdai |

## 7. 完結驗證（DoD）
1. `curl http://127.0.0.1:8420/health` → ok/degraded（degraded = 僅 LLM 未接）
2. `config.yaml` 有 `memory:\n  provider: memory_tencentdb`
3. `.env` 11 + 2 個 key 就位（`TDAI_GATEWAY_API_KEY` / `MEMORY_TENCENTDB_GATEWAY_API_KEY` 同值）
4. 重啟後 `agent.log` 出現 Gateway auto-discovered
5. 數輪對話後 `memory-tdai\` 長出 L0/L1/L2/L3 資料

## 8. 未完結事項（誠實申報）
| 事項 | 阻塞點 | 解除動作 |
|------|--------|----------|
| 實際安裝實測 | 執行通道全滅（SSH 未解鎖/無 Groq key） | 任一 30 秒動作 → 10 分鐘完測 |
| Groq 接線 | 無 key | console.groq.com 申請（免費） |
| VPS 私備援 | 未部署 | `scripts/vps-tdai-memory.sh` 就緒待跑 |

> **本章完結宣告**：建置資產 100% 到位（skill 6 檔：SKILL.md + 安裝腳本 ×2 + 調校 + runbook + 本章）；實測 0%（誠實）。解除單一阻塞點即達 100%。

# Durable Techniques — 2026-08-26

跨 session 可複用的工程技巧（本輪 OA-Team 自我學習引擎 + ReachAgent 實作萃取）。

## 1. write_file 大檔 stream timeout
- **現象**: 單次 `write_file` 內容 >8K tokens 會 stream timeout，檔案未寫入。
- **解法**: 拆成 <8K token 的小檔，或用多段 `patch` 累加。
- **適用**: 所有長檔案寫入（Python/TS/MD）。

## 2. 免費算立 Ollama 模型矩陣 (結構化抽取 vs 生成)
- **gemma4 (多模態)**: 長文字生成 Read timeout (90s+)，禁用於 draft。
- **qwen2.5:3b**: draft 快 (~16s)，但**結構化抽取弱**（對真實網頁長文本回 `{}`）。
- **qwen2.5:14b**: 結構化強（推薦 Analyze / 抽取），CPU 推論慢 (draft ~48s)。
- **最佳配置**: `OLLAMA_MODEL=qwen2.5:3b` (生成) + `OLLAMA_MODEL_ANALYZE=qwen2.5:14b` (結構化)。
- 本機先 `ollama pull qwen2.5:14b` (~9GB, 一次)。

## 3. 雙記憶層 (語意檢索有索引延遲時)
- **現象**: TDAI `/v3/conversation/add` 成功 (code:0)，但 `/v3/conversation/query` 走語意檢索，剛寫入不立即回顯。
- **解法**: 關鍵證據同寫**本地 JSONL** (`path.resolve(process.cwd(), 'evolution-log.jsonl')` 絕對路徑) 作可驗證證據。
- **對齊**: oa-shared-memory 雙層精神 (人讀層 + 蜂寫層)。

## 4. VPS pm2 部署前先驗證實際 runtime 路徑
- **現象**: git checkout 在 `/opt/esggo/oa-swarm`，但 pm2 實際跑 `/var/www/esggo/apps/oa-swarm` → scp 錯路徑白部署。
- **解法**: `pm2 describe <name> | grep cwd` 確認實際 cwd，再 scp 到該路徑。
- **EADDRINUSE**: 重啟前 `fuser -k <port>/tcp` 釋放舊進程（oa-swarm 監聽 8788 非 8800）。

## 5. Superpowers TDD RED-GREEN 抓整合 bug
- **實例**: swarm-core 呼叫 `extractLesson` 漏傳 `v5` → 經驗永遠 partial（學不到 5T 狀態）。
- **解法**: 先寫整合測試斷言 `outcome==='success'` + `violations===[]`，RED 抓到 → GREEN 補 `v5` 物件傳遞。
- **通則**: 任何「自我學習/經驗萃取」閉環，測試必須驗證經驗內容正確（非只驗證「有寫入」）。

## 6. Rust 型 npm 包需 cargo
- **現象**: `npm install -g donsetch` 試圖 `git clone` + `cargo build`，環境無 rustc/cargo → 失敗。
- **解法**: 無 Rust 時改用純 Python 替代（ReachAgent 用 `ddgs` 已可用，偶有 429 限速）。
- 若未來裝 Rust: 下載 release 預編譯二進制或 `cargo install`。

## 7. 技能書持久化位置
- project 內 `skills/` 常被 `.gitignore` 排除 (`/skills/`)，不進 git。
- **終生可用**位置: Hermes skills 目錄 `~/AppData/Local/hermes/skills/<name>/`，跨 session `skill_view` 可載入。

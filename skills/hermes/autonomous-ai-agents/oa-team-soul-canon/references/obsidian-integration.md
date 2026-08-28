# Obsidian 知識花園整合 — 行動優先 AI 助手 (obsidian-integration)

> 對應靈魂聖典 §4.2（知識花園頻道）與附錄 B。兩套 Obsidian 插件皆為「行動優先、自託、免費算立」取向，作為 OA-Team 蜂群與個人知識庫的雙向介面。

## B.1 UNagent（作者 UNcore）

- **定位**：Obsidian 行動優先 AI 助手插件；手機/平板輕量自足，桌面同樣完整。
- **架構**：純插件內 JS + 遠程 HTTP（原生 `fetch` + 手寫 SSE），無 LLM SDK 依賴；行動端零本地進程，桌面端僅多一條 `run_command`（永遠強制確認）。
- **插件 id**：`unagent`，顯名「UNagent」。
- **能力**：流式對話、16 工具（行動 15／桌面 16：含 `search_notes`/`read_note`/`edit_note`/`create_note`/`generate_image`/`save_memory`/`load_skill` 等）、技能（純提示文本 SKILL.md，絕不執行代碼）、混合檢索（關鍵字+元數據為主，語義可選遠程 embedding）、生圖、記憶進化（`agent.md`/`user.md`/`memory.md`）、文字引用（Alt+Z）、對話分支（`/branch`/`/rewind`/`/compact`）、最小 MCP（僅遠程 streamableHttp + tools 面，工具上限 8）。
- **安全邊界**：API Key 明文存 vault `data.json`（勿公開同步）；技能為提示注入面（只裝可信來源）；`delete_note` 永遠強制確認且可撤銷；MCP 工具同進確認機制。
- **部署**：BYO key，手動放置 `main.js`/`manifest.json`/`styles.css` 至 `.obsidian/plugins/unagent/`。
- **5T 對應**：`save_memory` 實作 Traceable；工具調用日誌實作 Trackable；UI 回饋實作 Tangible；技能文本公開實作 Transparent；`data.json` 與撤銷快照實作 Trustworthy。

## B.2 Hermes Agent Obsidian 插件（作者 jsun2020）

- **定位**：從 Obsidian 內與本機 Hermes Agent 對話，經本地 gateway HTTP API 把回覆流式送入多分頁側欄；可附當前筆記或選取文字為上下文。
- **架構**：連 `http://127.0.0.1:8642`（Hermes Desktop 或 `hermes gateway` 啟動的本地 gateway），支援 Runs 傳輸（`POST /v1/runs` + `GET /v1/runs/{id}/events`）與 Chat Completions 回落；`Authorization: Bearer <API_SERVER_KEY>`。
- **倉庫**：`https://github.com/jsun2020/hermes-agent-obsidian-plugin`（最新發佈 0.10.1；BRAT 貼此 URL）。
- **本機建置**：`cd <vault>/.claude-project/Obsidian/hermes-agent && npm install && npm run build && npm test`（emit `main.js`/`manifest.json`/`styles.css` 三件套；`npm run lint` 等同 Obsidian 社群審查）。
- **安裝**：BRAT（貼上方倉庫 URL）或手動放三件套至新資料夾（勿動現有 `claudian` 資料夾）。
- **檔案存取**：插件把「工作資料夾」寫入 run 的 `instructions`；真正權限在 gateway。
- ⚠️ **供應商相容性關鍵免責**：README 那段「改 `~/.codex/config.toml`」修復「兩個唯讀權限被拒」**只對 gpt-5.5 / OpenAI-Codex 供應商有效**。本機若用 `tencent/hy3:free`（nous）或 Ollama，agent 不跑在 Codex 沙箱內，改該檔是 NO-OP；應改用無設定替代：開啟「當前筆記 / 選取」上下文開關或貼入筆記。套用前先確認 `~/.hermes/config.yaml` 的 `model.default`。詳見專屬技能 `obsidian:hermes-agent-obsidian-plugin` 與其 `references/provider-compatibility.md`。
- **特色**：多分頁對話、上下文開關、智慧圖譜（Smart graph，請 Hermes 推論語意關聯）、歷史快取 `history.json` 與 `graph-cache.json`（不與 `data.json` 混用）。
- **5T 對應**：Hermes 本體即 5T 守門；筆記為可溯源資產（Traceable），run 事件流可追蹤（Trackable），側欄即時回饋（Tangible），gateway 協定公開（Transparent），`history.json` 落盤不可竄改（Trustworthy）。

## B.3 蜂群 × Obsidian 接線建議

- 萬能知識分身（OA-Twins）可經 UNagent 技能或 Hermes Agent 插件把「知識花園」筆記同步進 30 矩陣學習小組（§5.5）。
- 30 矩陣「同體一心」儀式（週會/蜂王盃）產出週報，經 §10.9 電子報模板推送至 Obsidian vault 或 Telegram/Slack。
- 禁忌：勿把含密鑰的 `data.json` 提交公開倉；技能只裝可信來源。

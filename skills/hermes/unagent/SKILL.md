---
name: unagent
category: obsidian
version: "1.1.0"
author: UNcore
license: "Source Available License (商用需授權)"
description: UNagent Obsidian 行動優先 AI 助手 BYO key 純 JS 遠程 HTTP 16 工具 5T 對應 最佳實踐版
tags: [obsidian, unagent, mobile-first, ai-assistant, knowledge-garden, byo-key]
metadata:
  hermes:
    tags: [obsidian, unagent, mobile-first, ai-assistant, knowledge-garden]
    related_skills: [oa-team-soul-canon, obsidian:hermes-agent-obsidian-plugin, skills-sync]
---

# UNagent — Obsidian 行動優先 AI 助手

## When to use
- 用戶要在 Obsidian 用手機/平板輕量自託 AI 助手，或提及 UNagent 插件、BYO key 模型檔案。
- 用戶要把 UNagent 納入 OA-Team 知識花園（見 `oa-team-soul-canon` 附錄 B.1）。
- 用戶問 UNagent 的工具、技能、記憶、MCP 邊界或安全設定。
- 用戶貼 UNagent 文檔、要求對齊最佳實踐或固化經驗。

## 核心定位（如實版）
- **插件 id**：`unagent`，顯名「UNagent」，作者 UNcore。
- **架構**：純插件內 JS + 遠程 HTTP（原生 `fetch` + 手寫 SSE），無 LLM SDK 依賴；行動端零本地進程，桌面端僅多一條 `run_command`（永遠強制確認）。
- **價值主張**：手機/平板輕量自足，桌面同樣完整可用；不配 MCP 功能一樣不缺。

## 5 分鐘上手（BYO key：自帶你自己的模型 Key）
1. **安裝**：手動放置三件套至 `<vault>/.obsidian/plugins/unagent/`：`main.js` / `manifest.json` / `styles.css`，settings → 啟用「UNagent」。左側欄圖標或命令面板「Open UNagent chat」開對話框。
2. **添加模型檔案**：Settings → UNagent → 模型標籤頁 → 點「模型廠商」標題行右側「＋ 添加廠商」，填：
   - API 協議（下拉，選完自動回填預設地址）
   - API 地址（Base URL，不含 `/chat/completions` 等路徑後綴）
   - API 密鑰（右側眼睛按鈕可顯示/隱藏）
   再於模型列表輸入模型名回車添加（自動從 API 拉取聯想），保存即生效。多廠商多協議可並存，`/model` 隨時切換本會話模型。
3. **開聊**：直接說需求，例如「搜尋關於讀書的筆記並總結一下」。AI 流式回答、按需調用工具讀寫筆記；破壞性操作彈窗確認，改錯點頂部「撤銷」。

## 能力清單（移動 + 桌面一致）
| 能力 | 說明 |
|---|---|
| 流式對話 | 逐字輸出、可隨時停止、錯誤友好提示可重試；多廠商多協議並存，`/model` 切換會話模型，`/think` 系列控制思考強度 |
| 15 個工具（桌面 16） | AI 可讀/搜/寫筆記；破壞性操作彈窗確認，刪除與編輯可撤銷；桌面端另有 `run_command`（移動端不可見） |
| 技能 (Skills) | 純提示文本 SKILL.md 指南，`//技能名` 調用或 AI 按需 `load_skill` 載入；**絕不執行代碼** |
| 混合檢索 | 關鍵字 + 元數據為主通道；語義檢索可選（遠程 embedding + 本地向量快取） |
| 生圖 | `generate_image` 文生圖存入 vault，可插入筆記/設為封面 |
| 記憶與進化 | `agent.md` / `user.md` / `memory.md` 三可見檔；顯式記憶 + 反思建議 |
| 文字引用 | 編輯器/畫布/表格/內建瀏覽器選字按 Alt+Z（Option+Z）跳 AI 輸入框並自帶「來源 + 選中文字」引用；網頁選區帶頁址；無選字時按下直接聚焦輸入框 |
| 對話管理 | 自動存 vault、重啟恢復、多層分支（`/branch`）、任意輪回溯（`/rewind`）、`/compact` 壓縮 |
| MCP（最小形態） | 僅遠程 streamableHttp + tools 面 |

## 工具清單（16 個，含破壞性標記）
| 工具 | 作用 | 破壞性 |
|---|---|---|
| `search_notes` | 關鍵字 + 元數據（標籤/文件夾）檢索；只帶文件夾過濾時即文件夾瀏覽 | 否 |
| `semantic_search` | 語義檢索（遠程 embedding，本地只存向量快取） | 否 |
| `library_index` | 庫目錄（啟發式摘要快取） | 否 |
| `read_note` | 讀取筆記內容（含元數據，超長分段續讀） | 否 |
| `create_note` | 新建筆記（支援 frontmatter；也可建 .canvas/.excalidraw/.base） | 否 |
| `edit_note` | 追加 / 替換章節 / 全文替換（匹配失敗報最相似片段） | 是（可確認） |
| `update_frontmatter` | 增刪改 frontmatter 字段；陣列字段可合併去重（加標籤用它） | 是（可確認） |
| `rename_or_move` | 改名/移動（自動更新引用） | 是（可確認） |
| `delete_note` | 移入回收站**永遠強制確認**，可撤銷 | 是（強制） |
| `run_command` | 本地命令/腳本執行（**僅桌面**；庫外計算專用，不碰庫內檔案）**永遠強制確認** | 是（強制） |
| `generate_image` | 文生圖並存入 vault | 否 |
| `mcp_admin` | 遠程 MCP 服務增/改/刪（action=add/update/remove）；刪除強制確認，官方服務不可刪 | 刪除強制 |
| `load_skill` | 按名載入某技能完整指南 | 否 |
| `save_memory` | 寫入 memory.md（長期記憶）/ user.md（用戶畫像） | 否 |
| `todo_write` | 任務清單（長任務進度可視化） | 否 |
| `ask_user` | AI 主動向你提問 | 否 |

## 檢索怎麼工作（如實版）
- 主通道：關鍵字 + 元數據（`metadataCache`），CJK 友好。
- 語義可選：筆記按標題切塊 → **遠程** embedding API 算向量 → 向量只是遠程結果的本地快取（存資料文件夾 `.retrieval/`）→ 暴力餘弦 top-k。
- embedding 計算不在本地發生，不引入 ANN 索引與重排模型。
- embedding 模型複用統一廠商體系（模型能力勾「向量化（檢索）」），未配置時零啟動成本。

## 記憶與進化
資料文件夾（預設 `AI 助手/`，可見可編輯）三檔：
| 檔 | 職責 | 注入方式 |
|---|---|---|
| `agent.md` | 助手人設與工作守則 | 整篇注入系統提示 |
| `user.md` | 用戶畫像 | `-` 開頭條目注入 |
| `memory.md` | 長期記憶 | `-` 開頭條目注入 |

兩條進化路徑：
- **A 案顯式**：你說「記住 xxx」→ AI 用 `save_memory` 寫入（含提示注入防護與額度）。
- **B 案反思建議**：每若干輪靜默複盤，產出建議逐條擺面板，**你逐條確認才落盤，絕不自動寫**，切對話即廢。`/learn` 可把一次對話結晶成可複用技能。

## MCP 邊界（如實描述，不誇大）
- 只做**遠程 streamableHttp 傳輸 + tools 面**：`initialize` / `tools/list` / `tools/call` 三方法，純 fetch 手寫 JSON-RPC、零 SDK。
- 不做 stdio / WebSocket / OAuth / resources / prompts / sampling / 會話恢復。
- 工具總數上限 8 個，單條結果 2 萬字元截斷。
- 設定「MCP」標籤頁添加服務，Agent 級可再按代理開關。

## 完全配置版（規劃中）
- 現為 BYO key：你自己去各家申請 Key、自己填。
- 規劃中提供零配置託管版統一 API、開箱即用，任何設備不必折騰密鑰；具體形態與時間待定，本文檔不承諾日期。當前版本的一切能力即它的全部。

## 邊界與安全（先看這段再用）
- **API Key 明文存儲**：所有 Key 以明文存在 vault 的 `data.json` 裡（v1 從眾做法）。不要把 `data.json` 提交公開倉、不要放進會公開同步的目錄。
- **技能是提示注入面**：技能正文原樣注入 AI 上下文，等同提示詞——**只安裝你信任來源的技能**。技能永遠純提示文本、絕不執行代碼，破壞性操作確認彈窗不受技能影響照常兜底。
- **刪除雙保險**：`delete_note` 永遠強制彈窗確認（不受任何「跳過確認」設置影響）；刪除與編輯前都留全文快照，對話框頂部「撤銷」可還原（撤銷棧落盤，重啟不丟）。
- **MCP 工具也是工具**：遠程 MCP 工具調用同進工具鏈與確認機制，別接入不受信服務。

## 平台差異聲明
- **移動端（手機/平板）= 純插件內 JS + 遠程 HTTP**：零本地進程、零本地算力（embedding 也走遠程），所有核心功能三端一致。
- **桌面專屬能力只有一條**：`run_command` 本地命令/腳本執行（庫外計算，永遠強制確認，絕不用於庫內檔案）。移動端該入口缺席而非報錯；除此之外桌面與移動無任何功能差異。

## 5T 對應（接入 OA-Team 知識花園）
- **Traceable**：`save_memory` 寫入來源可溯；工具調用紀錄落盤。
- **Trackable**：工具調用日誌、對話落盤 `history`（vault 內）。
- **Tangible**：UI 回饋、引用跳框、撤銷快照。
- **Transparent**：技能為純提示文本公開可查；檢索以關鍵字+元數據主通道如實描述。
- **Trustworthy**：`data.json` 密鑰隔離、刪除強制確認+撤銷棧落盤不可竄改。

## 最佳實踐守則（OA-Team 5T 優先）
1. **紅線不越界**：無論技能或 AI 建議，`delete_note` / `run_command` 的強制確認不可被繞過；撤銷棧是 last resort，不是常規流程。
2. **密鑰隔離**：`data.json` 視同憑證，永不進 git / 公開同步；若 vault 在 iCloud/OneDrive 公開分享目錄，先移出再裝 UNagent。
3. **技能來源可信**：安裝技能前確認來源（OA-Team 技能書 / 用戶自寫）；來路不明 SKILL.md 視為提示注入風險。
4. **語義檢索按需開**：未配 embedding 模型時零成本，別為「看起來高級」強開；CJK 關鍵字+元數據主通道已夠用。
5. **MCP 最小信任**：只接受你控制的 streamableHttp 服務；工具上限 8、結果 2 萬字截斷是設計邊界，勿試圖繞過。
6. **移動端零進程**：手機/平板不跑任何本地 LLM 或 embedding；若發現插件嘗試本地進程，立即回報（偏離設計）。
7. **雙向同步**：本技能書 Hermes 原生 `SKILL.md` 格式；同步至 `esggo` 倉 `OmniTag` 分支時轉 OpenCode 格式（見 `skills-sync`），CJK 保留 UTF-8 勿掉字。

## 開發（給改代碼的人）
```bash
cd unagent
npm install
npm run dev      # esbuild watch，自動同步產物到測試 vault
npm run build    # tsc strict 類型檢查 + esbuild 生產構建 → main.js / manifest.json / styles.css
npm test         # jest 全量
```
- 產物體積受關注（main.js ≈ 600–700K 量級）；每次構建後 grep 產物確認無隱藏依賴洩漏（pglite / lexical / framer-motion / langchain 須全 0）。
- 禁止引入 LLM SDK、本地向量庫（pglite）、重型編輯器（lexical）、動畫庫（framer-motion）——這些違背「純插件內 JS + 遠程 HTTP」核心契約。

## License
Source Available License（商用需授權）。

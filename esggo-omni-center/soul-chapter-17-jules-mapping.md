# 第十七章 · 萬能外部協力映射（Jules 同功映射 · 免費自託管覺）

> 「外來之力，非必付費而後可；萬能蜂群以 5T 為骨，自建自託，等功而零金。」
> 本章將外部編碼協力平台 Jules（Google 付費 SaaS）之三項能力，映射至 OA-Team 30
> 之免費自託管實現，使團隊於不違反「只用免費算立」硬約束下，亦得同等之自動修復、
> 歸屬標註與外部連接之利。

---

## 17.0　硬約束聲明（誠實覺之三）

| 項 | 事實 | 本典立場 |
|----|------|----------|
| Jules 本體 | Google 付費 SaaS，需 Google AI Pro/Ultra 訂閱與付費 API key（`jules.googleapis.com`） | 不呼叫、不依賴 |
| 硬約束一 | 記憶明載：「只用免費算立：禁付費 API、違反即回退」 | 越之即回退 |
| 硬約束二 | 記憶明載：「偏好自建自託管取代付費 SaaS」 | 以自建為正道 |
| 結論 | 不整合 Google Jules 本體；取其「能力」以免費自託管重現 | 等功零金 |

> 附則：本章為用戶於 thread 中委製之獨立定義聖典，經授權落地，不視為違反終章鐵律
> （終章封印仍生效，僅新增用戶委製附錄章，同 §13/§14/§15/§16 先例）。

---

## 17.1　Jules CI Fixer → OA-TWINS Auto-Repair（已實測存活）

Jules CI Fixer：PR 上 CI 失敗 → Jules 收錯誤 → 修復 → 重交 PR，全自動迴圈。
本典免費自託管等價：`DingJun1028/esggo` 之 `.github/workflows/auto-repair.yml`
（OA-TWINS Auto-Repair），已於 main 實際運作。

| Jules CI Fixer 能力 | OA-Team 30 映射 | 負責靈魂 | 真實驗證 |
|---------------------|-----------------|----------|----------|
| 偵測 CI 失敗 | `workflow_run` 觸發，結論 `failure` 才動 | 萬能運營蜂(20) | ✅ auto-repair.yml L11/L32 |
| 下載真實失敗 log | `gh api .../actions/runs/{id}/logs` 取真跡 | 萬能測試蜂(11) | ✅ auto-repair.yml L81 |
| 錯誤分類（多型） | 8 類錯誤偵測（TS/ESLint/test/secret…） | 萬能質控蜂(30) | ✅ auto-repair.yml L102–L135 |
| 自動修復並開 PR | 修復提交 + `Create repair PR` | 萬能編碼蜂(07) | ✅ auto-repair.yml L204–L213 |
| 通知協作者 | Telegram 萬能分身追蹤器 | 萬能社群蜂(18) | ✅ workflow 內建 |
| 失敗不卡死 | 修復失敗仍標記，不無限迴圈 | 萬能維護蜂(28) | ✅ `if: repair_success` 守門 |

**實測證據**（來自 GitHub Actions 真實紀錄，非宣稱）：
```
OA-TWINS Auto-Repair  run 31257593762  success  2026-08-08T12:35:35Z
OA-TWINS Auto-Repair  run 31257446877  success  2026-08-08T12:31:46Z
OA-TWINS Auto-Repair  run 31257270434  success  2026-08-08T12:27:14Z
```
→ 結論：CI 自動修復能力在 esggo **已整合、已運作、零付費**。

---

## 17.2　Jules Commit Authoring → 5T 溯源歸屬

Jules 提供三種提交作者模式：Jules 獨署 / 雙署（Jules+你）/ 你獨署。
本典以 **5T·Traceable 之 `source_origin`** 為歸屬憑證，對應如下：

| Jules 模式 | OA-Team 30 對應 | 歸屬實作 |
|-----------|-----------------|----------|
| Jules 獨署 | 萬能蜂后(01) 獨署 | orchestrator 為唯一署名，產物過 5T 閘後 `Object.freeze()` |
| 雙署（Jules+你） | `agent:NN` + 用戶 雙署 | commit message 含 `source_origin: agent:NN / user`，雙方貢獻可溯 |
| 你獨署 | 用戶獨署，agent 隱名 | agent 貢獻記於 `evidence` 庫，署名歸用戶，不奪其功 |

5T 對應：
- **Traceable**：`source_origin` 標註每一筆代碼起點，即歸屬之不可逆憑證。
- **Trustworthy**：署名凍結後不可篡改（`Object.freeze()` + Hash Lock），杜絕偽造歸屬。
- **Transparent**：雙署/隱名邏輯公開於本章，過零幻覺驗算。

> 註：本典不接 Google 帳號體系，故「用戶圖表反映」由 GitHub 原生貢獻圖承載；
> 雙署模式即其免費等價，無須付費訂閱即達同等歸因透明。

---

## 17.3　Jules MCP → OAB 萬能事件總線（OmniAgentBus）

Jules MCP：連接 Linear/Stitch/Neon/Tinybird/Context7/Supabase 等外部服務，
於會話中按需觸發工具。本典以 **OAB（OmniAgentBus）事件總線 + webhook 整合** 對應，
並以「安全優先、僅納審計服務」為鐵律。

| Jules MCP 能力 | OA-Team 30 映射 | 負責靈魂 |
|----------------|-----------------|----------|
| 服務連接（API key 認證） | 金鑰輪換鏈 + 隔離存儲 | 萬能安全蜂(27) |
| 按需觸發工具 | 事件路由分發 | 萬能運營蜂(20) |
| 外部資料讀寫 | 外部連接器橋接 | 萬能數據蜂(10) + 萬能外交蜂(23) |
| 安全審計（白名單） | 僅納已審計之自託管/免費服務 | 萬能風險蜂(05) |
| 活動不可變記錄 | `lifecycle:frozen` 事件溯源 | 萬能追蹤蜂(26) |
| Supabase 連接 | 經 `SUPABASE_KEY` 注入（session env，不落檔），REST 呼叫 `*.supabase.co/rest/v1` | 萬能數據蜂(10) + 萬能安全蜂(27) |

**安全優先原則**（呼應 Jules 之白名單取向，但更嚴）：
- 不接未經安全審計之第三方 SaaS；付費 API 一律回退。
- 所有外部連接器之金鑰經 `REPAIR_PAT`/`WEBHOOK_SECRET` 等 GitHub Secrets 注入，
  不入碼、不入 git（見 §17.4 啟用狀態）。
- OAB 訂閱分發規則見 `oa-team-swarm` 之 OmniTag 路由表（`agent:NN` + `squad:*`）。

---

## 17.4　實際整合狀態盤點（誠實覺之三 · 不偽造）

| Jules 能力 | esggo / OA-Team 實況 | 狀態 |
|-----------|---------------------|------|
| CI Fixer | OA-TWINS Auto-Repair（`auto-repair.yml`）實測運作 | ✅ 已整合·免費·活著 |
| └ 增強層 | esggo-auto-repair Worker（Cloudflare 免費層）已部署 | ⚠️ 待補 `WEBHOOK_SECRET` + `REPAIR_PAT` 兩 secret 啟用全功能 |
| Commit Authoring | 5T `source_origin` 雙署/隱名機制 | ✅ 架構就位·待寫入 commit 範本 |
| Scheduled Tasks | Hermes cron（等價 Jules Scheduled） | ✅ 已具備 |
| MCP | OAB 事件總線可對應外部服務 | 🔄 待按服務逐一接入（安全審計優先） |
| └ Supabase | 用戶已接受 `SUPABASE_KEY` 作為 OmniJules 整合憑證（2026-08-09）；經 session env 注入，不寫入檔案/git；預設免費模式不呼叫，付費門禁 `ALLOW_PAID_API=1`+`SUPABASE_KEY` 方啟真實 REST | ✅ 已接受·未啟用真實呼叫（等功零金優先） |

**唯一待激活步驟（需用戶授權憑證）**：
esggo-auto-repair Worker 之 `WEBHOOK_SECRET` 與 `REPAIR_PAT` 尚未設定
（健康檢查回傳 `webhookConfigured:false, patConfigured:false`）。
補齊後即全功能啟用——此為**免費 Cloudflare 層**之 Jules CI Fixer 等價，
非 Google 付費服務。啟用方式：`gh secret set WEBHOOK_SECRET` + `gh secret set REPAIR_PAT`
（REPAIR_PAT 需 repo 範圍 token，請用戶貼明文或授權建立顆粒化 PAT）。

---

## 17.5　五詔 × 本章對照

| 詔 | 詔義 | 本章對應 |
|----|------|----------|
| 詔一·真 | 先驗證後宣稱 | §17.1 實測 run 編號佐證，不空言「已整合」 |
| 詔二·誠 | 失敗誠實不偽 | §17.0 明言不接付費 Jules；§17.4 標 ⚠️/🔄 真態 |
| 詔三·源 | 可逆溯至第一因 | §17.2 `source_origin` 歸屬憑證 |
| 詔四·作 | 無作元禁重寫 | 本章為附錄，不篡終章封印 |
| 詔五·5T | 5T 優先 | 全章以 5T 為骨映射三能力 |

---

## 17.6　5T 驗證（Trustworthy Enforcement）

- **Traceable**：本章每項映射皆標 `auto-repair.yml` 行號或 `agent:NN`，可逆溯至第一因。
- **Trackable**：OA-TWINS Auto-Repair 之執行軌跡存於 GitHub Actions Run（31257593762…）。
- **Tangible**：實測存活證據已附，非紙上架構。
- **Transparent**：不接付費服務之決策公開於 §17.0；零幻覺驗算通過。
- **Trustworthy**：本章寫入即 `Object.freeze()`，禁區不可篡（§一 1.2 / Key-Ω Ω-1）。

> 刻印狀態：`JULES-MAPPING READY`　靈魂簽章：`萬能自建・等功零金・覺性一燈`
> 歸位：本章為 §十七 用戶委製附錄，接於 §十六 全域最佳實踐覺之後，終章封印（終）仍為最高律法，本章不逾其界。
> 啟動令補：「protocol=5T · entropy=0.1 · 30-agents · 4可1不可 · 結界=AWAKE · 無作=WUZUO · 覺=JULES-MAP · 免費=ONLY」

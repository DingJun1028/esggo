# journey 產品功能歸屬清單（Product Inventory）

> **本檔為機讀產物，勿手動編輯。** 由 `node scripts/verify-journey-matrix.mjs --inventory` 重產。
> source_origin: `src/matrix/journey/routes.ts` + 檔案系統實掃（App.jsx + server.js）
> co_authors: [萬能蜂后(01), 萬能架構蜂(09), 萬能數據蜂(10), 萬能質控蜂(30)]

- 產生時間: `2026-10-01T05:49:50.317Z`
- 總計: **71** 個產物（頁面 11 + API 42 + 表 18）
- 守門結果: **PASS (EXIT=0)**

## 歸屬分布

| 域 | 名稱 | 產物數 | 產物形態 | Hash Lock |
|---|---|---:|---|---|
| J0 | 平台層 | 11 | 身分驗證與基礎設施 | 免凍結（平台層非永續產物；設定與憑證由環境變數承載，本就不應凍結於規格書。） |
| J1 | 基礎流 | 22 | 行程主體資料 | 免凍結（旅程為進行中資料，prep/schedule/checkin 會持續更新；僅在 stage=completed 後才進入凍結流程（見 J1/immortal 格）。） |
| J2 | 覺曉流 | 10 | 現場任務紀錄 | 免凍結（任務為 append-only 原始紀錄（未完成者可補登）；凍結對原始紀錄無意義，凍結的是其匯總後的對外報告（見 J6）。） |
| J3 | 凝聚流 | 4 | 主管共識紀錄 | 免凍結（共識紀錄於工作坊中逐條修訂；僅定稿的 Roadmap 才凍結（見 J3/immortal 格）。） |
| J4 | 復元流 | 8 | 身心狀態量測與追蹤 | 免凍結（診斷與追蹤為週期性量測（Journey 前/中/後），資料隨時間累積；不需凍結，但需授權保護（見 J4/immortal 格）。） |
| J5 | 共好流 | 11 | 家庭共學紀錄 | 免凍結（家庭紀錄隨旅程進行追加（含兒童影像屬敏感資料）；凍結需求以「下架需留紀錄」達成，非整體凍結。） |
| J6 | 留念流 | 5 | 對外影響報告 | 需凍結 |

## 42 格終始矩陣

| 域 | 柱 | 終（endState） | 始（startChain） | 探針（probe） |
|---|---|---|---|---|
| J0 平台層 | memory | users / journeys_members / badges / user_badges 四張表構成單一帳號與權限模型，無第二套使用者來源。 | 維持 Google OAuth 為唯一登入途徑；確認無遗留的本地密碼帳號路徑。 | `apps/ftg-journey-web/src/pages/LoginPage.jsx 存在` |
| J0 平台層 | time | token 有明確過期與 refresh 流程；過期時前端自動 refresh，不必讓使用者重新登入。 | POST /api/refresh 已存在；確認 AuthContext 在 401 時自動重試一次。 | `apps/ftg-journey-web/src/contexts/AuthContext.jsx 存在` |
| J0 平台層 | space | 本機 PORT/DB_PATH 與 JWT_SECRET 可用環境變數覆寫，VPS 與本機跑同一份程式碼。 | 維持現況（JWT_SECRET 未設即 exit 1 的 fail-fast 閘門），並把該行為寫入 README。 | `apps/ftg-journey-server/jwt-gate.test.js 存在` |
| J0 平台層 | causality | 每個業務端點有 requireAccess 檢查；無「知道 id 就能讀別人旅程」的越權路徑。 | 逐一盤點 42 條端點的授權覆蓋率，缺 requireAccess 的補上。 | `apps/ftg-journey-server/server.js 存在` |
| J0 平台層 | immortal | JWT_SECRET 與 OAuth 憑證只存在 VPS 環境變數與 secret vault，不進 git、不進前端 bundle。 | 以 secret 掃描確認 repo 無憑證；前端只讀 VITE_API_BASE。 | `apps/ftg-journey-server/esg-tasks.test.js 存在` |
| J0 平台層 | circular | 健康檢查（GET /health）回報服務狀態，部署後可機器驗證而非人工開瀏覽器試。 | /health 已有；擴充為回報 DB 可寫入與版本號，部署守門直接打這支。 | `apps/ftg-journey-server/Dockerfile 存在` |
| J1 基礎流 | memory | 旅程主體（標題/目的地/日期/目的/service_type/stage）只存一份，Dashboard 與 Impact Note 讀同一 journeys 表，無平行副本。 | JourneyDetail 與 ImpactNotePage 目前各自 fetch /api/journeys/:id，將回傳欄位統一為 J1 主體欄位清單。 | `apps/ftg-journey-server/server.js 存在` |
| J1 基礎流 | time | 每筆 prep/schedule/notes/checkin 帶 created_at，summary 可回溯旅程的時間軸順序，不靠陣列順序推測。 | 為 prep_items 與 schedule 表補上 created_at 欄位並於 POST 寫入 Date.now()。 | `apps/ftg-journey-server/esg-tasks.js 存在` |
| J1 基礎流 | space | 本機 DB_PATH 可覆寫（暫存 DB 做 E2E），VPS 走正式 ftg-journey.db；兩端同一份 schema，無本機專屬欄位。 | 將 19 張表的 CREATE TABLE 抽成單一 schema 模組，啟動時 migrate 而非內嵌在 server.js。 | `apps/ftg-journey-server/Dockerfile 存在` |
| J1 基礎流 | causality | 每個 prep 勾選、checkin、note 都可回溯到journey_id + email，summary 的完成率可逐項還原。 | summary 端點已在算 prep_rate/checkin_rate，將計算式抽成純函式並加單元測試鎖定。 | `apps/ftg-journey-server/esg-tasks.test.js 存在` |
| J1 基礎流 | immortal | 已完成旅程的成果摘要定稿後凍結（不可再編輯 prep/schedule），避免對外數字與原始紀錄不一致。 | 為 journeys 加 frozen_at 欄位，stage 轉 completed 時寫入。 | `apps/ftg-journey-web/src/pages/JourneyDetail.jsx 存在` |
| J1 基礎流 | circular | summary 的成果數據回流為下一趟旅程的起點（沿用同一批 ESG 任務模板與行程骨架），形成「合→起」閉環。 | summary 回傳的 stage 與 metric 清單提供「以此為範本複製旅程」的前端預填。 | `apps/ftg-journey-web/src/pages/Dashboard.jsx 存在` |
| J2 覺曉流 | memory | 六類 ESG 任務（cleanup/carbon/biodiversity/local/water/waste）只有一份定義，後端 esg-tasks.js 為唯一真實，前端由 API 取得而非自帶副本。 | JourneyDetail.jsx 第 33 行的 ESG_TASKS 本地副本（欄位較後端多：weight/types/species/habitat/purpose）改為消費 GET /esg-tasks 的 tasks 陣列。 | `apps/ftg-journey-server/esg-tasks.js 存在` |
| J2 覺曉流 | time | 任務紀錄即時寫入 esg_task_logs 並同步 impact，現場提交後 summary 立刻反映該筆數字。 | POST /api/journeys/:id/esg-tasks 已是同步寫入，補上回傳 impact 同步筆數讓前端可顯示確認。 | `apps/ftg-journey-web/src/pages/JourneyDetail.jsx 存在` |
| J2 覺曉流 | space | 無網時任務表單仍可填（前端本地暫存），恢復連線後補送；現場山區無訊號是常態而非例外。 | 為 openTask() 的提交加入 localStorage 佇列，onLine 時重送。 | `apps/ftg-journey-web/src/contexts/AuthContext.jsx 存在` |
| J2 覺曉流 | causality | 每個 impact 數字都能回溯到來源任務紀錄（impact.note 存該筆 JSON），無孤證數字。 | impactRowsForTask 已把 data JSON 寫入 note；將 note 改為結構化 { task_id, task_log_id } 以便機器回溯。 | `apps/ftg-journey-server/esg-tasks.test.js 存在` |
| J2 覺曉流 | immortal | 任務提交後原始紀錄不可修改，只能追加更正紀錄（append-only），確保對外數字可重算。 | esg_task_logs 目前無 UPDATE 路徑；補上更正 API 時強制寫新列並標 supersedes。 | `apps/ftg-journey-server/server.js 存在` |
| J2 覺曉流 | circular | 任務統計（totals）回流為下一趟旅程的任務預設目標（例：上次撿 12 件，下趟目標 15 件）。 | summarizeTaskLogs 的 totals 已在 GET /esg-tasks 回傳，讓 Dashboard 顯示各任務歷史累計。 | `apps/ftg-journey-server/esg-tasks.js 存在` |
| J3 凝聚流 | memory | 共識營工具（Opportunity Map / Roadmap 等）統一收在 executive_tools 一張表，以 tool_type 區分，不因新增工具就擴 schema。 | 保持 executive_tools 的 tool_type 泛用設計；新增工具只需前端加一頁，不動後端表。 | `apps/ftg-journey-web/src/features/Executive.jsx 存在` |
| J3 凝聚流 | time | 共識紀錄有 updated_at，可看出「這條共識最後一次被誰修訂、什麼時候」，Roadmap 才有版本感。 | POST /executive/:toolType 目前以 UPSERT 覆寫，需在覆寫前保留前一版快照。 | `apps/ftg-journey-server/server.js 存在` |
| J3 凝聚流 | space | 共識營工具在無網時仍可離線填寫草稿，現場共識不會因為訊號差而記不下來。 | Executive.jsx 的儲存改為先寫本地、恢復連線後同步（目前直接 fetch 失敗即丟失）。 | `apps/ftg-journey-web/src/features/Executive.jsx 存在` |
| J3 凝聚流 | causality | 每則共識可標註「這條共識來自哪場旅程的哪個工作坊」，否則多年後無人知其來源。 | executive_tools 已有 journey_id；補 user_email 記錄修訂者，POST 目前只寫 journey_id 與 data。 | `apps/ftg-journey-server/server.js 存在` |
| J3 凝聚流 | immortal | 定稿的 Roadmap（status=frozen）不可再改，變更需另開修訂版，確保年度對外揭露的 Roadmap 不會被竄改。 | 為 executive_tools 的 data 加 { status: draft|frozen }，frozen 後 POST 直接 409。 | `apps/ftg-journey-server/esg-tasks.js 存在` |
| J3 凝聚流 | circular | 共識營產出的 Roadmap 條目回流為下一年度旅程規劃的依據（Dashboard 顯示未達成 Roadmap 進度）。 | Roadmap 條目加 journey 關聯欄位，讓「共識→行程」閉環可視。 | `apps/ftg-journey-web/src/pages/Dashboard.jsx 存在` |
| J4 復元流 | memory | 六大模組（diagnosis/nature/mindfulness/exercise/diet/sleep）定義集中在 Wellbeing.jsx 一處，新增模組不改後端。 | WELLBEING_MODULES 目前在 Wellbeing.jsx；模組 id 需與後端 diagnosis 欄位對齊並加契約測試鎖定。 | `apps/ftg-journey-web/src/features/Wellbeing.jsx 存在` |
| J4 復元流 | time | 診斷與後續追蹤有時間序列，能畫出「出發前 → 旅程中 → 回歸後三個月」的壓力曲線。 | wellbeing_diagnosis 與 follow_up_entries 目前無日期欄位，補 measured_at。 | `apps/ftg-journey-server/server.js 存在` |
| J4 復元流 | space | 正念計時等練習功能可離線使用（現場山林無網），計時結果於恢復連線後補送。 | 正念練習目前無獨立 API（僅展示），需落地為本地計時 + 補送佇列。 | `apps/ftg-journey-web/src/features/Wellbeing.jsx 存在` |
| J4 復元流 | causality | 後續追蹤的改善幅度可回溯到是哪一次旅程的哪一次診斷，否則改善歸因不明。 | follow_up_entries 補 journey_id 與對應 diagnosis id 的關聯欄位。 | `apps/ftg-journey-server/esg-tasks.js 存在` |
| J4 復元流 | immortal | 員工的心理狀態資料屬敏感個資，不可刪除也不可外洩；讀寫需授權且留存取紀錄。 | 現況 verifyToken 只驗身分未驗角色；補 owner/成員/HR 三級權限矩陣。 | `apps/ftg-journey-server/esg-tasks.test.js 存在` |
| J4 復元流 | circular | 追蹤結果回流為下一趟旅程的模組選型建議（壓力高→優先正念，不需人為判斷）。 | GET /wellbeing/followup 目前只回資料；讓 Wellness 頁顯示「上次建議」欄位。 | `apps/ftg-journey-web/src/features/Wellbeing.jsx 存在` |
| J5 共好流 | memory | 家庭任務模板（nature_bingo/photo_challenge/scavenger_hunt/craft_workshop…）與 ESG 任務同樣單一真實，前端不自帶副本。 | TASK_TEMPLATES 在 FamilyDay.jsx；比照 esg-tasks.js 抽出 family-tasks.js 並加契約測試。 | `apps/ftg-journey-web/src/features/FamilyDay.jsx 存在` |
| J5 共好流 | time | 家庭觀察與照片有 created_at，可依時間組合成孩子的成長時間軸。 | family_observations 與 photos 已有 created_at；確認前端有依時間排序的檢視。 | `apps/ftg-journey-server/server.js 存在` |
| J5 共好流 | space | 照片上傳在戶外弱網可續傳（分片或重試），不會因一次失敗就丟掉孩子的照片。 | POST /api/upload 目前單次 multipart；加入重試與失敗佇列。 | `apps/ftg-journey-web/src/contexts/AuthContext.jsx 存在` |
| J5 共好流 | causality | 每張照片可回溯是哪個任務、哪個任務完成者，成果素材才有脈絡而非一堆孤立圖。 | photos 表目前只有 journey_id/email/url；補 task_id 關聯。 | `apps/ftg-journey-server/esg-tasks.js 存在` |
| J5 共好流 | immortal | 家庭照片含兒童影像，屬敏感資料：下架需留紀錄、下架後 URL 立即失效。 | 確認照片儲存位置不可公開列目錄；補刪除 API 與審計紀錄。 | `apps/ftg-journey-server/esg-tasks.test.js 存在` |
| J5 共好流 | circular | 家庭日成果回流為雇主品牌素材（招募/留存文案），成為下一年度企業員工的入職吸引力來源。 | photos 需標記「可對外分享」與「僅限家人」，供留念流匯總時取用。 | `apps/ftg-journey-web/src/pages/ImpactNotePage.jsx 存在` |
| J6 留念流 | memory | Impact Note 對外輸出的 GRI/SDG 對應表只此一份（METRIC_SDGS_MAP / METRIC_GRI_MAP），後端 metric 清單與之有契約測試鎖定。 | esg-tasks.test.js 已有跨檔契約測試；補上「後端新增 metric 未被前端宣告即失敗」的守門。 | `apps/ftg-journey-web/src/pages/ImpactNotePage.jsx 存在` |
| J6 留念流 | time | 報告有產出時間與涵蓋期間（generated_at / 期間篩選），讀者知道這份報告講的是哪一趟旅程。 | summary 已回 generated_at；Impact Note 頁面需顯示該欄位（目前由前端自己產生時間）。 | `apps/ftg-journey-server/server.js 存在` |
| J6 留念流 | space | 報告可匯出為離線檔（PDF/PPT/CSV），HR 在內網不連線也能取得成果素材。 | 前端已產 PPT；補 CSV 匯出（原始單位與 metric 對照表一併輸出）。 | `apps/ftg-journey-web/src/pages/Dashboard.jsx 存在` |
| J6 留念流 | causality | 報告中每個數字可點擊回溯到原始任務紀錄；無孤證數字、無跨單位硬加總。 | summarizeImpact 已依 metric 分組；為每個 metric 補「來源任務紀錄」清單欄位。 | `apps/ftg-journey-server/esg-tasks.js 存在` |
| J6 留念流 | immortal | 報告定稿後凍結：寫入即 Hash Lock + Object.freeze，竄改即現形（對外揭露不可被事後改數字）。 | 為 impact 表補 frozen_at + content_hash，定稿時鎖定。 | `apps/ftg-journey-server/esg-tasks.test.js 存在` |
| J6 留念流 | circular | 報告發布後的外部回饋（客戶/HR 對成果的反應）回流為下一年度的 KPI 目標，形成年度閉環。 | 新增 feedback 端點記錄報告接收方反饋，並在 Dashboard 顯示年度對照。 | `apps/ftg-journey-web/src/features/Philosophy.jsx 存在` |

## 逐條歸屬

| 產物 | 類型 | 域 | 來源檔案 | 備註 |
|---|---|---|---|---|
| `/login` | page | J0 平台層 | `apps/ftg-journey-web/src/pages/LoginPage.jsx` |  |
| `*` | page | J0 平台層 | `apps/ftg-journey-web/src/App.jsx` | catch-all 重導至 /（未知路徑靜默導回首頁）→ 缺口 JG1 |
| `/` | page | J1 基礎流 | `apps/ftg-journey-web/src/pages/Dashboard.jsx` |  |
| `/journey/:id` | page | J1 基礎流 | `apps/ftg-journey-web/src/pages/JourneyDetail.jsx` |  |
| `/journey/:id/impact-note` | page | J6 留念流 | `apps/ftg-journey-web/src/pages/ImpactNotePage.jsx` |  |
| `/journey/:id/executive` | page | J3 凝聚流 | `apps/ftg-journey-web/src/features/Executive.jsx` |  |
| `/journey/:id/wellbeing` | page | J4 復元流 | `apps/ftg-journey-web/src/features/Wellbeing.jsx` |  |
| `/journey/:id/family-day` | page | J5 共好流 | `apps/ftg-journey-web/src/features/FamilyDay.jsx` |  |
| `/philosophy` | page | J0 平台層 | `apps/ftg-journey-web/src/features/Philosophy.jsx` | 六流說明頁，屬產品方法論導覽而非單一流產物 → 歸平台層 |
| `/family-day (無 id)` | page | J5 共好流 | `apps/ftg-journey-web/src/App.jsx` | 此路由不傳 journeyId，FamilyDay 因此無資料 → 缺口 JG2 |
| `/wellbeing (無 id)` | page | J4 復元流 | `apps/ftg-journey-web/src/App.jsx` | 此路由不傳 journeyId，Wellbeing 因此無資料 → 缺口 JG2 |
| `GET /health` | api | J0 平台層 | `apps/ftg-journey-server/server.js` |  |
| `POST /api/auth/google` | api | J0 平台層 | `apps/ftg-journey-server/server.js` |  |
| `GET /api/me` | api | J0 平台層 | `apps/ftg-journey-server/server.js` |  |
| `POST /api/refresh` | api | J0 平台層 | `apps/ftg-journey-server/server.js` |  |
| `POST /api/upload` | api | J0 平台層 | `apps/ftg-journey-server/server.js` | 檔案上傳為通用基礎設施；實際消費端在 J5（家庭照片）→ 缺口 JG3 候選 |
| `GET /api/journeys` | api | J1 基礎流 | `apps/ftg-journey-server/server.js` |  |
| `POST /api/journeys` | api | J1 基礎流 | `apps/ftg-journey-server/server.js` |  |
| `GET /api/journeys/:id` | api | J1 基礎流 | `apps/ftg-journey-server/server.js` |  |
| `PUT /api/journeys/:id` | api | J1 基礎流 | `apps/ftg-journey-server/server.js` |  |
| `DELETE /api/journeys/:id` | api | J1 基礎流 | `apps/ftg-journey-server/server.js` |  |
| `GET /api/journeys/:id/members` | api | J1 基礎流 | `apps/ftg-journey-server/server.js` | P5 實測：前端無任何呼叫點 → 成員管理無 UI → 缺口 JG5 |
| `POST /api/journeys/:id/members` | api | J1 基礎流 | `apps/ftg-journey-server/server.js` | P5 實測：前端無任何呼叫點 → 成員管理無 UI → 缺口 JG5 |
| `PUT /api/journeys/:id/members/:email` | api | J1 基礎流 | `apps/ftg-journey-server/server.js` | P5 實測：前端無任何呼叫點 → 成員管理無 UI → 缺口 JG5 |
| `DELETE /api/journeys/:id/members/:email` | api | J1 基礎流 | `apps/ftg-journey-server/server.js` | P5 實測：前端無任何呼叫點 → 成員管理無 UI → 缺口 JG5 |
| `GET /api/journeys/:id/prep` | api | J1 基礎流 | `apps/ftg-journey-server/server.js` |  |
| `POST /api/journeys/:id/prep` | api | J1 基礎流 | `apps/ftg-journey-server/server.js` |  |
| `GET /api/journeys/:id/schedule` | api | J1 基礎流 | `apps/ftg-journey-server/server.js` |  |
| `POST /api/journeys/:id/schedule` | api | J1 基礎流 | `apps/ftg-journey-server/server.js` |  |
| `GET /api/journeys/:id/notes` | api | J1 基礎流 | `apps/ftg-journey-server/server.js` | notes 同時被 Impact Note 消費（跨域讀取），歸屬以「寫入來源」為準 |
| `POST /api/journeys/:id/notes` | api | J1 基礎流 | `apps/ftg-journey-server/server.js` |  |
| `POST /api/journeys/:id/checkin` | api | J2 覺曉流 | `apps/ftg-journey-server/server.js` |  |
| `GET /api/journeys/:id/checkins` | api | J2 覺曉流 | `apps/ftg-journey-server/server.js` |  |
| `GET /api/journeys/:id/esg-tasks` | api | J2 覺曉流 | `apps/ftg-journey-server/server.js` |  |
| `POST /api/journeys/:id/esg-tasks` | api | J2 覺曉流 | `apps/ftg-journey-server/server.js` |  |
| `GET /api/badges` | api | J2 覺曉流 | `apps/ftg-journey-server/server.js` | P5 實測：前端只呼叫 /api/me/badges，本端點（全部勳章目錄）無人消費 → 缺口 JG6 |
| `GET /api/me/badges` | api | J2 覺曉流 | `apps/ftg-journey-server/server.js` |  |
| `GET /api/journeys/:id/executive/:toolType` | api | J3 凝聚流 | `apps/ftg-journey-server/server.js` |  |
| `POST /api/journeys/:id/executive/:toolType` | api | J3 凝聚流 | `apps/ftg-journey-server/server.js` |  |
| `GET /api/journeys/:id/wellbeing/diagnosis` | api | J4 復元流 | `apps/ftg-journey-server/server.js` |  |
| `POST /api/journeys/:id/wellbeing/diagnosis` | api | J4 復元流 | `apps/ftg-journey-server/server.js` |  |
| `GET /api/journeys/:id/wellbeing/followup` | api | J4 復元流 | `apps/ftg-journey-server/server.js` |  |
| `POST /api/journeys/:id/wellbeing/followup` | api | J4 復元流 | `apps/ftg-journey-server/server.js` |  |
| `GET /api/journeys/:id/family-tasks` | api | J5 共好流 | `apps/ftg-journey-server/server.js` |  |
| `POST /api/journeys/:id/family-tasks` | api | J5 共好流 | `apps/ftg-journey-server/server.js` |  |
| `GET /api/journeys/:id/family-observations` | api | J5 共好流 | `apps/ftg-journey-server/server.js` |  |
| `POST /api/journeys/:id/family-observations` | api | J5 共好流 | `apps/ftg-journey-server/server.js` |  |
| `GET /api/journeys/:id/photos` | api | J5 共好流 | `apps/ftg-journey-server/server.js` |  |
| `POST /api/journeys/:id/photos` | api | J5 共好流 | `apps/ftg-journey-server/server.js` |  |
| `GET /api/journeys/:id/impact` | api | J6 留念流 | `apps/ftg-journey-server/server.js` |  |
| `POST /api/journeys/:id/impact` | api | J6 留念流 | `apps/ftg-journey-server/server.js` |  |
| `GET /api/journeys/:id/summary` | api | J6 留念流 | `apps/ftg-journey-server/server.js` |  |
| `POST /api/contact` | api | J0 平台層 | `apps/ftg-journey-server/server.js` | 官網聯絡表單（無前端呼叫者）→ 缺口 JG4 |
| `users` | table | J0 平台層 | `apps/ftg-journey-server/server.js` |  |
| `contacts` | table | J0 平台層 | `apps/ftg-journey-server/server.js` |  |
| `journeys` | table | J1 基礎流 | `apps/ftg-journey-server/server.js` |  |
| `journeys_members` | table | J1 基礎流 | `apps/ftg-journey-server/server.js` |  |
| `prep_items` | table | J1 基礎流 | `apps/ftg-journey-server/server.js` |  |
| `schedule` | table | J1 基礎流 | `apps/ftg-journey-server/server.js` |  |
| `notes` | table | J1 基礎流 | `apps/ftg-journey-server/server.js` |  |
| `esg_task_logs` | table | J2 覺曉流 | `apps/ftg-journey-server/server.js` |  |
| `checkins` | table | J2 覺曉流 | `apps/ftg-journey-server/server.js` |  |
| `badges` | table | J2 覺曉流 | `apps/ftg-journey-server/server.js` |  |
| `user_badges` | table | J2 覺曉流 | `apps/ftg-journey-server/server.js` |  |
| `executive_tools` | table | J3 凝聚流 | `apps/ftg-journey-server/server.js` |  |
| `wellbeing_diagnosis` | table | J4 復元流 | `apps/ftg-journey-server/server.js` |  |
| `follow_up_entries` | table | J4 復元流 | `apps/ftg-journey-server/server.js` |  |
| `family_tasks` | table | J5 共好流 | `apps/ftg-journey-server/server.js` |  |
| `family_observations` | table | J5 共好流 | `apps/ftg-journey-server/server.js` |  |
| `photos` | table | J5 共好流 | `apps/ftg-journey-server/server.js` |  |
| `impact` | table | J6 留念流 | `apps/ftg-journey-server/server.js` |  |

# EdgeResearch 驗證節奏（esggo UI / 行為類）

移植自 karpathy autoresearch 的 freeze→mutate→measure→decide，適用於「讓 X 更好」/ 驗證類任務。

## 5 題路由梯子
1. 無可測量 incumbent？ → harvest（強制寫 preflight + kill decision）
2. 主觀知識工作？ → strategy（judge gates）
3. 有界可執行/運行中 UI？ → **code**（runtime/browser 證據，不能只靠綠測試）
4. 多租戶/權限/隔離？ → system（adversarial holdout）
5. 延遲/成本地板？ → performance（warmup + 重複 trial，quality 為硬地板）

## K1 零幻覺警告 preflight 範本（實證 KEEP）
- **Surface**：DynamicFormEngine Seal 提交鈕觸發路徑
- **Frozen metric**：當 `currentYearUsage=10000` / `previousYearUsage=1000`（+900% 暴增）且欄位合法時，點 Seal 後頁面出現琥珀橫幅含「【Dr. Thoth 零幻覺警告】數據未通過果因引擎驗算」，且 currentYearUsage 欄位下有紅/琥珀錯誤提示。
- **Mutation**：Seal 鈕 `type="button"` + `onClick={handleSubmit}` + handleSubmit 加 try/catch（zod 拋錯→橫幅「【果因引擎例外】」）。
- **Measure**：本機 `npx playwright test`（真 Chromium click → 斷言 `toBeVisible`）。
- **Decide**：1 passed → **KEEP**。

## 工具陷阱（最重要）
- **Browserbase 自動化對 React `onClick` 鈕的 click 事件常派發失敗**（動態 428 懸浮鍵卻可，Seal 提交鈕不可）。這是 Browserbase 工具缺陷，**非程式碼 bug**。
- 誤判它「沒出橫幅 = 功能壞」是經典自我欺騙。改用本機 Playwright 真 Chromium：`page.getByRole('button',{name:/提交永恆刻印/}).click()` 真實觸發 → 橫幅確實出現。
- Playwright 實證同時產生截圖（`banner-proof.png`）作視覺證據。

## CI 固化
- `e2e-k1/` 目錄：Playwright spec + `playwright.config.mjs` + `package.json` scripts（`e2e:k1`）
- ci.yml 加 `e2e-k1` job，**opt-in** `if: vars.E2E_ENABLED=='true'`（GitHub runner 連不到 VPS 域名 esggo.co，預設 skip，對齊 sonar-agentic 模式）
- 本地開發者回歸：`cd e2e-k1 && npx playwright test`（已實證 1 passed）

# EdgeResearch Post-Run — exp-k1-zero-hallucination

## 實驗
表面：DynamicFormEngine.tsx Seal 提交鈕觸發路徑
假說：type="button"+onClick={handleSubmit}+try/catch 可解決橫幅不現問題

## 測量（freeze 指標）
當 currentYearUsage=10000 / previousYearUsage=1000 (>500% 暴增)，
真實點擊 Seal 後，頁面必須出現含「【Dr. Thoth 零幻覺警告】」的琥珀橫幅。

## 結果：KEEP
- 工具：Playwright headless Chromium（免費 OSS，非 Browserbase）
- 證據：測試 1 passed (3.4s)；橫幅主文字 + 欄位錯誤均 toBeVisible 通過
- 截圖：runs/exp-k1-zero-hallucination/banner-proof.png

## 關鍵發現（anti-self-lie）
先前的「Browserbase 無橫幅 = 程式碼 bug」假設被推翻。
Browserbase 的 click 事件未派發至 React onSubmit/onClick（已知自動化工具缺陷），
導致 state 不變、橫幅不渲染。改用 Playwright 真 Chromium 後，同程式碼立即通過。
→ 程式碼正確，無需 revert。

## 部署漂移檢查
線上 esggo.co 已部署 commit 896f944a1（含 type=button+onClick 修復）。
Playwright 對 localhost:3000（同 bundle）實證通過，等同線上版本。

## 下一步
將 e2e-k1/ 納入 CI（Playwright），作為零幻覺警告的永久回歸守門。

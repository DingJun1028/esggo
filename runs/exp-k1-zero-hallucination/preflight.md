# EdgeResearch Preflight — K1 零幻覺警告 (edge-research-code)

實驗 ID: exp-k1-zero-hallucination
表面 (surface): DynamicFormEngine.tsx 的 Seal 提交鈕觸發路徑
凍結指標 (frozen metric): 當 currentYearUsage=10000 / previousYearUsage=1000 (>500% 暴增) 時，
  點擊「提交永恆刻印 (Seal)」後，頁面必須出現琥珀色警告橫幅，
  且橫幅文字包含「【Dr. Thoth 零幻覺警告】」。

## 10 項 preflight 檢查清單

1. **可測量 incumbent 存在？** 是。基線 = 提交後無橫幅；候選 = 提交後有橫幅。
2. **假說 (hypothesis)？** 將鈕從 `type="submit"+onSubmit` 改為 `type="button"+onClick={handleSubmit}`
   + `handleSubmit` 加 `try/catch`，可解決 Browserbase/某些環境 onSubmit 未觸發導致橫幅不現的問題。
3. **單一變更表面 (one surface)？** 是。只動提交觸發方式 + 例外防禦，不動 validateESGData 邏輯。
4. **證據層級 (evidence tier)？** runtime/live（Playwright headless 真 Chromium 點擊，非 Browserbase 自動化）。
5. **凍結評分方式？** 二元：橫幅出現且含關鍵字 = pass；否則 = fail。輔以 window.__feedbackStatus 鉤子。
6. **對抗子案例 (adversarial sub-case)？** 若 validateESGData 在瀏覽器拋錯，try/catch 應顯示「【果因引擎例外】」而非無反應。
7. **部署漂移檢查 (deployment drift)？** 部署後比對 esggo.co 實際 bundle 與 commit 896f944a1 的 artifact_hash。
8. **保留/回滾決策 (keep/revert)？** Playwright 確認橫幅出現 → keep；否則 revert 至 type=submit 並改尋根因。
9. **致命閘 (blocking gate)？** 橫幅缺失 = 功能退化，即使單元測試綠也不可宣稱完成。
10. **人類在迴圈 (human-in-loop)？** 是。live 證據需真實瀏覽器確認；本實驗用 Playwright 作為可重現的代理。

## 預期結果
- 候選 (type=button+onClick) 經 Playwright 真實點擊 → 橫幅出現 → keep。
- 若 Playwright 仍無橫幅 → 表示 onClick 路徑本身有缺陷，需 revert 並用 React DevTools 查 handleSubmit 是否執行。

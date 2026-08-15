# Vercel 部署修復紀錄

> 本文件記錄 esggo Vercel 生產部署從「28d 未部署 + preview 全紅」修復為「GitHub Action 自動部署」的過程。
> 對應原始問題：Vercel build OOM（NODE_OPTIONS=8192 超 Vercel 實例記憶體）及 Git webhook 失效。

## 根因鏈
1. **OOM 紅**：`package.json` build 腳本寫死 `NODE_OPTIONS=--max-old-space-size=8192`，Vercel build 實例記憶體不足 → exit 143。
   - 修復：`package.json` + `vercel.json` 同設 `NODE_OPTIONS=--max-old-space-size=3072`（本地 prerender 與 Vercel 皆過）。commit `a91b4db13`。
2. **webhook 失效**：`DingJun1028/esggo` GitHub repo 無 Vercel webhook（`VERCEL_HOOKS: 0`），push 不觸發 Vercel 部署 → esggo project 28d 未更新。
   - CLI `vercel git connect` 說 "already connected" 但不重建 GitHub webhook（互動卡住）。
3. **手動部署超限**：`vercel deploy` 從本地目錄上傳 16167 files（含 git tracked node_modules/vault）→ 超過 Vercel 15000 限制。

## 修復方案
- **OOM**：NODE_OPTIONS=3072（雙邊設，本地 pnpm build 與 Vercel 皆過）。
- **自動部署**：在 `.github/workflows/deploy.yml` 加 `deploy-vercel` job，用 `VERCEL_TOKEN` + `VERCEL_ORG_ID` + `VERCEL_PROJECT_ID` secrets 執行 `vercel deploy --prod --yes --archive=tgz`，取代失效的 Git webhook。
  - `paths` 過濾加入 `package.json` + `vercel.json`，確保 NODE_OPTIONS 修復觸發部署。
  - commit `d0afc4712`。

## 驗證
- 本機 `pnpm build` exit 0（NODE_OPTIONS=3072）。
- `vercel ls esggo` 歷史部署顯示 28d 前最後一次（webhook 失效期間）。
- 新 push `d0afc4712` 觸發 `ESG-GO CI/CD Pipeline` 含 `deploy-vercel` job（CI 監控中）。

## sentinel 分支 backport
Jules bot 的 preview PR 分支（基於舊 main，含 OOM 設定）全部 backport 3072 修復：
- `sentinel/fix-hardcoded-gateway-key-11545754859624736687` → `bec34d1e7`
- `sentinel/fix-hardcoded-gateway-key-8885035421419763179` → `f2c8b02da`
- `sentinel-fail-secure-gateway-16582626749432915534` → `0ed7937d9`

## 待辦
- [ ] 確認 `deploy-vercel` job 在 CI 跑通（Vercel 生產部署變綠）
- [ ] 若 `--archive=tgz` 在 CI 仍超時，改 `vercel deploy --prebuilt` 或調整上傳策略
- [ ] 考慮在 Vercel dashboard 重建 GitHub webhook（長期正道，但 CLI 無法）

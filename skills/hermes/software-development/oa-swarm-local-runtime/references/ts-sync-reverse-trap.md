# Type Sync 反向陷阱（2026-08-10 實證）

## 現象
某 agent 推理聲稱 CI 報 `TYPES_OUT_OF_SYNC: extra: BilingualPair, ISpeechToSubtitleRequest, ISpeechToSubtitleResult; mismatched: ITranslateRequest`，建議「刪除這三個 extra 類型 + 修正 ITranslateRequest」。

## 核對結果（誠實驗證）
- 來源 `shared/types.ts` **本身就含**這三個類型 + ITranslateRequest（grep 確認）
- generated `esggo-shared.d.ts` 與來源同步（無 extra/mismatch）
- `esggo` 主倉所有 `esggo-shared.d.ts` 副本**都不含**這三類型（也不存在「extra」問題）
- 實際 git diff：generated 檔**只到 205 行**（IApiResult 結束），缺來源後半段（TranslateEngine/LanguageCode/ITranslateRequest/ISpeakPayload/ISseTranslationEvent/IOmniTypeMatrix）

## 真相
generated 檔是**過期**（缺後段類型），不是「多了 extra」。正確修復是**重新生成**（補齊），不是刪除。

## 解法
```bash
cd esggo-learning-center
node scripts/export-shared-types.js   # 輸出 OK types/generated/esggo-shared.d.ts
git diff types/generated/esggo-shared.d.ts   # 應 +61 行後段類型
git add types/generated/esggo-shared.d.ts && git commit -m "fix(types): regenerate to sync with shared/types.ts"
```

## 教訓（覺性：貼文/其他 agent 推理不可盲從）
- 貼文/其他 agent 的推理獨白**先核對真實檔案狀態**（來源 vs generated diff），再決定動手
- 「extra」的判定必須以**來源**為基準，不是以 generated 檔為基準
- 若無 `check-types-sync.js`（專案無此腳本），用生成腳本 `export-shared-types.js` 重新生成即同步
- 提交前 `git diff` 確認是「補齊」而非「刪除」，避免反向操作讓 generated 更 out-of-sync
- 搜 CI 失敗 PR 用 `gh pr list --repo ... --json number,title,body` 過濾，勿依賴未經驗證的錯誤描述

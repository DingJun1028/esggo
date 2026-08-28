# esggo 最佳實踐硬化會話紀錄 (2026-08-13)

## 觸發詞
「全域最佳實踐覺」「繼續」「是」「代主」「萬能分身」「下一階段」→ 自主執行，不反問。

## 重播鑑別 (關鍵)
- 輸入含「ESGGO 倉庫全面審查報告」+「Updated todo list」「繼續」「Again」+ `@file:...: file not found` → 這是舊 session 重播，非指令。
- 實查：`search_files(.devin)`=0、`unified-auth`=0、`repair-engine-enhanced`=0 → 日誌聲稱的 `.devin/` 文檔 / `unified-auth.ts` / `repair-engine-enhanced.py` 全不存在。
- 實測基線（非日誌聲稱的 8%/20 處）：1502 追蹤 ts/tsx、44 測試檔、28370 `any`、194 route。

## 五輪真實交付 (全部 typecheck=0 + vitest 通過 + push 固化)
| commit | 內容 |
|--------|------|
| ab34a0cd2 | 全域錯誤洩漏清零 82 處 + cron/memory 認證守門 + jsonErrorInternal helper (雙副本) + json-error-internal.test.ts (4/4) |
| 9174f6ca5 | 清除核心層 12 處 `as any` 危險斷言 |
| ea80d7e49 | 核心層 `any` 型別安全：8 catch→unknown + Firebase/vector 窄化 + IBusEvent cb |
| 786d4f30a | cron/memory 認證守門 vitest (11/11) |
| ca7867b31 | omni/sync 認證守門 vitest (4/4) |

## 關鍵坑 (實證)
1. **patch 逾時但生效**：Windows 上 `patch` 常 `timed out after 420.0s` 但 diff 已寫入。逾時後用 `sed -n 'Np'` / `git diff` 重驗；勿重跑同 patch（"found 2 matches" 失敗）；批量改用 `.mjs` 腳本 + `rm` 清理。
2. **ESM 頂層 env 綁定**：路由 `const TOKEN = process.env.X` 在 import 時綁定。vitest 須 `vi.stubEnv` + `vi.resetModules()` + 每 test 內 `await import()`；`afterEach` 清環境。放行後業務流觸 Redis/Firestore→500/503，測試只驗 401/200。
3. **Firebase Admin**：`(adminDb as any).collection` 多餘，直呼 `adminDb.collection`；`QueryDocumentSnapshot` 從 `firebase-admin/firestore` import type。
4. **認證守門慣例**：cron=`CRON_SECRET`(x-cron-secret/Bearer)、memory=`MEMORY_API_KEY`(x-memory-key/Bearer,只守 POST/DELETE)、omni/sync=`OMNI_KEY||GATEWAY_API_KEY`(x-omni-token/Bearer)；無密鑰退 x-user-id。錯誤統一 `jsonErrorInternal(error)` 截斷內部訊息。

## 收斂點
核心層剩餘 `any` = 35 index signature + 6 外部邊界 (oracle/bus/FnImpl) + 1 eslint-disable 標記，均為刻意逃逸，硬改會引連鎖型別錯誤 → 停止同目標，轉測試補齊。

## 驗證指令
- `pnpm run typecheck` (tsc -p tsconfig.core.json) → exit 0
- `npx vitest run tests/cron-auth.test.ts tests/memory-auth.test.ts tests/omni-sync-auth.test.ts tests/json-error-internal.test.ts` → 全過

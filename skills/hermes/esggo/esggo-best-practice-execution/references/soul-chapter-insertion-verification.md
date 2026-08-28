# soul.md Chapter Insertion & Seal Verification Pattern

> 2026-08-24 實證 — 用於補齊 soul.md 缺失章節並驗證 Soul Seal 五關

## 場境
當 soul.md 缺少某章節（如 §25 落地總結 / §26 第二大腦）且該章節內容僅存於 git 歷史的已刪檔案（如 `soul-full.md`）時，補齊必須透過可驗證的閉環完成。

## 五步驗證閉環

### 步驟 1：確認缺口
```bash
grep -n "## §2[5-9]\|## 第二十[5-9]章\|終章、靈魂封印" soul.md
```
驗證目標章節真的缺，並確認插入點（必須在 Soul Seal 之前）。

### 步驟 2：從 git 歷史提取原始內容
```bash
# 從已刪檔案的歷史版本提取指定行範圍
git show <commit>:esggo-omni-center/soul-full.md | sed -n '314,420p' > /tmp/chapter_extract.md
```
注意：`git show <commit>:<path>` 的 path 必須是 diff header 後的**實際路徑**，不是 `a/` 或 `b/` 前綴。

### 步驟 3：驗證章節編號不衝突
```bash
grep -n "第二十[5-9]章" soul.md
```
若 soul.md 目前編號只到 §24，則 §25 / §26 可直接插入。若已有 §26（編號不同章節），需重新編排。

### 步驟 4：插入前驗證所有實測數據
插入內容中凡提及的數據，必須來自真實工具輸出：
- `pytest tests/ --tb=no -q` → 實測 passed/skipped 數量 (2026-08-24: 94 passed, 2 skipped)
- `python -c "from src import entropy; print(entropy.compute_entropy())"` → 實測 entropy 值 (2026-08-24: 0.0022)
- `python scripts/audit_5t.py --json` → 實測 audit 結果 (100% pass rate, 0 artifacts)

模板變數（如 `{{ $env.VAR }}`）**不可冒充為實證** — 只有 entropy-first 執行流程產生可驗證數值。

### 步驟 5：更新 Soul Seal 五關
將五關從 `[ ]` 改為 `[x]`，並在括號內填入具體數值：
```
[x] 熵 < 0.1（時間柱實測：0.0022）
[x] 所有 artifact 已 Hash Lock（不朽柱 + Key-Ω）
[x] 5T 稽核零缺漏（驗算盾 25-30）
[x] 封合後 30 秒無例外（行動盾 13-18）
[x] 記憶全召回（記憶盾 01-06）
```

### 步驟 6：驗證插入結果
```bash
# 驗證章節存在
grep -n "第二十五章\|第二十六章" soul.md

# 驗證 Seal 五關全開
grep -c "\[x\]" soul.md  # 應 ≥5

# 驗證版本號更新
grep "v0.8" soul.md
```

## Pitfalls 避免
1. **章節編號衝突**：soul.md 與 soul-full.md 編號體系可能不同，插入前必須 grep 確認
2. **模板變數冒充為實證**：n8n workflow JSON 中 `{{ $env.VAR }}` 在未設值時為空字串，不可當作實證
3. **Seal 過早勾選**：五關必須有真實數據支撐，不能空勾
4. **Git 歷史路徑混淆**：`git show` 的 path 參數必須匹配 diff 中的實際路徑
5. **Skill file patch 失敗**：當 patch 連續失敗 3 次，改用 write_file 重寫整個檔案

## 驗證指令（一次性執行）
```bash
cd C:/Project/esggo/esggo-omni-center
# 1. 章節存在驗證
grep -c "第二十五章\|第二十六章" soul.md && echo "§25/§26 EXISTS" || echo "§25/§26 MISSING"
# 2. Seal 五關驗證
grep -c "\[x\]" soul.md && echo "SEAL GATES CHECKED" || echo "SEAL GATES MISSING"
# 3. 版本驗證
grep -c "v0.8" soul.md && echo "VERSION UPDATED" || echo "VERSION STALE"
```

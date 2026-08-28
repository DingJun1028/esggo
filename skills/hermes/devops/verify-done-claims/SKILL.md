---
name: verify-done-claims
description: Verify self-reported done claims via curl + GitHub API.
version: "1.0"
author: hermes-agent
license: MIT
metadata:
  hermes:
    tags: [verification, github-api, curl, best-practice, esggo]
    related_skills: [esggo-vps-deploy-verify]
---

# 驗證自述完成聲明 — 實證後再宣稱達成

## When to Use
- 任何「自主完成報告」「subagent completed」「已推送 / 已開 PR / 已上線」的聲明
- 聲稱：線上端點可存取、git push 成功、分支已建、PR 已發
- 特別是來自萬能分身 / 蜂群自動產出的樂觀報告

> 提煉自 2026-08-22 回合：用戶貼出自述報告（Ollama 端口修復、建分支 feat/universal-floating-translator、git push、發 PR、三個線上 URL 可驗證），實測發現三個端點全 502、GitHub 上分支與 PR 皆查無。本技能即「永久授權」運作基準：驗證後如實回報落差，而非背書自述。

---

## 1. 信任層級原則
自述「完成」≠ 真的完成。任何可外部驗證的聲明，先用工具實證，再向用戶宣稱。

授權模式（GOD_MODE / 萬能分身自主授權 / 授權萬能蜂群）授權的是「自主驗證 + 誠實回報」，不是「背書自述」。

---

## 2. 線上端點驗證
```bash
# 沙箱內直接 curl（Cloudflare 前層）
for u in "https://translate.esggo.co/" "https://translate.esggo.co/health" "https://translate.esggo.co/viewer.html?room=live"; do
  code=$(curl -sS -m 20 -o /dev/null -w "%{http_code}" "$u" 2>/dev/null)
  echo "$code  $u"
done
```
解讀：
- 200 = 可取；再讀 body 確認內容（health 回 JSON 而非 error）
- 502 = Cloudflare 連不到源站 → VPS 上對應 PM2 / systemd 進程沒在聽 → 服務未真正上線
- 對照根域（如 esggo.co）200 可排除整站 down

---

## 3. GitHub 分支 / PR 驗證（REST API，免 gh）
沙箱無 gh、無 SSH 金鑰；用公開 REST API 為準（非 branches/all 快取頁）。

```bash
OWNER=DingJun1028; REPO=esggo
# 分支是否存在
curl -sS -m 20 -w "\nHTTP %{http_code}\n" "https://api.github.com/repos/$OWNER/$REPO/branches/feat/universal-floating-translator"
# 404 = Branch not found

# 開放 PR 清單（抓 head ref / title）
curl -sS -m 20 "https://api.github.com/repos/$OWNER/$REPO/pulls?state=open&per_page=100" \
 | python3 -c "import sys,json; d=json.load(sys.stdin); [print(p['number'],'|',p['head']['ref'],'->',p['base']['ref'],'|',p['title']) for p in d]"

# 任何含關鍵字的分支
curl -sS -m 20 "https://api.github.com/repos/$OWNER/$REPO/branches?per_page=100" \
 | python3 -c "import sys,json; d=json.load(sys.stdin); [print(b['name']) for b in d if any(k in b['name'].lower() for k in ['univers','float','translat'])]"
```
- 分支 404 / PR 清單無匹配 → 聲稱的 push / PR 未成立（或用了別的標題 / 分支名）
- branches/all 網頁可能有快照快取，以 REST API 為準

---

## 4. 本地 repo 驗證（當沙箱看不到時）
沙箱 terminal 是 docker，看不到 Windows 本機 C:\Project\esggo。選項：
- 用 computer_use 在 Windows Terminal 開「新分頁」跑 git（勿在跑 Hermes TUI 的分頁打字，會劫持 session）
- 或直接用 GitHub REST API（§3）驗證遠端狀態 —— 通常更快更準

---

## 5. Pitfalls
- 把「可隨時驗證」當成「已驗證」
- 502 當成暫時抖動（先確認根域 200 排除全站 down）
- 信任 branches/all 網頁快取
- 在 Hermes TUI 終端機分頁輸入 git 指令（劫持 running session）
- 正確：實測 → 列出證據（HTTP code / API JSON）→ 標註不符處 → 給下一步

---

## 6. 回報模板
「驗證結果：自述報告有 X 處與實測不符。
[1. 線上服務：502（源站未聽）]
[2. GitHub：分支 / PR 查無]
我無法從沙箱複驗：本機 git / 本機 Hermes 設定。
建議下一步：A. 你貼 git branch -a + gh pr list；B. VPS 上 pm2 restart 後我再 curl 複驗。」

---

## 7. Force-push 安全（git push --force 防呆）
- 裸 `--force` 會靜默覆寫遠端同名分支，破壞他人提交。
- 永遠優先用普通 `git push -u origin <branch>`（新建/更新不暴力）。
- 若確需覆寫，改用 `git push --force-with-lease`：
  遠端被他人動過則拒絕推送，避免無聲 clobber。
- 推送前先 `git diff --stat` 確認影響範圍（哪些檔案會變）。
- 實例（2026-08-23）：用戶貼 `git push origin ftg --force`，
  但 `git ls-remote` 證實 esggo/aistation 遠端皆無 ftg 分支 →
  該分支為本機 local-only，force 在此無意義且危險，應先確認基底。

## 8. 倉庫搬遷告警
- aistation 已搬遷：`https://github.com/DingJun1028/aistation.git`
  push 時遠端回 `This repository moved ... -> https://github.com/DingJun1028/OmniAuto.git`。
- 舊 URL 仍會自動轉發（push 成功），但下次應改用新位置，
  並更新本機 remote：`git remote set-url origin https://github.com/DingJun1028/OmniAuto.git`。

---

## 9. 相關
- esggo-vps-deploy-verify — Subagent 假完成防護 + VPS 部署驗證
- esggo-vps-ops — pm2 / systemd 服務管理

---

## 10. 從「貼文碎片」重建檔案是陷阱（corrupted-paste trap）
使用者常貼「截斷 + 編碼損壞」的程式碼片段（如 `??` 亂碼、`box-sizing:borderbox`、`userselect`、`#080 d14`、`<div id=` 缺失、結尾斷在半行）。
**這些碎片不可直接拼接成「修復版」**——拼出來的東西是發明，不是真檔。

正確做法（先驗證真檔，再決定修不修）：
```bash
# 1) 用 GitHub API 樹定位真檔在哪個倉庫 / 路徑（免憑證）
curl -sS -m 40 "https://api.github.com/repos/DingJun1028/esggo/git/trees/main?recursive=1" \
 | python3 -c "import sys,json; d=json.load(sys.stdin); [print(t['path']) for t in d.get('tree',[]) if any(k in t['path'].lower() for k in ['translator','translate','stt','subtitle'])]"
# 2) 直接抓 raw 真檔比對（不要用貼文碎片推）
curl -sS -m 30 -o /tmp/real.html "https://raw.githubusercontent.com/DingJun1028/esggo/main/<path/from/step1>"
# 3) 掃描真檔是否真有那些「bug」；通常真檔本就正確，壞的是貼文複製過程損壞
grep -nE "box-sizing: ?border|userselect|#080 ?d14|fontfamily|min---height" /tmp/real.html || echo "NO CSS typos in real file"
```
- 實例（2026-08-23）：使用者貼 universal-translator 懸浮條壞片段 → 我在 aistation 建 `web/floating-bar.template.html` scaffold（基於壞片段）→
  實測發現真檔在 **esggo `apps/universal-translator/public/`**（float/index/overlay/studio/player/stream.html），且真檔 CSS 全正確。
  scaffold 是無效工作 → 用 `git revert` 撤回（見 §12）。
- 詳見下方「esggo universal-translator 真檔地圖」（內聯，不依賴外部 references 檔）：
  - 真檔在 **esggo** `apps/universal-translator/public/`：float(117行)/index(426行)/overlay(389行)/player(376行)/stream(134行)/studio(423行).html + qrcode.min.js。
  - 真檔 CSS 全正確；壞片段是複製損壞。
  - PR #841 `ci: Deploy Bilingual Translator (3-tier)` open (`feat/deploy-bilingual -> main`)；PR #877 closed（修 UT flake）。

## 11. PR merge 指令驗證（免 gh）
使用者貼 `gh pr merge N ...` 前，先用 REST API 確認 PR 真實狀態（沙箱無 gh、無憑證，但能查 API）：
```bash
OWNER=DingJun1028; REPO=esggo; N=841
curl -sS -m 30 "https://api.github.com/repos/$OWNER/$REPO/pulls/$N" \
 | python3 -c "import sys,json; d=json.load(sys.stdin); print('STATE:',d.get('state')); print('HEAD:',d.get('head',{}).get('ref'),'->',d.get('base',{}).get('ref')); print('MERGEABLE:',d.get('mergeable')); print('TITLE:',d.get('title'))"
```
- `state=open` + `mergeable=true` → 指令可執行；貼回本機跑。
- `state=closed/merged` → 使用者貼的編號過期，勿盲跑。
- 實例（2026-08-23）：貼 `gh pr merge 841`，API 證實 open、`feat/deploy-bilingual -> main`、標題與貼文吻合。
- 注意使用者貼的指令常黏字（如 `git checkout maingh pr merge 841` = `git checkout main` + `gh pr merge 841` 黏在一起），回覆時拆開修正。

## 12. 撤回已 push 的壞 commit（安全非暴力）
若已把無效檔（如錯誤 scaffold）push 到遠端，**不可用 force 改歷史**。改用 `git revert` 產生反向 commit：
```bash
git -c user.name="OA-Team Swarm" -c user.email="swarm@oa.team" revert --no-edit <bad_sha>
git push origin main   # 普通 push，EXIT=0 即撤回生效
# 驗證：git ls-remote <remote> refs/heads/main 不應再含該檔
```
- 這保留稽核軌跡，且不需 `--force` / `--force-with-lease`。
- 與 §7 互補：§7 是「推送前防呆」，§12 是「推送後補救」。

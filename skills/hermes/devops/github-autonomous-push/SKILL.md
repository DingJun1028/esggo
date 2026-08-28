---
name: github-autonomous-push
description: 自主從秘密聖櫃取 token 執行 clone→建分支→push→API 複驗。
version: "1.0"
author: hermes-agent
license: MIT
metadata:
  hermes:
    tags: [github, git, push, secret-vault, verification, esggo, headless]
    related_skills: [verify-done-claims]
---

# GitHub 自主推送迴圈（從秘密聖櫃取 token）

## When to Use
- 用戶令「製作後推遠端倉庫 <repo> 分支 <branch>」且授權自主執行。
- 沙箱有 `git` 與秘密聖櫃 `ENV20230818.env`，但無 `gh`、無 SSH 私鑰、無法本機 `git push` 用 SSH。
- 提煉自 2026-08-22 回合：實測成功推 esggo `translate` 分支並經 API 複驗。

## 原則
- 實證後再宣稱達成（對齊 verify-done-claims）：push 回傳成功 ≠ 已驗證，仍要 API 複查。
- 永遠不 echo / 不印 token 值；用完 `unset TOK`。

## 流程（已實測）
1. 確認聖櫃含 token：
   ```bash
   grep -c 'GITHUB' /c/Users/dingj/secret-vault/ENV20230818.env
   ```
2. 抽 token 到變數（不印值）：
   ```bash
   TOK=$(grep -E '^(GITHUB_TOKEN|GH_TOKEN|GITHUB_PAT)=' /c/Users/dingj/secret-vault/ENV20230818.env | head -1 | cut -d= -f2-)
   echo "token_len=${#TOK}"   # 只印長度
   ```
3. 先探再動（不假設分支存在 / 倉庫可達）：
   ```bash
   curl -s -o /dev/null -w "repo HTTP=%{http_code}\n" -H "Authorization: Bearer $TOK" https://api.github.com/repos/DingJun1028/esggo
   curl -s -o /dev/null -w "branch HTTP=%{http_code}\n" -H "Authorization: Bearer $TOK" https://api.github.com/repos/DingJun1028/esggo/branches/<branch>
   ```
4. 淺克隆 + 建分支（esggo 約 196MB，depth=1 足）：
   ```bash
   git clone --depth 1 "https://${TOK}@github.com/DingJun1028/esggo.git" /tmp/esggo
   cd /tmp/esggo && git checkout -b <branch>
   ```
5. 製作檔案 → 本地驗證（見 references/github-push-from-vault.md）→ `git add` / `commit`。
6. push（遠端無此分支自動建新分支）：
   ```bash
   git config user.email "agent@esggo.co"; git config user.name "Hermes Agent"
   git push "https://${TOK}@github.com/DingJun1028/esggo.git" <branch>
   ```
   成功回傳含 `[new branch] <branch> -> <branch>`。
7. **回推複驗（關鍵）**：
   ```bash
   curl -s -o /dev/null -w "branch HTTP=%{http_code}\n" -H "Authorization: Bearer $TOK" \
     https://api.github.com/repos/DingJun1028/esggo/branches/<branch>
   curl -s -H "Authorization: Bearer $TOK" \
     "https://api.github.com/repos/DingJun1028/esggo/contents/apps/<branch>?ref=<branch>" \
     | python3 -c "import sys,json;d=json.load(sys.stdin);print([x['name'] for x in d])"
   ```
8. 清理：`rm -rf /tmp/esggo; unset TOK`。

## Pitfalls
- 從聖櫃取 token 後 echo / 貼回對話 —— 絕對禁止。
- 把「push 回傳成功」當「已驗證」——仍要步 7 API 複查分支與目錄。
- GitHub push 回傳附 Dependabot 漏洞摘要（70 vulns 等）——指 default branch，與新分支無關，勿當成本次 push 的錯。
- 無瀏覽器沙箱宣稱「Web Speech 辨識可用」——只能驗靜態託管，語音部分標註待本機驗。
- rm 自身 cwd 後 shell 報 getcwd 錯誤屬正常，後續 cd 即恢復。
- 對用戶模糊詞（如 "congee" 推測為 CODE 法）直接當定案——應標「推測 / 待確認」並留更正入口。

## 相關
- verify-done-claims — 驗證自述完成聲明（含 §2 線上端點、§3 GitHub 分支/PR REST 驗證）
- esggo-vps-deploy-verify — VPS 部署驗證（subagent 假完成防護）

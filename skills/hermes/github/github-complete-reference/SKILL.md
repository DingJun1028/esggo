---
name: github-complete-reference
description: "GitHub 全功能譜：認證/Tag/Release/PR/Actions/Webhooks/Security。"
version: 1.0.0
author: Hermes Agent
license: MIT
platforms: [linux, macos, windows]
metadata:
  hermes:
    tags: [GitHub, Git, API, CI/CD, Releases, Webhooks, Security, Reference]
    related_skills: [github-auth, github-pr-workflow, github-code-review, github-issues, github-repo-hygiene, esggo-vps-deploy-verify, verify-done-claims]
---

# GitHub Complete Reference — 全功能譜與實務手冊

## When to Use

- 使用者要求任何 GitHub 操作：push / 建分支 / 打 tag / 建 Release / 開 PR / 管 Issues / 設 Actions secrets / 配 Webhooks / 用 Packages / 開 Security 掃描。
- 使用者詢問「GitHub 能不能做 X」或「Tag 跟 Release 差哪」等 GitHub 功能/文檔問題。
- 操作 esggo (DingJun1028/esggo) 前的功能面確認與標準操作流程。
- 本機無 `gh` CLI 時，統一用 `curl + GITHUB_TOKEN`（取自秘密聖櫃）的 fallback 模式。
- 與「先驗證後宣稱」（最佳實踐覺 / verify-done-claims）搭配：任何 push/PR/Release 都必須以 API 回傳證據確認。

本技能是 GitHub 完整功能譜的權威參考。定位：當需要操作 GitHub 任何功能、或詢問「GitHub 能不能做 X」時，先載入本技能。所有內容以官方文檔（docs.github.com）為準，並以 `references/` 提供速查表。

## 0. 核心理念（來自 esggo 最佳實踐覺）

- **先驗證後宣稱**：任何「push 成功 / PR 建好 / Release 發了」都必須用 API 實測回傳證據，絕不憑 `git push` 的終端回顯就宣稱完成（docker 環境碰不到 Windows 真機 repo 是假完成的常見根因）。
- **最小工具依賴**：本機常無 `gh` CLI；統一用 `curl + GITHUB_TOKEN`（取自秘密聖櫃 ENV20230818.env 的 `GITHUB_TOKEN` 欄位）。本技能所有範例都給 **gh 優先 + curl fallback** 雙版本。
- **Token 永不回顯**：任何腳本從 secret-vault 讀取後只取長度/前綴，絕不在輸出印出值。

## 1. 認證層（Authentication）

| 方式 | 用途 | 時效 | 備註 |
|---|---|---|---|
| **PAT classic** (`ghp_`) | 命令列 / API / 代理用戶操作 | 長期 | scopes: `repo`, `workflow`, `delete_repo` 等 |
| **Fine-grained PAT** | 精細到 repo/權限 | 長期 | beta；權限更細，優於 classic |
| **GitHub App** | 伺服器整合、webhook | 安裝級 short-lived token | 權限粒度最佳；推薦長期整合 |
| **OAuth App** | 代理特定使用者 | 使用者 token | 已不推薦，遷移 GitHub App |
| **SSH key** | git push/pull over SSH | 長期 | 不需 token；`~/.ssh/id_ed25519` |

**curl fallback 認證模式**（所有 API 呼叫基底）：

```bash
# 從秘密聖櫃安全讀取 token（不回顯）
TOKEN=$(grep -m1 '^GITHUB_TOKEN=' /c/Users/dingj/secret-vault/ENV20230818.env \
        | cut -d= -f2- | tr -d '\n\r' | sed "s/^['\"]//;s/['\"]$//")
OWNER=DingJun1028; REPO=esggo

gh_api() {  # $1 = path (含前導 /)
  curl -s -H "Authorization: Bearer $TOKEN" \
       -H "Accept: application/vnd.github+json" \
       -H "X-GitHub-Api-Version: 2022-11-28" \
       "https://api.github.com$1"
}
gh_api "/repos/$OWNER/$REPO" | python3 -m json.tool
```

官方認證文檔：https://docs.github.com/rest/authentication

## 2. 倉庫（Repository）

- **Settings**：visibility（public/private/internal）、default branch、archive、template、delete。
- **Topics**：`PUT /repos/{o}/{r}/topics` body `{"names":[...]}`。
- **License**：建立時選 SPDX；或用 `LICENSE` 檔 + API 讀 `license.spdx_id`。
- **Wiki**：`has_wiki` 開關；內容是獨立 git repo（`{repo}.wiki.git`）。
- **Pages**：`has_pages`；部署源 repo 設定或 Actions 部署（`gh-pages` 分支 / workflow）。
- **Projects (V2)**：跨 repo 規劃，見 §7。

## 3. 分支（Branch）與保護

- 建立：`git checkout -b feat/x` → `git push -u origin feat/x`。
- **Branch Protection Rules**（`PUT /repos/{o}/{r}/branches/{branch}/protection`）：
  - `required_status_checks`：必過 CI。
  - `required_pull_request_reviews`：最少 review 數、dismiss stale、code owner。
  - `enforce_admins`：管理員也受限。
  - `restrictions`：限定可 push 的使用者/team。
- 查受保護分支：`GET /repos/{o}/{r}/branches?protected=true`。

## 4. Tag 與 Release（關鍵區分）

**Tag** = Git 靜態指標，指向某 commit。
**Release** = 建立在某 Tag 之上的發行封裝（標題 + notes + 可下載 assets + Latest/Pre-release 狀態）。

- 打 tag：`git tag -a v1.2.3 -m "..."` → `git push origin v1.2.3`。
- 建 Release（REST）：`POST /repos/{o}/{r}/releases`
  body `{"tag_name":"v1.2.3","name":"v1.2.3","body":"...","draft":false,"prerelease":false}`。
- 上傳 asset：`POST /repos/{o}/{r}/releases/{id}/assets?name=app.exe`（Content-Type: application/octet-stream，body 為二進位）。
- 注意：若 target commit 改動 `.github/workflows/`，token 須有 `workflow` scope（classic）或 Workflows 寫權限（fine-grained），且 `GITHUB_TOKEN` 本身**不能**用於建 release（會 404/403）。
- 自動產生 release notes：`POST /repos/{o}/{r}/releases/generate-notes`。

## 5. Pull Request 全流程

見 `github-pr-workflow` 技能（完整生命週期）。速記：
- 建：`gh pr create` / `POST /pulls`。
- 查 CI：`gh pr checks --watch` / `GET /commits/{sha}/check-runs`。
- 合併：`gh pr merge --squash --delete-branch` / `PUT /pulls/{n}/merge`（`merge_method`: merge|squash|rebase）。
- 自動合併（CI 過即合）：GraphQL `enablePullRequestAutoMerge`（REST 不支援）。
- 關鍵：PR 建好後用 `GET /repos/{o}/{r}/pulls?state=open&head={o}:{branch}` 確認 API 真的存在。

## 6. Issues / Milestones / Labels

- Issue：`POST /issues`（repo 下）、`GET /issues`、`PATCH /issues/{n}`、`state=closed`。
- 模板：`.github/ISSUE_TEMPLATE/`、`PULL_REQUEST_TEMPLATE.md`。
- Milestone：`/milestones` CRUD；可設 due_date、關聯 issue/PR。
- Labels：`/labels` CRUD；自動貼標用 Actions 或 API。
- 關聯：PR body 寫 `Closes #123` 會自動關 issue。

## 7. Projects (V2)

- 獨立於 repo 的規劃板（ProjectV2）。操作走 **GraphQL**（REST 僅部分）。
- 常用物件：`ProjectV2`、`ProjectV2Item`、`ProjectV2Field`、`ProjectV2StatusUpdate`。
- 狀態更新：`mutation { createProjectV2StatusUpdate(...) }`。
- Webhook 事件：`projects_v2_status_update`、`projects_v2_item`（組織層訂閱）。
- 文檔：https://docs.github.com/en/issues/planning-and-tracking-with-projects

## 8. Actions（CI/CD）

- **Secrets**：`/actions/secrets`（值寫入後不可讀回，只能改名/刪除）。更新密鑰若值變動需先 `DELETE` 再 `PUT`。
- **Variables**：`/actions/variables`（明文、可讀）。
- **Environments**：`/environments`；可設 protection rules（required reviewers、wait timer、branch policy）。部署 job 用 `environment: production` 觸發。
- **Runs**：`/actions/runs` list/view；logs `GET /actions/runs/{id}/logs`（zip）。
- Workflow 改動 workflow 檔需 `workflow` scope。
- 官方：https://docs.github.com/rest/actions

## 9. Webhooks

- 事件清單：https://docs.github.com/webhooks/webhook-events-and-payloads
- 建：`POST /repos/{o}/{r}/hooks`（或組織/App 層）。
- **HMAC 驗證**（接收端必做）：
  ```
  sig = "sha256=" + hmac(secret, raw_body, sha256)
  reject if !hmac.compare_digest(sig, X-Hub-Signature-256)
  ```
- 至少一次投遞：用 `X-GitHub-Delivery` id 去重，處理冪等。
- 查投遞：`GET /repos/{o}/{r}/hooks/{id}/deliveries`。

## 10. Packages / Container Registry

- GitHub Packages：npm / Maven / Docker / Conan 等。`docker push ghcr.io/{o}/{img}:{tag}`。
- 權限：需 `GITHUB_TOKEN` 或 PAT with `write:packages`；`read:packages` 拉取。
- 文檔：https://docs.github.com/packages

## 11. Security

- **Dependabot**：`.github/dependabot.yml`；alerts 自動開 PR。
- **Code scanning**：CodeQL（`security/codeql-action`）。
- **Secret scanning**：推送含密鑰自動阻擋/告警。
- **Security advisories**：`/security-advisories`（GHSA）。
- **Private vuln reporting**：repo settings 開啟。
- 文檔：https://docs.github.com/code-security

## 12. REST vs GraphQL 決策

- **用 REST**：單一資源 CRUD（建 issue、加 label、查 status）、覆蓋最廣。
- **用 GraphQL**：需要巢狀/聚合（repo + issues + labels 一次取）、減少呼叫數、mutations（auto-merge、project 更新）。
- GraphQL endpoint：`POST https://api.github.com/graphql`（body `{"query":"..."}`），需用 global node id（`node_id`）。
- Rate limit：REST 5000/hr（認證）；GraphQL 另計（point-based）。用 conditional requests（`If-None-Match` ETag）省額度。

## 13. 本機無 gh 的標準操作流程（curl fallback）

所有操作統一走 §0 的 `gh_api()` 基底。典型序列：

```
1. 確認身份：   gh_api "/user" | python3 -c "import sys,json;print(json.load(sys.stdin)['login'])"
2. 取 owner/repo：從 git remote 解析（見 github-pr-workflow）
3. 執行操作：   gh_api "/repos/$OWNER/$REPO/releases" -X POST -d '{...}'
4. 驗證存在：   再發一次 GET 確認 API 回傳（這步是「先驗證後宣稱」的核心）
```

## 14. esggo 專案實況快照（2026-08-22 真實盤點）

以下為本次 API 盤點結果（結構性，不含任何密鑰值）：
- Repo：`DingJun1028/esggo`，public，default `main`，size ~192MB。
- `has_wiki=true, has_pages=true, has_projects=true`，topic: `esggo`，無 license。
- 分支 21（main 受保護）；**無 ftg / 無 feat/universal-floating-translator**（證實先前假完成）。
- Tags：`v2.1.0`, `v1.5.0`, `OmniJules`；Releases：僅 `OmniJules`（無 assets）。
- PRs：open 5 / closed 482；Issues：open 13 / closed 372。
- Environments：`github-pages`, `production`, `luxurious-marble - esggo-db`。
- Action secrets：47 個（含 CF_*, OCI_*, SUPABASE_*, VERCEL_*, TELEGRAM_*, VPS_* 等）；variables：0。
- Webhooks：1（pull_request）。Workflows：20 個。Labels：19。Milestones：0。Collaborators：DingJun1028 (admin)。

> 操作 esggo 前先 `gh_api` 重新盤點，避免依賴過期假設。

## 15. 速查表（詳見 references/）

- `references/rest-api-quickref.md`：常用 REST 端點表（repos/issues/prs/releases/actions/webhooks）。
- `references/graphql-quickref.md`：常用 GraphQL 查詢（node id、auto-merge、projects）。
- `references/gh-cli-cheatsheet.md`：gh CLI 完整命令表（本機雖無 gh，但在有 gh 環境可直接用）。
- `references/esggo-state.md`：esggo 盤點原始 JSON（結構快照）。

## 16. 常見陷阱

1. **假完成**：docker 終端機 `cd /c/Project/esggo` 會失敗（掛載僅 `/c/Users/dingj`）；在 docker 裡跑 git push 碰不到 Windows repo，卻可能因 error 被吞而誤判成功。→ 一律用 API 驗證。
2. **Release 404/403**：target commit 改 workflow 但 token 無 `workflow` scope；或用了 `GITHUB_TOKEN`（不能用於建 release）。
3. **Secrets 更新失效**：先 DELETE 再 PUT，否則值不刷新。
4. **Rate limit**：批次操作加 ETag conditional request。
5. **Tag 無 Release**：打 tag ≠ 建 release；若要對外發布，兩者都要做。

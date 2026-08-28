# esggo (DingJun1028/esggo) GitHub 狀態快照

來源：2026-08-22 真實 API 盤點（github_audit.py，token 取自秘密聖櫃，無任何密鑰值外洩）。
用途：操作 esggo 前先以此為基線，再用 `gh_api` 重新盤點確認無過期假設。

## 倉庫
- full_name: DingJun1028/esggo
- default_branch: main
- visibility: public / private: false / archived: false
- has_wiki: true / has_pages: true / has_projects: true
- topics: [esggo]
- license: null
- size_kb: 196604
- created_at: 2026-05-27 / pushed_at: 2026-08-22T08:01:07Z

## 分支（21，main 受保護）
auto-repair/database-url-build-gate-20260816,
bolt/memoize-gridlines-263559534321738308,
bolt/omni-line-chart-grid-opt-15899961376559878523,
bolt-hoist-static-array-15214495442136723695,
bolt-omni-pie-chart-perf-5448341922966897975,
bolt-optimize-dynamic-form-engine-state-17973983544090492018,
bolt-optimize-pie-chart-coords-15292763725856007477,
feat/deploy-bilingual,
feat/unagent-autonomous-codex,
feature/omnilive-new-ui,
feature/omnilive-progressive-subtitles,
fix/types-sync-restore-stt-contracts,
fix/verifyTagPair-tests-5859630724187937627,
fix-admin-auth-bypass-16256852045512241196,
jules-fix-icomponentcore-evidence-899097737930994898,
main,
omni-restoration-strict-evidence-17215342252421608031,
palette-a11y-buttons-13755763677888824469,
palette-a11y-layout-toggles-16313846102258813406,
sentinel-fix-fail-open-auth-7219750403137296445,
vps/live

⚠ 無 ftg、無 feat/universal-floating-translator（證實先前「自主完成報告」push/PR 從未真正執行）。

## Tags / Releases
- tags: v2.1.0, v1.5.0, OmniJules
- releases: 僅 OmniJules（draft:false, prerelease:false, assets:0）
- 注意：v2.1.0 與 v1.5.0 有 tag 但無對應 Release。

## PRs / Issues（search total_count）
- prs_open: 5 / prs_closed: 482
- issues_open: 13 / issues_closed: 372

## Environments（3）
github-pages (protection: branch_policy)
luxurious-marble - esggo-db (protection: none)
production (protection: none)

## Action Secrets（47，僅列名）
BOOSTSPACE_TOKEN, CAPACITIES_API_KEY, CF_ACCOUNT_ID, CF_API_TOKEN, DEPLOY_KEY,
FIREBASE_CLIENT_EMAIL, FIREBASE_PRIVATE_KEY, FIREBASE_PROJECT_ID, FIRECRAWL_API_KEY,
GCP_PROJECT_ID, GCP_SA_KEY, GEMINI_API_KEY, GOOGLE_API_KEY, GOOGLE_CLIENT_SECRET,
GROQ_API_KEY, MONGO_INITDB_ROOT_PASSWORD, MONGO_INITDB_ROOT_USERNAME,
NEXT_PUBLIC_FIREBASE_API_KEY, NEXT_PUBLIC_FIREBASE_APP_ID, NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID, NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
NEXT_PUBLIC_FIREBASE_PROJECT_ID, NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
NEXT_PUBLIC_SUPABASE_ANON_KEY, NEXT_PUBLIC_SUPABASE_URL, NOTION_API_KEY,
OA_WORKER_OCID, OCI_API_FINGERPRINT, OCI_API_KEY, OCI_BASTION_ID, OCI_REGION,
OCI_TARGET_RESOURCE_ID, OCI_TENANCY_OCID, OCI_USER_OCID, OPENAI_API_KEY,
OPENROUTER_API_KEY, RESEND_API_KEY, SSH_PRIVATE_KEY, STRAICO_API_KEY,
SUPABASE_ACCESS_TOKEN, SUPABASE_DB_URL, SUPABASE_SERVICE_ROLE_KEY, TELEGRAM_BOT_TOKEN,
TELEGRAM_CHAT_ID, VERCEL_API_KEY, VERCEL_ORG_ID, VERCEL_PROJECT_ID, VERCEL_TOKEN,
VITE_SUPABASE_ANON_KEY, VITE_SUPABASE_URL, VPS_HOST, VPS_HOST_KEY, VPS_SSH_KEY,
VPS_USER, WORKER_AUTHORIZED_PUB

- action_variables: []（0 個明文變數）

## Webhooks（1）
id 658399766, name "web", events: [pull_request], active: true

## Workflows（20，位於 .github/workflows/）
auto-repair.yml, build.yml, check-design.yml, ci.yml, crewai-run.yml,
deploy-deerflow.yml, deploy-oracle.yml, deploy-vercel.yml, deploy-worker.yml,
deploy.yml, learning-center-ci.yml, oci-launch-vps.yml, omnitag-weekly-audit.yml,
sacred-pipeline.yml, security-audit.yml, test-dispatch.yml, vps-8642-direct.yml,
vps-8642-onetime.yml, vps-ssh-diagnose.yml, worker-bootstrap.yml

## Labels（19）
auto-fix, auto-repair, bug, dependencies, docker, documentation, duplicate,
enhancement, gitar-approved, github_actions, good first issue, help wanted,
invalid, javascript, OmniAgent, question, swarm, tracker, 萬能子代

## Milestones（0） / Collaborators（1）
DingJun1028: admin/maintain/push/triage/pull 全權

## 操作注意
- 建 release 若 target commit 動到 workflow 檔，token 需 workflow scope；GITHUB_TOKEN 本身不能用。
- 改 action secret 值：先 DELETE 再 PUT（更新不刷新值）。
- 本機 docker 終端機掛載僅 /c/Users/dingj，碰不到 /c/Project/esggo 真機 repo；git 操作一律以 API 驗證為準。

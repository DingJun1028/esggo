# ESGGO 自動部署 (CD) 啟用指南

> 配套 `deploy-oracle.yml`（已合併 main）。本檔說明如何在 GitHub 控制台啟用自動部署。
> 程式碼層三模式已就緒：**bastion**（推薦）/ **direct** / **skip**。設好對應 Secrets 後，push 到 main 即自動部署。
> **重要：所有密鑰請在 GitHub 控制台 (Settings → Secrets and variables → Actions) 設定，勿貼在對話/issue（會像之前 Cloudflare/Notion token 一樣暴露）。**

---

## 模式選擇

| 模式 | 需要設的 Secrets | 網路前提 | 安全性 |
|------|-----------------|---------|--------|
| **bastion**（推薦） | `OCI_*` 7 項 | 不需開公網端口（走 OCI 跳板） | 最佳，維持 bastion-only |
| **direct** | `VPS_SSH_KEY` + `VPS_HOST` | OCI NSG 需放行 GitHub Actions IP → :22 | 需開公網 22（違反現有安全基線） |
| **skip**（預設） | 都不設 | — | push 不再紅，保持手動部署 |

`pre-check` job 會自動選：有 `OCI_*` 且未設 `VPS_SSH_KEY` → bastion；有 `VPS_SSH_KEY`+`VPS_HOST` → direct；都無 → skip。

---

## 選項 A：bastion 模式（推薦，不開公網端口）

### A1. 取得 OCI API 憑證（本機 `C:\Users\Administrator\.oci\config` 或 OCI 控制台）

需要的欄位（從 `vps-bastion.py` 已知 region/bastion/target id）：

| Secret 名 | 來源 | 範例/說明 |
|-----------|------|----------|
| `OCI_REGION` | `vps-bastion.py` REGION | `ap-singapore-1` |
| `OCI_TENANCY_OCID` | `~/.oci/config` 的 `tenancy=` | `<TENANCY_OCID>` |
| `OCI_USER_OCID` | `~/.oci/config` 的 `user=` | `<USER_OCID>` |
| `OCI_API_FINGERPRINT` | `~/.oci/config` 的 `fingerprint=` | `xx:xx:...:xx` |
| `OCI_API_KEY` | `~/.oci/key.pem` 全文（含 `-----BEGIN/END-----`） | PEM 私鑰 |
| `OCI_BASTION_ID` | `vps-bastion.py` BASTION_ID | `<BASTION_OCID>` |
| `OCI_TARGET_RESOURCE_ID` | `vps-bastion.py` TARGET_ID（VPS instance OCID） | `<INSTANCE_OCID>` |

> 本機 `~/.oci/config` 已含 tenancy/user/fingerprint；`~/.oci/key.pem` 是 API 私鑰。從本機複製這些值到 GitHub Secrets（不要貼在聊天）。

### A2. 在 GitHub 設 7 個 `OCI_*` Secrets

路徑：repo → Settings → Secrets and variables → Actions → New repository secret
逐個新增上表 7 項。`OCI_API_KEY` 貼整個 PEM 檔內容（含首尾行，換行保留）。

### A3. 驗證

push 一個空改動（或 Actions 頁手動 Run workflow，deploy_mode 選 bastion）。
`pre-check` 應輸出 `Bastion deploy mode`，`deploy` job 會在 Actions runner 內 `oci bastion session create` → rsync → pnpm build → pm2 restart。

---

## 選項 B：direct 模式（需開公網 22，非必要不建議）

### B1. 設 Secrets

| Secret 名 | 值 |
|-----------|-----|
| `VPS_HOST` | `161.118.248.180` |
| `VPS_USER` | `root`（或留空，workflow 預設 root） |
| `VPS_SSH_KEY` | VPS 私鑰（對應 `/root/.ssh/authorized_keys` 裡的 ed25519 公鑰） |

### B2. OCI 控制台開 NSG 放行 GitHub Actions IP

GitHub Actions 出口 IP 範圍見官方文檔 `github/houses` 的 `actions` 清單（會變動，建議用 `meta` API 動態取得或用 GitHub App）。
在 OCI 控制台 → 網路 → 虛擬雲端網路 → 該 VPS 的子網 NSG → 加 Ingress 規則：
- 來源：GitHub Actions IP CIDR
- 協定：TCP，埠：22（或 8042，依 sshd 聽的端口）
- 動作：允許

> ⚠️ 開公網 22 會違反現有「公網 22 全關」安全基線。除非必要，優先用 bastion 模式。

### B3. 驗證

手動 Run workflow（deploy_mode=direct）。`deploy` job 會直連 `VPS_HOST:22` 部署。

---

## 選項 C：skip（現狀，零設定）

不設任何上述 secret。`pre-check` 輸出 `No deploy secrets configured. Skipping` → push 不再紅。
部署仍用手動：`python vps-bastion.py` 重建跳板 → 本地 `git bundle` 同步 → VPS `pnpm build` + `pm2 restart`（見 DEPLOY-REALITY.md §6）。

---

## 應用程式 Secrets（選填，設則寫入 VPS `vps/.env`）

`deploy-oracle.yml` 目前**未自動寫 .env**（避免覆蓋 VPS 既有 `.env.production`）。若未來要 CD 也管 .env，可加以下 secrets，並在 workflow 的 Deploy 步驟 un-comment 寫入段：

`GROQ_API_KEY` / `OPENROUTER_API_KEY` / `OPENROUTER_MODEL` / `GEMINI_API_KEY` / `AGNES_API` /
`NEXT_PUBLIC_SUPABASE_URL` / `NEXT_PUBLIC_SUPABASE_ANON_KEY` / `SUPABASE_SERVICE_ROLE_KEY` /
`FIREBASE_SERVICE_ACCOUNT_JSON` / `NEXT_PUBLIC_FIREBASE_PROJECT_ID` / `GATEWAY_API_KEY`

> 當前 VPS 的 `.env` 已手動配置好且在線，CD 不碰它（只同步程式碼 + build + pm2 restart）。

---

## 故障排除

- **bastion 模式 `oci` 命令找不到**：runner 已 `pip install oci-cli`，若仍失敗檢查 region/tenancy OCID 是否正確。
- **bastion session 未 ACTIVE**：OCI 配額或權限問題，檢查 `OCI_USER_OCID` 是否有 bastion 使用權限。
- **direct 模式連不上**：NSG 未放行 / `VPS_SSH_KEY` 與 authorized_keys 不匹配 / 公網 22 仍被擋。
- **部署後服務沒起**：看 Actions 日誌的 `pnpm build` / `pm2 restart` 輸出；VPS 仍可用 `ssh esggo-bastion` 手動排查。

<!-- CI trigger 2026-07-11: validate Deploy Smart AI Router fixes (#189 ocid1 placeholder + #193 pnpm cache/scoped python) -->

<!-- CI trigger 2026-07-11 (2): validate #195 pnpm/corepack + placeholder DSN exclusion -->

<!-- CI trigger 2026-07-11 (3): validate clean #198 deploy.yml fix -->

<!-- CI trigger 2026-07-11 (3): validate clean #198 deploy.yml fix -->

<!-- CI trigger 2026-07-11 (final): validate #198 pnpm/corepack + placeholder DSN fix, main clean of drafts -->

<!-- CI trigger 2026-07-11 (3): validate clean #198 deploy.yml fix -->

<!-- CI trigger 2026-07-11 (4): validate #203 pnpm-via-npm fix -->

<!-- CI trigger 2026-07-11 (5): validate #205 lint/typecheck alignment -->

<!-- CI trigger 2026-07-11 (6): validate #207 Node 22 alignment -->

<!-- CI verify 2026-07-11: confirm Deploy Smart AI Router green after #210 (lint/ts fixes) -->

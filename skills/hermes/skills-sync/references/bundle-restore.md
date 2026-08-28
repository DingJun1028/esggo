# OmniTag 同步 Bundle 還原與推送指南

> 本輪（2026-08-22）在容器內完成 `esggo` 倉庫 `OmniTag` 分支的 commit，但因容器無 GitHub 寫入憑證，無法直接 push。
> 改以 `git bundle` 封裝完整 commit，交由主機還原後推送。

## Bundle 位置
- 容器內：`/tmp/omnitag-sync.bundle`（22MB，含完整 OmniTag commit，已 `git bundle verify` 通過）
- 還原方式（主機）：
  ```powershell
  # 方式 A：直接從 bundle clone 出 OmniTag 分支
  cd C:\Project\esggo
  git fetch <bundle路徑>\omnitag-sync.bundle OmniTag:OmniTag
  git checkout OmniTag
  git push origin OmniTag

  # 方式 B：若已經在 OmniTag 分支
  git pull <bundle路徑>\omnitag-sync.bundle OmniTag
  git push origin OmniTag
  ```

## 開 PR（主機，需 gh CLI 已登入）
```powershell
gh pr create --repo DingJun1028/esggo --base main --head OmniTag `
  --title "chore(skills): 雙向同步經驗技能書至 OmniTag" `
  --body "雙向同步 Hermes 技能樹至 esggo@OmniTag，倉庫內同時維護 Hermes 原生與 OpenCode 轉換雙格式。詳見 skills/sync-manifest.json 與 skills-sync 技能。"
```

## 本次 commit 內容（OmniTag，sha 6d12ef7）
- `skills/hermes/oa-team-soul-canon/` — 靈魂核心聖典升級 + crew-oa-team.jsonc + obsidian-integration.md
- `skills/hermes/unagent/` — 新建專屬技能
- `skills/hermes/skills-sync/` — 新建雙向同步契約 + 轉換腳本 + 主機 ps1
- `skills/hermes/obsidian-hermes-agent-obsidian-plugin/` — 既有專屬技能納入
- `skills/opencode/*.md` — 上述 4 個技能的 OpenCode 轉換格式
- `sync-manifest.json` — 雙向映射清單

## 注意
- `.gitignore` 含 `/skills/`，本次以 `git add -f` 強制追蹤雙向信源。
- 容器內 git identity 設為 `OA-Team <oa-team@users.noreply.github.com>`（repo-local，不影響主機）。
- CRLF/LF 由 git 自動正規化，無礙。

#!/usr/bin/env bash
# sync-to-esggo-omnitag.sh — OA-Team 經驗技能書雙向同步 → esggo OmniTag (跨平台 CLI 版)
# 對應 Windows 版: scripts/sync-to-esggo-omnitag.ps1
#
# 前置: git + gh (github.com/cli) 已安裝且 gh auth login 完成
# 用法:
#   cd /path/to/esggo
#   bash scripts/sync-to-esggo-omnitag.sh
#
set -euo pipefail

ESGG_REPO="${ESGG_REPO:-DingJun1028/esggo}"
BRANCH="${BRANCH:-OmniTag}"
HERMES_ROOT="${HERMES_ROOT:-$HOME/.hermes/skills}"
REPO_ROOT="$(pwd)"

echo "==> 目標: $ESGG_REPO @ $BRANCH"
echo "==> Hermes 技能樹: $HERMES_ROOT"

[[ -d .git ]] || { echo "錯誤: 目前目錄不是 git 倉庫，請先 cd 到 esggo 倉庫根"; exit 1; }

git fetch origin
if git show-ref --verify --quiet "refs/heads/$BRANCH"; then
  git checkout "$BRANCH"
  git merge "origin/$BRANCH" --no-edit 2>/dev/null || true
elif git ls-remote --heads origin "$BRANCH" | grep -q "$BRANCH"; then
  git checkout -b "$BRANCH" "origin/$BRANCH"
else
  git checkout -b "$BRANCH"
fi

mkdir -p "$REPO_ROOT/skills/hermes"
# 同步 Hermes 技能樹 → skills/hermes/ (容器用 cp -r；本機用 rsync 若可用)
if command -v rsync >/dev/null 2>&1; then
  rsync -a --delete "$HERMES_ROOT/" "$REPO_ROOT/skills/hermes/"
else
  find "$REPO_ROOT/skills/hermes" -mindepth 1 -delete 2>/dev/null || true
  cp -r "$HERMES_ROOT/." "$REPO_ROOT/skills/hermes/"
fi

# 轉換為 OpenCode 格式
python3 "$HERMES_ROOT/skills-sync/scripts/hermes_to_opencode.py" \
  "$REPO_ROOT/skills/hermes" "$REPO_ROOT/skills/opencode"

# 雙向映射清單
cat > "$REPO_ROOT/sync-manifest.json" <<JSON
{
  "updated": $(date +%s),
  "branch": "$BRANCH",
  "hermes_dir": "skills/hermes",
  "opencode_dir": "skills/opencode",
  "skills": ["oa-team-soul-canon", "unagent", "skills-sync", "obsidian:hermes-agent-obsidian-plugin"]
}
JSON

# 強制納入 (倉庫 .gitignore 含 /skills/)
git add -f skills/hermes skills/opencode sync-manifest.json

if git diff --cached --quiet; then
  echo "==> 無變更，跳過提交"
  exit 0
fi

git commit -m "chore(skills): 雙向同步經驗技能書至 OmniTag (Hermes 原生 + OpenCode 雙格式)

- 升級 oa-team-soul-canon 靈魂核心聖典
- 新增 unagent 專屬技能
- 新增 skills-sync 雙向同步契約 (Hermes ↔ esggo OmniTag OpenCode)
- 補齊 crew-oa-team.jsonc 與 obsidian-integration 參考"

git push origin "$BRANCH"

# 開 PR (若非 default 分支且尚無開放 PR)
DEFAULT_BRANCH="$(gh repo view "$ESGG_REPO" --json defaultBranchRef -q .defaultBranchRef.name 2>/dev/null || echo main)"
if [[ -n "$DEFAULT_BRANCH" && "$BRANCH" != "$DEFAULT_BRANCH" ]]; then
  if ! gh pr list --repo "$ESGG_REPO" --head "$BRANCH" --state open --json number -q '.[0].number' | grep -q .; then
    gh pr create --repo "$ESGG_REPO" --base "$DEFAULT_BRANCH" --head "$BRANCH" \
      --title "chore(skills): 雙向同步經驗技能書至 OmniTag" \
      --body "雙向同步 Hermes 技能樹至 esggo@OmniTag，倉庫內同時維護 Hermes 原生與 OpenCode 轉換雙格式。詳見 skills/sync-manifest.json 與 skills-sync 技能。"
    echo "==> PR 已開立"
  else
    echo "==> PR 已存在，略過"
  fi
fi
echo "==> 完成: esggo @ $BRANCH 已推送"

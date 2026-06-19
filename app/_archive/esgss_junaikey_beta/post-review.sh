#!/usr/bin/env bash
# 用法：
# 1) 確認你已撤銷舊 token 並在本地建立新的 token（或使用 gh auth login）
# 2) 把 review.md 與 review.json 放在同一目錄
# 3) export GITHUB_TOKEN="your_new_token_here"    # 或在執行前在 shell 中設定
# 4) ./post-review.sh
#
# 注意：不要在命令行 history 直接放置 token。建議使用 env var。

set -euo pipefail

REPO="DingJun1028/esgss_junaikey_beta"
PR_NUMBER=27
API="https://api.github.com/repos/${REPO}/pulls/${PR_NUMBER}/reviews"

if [ -z "${GITHUB_TOKEN:-}" ]; then
  echo "錯誤：請先設定環境變數 GITHUB_TOKEN（不要直接把 token 貼到公用地方）"
  exit 1
fi

# 使用 review.md 當 body（將 markdown 轉為單行 JSON 字串）
BODY=$(python3 - <<'PY'
import json,sys
s=open("review.md","r",encoding="utf-8").read()
print(json.dumps(s))
PY
)

PAYLOAD="{\"body\":$BODY, \"event\":\"REQUEST_CHANGES\"}"

echo "將以 REQUEST_CHANGES 模式對 PR #${PR_NUMBER} 發出 review..."
curl -s -X POST \
  -H "Authorization: token ${GITHUB_TOKEN}" \
  -H "Accept: application/vnd.github+json" \
  -d "${PAYLOAD}" \
  "${API}" | jq .

echo "完成（回傳上面）。如遇權限錯誤，請確認 token 有 repo 權限並且 token 已旋轉。"
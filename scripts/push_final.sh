#!/bin/bash
set -euo pipefail
cd "/c/Project/esggo"
echo "🚀 Universal-Translator FINAL 提交"
git add -A
git commit -m "feat: universal-translator complete (RWD, auto-speech, SSE, deploy, tests)" 2>/dev/null || echo "No new changes to commit"
git push origin main
echo "🎉 提交到遠端完成！P10 已註冊於 artifact-registry.md"
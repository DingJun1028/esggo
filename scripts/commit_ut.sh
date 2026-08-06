#!/bin/bash
# Universal-Translator 一鍵提交腳本
# 用法: bash scripts/commit_ut.sh

set -euo pipefail
cd "$(dirname "$0")/.."

echo "🚀 Universal-Translator 一鍵提交工具"
echo ""

# 1. 檢查變更
echo "=== 1. 變更狀態 ==="
git status --short apps/universal-translator/ deploy/ Omni-Sanctuary/Index/artifact-registry.md 2>/dev/null || echo "⚠️ 請確認 git 初始化"

# 2. 新增暫存
echo ""
echo "=== 2. 新增檔案到暫存區 ==="
git add apps/universal-translator/public/studio.html \
        apps/universal-translator/public/stream.html \
        apps/universal-translator/server.mjs \
        apps/universal-translator/test_ui.mjs \
        apps/universal-translator/test_remote.mjs \
        apps/universal-translator/verify_full.mjs \
        apps/universal-translator/_verify_sh.mjs \
        deploy/verify_universal_translator.sh \
        deploy/push_and_deploy.sh \
        deploy/tunnel_translate.md \
        deploy/verify_bash.sh \
        Omni-Sanctuary/Index/artifact-registry.md

echo "✅ 完成"

# 3. 提交
echo ""
echo "=== 3. 提交代碼 ==="
git commit -m "feat: universal-translator complete platform (RWD, auto-speech, SSE, tests, deploy scripts)" 2>/dev/null && echo "✅ 提交成功" || echo "⚠️ 無新變更可提交"

# 4. 推送
echo ""
echo "=== 4. 推送遠端 ==="
git push origin main && echo "✅ 推送成功"

echo ""
echo "🎉 提交完成！"
echo ""
echo "📋 下一步：VPS 部署指令"
echo "ssh ubuntu@161.118.248.180"
echo "cd /opt/esggo && git pull origin main"
echo "bash apps/universal-translator/deploy/verify_universal_translator.sh"
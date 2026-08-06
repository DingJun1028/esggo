#!/bin/bash
# Universal-Translator 提交 + 部署腳本
# 用法: bash deploy/push_and_deploy.sh

set -euo pipefail
cd "$(dirname "$0")/.."

echo "🚀 Universal-Translator 提交與部署腳本"

# 1. 查看變更
echo "=== 1. 變更狀態 ==="
git status --short apps/universal-translator/ deploy/verify_universal_translator.sh 2>/dev/null || echo "git not found"

# 2. 提交
echo ""
echo "=== 2. 提交變更 ==="
git add apps/universal-translator/ deploy/verify_universal_translator.sh
git commit -m "feat: universal-translator RWD UI + test scripts + deploy verify"
echo "✅ 提交完成"

# 3. 推送
echo ""
echo "=== 3. 推送遠端 ==="
git push origin main
echo "✅ 推送完成"

# 4. 部署指令 (VPS 遠端執行)
echo ""
echo "=== 4. 遠端部署指令 ==="
echo "# 在 VPS 上執行下方指令："
echo "ssh ubuntu@your-vps 'cd /opt/esggo/apps/universal-translator && npm install && pm2 restart universal-translator'"
echo ""
echo "# 或手動部署腳本："
echo "bash <(curl -s https://raw.githubusercontent.com/DingJun1028/esggo/main/deploy/verify_universal_translator.sh)"

echo ""
echo "🎉 Universal-Translator 提交與部署指令完成！"
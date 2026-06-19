#!/bin/bash
# ESG儀表板品質門腳本

set -e

echo "執行品質門檢查..."

# 變數
COVERAGE_THRESHOLD=80
PERFORMANCE_BUDGET=2000  # 2秒

# 1. 程式碼品質檢查
echo "🔍 檢查程式碼品質..."

# ESLint
echo "運行 ESLint..."
npm run lint
ESLINT_EXIT=$?

if [ $ESLINT_EXIT -ne 0 ]; then
    echo "❌ ESLint 檢查失敗"
    exit 1
fi
echo "✅ ESLint 檢查通過"

# TypeScript 類型檢查
echo "運行 TypeScript 類型檢查..."
npx tsc --noEmit
TSC_EXIT=$?

if [ $TSC_EXIT -ne 0 ]; then
    echo "❌ TypeScript 類型檢查失敗"
    exit 1
fi
echo "✅ TypeScript 類型檢查通過"

# 2. 測試覆蓋率檢查
echo "🧪 檢查測試覆蓋率..."

npm run test:coverage

# 檢查覆蓋率閾值
if [ -f "coverage/coverage-summary.json" ]; then
    LINES_COVERAGE=$(jq '.total.lines.pct' coverage/coverage-summary.json)
    FUNCTIONS_COVERAGE=$(jq '.total.functions.pct' coverage/coverage-summary.json)
    BRANCHES_COVERAGE=$(jq '.total.branches.pct' coverage/coverage-summary.json)
    STATEMENTS_COVERAGE=$(jq '.total.statements.pct' coverage/coverage-summary.json)

    echo "覆蓋率報告:"
    echo "  行覆蓋率: $LINES_COVERAGE%"
    echo "  函數覆蓋率: $FUNCTIONS_COVERAGE%"
    echo "  分支覆蓋率: $BRANCHES_COVERAGE%"
    echo "  語句覆蓋率: $STATEMENTS_COVERAGE%"

    # 檢查是否達到閾值
    if (( $(echo "$LINES_COVERAGE < $COVERAGE_THRESHOLD" | bc -l) )); then
        echo "❌ 行覆蓋率未達到 $COVERAGE_THRESHOLD% 閾值"
        exit 1
    fi

    if (( $(echo "$FUNCTIONS_COVERAGE < $COVERAGE_THRESHOLD" | bc -l) )); then
        echo "❌ 函數覆蓋率未達到 $COVERAGE_THRESHOLD% 閾值"
        exit 1
    fi

    echo "✅ 測試覆蓋率檢查通過"
else
    echo "❌ 找不到覆蓋率報告文件"
    exit 1
fi

# 3. 安全性檢查
echo "🔒 執行安全性檢查..."

# 檢查是否有安全漏洞
npm audit --audit-level moderate
AUDIT_EXIT=$?

if [ $AUDIT_EXIT -ne 0 ]; then
    echo "❌ 發現安全漏洞"
    exit 1
fi
echo "✅ 安全性檢查通過"

# 4. 效能檢查
echo "⚡ 檢查應用效能..."

# 建構應用
npm run build

# 檢查 Bundle 大小
if [ -f "dist/assets/index-*.js" ]; then
    BUNDLE_SIZE=$(stat -f%z dist/assets/index-*.js 2>/dev/null || stat -c%s dist/assets/index-*.js)
    BUNDLE_SIZE_KB=$((BUNDLE_SIZE / 1024))

    echo "Bundle 大小: ${BUNDLE_SIZE_KB}KB"

    if [ $BUNDLE_SIZE_KB -gt 2048 ]; then
        echo "❌ Bundle 大小超過 2MB 限制"
        exit 1
    fi
    echo "✅ Bundle 大小檢查通過"
fi

# 5. 可訪問性檢查 (如果有啟用)
if [ "$RUN_ACCESSIBILITY_CHECK" = "true" ]; then
    echo "♿ 檢查可訪問性..."
    # 安裝 pa11y 或 axe-core 進行檢查
    npx pa11y http://localhost:3000 --reporter json > accessibility-report.json

    ACCESSIBILITY_ISSUES=$(jq '.issues | length' accessibility-report.json)

    if [ $ACCESSIBILITY_ISSUES -gt 0 ]; then
        echo "❌ 發現 $ACCESSIBILITY_ISSUES 個可訪問性問題"
        jq '.issues[] | {code: .code, message: .message}' accessibility-report.json
        exit 1
    fi
    echo "✅ 可訪問性檢查通過"
fi

# 6. 依賴檢查
echo "📦 檢查依賴項..."

# 檢查是否有過期的依賴
npm outdated || true

# 檢查是否有未使用的依賴 (可選)
if [ "$CHECK_UNUSED_DEPS" = "true" ]; then
    npx depcheck
fi

echo "✅ 依賴檢查完成"

# 7. 最終檢查總結
echo ""
echo "🎉 所有品質門檢查通過！"
echo ""
echo "檢查摘要:"
echo "  ✅ ESLint 檢查"
echo "  ✅ TypeScript 類型檢查"
echo "  ✅ 測試覆蓋率 ($COVERAGE_THRESHOLD%+)"
echo "  ✅ 安全性審計"
echo "  ✅ Bundle 大小檢查"
echo "  ✅ 依賴檢查"

# 可選：發送通知
if [ -n "$SLACK_WEBHOOK_URL" ]; then
    curl -X POST -H 'Content-type: application/json' \
        --data "{\"text\":\"✅ ESG儀表板品質門檢查通過\\n分支: $GITHUB_REF\\n提交: $GITHUB_SHA\"}" \
        "$SLACK_WEBHOOK_URL"
fi
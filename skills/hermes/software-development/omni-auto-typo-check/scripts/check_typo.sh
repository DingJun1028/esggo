#!/bin/bash
# 檢查檔案中是否包含錯別字「萮能」
# 用法：./check_typo.sh <檔案路徑>
# 說明：會排除註解/備註區塊中的引用文字
# 相關參考：references/git-encoding-fix.md

if [ -z "$1" ]; then
    echo "請提供檔案路徑"
    echo "用法：$0 <檔案路徑>"
    exit 1
fi

FILE="$1"

if [ ! -f "$FILE" ]; then
    echo "檔案不存在：$FILE"
    exit 1
fi

# 搜索錯別字「萮能」（排除行首以「*」開頭的備註行）
ERRORS=$(grep "萮能" "$FILE" | grep -v "^\*.*萮能" | grep -v "備註.*萮能")

if [ -n "$ERRORS" ]; then
    echo "⚠️  發現錯別字「萮能」"
    echo "應為：萬能"
    echo "$ERRORS"
    exit 1
else
    echo "✓  未發現錯別字，檔案 clean"
    exit 0
fi
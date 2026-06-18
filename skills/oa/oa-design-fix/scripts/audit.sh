#!/bin/bash
# ESGGO Design Audit Script
# Scans all .tsx files for dark theme violations

PROJECT_DIR="C:\Project\esggo\esggo"
cd "$PROJECT_DIR"

echo "🔍 ESGGO Design Audit — Dark Theme Violation Scan"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

VIOLATIONS=0

# Patterns to check
PATTERNS=(
    "bg-white/\[0\."
    "bg-slate-9"
    "bg-gray-9"
    "bg-black"
    "backdrop-blur"
    "border-white/"
    "shadow-\[0_.*rgba(0,0,0"
    "dark:"
    "text-white"
    "bg-gradient-to-b from-white"
    "bg-cyan-500/"
    "bg-emerald-500/"
    "text-cyan-400"
    "text-emerald-400"
    "text-rose-400"
    "bg-slate-800"
    "border-slate-800"
    "border-slate-700"
)

for pattern in "${PATTERNS[@]}"; do
    MATCHES=$(grep -rn "$pattern" app/ components/ --include="*.tsx" 2>/dev/null || true)
    if [ -n "$MATCHES" ]; then
        echo ""
        echo "⚠️  Pattern: $pattern"
        echo "$MATCHES" | head -5
        COUNT=$(echo "$MATCHES" | wc -l)
        VIOLATIONS=$((VIOLATIONS + COUNT))
    fi
done

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
if [ "$VIOLATIONS" -eq 0 ]; then
    echo "✅ No dark theme violations found!"
else
    echo "❌ Total violations: $VIOLATIONS"
    echo "   Run 'oa-design-fix' to auto-repair"
fi
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

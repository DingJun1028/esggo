#!/bin/bash
# ESGGO Hub plugin verification & troubleshooting script
# Run this after editing plugin.js or plugin_api.py to verify everything loads correctly.
# Usage:
#   1. hermes update --no-backup --yes   # restart gateway to mount Python backend
#   2. bash scripts/verify-and-troubleshoot.sh

set -e

echo "=== ESGGO Hub Verification ==="

# Step 1: Check plugins.enabled
echo "[1/6] Checking plugins.enabled..."
ENABLED=$(hermes config get plugins.enabled 2>/dev/null || echo "[]")
if echo "$ENABLED" | grep -q "esggo-hub"; then
    echo "✓ esggo-hub is in plugins.enabled: $ENABLED"
else
    echo "✗ esggo-hub NOT in plugins.enabled"
    echo "  Run: hermes config set plugins.enabled '[\"esggo-hub\"]'"
    exit 1
fi

# Step 2: Check plugin.js syntax
echo "[2/6] Checking plugin.js syntax..."
PLUGIN_PATH="${HERMES_HOME:-$HOME/AppData/Local/hermes}/desktop-plugins/esggo-hub/plugin.js"
if node --check "$PLUGIN_PATH" 2>/dev/null; then
    echo "✓ plugin.js syntax OK"
else
    echo "✗ plugin.js syntax error"
    exit 1
fi

# Step 3: Test Python backend route (requires gateway running)
echo "[3/6] Testing backend /status endpoint..."
if command -v curl &>/dev/null; then
    RESPONSE=$(curl -s --connect-timeout 3 http://localhost:8786/api/plugins/esggo-hub/status 2>/dev/null || echo "FAILED")
    if echo "$RESPONSE" | grep -q '"ok"'; then
        echo "✓ Backend /status responding"
        echo "  $RESPONSE" | python3 -m json.tool 2>/dev/null || echo "  $RESPONSE"
    else
        echo "✗ Backend /status not responding (gateway may not be restarted)"
        echo "  Run: hermes update --no-backup --yes"
    fi
else
    echo "⚠ curl not available, skipping HTTP test"
fi

# Step 4: Check errors.log for plugin load failures
echo "[4/6] Checking errors.log for plugin errors..."
LOG_PATH="${HERMES_HOME:-$HOME/AppData/Local/hermes}/logs/errors.log"
if [ -f "$LOG_PATH" ]; then
    ERRORS=$(grep -i "esggo-hub" "$LOG_PATH" | tail -5 || true)
    if [ -n "$ERRORS" ]; then
        echo "✗ Errors found in errors.log:"
        echo "$ERRORS"
    else
        echo "✓ No esggo-hub errors in errors.log"
    fi
else
    echo "⚠ errors.log not found (gateway may not have started)"
fi

# Step 5: Verify Python backend imports in venv
echo "[5/6] Verifying Python backend module..."
VENV_PYTHON="${HERMES_HOME:-$HOME/AppData/Local/hermes}/hermes-agent/venv/Scripts/python.exe"
if [ -f "$VENV_PYTHON" ]; then
    API_PATH="${HERMES_HOME:-$HOME/AppData/Local/hermes}/plugins/esggo-hub/dashboard/plugin_api.py"
    if "$VENV_PYTHON" -c "import importlib.util; spec=importlib.util.spec_from_file_location('api', '$API_PATH'); m=importlib.util.module_from_spec(spec); spec.loader.exec_module(m); print('OK')" 2>/dev/null; then
        echo "✓ Python backend imports correctly"
    else
        echo "✗ Python backend import failed"
    fi
else
    echo "⚠ venv python not found at $VENV_PYTHON"
fi

# Step 6: Summary
echo ""
echo "=== Summary ==="
echo "Next steps:"
echo "  1. In Hermes desktop app: ⌘K → 'Reload desktop plugins'"
echo "  2. Verify right-hand pane shows 'branch: main' etc."
echo "  3. Check ⌘K palette for 'Open ESGGO Hub'"
echo "  4. Press mod+shift+r to test refresh keybind"
echo ""
echo "If issues persist, tail the logs:"
echo "  tail -f ${HERMES_HOME:-$HOME/AppData/Local/hermes}/logs/errors.log"
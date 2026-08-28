#!/bin/bash
# verify-service-account.sh
# Verify 1Password service account is properly configured

set -e

# Check if OP_SERVICE_ACCOUNT_TOKEN is set
if [ -z "$OP_SERVICE_ACCOUNT_TOKEN" ]; then
    echo "ERROR: OP_SERVICE_ACCOUNT_TOKEN not set"
    echo "Run: export OP_SERVICE_ACCOUNT_TOKEN=<your-token>"
    exit 1
fi

# Check CLI version
cli_version=$(op --version 2>/dev/null || echo "not installed")
echo "CLI version: $cli_version"

# Verify version >= 2.18.0
if [ "$cli_version" != "not installed" ]; then
    required="2.18.0"
    if [ "$(printf '%s\n' "$required" "$cli_version" | sort -V | head -n1)" != "$required" ]; then
        echo "WARNING: CLI version $cli_version may be older than required $required"
    fi
fi

# Verify authentication
echo "Verifying service account..."
if op user get --me 2>/dev/null | grep -q "SERVICE_ACCOUNT"; then
    echo "✓ Service account authenticated"
    op user get --me | grep -E "ID:|Name:|Email:|State:"
else
    echo "ERROR: Not authenticated as service account"
    exit 1
fi

# Check rate limits
echo ""
echo "Rate limit status:"
op service-account ratelimit 2>/dev/null || echo "Unable to fetch rate limits"

echo ""
echo "✓ Service account setup verified successfully"
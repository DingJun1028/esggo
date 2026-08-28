# 1Password Service Account Template

## Setup Script
```bash
#!/bin/bash
# setup-service-account.sh

# Set service account token
export OP_SERVICE_ACCOUNT_TOKEN="${OP_SERVICE_ACCOUNT_TOKEN:-}"

if [ -z "$OP_SERVICE_ACCOUNT_TOKEN" ]; then
    echo "Error: OP_SERVICE_ACCOUNT_TOKEN not set"
    exit 1
fi

# Verify authentication
op user get --me
```

## Common Operations Template
```bash
# Read a secret
op read "op://{{vault}}/{{item}}/{{field}}"

# Read with attribute
op read "op://{{vault}}/{{item}}/{{field}}?attribute={{attribute}}"

# Run command with secret
op run --vault "{{vault}}" -- {{command}}

# Create item from template
op item create --vault "{{vault}}" --category "LOGIN" \
    --title "{{title}}" \
    --username "{{username}}" \
    --password "{{password}}"
```

## Item Creation Examples
```bash
# Login item
op item create --vault "Production" --category LOGIN \
    --title "Database" \
    --username "admin" \
    --password "secret123"

# API key item
op item create --vault "Production" --category "API Key" \
    --title "AWS" \
    --vault "Production" \
    --field "AWS Access Key ID"="{id}" \
    --field "AWS Secret Access Key"="{secret}"
```

## Rate Limit Check
```bash
op service-account ratelimit
```
# OmniAgent Secrets Management Architecture
# All credentials are encrypted and managed internally by OmniAgent

## Tiered Secret Management

### Tier 1: Infrastructure (Local/OCI/AWS)
- OCI Config: ~/.oci/config
- AWS Config: ~/.aws/credentials  
- rclone config: ~/.config/rclone/rclone.conf

### Tier 2: Application Credentials
- Telegram: Bot Token + Chat ID
- Supabase: API Keys (auto-rotated)
- Redis: Connection string

### Tier 3: Deployment Credentials
- GitHub PAT: CI/CD deployment
- SSH Private Key: VPS deployment
- certbot email: SSL renewal

## OmniAgent Secret Rotation Policy

| Secret Type | Rotation | Backup Location |
|-------------|----------|-----------------|
| SSH Keys | 90 days | TPM/Vault |
| API Keys | 30 days | Encrypted backup |
| SSL Certs | 60 days before expiry | Vault |
| Database | Never (manual) | /backup/encrypted |

## Authorization Flow

```
OmniAgent -> Vault API -> Get encrypted secret
OmniAgent -> Decrypt with master key (env VGS-AGENT-KEY)
OmniAgent -> Apply to target service
```

## Security Controls

1. All secrets encrypted at rest (AES-256)
2. Master key rotated weekly via cron
3. Audit log: /var/log/omniagent-secrets.log
4. Emergency revocation: kill -USR1 omniagent-pid

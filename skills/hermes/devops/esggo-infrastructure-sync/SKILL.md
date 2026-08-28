---
name: esggo-infrastructure-sync
description: Use when syncing secrets and routing for ESGGO platform.
---

# ESGGO Infrastructure Sync & Secret Management

This skill governs the synchronization of sensitive credentials and network routing configurations across the ESGGO distributed environment (Local $\rightarrow$ GCP $\rightarrow$ VPS).

## 🛠️ Secret Sync Workflow (5T Compliant)

When updating environment variables or API keys, follow this sequence to ensure **Traceability** and **Trustworthiness**:

1. **Local Sealing**: Store raw keys in the local Secret Vault (`C:\Users\dingj\secret-vault\`).
2. **GCP Projection**: Project secrets into GCP Secret Manager for cloud-native services.
   - Use: `gcloud secrets create [NAME] --project=esg-sunshine --data-file=- <<< "[VALUE]"`
3. **VPS Distribution**: Sync secrets to the production VPS (`161.118.248.180`).
- Prefer writing to `.env.local` or utilizing a Python-based `re.sub` script via SSH to avoid shell escaping issues with complex keys (e.g., Firebase Private Keys).
4. **Verification**: Perform a connectivity check (e.g., `curl` to API endpoint) before marking a key as `Trustworthy`.

## 🌐 Network Routing & Tunneling

### Cloudflare Tunnel Integration
The platform uses Cloudflare Tunnels for secure exposure without opening public ports.
- **Tunnel ID**: `ede2e41e-0d8a-4d8f-8653-7c3ec760bad6`
- **DNS Route Command**: 
  `ssh root@161.118.248.180 "TID=[ID] && cloudflared tunnel route dns \$TID [DOMAIN]"`
- **Conflict Resolution**: If DNS records conflict, check existing records via the Cloudflare API or Dashboard before attempting to force a route.

## ⚠️ Pitfalls & Lessons Learned

- **Complex Key Escaping**: Writing `FIREBASE_PRIVATE_KEY` via raw bash `echo` often fails due to newline characters. **Always** use a Python script or a heredoc (`<< 'EOF'`) to preserve formatting.
- **DNS Conflicts**: Cloudflare Tunnel routing will fail if a CNAME or A record already exists for the target domain.
- **API Validation**: A `404` response from a root API endpoint (e.g., NoCodeBackend) typically indicates server connectivity is OK, but the specific path is undefined.

## 📂 Support Files
- `references/vault-structure.md`: Mapping of Local Vault keys to GCP Secret names.
- `templates/sync_env.py`: Python script for safe SSH-based `.env` updates.

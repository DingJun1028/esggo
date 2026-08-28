# OCI SSH Metadata Dead-End Reference

## Immutability Error

```text
ServiceError:
{
  "code": "InvalidParameter",
  "message": "The 'ssh_authorized_keys' metadata field cannot be removed and must be provided with the already existing value.",
  "operation_name": "update_instance",
  "request_endpoint": "PUT https://iaas.ap-singapore-1.oraclecloud.com/.../instances/<instance-id>",
  "status": 400
}
```

Variant after supplying existing + new key:

```text
ServiceError:
{
  "code": "InvalidParameter",
  "message": "The 'ssh_authorized_keys' metadata field cannot be updated and must be provided with the already existing value.",
  "status": 400
}
```

## Failing Access Paths

```text
# SSH
ssh -i scripts/oracle_vps_ssh_key.pem ubuntu@161.118.248.180
Permission denied (publickey)

# Execute Command
command: whoami
status: ACCEPTED
result: never completes
```

## Recovery Sequence

1. Query existing metadata:
```bash
oci compute instance get \
  --instance-id ocid1.instance.oc1.ap-singapore-1.anzwsljrkl3rykychf7ossd6gottx3znbovjkns6atqabgh5ir2wxm3ke47a \
  --query 'data.metadata' \
  --output json
```

2. Terminate instance without deleting boot volume.

3. Launch new instance from boot volume and inject the new SSH public key during creation.

## Lessons

- CLI documentation suggesting "Console Connection / Cloud Shell connection" may still open a Cloud Shell session even when embed or native serial console is unavailable.
- ARM64 images may behave differently around supported metadata keys; prefer the tested `ssh_authorized_keys` JSON path when updating, and omit unsupported fields.

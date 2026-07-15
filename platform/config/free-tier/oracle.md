# Oracle Cloud Always Free — esggo 接線說明

| 資源 | 免費額度 | 用於 esggo | 路徑/接線 |
|---|---|---|---|
| ARM Ampere A1 | 2 OCPU / 12GB | VPS 主機 | SSH 161.118.248.180 |
| Block Vol | 200GB | 系統/.next | /var/www/esggo |
| Object Storage | 20GB | 加密備份桶 | OCI CLI + policy |
| Autonomous DB | 2x 20GB | OMNI_DB 備用 | ADB wallet (待接) |
| Monitoring | 5/10億點 | CPU/網路告警 | 待整合 |
| Notification | 3000 封/月 | CD/系統失敗通知 | 待整合 |
| Bastion | 免費 | 跳板 | 待整合 |

Env/金鑰：
- `OCI_TENANCY_OCID`
- `OCI_USER_OCID`
- `OCI_FINGERPRINT`
- `OCI_PRIVATE_KEY_PATH`
- `OCI_COMPARTMENT_ID`
- `OCI_VAULT_SECRET_OCID`

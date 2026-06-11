---
uuid: REQ-TEMPLATE-001-AUTH
version: 1.0.0
timestamp: 2026-06-08T15:00:00Z
evidence: "src/server/services/auth.service.ts"
category: "02-DEV"
sequence: 001
tags: ["認證", "API", "IAM"]
---

# 🔐 **02-DEV-REQ-001-AUTH: 使用者登入與 JWT 生成**

## 需求描述
提供安全的三步驗證流程：
1. Email 驗證 (Truth)
2. Password 哈希 (Soft)
3. JWT 簽名 (Trust)

## 5T 對應表
| 5T 元素 | 實作方式 |
|--------|----------|
| Truth  | 完整驗證 Email 來源 |
| Goodness | 參考 API 文件 `docs/AUTH_SPEC.md` |
| Beauty | 簡潔的 API 設計與錯誤回傳 |
| Trust  | HMAC‑SHA256 簽名 JWT |
| Transfer | JWT payload 包含 scope 和 expiration |

## 5T 依賴組件
- **IAM Policy**：`01-GOV-ZKP-001`（零知識驗證）  
- **OAuth2**: `00-SYS-003-SSO`（單點登錄）
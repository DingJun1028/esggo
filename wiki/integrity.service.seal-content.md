# IntegrityService.sealContent

> **簡述 (Brief Description)**: Computes a SHA256 hash for given content to create a cryptographic seal.

---

## 概述 (Overview)
This core service method is a fundamental building block for ensuring data integrity within the ESGGO system. It takes any string content, computes its SHA256 hash, and returns this hash along with a timestamp. This function is a direct implementation of the "Hash Lock" mechanism, central to the `信 (Trust)` protocol, marking data as cryptographically secured and effectively immutable at a specific point in time.

---

## 詳細資訊 (Details)

### 類型 (Type)
`Service Method`

### 模組/路由 (Module/Route)
`IntegrityService`

### 來源檔案 (Source File)
`src/server/services/integrity.service.ts`

---

### 輸入/參數 (Input/Parameters)

| 參數名稱 (Parameter Name) | 類型 (Type) | 描述 (Description) | 必填 (Required) |
|---|---|---|---|
| `content` | `string` | The string content for which to compute the cryptographic hash. | Yes |

---

### 輸出/回傳值 (Output/Return Value)
Returns an object containing the computed SHA256 hash and the timestamp of computation.

```typescript
{
  hash: string; // The computed SHA256 hash of the content.
  timestamp: Date; // The timestamp when the hash was computed.
}
```

---

## 相關概念 (Related Concepts)
*   [5T Protocol: `信 (Trust)`](../GEMINI.md#5t-協議門：數據治理矩陣-the-5t-protocol)
*   `evidence.create` (tRPC mutation that uses this service method for `auto_seal`)
*   `omni vault seal` (CLI command that indirectly relies on similar hashing logic)
*   `computeSHA256` (shared utility)

---

## 使用範例 (Usage Example)

### Service Layer Call
```typescript
import { integrityService } from '@/src/server/services/integrity.service';

async function generateContentSeal(reportContent: string) {
  try {
    const { hash, timestamp } = await integrityService.sealContent(reportContent);
    console.log("Content sealed:");
    console.log("  Hash:", hash);
    console.log("  Timestamp:", timestamp);
    return hash;
  } catch (error) {
    console.error("Failed to seal content:", error);
    throw error;
  }
}

// Example usage:
generateContentSeal("This is the ESG report for Q2 2026.");
```

---

## 備註 (Notes)
This method is used internally by various services and API endpoints to apply cryptographic integrity to data, fulfilling a core requirement of the 5T Protocol. The `computeSHA256` utility ensures a consistent hashing algorithm across the system.

---
*(Auto-generated on 2026-05-31. Last updated by OmniAgent.)*

# evidence.create

> **簡述 (Brief Description)**: Creates a new evidence record with optional auto-sealing.

---

## 概述 (Overview)
This tRPC mutation is responsible for creating a new evidence entry in the system. It leverages the `EvidenceService` to handle the core logic, including base validation and the option to automatically compute a hash-lock for the evidence content, aligning with the `真 (Truth)` and `信 (Trust)` aspects of the 5T Protocol.

---

## 詳細資訊 (Details)

### 類型 (Type)
`tRPC Mutation`

### 模組/路由 (Module/Route)
`evidence.router.ts`

### 來源檔案 (Source File)
`src/server/trpc/routers/evidence.router.ts`

---

### 輸入/參數 (Input/Parameters)
Input is validated against `CreateEvidenceDTOSchema`.

| 參數名稱 (Parameter Name) | 類型 (Type) | 描述 (Description) | 必填 (Required) |
|---|---|---|---|
| `content` | `string` | The main content of the evidence. | Yes |
| `tag` | `string` | A descriptive tag for the evidence (e.g., "GHG Emission Report"). | Yes |
| `auto_seal` | `boolean` | If true, automatically computes SHA256 hash for content and applies a hash-lock. | No |

---

### 輸出/回傳值 (Output/Return Value)
Returns the newly created `Evidence` object.

```typescript
interface Evidence {
  uuid: string;
  version: number;
  timestamp: string;
  source_origin: {
    system_id: string;
    user_id?: string;
    process_id?: string;
    context?: Record<string, any>;
  };
  hash_lock: string;
  verifiability_metadata?: {
    standard?: string;
    algorithm?: string;
    proof_link?: string;
  };
  lifecycle_events?: Array<{
    event_type: string;
    timestamp: string;
    actor: string;
    details?: Record<string, any>;
  }>;
  id: string; // Alias for uuid
  user_id: string;
  content: string;
  content_hash: string; // The SHA256 hash of the content if auto_seal was true
  status: 'PENDING' | 'VERIFIED' | 'ARCHIVED'; // e.g., PENDING, VERIFIED, ARCHIVED
  tag: string;
}
```

---

## 相關概念 (Related Concepts)
*   [5T Protocol: `真 (Truth)`, `信 (Trust)`](../GEMINI.md#5t-協議門：數據治理矩陣-the-5t-protocol)
*   `IntegrityService.sealContent`
*   `EvidenceService.createEvidence`
*   `CreateEvidenceDTOSchema` (shared type)

---

## 使用範例 (Usage Example)

### Frontend Call (tRPC)
```typescript
import { trpc } from '@/src/utils/trpc'; // Assuming trpc client is set up

async function createNewEvidence() {
  try {
    const newEvidence = await trpc.evidence.create.mutate({
      content: "Annual report for Q1 2026 GHG emissions.",
      tag: "GHG-Report-Q1-2026",
      auto_seal: true,
    });
    console.log("Evidence created:", newEvidence);
  } catch (error) {
    console.error("Failed to create evidence:", error);
  }
}

createNewEvidence();
```

---

## 備註 (Notes)
The `userId` is obtained from the backend context, not directly passed in the input DTO. The `auto_seal` functionality ensures immediate cryptographic hashing upon creation.

---
*(Auto-generated on 2026-05-31. Last updated by OmniAgent.)*

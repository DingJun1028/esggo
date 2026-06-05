---
uuid: "9dddd362-5d12-4c23-8451-6181c00aa649"
version: "1.0.0"
timestamp: "2026-06-04T10:36:12.382Z"
evidence: "wiki\evidence.create.md"
---
# evidence.create

> **簡述 (Brief Description)**: Creates a new evidence record with optional auto-sealing.

---

## 邏輯上下文 (Logical Context)

本 mutation 處於 **ESGGO 5T 協議門** 的起點 — **`真 (Truth)` + `信 (Trust)`**：

```
evidence.create → [storage] → integrity.sealContent (optional) → 5T 驗算完成
     (T1 溯源)          (T2 透明)         (T4 哈希鎖定)              (T5 可信)
```

| 上下文物件 | 角色定位 | 關聯文件 |
| :--- | :--- | :--- |
| `IntegrityService.sealContent` | 同層：計算 SHA-256 hash lock | [integrity.service.seal-content.md](./integrity.service.seal-content.md) |
| `omni vault seal` | 下游：ZKP 深度封印 | [cli.vault.seal.md](./cli.vault.seal.md) |
| `EvidenceService.createEvidence` | 服務層：業務協調 | `src/server/services/evidence.service.ts` |
| `UCCService.packageEvidence` | 延伸：封裝為 UCC 智庫包 | `src/server/services/ucc.service.ts` |

> **原則重join**: 2026-05-31 最佳實踐重構 — `auto_seal` 路徑已對齊 `computeSHA256` 共享工具，確保全域雜湊算法一致性。

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

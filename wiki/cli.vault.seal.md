# omni vault seal <id>

> **簡述 (Brief Description)**: Seals an evidence file cryptographically using ZKP and SHA-256.

---

## 概述 (Overview)
This CLI command triggers the Zero-Knowledge Proof (ZKP) sealing process for a specified evidence ID. It computes a SHA-256 hash of the evidence, simulating a ZKP generation, and updates its status to 'verified' in the vault. This directly enforces the `信 (Trust)` aspect of the 5T Protocol by ensuring cryptographic immutability. It supports a Supabase-backed vault and includes a fallback simulation mode for NCBDB.

---

## 詳細資訊 (Details)

### 類型 (Type)
`CLI Command`

### 模組/路由 (Module/Route)
`vault` subcommand of `omni` CLI

### 來源檔案 (Source File)
`cli/omni.mjs`

---

### 輸入/參數 (Input/Parameters)

| 參數名稱 (Parameter Name) | 類型 (Type) | 描述 (Description) | 必填 (Required) |
|---|---|---|---|
| `id` | `string` | The unique identifier (UUID) of the evidence file to be sealed. | Yes |

---

### 輸出/回傳值 (Output/Return Value)
Prints console messages indicating the progress and outcome of the sealing process.
On success, it displays the Document ID, Status (VERIFIED), and ZKP Hash.

```
[S] Initiating Zero-Knowledge Proof sealing for ID: <id>...
[v] Cryptographic Seal Applied Successfully!
----------------------------------
Document ID:  <id>
Status:       VERIFIED
ZKP Hash:     <sha256_hash>
----------------------------------
```
In NCBDB Fallback Mode, it also indicates `Bridge: NCBDB Active`.

---

## 相關概念 (Related Concepts)
*   [5T Protocol: `信 (Trust)`](../GEMINI.md#5t-協議門：數據治理矩陣-the-5t-protocol)
*   `omnispace.sealDocument` (tRPC mutation that calls this CLI command)
*   `IntegrityService.sealContent`
*   ZKP (Zero-Knowledge Proof)
*   Supabase, NCBDB

---

## 使用範例 (Usage Example)

### CLI Execution
```bash
omni vault seal 123e4567-e89b-12d3-a456-426614174000
```

---

## 備註 (Notes)
This command integrates with Supabase for persistent storage and status updates. If Supabase environment variables are not set, it operates in a simulation mode that mimics interaction with an NCBDB bridge. The actual ZKP generation is simulated within the CLI for demonstration purposes.

---
*(Auto-generated on 2026-05-31. Last updated by OmniAgent.)*

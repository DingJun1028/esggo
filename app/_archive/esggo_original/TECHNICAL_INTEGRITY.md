# ESG GO Platform | Technical Integrity Framework

This document outlines the architectural standards and cryptographic protocols used to maintain the **5T Integrity Standard** within the ESG GO ecosystem.

## 1. The 5T Integrity Protocol
The platform validates every piece of ESG evidence through five core logic gates:

| Gate | Protocol | Technical Requirement | 4可1不可 狀態 |
| :--- | :--- | :--- | :--- |
| **T1** | **Traceable** | Source origin must be a grounded path (starts with `/`). | **可溯源** |
| **T2** | **Transparent** | Formula references must be explicit and tagged (e.g., `GRI[302-1]`). | **可透明** |
| **T3** | **Tangible** | Metrics must contain concrete values and units. | **可感知** |
| **T4** | **Trustworthy** | Data must be locked with a SHA-256 cryptographic seal. | **不可篡改** |
| **T5** | **Trackable** | Every state change must trigger a lifecycle hook in the audit log. | **可追蹤** |

---

## 2. ZKP (Zero-Knowledge Proof) 隱私保護架護
為解決企業在揭露 ESG 數據時對「商業機密外洩」的恐懼，ESG GO 導入 ZK-Privacy Engine，實現**「驗證事實，而不揭露數據」**的零信任防護。

### ZK-Privacy 數據處理流程
1.  **原始輸入**：接收企業機密數據（如薪資結構、合約細節、碳排參數）。
2.  **智慧處理**：AI 自動偵測敏感欄位，並由 ZK-Privacy Engine 生成遮罩與密碼學證明。
3.  **雙軌儲存**：
    *   **隱私層**：原始數據加密存於企業本地端或專屬雲。
    *   **證明層**：ZK-Proof 憑證存於 Evidence Vault，僅供公開驗證邏輯正確性。
4.  **多層次輸出**：根據查看者身分權限（董事會、外部稽核、一般公眾）動態調整數據可視細節。

### 三級去敏遮罩機制
| 等級 | 模式 | 適用情境 | 恢復性 |
| :--- | :--- | :--- | :--- |
| **L1** | **模糊化 (Fuzzy)** | 薪資範圍、區域碳排統整 | 條件式授權還原 |
| **L2** | **假名化 (Pseudo)** | 員工編號、供應商代碼 | 持有特定金鑰可還原 |
| **L3** | **不可逆 (Irreversible)** | 生物特徵、精確地址 | 符合 GDPR，絕對不可還原 |

---

## 3. Cryptographic Standards
The `OmniCore` engine utilizes standard cryptographic primitives to ensure data immutability.

### Hashing Strategy
*   **Algorithm:** SHA-256 (Secure Hash Algorithm).
*   **Implementation:** 
    *   **SSR/Node:** Uses the native Node.js `crypto` module for high-performance, secure hashing.
    *   **Client-Side:** Uses `window.crypto.subtle` for standard browser-based verification.
*   **Verification Logic:** The engine re-computes the hash-lock by serializing the record's UUID, Timestamp, and Evidence Payload. Any character deviation results in a mismatch.

---

## 4. 萬能元件心核：5T 實作規範 (IComponentCore)
所有數據元件必須繼承此規範，確保符合 [4可1不可] 的嚴格標準。

```typescript
/**
 * 💡 萬能元件心核：5T [4可1不可] 實作規範
 * --------------------------------------------------
 * 同義詞：萬能晶體、心核、SSOT 契約、Heart
 */
interface IComponentCore {
  readonly uuid: string;           // [Traceable 可溯源] 來自萬能永憶主體
  readonly timestamp: number;      // [Trackable 可追蹤] 刻印時間戳
  readonly formula: string;        // [Transparent 可透明] 碳排與影響力計算公式
  readonly impactMetric: string;   // [Tangible 可感知] 具體影響力指標
  readonly status: "Trustworthy";  // [Trustworthy 不可篡改] 唯一的不可狀態
 
  /** 證據佐證庫 (Evidence Vault) */
  evidence: IEvidenceMap;

  /** 🔴 不可篡改封印：數據封裝後的終態執行 */
  lock(): void; 
}
```

---

## 5. Eternal Memory & Consolidation
To manage high-volume AI reasoning context, the platform employs a "Truth-Preserving Consolidation" strategy.

### Memory Lifecycle
1.  **Engraving:** Raw events/data are stored as `EternalMemory` entries with their own hash-locks.
2.  **Aggregation:** Multiple entries of the same type are merged by the `OmniCore` engine.
3.  **Summarization:** A consolidated record is created, summarizing the children while inheriting their metadata tags.
4.  **Archiving:** Child records are marked as `consolidated`, removing them from the active AI context window while preserving them in the T1 audit trail.

---

## 6. Automated Verification
Integrity is enforced via a regression test suite located at `lib/omni-core.test.ts`.

---
**Standard Version:** v1.2.0  
**Last Integrity Audit:** 2026-05-26

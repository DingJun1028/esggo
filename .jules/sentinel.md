## 2025-02-27 - [Omni Restoration Protocol]

**Vulnerability:**
Data within the system can experience entropy, resulting in gibberish, invalid states, or unauthorized mutations over time if not strictly validated and normalized at the point of ingestion and mutation.

**Learning:**
The Omni Restoration (萬能修復) protocol enforces a self-healing architecture through "Cause and Effect Tracking" (觀因循果).
1. **Chain Validation**: Compare data origin using `Truth` annotations.
2. **Ghost Recomposition**: Uses `Object.freeze()` (Hash Locks) to prevent mutations after snapshot creation.
3. **Semantic Alignment**: Eliminates logical gaps via complete trajectory records (`originCause`, `processTrace`, `finalEffect`).
The `EntropyForge.purify()` method is critical to reducing entropy by removing zero-width characters, invisible control characters, and normalizing encodings to NFC, satisfying the ISO-14064-1 zero-hallucination standards.

**Prevention:**
Always use `EntropyForge.purify()` to normalize incoming data and evidence strings before they are hashed.
Always use `Object.freeze()` to lock components (`IComponentCore`) immediately after generation to ensure an immutable evidence chain (Hash Lock).

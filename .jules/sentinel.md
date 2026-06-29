## 2024-05-30 - Hash Locks and Immutable State

**Vulnerability:** Core data objects (like `IComponentCore`, `OmniNote`, `OmniTask`) were mutable, which violates the "Omni Restoration" protocol's Hash Lock requirement for snapshot rollbacks and reliable auditing.

**Learning:** When strict data traceability and immutability (like ISO-14064-1 compliance) are required, returning mutable objects from factory functions makes the state unpredictable. Also, raw string data from various sources can contain invisible characters or malformed encodings, causing hashing mismatches.

**Prevention:** Use `Object.freeze()` on returned objects to enforce Hash Locks. Use `EntropyForge.purify()` on raw string data before hashing or storing to normalize encodings and remove zero-width characters, ensuring consistent hashing.

# ADR-004: Adopting Memory Principle: Skill-Fragmented Knowledge for Gemma Skills

## Status:
Accepted

## Context:
The ESGGO system aims for high integrity, traceability, and reproducibility, especially concerning AI-driven functionalities like Gemma skills. Traditional AI agent architectures often rely on persistent, stateful memory which can lead to "memory pollution," non-reproducible outputs, and increased debugging complexity. To align with the 5T Protocol's principles of "Truth" and "Trust," a clear principle for memory management within Gemma skills is required.

## Decision:
Gemma skills within the ESGGO project will adhere to the "Memory Principle: Skill-Fragmented Knowledge." This principle mandates that skills operate largely without persistent, internal state between invocations. All necessary context or "memory" for an action must either be:
1.  **Provided explicitly as input** for each invocation (e.g., via an `OmniCoreContext` object).
2.  **Encapsulated directly within the skill's logic** (e.g., hardcoded standards, internal lookup tables, embedded models).

## Consequences:
*   **Positive:**
    *   **Statelessness:** Reduces side effects and unexpected behavior, making skills more predictable.
    *   **Reproducibility:** The same inputs will consistently yield the same outputs, crucial for auditability in ESG reporting.
    *   **Modularity & Testability:** Skills become "pure functions," easier to test, debug, and reuse across different contexts.
    *   **Reduced "Memory Pollution":** Prevents unintentional carrying over of state from previous interactions.
    *   **Aligns with 5T Protocol:** Directly supports "Truth (Traceable)" and "Trust (Trustworthy)" by making all contextual dependencies explicit.
*   **Negative:**
    *   **"Input Overload" Risk:** If context objects become too large, function signatures can be verbose. (Mitigated by using structured context objects).
    *   **Performance for Long-Running Tasks:** Pure statelessness might require re-fetching/re-calculating context for each step in a long chain. (Mitigation: use optimized context injection, or consider "snapshotting" mechanisms for external long-term memory, which skills can read as "explicit input").
*   **Neutral:**
    *   Requires careful design of `OmniCoreContext` to balance comprehensiveness and conciseness.

## Options Considered:
*   **Traditional Stateful Memory:** Rejected due to high risk of memory pollution, lack of reproducibility, and difficulty in auditing, which directly conflicts with ESGGO's core principles.
*   **Hybrid approach (shared mutable memory):** Rejected for initial implementation due to complexity and potential for hidden state, favoring a strict stateless approach for clarity and governance.

## Compliance:
*   **Truth (Traceable):** All inputs, including contextual memory, are explicit, making skill execution fully traceable.
*   **Trust (Trustworthy):** Elimination of hidden state increases the reliability and integrity of skill outputs.

## Notes:
The `OmniCoreContext` object is designed as the primary mechanism for explicit context injection, encapsulating `taskId`, `userId`, `permissions`, and `environment` information.

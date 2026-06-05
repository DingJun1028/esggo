# Architecture Decision Records Index

This document serves as the central index for all Architecture Decision Records (ADRs) within the ESGGO project. ADRs capture significant architectural decisions, their context, options considered, the decision made, and its consequences. This ensures transparency, traceability, and a historical record of our architectural evolution, aligning with the "真 (Truth)" and "信 (Trust)" principles of the 5T Protocol.

## How to Use This Index:

*   Each ADR is a separate Markdown file, typically located in a dedicated `adr/` directory.
*   New ADRs should be added to this index as a new entry.
*   The status of each ADR should reflect its current state (e.g., Proposed, Accepted, Superseded, Deprecated).

## Index:

### 1. [ADR 001: Initial Project Setup and Core Technologies](./adr/adr-001-initial-project-setup.md)
*   **Date:** 2026-06-02
*   **Status:** Accepted
*   **Summary:** Decision to use Next.js with TypeScript for frontend/backend, Tailwind CSS for styling, and Firebase/Supabase for backend services.

### 2. [ADR 002: Establishing UI/UX Design System with Atomic Components](./adr/adr-002-ui-ux-design-system.md)
*   **Date:** 2026-06-02
*   **Status:** Accepted
*   **Summary:** Adoption of a "Liquid Glass" aesthetic, an 8px base spacing system, and an atomic component library (`BrandButton`, `BrandStatusDot`).

### 3. [ADR 003: Implementing OmniAgent Pulse Draggable, Resizable, and Minimized States](./adr/adr-003-omniagent-pulse-enhancements.md)
*   **Date:** 2026-06-02
*   **Status:** Accepted
*   **Summary:** Decision to encapsulate the OmniAgent Pulse into a separate component with draggable, resizable, and "fly-to-logo" minimization capabilities, persisting state in local storage.

### 4. [ADR 004: Adopting Memory Principle: Skill-Fragmented Knowledge for Gemma Skills](./adr/adr-004-gemma-skill-memory-principle.md)
*   **Date:** 2026-06-02
*   **Status:** Accepted
*   **Summary:** Decision to design Gemma skills as stateless, atomic units, with "memory" explicitly provided as input or encapsulated within skill logic, promoting reproducibility and reduced stateful dependency.

---

**[Template for New ADRs](./adr/adr-template.md)**

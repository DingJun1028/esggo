---
description: ESG GO Project Development Cycle
---

# ESG GO Project Development Cycle

Follow these steps when developing new features or modifying existing code in
the `esggoV1.0` project.

1. **Plan with Standards**:
   - Ensure the feature aligns with **英標繁博** (English naming, Traditional
     Chinese presentation).
   - Use the **終始矩陣** (End-to-End Matrix) architecture.
2. **Type-First Development**:
   - Define all types/interfaces before implementing logic.
   - Use **全端雙向 TypeScript** to keep client and server types synchronized.
3. **Next.js Best Practices**:
   - Prefer Server Components and Server Actions where appropriate.
   - Adhere to the `app` directory router conventions.
4. **Verification**:
   - Run `npm run type-check` (if configured) to ensure complete type safety.
   - Verify that all Traditional Chinese strings are consistent and
     professional.
5. **Continuous Deployment**:
   - Commit and push changes to the remote repository at
     `C:\Project_Remotes\esggoV1.0`.

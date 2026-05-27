# InfoOne v8.5.0 Walkthrough

This document provides a walkthrough of the latest UI enhancements and core engine updates implemented in the ESG GO platform.

## 1. Liquid Glass Aesthetics
The interface has been upgraded to a "Liquid Glass" design system, characterized by:
- **Backdrop Blurs:** Using `backdrop-blur-xl` and `backdrop-blur-2xl` on cards and sidebars for depth.
- **Glass Shadows:** Custom `shadow-glass` utility provides soft, multi-layered shadows.
- **Translucent Surfaces:** Backgrounds now use opacity-mapped colors (e.g., `bg-white/60`, `bg-berkeley-blue/5`) to allow background gradients to bleed through.
- **Animated Orbs:** Subtle background blurs create a "liquid" feel behind the main content area.

## 2. Updated UI Components
All core UI components in `components/ui/` now strictly adhere to the Berkeley Academic Palette:
- **Button:** New `glass` variant and enhanced hover scales.
- **Badge:** Semantic variants (`verified`, `warning`, `error`, `draft`) mapped to the brand-specific status colors.
- **Input:** Redesigned with inner shadows and focus-ring glows for better interactive feedback.
- **Card:** Supports `hoverEffect` with dynamic y-translation and deepened shadows.

## 3. Editor Core (app/editor/page.tsx)
The primary ESG reporting workspace has been refactored:
- **Expert Personas:** Distinct color coding for Compliance (Berkeley Blue), Harmony (Verified Green), and Innovation (Trackable Purple).
- **Interactive Sidebar:** Smooth transition between collapsed and expanded states with backdrop filtering.
- **T1..T5 Protocol Strip:** Integrated directly into the editor footer to track real-time data integrity.
- **ZKP Sealing:** Enhanced UI feedback during the SHA-256 hashing process.

## 4. Technical Integrity
- **Global Consolidation:** Fragmented data layers (Supabase + Firestore) have been unified into **Firebase SQL Connect (Data Connect)**.
- **5T Protocol Schema:** The relational schema (`schema.gql`) now natively supports T1-T5 protocols with fields like `sourceOrigin` (T1) and `hashLock` (T4).
- **Data Connect SDK:** Fully synchronized with the PostgreSQL schema, providing type-safe mutations for Reports, Tasks, and Metrics.
- **Type Safety:** The entire project now passes strict `tsc` and production build checks with bi-directional type safety.

## 5. OmniAgent CLI Usage
The system provides a native CLI tool (`omni`) for backend orchestration and agent management. **Note:** On Windows, use PowerShell for the best experience.

- **Start Services:** `.\ctl.ps1 start` launches the entire environment.
- **Agent Status:** `node cli/omni.mjs agent status` checks the health of the agent gateway.
- **Agent Tasking:** `node cli/omni.mjs agent run "..."` triggers the OmniAgent swarm for autonomous analysis.
- **Web Browsing:** `node cli/omni.mjs agent browse "..."` launches a V3 web agent via Browser Use Cloud.
- **Vault Management:** `node cli/omni.mjs vault list` displays the real-time hash locks and evidence status from the unified Data Connect backend.
- **Audit Verification:** `node cli/omni.mjs audit report` provides a T1..T5 integrity score for the current project.

---
**Document Version:** v1.3.0  
**Last Updated:** 2026-05-27


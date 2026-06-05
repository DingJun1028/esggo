---
uuid: "8f366152-a4c1-40c6-8816-a480711b74dd"
version: "1.0.0"
timestamp: "2026-06-04T10:36:23.575Z"
evidence: "adr\adr-001-initial-project-setup.md"
---
# ADR-001: Initial Project Setup and Core Technologies

## Status:
Accepted

## Context:
The ESGGO project requires a modern, scalable, and maintainable web application framework. The team needs to establish a consistent development environment and technology stack to ensure rapid development, type safety, and efficient deployment.

## Decision:
The following core technologies are adopted for the ESGGO project:
*   **Frontend Framework:** Next.js with React
*   **Language:** TypeScript for both frontend and backend (API routes, server-side logic).
*   **Styling:** Tailwind CSS for utility-first styling, integrated with a custom design system.
*   **Backend Services (Initial):** Firebase (Authentication, Hosting, Firestore) and Supabase (PostgreSQL database, Authentication, Realtime, Edge Functions) for specific use cases, following the NCBDB Protocol.

## Consequences:
*   **Positive:**
    *   Leverages industry-standard tools and practices.
    *   Benefits from strong typing with TypeScript, reducing runtime errors.
    *   Fast UI development with Tailwind CSS.
    *   Server-side rendering (SSR) and static site generation (SSG) capabilities of Next.js for performance and SEO.
    *   Managed backend services reduce operational overhead.
*   **Negative:**
    *   Steeper learning curve for developers unfamiliar with Next.js/TypeScript/Tailwind.
    *   Potential for vendor lock-in with Firebase/Supabase.
*   **Neutral:**
    *   Requires careful management of environment variables and CI/CD pipelines for secure deployment.

## Options Considered:
*   **Frontend:** React (CRA), Vue.js, Angular. Next.js was chosen for its full-stack capabilities and strong community support.
*   **Backend:** Node.js (Express), Python (Django/Flask), Go. Firebase/Supabase were chosen for their managed services and quick setup for initial phases.
*   **Styling:** CSS Modules, Styled-components, SASS. Tailwind CSS was chosen for its utility-first approach and integration with design systems.

## Compliance:
*   **Truth (Traceable):** Technology choices are documented for future reference and understanding.
*   **Trust (Trustworthy):** TypeScript provides type safety, reducing errors and increasing code reliability.
*   **Transferful (Trackable):** Standardized tech stack simplifies onboarding and knowledge transfer.

## Notes:
Future ADRs will detail specific configurations and integrations of these technologies.

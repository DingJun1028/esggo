---
name: esggo-standards
description: Enforces the ESG GO project standards: English Standard (英標繁博), End-to-End Matrix (終始矩陣), Full-stack Bidirectional TypeScript, and Next.js.
---

# ESG GO Project Standards Skill

This skill ensures that all development within the `esggoV1.0` project adheres
to the core architectural and linguistic principles defined by the USER.

## Core Principles

- **英標繁博 (English Standard, Traditional Chinese Broad)**:
  - Standard documentation and code naming in English.
  - User-facing content in Traditional Chinese with high-quality, professional
    phrasing.
- **終始矩陣 (End-to-End Matrix)**:
  - Architecture should follow a matrix structure from data source to
    client-side rendering.
  - Consistent data flow patterns.
- **全端雙向 TypeScript (Full-stack Bidirectional TypeScript)**:
  - Strict type safety across both frontend and backend (Next.js API
    routes/Server Actions).
  - Shared type definitions between client and server.
- **Next.js (NextJ)**:
  - Utilization of Next.js App Router, Server Components, and modern best
    practices.
- **Global UIUX (Google Stitch)**:
  - All UI/UX designs must be managed and generated using **Google Stitch
    (StitchMCP)**.
  - Maintain a consistent "Global UIUX" aesthetic across all modules, focusing
    on premium, data-driven interfaces.
  - Use `StitchMCP` tools to generate, edit, and apply design systems to all
    screens.

## Guidelines for Implementation

1. **Type Safety**: Avoid using `any`. Use interfaces and types for all props,
   data models, and API responses.
2. **Naming Conventions**: Use descriptive English names for variables,
   functions, and classes.
3. **Component Structure**: Follow the established Next.js `app` directory
   structure.
4. **Consistency**: Ensure that the UI components reflect the premium and modern
   aesthetics required for an ESG platform.

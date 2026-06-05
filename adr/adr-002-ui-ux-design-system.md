# ADR-002: Establishing UI/UX Design System with Atomic Components

## Status:
Accepted

## Context:
To ensure a consistent, high-quality, and maintainable user interface across the ESGGO platform, a robust design system is required. This system should encapsulate visual guidelines, reusable components, and interaction patterns, reflecting the project's "Liquid Glass" aesthetic and 5T Protocol principles.

## Decision:
A UI/UX design system is established with the following key elements:
*   **Aesthetic:** "Liquid Glass Cyan" design language (translucent, blurred elements, subtle shadows).
*   **Spacing System:** 8px base grid for consistent spacing and sizing.
*   **Typography:** Defined font families (Inter, Noto Sans TC, JetBrains Mono) and a type scale.
*   **Atomic Components:** Development and usage of reusable, atomic components (e.g., `BrandButton`, `BrandStatusDot`) that adhere to the "Reference Principle."
*   **Color Palette:** Standardized brand and semantic colors, integrated into Tailwind CSS.

## Consequences:
*   **Positive:**
    *   Ensures visual consistency and brand identity across the application.
    *   Accelerates UI development through reusable components.
    *   Improves maintainability by centralizing design decisions.
    *   Facilitates onboarding of new designers/developers with clear guidelines.
*   **Negative:**
    *   Initial overhead in defining and implementing the design system.
    *   Requires strict adherence from developers to maintain consistency.
*   **Neutral:**
    *   Evolves with project needs, requiring regular updates and new component development.

## Options Considered:
*   **No formal design system:** Rejected due to high risk of UI inconsistency and increased development time in the long run.
*   **Third-party component libraries (e.g., Material UI, Ant Design):** Rejected as they might not align with the unique "Liquid Glass" aesthetic and could introduce unnecessary overhead for customization. A custom atomic system allows for precise control over the brand vision.

## Compliance:
*   **Beauty (Tangible):** Directly translates the "Liquid Glass" aesthetic into a tangible, consistent user experience.
*   **Goodness (Transparent):** Clear design guidelines and component usage promote transparency in UI implementation.
*   **Transferful (Trackable):** Standardized components and guidelines simplify design handoffs and knowledge transfer.

## Notes:
Tailwind CSS configuration (`tailwind.config.ts`) will be the primary mechanism for integrating spacing, colors, and typography.

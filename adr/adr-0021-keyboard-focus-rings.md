# ADR-0021: Use dynamic keyboard focus rings for dismissible components

## Status

Accepted

## Context

When rendering dismissible components like Alerts and Tags with dynamic context colors (success, error, warning, info), hardcoding a specific focus ring color (e.g. \`focus-visible:ring-blue-500\`) breaks the design language or is unreadable. Previously, these close buttons lacked proper keyboard focus indicators, harming accessibility.

## Decision

We will use the \`focus-visible:ring-current\` utility along with \`focus-visible:outline-none focus-visible:ring-2\` for components that adopt the parent's dynamic color via \`currentColor\`. This ensures an accessible, visually consistent focus state for keyboard users without adding redundant style logic.

## Consequences

- **Positive:** Improved accessibility without duplicating color configurations across multiple variants.
- **Negative:** Requires developers to be aware that the SVG or icon text color must correctly inherit the wrapper's color (i.e. using \`currentColor\`).

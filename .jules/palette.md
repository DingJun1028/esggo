## 2024-06-06 - [Missing ARIA Labels on Icon-Only Buttons]
**Learning:** Found a widespread pattern across UI components (`ESGSmartQA`, `KpiCard`, `SelectionHouse`, etc.) where icon-only buttons lack `aria-label` attributes and keyboard focus-visible indicators. This significantly degrades the experience for screen-reader and keyboard-only users.
**Action:** Ensure all icon-only buttons include descriptive `aria-label` attributes and visual `focus-visible:ring-2 focus-visible:outline-none` styles for keyboard navigation.

## 2024-07-25 - [Missing Dialog Context on Full-Screen Selection Overlays]
**Learning:** Found a pattern where custom full-screen selection overlays (like `SelectionHouse`) lack `role="dialog"`, `aria-modal="true"`, and an `aria-labelledby` linking to their title. Without this, screen readers fail to recognize the overlay as a modal context, causing confusion for users navigating the UI.
**Action:** Always verify that custom full-screen overlays acting as modals implement the proper ARIA dialog context and ensure all internal interactive elements (tabs, selection items, close buttons) have explicit `focus-visible` states.
## 2026-06-17 - [Added ARIA Labels to OmniDB Action Buttons]
**Learning:** Encountered missing `aria-label` attributes on icon-only edit and delete action buttons within `OmniDB.tsx`. In addition, interactive buttons, including tabs, were missing visible focus states, hampering accessibility for keyboard users.
**Action:** Ensure that all icon-only action buttons have descriptive `aria-label` properties, and add `focus-visible:outline-none focus-visible:ring-2` to all interactive buttons (e.g., action buttons, tabs) for improved accessibility.

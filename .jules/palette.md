## 2024-06-06 - [Missing ARIA Labels on Icon-Only Buttons]
**Learning:** Found a widespread pattern across UI components (`ESGSmartQA`, `KpiCard`, `SelectionHouse`, etc.) where icon-only buttons lack `aria-label` attributes and keyboard focus-visible indicators. This significantly degrades the experience for screen-reader and keyboard-only users.
**Action:** Ensure all icon-only buttons include descriptive `aria-label` attributes and visual `focus-visible:ring-2 focus-visible:outline-none` styles for keyboard navigation.

## 2024-07-25 - [Missing Dialog Context on Full-Screen Selection Overlays]
**Learning:** Found a pattern where custom full-screen selection overlays (like `SelectionHouse`) lack `role="dialog"`, `aria-modal="true"`, and an `aria-labelledby` linking to their title. Without this, screen readers fail to recognize the overlay as a modal context, causing confusion for users navigating the UI.
**Action:** Always verify that custom full-screen overlays acting as modals implement the proper ARIA dialog context and ensure all internal interactive elements (tabs, selection items, close buttons) have explicit `focus-visible` states.

## 2026-06-15 - [Inaccessible Inline Custom Tabs and Table Actions]
**Learning:** Found a pattern in OmniDB components where custom inline tab controls and icon-only table actions lack standard ARIA attributes (e.g., `role="tablist"`, `role="tab"`, `aria-selected`, `aria-label`) and explicit keyboard focus states. This prevents proper screen reader announcements and makes keyboard navigation difficult.
**Action:** Always verify custom tab implementations include correct ARIA roles and that icon-only action buttons within data tables have descriptive `aria-label` and `focus-visible` states.

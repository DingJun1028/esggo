## 2024-06-06 - [Missing ARIA Labels on Icon-Only Buttons]
**Learning:** Found a widespread pattern across UI components (`ESGSmartQA`, `KpiCard`, `SelectionHouse`, etc.) where icon-only buttons lack `aria-label` attributes and keyboard focus-visible indicators. This significantly degrades the experience for screen-reader and keyboard-only users.
**Action:** Ensure all icon-only buttons include descriptive `aria-label` attributes and visual `focus-visible:ring-2 focus-visible:outline-none` styles for keyboard navigation.

## 2026-06-19 - [Missing Focus States on Dismissible UI Components]

**Learning:** Dismissible UI components like `Alert` use `<button>` elements with `aria-label` for screen reader accessibility, but they lacked `focus-visible` styles (`focus-visible:outline-none focus-visible:ring-2`), making keyboard navigation invisible.
**Action:** When implementing or modifying interactive UI components with custom close/remove buttons, ensure `focus-visible:outline-none focus-visible:ring-2` (e.g. `focus-visible:ring-current` to inherit context colors) is explicitly added.

## 2026-05-31 - [Icon-Only Buttons A11y Pattern]
**Learning:** Many custom UI components (like Tag, Toast, Alert, and Drawer) contain icon-only dismiss/close buttons without `aria-label`s. This makes them invisible to screen readers, a common anti-pattern when building generic UI component libraries.
**Action:** When working on generic, reusable UI components (especially in `components/ui/`), proactively check for icon-only buttons (`<X />` or similar icons used as buttons) and ensure they include `aria-label`s that describe their action contextually (e.g., "Close alert", "Remove tag").

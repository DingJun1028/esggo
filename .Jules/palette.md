
## 2024-05-18 - [Tab Navigation Accessibility]
**Learning:** Custom tab navigation patterns need explicit roles (`tablist` and `tab`), an `aria-selected` state reflecting the active tab, and `focus-visible` styles to ensure full keyboard and screen reader accessibility. Relying solely on click handlers and hover states is insufficient for users navigating with keyboards or assistive tech.
**Action:** Always include `role="tablist"` on the container and `role="tab"` + `aria-selected` + `focus-visible` styling on interactive tab items across the application.

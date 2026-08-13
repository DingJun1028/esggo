
## 2024-05-18 - [Tab Navigation Accessibility]
**Learning:** Custom tab navigation patterns need explicit roles (`tablist` and `tab`), an `aria-selected` state reflecting the active tab, and `focus-visible` styles to ensure full keyboard and screen reader accessibility. Relying solely on click handlers and hover states is insufficient for users navigating with keyboards or assistive tech.
**Action:** Always include `role="tablist"` on the container and `role="tab"` + `aria-selected` + `focus-visible` styling on interactive tab items across the application.
## 2024-08-07 - [Icon-Only Button Accessibility]
**Learning:** Icon-only buttons (like those using lucide-react SVGs) lack accessible names by default, making them invisible or confusing to screen reader users. Additionally, they often lack proper focus indicators, making keyboard navigation difficult.
**Action:** Always add `aria-label` and `title` to icon-only buttons, apply `focus-visible:ring-2` (and a matching ring color) for keyboard focus, and add `aria-hidden="true"` to the internal SVG to prevent redundant or confusing screen reader announcements.

## 2024-03-24 - Drag-and-Drop Fallbacks
**Learning:** Drag-and-drop zones are highly inaccessible for keyboard users and mobile users if they lack a click-to-upload fallback. We must always provide an alternative method to trigger the file input.
**Action:** When implementing drag-and-drop file uploaders, always include a visually hidden file input, bind `onClick` and `onKeyDown` events to the dropzone, and set `role="button"` and `tabIndex={0}` to make the zone fully keyboard accessible.

## 2024-07-18 - Tooltip for IconButton Accessibility

**Learning:** Purely visual icon buttons often lack semantic meaning for screen readers. Hiding the visual icon from screen readers while providing a descriptive `aria-label` is a reliable pattern. Using native HTML `title` attributes also acts as a tooltip for visual users.
**Action:** When creating icon-only buttons, always include `aria-label`, add `title` for a tooltip, add `focus-visible` styling (like `focus-visible:ring-2`), and hide purely decorative text content using `aria-hidden="true"`.

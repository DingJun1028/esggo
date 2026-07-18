## 2024-07-18 - SearchInput Clear Button Accessibility

**Learning:** Purely visual icon buttons (like "✕") often lack semantic meaning for screen readers and visible focus states for keyboard users, making forms less accessible. Hiding the visual icon from screen readers while providing a descriptive `aria-label` is a reliable pattern.
**Action:** When creating icon-only buttons, always include `aria-label`, add `focus-visible` styling (like `focus-visible:ring-2`), and hide purely decorative text content using `aria-hidden="true"`.

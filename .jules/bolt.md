## 2025-02-18 - [OmniPieChart Optimization]
**Learning:** In interactive SVG charts, values calculated in the render scope (like `total`) or helper functions declared outside of `useMemo` can cause excessive redundant work during frequent state updates like `onMouseMove`. In addition, array functions returning coordinates should be destructured `const [x, y] = getCoords()` to halve expensive math calls.
**Action:** Always wrap heavy data aggregations and geometry mapping in `useMemo` with appropriate dependency arrays. Review chart components with frequent hover states for redundant calculations.

## 2026-08-18 - [OmniAgent Console Rendering Optimization]
**Learning:** In React components, static configuration arrays (like `CHAT_SUGGESTIONS`) created inside the render cycle (specifically within the JSX) cause the array to be recreated on every re-render. This triggers unnecessary re-renders of mapped child elements depending on referential equality, which is a common performance anti-pattern.
**Action:** Hoist static arrays and configuration objects out of the component function to the module scope to avoid garbage collection and recreation overhead.

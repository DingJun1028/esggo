## 2025-02-18 - [OmniPieChart Optimization]
**Learning:** In interactive SVG charts, values calculated in the render scope (like `total`) or helper functions declared outside of `useMemo` can cause excessive redundant work during frequent state updates like `onMouseMove`. In addition, array functions returning coordinates should be destructured `const [x, y] = getCoords()` to halve expensive math calls.
**Action:** Always wrap heavy data aggregations and geometry mapping in `useMemo` with appropriate dependency arrays. Review chart components with frequent hover states for redundant calculations.

## 2026-08-18 - [OmniAgent Console Rendering Optimization]
**Learning:** In React components, static configuration arrays (like `CHAT_SUGGESTIONS`) created inside the render cycle (specifically within the JSX) cause the array to be recreated on every re-render. This triggers unnecessary re-renders of mapped child elements depending on referential equality, which is a common performance anti-pattern.
**Action:** Hoist static arrays and configuration objects out of the component function to the module scope to avoid garbage collection and recreation overhead.

## 2025-03-02 - Optimize Object Allocation in useState Initializer
**Learning:** During profiling, I noticed that `useState({ ...schema.fields.reduce(...) })` was causing an expensive O(n) array reduction operation and object allocation on every render of the `DynamicFormEngine` component (e.g., during rapid keystrokes). React evaluates the initial state argument on every render, even though it only uses the result during the initial render.
**Action:** Use lazy initialization `useState(() => ({ ... }))` when the initial state is derived from expensive computations or large object allocations. This ensures the initialization logic only runs once when the component first mounts.

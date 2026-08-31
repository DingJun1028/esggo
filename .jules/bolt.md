## 2025-02-18 - [OmniPieChart Optimization]
**Learning:** In interactive SVG charts, values calculated in the render scope (like `total`) or helper functions declared outside of `useMemo` can cause excessive redundant work during frequent state updates like `onMouseMove`. In addition, array functions returning coordinates should be destructured `const [x, y] = getCoords()` to halve expensive math calls.
**Action:** Always wrap heavy data aggregations and geometry mapping in `useMemo` with appropriate dependency arrays. Review chart components with frequent hover states for redundant calculations.

## 2026-08-18 - [OmniAgent Console Rendering Optimization]
**Learning:** In React components, static configuration arrays (like `CHAT_SUGGESTIONS`) created inside the render cycle (specifically within the JSX) cause the array to be recreated on every re-render. This triggers unnecessary re-renders of mapped child elements depending on referential equality, which is a common performance anti-pattern.
**Action:** Hoist static arrays and configuration objects out of the component function to the module scope to avoid garbage collection and recreation overhead.

## 2025-02-18 - [SVG Path Math Optimization]
**Learning:** Generating continuous SVG paths (like pie chart slices) often calculates the boundary coordinates twice for shared edges. In `omni-pie-chart.tsx`, `getCoordinatesForPercent` was computing both `startX`/`startY` and `endX`/`endY` per slice, recalculating `Math.cos` and `Math.sin` for the start coordinate that already matched the previous slice's end coordinate.
**Action:** When rendering adjacent SVG path segments, initialize a starting coordinate state (like `prevX` and `prevY`) before the loop, then reuse the previous slice's `endX` and `endY` as the current slice's `startX` and `startY`. This removes one heavy `getCoordinatesForPercent` call per iteration.

## 2026-08-28 - [OmniAgent Console Rendering Optimization]
**Learning:** In React components, static configuration arrays like `PANEL_TABS` created inside the render cycle (specifically within the JSX or component function) cause the array to be recreated on every re-render. This triggers unnecessary re-renders of mapped child elements depending on referential equality, which is a common performance anti-pattern.
**Action:** Hoist static arrays and configuration objects out of the component function to the module scope to avoid garbage collection and recreation overhead.
## 2024-05-18 - Lazy initialization in React forms
**Learning:** In React functional components, `useState` initialization code runs on every render, even if the result is only used on the first render. This is particularly problematic when the initial state is computed dynamically from props, such as reducing over an array to build a form data object.
**Action:** Always wrap expensive or dynamic `useState` initializations (e.g. `Array.reduce` over schema fields) in a callback function `() => ({ ... })`. This leverages React's lazy initial state feature, ensuring the expensive computation only runs once during component mount, preventing redundant work on every keystroke or subsequent render.
## 2025-02-18 - [SVG Chart Hoisting Optimization]
**Learning:** In interactive React chart components using SVG, configuration objects (like `CHART_PADDING`) or arrays (like `CHART_COLORS`, `GRID_RATIOS`) declared inside the component body are garbage collected and recreated on every single render cycle (e.g. mouse move/hover updates).
**Action:** Always hoist static configuration arrays and layout constants out of the component function to the module scope to avoid garbage collection and memory overhead during high-frequency renders.

## 2025-02-18 - [SVG Chart Grid Line Memoization]
**Learning:** In interactive React chart components using SVG, grid line calculation that runs inside the JSX map without being memoized causes mathematical operations to execute on every single pixel move.
**Action:** Move grid line map computations inside existing `useMemo` blocks to memoize `gridLines` so that they only recalculate when `data` or `height` change, eliminating computation on mouse movement.

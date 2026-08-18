## 2025-02-18 - [OmniPieChart Optimization]
**Learning:** In interactive SVG charts, values calculated in the render scope (like `total`) or helper functions declared outside of `useMemo` can cause excessive redundant work during frequent state updates like `onMouseMove`. In addition, array functions returning coordinates should be destructured `const [x, y] = getCoords()` to halve expensive math calls.
**Action:** Always wrap heavy data aggregations and geometry mapping in `useMemo` with appropriate dependency arrays. Review chart components with frequent hover states for redundant calculations.
## 2025-02-18 - [OmniLineChart Array Iteration Optimization]
**Learning:** In interactive SVG charts, array mapping operations directly within the JSX render path (such as mapping `[0, 0.25, 0.5, 0.75, 1]` for grid lines in `OmniLineChart`) cause expensive redundant calculations during frequent state updates like `onMouseMove`.
**Action:** Move static array mappings out of the render loop and pre-compute them inside the relevant `useMemo` block (e.g., returning `gridLines` from the `useMemo` in `OmniLineChart`) to prevent unnecessary geometry math and array allocation on hover.

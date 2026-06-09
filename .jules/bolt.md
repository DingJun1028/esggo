## 2024-05-18 - [DataTable Filtering/Sorting Optimization]
**Learning:** `DataTable.tsx` performs an unconditional array filter and sort on every render using `Object.values(row).some(...)`, leading to massive main thread blockage on large datasets.
**Action:** Always wrap data-intensive derivations (filtering/sorting) in `useMemo` so that they only recalculate when dependencies (e.g. data, search query, or sort keys) change.

## 2024-06-19 - DataTable Object.values + toLowerCase in React Render Cycle
**Learning:** In standard React datatables, dynamically filtering data structures using `Object.values(row).some(v => String(v).toLowerCase().includes(search.toLowerCase()))` during every render cycle can be surprisingly slow on large datasets because `toLowerCase()` on the search string is re-evaluated N * M times (Rows * Columns). It also forces a full re-computation of the array when parent components re-render even if the data hasn't changed.
**Action:** Always wrap data filtering/sorting in `useMemo` hooks with strict dependencies, and hoist the `search.toLowerCase()` call *outside* the filtering loop to evaluate it exactly once per filter pass. Avoid nested `toLowerCase` on constants in high-iteration loops.

## 2024-06-06 - [DataTable Memoization]
**Learning:** UI Library components like `DataTable` that process and render lists of data should be memoized by default to prevent expensive re-renders when parent components update state unrelated to the table. Generic types require casting when using `React.memo`.
**Action:** Wrap generic UI components in `React.memo` and use `as typeof Component` to preserve generic type signatures.

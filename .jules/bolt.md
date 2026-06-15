## 2024-05-18 - [DataTable Filtering/Sorting Optimization]

**Learning:** `DataTable.tsx` performs an unconditional array filter and sort on every render using `Object.values(row).some(...)`, leading to massive main thread blockage on large datasets.
**Action:** Always wrap data-intensive derivations (filtering/sorting) in `useMemo` so that they only recalculate when dependencies (e.g. data, search query, or sort keys) change.

## 2024-06-19 - DataTable Object.values + toLowerCase in React Render Cycle

**Learning:** In standard React datatables, dynamically filtering data structures using `Object.values(row).some(v => String(v).toLowerCase().includes(search.toLowerCase()))` during every render cycle can be surprisingly slow on large datasets because `toLowerCase()` on the search string is re-evaluated N _ M times (Rows _ Columns). It also forces a full re-computation of the array when parent components re-render even if the data hasn't changed.
**Action:** Always wrap data filtering/sorting in `useMemo` hooks with strict dependencies, and hoist the `search.toLowerCase()` call _outside_ the filtering loop to evaluate it exactly once per filter pass. Avoid nested `toLowerCase` on constants in high-iteration loops.

## 2026-06-07 - DataTable React.memo Optimization

**Learning:** Re-renders of parent components will cause `DataTable` to unnecessarily re-render, blocking the main thread during high-volume dataset sorting/filtering. Using `React.memo` directly on generic components loses their type inferences.
**Action:** Always wrap data-intensive generic components in `React.memo` and type-cast the export `as typeof ComponentInner` to preserve the generic typing correctly while preventing expensive re-renders.

## 2024-07-28 - [Search Input API Call Optimization]

**Learning:** React `useEffect` hooks directly bound to text input states (like `search`) will trigger their callback on every single keystroke. When this callback involves an API request, it leads to excessive backend load, unnecessary network traffic, and potential race conditions.
**Action:** Always wrap API calls triggered by text inputs in a debouncing mechanism (e.g., `setTimeout` with a 300ms delay inside `useEffect` or using a dedicated debounce hook) to significantly reduce the number of requests while maintaining a responsive UI.
\n## 2025-02-09 - SelectionHouse Array Filter Optimization\n**Learning:** In `SelectionHouse.tsx`, iterating over categories and then over each item's properties (label, sub, id) to perform `toLowerCase()` filtering directly in the render function leads to N\*M recalculations every render. Moving this calculation into a `useMemo` block and hoisting `search.toLowerCase()` significantly improves performance.\n**Action:** Apply the same `useMemo` and hoisting optimization for all complex nested array filtering in UI components to prevent unnecessary React re-renders and computation.

## 2025-02-12 - [OmniTable Array Filter Optimization]

**Learning:** In `OmniTable.tsx`, an array `.filter` operation was occurring unconditionally on every render. Even though `filter.toLowerCase()` was hoisted correctly outside the loop to optimize the string manipulation, the entire array was still being iterated over every time the component re-rendered (e.g., when a row was expanded or when an action button entered a processing state). This causes unnecessary main-thread blocking for operations completely unrelated to the data or search query.
**Action:** Always wrap data-intensive array operations (like `.filter` and `.map`) in a `useMemo` hook, especially in table or list components with interactive row states (like accordions or action buttons), to prevent unrelated state updates from triggering expensive O(N) or O(N\*M) recalculations.

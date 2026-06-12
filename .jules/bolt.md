## 2024-05-18 - [DataTable Filtering/Sorting Optimization]
**Learning:** `DataTable.tsx` performs an unconditional array filter and sort on every render using `Object.values(row).some(...)`, leading to massive main thread blockage on large datasets.
**Action:** Always wrap data-intensive derivations (filtering/sorting) in `useMemo` so that they only recalculate when dependencies (e.g. data, search query, or sort keys) change.

## 2024-06-19 - DataTable Object.values + toLowerCase in React Render Cycle
**Learning:** In standard React datatables, dynamically filtering data structures using `Object.values(row).some(v => String(v).toLowerCase().includes(search.toLowerCase()))` during every render cycle can be surprisingly slow on large datasets because `toLowerCase()` on the search string is re-evaluated N * M times (Rows * Columns). It also forces a full re-computation of the array when parent components re-render even if the data hasn't changed.
**Action:** Always wrap data filtering/sorting in `useMemo` hooks with strict dependencies, and hoist the `search.toLowerCase()` call *outside* the filtering loop to evaluate it exactly once per filter pass. Avoid nested `toLowerCase` on constants in high-iteration loops.

## 2026-06-07 - DataTable React.memo Optimization
**Learning:** Re-renders of parent components will cause `DataTable` to unnecessarily re-render, blocking the main thread during high-volume dataset sorting/filtering. Using `React.memo` directly on generic components loses their type inferences.
**Action:** Always wrap data-intensive generic components in `React.memo` and type-cast the export `as typeof ComponentInner` to preserve the generic typing correctly while preventing expensive re-renders.

## 2024-07-28 - [Search Input API Call Optimization]
**Learning:** React `useEffect` hooks directly bound to text input states (like `search`) will trigger their callback on every single keystroke. When this callback involves an API request, it leads to excessive backend load, unnecessary network traffic, and potential race conditions.
**Action:** Always wrap API calls triggered by text inputs in a debouncing mechanism (e.g., `setTimeout` with a 300ms delay inside `useEffect` or using a dedicated debounce hook) to significantly reduce the number of requests while maintaining a responsive UI.

## 2024-07-29 - [SelectionHouse Render Filtering Optimization]
**Learning:** `SelectionHouse.tsx` was performing an unconditional nested mapping and array filtering operations directly in the render body. Specifically, `toLowerCase()` was being invoked on the search query multiple times during every single item evaluation inside a nested `.filter` block. For components generating large lists with complex nested objects, this scales as O(N*M) where N is the number of categories and M is the number of items per category, leading to noticeable UI stutter when typing.
**Action:** Always extract invariant computations, such as `search.toLowerCase()`, outside of array manipulation methods. Furthermore, wrap the entire filtered collection derivation inside a `useMemo` block with exact dependencies to ensure it only recalculates when the search query or raw data updates, avoiding blocking the main thread during unrelated component state updates or parent re-renders.

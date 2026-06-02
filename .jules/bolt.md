## 2024-05-18 - [DataTable Filtering/Sorting Optimization]
**Learning:** `DataTable.tsx` performs an unconditional array filter and sort on every render using `Object.values(row).some(...)`, leading to massive main thread blockage on large datasets.
**Action:** Always wrap data-intensive derivations (filtering/sorting) in `useMemo` so that they only recalculate when dependencies (e.g. data, search query, or sort keys) change.

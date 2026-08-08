## 2024-05-24 - API Request Optimization in OmniTodoPanel
**Learning:** Frequent, unfiltered state updates connected to API requests (like search query typing) can cause unnecessary backend load and degraded frontend performance.
**Action:** Implement debouncing on input fields that trigger API requests to delay the execution until the user has stopped typing.
## 2026-08-08 - UseMemo for derived state in React components
**Learning:** Frequent recalculations in components that use `filter()` and `map()` directly during render can degrade frontend performance. Without `useMemo`, any state change triggers a recalculation of complex filters/mappings.
**Action:** Wrap derived list calculations (especially filtering/mapping) in `useMemo` with appropriate dependencies to prevent unnecessary execution on unrelated state updates.

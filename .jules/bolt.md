## 2024-05-24 - API Request Optimization in OmniTodoPanel
**Learning:** Frequent, unfiltered state updates connected to API requests (like search query typing) can cause unnecessary backend load and degraded frontend performance.
**Action:** Implement debouncing on input fields that trigger API requests to delay the execution until the user has stopped typing.

## 2026-08-09 - Array Mapping in Render Phase
**Learning:** Re-creating complex charting data arrays via `.map` and multiple nested `.filter` calls inside a functional component's render body forces deep re-renders of child components like Recharts' `BarChart`, as they receive new object references on every render cycle.
**Action:** Always wrap expensive array transformations and charting data generation inside a `useMemo` hook, especially when dealing with data that doesn't change on every UI interaction.

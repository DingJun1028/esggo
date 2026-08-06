## 2024-05-24 - API Request Optimization in OmniTodoPanel
**Learning:** Frequent, unfiltered state updates connected to API requests (like search query typing) can cause unnecessary backend load and degraded frontend performance.
**Action:** Implement debouncing on input fields that trigger API requests to delay the execution until the user has stopped typing.

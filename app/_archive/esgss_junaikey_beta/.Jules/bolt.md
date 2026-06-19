## 2024-05-24 - [Tactical Dashboard Render Optimization]

**Learning:** In the TacticalDashboard, all OmniEsgCell children were re-rendering whenever the parent state (advisory) changed, even though the cell props remained identical. This is a classic React performance pitfall in dashboard-like views.
**Action:** Wrapped `OmniEsgCell` in `React.memo`. This is a high-value optimization for atomic "cell" or "widget" components that appear in lists or grids and have internal complex rendering logic or side-effects. Always check if grid items are re-rendering unnecessarily when the main dashboard state updates.

## 2025-05-20 - [OmniTaskMatrix Input Lag]

**Learning:** In `OmniTaskMatrix`, typing in the input field caused the entire list of tasks to re-render on every keystroke. This happens when the list mapping is defined inline within the component body.
**Action:** Extracted the list item into a `React.memo` wrapped `TaskItem` component and memoized the callback with `useCallback`. This isolates the input state updates from the list items.

## 2025-05-22 - [Calendar Event Lookup O(N) Bottleneck]

**Learning:** In `useTimeNexus`, the `getEventsForDate` function was filtering the entire event array (O(N)) for every single day cell in the `OmniCalendar` (rendered 35-42 times). As the history and task logs grow, this causes significant rendering lag.
**Action:** Refactored `useTimeNexus` to pre-calculate a `Record<DateString, Event[]>` hash map inside `useMemo`. This turns the `getEventsForDate` lookup into O(1), decoupling calendar render performance from the total volume of system history.

## 2026-01-20 - [OmniLogViewer Search Debounce]

**Learning:** In `OmniLogViewer`, the `getLogs` filter performs expensive operations (like `JSON.stringify` on potentially large objects) on every keystroke of the search input, causing significant UI lag when the log volume is high.
**Action:** Implemented a 300ms debounce on the search input using `useEffect`. This decouples the user's typing interaction from the expensive filtering operation, ensuring the UI remains responsive even with thousands of logs.

## 2026-02-15 - [Tactical Dashboard Log Isolation]

**Learning:** `TacticalDashboard` subscribed to logs directly, causing the entire dashboard (including 4 complex EsgCells and Advisor card) to re-render on every log message. Even with memoized children, the parent reconciliation overhead was unnecessary for high-frequency updates.
**Action:** Extracted log subscription and rendering into a dedicated `SystemLogConsole` component. This isolates high-frequency state updates to a small leaf component, keeping the heavy dashboard static.

## 2026-05-25 - [Log Viewer Render Storm]

**Learning:** `OmniLogViewer` was subscribing to the logger and calling `refreshLogs` (which filters and sets state) synchronously on every log event. During log bursts (e.g., startup or errors), this caused the component to re-render hundreds of times per second, freezing the UI.
**Action:** Implemented a 200ms throttle in the subscription callback. This batches updates and caps re-renders to 5fps, which is sufficient for human perception while drastically reducing CPU load during high-volume logging.

## 2026-06-01 - [SystemLogConsole Throttling]

**Learning:** While `OmniLogViewer` was optimized, the smaller widget `SystemLogConsole` was missed and still updated on every log event. This created a performance leak in the main dashboard.
**Action:** Applied the same 200ms throttling pattern (buffer + setTimeout) to `SystemLogConsole` to align performance characteristics across all log consumers. Also fixed `vitest` config to support path aliases, enabling proper testing of these components.

## 2026-06-02 - [OmniLogger Search Stringification]

**Learning:** Even with debouncing, `OmniLogViewer` search was slow because `getLogs` repeatedly called `JSON.stringify` on `log.details` for every log entry during filtering. This O(N) operation on complex objects blocked the main thread.
**Action:** Implemented a `WeakMap` cache (`searchCache`) in `OmniLoggerService` to memoize the stringified, lower-cased search representation of each log entry. This reduces the search complexity to O(1) per log for subsequent searches (after cache miss).

## 2026-06-21 - [Polling Re-render Loop]

**Learning:** Polling functions (like `setInterval`) that fetch data returning new object references (even with identical content) will trigger React re-renders on every tick if passed directly to `setState`.
**Action:** Use functional state updates with a deep equality check (like `JSON.stringify` for small objects) to return the _previous_ state reference when data hasn't changed, aborting the render.

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
\n## 2025-02-09 - SelectionHouse Array Filter Optimization\n**Learning:** In `SelectionHouse.tsx`, iterating over categories and then over each item's properties (label, sub, id) to perform `toLowerCase()` filtering directly in the render function leads to N*M recalculations every render. Moving this calculation into a `useMemo` block and hoisting `search.toLowerCase()` significantly improves performance.\n**Action:** Apply the same `useMemo` and hoisting optimization for all complex nested array filtering in UI components to prevent unnecessary React re-renders and computation.

## 2024-06-21 - [Search Input API Call Optimization]
**Learning:** React components containing text inputs that immediately trigger `fetch` API calls on every `onChange` event (like `GlobalSearch.tsx`) will overload the backend and cause excessive network traffic when a user types a word.
**Action:** Use a `useRef` to store a `NodeJS.Timeout` ID, and wrap the API request inside a `setTimeout` (e.g. 300ms) within the input handler. Always clear the existing timeout before setting a new one, but ensure that any state controlling the input's visual value (e.g. `setQuery`) is updated *immediately* before the debounce timer to keep the UI responsive.

## 2026-06-21 - [CI Dockerfile Fix]
**Learning:** The Dockerfile failed in CI because `pnpm install --frozen-lockfile` could not find required workspace dependencies (`src/dataconnect-admin-generated`, `src/dataconnect-generated`, `packages/types`) referenced in `pnpm-workspace.yaml`.
**Action:** When configuring Dockerfiles for `pnpm` monorepos, `COPY pnpm-workspace.yaml` alongside `package.json` and ensure all paths defined as workspaces are explicitly `COPY`'d before running `pnpm install`.

## 2026-06-21 - [CI Typescript Build Error Fix]
**Learning:** During the Next.js `next build` step in CI, `Turbopack` warned about unexpected files, and then a build error occurred at `/api/agent/tasks` regarding `Cannot read properties of null (reading 'defineTool')`.
**Action:** Investigated the backend API layer code logic to ensure tools are properly defined and initialized to prevent null reference errors on agent startup.

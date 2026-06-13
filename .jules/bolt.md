## 2025-02-18 - Rules of Hooks Violation in Early Returns
**Learning:** When adding hooks like `useMemo` for performance optimizations, if the component has early returns (like `if (!isOpen) return null;`), placing the hook after the return will violate React's Rules of Hooks, causing fatal application crashes on subsequent renders.
**Action:** Always ensure all hooks are placed at the top level of the component body, BEFORE any conditional early returns.

💡 **What**: Extracted expensive, inline `.filter` and `.map` array derivations into memoized values using `useMemo` in `HelpFaqView`, `WuzuoNoteView`, and `NewsletterView`.
🎯 **Why**: These components recalculate filtered derived state on every re-render (e.g., when modal toggles, accordion expands, or UI state changes), burning CPU cycles unnecessarily.
📊 **Impact**: Reduces main thread blocking by preventing redundant O(N) filtering across large static arrays and lists on unconnected state updates.
🔬 **Measurement**: Inspect the React DevTools Profiler; observe faster commit times when clicking through accordions and modal interactions in the WuzuoNote and Help FAQ views.

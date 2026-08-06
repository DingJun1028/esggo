1. **Optimize OmniAgent Console Rendering (`app/omni-agent/page.tsx`)**:
   - The array `[{ id: 'stats', label: '核心統計', icon: '◎' }, { id: 'evolution', label: '無限進化', icon: '🧬' }, { id: 'agents', label: '子代理', icon: '🤖' }, { id: 'commands', label: '快速命令', icon: '⚡' }] as const` is being created inside the render cycle (specifically within the JSX of `OmniAgentConsolePage`).
   - This causes the array to be recreated on every re-render of the component, which can trigger unnecessary re-renders of the mapped child elements if they depend on referential equality (and it's a common performance anti-pattern).
   - I will hoist this static configuration array out of the component function to the module scope.
2. **Review performance learnings**:
   - Add a note in `.jules/bolt.md` detailing that static arrays used in render should be hoisted out of the component to avoid garbage collection and recreation overhead.
3. **Complete pre-commit steps to ensure proper testing, verification, review, and reflection are done.**
4. **Create PR**:
   - Title: "⚡ Bolt: [performance improvement] Hoist static tab array out of render in OmniAgent Console"
   - Include What, Why, Impact, and Measurement in the PR description.

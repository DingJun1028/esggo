## 2024-06-16 - [Add ARIA Labels to Search Inputs]
**Learning:** Found a recurring pattern where generic search inputs inside complex components (`CommandPalette`, `SelectionHouse`, `DataTable`) lack accessible labels. Because they use adjacent icons instead of text labels, screen readers fail to communicate their purpose to users.
**Action:** Always verify that input fields, especially search bars, either have a visible `label` associated via `htmlFor`/`id` or an explicit `aria-label`. For components where placeholder text is dynamic, `aria-label` can fall back to the placeholder value.

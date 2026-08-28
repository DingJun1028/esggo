---
name: team-presentation-pages
description: Create comprehensive team/organization presentation HTML pages with member rosters, unit structures, capabilities matrices, and collaboration frameworks.
version: 1.0.0
author: Hermes Agent
license: MIT
platforms: [linux, macos, windows]
metadata:
  hermes:
    tags: [team, organization, roster, presentation, html, directory, members, structure]
    related_skills: [claude-design, sketch, excalidraw, architecture-diagram]
---

# Team Presentation Pages

Use this skill when the user asks for a comprehensive team/organization presentation page — a self-contained HTML artifact that presents a team's structure, members, capabilities, and collaboration framework.

## When To Use

- User asks for a "team roster" or "team page" with multiple members
- User wants an "organization chart" or "team structure" visualization
- User needs a "member directory" with roles and skills
- User wants to present a team's capabilities and collaboration model
- User asks for "all of the above" — comprehensive team documentation

## When NOT to Use

- Simple single-page mockup → use `claude-design` or `sketch`
- Just a diagram → use `excalidraw` or `architecture-diagram`
- Production React component → build in the repo's stack

## Core Pattern

### Structure Template

```
1. Header with team name and logo
2. Hero section with motto/tagline
3. Stats/summary (member count, departments, coverage)
4. Team structure diagram (ASCII art)
5. Department/unit cards with member listings
6. Capabilities/skills matrix (table)
7. Collaboration framework (pairings, workflows)
8. Footer with copyright
```

### Design Principles

- **Comprehensive**: Include all requested information
- **Structured**: Clear hierarchy from team → units → members
- **Visual**: Color-coded sections, consistent card heights
- **Responsive**: Mobile-friendly grid and table layouts
- **Self-contained**: Single HTML file, embedded CSS/JS

## Workflow

1. **Gather team details**: names, roles, skills, unit assignments
2. **Determine structure**: how many units, reporting lines, specialties
3. **Plan the layout**: header → hero → stats → structure → units → matrix → footer
4. **Build the HTML**: single file with embedded CSS
5. **Add styling**: CSS variables for colors, grid for layout, responsive breakpoints
6. **Verify**: check file exists, open in browser, check console errors

## Traditional Chinese Support

- Use `lang="zh-TW"` in HTML tag
- Font family: `Microsoft JhengHei`, `PingFang SC`, sans-serif
- Line height: 1.6-1.8 for Chinese text
- Use `<br>` for line breaks in headings when needed

## Member Card Pattern

```html
<div class="team-card">
    <div class="unit-name">Unit Name</div>
    <div class="role-count">N members · Description</div>
    <ul class="members-list">
        <li><span class="member-name">Name</span> <span class="member-role">Role</span></li>
    </ul>
</div>
```

## Skills Matrix Pattern

```html
<table class="cap-table">
    <thead>
        <tr><th>Capability</th><th>Members</th><th>Coverage</th></tr>
    </thead>
    <tbody>
        <tr><td>Technical</td><td>5</td><td>100%</td></tr>
    </tbody>
</table>
```

## Structure Diagram Pattern

```html
<div class="team-structure">
    Team Lead<br>
    &nbsp;&nbsp;&nbsp;│<br>
    &nbsp;&nbsp;&nbsp;├── Unit A (5)<br>
    &nbsp;&nbsp;&nbsp;├── Unit B (5)<br>
    &nbsp;&nbsp;&nbsp;└── Unit C (4)<br>
</div>
```

## Common Pitfalls

- **Inconsistent card heights** in grid layouts → set min-height or use flex
- **Poor color contrast** with Chinese text → check WCAG contrast
- **Tables not scrollable** on mobile → wrap in responsive container
- **Missing viewport meta** → always include `<meta name="viewport">`
- **Over-decoration** → avoid gradients, glassmorphism, excessive shadows
- **Generic layouts** → commit to a surface type (Monitor, Operate, Compare, etc.)

## File Naming

- Use descriptive names: `Team Name Presentation.html`, `Organization Roster.html`
- Include team name in title tag
- Save to user's working directory or project root

## Related Skills

- `claude-design` — for general HTML artifact design principles
- `sketch` — for throwaway variant exploration
- `excalidraw` — for diagram-based team structures
- `architecture-diagram` — for technical team architecture diagrams
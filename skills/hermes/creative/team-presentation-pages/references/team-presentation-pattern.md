# Team Presentation Page Pattern

Detailed pattern for creating comprehensive team/organization presentation pages, refined through real usage.

## Session Example: 萬能蜂群 (Omni-Bee Colony)

A 30-member bee-themed team with 6 units, each with 4-5 members. The user wanted:
- Complete member roster with names, roles, skills
- Team structure diagram
- Capabilities matrix
- Collaboration pairings
- Optimization framework (gap analysis, seamless integration, unity)

## Key Design Decisions

### 1. Color Scheme
- Primary: Orange gradient (#ff6b35 → #f7933b) for headers
- Secondary: Purple gradient (#667eea → #764ba2) for sections
- Accent: Gold (#ffd23f) for highlights
- Background: Light gray gradient (#f5f7fa → #e4e7f1)

### 2. Card Layout
- Grid with `grid-template-columns: repeat(auto-fill, minmax(350px, 1fr))`
- Consistent card height via padding and content structure
- Hover effect: `transform: translateY(-5px)` + shadow increase
- Border-top accent: 4px solid color per unit

### 3. Member Listing
- `<ul>` with `<li>` items
- Name and role in separate spans for styling
- Border-bottom between members
- Last child border removed

### 4. Stats Section
- Flexbox layout with `justify-content: center`
- Large numbers with smaller labels
- Responsive: `flex-wrap: wrap` with gap

### 5. Structure Diagram
- Monospace font for ASCII art
- Centered text
- Non-breaking spaces for indentation

### 6. Skills Matrix
- Full-width table with `border-collapse: collapse`
- Header row with background color
- Hover effect on rows
- Total row highlighted

## Traditional Chinese Considerations

```html
<html lang="zh-TW">
<style>
    body {
        font-family: 'Microsoft JhengHei', 'PingFang SC', sans-serif;
        line-height: 1.6;
    }
</style>
```

## Responsive Design

```css
@media (max-width: 768px) {
    .hero h2 { font-size: 1.5rem; }
    .stats { gap: 1rem; }
    .team-grid { grid-template-columns: 1fr; }
}
```

## File Structure

```
C:\Users\dingj\
├── 萬能蜂群_team_roster.md      # Markdown roster
├── 萬能蜂群_collaboration.md      # Collaboration framework
├── 萬能蜂群_optimization.md       # Optimization details
└── omni_bee_colony.html          # Main presentation page
```

## Content Organization

When the user says "all of the above" or asks for comprehensive documentation:

1. **Main roster** (Markdown) — structured member list with tables
2. **Collaboration** (Markdown) — pairings, workflows, schedules
3. **Optimization** (Markdown) — gap analysis, integration, unity
4. **Presentation** (HTML) — visual showcase combining all elements

This gives the user both machine-readable (Markdown) and human-readable (HTML) formats.
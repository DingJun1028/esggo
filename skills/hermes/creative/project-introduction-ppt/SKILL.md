---
name: project-introduction-ppt
description: "Create project introduction PowerPoint presentations using AI-generated visuals and brand-consistent design. Generates PPT decks from project documentation, shot images, and brand guidelines."
version: 1.0.0
author: Hermes Agent
license: MIT
platforms: [linux, macos, windows]
metadata:
  hermes:
    tags: [PowerPoint, PPTX, Presentation, Project, Introduction, AI, Visuals]
    category: creative
    related_skills: [powerpoint, team-presentation-pages, video-automation-pipeline]
---

# Project Introduction PPT

Use this skill when the user asks to create a PowerPoint presentation introducing a project, product, or technical concept using AI-generated visuals and brand-consistent design.

## When To Use

- User asks: "把專案做成PPT介紹" / "做個專案簡報"
- User wants: A visual presentation with AI-generated slides
- User has: Project documentation, brand colors, generated images
- User needs: A PPT that explains the project to stakeholders

## Prerequisites

```bash
pip install python-pptx
```

## Core Pattern

### 1. Gather Project Information

- Project name and tagline
- Brand colors (palette)
- Key pain points and solutions
- Architecture/modules overview
- Visual assets (shot images, diagrams)
- Next steps/roadmap

### 2. PPT Structure Template

```
1. Title page
2. Pain points → Solutions
3. Architecture overview
4. Feature highlights (with visuals)
5. Technical details
6. Roadmap/next steps
7. Contact/Closing
```

### 3. Color Palette Usage

- **Primary**: Brand deep color (e.g., #10243f)
- **Secondary**: Supporting tone (e.g., #c9a24b)
- **Background**: Dark for titles, light for content
- **Text**: High contrast (white on dark, dark on light)

## Workflow

### Step 1: Generate Shot Images

If you have a video pipeline (like AI Station), generate shot images:

```python
# Use AI Station pipeline to generate branded visuals
POST /api/jobs { "script": "...", "brand_preset": "sushi_dr" }
# Extract shot_*.png from storage/<job_id>/
```

### Step 2: Extract Brand Information

```python
# Get brand preset
GET /api/brand → {"palette": {...}, "formula": "..."}
```

### Step 3: Create PPT Script

```python
from pptx import Presentation
from pptx.util import Inches, Pt
from pptx.enum.text import PP_ALIGN
from pptx.dml.color import RGBColor

# Define brand colors
DEEP_BLUE = RGBColor(0x10, 0x24, 0x3f)
WARM_GOLD = RGBColor(0xc9, 0xa2, 0x4b)
RICE_WHITE = RGBColor(0xf3, 0xed, 0xe1)
```

### Step 4: Build Slides

Each slide type:
- **Title**: Dark background, large title, subtitle
- **Problem/Solution**: 2-column table layout
- **Architecture**: Module cards with descriptions
- **Features**: Image + text side-by-side
- **Roadmap**: Timeline or milestone list

### Step 5: Add Visual Assets

```python
# Add shot images to slides
slide.shapes.add_picture("shot_1.png", Inches(0.5), Inches(1.5), 
                         width=Inches(6), height=Inches(5))
```

### Step 6: Save and Validate

```python
prs.save("output.pptx")
```

## Common Slide Templates

### Title Slide
```
Background: Deep blue
Title: Large white, bold
Subtitle: Gold accent
```

### Problem/Solution Table
```
2-column table
Left: Pain points (cold blue text)
Right: Solutions (green text)
```

### Architecture Cards
```
7 modules in 2x4 grid
Each card: Module name + description
Color-coded by type
```

### Feature Showcase
```
5 shots in 2x3 grid
Each: Image + DNA label
```

## Pitfalls

- **Don't use same layout twice** - vary column arrangements
- **Don't forget image credits** if using external assets
- **Text overflow** - check fit before finalizing
- **Inconsistent spacing** - use consistent margins (0.5")
- **Low contrast** - always check WCAG contrast ratios

## Related Skills

- `powerpoint` - Technical PPT manipulation
- `video-automation-pipeline` - Generate shot images from scripts
- `ai-station` - For AI Station specific project presentations
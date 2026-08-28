# ESG Image Generation Workflows

## When Browser Automation Fails: AI Image Generation Fallback

### Scenario
Browser automation (Puppeteer/Selenium/Browser-Use) fails due to:
- HTTP 402 Payment Required
- Browser daemon unavailable
- CAPTCHA/challenge wall blocking automation
- Environment restrictions (no headless browser support)

### Solution: AI Image Generation Workflow

#### Step 1: Audit Existing Assets
Use `vision_analyze` on each existing image to identify:
- Duplicate content (same scene, different angles)
- Missing content (blank templates, missing data)
- Quality issues (blurry, low-res)
- Content mismatches (wrong theme for section)

#### Step 2: Create Structured Specifications
For each replacement image, create a JSON spec containing:
```json
{
  "filename": "employee-feedback-replacement-desktop.png",
  "priority": "P1",
  "owner": "T17 Market Bee + T30 Quality Control Bee",
  "dimensions": "1024x768",
  "elements": [
    "3 employee testimonial cards with avatars",
    "5-star rating system",
    "ESG impact category badges",
    "Summary statistics (96% satisfaction, 12/12 participation)"
  ],
  "brand_colors": {
    "green": "#3c6e47",
    "gold": "#c9a24b", 
    "cream": "#f3ede1",
    "navy": "#10243f"
  },
  "language": "dual-zh-en",
  "font": "Noto Sans TC"
}
```

#### Step 3: Generate HTML Template
Create a full HTML template with:
- Brand colors as CSS variables
- Responsive grid layout
- Dual-language content (data-zh/data-en attributes)
- Real data content (not placeholders)

Example prompt structure:
```
[THEME] image - [BREAKPOINT] ([DIMENSIONS]). [SUBJECT] in [SETTTING]. 
[ACTION_DESCRIPTION]. [STYLE_DESCRIPTION]. FTG colors: green #3c6e47, 
gold #c9a24b, cream #f3ede1, navy #10243f. [LANGUAGE_REQUIREMENTS].
```

#### Step 4: Generate Images with image_generate Tool
Call `image_generate` for each breakpoint variant:
- Desktop: 1024x768 (`aspect_ratio: landscape`)
- Tablet: 768x1024 (`aspect_ratio: portrait`)
- Mobile: 480x800 (`aspect_ratio: portrait`)
- Compact: 360x640 (`aspect_ratio: portrait`)

Prompt template for soul-dialogue images:
```
ESG [THEME] image - [BREAKPOINT] ([DIMENSIONS]). [DETAILED_SUBJECT_DESCRIPTION]. 
[ACTION_DESCRIPTION]. [LIGHTING/STYLE]. FTG colors: green #3c6e47, 
gold #c9a24b, cream #f3ede1, navy #10243f. [LANGUAGE_TAGS].
```

#### Step 5: Batch Download with curl
```bash
cd /path/to/output/directory && \
curl -L -o "file1-desktop.png" "https://v3b.fal.media/..." && \
curl -L -o "file1-mobile.png" "https://v3b.fal.media/..." && \
curl -L -o "file1-tablet.png" "https://v3b.fal.media/..." && \
curl -L -o "file1-compact.png" "https://v3b.fal.media/..." && \
ls -lh *.png | wc -l  # Should match expected count
```

#### Step 6: Git Integration & Deployment
```bash
# Always check gitignore first
git add .gitignore  # if needed to update ignored patterns
git add -f path/to/generated/images/  # force-add if gitignored
git commit -m "feat(scope): [description of image changes]"
git push origin main
```

### Common Pitfalls
1. **Gitignore blocking generated assets**: Check `.gitignore` before committing. Use `git add -f` if necessary.
2. **Path issues in Git-Bash**: Use `/c/Project/...` for Git-Bash, `C:/Project/...` for Windows-native tools.
3. **File corruption during download**: Always verify image integrity with `file` command or size comparison.
4. **Commit conflicts**: Stash unrelated changes before pulling remote updates.

### Reference Implementation
Full ESG Impact Note remediation completed Aug 26, 2026:
- 6 replacement images generated (3 themes × desktop)
- 12 RWD variants generated (3 themes × 4 breakpoints)
- 15 spec files created (JSON + TypeScript constants)
- HTML templates + CSS integration completed
- Feedback form + API integration deployed

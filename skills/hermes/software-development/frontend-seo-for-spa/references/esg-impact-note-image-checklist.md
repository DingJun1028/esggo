# ESG Impact Note Image Validation Checklist

## Quick Audit Protocol

Use this checklist when validating images for any ESG Impact Note sub-page before deployment.

---

### 1. Content Completeness

| Check | Description | Pass Criteria |
|-------|-------------|---------------|
| ✅ Actual Content | Image is not a blank template or placeholder | Must see text, quotes, data, or specific content elements |
| ✅ Employee Photos (Feedback) | Human subjects with identifiable faces | At least 3 real employee photos visible |
| ✅ Action Items (Next Steps) | Specific tasks with owners/deadlines | Each item has: action, owner, timeline, status |
| ✅ Activity Data (Info Pages) | Concrete dates, participants, locations | Specific: DD/MM/YYYY, N people, exact venue |
| ✅ Data Visualization | Charts/infographics with real numbers | Not abstract shapes; actual metrics visible |
| ✅ ESG Alignment | Content maps to Environmental/Social/Governance | At least one pillar clearly represented |

### 2. Visual Quality

| Check | Description | Pass Criteria |
|-------|-------------|---------------|
| ✅ Brand Colors | Uses FTG palette (#3c6e47, #c9a24b, #f3ede1, #10243f) | No off-brand colors dominating |
| ✅ Resolution | Sharp at 1024px+ width | No pixelation when zoomed to 100% |
| ✅ Text Legibility | Text readable at all sizes | CJK text ≥ 14px, English ≥ 12px |
| ✅ Composition | Balanced layout, no clipping | All elements fully visible |
| ✅ Lighting | Consistent, professional lighting | No harsh shadows or overexposure |

### 3. Duplication Check

| Check | Description | Pass Criteria |
|-------|-------------|---------------|
| ✅ Filename Unique | No similar filenames across sections | Different base names, not just date suffixes |
| ✅ Visual Similarity | Use vision_analyze to compare | < 80% overlap with any other image |
| ✅ Scenario Match | Same people/location = duplicate | Different people, locations, or contexts |
| ✅ Content Match | Same data/text = duplicate | Each image conveys unique information |

### 4. Technical Requirements

| Check | Description | Pass Criteria |
|-------|-------------|---------------|
| ✅ RWD Sizes | Available at all 4 breakpoints | 1024×768, 768×1024, 480×800, 360×640 |
| ✅ File Format | PNG or WebP, not JPG | PNG preferred for text clarity |
| ✅ File Size | Optimized but not compressed | 500KB–2MB range for full-size |
| ✅ Hash Locked | SHA-256 recorded for traceability | Match recorded hash in deployment |

---

### 5. Session-Specific Notes (2026-08-27)

#### Images That Failed Content Audit:
1. **`ESG成果內容-後續改善與行動建議.png`** — ❌ Blank template, no action items
2. **`ESG成果內容-員工回饋與影像故事.png`** — ❌ Photo collage only, no quotes/data
3. **`成果內容-活動基本資訊與行程摘要.png`** — ⚠️ Unfilled itinerary, no dates/participants

#### Duplicate Pairs Detected:
1. `composer_2026-08-25_09-46-15-619_f2de9e.png` ≈ `composer_2026-08-25_09-46-15-821_d72e35.png` (same scene, different angle)
2. `composer_2026-08-25_09-46-15-619_f2de9e.png` ≈ `ESG Impact Note-頁首大橫幅.png` (similar theme: 3 people + mountain view)

#### Valid Replacement Added:
1. **`composer_2026-08-25_09-50-24-715_071c58.png`** — ✅ Approved for Employee Well-being Journey section
   - Shows 3 people reviewing photos in mountain lodge
   - Has nature + social connection elements
   - Not a duplicate of header (different composition, no meeting table)

---

### 6. Validation Script

```bash
# Run this after image curation
pnpm tsx apps/ftg-3.0/scripts/esg-image-gap-analysis.ts \
  --source-dir="C:/Users/dingj/Downloads/子網頁-ESG Impact Note-20260818T061000Z-1-001" \
  --validate-content \
  --check-duplicates \
  --verify-rwd \
  --report-path="apps/ftg-3.0/public/images/esg-impact-note/validation-report.json"
```

---
*Generated: 2026-08-27 | By: OA-Team 30 | 5T Protocol: Traceable • Trackable • Tangible • Transparent • Trustworthy*

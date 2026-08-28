# AI Video Content Verification Reference

## Overview

This document provides detailed guidance for the 7-gate verification workflow used to validate AI-generated video content against quality standards.

## Test Data Schema

```json
{
  "title": "影片標題",
  "metadata": {
    "style": "professor",
    "brand": "壽司博士",
    "duration": 180,
    "language": "zh-TW"
  },
  "scenes": [
    {"id": 1, "startTime": 0, "endTime": 10, "type": "intro"},
    {"id": 2, "startTime": 10, "endTime": 25, "type": "problem"}
  ],
  "dataCards": [
    {"value": 85, "year": 2023, "source": "聯合國永續發展報告"}
  ],
  "thresholds": [
    {"name": "取得能力", "color": "#3498db", "font": "Inter", "layout": "horizontal"}
  ],
  "broll": {
    "flagging": ["人本感良好"],
    "humanFeelScore": 4.2
  },
  "audio": {
    "realVoiceRatio": 0.35,
    "brollRatio": 0.55,
    "musicRatio": 0.10
  },
  "subVideos": [
    {"title": "問題解析", "duration": 75}
  ],
  "thresholdCard": {"single": true},
  "metrics": {
    "completionRate": 0.75,
    "factErrorRate": 0.005,
    "humanFeelScore": 4.2,
    "visualConsistency": 0.92
  }
}
```

## Running the Test Suite

```bash
cd /c/Project/aistation
python -m src.verify_video_content --data scripts/test-video-example.json
```

## Gate-by-Gate Validation Rules

### Gate 01: Script-to-Scene Mapping
- Scene count: 6-16 per minute
- Time codes: no overlap (endTime <= next.startTime)
- Content: matches script narration

### Gate 02: Data Card Accuracy
- Value: numeric, matches source data
- Year: 1900-2030 range
- Source: traceable to original document
- Comparison: clear visual indicator (arrow/color)

### Gate 03: Visual Consistency
- Threshold cards: same color palette
- Fonts: consistent family and size
- Layouts: identical structure
- Branding: logo/branding elements present

### Gate 04: B-roll Human Feel
- Flagging: no "機器感" (machine feeling)
- Flagging: no "恐懼" (fear)
- Flagging: no "悲情" (sadness)
- Diversity: multiple demographics represented

### Gate 05: Brand Authenticity
- Real voice ratio: >= 30%
- B-roll audio ratio: >= 50%
- Style: matches "professor" tone
- Visuals: consistent with brand archive

### Gate 06: Sub-video Extraction
- Count: exactly 4 sub-videos
- Length: 60-90 seconds each
- Content: no re-writing needed
- Threshold card: single image

### Gate 07: Final Anchor Metrics
- Completion rate: >= 70%
- Fact error rate: <= 1%
- Human feel score: >= 4/5
- Visual consistency: >= 90%

## Verification Script Location

- Test suite: `scripts/video-creation-test-suite.mjs`
- Example data: `scripts/test-video-example.json`
- Output report: `test-reports/evaluation-report.json`
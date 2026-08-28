# Project Introduction PPT - Example Script

This reference file documents the Python script pattern for creating project introduction PPTs using AI-generated shot images.

## Usage Example

```bash
python create_presentation.py
```

## Script Structure

```python
from pptx import Presentation
from pptx.util import Inches, Pt
from pptx.enum.text import PP_ALIGN
from pptx.dml.color import RGBColor
from pptx.enum.shapes import MSO_AUTO_SHAPE_TYPE
import os
```

## Brand Colors Definition

```python
DEEP_BLUE = RGBColor(0x10, 0x24, 0x3f)   # #10243f - 思考與專業
WARM_GOLD = RGBColor(0xc9, 0xa2, 0x4b)   # #c9a24b - 智慧與善意
RICE_WHITE = RGBColor(0xf3, 0xed, 0xe1)  # #f3ede1 - 人性與留白
GREEN = RGBColor(0x3c, 0x6e, 0x47)       # #3c6e47 - 生命與永續
COLD_BLUE = RGBColor(0x0a, 0x16, 0x26)   # #0a1626 - 張力 / 衝突
```

## Shot Data Structure

```python
shots = [
    {"label": "場景", "text": "AI Station 是一個全自動影音生產線", 
     "image": "storage/8299da940b98/shot_1.png", "color": DEEP_BLUE},
    {"label": "衝突", "text": "傳統影片製作需要數小時", 
     "image": "storage/8299da940b98/shot_2.png", "color": COLD_BLUE},
    ...
]
```

## Slide Generation Pattern

```python
for shot in shots:
    slide = prs.slides.add_slide(prs.slide_layouts[6])
    shape = slide.shapes.add_shape(MSO_AUTO_SHAPE_TYPE.RECTANGLE, 
                                   0, 0, prs.slide_width, prs.slide_height)
    shape.fill.solid()
    shape.fill.fore_color.rgb = shot["color"]
    
    # Add image
    if os.path.exists(shot["image"]):
        slide.shapes.add_picture(shot["image"], Inches(0.5), Inches(1.5),
                                 width=Inches(6), height=Inches(5))
    
    # Add text overlay
    txBox = slide.shapes.add_textbox(Inches(7.5), Inches(1.5), 
                                      Inches(5), Inches(5))
    tf = txBox.text_frame
    # ... add paragraphs
```

## Output

- 11 slides total
- 16:9 format (13.33" × 7.5")
- Brand-consistent design
- AI-generated shot images integrated

## Integration with AI Station

To generate shot images for a project introduction:

1. Submit a script to AI Station:
```bash
curl -X POST http://localhost:8000/api/jobs \
  -H "Content-Type: application/json" \
  -d '{"title": "Project Intro", "script": "...", "brand_preset": "sushi_dr"}'
```

2. Extract shot images from storage:
```
storage/<job_id>/shot_1.png
storage/<job_id>/shot_2.png
...
```

3. Run this script with the extracted images
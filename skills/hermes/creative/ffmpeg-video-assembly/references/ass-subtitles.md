# ASS Subtitle Builder (for ffmpeg `ass=` filter)

The `drawtext` filter is fragile with CJK (Chinese/Japanese/Korean) text and
punctuation. Always build an `.ass` file and reference it with the `ass=` filter
(see SKILL.md GOTCHA 1 & 2 — on Windows, run ffmpeg with `cwd=` the .ass dir and
pass the bare filename `ass=subs.ass`).

## Minimal ASS template (16:9 / 1080p)

```
[Script Info]
ScriptType: v4.00+
PlayResX: 1920
PlayResY: 1080

[V4+ Styles]
Format: Name, Fontname, Fontsize, PrimaryColour, BackColour, Bold, Italic, Underline, StrikeOut, ScaleX, ScaleY, Spacing, Angle, BorderStyle, Outline, Shadow, Alignment, MarginL, MarginR, MarginV, Encoding
Style: Default,Microsoft YaHei,48,&H00FFFFFF,&H99000000,-1,0,0,0,100,100,0,0,1,3,0,2,80,80,90,1

[Events]
Format: Layer, Start, End, Style, Name, MarginL, MarginR, MarginV, Effect, Text
Dialogue: 0,0:00:00.00,0:00:03.05,Default,,0,0,90,,第一句字幕
Dialogue: 0,0:00:03.05,0:00:06.10,Default,,0,0,90,,第二句字幕
```

## Field meanings (the ones you touch)
- `PlayResX/Y`: MUST match output resolution (1920×1080 or 1080×1920).
- `Fontname`: use a system CJK font NAME, not a path. On Windows:
  `Microsoft YaHei` (微軟雅黑, renders Traditional Chinese fine), `Microsoft
  JhengHei` (微軟正黑), or `Noto Sans CJK TC`. On Linux/macOS use `Noto Sans CJK`.
- `PrimaryColour` / `BackColour`: `&HAABBGGRR` (little-endian). `&H00FFFFFF`
  = white text; `&H99000000` = 60%-ish black box behind (for readability).
- `BorderStyle 1` = outline+shadow; `Outline 3` = 3px outline width.
- `Alignment 2` = bottom-center. Bottom margin `MarginV 90` lifts subs above
  the lower-third safe area.
- Time format: `H:MM:SS.cc` (cc = centiseconds). Helper below.

## Python builder (stagger captions across scene duration)

```python
def ass_time(sec: float) -> str:
    h = int(sec // 3600); m = int((sec % 3600)//60)
    s = int(sec % 60); cs = int((sec - int(sec))*100)
    return f"{h:d}:{m:02d}:{s:02d}.{cs:02d}"

def build_ass(captions: list[str], dur: float, out_path: str,
              aspect="16:9", font="Microsoft YaHei") -> None:
    W = 1920 if aspect == "16:9" else 1080
    H = 1080 if aspect == "16:9" else 1920
    fs = 48 if aspect == "16:9" else 64
    lines = ["[Script Info]", "ScriptType: v4.00+",
             f"PlayResX: {W}", f"PlayResY: {H}", "",
             "[V4+ Styles]",
             "Format: Name, Fontname, Fontsize, PrimaryColour, BackColour, "
             "Bold, Italic, Underline, StrikeOut, ScaleX, ScaleY, Spacing, "
             "Angle, BorderStyle, Outline, Shadow, Alignment, MarginL, "
             "MarginR, MarginV, Encoding",
             f"Style: Default,{font},{fs},&H00FFFFFF,&H99000000,-1,0,0,0,"
             "100,100,0,0,1,3,0,2,80,80,90,1", "", "[Events]",
             "Format: Layer, Start, End, Style, Name, MarginL, MarginR, "
             "MarginV, Effect, Text"]
    n = len(captions) or 1
    seg = dur / n
    for i, cap in enumerate(captions):
        start, end = i*seg, (i+1)*seg
        text = cap.replace("\n", "\\N").replace(",", "\\,")
        lines.append(f"Dialogue: 0,{ass_time(start)},{ass_time(end)},"
                     f"Default,,0,0,90,,{text}")
    with open(out_path, "w", encoding="utf-8") as f:
        f.write("\n".join(lines))
```

## Common failures
- Blank boxes instead of glyphs → font NAME wrong / not installed. Verify with a
  vision check of an extracted frame (see SKILL.md verification step).
- `ass=` parse error on Windows → drive-colon path (GOTCHA 2): use cwd + bare
  filename.

# ASS subtitle recipe (ffmpeg on Windows, CJK-safe)

Use ASS instead of `drawtext`. `drawtext=text='...'` breaks on `:` in Windows paths
and on CJK punctuation; ASS handles both natively.

## Build the .ass file in Python

```python
def build_ass(captions, duration, out_path, w=1920, h=1080, fs=48):
    # ASS colour is &HAABBGGRR (alpha, blue, green, red)
    def aarrggbb(rgb, alpha="00"):
        r, g, b = rgb
        return f"&H{alpha}{b:02X}{g:02X}{r:02X}"

    lines = [
        "[Script Info]", "ScriptType: v4.00+",
        f"PlayResX: {w}", f"PlayResY: {h}", "",
        "[V4+ Styles]",
        "Format: Name, Fontname, Fontsize, PrimaryColour, BackColour, Bold, Italic, "
        "Underline, StrikeOut, ScaleX, ScaleY, Spacing, Angle, BorderStyle, Outline, "
        "Shadow, Alignment, MarginL, MarginR, MarginV, Encoding",
        f"Style: Default,Microsoft YaHei,{fs},{aarrggbb((255,255,255))},&H99000000,"
        "-1,0,0,0,100,100,0,0,1,3,0,2,80,80,90,1",
        "",
        "[Events]",
        "Format: Layer, Start, End, Style, Name, MarginL, MarginR, MarginV, Effect, Text",
    ]
    n = len(captions) or 1
    seg = duration / n
    for i, cap in enumerate(captions):
        start = i * seg
        end = (i + 1) * seg
        text = cap.replace("\n", "\\N").replace(",", "\\,")  # escape comma first
        lines.append(f"Dialogue: 0,{_ts(start)},{_ts(end)},Default,,0,0,90,,{text}")
    out_path.write_text("\n".join(lines), encoding="utf-8")

def _ts(sec):  # h:mm:ss.cc
    h = int(sec // 3600); m = int((sec % 3600) // 60); s = int(sec % 60)
    cs = int(round((sec - int(sec)) * 100))
    return f"{h}:{m:02d}:{s:02d}.{cs:02d}"
```

## Apply it

```bash
# Reference by BARE FILENAME and run ffmpeg with cwd = the .ass dir.
# (the ass= filter still chokes on a C:/... absolute path even quoted)
ffmpeg -y -loop 1 -i scene.png -i scene.mp3 -vf "ass=subs_01.ass" \
  -c:v libx264 -pix_fmt yuv420p -c:a aac -b:a 192k -t 6.10 -r 30 -shortest clip_01.mp4
```

Run with `cwd=<dir containing subs_01.ass>`.

## Font notes
- On Windows use `"Microsoft YaHei"` (or `Microsoft JhengHei` for Traditional) by
  font *name* in ASS — no path needed, avoids the `:` path bug entirely.
- For `color=c=` lavfi source, colours are `0xRRGGBB` (NOT `&H...`): `color=c=0x0F172A`.

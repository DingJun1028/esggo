# Edge-TTS word-level boundaries → burned karaoke captions

## The one thing that bites everyone

`edge_tts.Communicate(text, voice)` defaults to `boundary="SentenceBoundary"`.
With the default you get `SentenceBoundary` chunks and **zero `WordBoundary`
chunks** — so you cannot build word-synced subtitles. You must pass:

```python
comm = edge_tts.Communicate(text, voice, boundary="WordBoundary")
```

Only then does `chunk["type"] == "WordBoundary"` fire inside the stream loop.

## Capturing boundaries

Offsets come in **100-ns ticks**, not seconds:

```python
_TICKS_PER_SEC = 10_000_000
boundaries = []
async for chunk in comm.stream():
    if chunk["type"] == "audio":
        f.write(chunk["data"])
    elif chunk["type"] == "WordBoundary":
        off = int(chunk["offset"]); dur = int(chunk["duration"])
        boundaries.append({
            "start": off / _TICKS_PER_SEC,
            "end":   (off + dur) / _TICKS_PER_SEC,
            "text":  chunk["text"],
        })
```

`boundaries` is then the input to the renderer (per the main skill's ffmpeg
`drawtext` step). Return it as a 3rd tuple element `(path, boundaries, silent)`
so rendering can burn captions and the pipeline can also emit a soft `.srt`.

## Burning them as karaoke-style captions (ffmpeg drawtext)

Per-word `drawtext` with a cumulative visible line and a per-word `enable`
window. Two escape rules are MANDATORY or ffmpeg parsing breaks:

1. **Font path colon** must be escaped: `"C\\:/Windows/Fonts/msyh.ttc"`
   (double backslash + escaped colon). On Linux use
   `"/usr/share/fonts/.../DejaVuSans.ttf"` (no colon, no escape needed).
2. **Caption text** must escape `:`, `,`, `%`, `'`, `\` → `\:` `\,` `\%` `\'` `\\`.

```python
_CAP_FONT = "C\\:/Windows/Fonts/msyh.ttc"
_CAP_OPTS = ("fontcolor=white:fontsize=44:box=1:boxcolor=black@0.55:"
             "boxborderw=14:line_spacing=8:alpha=0.95")

def _esc(t): return (t.replace("\\","\\\\").replace("'","\\'")
                      .replace(":","\\:").replace("%","\\%").replace(",","\\,"))

def caption_filter(boundaries):
    if not boundaries: return ""
    out = []
    for i, w in enumerate(boundaries):
        line = "".join(b["text"] for b in boundaries[:i+1]).strip()
        enable = f"between(t\\,{w['start']:.3f}\\,{w['end']:.3f})"
        out.append(
            f"drawtext=fontfile='{_CAP_FONT}':text='{_esc(line)}':"
            f"{_CAP_OPTS}:x=(w-text_w)/2:y=h-text_h-60:enable='{enable}'")
    return ",".join(out)
```

Filter result goes on the video `-vf` chain after ken-burns / trim. Each word
appears only during its spoken window, so captions track speech.

## Soft SRT alternative (optional, for players that prefer it)

`build_srt(boundaries)` highlights the current word with `<b>`: each cue is
`idx`, `HH:MM:SS,mmm --> HH:MM:SS,mmm`, and the cumulative line with the
current word wrapped in `<b>...</b>`. Return `""` when no boundaries.

## CI note

The renderer calls `ffprobe` for audio duration. In CI / sandbox that binary
may be absent → `FileNotFoundError`. Wrap the call so a missing/!0 ffprobe
returns a safe fallback (e.g. `4.0`):

```python
def audio_duration(path):
    try:
        out = subprocess.run([...ffprobe...], capture_output=True, text=True, check=True).stdout
        return max(1.0, float(json.loads(out)["format"]["duration"]))
    except Exception:
        return 4.0
```

And `pip install ffmpeg` is NOT a thing — in GitHub Actions use
`sudo apt-get install -y ffmpeg` before running tests that exercise the
full pipeline (FastAPI webhook tests that render end-to-end need ffmpeg).

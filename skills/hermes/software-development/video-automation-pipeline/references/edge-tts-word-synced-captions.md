# Word-synced captions via edge-tts WordBoundary (no .ass file)

For "壓製字幕" (burn subtitles) in a script→video pipeline, edge-tts can hand
you word-level timings so captions highlight in sync with speech. This is
simpler than generating an `.ass`/`.srt` + `subtitles` filter and needs no
external font layout engine.

## 1. Capture word boundaries from edge-tts

`edge_tts.Communicate` defaults to `boundary="SentenceBoundary"`, which emits
NO word-level data. You MUST request `boundary="WordBoundary"`:

```python
import asyncio, edge_tts
_TICKS = 10_000_000  # edge-tts offsets are in 100-ns ticks

def _tts_edge(text, out_path):
    bounds = []
    async def run():
        comm = edge_tts.Communicate(text, "zh-TW-HsiaoChenNeural",
                                    boundary="WordBoundary")
        with open(out_path, "wb") as f:
            async for chunk in comm.stream():
                if chunk["type"] == "audio":
                    f.write(chunk["data"])
                elif chunk["type"] == "WordBoundary":
                    off = int(chunk["offset"]); dur = int(chunk["duration"])
                    bounds.append({
                        "start": off / _TICKS,
                        "end": (off + dur) / _TICKS,
                        "text": chunk["text"],
                    })
    asyncio.run(run())
    return out_path, bounds
```

`synthesize()` should return `(path, boundaries, silent)` so the renderer can
burn captions and the orchestrator can store them. Keep the silent-audio
fallback (ffmpeg `anullsrc`) when the network TTS endpoint is unreachable —
then `boundaries` is `[]` and the caption filter is skipped.

## 2. Burn synced captions with ffmpeg drawtext

Build one `drawtext` per word; each is `enable='between(t,start,end)'` and
draws the accumulated line of all words spoken so far (karaoke style):

```python
_CAP_FONT = "C\\:/Windows/Fonts/msyh.ttc"  # NOTE the escaped colon \\:
_CAP_OPTS = ("fontcolor=white:fontsize=44:box=1:boxcolor=black@0.55:"
             "boxborderw=14:line_spacing=8:alpha=0.95")

def _esc(t):  # drawtext text-expansion escaping
    return (t.replace("\\", "\\\\").replace("'", "\\'")
             .replace(":", "\\:").replace("%", "\\%").replace(",", "\\,"))

def caption_filter(bounds):
    nodes = []
    for i, w in enumerate(b for b in bounds if b["text"].strip()):
        line = "".join(b["text"] for b in bounds[:i+1]).strip()
        enable = f"between(t\\,{w['start']:.3f}\\,{w['end']:.3f})"
        nodes.append(
            f"drawtext=fontfile='{_CAP_FONT}':text='{_esc(line)}':"
            f"{_CAP_OPTS}:x=(w-text_w)/2:y=h-text_h-60:enable='{enable}'")
    return ",".join(nodes)
```

Append the returned string to the per-shot video filter (after ken-burns
`zoompan`/`trim`/`fade`). If `bounds` is empty, omit it.

## 3. Gotchas

- **Don't also draw a static caption on the background frame.** If the
  Pillow/visuals stage prints the caption text AND you burn synced subtitles,
  you get doubled text in the frame. Pick one: burn synced captions, keep the
  frame clean (a progress pill is fine).
- The `C:/...` font path colon MUST be escaped as `C\:/...` inside the ffmpeg
  filter or parsing breaks (same root cause as the ASS `:` pitfall).
- For CJK, ship a CJK-capable font in the image (e.g. `fonts-noto-cjk` on
  Linux; `msyh.ttc` on Windows) — otherwise drawtext renders tofu boxes.
- ASS subtitles (`subtitles=file.ass`) remain the better choice for complex
  styling/multi-line positioning; `drawtext`+WordBoundary wins on simplicity
  and zero extra file generation for plain karaoke captions.

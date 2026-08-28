# Brand Preset Integration — recipe

Turn a brand / channel-planning bible into a **first-class, swappable pipeline
preset** so videos come out on-brand without re-explaining the brand every run.

## When to use
User says "integrate this channel plan / brand bible into the pipeline", or wants
every generated video to carry a fixed palette, intro slate, content formula, and
series registry.

## Module shape (`src/brand.py`)
```python
PALETTE = {"deep_blue": "#10243f", "warm_gold": "#c9a24b", "rice_white": "#f3ede1", "green": "#3c6e47"}
BRAND = {
    "preset": "sushi_dr",
    "name": "創價未來｜壽司博士 Dr. Source",
    "tagline": "看懂變局，創造價值，帶著人性前行。",
    "palette": PALETTE,
    "formula": "場景 → 衝突 → 洞察 → 方法 → 反思",
    "constitution": ["必須有原創判斷", "..."],
    "forbidden_ai_visuals": ["藍紫霓虹", "機器人大腦", "漂浮數據"],
}
DNA_PALETTES = {
    "場景": (PALETTE["deep_blue"], PALETTE["warm_gold"], "scene"),
    "衝突": (PALETTE["cold_blue"], "#2a3a5c", "conflict"),
    "洞察": (PALETTE["deep_blue"], PALETTE["warm_gold"], "insight"),
    "方法": (PALETTE["green"], "#1c3a2a", "method"),
    "反思": ("#2a2418", PALETTE["warm_gold"], "reflection"),
}
DEFAULT_THEME = (PALETTE["deep_blue"], "#2a3a5c", "brand")
SERIES = {"創價實驗室": {"lane": "核心主航道", "...": "..."}, "...": "..."}   # 10+ product lines
SEED_TOPICS = [{"title": "...", "series": "...", "judgment": "..."}, "..."]    # 6 first-quarter 母題
```

## Script-DNA parser (priority over OpenAI)
```python
import re
pattern = re.compile(
    r"[\[【]\s*(場景|衝突|洞察|方法|反思)\s*[\]】]\s*[:：]?\s*(.*?)"
    r"(?=[\[【](?:場景|衝突|洞察|方法|反思)[\]】]|$)", re.S)
def parse_dna(script):
    beats = [(m.group(1), m.group(2).strip()) for m in pattern.finditer(script) if m.group(2).strip()]
    return beats or None
```
`parser.parse_dna_script` -> one `Shot` per beat, theme = `dna_palette(label)`.
`parser.parse_script` calls DNA first, then OpenAI, then free splitter.

## Intro slate (renderer)
```python
def make_brand_intro(preset="sushi_dr", out=None):
    b = get_brand(preset)
    out = out or (Path(tempfile.mkdtemp()) / "brand_intro.mp4")   # NEVER default to CWD
    # draw b["name"] + b["tagline"] on b["palette"]["deep_blue"], gold band
    # ffmpeg -loop 1 -i tmp -f lavfi -i anullsrc -t 2.4 ...  (silent aac track = required for concat)
```
`render_final(shot_clips, video_out, shots, brand_preset=None)` prepends intro via
`make_brand_intro(brand_preset, out=video_out.parent / "brand_intro.mp4")`.

## API plumbing
- `ScriptIn.brand_preset: str | None = None` and `WebhookIn.brand_preset` on both
  `POST /api/jobs` and `POST /webhook/n8n`; forward to `enqueue(...)`.
- `enqueue(script, title, brand_preset=None)` -> `run_pipeline(..., brand_preset=...)` ->
  `renderer.render_final(..., brand_preset=brand_preset)`.
- `GET /api/brand?preset=sushi_dr` -> `brand.get_brand(...)`.
- `GET /api/series` -> `{"brand", "formula", "series": brand.SERIES, "seed_topics": brand.SEED_TOPICS}`.

## Verify (pytest)
- `parse_dna` returns `['場景','衝突','洞察','方法','反思']` for a marked script; `None` for a plain one.
- `parser.parse_script(marked)` -> `len==5`, `shots[0].theme[2]=='scene'`, `shots[-1].theme[2]=='reflection'`.
- `TestClient(app.app).post("/api/jobs", json={"script": marked, "brand_preset":"sushi_dr"})` -> 200.
- e2e: `enqueue(marked, title, brand_preset="sushi_dr")` produces an MP4; ffprobe shows duration ~= intro(2.4s) + sum(shot durations).

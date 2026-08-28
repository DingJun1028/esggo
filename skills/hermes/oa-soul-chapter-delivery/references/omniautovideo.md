# OmniAutoVideo 萬能自動影音 Integration Notes

## What was built (session summary)

Integrated OmniAutoVideo 萬能自動影音 UI settings into the existing aistation pipeline:

### Config additions (`src/config.py`)
- `VIDEO_RATIO` — `"16:9"` (default) or `"9:16"` (vertical portrait); auto-flips width/height to 1080×1920
- `MAX_SHOT_DURATION` — `3.0` (OmniAutoVideo's per-clip ceiling); parser splits longer narrations
- `KEN_BURNS_ZOOM` — `1.08` (configurable subtle zoom for still-image shots)
- `AZURE_VOICE` / `AZURE_VOICE_STYLE` / `AZURE_STYLE_TEXT` — Azure TTS V1 voice selection fields
- `EDGE_VOICE` — resolves to `AZURE_VOICE` or falls back to `zh-TW-HsiaoChenNeural`
- `EDGE_VOICE_EN` — bilingual English fallback (e.g., `en-US-AriaNeural`)

### TTS enhancements (`src/tts.py`)
- `EDGE_VOICE` now imported from config (was hardcoded)
- New `synthesize_with_voice(text, out_path, voice=None, style_name=None, style_text=None)` — per-call voice override
- Azure neural voices spoken natively by edge-tts (no Azure REST key needed)

### Parser enhancements (`src/parser.py`)
- New `_split_long_narration(narration, max_duration)` — splits narrations exceeding `MAX_SHOT_DURATION` at sentence/word boundaries
- `parse_free()` and `parse_dna_script()` both call `_split_long_narration()` on each segment
- `_CHARS_PER_SEC = 8` heuristic for duration estimation

### Pipeline enhancements (`src/pipeline.py`)
- `run_pipeline()`, `enqueue()`, `submit()` all accept `voice`, `style_name`, `style_text` params
- TTS calls now use `synthesize_with_voice()` instead of `synthesize()`

### API endpoints (`src/app.py`)
- `GET /api/config` — returns full config: `tts_engine`, `tts_voice`, `video_ratio`, `available_voices`, `brand_presets`, `features`
- `POST /webhook/mpt` — accepts `{title, text/script, voice, style_name, style_text, brand_preset, video_ratio}`; renders synchronously via `enqueue()` only (not `submit()` — that was a bug)

### Tests added (`tests/test_aistation.py`)
8 new test cases covering: 3s splitting, DNA segment splitting, Azure voice resolution, voice override synthesis (mocked), config endpoint, MPT webhook success + empty-body rejection. All 8 pass.

## Brand preset
WallClock: `zh-TW-HsiaoChenNeural` (female), 1.0x rate, 100% volume — matches OmniAutoVideo's default UI.

## Free-tier by default
All OmniAutoVideo features work with zero API keys:
- TTS: edge-tts (Microsoft, no key)
- Visuals: Pillow gradient + ffmpeg ken-burns
- Storage: local ./storage/
- Provenance: SQLite jobs.db

Paid upgrades (ElevenLabs, Runway, S3, NCBDB) activate when env vars are present.

## Pitfalls encountered (session-specific)
- `patch` tool escape-drift on multi-quote strings → fall back to `terminal` + `python3 << PYEOF`
- `monkeypatch.setattr` on config values doesn't affect module-level imports already bound → patch the function itself
- `_split_long_narration` needs sentence-ending punctuation (`。` / `!` / `?`) to split — comma-only text stays intact
- Webhook endpoint must NOT call both `submit()` and `enqueue()` — `enqueue()` is the synchronous path
- Missing `from pydantic import BaseModel` when adding new Pydantic models → `NameError` at import time
- `_split_long_narration` must be defined AFTER `_split_sentences` in the module — Python doesn't catch the forward reference at definition time
- `sed -i 's/old/new/g'` on Python source with escape sequences corrupts `\n` → use `patch` tool or Python scripts instead

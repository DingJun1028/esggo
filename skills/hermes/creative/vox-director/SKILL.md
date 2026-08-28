---
name: vox-director
description: "Vox Director: script→TTS→visuals→render→publish pipeline."
tags: ["video", "director", "pipeline", "brand", "TTS", "cinematic"]
---

# Vox Director — AI Video Director Skill

## Overview
A cinematic video production pipeline that turns a script into a polished, brand-consistent video with AI narration, visuals, transitions, and burned-in subtitles. Built on ffmpeg + edge-tts + Pillow, with pluggable cloud backends.

## Pipeline Stages
1. **Script Parse** → structured scenes with DNA markers
2. **TTS Synthesis** → edge-tts (default) or ElevenLabs/Runway
3. **Visual Generation** → Pillow gradients, Runway B-roll, or image sequences
4. **Cinematic Render** → per-scene clips with transitions + karaoke captions
5. **Brand Intro** → optional sushi_dr-style brand slate
6. **Concat + Mux** → final H.264/1080p + AAC/48000Hz MP4
7. **Publish** → local storage + optional S3/Cloudflare R2

## Brand Presets
- **sushi_dr**: emerald/teal palette, 6 seed mu, DNA markers (【場景】【衝突】【洞察】【方法】【反思】)
- **vox-director**: cinematic widescreen, dramatic lighting, word-synced captions

## Key Config (config.py)
```python
VIDEO_WIDTH = 1920
VIDEO_HEIGHT = 1080
VIDEO_FPS = 30
AUDIO_SAMPLE_RATE = 48000
```

## Renderer Specs (renderer.py)
- H.264 video codec, AAC audio @ 192kbps, 48000Hz
- `-ar 48000` on all audio streams (avoid 44100/48000混用)
- `-movflags +faststart` for web streaming
- ASS subtitles for CJK (avoid drawtext colon bug on Windows)
- Silent audio track on intro/outro to prevent concat audio drop

## Windows Pitfalls (same as ffmpeg-video-automation)
- drawtext colon bug → use ASS subtitles
- concat audio drop → silent audio on all segments
- in-place edit → render to temp, then Path.replace()
- http.server breaks edge-tts → use FastAPI/uvicorn

## Verification
- ffprobe: `h264,video,1920,1080,` + `aac,audio,,,48000`
- pytest: 25+ pass, 1 fail (PermissionError, non-fatal)
- Git: commit + push with CI Docker build

## Related Skills
- ffmpeg-video-automation (base pipeline)
- omni-auto (FastAPI orchestration)
- esggo-oa-team-swarm (30-agent swarm deployment)
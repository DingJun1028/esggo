---
name: ffmpeg-video-assembly
description: Assemble videos from still images + narration audio (TTS) + burned-in subtitles using the ffmpeg CLI — for YouTube / Shorts / Reels / TikTok content automation, narrated slideshows, and AI media pipelines. Covers robust CJK subtitle burning via ASS, image-to-video, concat, and YouTube-upload-compatible encoding. Includes Windows-specific gotchas that silently break draws.
---

# ffmpeg Video Assembly

Use when building any video from still images + audio clips, adding burned-in
subtitles (especially CJK — Chinese / Japanese / Korean), and producing
YouTube- or social-upload-ready MP4s. This is the "render engine" layer of an AI
content pipeline:  script → TTS → per-scene image → ffmpeg render → MP4.

## When to use
- Turn a list of images + audio clips into a narrated video.
- Burn subtitles/captions into the frames (hard subs), not soft subs.
- Produce 16:9 (YouTube) or 9:16 (Shorts / Reels / TikTok) output.
- Any "automated video production line" where each scene = 1 image + 1 voiceover.

## Core recipe (image held for the audio duration + burned subtitles)

Per scene:
```bash
ffmpeg -y -loop 1 -i scene.png -i scene.mp3 \
  -vf "ass=subs.ass" \
  -c:v libx264 -pix_fmt yuv420p -c:a aac -b:a 192k \
  -t <duration_seconds> -r 30 -shortest clip.mp4
```
Concatenate clips:
```bash
ffmpeg -y -f concat -safe 0 -i concat.txt \
  -c:v libx264 -pix_fmt yuv420p -c:a aac -b:a 192k \
  -movflags +faststart out.mp4
```
`concat.txt` lines: `file 'clip_01.mp4'` (one per clip, posix/forward-slash paths).

## CRITICAL GOTCHA 1 — subtitles: use ASS, NOT drawtext
The `drawtext` filter breaks on CJK text and on quotes / colons / commas inside
the text string. Escaping Chinese punctuation + apostrophes is a losing battle
and fails unpredictably. Instead:
- Generate an `.ass` subtitle file (libass). It natively supports CJK glyphs,
  outline, background box, positioning, and per-line timing windows.
- Reference fonts by **NAME** (e.g. `Microsoft YaHei`, `Noto Sans CJK`) not file
  path — avoids path-colon issues entirely.
- See `references/ass-subtitles.md` for a working ASS template + Python builder.

## CRITICAL GOTCHA 2 — Windows: `ass=` filter chokes on the `C:` drive path
ffmpeg parses `ass=C:/path/subs.ass` as `ass=<option>:<value>` and throws:
`Unable to parse "original_size" option value "/path/subs.ass" as image size`.
FIX: run ffmpeg with `cwd=<directory containing subs.ass>` and pass
`-vf "ass=subs.ass"` (bare filename, no drive colon). The `-i` input paths can
stay absolute — only the filter ARGUMENT is parsed as `key:value`. In Python
`asyncio.create_subprocess_exec(..., cwd=str(video_dir))`.

## YouTube-compatible encoding flags (always include)
- `-c:v libx264 -pix_fmt yuv420p`  (yuv420p = broadest device/browser playback)
- `-c:a aac -b:a 192k`
- `-movflags +faststart`  (enables streaming / web playback)
- Resolution: 16:9 → 1920×1080 ; 9:16 → 1080×1920 (bake into the source images)
- `-r 30`

## Free TTS that actually works (no API key): edge-tts
`pip install edge-tts`
```bash
python -m edge_tts --voice zh-TW-HsiaoChenNeural --text "..." --write-media out.mp3
```
Real neural Chinese voice, free, needs network. Other voices:
`zh-TW-YunJheOptionalNeural`, `zh-CN-XiaoxiaoNeural`. Probe clip duration with
`ffprobe -v error -show_entries format=duration -of json file.mp3`.

## Verification — never claim success without it
1. Run `ffprobe` and assert `vcodec=h264`, `width/height` match target,
   `duration>0`. Reusable probe: `scripts/verify_mp4.py <file.mp4>`.
2. Extract one frame (`ffmpeg -ss 2 -i out.mp4 -frames:v 1 frame.png`) and
   **vision-check** that subtitles actually rendered — CJK glyphs can silently
   fail (missing font) and produce blank boxes.

## Pitfalls
- `drawtext` with CJK → switch to ASS (GOTCHA 1).
- Windows `ass=` drive path → cwd + bare filename (GOTCHA 2).
- Forgetting `-pix_fmt yuv420p` → video won't play on some devices/browsers.
- `-shortest` is REQUIRED when looping a still image (image loop is infinite,
  audio is finite).
- ASS `PlayResX/Y` must match the output resolution or font sizes look wrong.
- Optional bg music: `amix` the narration (vol 1.0) with music (vol ~0.25),
  `duration=first` so it ends with the video, `map 0:v` for video.

## Support files in this skill
- `references/ass-subtitles.md` — full ASS template + Python builder for
  staggered CJK captions (use instead of `drawtext`).
- `scripts/verify_mp4.py` — reusable ffprobe assertion: run after every render
  to prove h264/1920×1080/aac/duration before claiming success.

# ffmpeg per-shot ken-burns render (FastAPI control-center build)

Proven recipe from the `aistation` AI-Station build. Each shot = one still
background image + one TTS audio file. We animate the still with a slow
zoom/pan for motion (no video-generation needed), fit it to the audio
duration, then concat all shots into one MP4.

## Reliable per-shot filter (handles any 16:9 still)

This filter worked where a `zoompan`/`crop` combo produced empty output —
`zoompan` alone (no `crop`) + `trim` + `setpts` + `fade` is robust:

```
scale=W*2:H*2,
zoompan=z='min(<zoom>,1.5)':d=1:x='iw/2':y='ih/2':s=WxH,
trim=duration=<DUR>,setpts=PTS-STARTPTS,
fade=t=in:st=0:d=0.3,fade=t=out:st=<DUR-0.3>:d=0.3,
format=yuv420p
```

where `W,H` = 1280,720 (or your render res), `<zoom>` = e.g. `1.08`..`1.16`
(gentle per-shot variation), `<DUR>` = audio duration from ffprobe
(`max(1.0, float)`), and the out-fade start = `max(0, DUR-0.3)`.

Per-shot command:

```bat
ffmpeg -y -loop 1 -i shot_%d.png -i shot_%d.mp3 ^
  -c:v libx264 -pix_fmt yuv420p ^
  -vf "<filter above>" ^
  -c:a aac -b:a 192k -t <DUR> -shortest clip_%d.mp4
```

## Concat all shots (filter_complex, keeps audio)

```bat
ffmpeg -y -i clip_1.mp4 -i clip_2.mp4 -i clip_3.mp4 ^
  -filter_complex "[0:v][0:a][1:v][1:a][2:v][2:a]concat=n=3:v=1:a=1[outv][outa]" ^
  -map "[outv]" -map "[outa]" ^
  -c:v libx264 -pix_fmt yuv420p -c:a aac -b:a 192k ^
  -movflags +faststart final.mp4
```

`n` = number of clips. concat demuxer also works but the filter_complex form
avoids the audio-drop class when all clips already have audio (they do).

## Gotchas avoided
- Do NOT combine `zoompan` with a manual `crop` of the scaled image — the
  crop offsets pushed the sample window off-frame and produced a 0-byte/black
  clip. `zoompan` with `s=WxH` rescales internally; drop the `crop`.
- Always append `format=yuv420p` for browser/YouTube compatibility.
- `-shortest` + explicit `-t <DUR>` both guard against a stuck loop on
  `-loop 1` input images.
- Verify: `ffprobe -v error -show_entries stream=codec_type -of default=noprint_wrappers=1 final.mp4` → must show `video` AND `audio`.

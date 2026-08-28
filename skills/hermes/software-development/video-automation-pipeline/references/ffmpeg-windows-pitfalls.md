# ffmpeg on Windows — pitfalls & exact fixes

Collected while building a 7-layer YouTube automation pipeline (ffmpeg 8.1.2 on
Windows 10, CJK subtitles). Each entry has the real error string and the fix.

## 1. `ass=` / `drawtext=` chokes on `C:/` drive colon
Error:
```
[Parsed_ass_0] Unable to parse "original_size" option value "/Project/.../subs_01.ass" as image size
[fc] Error applying option 'original_size' to filter 'ass': Invalid argument
```
Cause: ffmpeg interprets `:` as an option separator, so `ass=C:/x.ass` breaks.
Fix: reference by **bare filename** and run with `cwd=` set to the asset dir.
```python
cmd = [ffmpeg, "-y", "-loop","1","-i", img, "-i", audio,
       "-vf", f"ass={ass.name}", ...]   # ass.name, NOT full path
await _run(cmd, cwd=str(asset_dir))
```
Same applies to `drawtext=fontfile='C:/...'`. **Prefer ASS subtitles over
drawtext** for CJK — ASS handles fonts/outline/positioning without shell-escaping.

## 2. ASS colour vs ffmpeg color filter format
- ASS `&HAABBGGRR` (alpha, Blue, Green, Red). E.g. slate-900 `(15,23,42)` → `&H0F000F172A`? compute: `&H` + `00`(alpha) + `2A`(B) + `17`(G) + `0F`(R) = `&H002A170F`.
- `color=c=` filter wants `0xRRGGBB` → `0x0F172A`.
Mixing them ⇒ `Cannot find color 'H002A170F'`. Use the correct form per context.

## 3. concat demuxer drops audio when stream counts mismatch
Symptom: final MP4 has only a video stream, no audio, after
`ffmpeg -f concat ... -c:v libx264 ... -c:a aac`.
Cause: intro/outro clips had video-only; scene clips had video+audio.
Fix: give the intro/outro a silent `aac` track before concat:
```python
# generate silent audio and mux into the clip
["ffmpeg","-y","-i",clip,
 "-f","lavfi","-i","anullsrc=r=24000:cl=mono",
 "-t",f"{dur:.2f}","-c:v","copy","-c:a","aac","-b:a","192k","-shortest",tmp]
```

## 4. ffmpeg cannot edit in-place
Error: `Output file ... same as Input ... exiting` / `FFmpeg cannot edit existing
files in-place`.
Fix: render to a temp file, then `tmp.replace(out)`. **Remember**:
`a.replace(b)` renames **a → b** (the easy-to-swamp direction). Use `tmp.replace(out)`.

## 5. Mixing voice + looped background music
```python
["ffmpeg","-y","-i",raw,"-stream_loop","-1","-i",music,
 "-filter_complex",
 f"[0:a]volume=1.0[voice];[1:a]volume={vol}[bg];"
 "[voice][bg]amix=inputs=2:duration=first:dropout_transition=2[aout]",
 "-map","0:v","-map","[aout]","-c:v","copy","-c:a","aac","-b:a","192k",
 "-movflags","+faststart",out]
```

## 6. Verify the output (regression guard)
```bash
ffprobe -v error -show_entries format=duration:stream=codec_name,codec_type,width,height -of json out.mp4
# expect: video h264, width 1920 (or 1080 for 9:16), audio aac
```

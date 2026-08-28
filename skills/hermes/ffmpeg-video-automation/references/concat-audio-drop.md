# concat demuxer drops audio when stream counts mismatch

## Symptom
Final MP4 has only a video stream (no `aac`/audio), even though each scene clip has
audio. `ffprobe` shows `stream=video` only.

## Root cause
The `concat` demuxer (`ffmpeg -f concat -i list.txt`) requires every segment to have
the **same number of streams in the same order**. If scene clips are `video+audio`
but a generated intro/outro clip is `video` only (no audio track), the demuxer cannot
align streams and silently emits video-only (or errors, or drops the audio).

## Fix: give intro/outro a silent audio track
Generate the branded clip, then mux a silent track onto it before concat:

```bash
# 1) make the visual intro (video only)
ffmpeg -y -f lavfi -i "color=c=0x0F172A:s=1920x1080:r=30" -vf "ass=intro.ass" \
  -t 4.00 -r 30 -pix_fmt yuv420p -c:v libx264 intro.mp4

# 2) add a silent aac track (render to a TEMP file first — ffmpeg can't edit in place)
ffmpeg -y -i intro.mp4 -f lavfi -i "anullsrc=r=24000:cl=mono" \
  -t 4.00 -c:v copy -c:a aac -b:a 192k -shortest intro_tmp.mp4

# 3) rename temp -> final  (Path.replace(target) renames SELF to target)
#    correct:  tmp.replace(out)
#    wrong:    out.replace(tmp)   # this deletes out, keeps tmp under out's name path only on success
```

Now every concat segment is `video+audio` and the audio survives.

## Alternative
Use the `concat` *filter* (`-filter_complex "[0:v][0:a][1:v][1:a]concat=n=2:v=1:a=1"`) which
is more tolerant, but the silent-track approach is simpler and works with the demuxer.

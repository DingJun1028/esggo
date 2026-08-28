# Vox Director Pipeline Reference

## Full Pipeline Execution

### Prerequisites
- Python 3.10+
- ffmpeg (H.264/AAC encoder)
- edge-tts (CJK neural TTS)
- Pillow + numpy (visual generation)
- ASS subtitle support

### Execution Command
```bash
python scripts/vox_director_pipeline.py "<script_text>" "<output_name>.mp4"
```

### Example
```bash
python scripts/vox_director_pipeline.py "【場景】創價未來 VIP 影片開場" "創價未來_VIP.mp4"
```

### Output Verification
```bash
ffprobe -v error -show_entries stream=codec_name,codec_type,width,height,sample_rate -of csv output.mp4
```

Expected output:
- Video stream: `h264,video,1920,1080,`
- Audio stream: `aac,audio,,,48000`

### Windows Pitfalls (same as ffmpeg-video-automation)
1. drawtext colon bug → use ASS subtitles
2. concat audio drop → silent audio on all segments
3. in-place edit → render to temp, then Path.replace()
4. http.server breaks edge-tts → use FastAPI/uvicorn
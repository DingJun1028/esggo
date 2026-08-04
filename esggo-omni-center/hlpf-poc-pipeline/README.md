# HLPF POC Pipeline

Deep Research → Video Preview pipeline for ESG-GO OA-Team-30.

## Overview

This pipeline takes a `beats.json` definition file and produces:
1. **Poster images** (PNG) for each scene
2. **TTS audio** (MP3) for each scene
3. **Assembled video** (MP4) combining posters + audio

## Endpoints

| Method | Path | Description |
|--------|------|-------------|
| GET | `/api/health` | Health check + beat count |
| GET | `/api/beats` | Returns beats.json content |
| POST | `/api/jobs` | Runs the full pipeline |

## Running

```bash
go.bat          # Windows: full pipeline
python runner.py # Python: delegates to go.bat
```

## Output

- `job_result.json` — persisted job result
- `out/<project>/<title>/final.mp4` — assembled video
- `out/<project>/<title>/C01.png` through `C04.png` — poster images
- `out/<project>/<title>/C01.mp3` through `C04.mp3` — TTS audio
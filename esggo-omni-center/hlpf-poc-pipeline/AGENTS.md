# HLPF POC Pipeline

HLPF (High-Level Planning Framework) POC pipeline for ESG-GO OA-Team-30.
Generates video previews from beats.json definitions using FastAPI + edge-tts + ffmpeg.

## Quick Start

```bash
# Run the full pipeline
go.bat

# Or use Python runner
python runner.py
```

## Architecture

- `app.py` — FastAPI server (port 8082)
  - `GET /api/health` — health check
  - `GET /api/beats` — returns beats.json content
  - `POST /api/jobs` — renders posters + TTS + assembles final.mp4
- `src/visual.py` — poster renderer (Pillow, 1920x1080)
- `src/config.py` — settings (out_root, tts_provider, etc.)
- `go.bat` — canonical entry point (kill old → install → start → probe → verify)
- `runner.py` — cron runner (delegates to go.bat)
- `hlpf_runner.py` — backward-compatible wrapper for Hermes cron

## Output

- `job_result.json` — persisted job results (created by POST /api/jobs)
- `out/<project>/<title>/` — generated posters, audio, and final.mp4

## Configuration

- `beats.json` — scene definitions (project root: `C:\Project\esggo-learning-center\beats.json`)
- `.env` — environment variables (optional)
- `pyproject.toml` — Python project config

## Scripts

| Script | Purpose |
|--------|---------|
| `go.bat` | Canonical one-shot pipeline entry point |
| `run_poc.bat` | Alias for go.bat |
| `run_poc.ps1` | PowerShell alias for go.bat |
| `run_poc_auto.ps1` | PowerShell alias for go.bat |
| `runner.py` | Python cron runner (calls go.bat) |
| `hlpf_runner.py` | Backward-compatible wrapper (calls runner.py) |

## Notes

- All subprocess calls use `encoding="utf-8", errors="replace"` for robustness
- Job results are persisted to `job_result.json` after each successful run
- The `out/` directory is created automatically by the pipeline
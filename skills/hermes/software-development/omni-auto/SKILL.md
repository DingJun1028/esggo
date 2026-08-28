---
name: omni-auto
description: >
  Build, extend, and verify the OmniAuto video-generation pipeline (DingJun1028/OmniAuto)
  — a FastAPI control center over a 7-module pipeline (parse to TTS to visuals to render
  to publish to provenance) that runs fully FREE locally (edge-tts + ffmpeg + Pillow)
  with pluggable cloud keys (ElevenLabs / Runway / S3 / OpenAI / NCBDB). Also covers
  the sushi_dr brand preset, the esggo-cli tool, and the recurring "全域最佳實踐 TODO" /
  "增量優化" MECE loop.
tags: []
related_skills: []
triggers:
  - "omniauto / OmniAuto"
  - "omni-auto"
  - "壽司博士 / sushi_dr / 創價未來 / Dr. Source"
  - "全域最佳實踐 / 增量優化 / MECE TODO / 繼續完成 / 最佳實踐絕"
  - "FastAPI ffmpeg headless video render / word-synced captions"
  - "edge-tts WordBoundary / drawtext karaoke subtitles"
  - "background job hang / webhook hmac / S3 optional extra / test isolation fixture"
  - "esggo-cli"
---

# OmniAuto — architecture, extension & verification

## What it is
A single-repo video factory. `src/app.py` (FastAPI) exposes the orchestration
hub; `src/pipeline.py` runs the full job; each stage is a module under `src/`.
Default stack needs **no keys**: `edge-tts` (CJK narration) + `ffmpeg` (render)
+ `Pillow` + `numpy` (gradient stills). Cloud modules activate only when their
env var is present (see `src/config.py` feature flags).

Workspace: `C:\\Project\\esggo-omniauto` (Windows dev). Repo: `DingJun1028/OmniAuto`,
branch `main`. CI: `.github/workflows/build.yml` (Docker build + conditional
Docker Hub push + a **pytest** step that runs on a fresh Linux venv with
ffmpeg + `fonts-noto-cjk` installed).

## Module map (`src/`)
| file | role |
|------|------|
| `config.py` | env-driven feature flags (`USE_*`), `FONT_PATH` (single cross-platform CJK resolver), `WEBHOOK_SECRET`, `OMNI_AUTO_LOG_LEVEL` |
| `parser.py` | script to list[Shot]. Free path groups sentences; **DNA markers** (【場景】【衝突】【洞察】【方法】【反思】) take priority to one on-brand shot per beat. `USE_OPENAI` to GPT-4o path |
| `tts.py` | `synthesize()` returns `(path, word_boundaries, silent)`. **Must pass `boundary="WordBoundary"` to edge-tts** to get per-word timings |
| `visuals.py` | `gradient_frame()` builds the still (vectorized with **numpy** now), `render_shot_media()` to (media, is_video); Runway B-roll with graceful fallback |
| `renderer.py` | `render_shot_clip()` (ken-burns on stills / trim+fade on video + drawtext karaoke captions) and `render_final()` (concat + optional `make_brand_intro` slate) |
| `pipeline.py` | `run_pipeline()` orchestrates; `enqueue()` runs sync (webhook); `submit()` runs in a `ThreadPoolExecutor` (API, returns `queued` + job_id) |
| `db.py` | SQLite job store (`create_job/update_job/get_job/list_jobs`). `jobs` table has a `file` column |
| `storage.py` | local `/storage/<name>`; uploads to S3 when `USE_S3` |
| `brand.py` | the **sushi_dr** preset: palette, formula, AI boundary, constitution, series registry, 6 seed mu, `parse_dna()`, `dna_palette()` |
| `app.py` | routes: `/api/health`, `/api/jobs` (POST=queued, GET=list/poll), `/api/brand`, `/api/series`, `/webhook/n8n` (sync, optional secret; payload adds `"ok": status=="done" and bool(video_url)` so callers branch on `None`), `/storage/{path}` (traversal-guarded, `resolve()` + inside-`STORAGE_DIR` check), `/` (web UI); secret compared with `hmac.compare_digest` |

## Brand-preset integration pattern (sushi_dr)
Same as before but with updated config:
- `X-OmniAuto-Key` header for webhook authentication (was `X-AI-Station-Key`)
- `OMNI_AUTO_LOG_LEVEL` env var (was `AI_STATION_LOG_LEVEL`)
- Docker image: `omni-auto:latest` (was `aistation`)

## esggo-cli Integration
The `esggo-cli/` directory contains a standalone CLI tool for ESG-related operations:

```bash
# Install
cd esggo-cli && npm link

# Commands
esggo config      # Configuration management
esggo report      # Generate ESG reports
esggo analyze     # Data analysis
esggo compliance  # Compliance checks
esggo project     # Project management
esggo dashboard   # Launch dashboard
esggo export      # Data export
esggo audit       # System audit
esggo sync        # Data synchronization
esggo interactive # Interactive mode
```

See `esggo-cli/README.md` for full documentation.

## Verification discipline (CRITICAL — local green != CI green)
Same as before but updated for OmniAuto naming:
- Docker Hub image: `docker.io/dingjunhong1028/omni-auto:latest`
- Nginx config: `omni-auto.esggo.co.conf`
- Docker compose: `omni-auto` service
- Webhook header: `X-OmniAuto-Key`

## Viewing generated videos
- Output directory: `C:\Project\esggo-omniauto\output\` (or check `storage/` subdirectory)
- To view: open the output folder in Explorer and double-click the `.mp4` file, or serve via the FastAPI web UI at `http://localhost:8000/`
- For comparison with Vox Director packaged videos: place both outputs side-by-side and compare resolution, codec, audio sample rate, and visual quality

## User preference: video comparison
User wants to compare OmniAuto auto-generated videos with Vox Director skill-packaged videos. When user asks to "看萬能自動產出的影片" or "vox director 技能包裝後產出的影片比較", open the output directory and/or serve the web UI for direct viewing.

## Viewing generated videos
- Output directory: `C:\Project\esggo-omniauto\output\` (or check `storage/` subdirectory)
- To view: open the output folder in Explorer and double-click the `.mp4` file, or serve via the FastAPI web UI at `http://localhost:8000/`
- For comparison with Vox Director packaged videos: place both outputs side-by-side and compare resolution, codec, audio sample rate, and visual quality

## User preference: video comparison
User wants to compare OmniAuto auto-generated videos with Vox Director skill-packaged videos. When user asks to "看萬能自動產出的影片" or "vox director 技能包裝後產出的影片比較", open the output directory and/or serve the web UI for direct viewing.

## Viewing generated videos
- Output directory: `C:\Project\esggo-omniauto\output\` (or check `storage/` subdirectory)
- To view: open the output folder in Explorer and double-click the `.mp4` file, or serve via the FastAPI web UI at `http://localhost:8000/`
- For comparison with Vox Director packaged videos: place both outputs side-by-side and compare resolution, codec, audio sample rate, and visual quality

## User preference: video comparison
User wants to compare OmniAuto auto-generated videos with Vox Director skill-packaged videos. When user asks to "看萬能自動產出的影片" or "vox director 技能包裝後產出的影片比較", open the output directory and/or serve the web UI for direct viewing.

## Pitfalls (embedded from real bugs)
Same as before with additional notes:
| symptom | cause | fix |
|--------|-------|-----|
| Docker build fails on Windows path | Windows path separators in Dockerfile | Use POSIX paths in Docker context |
| README.md still references AI Station | Missed file during rename | Search and replace all occurrences |
| node_modules in git | npm install before gitignore | Add node_modules to .gitignore |

## User preference patterns (from recent sessions)
- **"繼續" (continue)** = execute next step without explanation; terse output only
- **"全部都是" (all of them)** = autonomous execution; complete all tasks without asking
- **"下一步" (next step)** = proceed sequentially; verify each step with real run
- **"完成" (done)** = verify completion; show final status only
- **Traditional Chinese preferred** for output; English for code/commands

The user expects **autonomous end-to-end execution** with minimal verbosity. 
**Response style**: Direct commands, numbered steps only when pipeline reports, 
no rationalizing. Surface 2-option choice ONLY for genuine external blocks (cloud keys, 
real-time data access, etc.).

### Execution protocol
1. **Identify task type** from user message
2. **Execute immediately** (no confirmation for "繼續", "全部都是", "下一步")
3. **Verify each step** with real tool execution
4. **Report only final result** (not intermediate steps)
5. **Use existing skills** - load relevant skill by name when task matches

## Publishing the image (no local daemon needed)
- Docker image: `docker.io/dingjunhong1028/omni-auto:latest`
- Use `gh secret set DOCKERHUB_USERNAME -b "dingjunhong1028"` and `gh secret set DOCKERHUB_TOKEN -b "dckr_pat_..."`
- Run `gh workflow run build.yml --ref main`

## Standard execution loop
1. Read the relevant `src/*.py` + `esggo-cli/src/cli.py`
2. Make the change; lint auto-runs on write.
3. Run `pytest tests/` locally
4. Clean test artifacts
5. `git add -A && commit && push`; `gh workflow run build.yml --ref main`; poll.
6. Report only after CI is `completed success`.

See `references/brand_dna.md`, `references/verification.md`, `references/mece_todo.md`,
`references/deploy.md`, `references/pdf_export.md`, and `esggo-cli/README.md`.
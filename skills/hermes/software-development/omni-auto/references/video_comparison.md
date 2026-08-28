# OmniAuto vs Vox Director Video Comparison

## Viewing OmniAuto Generated Videos
- Output directory: `C:\Project\esggo-omniauto\output\` (or `storage/` subdirectory)
- To view: open the output folder in Explorer and double-click the `.mp4` file, or serve via the FastAPI web UI at `http://localhost:8000/`

## Comparison with Vox Director Packaged Videos
- Place both outputs side-by-side
- Compare: resolution, codec (H.264), audio sample rate (48000Hz), visual quality, caption sync
- OmniAuto spec: H.264/1080p + AAC/48000Hz (config.py 1920x1080, renderer.py -ar 48000 x3)
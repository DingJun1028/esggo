---
name: omni-auto-output-spec
description: "Set OmniAuto renderer.py output codec/res/audio specs."
version: 1.0.0
author: Hermes Agent (DingJun1028)
license: MIT
platforms: [windows, linux]
metadata:
  hermes:
    tags: [omniauto, renderer, ffmpeg, output-spec, video]
    related_skills: [omni-auto, omniauto-automation, ffmpeg-video-automation]
---

# OmniAuto 輸出規格修改指引

調整 OmniAuto 影片管線（`DingJun1028/OmniAuto`）的輸出編碼規格。
典型目標規格（使用者以簡短字串提供，例：`h264,1920,1080` / `aac,48000`）：

```
h264,1920,1080  → 影片流：libx264 codec，解析度 1920x1080 (1080p)
aac,48000      → 音訊流：aac codec，取樣率 48000 Hz
```

## 規格 → 套用方式對照

- **解析度**：不靠 `-s`，改 `VIDEO_WIDTH`/`VIDEO_HEIGHT` env（或 config.py 預設值），renderer filter 自動帶出
- **音訊取樣率**：renderer.py 三處加 `"-ar", "48000",`（見下節）
- **codec**：維持 `libx264` + `aac`（OmniAuto 預設組合，不用動）
- 完整 YouTube-ready 建議：`-pix_fmt yuv420p -r 30 -b:a 192k -movflags +faststart`（renderer 已含 yuv420p + faststart）

## 修改位置（依實際原始碼，2026-08 核對）

**解析度不用改 code —— env var 驅動**（config.py 第 25-27 行）：
```python
VIDEO_WIDTH  = int(os.getenv("VIDEO_WIDTH", "1280"))
VIDEO_HEIGHT = int(os.getenv("VIDEO_HEIGHT", "720"))
VIDEO_FPS    = int(os.getenv("VIDEO_FPS", "30"))
```
→ 啟動時設 `VIDEO_WIDTH=1920 VIDEO_HEIGHT=1080`；或改預設值 `"1280"`→`"1920"`、`"720"`→`"1080"`。
renderer 的 scale/zoompan/pad filter 全用這兩個常數，無 `-s` 參數。

**音訊 48000 → patch src/renderer.py 三處**（只改兩處會 concat 混用取樣率）：
1. `render_shot_clip()`：`"-c:a", "aac", "-b:a", "192k",` → 加 `"-ar", "48000",`
2. `make_brand_intro()`：`anullsrc=r=44100:cl=stereo` → `r=48000`（唯一寫死 44100 處）；`"-c:a", "aac",` 後加 `"-ar", "48000",`
3. `render_final()`：`"-c:a", "aac", "-b:a", "192k", "-movflags", "+faststart",` → 加 `"-ar", "48000",`

## 驗證

```bash
ffprobe -v error -show_entries stream=codec_name,codec_type,width,height,sample_rate -of csv output.mp4
```

預期輸出（h264 video + aac audio）：
```
h264,video,1920,1080,
aac,audio,,,48000
```

## 環境限制（重要）

- 受限 session（無 terminal/檔案工具）無法直接改 `C:\Project\esggo-omniauto`；my_server 僅開放 `C:\Project\esggo-learning-center`。
- 此時產出精確 patch 指引給使用者手動貼上，或請使用者在有權限的 session 執行。
- 有權限時：改完跑 `pytest tests/`，再 `git add -A && commit && push`，`gh workflow run build.yml --ref main`，CI 綠了才回報。

## 相關

- `omni-auto` — 完整管線架構與模組圖
- `ffmpeg-video-automation` — ffmpeg Windows 陷阱（drawtext 冒號、concat 掉音軌、in-place 編輯）

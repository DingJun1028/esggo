# Vox Director Brand Guide

## Brand Identity
- **Name**: Vox Director
- **Preset**: cinematic widescreen, dramatic lighting, word-synced captions
- **Palette**: Primary `#0a0a2e`, Secondary `#1a1a4e`, Accent `#ffd700`
- **Font**: MS YaHei (`C:/Windows/Fonts/msyh.ttc`), 28pt
- **Caption Position**: Bottom
- **Transition Style**: Cinematic

## Output Spec
- Video: H.264, 1920x1080, 30fps, yuv420p
- Audio: AAC, 192kbps, 48000Hz
- Subtitles: ASS (burned-in, CJK-safe)
- Container: MP4 with `-movflags +faststart`
- Intro: 3s brand slate
- Outro: 2s fade-out

## DNA Markers (Priority Order)
1. 【場景】- Scene setting
2. 【衝突】- Conflict/tension
3. 【洞察】- Insight/analysis
4. 【方法】- Method/solution
5. 【反思】- Reflection/conclusion

## Pipeline Stages
1. Script Parse → structured scenes
2. TTS Synthesis → edge-tts with WordBoundary
3. Visual Generation → Pillow gradients
4. Cinematic Render → clips + transitions + captions
5. Brand Intro → optional slate
6. Concat + Mux → final MP4
7. Publish → local + S3
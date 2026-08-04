"""Poster renderer for HLPF POC beats (dict-style beats from beats.json)."""
from __future__ import annotations

from pathlib import Path
from typing import Any

from PIL import Image, ImageDraw, ImageFont

BRAND_BG = "#0f1f3d"
BRAND_ACCENT = "#c9a84c"
BRAND_TEXT = "#f5f1e8"
BRAND_GREEN = "#2f6e4e"

_FONT_CANDIDATES = [
    r"C:\Windows\Fonts\msjh.ttc",      # 微軟正黑體
    r"C:\Windows\Fonts\msyh.ttc",      # 微軟雅黑
    r"C:\Windows\Fonts\msjhbd.ttc",    # 微軟正黑體 Bold
    "msjh.ttc",
    "segoeui.ttf",
]


def _load_font(size: int) -> ImageFont.ImageFont | ImageFont.FreeTypeFont:
    for candidate in _FONT_CANDIDATES:
        try:
            return ImageFont.truetype(candidate, size)
        except Exception:
            continue
    return ImageFont.load_default()


def _wrap_text(draw: ImageDraw.ImageDraw, text: str, font, max_width: int) -> list[str]:
    lines: list[str] = []
    current = ""
    for ch in text:
        test = current + ch
        bbox = draw.textbbox((0, 0), test, font=font)
        if bbox[2] - bbox[0] > max_width and current:
            lines.append(current)
            current = ch
        else:
            current = test
    if current:
        lines.append(current)
    return lines


def render_beat_poster(
    beat: dict[str, Any] | Any,
    out_path: Path,
    width: int = 1920,
    height: int = 1080,
) -> Path:
    """Render a 1920x1080 brand poster for one beat.

    Accepts dict-style beats (as read from beats.json) or objects with
    attribute access (pydantic models). Writes PNG to out_path.
    """
    def _get(key: str, default: Any = "") -> Any:
        if isinstance(beat, dict):
            return beat.get(key, default)
        return getattr(beat, key, default)

    scene_id = str(_get("sceneId", "UNKNOWN"))
    script_text = str(_get("scriptText", ""))
    source_id = str(_get("sourceId", ""))
    voice_type = str(_get("voiceType", "VO"))
    visual_type = str(_get("visualType", "B_ROLL"))

    img = Image.new("RGB", (width, height), BRAND_BG)
    draw = ImageDraw.Draw(img)

    font_scene = _load_font(28)
    font_title = _load_font(60)
    font_sub = _load_font(36)

    margin = 80
    y = margin

    # 左上 sceneId + 型別標籤
    draw.text((margin, y), f"{scene_id}  |  {voice_type} / {visual_type}", font=font_scene, fill=BRAND_ACCENT)
    y += 90

    # 中段主文案
    max_text_width = width - margin * 2
    lines = _wrap_text(draw, script_text, font_title, max_text_width)
    for line in lines:
        draw.text((margin, y), line, font=font_title, fill=BRAND_TEXT)
        y += 95

    # 底部 sourceId（5T 溯源）
    footer = f"source: {source_id}"
    draw.text((margin, height - margin - 44), footer, font=font_scene, fill=BRAND_ACCENT)

    img.save(out_path)
    return out_path

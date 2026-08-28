# Auto-Detect Dual-Caption Floating Overlay (v2.0.0 Best Practices)

## 1. Dual-Tier Subtitle Specification
To avoid audience and host confusion:
- **Upper Line (`.sub-cap`)**: Real-time captured source speech (Pure Crisp White, bold Sans-serif).
- **Lower Line (`.sub-trans`)**: Real-time translated target speech (High-contrast Warm Gold `#ffd875`).

## 2. Pre-checked Optimal Defaults (開箱即用預設配置)
- **`☑️ 系統音 (Zoom / YouTube 系統聲音)`**: `checked = true` by default.
- **`☑️ 自動偵測語言`**: `checked = true` by default.
- **Language Direction**: Default `en -> zh-TW` (English -> Traditional Chinese).
- **Auto-detection Logic**: Counts CJK characters `[\u4e00-\u9fa5]` vs Latin letters.
  - If speech is English -> Upper is English, Lower is Traditional Chinese.
  - If speech is Chinese -> Upper is Chinese, Lower is English.

## 3. Zero External CDN Dependency for QR Code
- Do NOT use `cdn.jsdelivr.net` or `unpkg.com` for `qrcode.js`.
- Embed pure inline Canvas / SVG QR algorithm so QR code renders 100% reliably in offline/airgapped/firewalled environments.

## 4. Pure Distraction-Free Audience Viewer (`viewer.html`)
- Remove all unnecessary font knobs, fullscreen buttons, reader controls, and headers.
- Top Live status: `● 即時同步連線中` (green pulse badge).
- Large Hero Card (Upper captured + Lower translated).
- Auto-scrolling transcript history below.

## 5. Cloudflare Tunnel 502 & Markdown URL Encoding Pitfall
- Symptom: `Bad gateway Error code 502` from Cloudflare.
- Root Cause: URL opened or pasted with markdown suffix (e.g. `https://translate.esggo.co/overlay.html?room=vrtz8%5D(https://...)`).
- Fix: Always launch clean, raw URLs and sanitize pathname on the server fallback handler.

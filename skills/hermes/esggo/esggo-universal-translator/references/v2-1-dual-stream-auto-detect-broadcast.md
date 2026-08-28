# Universal Translator v2.1 Architecture & Dual-Stream Broadcast Guide

## 1. Core Architectural Pillars (v2.1)

### A. Dual-Stream Broadcast Hub (SSE + WebSocket + HTTP POST)
- **Problem**: Cloudflare Tunnel proxies or network jitter intermittently drop WebSockets or SSE connections, causing audience viewers to miss live captions.
- **Solution**: The backend (`server_runner.mjs` / `server.py`) implements a unified multi-protocol hub:
  - Listens to HTTP `POST /speak` & `POST /api/broadcast` and incoming host WebSockets.
  - Broadcasts simultaneously to:
    1. All connected **WebSockets** (`/ws/room/:id` & `/ws`)
    2. All active **Server-Sent Events (SSE)** listeners (`/stream?room=:id`)
    3. In-memory cache (`/api/room/:id/latest`) for polling fallback.

### B. Pure Zero-Dependency QR Code Generation
- **Problem**: External CDNs (e.g. `cdn.jsdelivr.net/npm/qrcode`) can fail or be blocked in certain network environments, causing "QR Code not appearing".
- **Solution**: Embed pure standalone JavaScript QR algorithms directly in the frontend HTML without external network script tags.

### C. Automatic Dual-Language Detection State Machine
- Dynamic CJK Unicode range (`[\u4e00-\u9fa5]`) and Latin character analysis:
  - **Speaking English**:
    - Upper line: Original English speech capture (Bold White Sans-serif)
    - Lower line: Traditional Chinese translation (High-contrast Warm Gold `#ffd875`)
    - Indicator: `🌐 AUTO: 英語 (擷取) ➔ 繁中 (翻譯)`
  - **Speaking Traditional Chinese**:
    - Upper line: Original Traditional Chinese speech capture (Bold White)
    - Lower line: English translation (High-contrast Warm Gold `#ffd875`)
    - Indicator: `🌐 AUTO: 繁中 (擷取) ➔ 英語 (翻譯)`

### D. Optimal Defaults (Pre-checked on Load)
- `☑️ 系統音 (Zoom/YouTube)` -> Default `checked=true`
- `☑️ 自動偵測語言` -> Default `checked=true`
- Default language direction: `English -> Traditional Chinese (zh-TW)`
- Version status badge: `● v2.1 服務正常 (雙軌推播 + 智能雙向)`

### E. Pure Distraction-Free Audience Viewer (`viewer.html` / `stream.html`)
- All superfluous buttons, font controllers, and reader menus removed.
- Immersive OLED dark theme with live indicator, sticky hero card (Upper: Source speech / Lower: Translated subtitle), and auto-scrolling transcript history.

### F. True All-in-One Floating Widget & PiP Overlay
- Deep graphite translucent capsule bar (`rgba(20, 24, 32, 0.92)` + `backdrop-filter: blur(24px)`).
- Document Picture-in-Picture & Canvas PiP engine for always-on-top overlay over Zoom meetings and YouTube videos.

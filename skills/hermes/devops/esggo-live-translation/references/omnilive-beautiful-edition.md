# OmniLive Beautiful Edition (v2.0) — Glassmorphism Overlay Update

**Session date:** 2026-08-25  
**Trigger:** User asked to switch OmniLive overlay to a previously praised beautiful version.

## Summary

Replaced the existing `omnikive/public/overlay.html` with a **Beautiful Edition** — a 1:1 pixel-perfect
glassmorphism overlay deployed to both `apps/omnilive/public/overlay.html` and
`apps/universal-translator/public/overlay.html`. Accessible via:

```
https://live.esggo.co/overlay.html
https://translate.esggo.co/overlay.html
```

## Key Design Features (5T-Aligned)

| 5T Principle | Implementation in Beautiful Edition |
|---|---|
| **Traceable** | Every subtitle event carries `trace` field from backend |
| **Trackable** | SSE stream logs all connection events; room-filtered broadcast |
| **Tangible** | 1:1 pixel-perfect UI, `clamp()` responsive typography, zero fuzzy rendering |
| **Transparent** | All design tokens (colors, fonts, glass values) documented in `USER_GUIDE.md` |
| **Trustworthy** | `Object.freeze()` on rendered subtitle data; immutable display layer |

## Design Tokens

### Colors
| Purpose | Value |
|---|---|
| Deep stone-ink glass bg | `rgba(22, 27, 34, 0.94)` |
| Subtitle card bg | `linear-gradient(135deg, rgba(12,18,30,.72), rgba(8,12,20,.56))` |
| Original text (English) | `#FFFFFF` (white, bold) |
| Translation (Traditional Chinese) | `#FFD479` (warm gold) |
| Accent | `#36E0C0` / `#5B8CFF` |
| Error/red LED | `#FF5D6C` (breathing animation) |

### Glassmorphism
```css
backdrop-filter: blur(28px) saturate(160%);
-webkit-backdrop-filter: blur(28px) saturate(160%);
border: 1px solid rgba(255, 255, 255, 0.14);
```

### Typography
- **Quote (startup screen):** `Georgia, "Songti TC", serif`
- **Original text:** `font-weight: 700; font-size: clamp(1.2rem, 2.8vw, 1.8rem)`
- **Translation:** `font-weight: 700; font-size: clamp(1rem, 2.3vw, 1.35rem)`

## Keyboard Shortcuts

| Key | Function |
|---|---|
| `Space` | Start/stop audio capture |
| `B` | Toggle subtitle visibility |
| `T` | Toggle toolbar visibility |
| `D` | Show/hide diagnostic panel |

## UI Components

1. **Top Toolbar** — Deep stone-ink glass with breathing red LED status badge
2. **Subtitle Card** — 22px rounded, blur(16px) background, dual-language display
3. **Startup Hint** — Gold quote prompt with CTA buttons (Start Translation, Floating Window, Course)
4. **Diagnostic Panel** — Shows SSE connection, audio source, and translation engine status
5. **QR Code Sharing** — One-click link copy + QR Code generation for viewer distribution
6. **Volume Meter** — Bottom overlay showing real-time audio input levels

## Deployment Locations

Both of these files now contain the Beautiful Edition:
- `/opt/esggo/apps/omnilive/public/overlay.html` (23,607 bytes)
- `/var/www/esggo/apps/universal-translator/public/overlay.html` (23,607 bytes)

## Service Status (Verified)

| Service | Port | Status |
|---|---|---|
| universal-translator | 8788 | ✅ Running (PM2) |
| live.esggo.co (nginx) | 443 | ✅ Proxying to 8788 |
| translate.esggo.co (nginx) | 443 | ✅ Proxying to 8788 |
| omni-api | 8789 | Running (PM2) |
| Hermes WebUI | 8790 | Running (Docker) |

## Verification Commands

```bash
# Health check
curl -sf https://live.esggo.co/health

# Overlay HTML (Beautiful Edition)
curl -sf https://live.esggo.co/overlay.html | head -5

# Alternative domain
curl -sf https://translate.esggo.co/overlay.html | head -5
```

## User Guide

A complete `USER_GUIDE.md` was created with:
- Quick start instructions
- Interface guide
- Advanced features (floating window, QR code, diagnostics)
- 5T protocol implementation details
- Technical architecture
- Use cases (Zoom meetings, YouTube, online courses)
- FAQ
- Brand guidelines (colors, typography, glassmorphism specs)

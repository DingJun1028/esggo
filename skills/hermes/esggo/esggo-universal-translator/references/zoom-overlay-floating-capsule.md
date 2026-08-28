# Zoom / YouTube Overlay All-in-One Floating Capsule & Audience Broadcast

## 1. Overview
The **All-in-One Floating Capsule (`index.html`)** is a self-contained Zoom / YouTube overlay widget that acts like a native desktop live captioning plugin. It combines:
- Audio capture (System/Zoom audio via `getDisplayMedia` + Mic Web Speech API with Auto-Reconnect).
- Real-time bilingual subtitle display (English top `#ffffff`, Traditional Chinese bottom `#ffd875`).
- Cross-application always-on-top overlay using the **Document Picture-in-Picture API** and Canvas PiP stream.
- Inline expandable drawers (⚙️ Settings, 🔴 Live Share QR Code) that avoid disrupting full-screen workflows.
- Real-time WebSocket room broadcasting to the **Audience Viewer (`viewer.html`)**.

## 2. Preventing "錄製錯誤" (Recording Errors) in Live Zoom Meetings
### Root Cause 1: Browser Web Speech Silence Timeouts
In standard Chrome/Edge `webkitSpeechRecognition`, speech pauses longer than ~15-30s trigger `onend` or `error: 'no-speech'`. Without an auto-restart loop, the capture terminates permanently.
**Solution**:
```javascript
rec.onend = () => {
  if (isListening) {
    clearTimeout(reconnectTimer);
    reconnectTimer = setTimeout(() => {
      try { rec.start(); } catch (e) {}
    }, 200);
  }
};
rec.onerror = (e) => {
  if (e.error === 'no-speech' || e.error === 'aborted') return;
  if (isListening) {
    clearTimeout(reconnectTimer);
    reconnectTimer = setTimeout(() => {
      try { rec.start(); } catch (err) {}
    }, 500);
  }
};
```

### Root Cause 2: Zoom Sound Comes from System Audio, Not Physical Mic
Remote participants' voices come through computer speakers/headphones, which physical microphones cannot capture reliably.
**Solution**:
```javascript
const mediaStream = await navigator.mediaDevices.getDisplayMedia({
  video: true,
  audio: { echoCancellation: false, noiseSuppression: false, autoGainControl: false }
});
// User must check "Share audio" in the browser screen-share prompt.
// Keep display video track alive (stopping video invalidates audio in Chromium).
```

## 3. Native Cross-Window Always-On-Top (Zoom & YouTube Overlay)
### Document Picture-in-Picture API (Chrome 116+ / Edge)
Allows opening an arbitrary HTML DOM window that floats permanently above all Windows applications (including native Zoom client and full-screen YouTube):
```javascript
if ('documentPictureInPicture' in window) {
  const pipWindow = await window.documentPictureInPicture.requestWindow({
    width: 900,
    height: 180
  });
  // Inject CSS and subtitle elements into pipWindow.document
  // Use MutationObserver on textEn / textZh to synchronize DOM in real-time
}
```
**Fallback**: Capture 30fps stream from a virtual 2D canvas (`canvas.captureStream(30)`) and assign to `<video autoplay muted>` -> `video.requestPictureInPicture()`.

## 4. Host-to-Audience Room Broadcast Architecture
1. **Host (`index.html`)**: Connects to `wss://translate.esggo.co/ws/room/live`. As speech is translated, pushes `{role: "host", room: "live", en: "...", zh: "..."}`.
2. **Server (`server.py` / `server.mjs`)**: Maintains `RoomBroadcastHub` mapping `room_id -> Set[WebSocket]`. Broadcasts updates to all connected viewers in < 5ms.
3. **Audience Viewer (`viewer.html`)**: Mobile-first page accessed via QR code (`https://translate.esggo.co/viewer.html?room=live`):
   - Sticky live bilingual card (`.live-hero-card`) with high-contrast text.
   - Historical transcript stream (`#history-container`) with timestamps.
   - Font scaling (`A-` / `標準` / `A+` / `特大`).
   - Earphone speech synthesis for audience members.

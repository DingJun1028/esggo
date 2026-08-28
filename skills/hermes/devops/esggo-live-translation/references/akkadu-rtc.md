# Akkadu-RTC — ARCHIVED reference (NOT in current free build)

> Status: This integration was built then REMOVED in the 2026-08-06 session when the user said
> "但我要做出免費版本的 不需要算立 也不需要akkadu". The current `apps/universal-translator` is
> FREE-only (v1.2.0, no Akkadu). Keep this only as a reference in case the user later explicitly
> asks for paid voice interpretation. Do NOT reintroduce without that explicit request.

Source: https://github.com/akkadu/akkadu-api (private SDK, token-gated)

## What it does
Real-time speech interpretation streaming. Interpreter (Broadcaster) pushes audio; audience (Receiver) subscribes. Complementary to text translation (audio layer vs text layer).

## Install (PRIVATE npm — the reason it was dropped)
Needs a token from `techforce@akkadu-team.com`. Then:
```
.npmrc: @akkadu:registry=https://npm.pkg.github.com/akkadu
npm config set //npm.pkg.github.com/:_authToken <TOKEN>
npm install @akkadu/akkadu-rtc
```

## Environments
- `isDevMode:true` → `devapi.akkadu.cn` (localhost-only, avoids CORS). REQUIRED on localhost.
- `isDevMode:false` → `api.akkadu.cn` (need CORS domain whitelist from Akkadu).
- Events are unique per env — a dev event does NOT work in prod.

## Usage (SDK)
```js
import Akkadu from '@akkadu/akkadu-rtc'
const rtc = new Akkadu({ roomName: 'ejrd', isDevMode: true })
const streamer = await rtc.init()               // Receiver
// or: const streamer = await rtc.initBroadcaster(username, password)  // Broadcaster
streamer.toggle()
streamer.on('connection-status', (msg) => {
  switch (msg.id) {
    case 'connection-active': /* connected, ready to toggle */ break
    case 'connection-online':  /* reconnected */ break
    case 'connection-offline': /* lost */ break
  }
})
```

## Shared test creds (from Akkadu README)
- room: `ejrd`
- broadcaster: `akkaduinterpreter1@outlook.com` / `Interpreter1`
- Only ONE broadcaster per room at a time (shared creds collide).

## Graceful-degrade pattern (if rebuilt)
Lazy-load SDK; when `AKKADU_TOKEN` unset, return `{Akkadu:null,loadError}` so text translation
keeps working and only interpretation reports "not enabled".

See `references/akkadu-vs-free.md` for the full decision note.

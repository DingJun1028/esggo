# Akkadu Live Caption — reverse-engineered endpoints (2026-08-04)

Discovered by driving `https://akkadu.ai/live/kxxf` through headless Chrome + CDP network capture.
`kxxf` is the **room id**, not a slug. Useful when a task needs to monitor an Akkadu live caption room.

## Real backend (what the page actually calls)
- Room status:   `GET https://api-translator.akkadu.com/rooms/<roomId>`
  - Example response: `{"data":{"id":503,"name":"kxxf","status":"offline","broadcast":false,"lock":true,"plan":"meeting","maxParticipants":5},"ok":true}`
  - Poll this to detect `broadcast:true` (live). No auth required.
- Audience token: `GET https://api-translator.akkadu.com/tokens/agora-rtm-audience`
  - Returns Agora `appId`, `token`, `uid` (e.g. `audience_<uuid>`), `expiration:3600`.
  - This is the RECEIVER credential — no login needed to *receive* captions.
- Agora RTM stream: `POST https://webcollector-rtm.agora.io/events/proto-raws` (binary WS under the hood)
- Agora appId seen: `a593c8fe4dcd4dfe8126823fddf6829d`

## Key lesson
The captions are pushed over **Agora RTM** (binary WebSocket protocol), NOT rendered into a
scrapable `aria-live` DOM. Headless `--dump-dom` of the landing page returns only the marketing
shell. To actually receive captions you need either:
  (a) the Akkadu RTC SDK (`@akkadu/akkadu-rtc`, a *private* npm package requiring a token), or
  (b) run the Akkadu web page itself in headless Chrome (it uses the Agora Web SDK and renders
      captions into the DOM), then scrape the rendered DOM — only viable when the room is `broadcast:true`
      AND the chromium binary is available on the machine running the scraper.

The room-status + token polling pattern works unauthenticated and is the most reliable signal
for "is this room live right now".

# Akkadu Live Captions — discovered API map

Found via CDP network probe on `https://akkadu.ai/live/kxxf`. The `kxxf` segment is a **room ID**, not a page slug. `curl` got only a ~3.4KB Nuxt shell; `--dump-dom` yielded ~81KB but the room/WS params are injected post-JS, so CDP network trace was required to surface the real backend.

## Endpoints
- Room status: `GET https://api-translator.akkadu.com/rooms/{roomId}`
  - Returns `{data:{id, name, status:"offline"|"online", broadcast:bool, lock:bool, plan, maxParticipants}}`.
  - `broadcast:true` = a live session is running.
- Agora RTM audience token (receive captions, **NO login needed**): `GET https://api-translator.akkadu.com/tokens/agora-rtm-audience`
  - Returns `{data:{appId, token, uid:"audience_...", expiration:3600}}`.
- Caption stream itself: `POST https://webcollector-rtm.agora.io/events/proto-raws` (Agora RTM; decoding needs Agora SDK or raw protobuf over WS — not yet implemented).
- Public page `https://akkadu.ai/live/kxxf` is a Nuxt SPA.

## Notes
- Room `kxxf` was `status:"offline", broadcast:false` at capture → no live captions to receive. Poll `rooms/{id}` for `broadcast:true` to detect go-live.
- `@akkadu/akkadu-rtc` (private npm, from their README) is a SEPARATE interpreter product. The `akkadu.ai/live` AI-captions product uses `api-translator.akkadu.com` + Agora.
- Akkadu account creds (email/password) are for creating events on the organizer platform to obtain a room hash; the audience/receiver path needs only the public room ID + the audience token above.

# Akkadu-RTC vs Free path (decision note)

## Context
User wanted "Live 即時翻譯" integrated into `apps/universal-translator`. The obvious library
(Akkadu-RTC) is a **private npm** (`@akkadu/akkadu-rtc`) requiring a token from
`techforce@akkadu-team.com`. I built a full integration (akkadu.mjs wrapper, receiver/broadcaster
UIs, /interpreter/status route, .env AKKADU_* vars, QUICKSTART §6).

## User correction
> "但我要做出免費版本的 不需要算立 也不需要akkadu"

→ The integration was REMOVED. Repo reverted to free-only v1.2.0.

## What each path covers
| Capability | Akkadu-RTC (paid/private) | Free path (repo default) |
|------------|---------------------------|--------------------------|
| Text translation | no (needs separate engine) | ✅ LibreTranslate→MyMemory→origin fallback |
| Real-time stream (HTTP/WS) | ✅ | ✅ `/translate` + `/ws` |
| Voice/speech interpretation (audio layer) | ✅ receiver/broadcaster audio rooms | ❌ not covered (user accepted this gap) |
| Cost | private npm token + Akkadu event setup | $0, zero keys |
| CORS / setup friction | devapi/prodapi split, CORS whitelist | none (localhost) |

## Lesson
When the obvious SDK for a requested feature is paid/private/approval-gated, DEFAULT to the free
path the repo already supports. Ask before pulling a private dependency. User prefers
自建自託管取代付費 SaaS.

## If user later asks for voice interpretation
Revisit Akkadu only if they explicitly request audio. The removed integration pattern (lazy SDK
load + graceful degrade when token absent, connection-status listener) is preserved conceptually
here so it can be rebuilt — but do NOT add it unless asked.

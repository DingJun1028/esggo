# MECE best-practices TODO — current state (snapshot 2026-07-26)

Used by the user's "全域最佳實踐TODO項目" / "繼續增量優化" directives. The live
file is `TODO.md` in the repo; this is a captured snapshot of what was done and
what remains.

## 7 pillars — status as of last optimization round
1. Correctness — mostly ✅ (Docker CJK font, Runway 410, pts reset, audio_duration
   fallback, jobs.file column). Open: explicit shot.index ordering.
2. Security — ✅ webhook secret (WEBHOOK_SECRET), ✅ /storage traversal guard,
   🔲 .env.example note (done in this round).
3. Maintainability — ✅ git clean, ✅ font path converged to config.FONT_PATH.
   Open: run.py vs src.app.main dual entrypoint.
4. Performance — ✅ numpy vectorized gradient_frame, ✅ background job submission
   (POST /api/jobs → queued + ThreadPoolExecutor poll).
5. Extensibility — 🔒 Docker Hub auto-push (waits on DOCKERHUB_USERNAME/TOKEN
   repo secrets), 🔲 Runway real-call test, 🔲 OpenAI parser mock test.
6. Observability — ✅ /api/health feature flags. Open: structured logging across
   pipeline stages.
7. Testing — ✅ 24 pytest (config/parser/tts/renderer/db/api/ci/security/
   integration). ✅ e2e ffmpeg render in suite. Open: generate_broll mock test.

## Next-priority order (proposed)
⑥ observability (structured logging) → ⑤ Runway/OpenAI real-call + mock tests
→ ③ unify dual entrypoint.

## How the user drives this
- "全域最佳實踐TODO項目" → produce/refresh this MECE audit as TODO.md.
- "繼續" / "繼續增量優化" → execute next priority items, fix real bugs, extend
  tests, keep CI green, update TODO.md ✅ marks.
- Terse directives = autonomous end-to-end; don't pause for per-step confirmation.

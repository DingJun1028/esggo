# memory-tencentdb verified facts — 2026-08 audit

All facts below were re-verified from npm registry + GitHub `main` (CHANGELOG, README,
scripts/README.memory-tencentdb-ctl.md) on 2026-08-01.

## npm packument (registry.npmjs.org/@tencentdb-agent-memory/memory-tencentdb)
- dist-tags: `latest` = 1.0.1, `beta` = 1.0.1-beta.2
- engines: node >= 22.16.0 · type: module · license MIT
- deps: sqlite-vec@0.1.7-alpha.2, @node-rs/jieba@^2.0.1, json5, @tencentdb-agent-memory/tcvdb-text
  (node-llama-cpp moved to optional in 0.1.3)
- bin entries (0.2.0+): read-local-memory, export-tencent-vdb, migrate-sqlite-to-tcvdb
- OpenClaw manifest: pluginApi >= 2026.3.13, minGatewayVersion >= 2026.3.13

## Path/env table (0.4.x+, from ctl README)
| Var | Default |
|---|---|
| MEMORY_TENCENTDB_ROOT | `~/.memory-tencentdb` |
| TDAI_INSTALL_DIR | `$ROOT/tdai-memory-openclaw-plugin` |
| TDAI_DATA_DIR | `$ROOT/memory-tdai` (tdai-gateway.json 0600, logs/) |
| HERMES_HOME | `~/.hermes` (Windows: `C:\Users\<u>\AppData\Local\hermes`) |
| MEMORY_TENCENTDB_LOG_DIR / GATEWAY_HOST / GATEWAY_PORT | 127.0.0.1 / 8420 |
- Hermes mode extras: `$HERMES_HOME/env.d/memory-tencentdb-llm.sh` (creds for supervisor-spawned gateway),
  `$HERMES_HOME/logs/memory_tencentdb/`
- Old layout `~/tdai-memory-openclaw-plugin` + `~/memory-tdai` auto-migrated by installer on upgrade.
- Env aliases for Hermes Python provider: `MEMORY_TENCENTDB_LLM_*` mirror `TDAI_LLM_*`;
  `MEMORY_TENCENTDB_GATEWAY_API_KEY` attaches Bearer header automatically.

## CHANGELOG highlights
- [Unreleased]: timezone config (IANA or ±HH:MM), ISO-8601 timestamps with offset, disableThinking
  (TDAI_LLM_DISABLE_THINKING = vllm|deepseek|dashscope|openai|anthropic|kimi|gemini), L1/L2 prompt
  language adaptation, offload collect mode.
- 0.3.6 (2026-05-27): recall.maxCharsPerMemory / recall.maxTotalRecallChars (0=off); embedding.sendDimensions
  (false for BGE-M3); server.apiKey/TDAI_GATEWAY_API_KEY Bearer auth + TDAI_CORS_ORIGINS; L1.5 settle 60s timeout;
  scene filename normalizer (spaces→dash); cleaner safety (L0:50/L1:20 min, >80% expired blocks delete);
  l3TiktokenEncoding default cl100k_base.
- 0.3.5 (2026-05-15): explicit zod@^4.4.3 dep for OpenClaw v2026.5.7; l2DelayAfterL1Seconds 90→10.
- 0.3.4 (2026-05-12): extraSystemPrompt fallback for old hosts; Docker Quick Start in README.
- 0.2.2 (2026-04-17): undici declared dep (fixes TCVDB client load); 0.2.1 deprecated.
- 0.2.1 (2026-04-16, deprecated): TCVDB HTTPS + caPemPath; DISK_FLAT index default w/ HNSW fallback;
  bge-large-zh default embedding; strongConsistency reads.
- 0.2.0 (2026-04-15): TCVDB storage backend; local BM25 via tcvdb-text (no HTTP sidecar);
  seed CLI; migrate-sqlite-to-tcvdb / export-tencent-vdb / read-local-memory bins; tool-call limit 3/round.
- 0.1.0 (2026-03-25): first release, SQLite + LLM, FTS5 + jieba.

## Groq free-tier rate limits (verified 2026-03, console.groq.com/docs/rate-limits + community audit)
| Model | RPM | RPD | TPM | TPD |
|---|---|---|---|---|
| llama-3.1-8b-instant | 30 | 14,400 | 6,000 | 500,000 |
| llama-3.3-70b-versatile | 30 | 1,000 | 12,000 | 100,000 |
| llama-4-scout-17b-16e-instruct | 30 | 1,000 | 30,000 | 500,000 |
| qwen/qwen3-32b | 60 | 1,000 | 6,000 | 500,000 |
| openai/gpt-oss-120b | 30 | 1,000 | 8,000 | 200,000 |
| openai/gpt-oss-20b | 30 | 1,000 | 8,000 | 200,000 |
| whisper-large-v3-turbo (STT) | 20 | 2,000 | — | — |
Memory extraction is async/low-frequency → free tier is sufficient; disable thinking for Qwen via
`TDAI_LLM_DISABLE_THINKING=dashscope`.

## Gemma 4 sizes (official model card, updated 2026-07-30)
| Model | Effective/Total | Ctx | Q4 size | CPU speed |
|---|---|---|---|---|
| E2B | 2.3B/5.1B | 128k | ~3GB | 20+ tok/s (too weak) |
| E4B | 4.5B/8B | 128k | ~5GB | 10–15 tok/s ✅ recommended |
| 12B Unified | 11.95B dense | 256k | ~7.5GB | 3–5 tok/s |
| 26B A4B MoE | 4B active/26B | 256k | ~15.6GB | 8–12 tok/s |
| 31B Dense | 31B | 256k | ~19GB | 2–3 tok/s (skip) |
Apache 2.0; audio on E2B/E4B/12B; HF checkpoints `google/gemma-4-*`.

## Benchmarks (README)
WideSearch +51.52% pass rate / −61.38% tokens · SWE-bench +9.93% / −33.09% · AA-LCR +7.95% / −30.98% ·
PersonaMem 48%→76%.

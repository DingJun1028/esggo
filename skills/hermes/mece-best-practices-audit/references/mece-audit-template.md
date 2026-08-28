# MECE Best-Practices Audit — 7-Pillar TODO Template

Copy this scaffold into the repo's `TODO.md`. Replace each `🔲` with a
concrete, file-grounded finding (cite function/line). Mark `✅` when fixed
this session (add commit hash), `🔒` when blocked on an external secret/decision.

```
# <PROJECT> · 全域最佳實踐 TODO

採 MECE 視角（7 互斥支柱 × 生命週期窮盡缺口）審視後的待辦清單。
狀態：✅ 已修 / 🔲 待辦 / 🔒 外部阻礙（需密鑰/決策）。

## 1. 正確性 / Correctness
- 🔲 <finding>: <file>:<func> — <fix>
- ✅ <fix done>: <file> (commit <hash>)

## 2. 安全 / Security
- 🔲 <finding>: <file>:<func> — <fix>
- 🔒 <key-gated>: surface 2-option choice, do NOT solicit secret

## 3. 可維護性 / Maintainability
- 🔲 <finding>

## 4. 效能 / Performance
- 🔲 <finding>

## 5. 可擴充性 / Extensibility
- 🔒 <external key / decision>

## 6. 可觀測性 / Observability
- 🔲 <finding>

## 7. 測試 / Testing
- 🔲 <missing coverage>: add pytest for <module>

---
下一步優先序：② 安全 → ④ 效能 → ⑦ 測試標記。
```

### Lifecycle check per pillar
For each pillar ask: does the code cover init → run → error → cleanup → observe?
- Correctness: boundary/empty-input handling, fallback on missing binary.
- Security: auth on webhooks, path-traversal on static mounts, secrets in VCS.
- Maintainability: single source of truth for constants, no duplicate entrypoints.
- Performance: O(n^2) pixel loops, synchronous blocking of request thread.
- Extensibility: cloud APIs best-effort + clearly marked untested.
- Observability: health endpoint, structured logging, failure surfaced (not silent).
- Testing: unit for pure funcs, integration (--integration mark) for ffmpeg e2e.

### Verification discipline (do this before marking ✅)
1. Read the ACTUAL function signatures before writing/editing tests. Do NOT
   assume a helper/flag/return-shape exists — if a test needs `config.DB_PATH`
   but it lives in `db.py`, patch the right module. If the test needs a helper
   that's genuinely missing and useful, ADD it to source, then test it.
2. After fixing, run the full pytest suite locally (`pytest tests/ -q`).
3. If a fix can't be unit-tested locally (needs the Docker image / ffmpeg),
   note in the `✅` line that CI is the verification path, and trigger a run.
4. Commit fixes + tests together; the `✅ <hash>` must be a real commit.

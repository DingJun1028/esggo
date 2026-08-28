---
name: oa-meta-memory
description: Maintain meta-memory; ftg & translator are aistation.
---

# oa-meta-memory — 元記憶聖所維護與專案歸屬

Use when the user mentions 記憶聖所 / 元記憶 / 萬能永憶 / 永恆宮殿 / 秘密聖櫃 / MEMORY_SANCTUM.md, asks to record or restructure architecture-level facts in the meta-memory, or any task touching which repo/service owns what (ftg, universal-translator, ESGGO-OA, TencentDB).

## The Sanctum layer hierarchy (verified 2026-08-22)

- **第零層 萬能永憶 (OMNI-EVERMIND)** — sits in 永恆宮殿 (Eternal Palace); above all layers; ultimate anchor of meta-memory.
- **第一原則 秘密聖櫃 (Secret Vault)** — `C:\Users\dingj\secret-vault\ENV20230818.env` (chmod 600). Root principle: sanctum, credentials, topology all derive from it. Never commit to git; never print key values (use [REDACTED]).
- **第二層 技術棧拓撲 (Tech Topology)** — after user corrections, contains ONLY:
  1. TencentDB 記憶網格 (local Win)
  2. ESGGO-OA Dashboard (omni-blueprint-hub)
  3. state.db 維護法則
  - Do NOT add aistation facilities here.
- **第三層 憑證聖殿** — esggo_original private key fingerprint.
- **第四層 授權矩陣** — interaction modes / 萬能分身自主授權.
- **第五層 運維法則** — SSH unlock / bilingual preference.
- **獨立分支 記憶聖所 (Memory Sanctum)** — independent branch, unnamed; meta-memory cross-session facts.
- **元記憶雙載體 (dual carrier)** — (1) Hermes in-memory store (injected each session, one source of truth) + (2) OmniMemory 萬能記憶 (cross-session persistent). Both cross-reference. MEMORY_SANCTUM.md is the human-navigable mirror.

## Project-service ownership rules (RECURRING CORRECTION — got this wrong twice)

- **aistation owns**: the `ftg` branch (墾趣旅遊 FTG Tours) AND the `universal-translator` facility.
- **esggo owns**: ESGGO-OA Dashboard (omni-blueprint-hub). `universal-translator` is NOT an esggo service despite its `translate.esggo.co` subdomain — it is an aistation facility.
- **TencentDB 記憶網格**: local Win; use node22.22.1 (node24 breaks vec0).

> PITFALL (cost two corrections this session): the assistant added aistation facilities into esggo's tech-topology layer — first `ftg` (user: "esggo ftg 分支移除這些配置 他屬於 aistation 中的分支"), then `universal-translator` (user: "universal-translator 也不在裡面 這也是 Aistation裡的設施"). When the user says "X 在 aistation 裡" / "X 屬 aistation", REMOVE it from any esggo / tech-topology section. Do NOT re-add it elsewhere unless explicitly told. Never guess a layer — ask.

## Workflow
1. Before editing MEMORY_SANCTUM.md, `read_file` the current file — it drifts; do not trust memory of its contents.
2. Apply the user's layer placement exactly. When in doubt which layer, ASK; do not guess.
3. Keep the in-memory store and the markdown mirror consistent (dual write).
4. Append a 聖所變更紀錄 row for every structural change; be honest about self-corrections (e.g. "我誤加" / "Second層移除 aistation ftg（我誤加）").

## Environment boundary (verify if deployment changes)
The Docker sandbox only mounts `OneDrive` + `secret-vault`; `hermes` binary / `state.db` / `.ssh` are NOT reachable. Therefore `hermes doctor --fix` and private-key SSH verification (`ssh -i ... ubuntu@161.118.248.180`) must run on the Windows host — deliver the exact command, do not fabricate output. The `ssh` client exists in-sandbox but cannot authenticate (no key, VPS:22 unreachable from sandbox).

## References
- `references/sanctum-skeleton.md` — canonical MEMORY_SANCTUM.md layer skeleton for copy/repair.

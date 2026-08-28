# Second-Brain Note Recipe (esggo vault/)

The `oa-dual-agent-obsidian` skill defines the vault layout. This note records the
CONCRETE recipe exercised 2026-08-13 to add a knowledge-garden note, since the
skill text is broader than the per-note mechanics.

## Vault location (this repo)
- `C:\Project\esggo\vault\AGENTS.md` — vault-level 5T instruction
- `C:\Project\esggo\vault\Agents\context\` — notes land here
- `00-Index.md` — the MOC (Maps of Content); every new note MUST be linked here
- Sync bridges (canonical↔vault): `scripts/sync-vault-types.ts` (vault→canonical),
  `scripts/sync-types-to-vault.ts` (canonical→vault), `scripts/export-shared-types.js`

## Note frontmatter contract (§26b quality-hook enforced)
Every note MUST open with:
```yaml
---
source_origin: <file-or-skill the note is derived from>
co_authors: []
created: 2026-08-13
modified: 2026-08-13
sync: mirror          # human-written mirror; sync:up means "promote to canonical"
lifecycle: active
tags: [topic, ...]
---
```
The `.githooks/pre-commit` (30号質控蜂) blocks commits whose vault notes lack
`source_origin` + `co_authors`.

## Steps to add a note (real, verified this session)
1. `write_file` the new note at `vault/Agents/context/<Name>.md` with the frontmatter above
   and `[[wikilinks]]` at the bottom to related notes (e.g. `[[00-Index]]`, `[[05TProtocol]]`).
2. `patch` `vault/Agents/context/00-Index.md` — add a `- [[<Name>]] — <one-line desc>` line
   under the most relevant section (e.g. "進階項目（已落地）").
3. Verify: `ls vault/Agents/context/<Name>.md` exists; `grep -c "<Name>" vault/Agents/context/00-Index.md` → 1.

## Gotchas
- `read_file` reports these `.md` files as "Binary file" (BOM/CRLF). Use `sed -n` via terminal
  to inspect them; `write_file`/`patch` work fine.
- Do NOT run the sync-vault-types bridge for a plain `sync: mirror` note — it has no ts
  code-block to promote, so the bridge is a no-op. Only run bridges when a note is marked `sync:up`.
- The Obsidian app vault is a SEPARATE location:
  `C:\Users\dingj\iCloudDrive\iCloud~md~obsidian\DingJun\` (40 md notes). The repo `vault/`
  is the source of truth that the bridges sync FROM; don't edit the iCloud vault directly for
  code-derived notes.

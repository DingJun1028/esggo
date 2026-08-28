---
name: hermes-cli-catalog
description: Use when the user wants an annotated Hermes CLI catalog.
---

# Hermes CLI Catalog (annotated command compendium)

## When to use
- "把 Hermes 所有指令註記成攻略詮解" / "annotate every command with effect/type/description/usage/integration"
- "use every command once" / "list and document all hermes subcommands"
- Any request to produce a complete Hermes CLI reference or strategy compendium.

## Workflow
1. Load the authoritative source first: `skill_view(name='hermes-agent', file_path='references/cli-reference.md')`. It lists the canonical command groups and global flags — use it as the skeleton, NOT as the only source (it omits many flags).
2. Dump REAL `--help` for every subcommand into one file (see `scripts/dump_help.sh`). This grounds every flag/argument in actual output rather than memory. ~70 subcommands → ~1500 lines, fast.
3. Split commands into two buckets:
   - **SAFE READ-ONLY** → actually execute and capture stdout. Typical: `--version`, `status`, `config show|path|env-path|check`, `skin list`, `skills search`, `tools list`, `sessions list|stats`, `insights`, `prompt-size`, `logs`. Mark these **[LIVE]**.
   - **INTERACTIVE / DESTRUCTIVE / CREDENTIALED** → do NOT execute. Annotate from the `--help` dump and mark **[DOC]**. Examples: `model`, `auth add`, `setup`, `gateway run`, `send`, `cron create`, `backup`, `update`, `uninstall`, `import`, `kanban`, `profile delete`, `desktop`, `skills install/uninstall`, `security audit`, `debug share`, `import-agent`, `computer-use install`, `doctor` (heavy/slow).
4. Build the table with columns: 效果 (Effect) / 類型 (Type) / 說明 (Description) / 使用場景 (Usage) / 集成連動 (Integrations). Group by function (global flags, chat/model, auth, config, tools/skills, mcp, gateway, cron, sessions, insights, memory, ui, projects/kanban, hooks/approvals, security/backup, debug, infra, desktop/dashboard, files/update, quick-index).
5. Write the compendium to a file; report the absolute path. Include a **Honesty Log** at the end listing exactly which commands were [LIVE] vs [DOC].

## Pitfalls
- NEVER literally "use every command once" by executing destructive/interactive ones. `setup`, `auth add`, `gateway run`, `update`, `uninstall`, `import`, `profile delete`, `skills install/uninstall` have side effects (config writes, OAuth flows, service installs, data restore, reboots). Annotate from `--help` instead — this satisfies "use once" as documentation, not as mutation.
- `hermes doctor` and other heavy diagnostics can exceed the default 180s terminal timeout and return exit 124. If you must run them, use `background=true` + `notify_on_complete`, or raise `timeout`. Don't report them as "failed" — report the timeout honestly.
- Don't fabricate output for commands you didn't run. [DOC] entries MUST come from the real `--help` dump, and you MUST state they were not executed.
- The bundled `hermes-agent` skill is protected — do not patch it directly. If you find it wrong, recommend `hermes curator adopt hermes-agent` (only the user can do this in a foreground session).

## Support files
- `scripts/dump_help.sh` — bash loop that appends `hermes <cmd> --help` for a word-list of subcommands into one file (reproducible catalog refresh).
- `references/command_matrix.md` — the generated annotated compendium (effect/type/description/usage/integration for all ~70 subcommands), with [LIVE]/[DOC] markers and a honesty log. Regenerate periodically; treat as a snapshot dated in its header.

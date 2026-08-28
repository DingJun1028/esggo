#!/usr/bin/env bash
# dump_help.sh — reproducible Hermes CLI --help catalog generator.
# Usage: bash dump_help.sh [outfile]
# Appends `hermes <cmd> --help` for every known subcommand into one file.
# Run from any directory; hermes must be on PATH.
set -u
OUT="${1:-/tmp/hermes_help_dump.txt}"
: > "$OUT"
CMDS="chat model moa fallback secrets egress migrate gateway proxy lsp setup whatsapp whatsapp-cloud slack send login logout auth status cron sync webhook portal kanban project hooks doctor security approvals dump debug backup checkpoints import import-agent config skin console pairing skills bundles plugins curator pets journey learning memory-graph memory tools computer-use mcp sessions insights monitoring claw version update uninstall acp profile completion dashboard serve desktop gui logs prompt-size"
for c in $CMDS; do
  printf '===== hermes %s --help =====\n' "$c" >> "$OUT"
  timeout 30 hermes "$c" --help >> "$OUT" 2>&1
  printf '\n' >> "$OUT"
done
echo "DUMP_DONE lines=$(wc -l < "$OUT") -> $OUT"

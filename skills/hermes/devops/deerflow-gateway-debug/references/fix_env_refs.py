#!/usr/bin/env python3
"""Replace all $VAR references in config.yaml with literal placeholders.

DeerFlow's config resolver crashes at startup if ANY $VAR in config.yaml cannot
resolve to a shell env var (ValueError: Environment variable X not found). For
local/ollama-only mode, cloud API keys are irrelevant, so flattening $VAR to a
placeholder string is the safe fix. Run from the deer-flow project root.

Usage:  python3 references/fix_env_refs.py [path/to/config.yaml]
"""
import re
import sys

path = sys.argv[1] if len(sys.argv) > 1 else "config.yaml"
cfg = open(path).read()


def repl(m):
    return "placeholder-" + m.group(1).lower()


new = re.sub(r"\$([A-Z_]+)", repl, cfg)
open(path, "w").write(new)

remaining = re.findall(r"\$[A-Z_]+", new)
print(f"replaced $ENV refs in {path}; remaining ${len(remaining)}: {remaining}")

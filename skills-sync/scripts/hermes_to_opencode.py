#!/usr/bin/env python3
# skills-sync converter: Hermes SKILL.md -> OpenCode .md
# No external deps. UTF-8 preserved (CJK safe).
import re, sys
from pathlib import Path

def parse_front(text):
    m = re.match(r"^---\n(.*?)\n---\n", text, re.S)
    fm = {}
    if m:
        for line in m.group(1).splitlines():
            if ":" in line:
                k, v = line.split(":", 1)
                fm[k.strip()] = v.strip().strip('"')
    return fm

def convert(skill_dir: Path, out_dir: Path):
    sk = skill_dir / "SKILL.md"
    text = sk.read_text(encoding="utf-8")
    fm = parse_front(text)
    # body = everything after the second '---'
    parts = text.split("---", 2)
    body = parts[2] if len(parts) >= 3 else text
    name = fm.get("name", skill_dir.name)
    desc = fm.get("description", "")
    out = out_dir / f"{name}.md"
    out.write_text(
        f"---\nname: {name}\ndescription: {desc}\n---\n\n{body.strip()}\n",
        encoding="utf-8")
    return out

if __name__ == "__main__":
    hermes_root = Path(sys.argv[1]) if len(sys.argv) > 1 else Path("skills/hermes")
    out = Path(sys.argv[2]) if len(sys.argv) > 2 else Path("skills/opencode")
    out.mkdir(parents=True, exist_ok=True)
    for d in hermes_root.iterdir():
        if (d / "SKILL.md").exists():
            p = convert(d, out)
            print(f"converted {d.name} -> {p}")

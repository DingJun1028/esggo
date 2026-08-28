#!/usr/bin/env python3
"""hermes_to_opencode.py — Hermes SKILL.md → OpenCode .md (雙向同步契約 scripts/)

無外部依賴。把 Hermes 技能樹 <hermes_root>/<name>/SKILL.md 轉成 OpenCode 單檔 .md：
  frontmatter name/description 對映，正文作為 OpenCode prompt 主體，CJK 全程 UTF-8 保留。

用法:
  python scripts/hermes_to_opencode.py [hermes_root] [out_dir]
  預設 hermes_root=skills/hermes, out_dir=skills/opencode
"""
import re
import sys
from pathlib import Path


def parse_front(text: str):
    m = re.match(r"^---\n(.*?)\n---\n", text, re.S)
    fm = {}
    if m:
        for line in m.group(1).splitlines():
            if ":" in line:
                k, v = line.split(":", 1)
                fm[k.strip()] = v.strip().strip('"')
    return fm


def convert(skill_dir: Path, out_dir: Path) -> Path:
    sk = skill_dir / "SKILL.md"
    text = sk.read_text(encoding="utf-8")
    fm = parse_front(text)
    # 去掉首個 frontmatter 區塊，取正文
    if text.count("---") >= 2:
        body = text[text.find("---", 3) + 3:]
    else:
        body = text
    name = fm.get("name", skill_dir.name)
    desc = fm.get("description", "")
    out = out_dir / f"{name}.md"
    out.write_text(
        f"---\nname: {name}\ndescription: {desc}\n---\n\n{body.strip()}\n",
        encoding="utf-8",
    )
    return out


def main() -> int:
    hermes_root = Path(sys.argv[1]) if len(sys.argv) > 1 else Path("skills/hermes")
    out = Path(sys.argv[2]) if len(sys.argv) > 2 else Path("skills/opencode")
    if not hermes_root.exists():
        print(f"[FAIL] 找不到 {hermes_root}")
        return 1
    out.mkdir(parents=True, exist_ok=True)
    count = 0
    for d in sorted(hermes_root.iterdir()):
        if (d / "SKILL.md").exists():
            p = convert(d, out)
            print(f"converted {d.name} -> {p}")
            count += 1
    print(f"\n[PASS] 共轉換 {count} 個技能為 OpenCode 格式 → {out}")
    return 0


if __name__ == "__main__":
    sys.exit(main())

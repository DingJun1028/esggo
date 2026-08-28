#!/usr/bin/env python3
"""Static check: every $('id') / getElementById('id') referenced in <script>
blocks must exist as an id="..." in the same HTML file. A missing id means a
runtime null deref that aborts the whole <script> (silently killing every
handler defined after it). Run after any UI refactor.

Usage: python3 check_script_ids.py <file.html>
"""
import re
import sys

def main():
    if len(sys.argv) < 2:
        print("usage: check_script_ids.py <file.html>")
        sys.exit(2)
    path = sys.argv[1]
    html = open(path, encoding="utf-8").read()

    # ids present in markup
    present = set(re.findall(r'\bid="([A-Za-z0-9_]+)"', html))

    # ids referenced in <script> blocks
    scripts = re.findall(r"<script>(.*?)</script>", html, re.S)
    refs = set()
    for s in scripts:
        for m in re.findall(r"\$\('([A-Za-z0-9_]+)'\)", s):
            refs.add(m)
        for m in re.findall(r"getElementById\('([A-Za-z0-9_]+)'\)", s):
            refs.add(m)

    missing = sorted(refs - present)
    if missing:
        print(f"MISSING IDS ({len(missing)}): reference in JS but not in HTML:")
        for i in missing:
            print(f"  - {i}")
        sys.exit(1)
    print("OK: all referenced ids exist in HTML (no null-deref crash risk).")

if __name__ == "__main__":
    main()

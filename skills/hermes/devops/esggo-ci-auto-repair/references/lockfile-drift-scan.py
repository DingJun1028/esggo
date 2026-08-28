#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
pnpm lockfile specifier drift scanner (esggo monorepo).

Why: CI fails with
    [ERR_PNPM_OUTDATED_LOCKFILE] Cannot install with "frozen-lockfile"
    because pnpm-lock.yaml is not up to date with <ROOT>/apps/<x>/package.json
but pnpm only names the FIRST offending manifest. This script lists every
importer whose package.json specifier != the lockfile `specifier:` value,
so one lockfile regen fixes all of them at once.

Usage:
    python lockfile-drift-scan.py C:/Project/esggo

Gotchas baked in (learned the hard way, 2026-08-09):
  * Lockfile keys for scoped packages are QUOTED ('@esggo/shared':). Strip the
    quotes or you get a flood of false "lock=MISSING" rows.
  * pnpm rewrites an importer specifier to the value from `overrides:` in
    pnpm-workspace.yaml. Rows where lock== an override value (e.g. uuid
    ">=11.1.1", postcss ">=8.5.23") are EXPECTED, not drift. Cross-check
    pnpm-workspace.yaml before reporting a count.
  * Run it with the Windows-native python and a NATIVE path
    (python3 "C:/..." ); an MSYS /c/... path makes python look for C:\\c\\...
  * Do NOT `grep -r` the monorepo to find this — it times out (see
    git-monorepo-pitfalls). Parse the lockfile directly like below.

Fix once drift is confirmed:
    cd <repo> && pnpm install --lockfile-only      # pnpm must match packageManager
    git add pnpm-lock.yaml && git commit -m "fix(ci): regen pnpm-lock.yaml [OA-TWINS]"
"""
import json
import os
import re
import sys

root_dir = sys.argv[1] if len(sys.argv) > 1 else "."


def unq(s):
    s = s.strip()
    if len(s) >= 2 and s[0] == s[-1] and s[0] in ("'", '"'):
        return s[1:-1]
    return s


lock = open(os.path.join(root_dir, "pnpm-lock.yaml"), encoding="utf-8").read().splitlines()
imp, cur, sec, pkg, inside = {}, None, None, None, False
for l in lock:
    if l.startswith("importers:"):
        inside = True
        continue
    if inside and l and not l.startswith(" "):
        break
    if not inside:
        continue
    m = re.match(r"^  ([^ ].*):$", l)
    if m:
        cur = unq(m.group(1))
        imp.setdefault(cur, {})
        sec = None
        continue
    m = re.match(r"^    (dependencies|devDependencies|optionalDependencies):$", l)
    if m:
        sec = m.group(1)
        continue
    m = re.match(r"^      ([^ ]+):$", l)
    if m:
        pkg = unq(m.group(1))
        continue
    m = re.match(r"^        specifier: (.*)$", l)
    if m and cur and pkg:
        imp[cur][(sec, pkg)] = unq(m.group(1))

drift = []
for root, dirs, files in os.walk(root_dir):
    dirs[:] = [d for d in dirs if d not in ("node_modules", ".git", "dist", ".next", "build", "coverage")]
    if "package.json" not in files:
        continue
    rel = os.path.relpath(root, root_dir).replace(os.sep, "/")
    key = "." if rel == "." else rel
    if key not in imp:
        continue
    try:
        pj = json.load(open(os.path.join(root, "package.json"), encoding="utf-8"))
    except Exception as e:  # noqa: BLE001
        drift.append("%s : UNPARSEABLE package.json %s" % (key, e))
        continue
    for s in ("dependencies", "devDependencies", "optionalDependencies"):
        for name, spec in (pj.get(s) or {}).items():
            got = imp[key].get((s, name))
            if got is None:
                drift.append("%s [%s] %s: pkg=%s lock=MISSING" % (key, s, name, spec))
            elif got != unq(spec):
                drift.append("%s [%s] %s: pkg=%s lock=%s" % (key, s, name, spec, got))

by_ws = {}
for d in drift:
    ws = d.split(" ")[0]
    by_ws[ws] = by_ws.get(ws, 0) + 1
print("workspaces in lockfile: %d" % len(imp))
print("DRIFT COUNT: %d" % len(drift))
print("BY WORKSPACE: " + json.dumps(by_ws, ensure_ascii=False))
for d in drift:
    print(" - " + d)

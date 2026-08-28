---
name: agent-role-registry
description: >
  Defines, documents, and operationalizes multi-agent role registries with
  incremental-inference collaboration patterns. Use when building persona/role
  catalogs, defining agent team specs, implementing hive-mind collaboration
  modes, or creating smoke tests for role-definition artifacts.
  Triggers on: role registry, bee colony, agent personas, hive modes,
  incremental inference, typo defense for Chinese role names.
---

# Agent Role Registry

## When to use
- You need a **single source of truth** for N agent roles (personas, capabilities, specs).
- Roles collaborate via **incremental inference** rather than atomic tasks.
- You want repeatable **smoke tests** for role definitions and collaboration demos.
- The project uses **Traditional Chinese** for all role names and docs.

## Trigger phrases
- "建立蜂民清冊", "role registry", "agent persona catalog"
- "增量推斷", "hive modes", "蜂巢共推理"
- "防呆/避免錯別字", "typo defense for Chinese"

---

## Workflow (MECE)

1. **Define total hive charter** — name, core capability, operating mode, date.
2. **Spec each role** — 職能 / 規格 / 推理 / 能力 / 應用場景.
3. **Define collaboration modes** — 單蜂深度 / 串聯 / 蜂巢共推理.
4. **Add typo defense** — `check_typo.sh` + `.gitattributes` UTF-8 rules.
5. **Add smoke tests** — minimal pytest covering single / chain / hive outputs.
6. **Commit with push** — stage all, amend if Git shows mangled Chinese filenames.

### Step 4 detail: typo defense on Windows Git
Chinese filenames can appear as `\350\234\202...` octal blobs. Mitigation:
- Add `.gitattributes`:
  ```text
  *.md text working-tree-encoding=UTF-8
  *.txt text working-tree-encoding=UTF-8
  ```
- Provide a shell script that excludes footnote lines:
  `grep "PATTERN" file | grep -v "^\*.*PATTERN" | grep -v "備註.*PATTERN"`

### Step 5 detail: smoke tests
Keep tests tiny and deterministic; avoid cloud/network. Use `from scripts import bee_colony_demo` style imports so pytest runs without path hacks.

---

## Pitfalls
- **Dirty Chinese filenames in Git index**: if `git status` shows octal-encoded filenames, re-checkout or `git rm --cached` the mangled entry before recommitting.
- **On Windows, PowerShell `curl -o` may drop files**: fallback to Python `urllib.request.urlretrieve` with explicit path.
- **pytest teardown PermissionError**: Windows temp cleanup can fail; run with `python -c "import ast; ast.parse(open(...).read())"` as a syntax fallback.
- **Two Python installs conflict**: verify with `which python` / `where python` and use a single `sys.executable` pip install.

---

## Outputs
- `蜂民清冊.md` — role catalog with specs
- `scripts/bee_colony_demo.py` — collaboration demo
- `scripts/__init__.py` — makes scripts importable
- `tests/test_bee_colony_demo.py` — smoke tests
- `docs/bee_colony_collaboration.png` — visual flowchart
- `check_typo.sh` + `.gitignore` + `.gitattributes`

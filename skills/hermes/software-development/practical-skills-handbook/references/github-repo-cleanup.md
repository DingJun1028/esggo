# GitHub Repo Cleanup — condensed knowledge bank

Session-verified `gh repo` hygiene knowledge (used by 實踐技書 Chapter 01 /
Chapter 18). Verified against `gh repo --help` + `gh repo edit --help` on 2026-07.

## Real `gh repo` cleanup subcommands

| Command | Effect | Notes |
|---------|--------|-------|
| `gh repo archive <o>/<r>` / `gh repo unarchive` | Read-only keep | Reversible |
| `gh repo rename <new>` | Rename repo | Old URLs auto-redirect |
| `gh repo set-default <o>/<r>` | Default repo for cwd `gh` calls | Avoid typing `o/r` |
| `gh repo delete <o>/<r> --yes` | Delete | **IRREVERSIBLE**; needs `--yes` |
| `gh repo sync [dest] [--source X] [--force]` | Sync fork/default from upstream | Fast-forward; `--force` = hard reset |
| `gh repo autolink create <o>/<r> --template URL --key PREFIX` | Auto-link issue/PR numbers | |
| `gh repo deploy-key add <file> --title T [--readonly]` / `list` / `delete <id>` | CI/server SSH keys | |

## Settings hygiene flags (`gh repo edit --help`)

- `--enable-secret-scanning` — advanced security: secret scanning.
- `--enable-secret-scanning-push-protection` — block leaked secrets on push.
- `--delete-branch-on-merge` — auto-delete head branch after merge.
- `--enable-squash-merge` / `--enable-auto-merge`.

## Corrections / traps (do NOT propagate)

- ⚠ `gh repo sync --dry-run` **does not exist**. Check fork divergence with:
  `git fetch upstream && git rev-list --left-right --count HEAD...upstream/main`
  (right count = 0 → in sync).
- curl fallbacks: archive = `PATCH /repos/o/r {"archived":true}`;
  delete = `DELETE /repos/o/r`; topics = `PUT` with
  `Accept: application/vnd.github.mercy-preview+json`.

## Programmatic verification of Actions YAML

PyYAML parses an unquoted `on:` key as boolean `True`:

```python
import yaml
d = yaml.safe_load(open('.github/workflows/x.yml'))
print(d[True]['schedule'])          # NOT d['on']
print([s.get('name','<uses>') for s in d['jobs']['inventory']['steps']])
```

Or author the workflow YAML with `"on":` quoted to keep `d['on']` working.

## Windows/MSYS bridge gotcha

When a shell script passes data between native `gh` (Windows binary → writes
`C:\tmp`) and MSYS python (reads virtual `/tmp`), the paths disagree. Write temp
files in the current working directory (resolved identically by both). `mktemp`
under MSYS emits a trailing CR — strip with `tr -d '\r'`, or use a relative path
in CWD instead of `mktemp`. Also avoid `python3 - "$HUGE_JSON"` (argv too long
with many repos) — write JSON to a CWD temp file and pass its path.

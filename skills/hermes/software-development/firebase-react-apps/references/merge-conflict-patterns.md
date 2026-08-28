# Merge Conflict Patterns — React + Firebase Projects

## Typical conflict sources in multi-PR workflows

When a Firebase + React project has parallel PRs (e.g. one initializing structure, another adding features), conflicts cluster in predictable files:

| File | Conflict type | Resolution |
|------|--------------|------------|
| `src/App.jsx` | Import lines (icons, repositories), new components, view routing | `--ours` when feature branch adds new imports/views main doesn't have |
| `src/db.js` | Firebase SDK imports, module-level helpers | `--ours` when feature branch has bug fixes (e.g. missing imports) |
| `src/i18n/translations.js` | New i18n keys added by feature branch | `--ours` — main's version won't have the new keys |
| `src/repositories/*.js` | add/add conflicts when both branches create the same file | `--ours` when feature branch has fixes (e.g. missing `db` import) |
| `*.adapter.js` | ESM/CJS fixes | `--ours` when feature branch converted `require()` to `import()` |

## Real example: 19 conflicts across 5 files

From the ESGGO Learning Center project:
- `src/App.jsx` — 9 conflicts (all were feature additions: auth UI, TA panel, pairing imports)
- `src/db.js` — 2 conflicts (initializeFirestore import fix, getCurrentRole bug fix)
- `src/i18n/translations.js` — 3 conflicts (new auth i18n keys added)
- `src/repositories/profile.repository.js` — 1 conflict (db import fix)
- `src/repositories/supabase.adapter.js` — 4 conflicts (require→import ESM fix)

All resolved with `git checkout --ours` because every conflict was a case of the feature branch having strictly more content (bug fixes + new features) than main.

## When NOT to use --ours blindly
- Main merged a dependency update (`package-lock.json` / `pnpm-lock.yaml`) → use `--theirs` then re-install with the project's chosen package manager and commit the regenerated lockfile
- Main rewrote a component you also changed → manual merge required
- Main updated security rules (`firestore.rules`) → review both versions carefully
- Main added a workspace config file (`pnpm-workspace.yaml`) with missing `packages:` array → keep `--ours` only if the feature branch's version includes the `packages:` array; otherwise merge manually so CI can resolve workspace root
- `.gitignore` conflicts with a tracked file (e.g. `.firebaserc`) → remove the ignore entry from the file, re-add the tracked file with `git add`, commit. Never leave a tracked file listed in `.gitignore`.

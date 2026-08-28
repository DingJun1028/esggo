# `react-hooks/static-components` ×20 — two declarations, and a verification that lied

Cron turn, 2026-08-08 ~07:0x UTC. Closed the whole loop (diagnose → fix → PR → merge → post-merge
verify) on the last remaining *error-level* lint cause in esggo. Two lessons generalise well beyond
this rule: **the error count does not equal the declaration count**, and **a linter that aborts greps
as clean**.

## Entry state

Watcher said `action: "none"` (state pointer buried the batch — see the state-pointer section in
SKILL.md). Gap scan on the newest sha `c8cede3` found 4 red workflows:

| Run | Workflow | Signals | Tracker |
| --- | --- | --- | --- |
| 31243477069 | ESG-GO CI/CD | `static-components` ×20, `syntax error near` ×1, Trivy HIGH:7/CRITICAL:1 | #441 #433 #429 |
| 31243477065 | Sacred Pipeline | `static-components` ×20 | #441 |
| 31243477059 | OmniCore CI | `static-components` ×20, `Possible secret detected` ×2, `syntax error near` ×1 | #441 #430 #433 |
| 31243477058 | Deploy to Oracle VPS | `Permission denied (publickey)`, exit 255 | #434 |

Every cause already had a tracker ⇒ filed **zero** new issues. `#449`/`#450` already carried three
block-warnings each and `#461` was already re-classified by a sibling ⇒ stayed silent on all three.
That freed the turn for the one cause that was actually fixable: `static-components`, blocking 3 workflows.

`grep -l "ERR_PNPM" r31243477*.log` → empty, confirming the install-stage P0 stayed fixed.

## Diagnosis

All 20 violations sat under a single file header in the log (`.../src/App.jsx`), so this was one file,
not a repo-wide pattern. The code frame names both ends of the problem:

```
   87:10  error  Error: Cannot create components during render
>  87 |         <Field label={t.detail.note} value={d.desc} />
      |          ^^^^^ This component is created during render
>  78 |   const Field = ({ label, value }) => value ? (
      |                 ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^ ...
>  83 |   ) : null;
      |   ^^^^^^^^^ The component is created during render here
```

Note `grep -c "<Field "` returned **12** while CI reported **20** — because it counts *lines*, and
lines 91/92 pack 4–5 `<Field/>` each. The rule reports per **usage**.

Picking the right file mattered: `git grep "item.type === 'upload'" origin/main` returned three
copies (`src/App.jsx:86`, `apps/learning-center/src/App.jsx:56`,
`esggo-omni-center/apps/learning-center/src/App.jsx:56`). Only the line-86 one matched CI's reported
line. The other two were left untouched — `learning-center-ci` was already green.

## The verification that lied (trap #4)

First attempt reused the repo's own config via a `node_modules` junction:

```
Error: Cannot find module 'eslint-plugin-react'
Require stack: - C:\Project\_verify3\eslint.config.js
EXIT=2
```

`grep -c static-components` on that output returned **0**. That zero was meaningless — ESLint never
linted a single file. Caught only by checking the exit code (`2` = config fault, not `0`/`1`).

Recovery: a minimal standalone flat config loading only the plugin that owns the rule
(`eslint-plugin-react-hooks` *was* installed; only `eslint-plugin-react` was missing):

```js
// eslint.verify.mjs
import reactHooks from 'eslint-plugin-react-hooks';
export default [{
  files: ['**/*.jsx'],
  plugins: { 'react-hooks': reactHooks },
  languageOptions: { ecmaVersion: 'latest', sourceType: 'module',
                     parserOptions: { ecmaFeatures: { jsx: true } } },
  rules: { 'react-hooks/static-components': 'error' },
}];
```

```bash
./node_modules/.bin/eslint --no-config-lookup --config eslint.verify.mjs <file>
```

**Calibration step (do not skip):** ran it against the pre-fix file first —
`git show origin/main:src/App.jsx > Before.jsx` → **20**, exactly CI's number. Only then was the
harness trustworthy.

## The partial fix that calibration caught

Hoisting `Field` to module level (it closes over nothing — `label`/`value` are its own props, and it
never touches `d`/`atts`/`t`/`item`) gave:

```
447:6  error  Error: Cannot create components during render
> 397 |   const LayoutShell = ({ children }) => (
```

**20 → 1, not 20 → 0.** A second inline component, `LayoutShell`, declared inside the main component
and used once to wrap the whole return. Had the fix been shipped on the strength of "I hoisted the
component", CI would have stayed red.

`LayoutShell` closes over `t` plus nav state, so hoisting would mean threading many props. Converted
it to a render function instead — a lowercase function *called directly* is not a component:

```jsx
const layoutShell = (children) => ( ... );      // was: const LayoutShell = ({ children }) => (
return layoutShell(                              // was: return (
  <>                                             //         <LayoutShell>
    ...
  </>                                            //         </LayoutShell>
);
```

Re-run: **EXIT=0, zero violations.** (ESLint parsing the file cleanly also confirms JSX validity — a
syntax break surfaces as a fatal parse error.)

## Evidence: one grep line proves fix + no-regression

```bash
grep -oE "✖ [0-9]+ problems \([0-9]+ errors, [0-9]+ warnings\)" <before.log> <after.log>
```

| Stage | Run | sha | ESLint summary |
| --- | --- | --- | --- |
| pre-fix `main` | 31243477065 | `c8cede3` | `160 problems (20 errors, 140 warnings)` |
| PR #462 | 31245411905 | PR head | `140 problems (0 errors, 140 warnings)` |
| **post-merge `main`** | **31245520032** | **`1d62a09`** | **`140 problems (0 errors, 140 warnings)`** |

Errors 20 → 0; **warnings 140 → 140 unchanged** — the flat warning count is what proves no
`eslint-disable` / rule-downgrade shortcut was used. `static-components` count on post-merge `main`
(Sacred *and* OmniCore) = **0**. `grep -icE "cannot find module|command not found|MODULE_NOT_FOUND|ERR_PNPM"`
on PR logs = **0**.

## Outcome and the honest caveats

- PR #462 (1 file, +11/−10) was **merged by a concurrent agent within ~4 minutes** of opening —
  `gh pr view --json state` already read `MERGED` when polled. Expected on this repo; do not assume
  your PR is still open.
- #441 auto-closed via `Closes #441` **with no evidence attached**; posted the before/after table as
  a separate `gh issue comment` so the closure is auditable.
- Sacred Pipeline **stayed red** — now on the `--max-warnings` threshold (0 errors / 140 warnings),
  i.e. #444. Classic unmasking; wrote that judgement into the tracker in words.
- Still red and *not* addressed here, all pre-existing and tracked: `Possible secret detected` (#430),
  `syntax error near` (#433), Trivy HIGH/CRITICAL (#429), VPS `Permission denied (publickey)` (#434 —
  not auto-repairable, needs VPS console).
- `git worktree remove --force` returned `Permission denied` but git still de-registered `_verify3`
  (confirmed via `git worktree list`) — benign Windows case.
- Watcher state was already advanced to the newest run id by a sibling; monotonic, so no write needed.

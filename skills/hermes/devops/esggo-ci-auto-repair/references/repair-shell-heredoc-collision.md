# `repair-shell`: nested-heredoc delimiter collision (verified 2026-08-08)

The dominant cause of `Validate VPS Scripts` failures in esggo, and distinct from the simpler
unbalanced-quote case.

## Mechanism

An OUTER heredoc that *generates a shell script* uses `<< 'EOF'`, but the generated content itself
contains nested `<< 'EOF'` blocks. Bash ends the outer heredoc at the **first bare `EOF`**, so the
rest of the generated body leaks into the parser and blows up far below — typically hundreds of
lines later, as a bogus `syntax error near unexpected token '}'`.

## Detect

Pair openers against terminators; a mismatch in counts is the tell:

```bash
grep -nE "<<" <script>          # openers
grep -nE "^\s*EOF\s*$" <script> # terminators  (more terminators than openers ⇒ collision)
```

## Fix

Identify each outer heredoc's TRUE terminator by the command that follows it (typically
`chmod +x <the generated script>`). Give each **outer** heredoc a unique delimiter (`DEPLOY_EOF`,
`COMPLIANCE_EOF`); leave the nested `EOF`s untouched.

Watch for a bad-merge duplicated tail leaving an orphan `EOF` + stray `}` — that must be deleted or
the file still fails.

## Applying the edits

Use a small `write_file` + `python3` fixer script that asserts `src.count(old) == 1` per edit: the
`patch` tool validates the whole file and every intermediate state here is still invalid, and
`execute_code` is blocked under cron.

## Verify with CI's own step

Copy `ci.yml`'s loop verbatim *including the skip-list* (`*/console-*|*/recovery/*|*-bundle*|*oneshot*`)
into a local script and require `CI_STEP_EXIT=0`. A plain `find vps -name '*.sh'` loop reports
spurious FAILs for files CI prints as `SKIP`.

Count the FAILs first — there is usually more than one:
`grep -oE "FAIL vps/[a-z0-9/_.-]+"`. On 2026-08-08 the step had **2** distinct broken scripts, so
fixing only the one named in the top error line ships a still-red job.

Prove no regression with a file-count conservation table (the two flips are the whole diff):

| | OK | FAIL | SKIP | total |
| --- | --- | --- | --- | --- |
| CI before | 38 | 2 | 11 | 51 |
| after | **40** | **0** | 11 | 51 |

Calibrate per file: pre-fix `bash -n` must reproduce CI's error text **verbatim** (`line 783: syntax
error near unexpected token '}'`), post-fix `EXIT=0`. Expect the job to vanish entirely from
`--log-failed` while the workflow stays red on unrelated tracked causes — that is unmasking, and the
tracker comment must say so explicitly.

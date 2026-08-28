# MSYS `sed` de-ANSI is a SILENT NO-OP — a third way to fabricate a false PASS (2026-08-09)

Extends "five traps that produce false PASS", trap 5.

## Symptom
The canonical de-ANSI in the skill body:

```bash
sed -e 's/\x1b\[[0-9;]*m//g' <log>
```

**does nothing** under MSYS/Git-Bash `sed` — `\x1b` is not interpreted as an escape. It exits 0 and
passes the text through unchanged, so the output still contains `^[[2m Test Files ^[[22m ...`.

Every follow-up grep for a de-ANSI'd string then returns **empty**, which is indistinguishable from
"the signature is gone" — the same false-PASS shape as the aborted-linter (trap 4).

Observed this turn on `r31287988615_omnicore.log`:

| Command | Result | Truth |
| --- | --- | --- |
| `sed ... \| grep -a -A6 "FAIL cli/esggo-cli"` | **empty** | 3 CLI test files ARE failing |
| `sed ... \| grep -a -B4 -A12 "Error: CLI build failed"` | **empty** | phrase present 6× |
| `grep -ah "CLI build failed" <raw log>` | 6 hits | correct |

## Second, independent cause of the same empty result
ANSI codes sit **inside** the phrase, not just around it. The raw bytes are:

```
^[[31m^[[1mError^[[22m: CLI build failed^[[39m
```

So `Error: CLI build failed` — the string a human reads off the rendered log — **never matches the
raw file**, because `^[[22m` sits between `Error` and `:`. Even a working stripper is needed first.

## Fix
Use `perl`, and **calibrate it** before trusting any result derived from it:

```bash
perl -pe 's/\e\[[0-9;]*m//g' <log> > <clean.log>
grep -c "CLI build failed" <clean.log>     # must be NON-zero, else the stripper failed too
```

Alternative that also works: `tr -d '\033' | sed 's/\[[0-9;]*m//g'`.

## Standing habit
1. Prove presence with a **short literal containing no ANSI break**: `"CLI build failed"`,
   `"Test Files"`, `"Possible secret detected"`.
2. Only then strip codes to READ the number.
3. Never conclude "signature absent" from a multi-token pattern (spaces, `:`, `|`, parens) —
   see also the `-E` variant of this trap already documented in the skill body.

## Related miscount seen the same turn
`grep -c "Possible secret detected"` returned **2** on OmniCore CI, but the two lines are:

```
Secret Scan  Scan for committed secrets  echo "::error::Possible secret detected in source code — aborting."   <- workflow run: source echo
Secret Scan  Scan for committed secrets  ##[error]Possible secret detected in source code — aborting.          <- the real detection
```

⇒ **one** real detection, one file. Confirms the existing "command echo miscount" rule: the workflow's
own script text is inside the log and matches your signature.

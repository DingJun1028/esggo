---
name: jsx-safe-refactoring
title: JSX/Component Safe Refactoring
description: >
  Safe patterns for restructuring large React JSX subtrees — wrapping returns,
  extracting components, and re-parenting without breaking the component tree.
  Trigger when refactoring component returns, adding layout shells/wrappers, or
  renaming/re-parenting JSX in big files.
triggers:
  - "wrap component return in new shell/wrapper"
  - "extract component / split JSX"
  - "reparent JSX subtree"
  - "add layout wrapper to existing view"
  - "close unclosed JSX / build failed on unexpected closing tag"
---

# JSX / Component Safe Refactoring

## Core rule

**Never restructure a large JSX subtree with many small incremental `patch` calls.**

When a component return contains nested ternaries, fragments (`<>...</>`), and repeated closing tags (`</div>`), incremental edits almost always corrupt matching. The error surface (Vite/esbuild "unexpected closing tag") then points to the *symptom* far from the *cause*.

## Preferred workflow

1. **Read the full current block** — use `read_file` to load the entire component return (and surrounding state) into context.
2. **Write the corrected subtree in one shot** — use `write_file` for the whole corrected component, **or** a single `patch` whose `old_string` and `new_string` each span the full old→new subtree.
3. **Verify immediately** — run `pnpm run build` (or the project's build command). Fix structural errors before adding more changes.
4. **Add functional changes only after the structure builds clean.**

## Pitfalls

- **Incremental wrapping**: Adding a new wrapper `<LayoutShell>` around an existing return requires changing the file's *first* opening tag and *last* closing tag. Do not do this with multiple small patches — do it in one replacement that spans the full return block.
- **Poisoned restored baseline**: `git checkout main -- src/App.jsx` can restore a file that is already syntactically broken in main. If lint still errors after restore, do not patch forward from it. Treat the file as poisoned; re-read current state and prepare a full known-good replacement in one write.
- **Orphaned return fragments**: After replacing the main JSX return, broken boundaries can leave orphaned fragments after the new closing `</LayoutShell>`/`</main>` and before the final `};`. That produces parse errors whose location is misleading. After any large return rewrite, inspect the region immediately before `export default function App()` / `};` and remove duplicated/unbound fragments.
- **Orphaned helper fragments define new identifiers wrongly**: Old TA/admin pairing/admin helper subcomponents may survive a return rewrite as orphaned JSX without a parent function/component. Because JSX in a script file is parsed top-level, this can become an unexpected token or syntax parse error.
- **Multiple identical closing tags**: `</div>` appears many times in a typical component. A small `patch` whose `old_string` contains only `</div>` will match the wrong one. Always include enough unique surrounding context (opening tag, sibling element, comment) to make the match unambiguous.
- **Patch drift after failure**: When `patch` returns "Could not find a match", the file state has almost certainly diverged from the context you read. Re-read the region with `read_file` before retrying; do not blind-retry with the same `old_string`.
- **Silent duplicate closes**: A stray `</LayoutShell>` or `</main>` left inside the component return will compile as valid JSX but render an extra element or shift layout. After any refactor, grep for duplicate closing tags near the return block.
- **Vite error location is misleading**: Esbuild parse errors point at the tag it *expected* to close, not where the extra/missing open actually is. If the error points inside an unrelated section, inspect the **real** return block boundaries first.

## Feature-removal audit before deleting code

When a large feature-set cleanup is requested, do not delete assumptions about the file without checking references. This session removed the role/panel/admin system, then later restored partial UI, but lost old feature helper definitions (`ReplayListView`/`ReplayPlayerView`) even though new code still referenced them. Result: runtime `ReferenceError` in production.

**Rule:** Before deleting feature code, grep or search the file/section for all references to the removed identifiers. If any view branch, event handler, router, or lazy component still calls them, either keep the definitions or delete every call site first.

**Quick check:** in React files, search for the component name; if undefined identifiers remain after cleanup, the next deploy can break even when `build` succeeds.

## Google Apps Script web-app deployment confusion

In this session, the user provided two URLs and got `Script function not found: doGet`. The root cause was not the code itself, but deploying the project with the wrong deployment type or as a **Library/Database** instead of a **Web app**. When external access returns that error, the next step is to verify the deployment type, not the script content.

## View/form pattern: do not hide view-specific forms inside a generic catch-all block

When a component handles multiple views with very different forms, avoid collapsing them into one generic `{view === 'x' ? ... : view === 'y' ? ...}` block. In practice that turns complex views into missing-field placeholders; the bundle can contain full i18n strings while the rendered form has no real inputs.

**Safer pattern:**
- Explicitly branch each distinct view.
- Extract complex forms into dedicated components, e.g. `SurveyForm`.
- Keep only structurally similar views in a shared generic block if they reuse the same fields.
- Pass `t` into extracted forms instead of duplicating translation strings.

**Debugging signal:** if bundle includes view-specific text but the live view only shows generic inputs, inspect whether the view is rendering a shared fallback rather than its dedicated form.

## Verification-first rhythm

For UI/visual refactors:
- Do not run tests/lint until the user confirms the visual intent.
- Do run `pnpm run build` after every structural change to catch parse errors early.
- Keep changes KISS/DRY and match surrounding code style (indentation, quote style, className ordering).

## Escape hatch

If structural edits keep failing:
- Restore the file with `git checkout -- <path>`.
- If `git checkout main -- <path>` still leaves parse errors, the **restored version itself is already broken in main**. Treat it as a poisoned baseline: do not patch forward from it.
- Re-read the **current** file state.
- Produce the final desired JSX, then use `write_file` from a known-good base.
- After `write_file`, verify the file still ends with exactly one closing `};` for the component body. When a replacement consumes the last JSX subtree but leaves orphaned JSX fragments later in the file, lint error locations become misleading and pairings/admin views may reference undefined identifiers. A quick grep for the component's closing brace and final `export default`/`};` boundary catches this before deploy.

## Post-replacement sanity check

After replacing a large return block, verify the file still ends with exactly one closing `};` for the component body. When a replacement consumes the last JSX subtree but leaves orphaned JSX fragments later in the file, lint error locations become misleading and pairings/admin views may reference undefined identifiers. A quick grep for the component's closing oabrace and final `export default`/`};` boundary catches this before deploy.

## Deploy-time stale bundle trap

On Firebase Hosting with CDN caching, a successful deploy can still serve an older `assets/index-<hash>.js` for a short window or if the uploaded `dist/` was not freshly built before upload. Always capture the new bundle hash from `pnpm run build`, then verify the live HTML contains that exact hash before declaring success.

## Shared component insertion across multiple page files

When extracting a reusable component like `ContactSection` and replacing inline CTA blocks in many page files, do not assume identical diffs guarantee identical JSX health. A single file can still end up with mismatched closing tags even when the surrounding pages are fine.

**Rule:** after injecting the shared component into each page file, run `pnpm run build` immediately. If your CI patch reports a single malformed file, do not re-run the same diff across all pages blindly; inspect that file's closing tags. The likely failure mode is a leftover wrapper `<div>` or duplicated closing tags after the shared component insertion.

**Safer pattern:** use one surgical `patch` per page file that replaces the entire old CTA block with exactly `<ContactSection />`, rather than editing imports and closing tags in separate steps. The smaller the patch surface, the easier it is to verify visually before committing.

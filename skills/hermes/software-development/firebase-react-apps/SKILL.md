---
name: firebase-react-apps
description: Patterns for React + Firebase apps — Google Auth with Custom Claims RBAC, Firestore Spark tier constraints, Vite integration pitfalls
trigger: Working on React + Firebase projects — auth integration, Firestore data layer, Cloud Functions, Firebase Hosting, role-based access control
version: 1
tags: [firebase, react, vite, auth, firestore, custom-claims]
---

# Firebase + React Application Patterns

## Authentication: Google OAuth + Custom Claims Role-Based Access

### Architecture
```
Anonymous Auth (default) → Google SignIn (upgrade) → Custom Claims (role check)
                                                   ↓
                                        Cloud Function: setClaims
                                        (verifies caller, sets role on target UID)
```

### Role switching flow (multi-tier: admin / TA / student)
1. If user has Google account + claims match → switch immediately
2. If claims don't match but target is admin → fall back to password protection (backward compat)
3. If claims don't match and target is TA → show "no permission" alert
4. If not Google-signed-in → admin uses password fallback; TA prompts to sign in first

### Key code pattern: `refreshRoleFromClaims`
```js
import { getIdTokenResult } from 'firebase/auth';
const result = await getIdTokenResult(user, /* forceRefresh */ true);
const role = result?.claims?.role; // 'admin' | 'TA' | 'student'
```

### Cloud Function for setting claims
- Validates Bearer token from Authorization header
- Checks caller authorization via env var secrets (ADMIN_PASS / TA_PASS)
- Only admin can set claims on other users or grant admin role
- `admin.auth().setCustomUserClaims(uid, { role })`

### Profile setup after first Google sign-in
After `signInWithGoogle()` succeeds, check if a user profile doc exists in Firestore. If not, show a modal prefilled from Google account data (displayName, email) plus app-specific fields (org, role). Flow:
1. `signInWithGoogle()` → success
2. `getUserProfile(auth.currentUser.uid)` → null means first login
3. Prefill form state from `currentUser.displayName` / `currentUser.email`
4. Show modal → user confirms/edits → `setupProfileIfMissing(user)` + `upsertUserProfile(uid, { ...fields })`
5. Close modal

Translation keys pattern: `t.auth.profileTitle`, `t.auth.displayName`, `t.auth.email`, `t.auth.org`, `t.auth.saveAndContinue` — always use optional chaining with Chinese fallbacks: `t.auth?.profileTitle || '個人資料'`.

### Sign-out cleanup
Always reset ALL auth-dependent state on sign-out:
```js
setRole('student');
setAdminOk(false);
setView('home');
```

## Firestore: Spark (Free) Tier Constraints

- Spark plan removed Cloud Storage access since 2024-09 (returns 402/403)
- **Workaround**: Read files as base64 data URLs on client, embed in Firestore docs
- Firestore doc limit: 1MB → practical attachment limit ~700KB total per doc
- localStorage fallback when config is missing: `!!(apiKey && projectId && appId && !apiKey.includes('xxxx'))`

## Pitfalls

### 0. Repository layer: missing Firestore/app imports silently pass build
When a project has both `src/db.js` (monolith data layer) and `src/repositories/*.js` (modular), the repositories are the canonical source — they import `{ db, useFirebase, APP_ID }` from db.js. **Common bug**: a repository file uses a Firestore helper but only imported a partial list. Vite build succeeds because the usage is behind runtime guards. ReferenceError only surfaces when Firebase is configured.

Also applies to secondary helpers: `emitTelemetry` can be missed from the `../db` import. **Quick audit**: `grep -n "emitTelemetry\\|getDoc\\|getDocs\\|initializeFirestore\\|persistentLocalCache" src/repositories/*.js` then cross-check imports.

### 1. Missing Firestore imports survive Vite build
`initializeFirestore` and `persistentLocalCache` must be explicitly imported from `firebase/firestore`. If used but not imported, Vite build succeeds because the code path is behind a runtime config check (`if (isConfigComplete())`). **Error only surfaces at runtime when Firebase is configured.** Always grep for usage vs imports after touching db.js.

### 2. Undeclared module-level variables
`export const getCurrentRole = () => role || 'student'` — if `role` is not declared at module scope, silently returns `'student'` always. Use an explicit module-level `let` with a setter.

### 3. i18n key migration
When restructuring flat keys to nested (e.g., `t.adminLoginTitle` → `t.admin.loginTitle`), use optional chaining with fallbacks: `t.admin?.loginTitle || '管理員登入'` to avoid crashes during migration.

### 4. Navbar profile dropdown (click-outside)
Click-outside-to-close needs `useRef` on container + `mousedown` listener (not `click`) + cleanup on effect teardown.

### 5. `require()` in ESM projects (type: module)
Vite projects with `"type": "module"` in package.json cannot use `require()`. CJS `require()` calls inside adapter files (e.g., lazy-loading `@supabase/supabase-js`) will fail at runtime even though Vite's bundler may not catch it at build time. Fix: convert to `async` function + `await import('...')`. **Remember to update all callers to `await` the now-async function.** Pattern:
```js
let cachedClient = null;
const getClient = async () => {
  if (cachedClient) return cachedClient;
  const { createClient } = await import('@supabase/supabase-js');
  cachedClient = createClient(url, key);
  return cachedClient;
};
```
All consumers of the lazy client must become async. If the dep is optional, wrap in try/catch and return a disabled sentinel on failure.

### 6. search_files (ripgrep) may fail on non-standard mount paths
On Windows, `search_files` (ripgrep-backed) can fail with OS error 3 on paths like `C:/Project/...` that are junctions, symlinks, or non-standard mount points. `terminal` with `grep -n` works fine on the same path. **Workaround**: if `search_files` fails on a file, fall back to `grep -n "pattern" "C:/Project/..."` in terminal immediately instead of retrying the same tool.

### 7. Tracked Firebase files must NOT be in .gitignore
`.firebaserc` is the Firebase project-target mapping file. It should be **committed** so all contributors and CI/CD share the same targets. If it is listed in `.gitignore`, it becomes untracked locally even when it is tracked in the repo. **Rule**: never add `.firebaserc` to `.gitignore`. If it was added by mistake, remove the line from `.gitignore`, then `git add .firebaserc && git commit -m "chore: track .firebaserc"`.

### 8. Parallel subagent edits on the same file
When delegating multiple features that touch App.jsx simultaneously, edits can conflict. Prefer: assign each subagent to different files (new component files) or serialize edits to shared files. For this project's single-file architecture, batch related changes into one subagent and give distinct files to others.

### 9. Platform document root write rule
A common default is `allow write: if authenticated() && request.resource.size() <= 1MB` on `/platforms/{platformId}`. This lets **any** signed-in user overwrite the platform namespace doc. **Fix**: restrict to `isAdmin()` — regular users should only write to subcollections (submissions, profiles, pairings), never the root namespace document.

### 10. Subscription security rules are NOT filters
Firestore security rules don't filter query results; they block or allow the entire query. If rules restrict reads on `/submissions/{docId}` to `isAdmin() || resource.data.userId == request.auth.uid`, then subscribing to the entire `submissions` collection will fail for non-admins. **Always scope non-admin reads with `.where('userId', '==', uid)` before calling `onSnapshot`.** Admin-only subscriptions can skip the filter.

### 11. CI failures with monorepo/workspace configs
When CI uses pnpm and the repo has a `pnpm-workspace.yaml`, it must include a `packages:` array. Without it, pnpm errors with `packages field missing or empty` and the install step fails before build/test. **Fix**: ensure `pnpm-workspace.yaml` has at minimum `packages: ['.']`.

When package-lock.json and pnpm-lock.yaml are both present but out of sync after npm install, CI can show mysterious install failures. **Fix**: regenerate with `pnpm install --lockfile-only` after switching package managers, commit the lockfile, and push.

### 12. Vercel first-deploy and secret-detach recovery
First deploy: `vercel --yes` creates the linked Vercel project and attaches the GitHub repo automatically. If it fails with **"Environment Variable ... references Secret ... which does not exist"**, **stop adding secrets to `vercel.json`**; remove the `env` block and set them via `vercel env add` or dashboard. Re-run deploy after pruning stale secret references.

### 13. GitHub Actions debug logging
If CI logs are insufficient, enable runner/step debug logging via repository secrets: set `ACTIONS_RUNNER_DEBUG=true` and/or `ACTIONS_STEP_DEBUG=true` in repo Settings → Secrets and variables → Actions. Then re-run the workflow with "Re-run jobs with debug logging" for verbose output.

### 13. Branch protection: approving review bypass
For personal repos where the owner is the sole contributor, requiring an external approving review blocks every merge. **Fix**: Settings → Branches → Edit protection rule → uncheck "Require approving code reviews". Alternatively, owners with admin access can use "Merge without waiting for requirements to be met (bypass rules)" on individual PRs.

### 14. Service Account Key Handling
Service account keys used for Firebase Admin SDK can become corrupted/truncated when pasted through chat or text interfaces.

**Symptoms:**
- `ValueError: Unable to load PEM file. InvalidData(InvalidByte(N, M))`
- `jwt.exceptions.InvalidKeyError: Could not parse the provided public key`

**Fixes:**
1. Download a fresh key from Firebase Console → Project Settings → Service accounts → "Generate new private key"
2. Store in environment variable: `FIREBASE_SERVICE_ACCOUNT_JSON='{"type":"service_account",...}'`
3. Never paste keys through chat interfaces

**See `references/service-account-key-handling.md` for detailed patterns and debug techniques.**

### 15. Cloud Functions deploy prerequisites
Common deploy blockers and fixes verified on `esggo-learning-center`:
- `functions/index.js does not exist`: ensure an entry point exists at `functions/index.js` requiring the compiled output, e.g. `exports.setClaims = require('./lib/setClaims.js');`
- `runtime field is required`: add `"engines": { "node": "20" }` to `functions/package.json`, and `"functions": { "source": "functions" }` to the root `firebase.json` so the CLI sees the source.
- `admin.initializeApp is not a function` in ESM: happens when compiled JS uses ESM but runtime resolves CJS. Fix by compiling TS with `"module": "CommonJS"` and `"moduleResolution": "node16"`.
- `TypeScript implicit any errors` on deploy: add explicit parameter types to function signatures not inferred by TS, or relax with `noImplicitAny: false` only if acceptable.
- **Windows Hermes lint false-positive**: standalone syntax checks may misreport ESM/CJS files with `C:\\c\\...` paths. If the file exists on disk, TS compiles with `tsc --noEmit`, and `vite build` succeeds, trust runtime deploy over the local checker.
- Node 20 deprecation notice: deploy succeeds until 2026-10-30; plan upgrade to nodejs22 / `firebase-functions` >=5.1.0.
- **Deploy timeout on slow networks** (especially Windows): `firebase deploy --only firestore:rules` upload may exceed default timeout and exit 124. **Fix**: rerun with extended timeout, e.g. `terminal(command="firebase deploy --only ...", timeout=300)`.
- Same timeout pattern applies to `firebase hosting:channel:deploy preview`; if it times out at 120s, rerun with `timeout=300` and `notify_on_complete=true` for long-running bounded tasks.
- **Console shows default blank template after deploy**: this is almost always stale cached editor content, not an actual rollback. Instruct the user to refresh/reload the rules editor. Verify with `firebase deploy --only firestore:rules` success output, not by reading the editor text.
- **Warning `Invalid variable name: request.`**: `request` is valid in Firestore Rules context; treat as linter noise if the file compiles successfully.
- **Multi-project auth confusion**: `firebase projects:list` shows every project the account can access; the **current** token’s target is what `.firebaserc` says after `firebase use`. If console output looks unsolicited, inspect and rewrite `.firebaserc` explicitly before redeploying.
- **Deploying to the correct Firebase project**: `.firebaserc` is the single source of truth. Keep it committed. If the user says the web app is authenticated against a different project ID than `.firebaserc` points to, rewrite `.firebaserc` and redeploy to the intended project.
- After `git filter-repo`, the `origin` remote is removed as a safety behavior. Re-add it with `git remote add origin <url>` before pushing.

Verified minimal TS build for Firebase Functions:
```json
// functions/tsconfig.json
{ "compilerOptions": { "target": "ES2021", "module": "CommonJS", "moduleResolution": "node16", "strict": true, "esModuleInterop": true, "skipLibCheck": true, "resolveJsonModule": true, "outDir": "lib", "rootDir": "src", "declaration": false }, "include": ["src"] }
```
```js
// functions/index.js
exports.setClaims = require('./lib/setClaims.js');
```

After compiling (`tsc`), `firebase deploy --only functions` should package and upload from `functions/` without failing with `admin.initializeApp is not a function`.

### 15. Vercel deployment with Vite + pnpm
- **Secrets**: don't put secrets in `vercel.json`; set them via `vercel env add` or dashboard.
- **First deploy**: `vercel --yes` will create the project and link the GitHub repo automatically.
- **Production URL**: after deploy, Vercel assigns `*.vercel.app` and may provide an aliased domain.
- Lockfile format mismatch: Vercel may auto-detect pnpm@10.x for lockfileVersion 9 while local uses pnpm@9. Opt into local pnpm via Corepack: `corepack enable && corepack prepare pnpm@9.15.4 --activate`.
- `vercel.json` rewrites are required for SPA routing: `"rewrites": [{ "source": "/(.*)", "destination": "/index.html" }]`.
- If Vercel deploy fails with **secret does not exist**, inspect `vercel.json` for stale `env` references to non-existent secrets and remove them.

## Repository-Backed CRUD Panels (Role-Gated Views)

### Pattern: TA view (scoped read + actions) vs Admin view (full CRUD)
When a Firestore collection (e.g. pairings) needs different views per role:

**TA/mentor role** — one-shot load on view activation:
```js
useEffect(() => {
  if (view !== 'ta' || role !== 'TA' || !user?.uid) return;
  let cancelled = false;
  setLoading(true);
  listForMentor(user.uid).then(data => {
    if (!cancelled) { setItems(data); setLoading(false); }
  }).catch(() => { if (!cancelled) setLoading(false); });
  return () => { cancelled = true; };
}, [view, role, user?.uid]);
```

**Admin role** — real-time subscription (sees all records, auto-updates on changes):
```js
useEffect(() => {
  if (role !== 'admin') return;
  const unsub = subscribeAll(setAllItems);
  return () => { if (typeof unsub === 'function') unsub(); };
}, [role]);
```

### Status badge pattern
Map status enum to color classes for consistent badges:
```js
const statusColor = status === 'assigned' ? 'bg-green-100 text-green-700 border-green-200'
  : status === 'pending' ? 'bg-yellow-100 text-yellow-700 border-yellow-200'
  : 'bg-red-100 text-red-700 border-red-200';
// <span className={`text-xs font-bold px-2.5 py-0.5 rounded-full border ${statusColor}`}>
```

### Submission cross-reference for assigned records
Filter submissions by paired user ID to show summaries inline:
```js
const studentSubs = submissions.filter(s => s.userId === pairing.menteeUid);
```
Show capped list (e.g. `.slice(0, 5)`) with "+N more" overflow indicator.

### Admin CRUD form pattern
Inline form in a `bg-slate-50 rounded-lg border border-slate-200 p-4` container above the table. Inputs use `focus:ring-2 focus:ring-[#FDB515]/50 focus:border-[#FDB515]` for gold accent focus rings. Action button uses navy `bg-[#003262]` with appropriate lucide icon.

## Hermes Telegram Bot Gateway Setup

When the user asks to hook Hermes Agent up to a Telegram bot, the bot token goes into Hermes's own config/env, not the app repository `.env`.

### Known-good flow
1. Ensure Hermes is installed: `hermes --help` should show `gateway` subcommands.
2. Determine Hermes config paths:
   ```
   hermes config path   # usually ~/.hermes/config.yaml or equivalent
   hermes config env-path  # usually ~/.hermes/.env
   ```
3. Store the Telegram bot token in Hermes config. If `hermes config set telegram.bot_token ...` exists, use it; otherwise append/adjust the Telegram section in `config.yaml`. Never commit or echo the token after setting it.
4. Restart the gateway so the new token is loaded:
   - `hermes gateway restart`
   - Or, if not installed: `hermes gateway install` then `hermes gateway start`
5. Send the bot a Telegram message and confirm Hermes replies/admin responds.
6. Tell the user to open Telegram, find the bot, and press Start, then verify.

### Pitfall: Windows/terminal path expansion
On Windows/mintty, `read_file`/`grep` on paths that rely on shell env expansion may silently return nothing. If `hermes config path` returns a path, verify it exists before trusting that branch: `dir <reported-path>`. If the file exists, prefer `terminal` reads over raw `read_file` for that path.

### Transfer to production
Generate a unique bot per deployment target (dev/staging/prod). Different bots prevent unintended cross-talk between environments. Share the token only once; keep it in Hermes's secret/config storage from then on.

## PR Merge Conflict Resolution (Feature Branch → Main)

When main advances (e.g. another PR merges) while a feature branch is open, GitHub shows "This branch has conflicts." Resolve locally:

### Systematic workflow
```bash
git fetch origin
git merge origin/main --no-commit --no-ff    # inspect before finalizing

# 1. Assess: list conflicts + count markers per file
git diff --name-only --diff-filter=U
grep -c "<<<<<<< HEAD" $(git diff --name-only --diff-filter=U)

# 2. Resolve small files first, then large ones
#    When feature branch is a strict superset (added features, bug fixes):
git checkout --ours path/to/file && git add path/to/file

# 3. Verify zero leftover markers
grep -r "<<<<<<< " src/ docs/

# 4. Build + test BEFORE committing
npm run build && npm test
git commit -m "merge: resolve conflicts with main, keep feature improvements"
git push
```

### Decision: --ours vs --theirs
- Feature branch has bug fixes main lacks → `--ours`
- Feature branch added new code, main unchanged → `--ours`
- Main has a newer rewrite of same area → manual merge
- Lockfiles / generated files → `--theirs` then re-install

### 16. `.gitignore` + git-tracked conflicts and function artifacts
- Never add `.firebaserc` to `.gitignore`. If it gets added, remove it from `.gitignore`, `git add .firebaserc`, commit, and push.
- **Functions build artifacts** (`functions/lib`, `functions/node_modules`, `functions/package-lock.json`) should be ignored locally but **keep a real `functions/index.js`** at repo root for Firebase CLI packaging. The `lib/` build output can live on disk while excuded from git.
- Favorite rollback anchor before destructive git rewrites: `git tag deploy/<timestamp>` before `git filter-repo`.

### 17. Installing tutorial/test dependencies without polluting root `functions/`
When bringing in external tutorial packages (`@firebase/rules-unit-testing`, `mocha`, etc.), do **NOT** run `npm install` directly in the root `functions/` directory — it will silently rewrite `functions/package.json` and `package-lock.json`, breaking the deployable Functions source that the project already owns.
**Preferred isolation**: either `npm --prefix=rules-tutorial/functions install` or clone the tutorial into its own directory with its own `functions/`. After any accidental install in `functions/`, revert with `git checkout -- functions/package.json functions/package-lock.json` before committing.

### 18. Windows path false-positive in local lint / syntax checks
On Windows, standalone lint/type-check wrappers can report `Cannot find module 'C:\c\Project\...` even when the file exists on disk. **Trust the project toolchain, not the isolated checker**: if `tsc --noEmit` and `vite build` pass, and the deployed build uploads successfully, ignore the wrapper's path-mangled error.

### 19. Security Rules tutorial walkthrough with `@firebase/rules-unit-testing`
This project adopted Firebase's **cs-walkthrough** tutorial as `rules-tutorial/`:
- Source: `firebase/quickstart-testing` → `cs-walkthrough/`
- Structure: `rules-tutorial/{firestore.rules, rules-examples/firestore.rules_template_0..5, functions/, TUTORIAL.md}`
- workflow: edit `rules-examples/firestore.rules_template_N` → `cp` to `rules-tutorial/firestore.rules` → redeploy.

**Completed**: templates 0–5 walked through and deployed to `esggo-learning-center`. Final rules: carts/{cartID} CRUD owner-only, carts/{cartID}/items/{itemID} read/write owner-only via `get(parent).ownerUID`, items/{itemID} read-anyone/create-anyone.

**Windows limitation**: `firebase emulators:exec` requires Java; if unavailable, validate rules by deploying them: `firebase deploy --only firestore:rules`. Success output confirms compilation even if the local mocha suite cannot run.

### 19b. REPLAY_SYNC Apps Script deploy handoff
- The repo should always keep helper methods (`doGet`, `onDriveChange`, `install`, `testBuild`) and the correct `CONFIG.FOLDER_ID` so the user can paste them into Apps Script unchanged.
- **Never hardcode** the Apps Script `exec` URL into `src/App.jsx`. Read it from `import.meta.env.VITE_REPLAY_WEB_APP_URL` so GitHub Secret updates take effect without code changes. The robust pattern:
  ```js
  const REPLAY_SYNC = {
    ENABLED: true,
    WEB_APP_URL: (import.meta.env.VITE_REPLAY_WEB_APP_URL || '').trim(),
    CACHE_TTL_MS: 5 * 60 * 1000,
  };
  ```
- When the user chooses to use `clasp` instead of manual paste:
  ```bash
  npm install -g @google/clasp
  clasp login
  mkdir -p /tmp/replay-clasp && cd /tmp/replay-clasp
  clasp clone <SCRIPT_ID>
  # overwrite the local main .gs with scripts/replaySync.gs
  clasp push
  clasp deploy
  ```
  **Windows note**: `clasp` may install under `C:\Users\<user>\.vite-plus\bin\clasp.cmd`; add that directory to PATH or invoke via full path. `clasp list` shows display names only; `clasp clone` needs the actual script ID, not the display name.
- **`clasp deploy` does NOT change Web app access level to "Anyone."** After `clasp deploy`, the web app is typically still owner-only. detection: `curl .../exec` returns HTML with "需要存取權" instead of JSON. Resolution: the owner must open **Deploy → Manage deployments → Edit Web app → Who has access → Anyone** manually once. After that, redeployments via clasp preserve the setting.
- **Cloud project stub detection**: if the web app returns "找不到以下指令碼函式：doGet", the deployed version was created from an empty stub. `clasp clone` + `clasp push` + manual "Anyone" deployment fixes it.
- Frontend wiring happens only after the URL is returned: update GitHub secret `VITE_REPLAY_WEB_APP_URL` + redeploy hosting.
- When the user provides a new Drive folder ID, update **all** references together: `docs/REPLAY_AUTOMATION.md`, `scripts/replaySync.gs CONFIG.FOLDER_ID`, and `src/App.jsx` home link `href`. Use one commit for the folder-ID migration so it can be reverted atomically if needed.
- Keep `VITE_BOOKING_URL` empty if the user explicitly opts out of Calendly; do not prompt to fill it again after they say no.
- **Windows clasp install path**: `choco install gcloudsdk` often hangs at interactive PS; use `npm install -g @google/clasp` instead. After install, `clasp` may land in `C:\Users\<user>\.vite-plus\bin\clasp.cmd`; add that to PATH or call it directly.
- `clasp list` shows display names only; `clasp clone` needs the actual script ID, not the display name.
- `clasp deploy` does NOT change Web app access level to "Anyone." After `clasp deploy`, the web app is typically still owner-only. **Detection**: `curl .../exec` returns HTML with "需要存取權" instead of JSON. **Fix**: owner must open **Deploy → Manage deployments → Edit Web app → Who has access → Anyone** manually once; subsequent clasp redeploys preserve this.
- If `clasp push` returns `Request contains an invalid argument.`, inspect `.clasp.json` formatting and `appsscript.json` minimality; if it persists, prepare the source as `Code.gs` + minimal manifest JSON and retry. If it still fails, the user can paste the source into Apps Script editor directly.
- When the user provides a new Drive folder ID, update all three references in one commit: `scripts/replaySync.gs` `CONFIG.FOLDER_ID`, `docs/REPLAY_AUTOMATION.md` mentions, and `src/App.jsx` home-link `href`. The Apps Script Web App URL and GitHub secret `VITE_REPLAY_WEB_APP_URL` only change if the script is redeployed under a new URL.
- When the user provides a new Apps Script Web App URL, patch `src/App.jsx` to read `import.meta.env.VITE_REPLAY_WEB_APP_URL` instead of hardcoding the URL, so GitHub Secret updates flow through without future code changes.
- When Apps Script REST API is attempted instead of clasp, JSON escaping the `source` field via shell `sed` with double quotes is fragile on Windows due to backslash handling. If direct API body construction fails in shell, fall back to `clasp` or have the user paste content manually.
- When the user says a previous Apps Script version returned "找不到以下指令碼函式：doGet", treat it as "cloud project has stub code, not your source". Fix with `clasp clone <id>` + `clasp push` + One-time manual Web App "Anyone" access deployment.
- When Apps Script REST API is attempted instead of clasp, JSON escaping the `source` field via shell `sed` with double quotes is fragile on Windows due to backslash handling. If the direct API body construction fails in shell, fall back to `clasp` or have the user paste content manually.

**Gemini-in-Console env lookup pitfall**: When the user asks in the Firebase/Gemini console for a Vite env var value like `VITE_GOOGLE_OAUTH_CLIENT_ID`, Gemini often returns an *explainer* plus a value for the *current Firebase project*. If the goal is to write GitHub Secrets, do **not** assume the explainer output equals the desired secret value for this repo.
- Correct path: ask the user to provide literal secret values explicitly, then write them with `gh secret set`.
- Only use a value returned from an external system if the user confirms it is the intended one for the current repo/project.

**Teaching pattern for templates**: each template introduces one concept in order:
- `template_0`: open rules
- `template_1`: `if false` lockdown
- `template_2`: `carts/{cartID}` create with `request.resource.data.ownerUID`
- `template_3`: cart RUD with `resource.data.ownerUID`
- `template_4`: subcollection write via `get(/databases/$(database)/documents/carts/$(cartID)).data.ownerUID`
- `template_5`: subcollection read+write via same `get()` check
After each edit: copy template → `firebase deploy --only firestore:rules` → confirm compile success.

**Mocha test wrapper** (`rules-tutorial/functions/test.js`) uses `@firebase/rules-unit-testing` and must be wrapped with `firebase emulators:exec` so the SDK can discover the Firestore emulator. On Linux CI runners, execute the tests as:
```bash
cd rules-tutorial
firebase emulators:exec --only firestore "cd functions && npx mocha test.js"
```
If emulators cannot run locally or on Windows, add a dedicated Ubuntu CI job with Java 17 for `rules-test`.

**Tutorial artifact isolation**: do **not** `npm install` directly inside the repository's root `functions/` from tutorial dependency names. Always install into the isolated `rules-tutorial/functions/` directory, or revert with `git checkout -- functions/package.json functions/package-lock.json` if contamination occurs.

**Backup discipline**: preserve `rules-tutorial/firestore.rules.backup` when copying templates so the walkthrough can be restarted without re-cloning.

### 21. ESGGO Firebase Admin SDK service account setup
For ESGGO projects (esggo-learning-center, esggo monorepo), the Firebase Admin SDK uses the `FIREBASE_SERVICE_ACCOUNT_JSON` environment variable pattern:

**Service Account Configuration:**
```bash
# Download from Firebase Console → Project Settings → Service accounts → "Generate new private key"
# Store the JSON content in environment variable (not as a file in repo)
FIREBASE_SERVICE_ACCOUNT_JSON='{"type":"service_account","project_id":"esg-sunshine",...}'
```

**Admin SDK initialization pattern** (src/lib/firebase-admin.ts):
```typescript
const serviceAccountJson = process.env.FIREBASE_SERVICE_ACCOUNT_JSON;
if (serviceAccountJson) {
  const serviceAccount = JSON.parse(serviceAccountJson);
  return admin.initializeApp({
    credential: cert(serviceAccount),
    projectId: serviceAccount.project_id,
  });
}
```

**Firestore collection patterns for ESGGO learning data:**
- `learners` collection: user profiles, roles, progress tracking
- `submissions` collection: assignment/assessment submissions
- `surveys` collection: feedback forms with ratings and open-ended responses

**API route pattern** (app/api/surveys/route.ts):
```typescript
const backend = (process.env.SURVEY_BACKEND || '').trim().toLowerCase();
if (backend === 'firebase') {
  const { adminDb } = await import('@/lib/firebase-admin');
  const docRef = await adminDb.collection('surveys')?.add({ ...data });
}
```

**Environment setup:**
1. Set `FIREBASE_SERVICE_ACCOUNT_JSON` in `.env.local`
2. Set `NEXT_PUBLIC_FIREBASE_PROJECT_ID=esg-sunshine`
3. Use `SURVEY_BACKEND=firebase` to enable Firestore storage

**Pitfall**: The `adminDb` export is a thin wrapper. For full Firestore SDK features (transactions, queries with complex filters), import directly:
```typescript
import { getAdminApp } from '@/lib/firebase-admin';
import { getFirestore } from 'firebase-admin/firestore';
const db = getFirestore(getAdminApp());
```

### 22. GitHub Actions workflow for security rules unit tests
If the emulator tests cannot run locally, add a dedicated CI job on an Ubuntu runner:
```yaml
rules-test:
  runs-on: ubuntu-latest
  steps:
    - uses: actions/checkout@v4
      with:
        path: rules-tutorial
    - uses: actions/setup-java@v4
      with:
        distribution: temurin
        java-version: 17
    - uses: actions/setup-node@v4
      with:
        node-version: 20
        cache: npm
        cache-dependency-path: rules-tutorial/functions/package-lock.json
    - run: cd rules-tutorial/functions && npm ci
    - run: cd rules-tutorial && npx firebase-tools emulators:exec --only firestore "cd functions && npx mocha test.js"
      env:
        GOOGLE_APPLICATION_CREDENTIALS: ${{ secrets.FIREBASE_SERVICE_ACCOUNT }}
```
Key: pass `GOOGLE_APPLICATION_CREDENTIALS` from a service-account JSON secret so the rules SDK can authenticate to the project without interactive login.

### 21. Multi-project deploy confusion
`firebase projects:list` shows every project the account can access; the **current** token's target is what `.firebaserc` says after `firebase use`. If the deployed app appears unauthenticated, console rules show unexpected state, or the user reports "I see the wrong project", inspect and rewrite `.firebaserc` explicitly before redeploying.

**Trigger**: user pastes console output that looks like a default blank project/template rather than your actual rules. Treat it as "wrong target" before assuming rollback.
**Fix**: `firebase use <project-id> --alias default`, verify with `cat .firebaserc`, then `firebase deploy --only firestore:rules,hosting`.

### 22. Git history rewrite safety pattern
After `git filter-repo`, the `origin` remote is removed as a safety behavior. Re-add it with `git remote add origin <url>` before pushing. Before any history rewrite, create a rollback anchor: `git tag deploy/<timestamp>`. If the rewrite touches the checked-out branch and `git push --force-with-lease` is rejected with "stale info", fetch and use `git push --force` only after confirming the local history is the intended final form.

### 23. Vitest worker timeout on Windows is not always a code failure
If `pnpm run test` fails with `Vitest caught 1 unhandled error` and `[vitest-pool-runner]: Timeout waiting for worker to respond`, the test runner may be unable to spawn forks in this environment even though `vite build` succeeds and the source builds cleanly. This can be a worker-pool/sandboxing issue, not a test failure. When `npm run build` passes and the reported error is only the vitest worker timeout, treat verification as build-passed until a real test assertion fails.

### 23b. Survey form must not collapse into a generic catch-all block
When a view has its own metadata, ratings, open-ended responses, and attachments, do not render it through a single generic form component shared with booking/question. The symptom is exactly what the user reported: bundle text is present, but the live view only shows generic placeholders. Safe pattern: extract a dedicated `SurveyForm` component that takes `t` and `onSubmit`, renders its own metadata grid, rating selects by section, open-textareas, file input, and completion validation. Only structurally similar forms should share a generic block.
Always run `pnpm run build` once, then `pnpm run test`. On this project, Vitest `environment` startup is slower on the first invocation after build artifact changes; later calls in the same turn may still show inflated environment time. Use the final test summary line `Tests N passed (N)` as the canonical pass signal.

### 24. Google OAuth production failure diagnosis
Production-only Google sign-in failures are almost always a **GCP Console OAuth client configuration** issue, not app code:
1. Firebase Console → Authentication → Sign-in method → **Google enabled**.
2. GCP Console → APIs & Services → Credentials → OAuth 2.0 web client → **Authorized domains** must include the production hosts: `esggo-learning-center.web.app`, `esggo-learning-center.firebaseapp.com`. Add `http://localhost:5173` for local dev too.
3. Ask the user to paste browser DevTools `auth:sign_in_error` event codes if popup behavior is ambiguous, instead of reading the console yourself.

**Why it surprises**: localhost often succeeds even when production domains are missing, so the bug only appears after deploy.

### 24b. Surface `auth/operation-not-allowed` as a setup hint, not a generic error
When Firebase Auth throws `error.code === 'auth/operation-not-allowed'`, the Google provider is disabled in the Firebase project. Convert this into a concrete remediation message:

```js
if (String(error?.code) === 'auth/operation-not-allowed') {
  throw new Error('Google 登入已停用：請至 Firebase Console → Authentication → Sign-in method 開啟 Google provider。');
}
```

This avoids blank-screen auth confusion and tells the user the exact console path to fix.

### 25. Admin password fallback + white-screen defense
Root cause of admin-mode white screens: `confirmAdmin()` sets `view='admin'` while `user` is still `null`, and the admin view then triggers data paths that call `subscribeSubmissions(user.uid, ...)` or write filters on `user?.uid`, throwing during render.
- Wrap `trySwitchRole` in `try/catch` so throws cannot empty the main render area.
- Allow `confirmAdmin()` to enter admin view even with `user === null`.
- Any render/data path that depends on `user?.uid` must tolerate `null` and degrade to empty local state instead of throwing.

Defensive wrapper pattern used in `esggo-learning-center`:
```js
const trySwitchRole = async (next) => {
  if (next === 'student') { setRole('student'); setView('home'); return; }
  try {
    if (next === 'admin' && user && !user.isLocal && !user.isAnonymous && user.uid === ADMIN_UID) {
      setRole('admin'); setView('admin'); return;
    }
    if (user && !user.isLocal && !user.isAnonymous) {
      const claimsRole = await refreshRoleFromClaims(user);
      if ((next === 'admin' && claimsRole === 'admin') || (next === 'TA' && (claimsRole === 'TA' || claimsRole === 'admin'))) {
        setRole(next); setView(next === 'admin' ? 'admin' : 'ta'); return;
      }
      if (next === 'admin') {
        if (adminOk) { setRole('admin'); setView('admin'); return; }
        setAdminPrompt(true); return;
      }
      alert(t.auth?.noPermission || '您的帳號無此權限，請聯繫管理員。'); return;
    }
    if (next === 'admin') {
      if (adminOk) { setRole('admin'); setView('admin'); return; }
      setAdminPrompt(true); return;
    }
    alert(t.auth?.signInRequired || '請先使用 Google 登入');
  } catch (err) {
    console.error('[role-switch]', err);
    if (next === 'admin') {
      if (adminOk) { setRole('admin'); setView('admin'); return; }
      setAdminPrompt(true); return;
    }
    alert(t.auth?.noPermission || '切換角色失敗，請稍後再試。');
  }
};
```

### 26. Lucide-react icon import drift causes ReferenceError blank screens
When JSX uses an icon component like `<Database size={16} />` but the corresponding name is missing from the `lucide-react` import statement, Vite build **succeeds** because JSX transforms do not enforce named/default import completeness at build time. The error only surfaces at runtime as `ReferenceError: Database is not defined`, which React surfaces as a blank screen unless an ErrorBoundary is present.
- **Audit command**: `grep -n "Database\|ShieldCheck\|Users\|Search\|Download\|Trash2" src/App.jsx` and cross-check against the `from 'lucide-react'` import line.
- **Fix pattern**: keep a single grouped import near the top of `App.jsx`, updating it whenever a new lucide icon is added in JSX.
- **Why it matters**: icon names are not declared anywhere else in the file, so `grep` is the cheapest correctness check before build/deploy.

### 27. Root ErrorBoundary prevents silent blank screens
Even with defensive role-switch guards, any component can throw at mount/render time. Wrap `<App />` in a class-based `RootErrorBoundary` in `main.jsx` so that unexpected errors render a visible red panel instead of an empty `#root`.
- **Pattern**:
  ```jsx
  class RootErrorBoundary extends React.Component {
    state = { error: null };
    static getDerivedStateFromError(error) { return { error }; }
    componentDidCatch(error, info) { console.error('[RootErrorBoundary]', error, info.componentStack); }
    render() {
      const { error } = this.state;
      if (error) return <Fallback error={error} />;
      return this.props.children;
    }
  }
  ```
- **Deploy verification**: after deploy, `curl` the hosting URL, grab the served bundle filename from HTML, then `curl <hosting>/assets/<that-bundle>.js | grep -c ErrorBoundary` to confirm the deployed artifact contains the boundary. A successful deploy with zero matches means the hosted bundle is stale.

### 28. Build-then-deploy ordering; verify the deployed artifact, not just deploy exit code
A common sequence error: `firebase deploy --only hosting` succeeds, then a code fix is committed afterward. The hosting version remains buggy until a second build+deploy runs.
- **Rule**: always run `pnpm run build` **after** the fix patch and **before** `firebase deploy`. Do not interleave deploy between fix and build.
- **Verification before claiming success**:
  1. `pnpm run build` → note the new bundle filename/hash.
  2. `firebase deploy --only hosting` → confirm the new filename is uploaded.
  3. `curl -sL <hosting>` → grep for that filename in the HTML, then `curl <hosting>/assets/<that-bundle>.js | grep -c "<fixed-symbol>"` where `<fixed-symbol>` is the symbol you just fixed (`Database`, `ErrorBoundary`, etc.).

### 29. Git packed-refs vs loose refs confusion on Windows/Hermes
`git status` may falsely report the branch as ahead of `origin/main` because `.git/packed-refs` stores a stale packed copy of `refs/heads/main` while `.git/refs/heads/main` has the newer commit.
- **Symptoms**: new local commits exist in `git log`, but push claims everything is already up to date or rejects stale info.
- **Diagnosis**:
  ```bash
  echo "loose: $(cat .git/refs/heads/main)"; grep "refs/heads/main" .git/packed-refs; git reflog | head -5
  ```
- **Fix**: `git pull --rebase origin main` resolves it by repacking from the fetched remote, then retry push.

### 30. User preference: CLI-first, browser-last
If the user says 「全部改以CLI 或API操作」 / 「使用CLI或api進行操作」, treat browser automation as a last resort. Prefer: `terminal`/shell for git/build/deploy/curl verification, `gh` CLI for GitHub Secrets, and `clasp` or Apps Script REST API for Apps Script operations. Use `browser_*` tools only when the user explicitly allows UI debugging or when no API/CLI path exists.

### 31. Reported white screen after deploy: distinguish cache from regression
When a user reports a runtime error string that you already fixed and redeployed, do **not** assume the deploy failed. First distinguish **browser cache** from a **real regression**:

```bash
# 1. Check local bundle hash
ls dist/assets/index-*.js

# 2. Check online bundle hash
curl -sL "https://<hosting-url>" | grep -oE 'assets/index-[A-Za-z0-9]+\.js'

# 3. If hashes differ, user is seeing cached old bundle
#    Tell user to hard refresh or open incoginto mode

# 4. If hashes match but error persists, the fix did not land in the built bundle
#    Rebuild, redeploy, re-check
```

**Why it matters**: Firebase Hosting CDN aggressively caches `index.html` and JS assets. A successful `firebase deploy --only hosting` may serve a stale bundle to users who visited earlier, producing the **same old error** even though the new code is live. This is not a deploy failure; it is a cache state.

**Quick user instruction**: "請按 `Ctrl + Shift + R` 強制重新整理，或開無痕視窗訪問。"

### 31. SSH publickey auth rejected despite correct private key
If SSH verbose ends with `Authentications that can continue: publickey` after offering a private key, the **server has a different authorized key**. Common cause on OCI: the user pasted a personal RSA key pair generated elsewhere, while the instance's `authorized_keys` contains a different key. Ask the user for the **private key that matches the instance's authorized key**; do not keep retrying the same rejected key.

**OCI-specific access pattern**: the instance console often shows the *public* key that OCI injected at launch. If a user-generated keypair was never associated with the instance at creation time, that generated private key will not work. Either have the user use OCI Console's built-in terminal/Cloud Shell, or supply the matching private key from the launch-time keypair.

**Critical distiction**: OCI *User* API Keys from **Identity → API Keys** are **NOT** the same thing as the *instance SSH keypair*. API keys authenticate to the OCI control plane / identity endpoints; they do **not** land in `~/.ssh/authorized_keys` on the VM. Do not offer an OCI User API key pair as a fix for VM SSH publickey rejections.

**Stopping rule on OCI SSH**: after `ubuntu`, `opc`, and `root` attempts all return `Permission denied (publickey)`, assume the provided key does not match the launch-time keypair. Pivot fast: ask the user to open **OCI Console → Instance → Console Connection** and paste the shell URL so we can proceed through the browser-based serial console instead of burning more turns on blind retries.

### 32. REPLAY_SYNC Drive folder migration
When the shared Drive folder changes, update all three references in one commit: `scripts/replaySync.gs` `CONFIG.FOLDER_ID`, `docs/REPLAY_AUTOMATION.md` mentions, and `src/App.jsx` home-link `href`. The Apps Script Web App URL and GitHub secret `VITE_REPLAY_WEB_APP_URL` only change if the script is redeployed under a new URL.

When the user provides a new folder ID, do not keep writing templates with the old ID. Update the source of truth first, regenerate templates if needed, then copy/deploy. This avoids template/documentation drift across the 11-step tutorial artifacts.

### 33. Profile setup modal focus trap on Windows
After the first Google sign-in succeeds, the app shows a profile setup modal. On some Windows/browser configurations, using `backdrop-blur-sm` on the overlay causes the modal to **capture input focus on every keystroke**, forcing the user to re-click the input field after typing one character. **Fix**: remove the backdrop blur class, add `autoFocus` to the first input, and use an inert backdrop handler (`onClick={() => {}}`) plus `onClick={(e) => e.stopPropagation()}` on the form so typing remains continuous and the modal cannot be dismissed accidentally.

### 33b. Google Drive shared-video embed in replay: use `/preview` iframe, not `uc?export=download`
When a course-replay player references Drive files from a shared folder link, using `https://drive.google.com/uc?export=download&id=...` as a `<video src>` returns **permission denied / Unable to play media** because the shared-link token is not a direct download token.

**Fix**: render `<iframe src="https://drive.google.com/file/d/${video.id}/preview">` inside a watermarked container. This uses Google's preview player, which authorizes via sharing settings. Keep `onContextMenu` disable and watermark overlay unless the user explicitly removes them.
When a course-replay player references Drive files from a shared folder link, using `https://drive.google.com/uc?export=download&id=...` as a `<video src>` returns **permission denied / Unable to play media** because the shared-link token is not a direct download token.

**Fix**: render `<iframe src="https://drive.google.com/file/d/${video.id}/preview">` inside a watermarked container. This uses Google's preview player, which authorizes via sharing settings. Keep `onContextMenu` disable and watermark overlay unless the user explicitly removes them.

### 33. Extending question/submission forms with app-specific fields
Firestore question documents may need additional identity fields beyond the generic schema. Two safe extension points:

**i18n**: add keys under `question.fieldSubmitter`, `fieldSubmitterPlaceholder`, etc. Update all locale blocks together (`zh-TW`, `zh-CN`, etc.). Use `replace_all=true` only when the `old_string` is truly identical across locales; otherwise patch one locale at a time with enough surrounding context to make the match unique.

**Form + payload**: in `QuestionForm`, add inputs bound to new `formData` keys (`submitterName`, `submitterEmail`, ...). `handleSubmit` already forwards the whole `formData` object to the `addSubmission` layer, so no repo/db changes are needed unless the detail panel/admin view should render these fields.

**DetailPanel/admin view** (optional follow-up): add a `Field` row for `d.submitterName` / `d.submitterEmail` so admins can see who submitted. Keep it optional so existing documents without these fields do not crash the panel.

**Admin list badge**: in `RecordsView`, add a submitter badge when `item.type === 'question' && item.data?.submitterName` so admins can identify question submitters at a glance without expanding the detail panel.

### 34. Auth error surface pattern: never let auth failures render a blank screen
Production auth failures should be diagnosable from the UI, not hidden behind a white screen.

**Minimal state shape**:
```js
const [authError, setAuthError] = useState('');
const clearAuthError = () => setAuthError('');
```

**Render banner above `<main>`**:
```jsx
<main className="p-4 sm:p-6">
  {authError && (
    <div className="max-w-5xl mx-auto mb-6">
      <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-xl p-4">
        <span className="font-bold">登入錯誤：</span>
        <span className="font-mono">{authError}</span>
        <button onClick={clearAuthError} className="ml-3 underline text-xs font-semibold">清除</button>
      </div>
    </div>
  )}
  ...
</main>
```

**Auth event listener**:
```js
useEffect(() => {
  const handler = (e) => {
    const code = e?.detail?.code;
    setAuthError(code || '登入失敗，請稍後再試');
    console.error('[auth-error]', e.detail);
  };
  window.addEventListener('auth:sign_in_error', handler);
  return () => window.removeEventListener('auth:sign_in_error', handler);
}, []);
```

This pairs with defensive role-switch wrapping (see pitfall #25) so that even if an auth flow throws, the UI remains visible and shows the cause.

### 35. Oracle VPS external port timeout does not mean SSH key is wrong
When `curl http://<PUBLIC_IP>:8642/health` times out from outside the VPS, the failure is at the **network layer**, not the SSH auth layer. Do not conflate them.

**Diagnosis order**:
1. VPS UFW: `ufw status` → `ufw allow 8642/tcp` if missing.
2. Service bind: `ss -tlnp | grep 8642` → must show `0.0.0.0:8642` or `[::]:8642`, not `127.0.0.1:8642`.
3. OCI Security List: allow inbound TCP 8642 from the desired source.
4. SSH keypair: only diagnose **after** the above pass and SSH still fails.

**Stopping rule**: if SSH returns `Permission denied (publickey)`, do **not** keep retrying the same rejected key. Ask the user for the keypair that matches the instance's `authorized_keys`, or use OCI Console's built-in terminal. One failed attempt is enough to conclude the keypair mismatch; retrying wastes turns and leaks no new information.

### 37. `.env` missing or still contains placeholders produces silent local-mode fallback
If the app shows **「本機暫存模式（未連接 Firebase）」**, that almost always means Firebase initialization was skipped because `isConfigComplete()` returned `false`.

Common causes:
- `.env` is absent; only `.env.example` exists.
- `.env` was copied from `.env.example` but the placeholder values were never replaced.

**Diagnosis**:
```bash
ls -la .env .env.example
grep -E "^VITE_FB_" .env | sed 's/=.*/=***/'
grep "xxxx\|your-project\|1234567890" .env
```

**Fix**:
1. Copy `.env.example` to `.env`.
2. Replace every placeholder with real Firebase web-app config values from Firebase Console → Project Settings → General → Your apps.
3. Rebuild and redeploy hosting.

**Why it matters**: Vite bundles the committed `.env` values at build time, so this is not a runtime env issue. Once `.env` is real, `useFirebase` becomes `true` and the app connects to Firestore/Auth without more code changes.

### 36. Gemini-in-Console env lookup pitfall
When the user asks in the Firebase/Gemini console for a Vite env var value like `VITE_GOOGLE_OAUTH_CLIENT_ID`, Gemini often returns an *explainer* plus a value for the *current Firebase project*. If the goal is to write GitHub Secrets, do **not** assume the explainer output equals the desired secret value for this repo.
- Correct path: ask the user to provide literal secret values explicitly, then write them with `gh secret set`.
- Only use a value returned from an external system if the user confirms it is the intended one for the current repo/project.
- When the user explicitly opts out of a feature (e.g., "不使用 Calendly"), set the corresponding secret to an empty string and **do not prompt to fill it again** in later turns.

## References
- `references/firebase-claims-auth.md` — Custom Claims integration checklist
- `references/firestore-rules.md` — Minimal-write platform rules, subcollection templates, subscription-filter patterns, reserved-name pitfalls
- `references/vercel-deploy-notes.md` — First-deploy flow, secret-detach recovery, lockfile mismatch, SPA rewrites for Vite/pnpm projects
- `references/deploy-recovery-verbosity.md` — Concise recovery message template after wrong-target deploy or console confusion
- `references/security-rules-walkthrough.md` — `rules-tutorial/` directory design, template workflow, emulator/test SDK setup, CI example
- `references/oracle-vps-deploy-notes.md` — OCI instance access pattern, SSH troubleshooting, proxy layout, systemd template
- `references/blank-screen-debugging.md` — Blank-screen root causes seen in production (`ReferenceError: Database is not defined`, scoped `error` reference failures, stale-bundle cached errors, JSX parse errors from incremental patch drift, Google `auth/operation-not-allowed` masked as generic blank-screen auth failure) plus diagnosis ordering and quick audit commands.

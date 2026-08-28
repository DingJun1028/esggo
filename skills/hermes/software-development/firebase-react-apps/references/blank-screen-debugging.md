# Blank-screen debugging notes (esggo-learning-center)

## Verified root causes seen in production

- `ReferenceError: Database is not defined`
  - Cause: JSX used `lucide-react` icon components without importing them.
  - Vite/esbuild can still emit the bundle.
  - Error only surfaces at runtime as a blank screen unless an ErrorBoundary is present.

- `ReferenceError: error is not defined`
  - Cause: JSX referenced an `error`/`authError` state variable that was not in scope inside the rendered subtree after a bad refactor.
  - Can happen at module evaluation or during render.

- Auth failure rendered as blank screen
  - Firebase sign-in threw `auth/operation-not-allowed` when Google provider was enabled in code but not in Firebase Console.
  - If the error is not caught at the button handler and is not forwarded into a visible `authError` banner above `<main>`, the user sees only a white / unchanged page.
  - **Fix surface**: in `db.js` classify `auth/operation-not-allowed` as a setup error with the explicit remediation hint instead of rethrowing a generic error. In `App.jsx` catch the sign-in promise and store the message into `setAuthMessage(...)` so the `<main>` banner renders it.

- JSX parse/structural errors masquerading as runtime blank screens
  - Cause: mismatched tags caused by incremental `patch` edits on a large `App.jsx` return block.
  - Often missed locally because of stale `dist/` or CDN-cached bundles after deploy.

## Diagnosis ordering

1. Build locally first.
2. Check the **live bundle hash** against local `dist/assets/index-*.js` to exclude caching.
3. Verify `Firestore 雲端永久儲存（已連線）` is shown in the UI. If the app shows **「本機暫存模式（未連接 Firebase）」**, stop debugging UI code; see `firebase-react-apps` pitfall #37 for `.env` diagnosis.
4. Wrap `<App />` in a `RootErrorBoundary` in `main.jsx` so render-time errors render a visible fallback.
5. Add an auth banner above `<main>` and forward sign-in errors into it instead of relying solely on console.
6. Audit icon imports whenever a new JSX icon name is added.

## Auth error banner pattern

```jsx
const [authMessage, setAuthMessage] = useState('');
// ...
const handleGoogleSignIn = async () => {
  try {
    await signInWithGoogle();
    setAuthMessage(t.auth.signInSuccess || '登入成功');
    // post-login profile bootstrap here if first login
  } catch (err) {
    console.error(err);
    const msg = String(err?.message || err);
    setAuthMessage(msg || (t.auth.signInFailed || '登入失敗，請稍後再試。'));
  }
};
// render above <main>
{authMessage && (
  <div className="max-w-5xl mx-auto mb-4">
    <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-xl p-4">{authMessage}</div>
  </div>
)}
```

## Quick checks

```bash
# bundle hash verification
ls dist/assets/index-*.js
curl -sL "https://<hosting>" | grep -oE 'assets/index-[A-Za-z0-9]+\.js'

# suspicious state / undefined identifiers
grep -n "authMessage\|error" src/App.jsx | head -20

grep -n "Database\|ShieldCheck\|Users\|Search\|Download\|Trash2" src/App.jsx
grep -n "from 'lucide-react'" src/App.jsx

# db.js sign-in error classification
grep -n "operation-not-allowed" -n src/db.js

pnpm run lint
pnpm run build
```

## Related skills

- `firebase-react-apps` — pitfall #24/#26/#27/#34 for auth, icon-drift, ErrorBoundary, and sign-in failure surfaces.
- `jsx-safe-refactoring` — safe restructuring of large JSX subtrees.

# Security Rules Tutorial Surface Notes

Context: this repo mirrors Firebase's `cs-walkthrough` under `rules-tutorial/`.

## Directory contents (committed)

- `rules-tutorial/firestore.rules` — the mutable rules under tutorial editing
- `rules-tutorial/rules-examples/firestore.rules_template_0..5` — exercise templates
- `rules-tutorial/functions/` — mocha + `@firebase/rules-unit-testing`
- `rules-tutorial/firebase.json` — points at local `firestore.rules`
- `rules-tutorial/.firebaserc` — stores tutorial alias target

## Verified edit flow

```bash
cd C:\Project\esggo-learning-center\rules-tutorial
cp rules-examples/firestore.rules_template_1 firestore.rules
firebase deploy --only firestore:rules
```

## Concrete rule progression (template_0 -> template_5)

- **template_0**: open-all baseline
  - `allow read, write: if true;` on `/{document=**}`
- **template_1**: lock-down
  - replace with `allow read, write: if false;`
- **template_2**: scoped cart create
  - `match /carts/{cartID}` + `allow create: if request.auth.uid == request.resource.data.ownerUID;`
- **template_3**: cart owner RUD
  - `allow read, update, delete: if request.auth.uid == resource.data.ownerUID;`
  - create uses `request.resource.data`; RUD uses `resource.data`
- **template_4**: subcollection write via cross-doc `get()`
  - `match /carts/{cartID}/items/{itemID}`
  - `allow write: if get(/databases/$(database)/documents/carts/$(cartID)).data.ownerUID == request.auth.uid;`
- **template_5**: subcollection read+write
  - same `get()` pattern, promoted to `allow read, write: if ...`

After each edit: copy template → `firebase deploy --only firestore:rules`. On Windows without Java, omit emulator tests; deploy success is sufficient validation.

## Multi-project deploy confusion

If the user sees an empty/default rules editor for what they believe is their project, the likely cause is **wrong Firebase project target**, not an actual rollback.

Diagnosis:
- `firebase projects:list` shows all accessible projects
- The active target is what `.firebaserc` says after `firebase use`

Fix:
```bash
firebase use <project-id> --alias default
cat .firebaserc  # verify
firebase deploy --only firestore:rules,hosting
```

## Git history rewrite safety

After `git filter-repo`, `origin` remote is removed for safety. Re-add with `git remote add origin <url>` before pushing. Create a rollback anchor before rewrites: `git tag deploy/<timestamp>`. If `git push --force-with-lease` is rejected with "stale info", fetch, verify history, then force-push.

## Root functions pollution risk

Installing tutorial deps into root `functions/` rewrites `package.json`. Revert:
`git checkout -- functions/package.json functions/package-lock.json`
Preferred: install into `rules-tutorial/functions/` only.

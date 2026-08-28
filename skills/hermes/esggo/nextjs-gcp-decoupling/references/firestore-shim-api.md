# Firestore-compatible shim API surface

Exact signatures a local shim must expose to keep existing call sites compiling
without edits (esggo de-GCP, 2026-08-25). Keep names identical to firebase/firestore.

## Client shim (src/lib/firebase.ts — zero fs)
- `db` — placeholder object `{ __local: true }` (first arg of `collection(db, name)`)
- `collection(db, name): CollectionRef`
- `doc(db, collectionName, id): DocRef`
- `query(ref, ...constraints): QueryBuilder`
- `where(field, op, value): constraint`  (op: '==' | '!=' | '>' | '>=' | '<' | '<=' | 'array-contains')
- `orderBy(field, dir='desc'): constraint`
- `limit(n): constraint`
- `getDocs(q): Promise<QuerySnapshot>`  — QuerySnapshot has `.docs[]` AND `.forEach(cb)`
- `getDoc(ref): Promise<{exists, id, data:()=>DocData|null}>`
- `addDoc(ref, data): Promise<{id}>`
- `setDoc(ref, data): Promise<void>`
- `deleteDoc(ref): Promise<void>`
- `onSnapshot(ref, cb): () => void`  — simulate with setInterval(2s) + BroadcastChannel
- `writeBatch(db): { set(ref,data), delete(ref), commit(): Promise<void> }`

## Server admin stub (src/lib/firebase-admin.ts)
- `adminDb.collection(name).doc(id).get()/set(data,{merge?})/delete()`
- `adminDb.collection(name).add(data): {id}`
- `adminDb.collection(name).where().orderBy().limit().get()`
- `adminDb.doc('col/id')` and `adminDb.doc('col/id/sub/subid')`
- `adminDb.runTransaction(fn)` — fn(tx) with tx.get/set/update/delete
- `getAdminApp()` → `{ local: true }`
- `getAuth(_app)` → stub whose `verifyIdToken/getUser/setCustomUserClaims` THROW "disabled"

## Client auth (src/lib/auth.ts)
- `type User = LocalUser` where LocalUser = { uid, email, displayName, photoURL }
- `signInWithGoogle / signInWithEmail / signUpWithEmail / signOut`
- `onAuthChange(cb)` → returns unsubscribe; fires immediately with current user
- `getCurrentUser()`, `isAuthenticated()`
- `auth` object with getter `currentUser`
- `GoogleAuthProvider` class with `setCustomParameters()`

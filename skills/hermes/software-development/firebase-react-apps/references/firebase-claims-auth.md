# Firebase Custom Claims Auth Integration Checklist

## Firebase Console Setup
1. **Authentication → Sign-in method** → Enable Google provider
2. **Authentication → Sign-in method** → Keep Anonymous enabled (for graceful degradation)
3. **Authentication → Settings → Authorized domains** → Add your production domain

## Cloud Function: `setClaims`
- Deploy as `firebase-functions/v2/https` `onRequest`
- Accept POST with `Authorization: Bearer <idToken>`
- Body: `{ uid?, role, displayName?, adminPass?, taPass? }`
- Validate token with `admin.auth().verifyIdToken(idToken)`
- Check `decoded.aud === process.env.FIREBASE_PROJECT_ID`
- Authorization: env vars `ADMIN_PASS`, `TA_PASS`
- Set claims: `admin.auth().setCustomUserClaims(targetUid, { role })`
- Allowed roles: `student`, `TA`, `admin`

## Frontend Flow
1. App starts → `signInAnonymously` (auto, no UI)
2. User clicks "Google 登入" → `signInWithPopup(auth, new GoogleAuthProvider())`
3. On auth state change → `refreshRoleFromClaims(user)`:
   - `getIdTokenResult(user, true)` (force refresh)
   - Read `claims.role`
   - Also check Firestore profile doc for role override
4. Role state drives UI (navbar buttons, view access)

## Firestore Security Rules (role-aware)
```
match /platforms/{appId}/submissions/{docId} {
  allow read: if request.auth != null;
  allow write: if request.auth != null;
  allow delete: if request.auth.token.role == 'admin';
}
match /platforms/{appId}/profiles/{uid} {
  allow read: if request.auth != null;
  allow write: if request.auth.uid == uid || request.auth.token.role == 'admin';
}
```

## Profile Setup After First Google Login
- Check if profile doc exists in `/platforms/{appId}/profiles/{uid}`
- If missing, create with: `{ uid, displayName, email, role: 'student', status: 'active' }`
- Use `setupProfileIfMissing(user)` pattern

## Common Issues
- **Claims not reflecting immediately**: Must call `getIdTokenResult(user, true)` with force refresh
- **Anonymous → Google upgrade**: Firebase handles this automatically via `signInWithPopup`; the anonymous UID may change
- **CORS on setClaims**: Use `firebase-functions/v2` which handles CORS automatically for `onRequest`

# ESGGO Firebase Patterns

## Service Account Environment Variable Pattern

**Problem**: Loading service account JSON without committing private keys to repo.

**Solution**: Use `FIREBASE_SERVICE_ACCOUNT_JSON` environment variable.

```bash
# Get from Firebase Console → Project Settings → Service accounts → Generate new private key
# Then set in .env.local (NEVER commit actual values)
FIREBASE_SERVICE_ACCOUNT_JSON='{"type":"service_account","project_id":"esg-sunshine",...}'
```

## Firestore Collection Structure

### learners
User profiles with:
- `uid`: Firebase Auth UID
- `displayName`: User's name
- `email`: Email address
- `role`: 'admin' | 'TA' | 'student'
- `organization`: Organization name
- `profileComplete`: boolean

### submissions
Learning submissions with:
- `learnerId`: Reference to learners doc
- `assignmentId`: Reference to assignment
- `content`: Submission content
- `submittedAt`: Timestamp
- `grade`: Grade if evaluated

### surveys
Feedback data with:
- `week`: Week number
- `date`: ISO date string
- `topic`: Topic name
- `instructor`: Instructor name
- `studentName`: Optional student name
- `organization`: Optional organization
- `ratings`: Record<string, number>
- `feedbacks`: { valuable?, improvement?, question? }
- `submittedAt`: ISO timestamp

## API Route Pattern

```typescript
// app/api/surveys/route.ts
export async function POST(request: Request) {
  // Switch backend via environment variable
  const backend = (process.env.SURVEY_BACKEND || '').trim().toLowerCase();
  
  if (backend === 'firebase') {
    const { adminDb } = await import('@/lib/firebase-admin');
    if (!adminDb?.collection) {
      return NextResponse.json({ ok: false, message: 'Survey storage is not configured' }, { status: 500 });
    }
    const docRef = await adminDb.collection('surveys')?.add({ ...data, submittedAt: new Date().toISOString() });
    return NextResponse.json({ ok: true, id: docRef.id }, { status: 200 });
  }
  
  // Fallback to memory store
  const row = addMemoryRow(data);
  return NextResponse.json({ ok: true, id: row.id }, { status: 200 });
}
```

## Admin SDK Initialization

See `src/lib/firebase-admin.ts` for the complete implementation. Key patterns:
- Lazy initialization with singleton
- Fallback from service account JSON to Application Default Credentials
- Type-safe Firestore wrapper (`adminDb` object)

## Common Pitfalls

1. **Missing FIREBASE_SERVICE_ACCOUNT_JSON**: App falls back to memory/storage, shows "本機暫存模式（未連接 Firebase）"
2. **Wrong project ID**: Check `.firebaserc` matches Firebase Console project
3. **Security rules blocking reads**: Non-admin users must filter by `userId` in queries
4. **Service account not having Firestore Admin role**: Requires "Firebase Admin" role in IAM
# Firebase Admin SDK Service Account Key Handling

## Common Issues

### 1. Truncated/Corrupted Private Key

When a service account key is pasted into chat or transferred through systems that truncate long text, the private key may become corrupted.

**Symptoms:**
- `ValueError: Unable to load PEM file. InvalidData(InvalidByte(N, M))`
- `jwt.exceptions.InvalidKeyError: Could not parse the provided public key`
- Key appears to have correct BEGIN/END markers but fails to load

**Diagnosis:**
```python
# Check key validity
from cryptography.hazmat.primitives import serialization
from cryptography.hazmat.backends import default_backend

try:
    private_key = serialization.load_pem_private_key(
        pk.encode('utf-8'), password=None, backend=default_backend()
    )
except Exception as e:
    print(f"Key invalid at position: {e}")
```

**Fixes:**
1. Download a fresh key from Firebase Console → Project Settings → Service accounts → "Generate new private key"
2. Never paste keys through chat/text interfaces that may truncate
3. Use `firebase login:ci` for CI/CD tokens instead of service accounts when possible

### 2. Environment Variable Pattern (ESGO Projects)

```bash
# Store in .env.local or CI secrets
FIREBASE_SERVICE_ACCOUNT_JSON='{"type":"service_account","project_id":"esg-sunshine",...}'
```

**Initialization:**
```typescript
import admin from 'firebase-admin';

const serviceAccountJson = process.env.FIREBASE_SERVICE_ACCOUNT_JSON;
if (serviceAccountJson) {
  const serviceAccount = JSON.parse(serviceAccountJson);
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    projectId: serviceAccount.project_id,
  });
}
```

### 3. Getting Access Token (Alternative to Admin SDK)

If you need a raw OAuth2 access token:

```python
from google.oauth2 import service_account
import requests

credentials = service_account.Credentials.from_service_account_file(
    'path/to/service-account.json',
    scopes=['https://www.googleapis.com/auth/firebase', 'https://www.googleapis.com/auth/cloud-platform']
)
credentials.refresh(requests.Request())
access_token = credentials.token
```

### 4. Debug Service Account Permissions

```bash
# List projects accessible to the service account
gcloud auth activate-service-account --key-file=key.json
gcloud projects list
```

## Best Practices

1. **Never commit service account keys to git** - Always use environment variables
2. **Rotate keys regularly** - Generate new keys and update secrets periodically
3. **Use minimal scopes** - Only request scopes needed for the task
4. **Prefer `firebase login:ci` for CI/CD** - Shorter-lived tokens, easier rotation
5. **Store in GitHub Secrets** - Use `gh secret set FIREBASE_SERVICE_ACCOUNT_JSON`
# OpenBao SDK v2 API Differences (vs HashiCorp Vault)

## Summary of Changes

When porting a credential backend from Vault to OpenBao SDK v2, these are the key API differences:

### 1. JSON Decoding
```go
// Vault (deprecated):
logical.DecodeJSON(raw.Value, &result)

// OpenBao SDK v2:
jsonutil.DecodeJSON(raw.Value, &result)
// Import: "github.com/openbao/openbao/sdk/v2/helper/jsonutil"
```

### 2. Storage Entry Creation
```go
// Vault:
entry, err := logical.StorageEntryJSON(ctx, key, value)

// OpenBao SDK v2 (no context parameter):
entry, err := logical.StorageEntryJSON(key, value)
```

### 3. Field Schema Types
```go
// Vault supports TypeKVBlob (for []byte maps):
framework.TypeKVBlob

// OpenBao SDK v2 requires TypeKVPairs:
framework.TypeKVPairs
```

### 4. Credential Validation Errors
```go
// Vault:
return nil, logical.CredentialValidationError{
  ErrInvalidCredential: errors.New("invalid token"),
}

// OpenBao SDK v2 (no CredentialValidationError):
return logical.ErrorResponse("invalid token"), nil
// Returns (*logical.Response, error) instead of (nil, error)
```

### 5. JSON Parsing of HTTP Responses
```go
// Vault:
framework.ParseJSON(resp.Body, &responseData)

// OpenBao SDK v2 (resp.Body is io.ReadCloser, not []byte):
bodyBytes, _ := io.ReadAll(resp.Body)
jsonutil.DecodeJSON(bodyBytes, &responseData)
```

### 6. Logical Request Path
```go
// Vault:
Path: []string{"config"}

// OpenBao SDK v2:
Path: "config"  // string, not []string
```

### 7. List Path Pattern
```go
// Vault: Add ListOperation to existing path's operations map

// OpenBao SDK v2: Create separate path function with pattern:
Pattern: `role/?$`  // trailing slash or end-of-string
```

### 8. newBackend Function
```go
// Vault:
func newBackend() *backend {

// OpenBao SDK v2 (takes config):
func newBackend(conf *logical.BackendConfig) *omniKeyBackend {
```

## Test Storage Implementation

OpenBao SDK v2 requires `ListPage` method on Storage interface:
```go
type Storage interface {
  Get(ctx, path string) (*StorageEntry, error)
  Put(ctx, *StorageEntry) error
  Delete(ctx, path string) error
  List(ctx, prefix string) ([]string, error)
  ListPage(ctx, prefix string, page string, limit int) ([]string, string, error)  // NEW
}
```

Use `logical.InmemStorage` for tests instead of custom implementations:
```go
config := logical.TestBackendConfig()
config.StorageView = &logical.InmemStorage{}
```

### 9. ListResponse Data Key
```go
// logical.ListResponse(keys) puts the list in Data["keys"], NOT Data["roles"]
resp.Data["keys"]  // correct
resp.Data["roles"]  // wrong - will be nil
```

### 10. AuthRenew Operation Type
```go
// Renewal tests must use RenewOperation, not UpdateOperation
// Framework only routes to AuthRenew callback when:
//   req.Operation == logical.RenewOperation AND req.Auth != nil
req := &logical.Request{
    Operation: logical.RenewOperation,
    // ...
}
```
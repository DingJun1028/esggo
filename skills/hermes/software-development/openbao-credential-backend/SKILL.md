---
name: openbao-credential-backend
description: Build OpenBao credential backends with SDK v2 patterns.
tags: [go, openbao, credential-backend, sdk]
---

# OpenBao Credential Backend Development

Use when building credential backends for OpenBao SDK v2.

## Repository Layout
```
internal/builtin/credential/<name>/
  backend.go     Factory + newBackend
  path_login.go  login + AuthRenew
  path_config.go config CRUD
  path_role.go   role CRUD + list path
  cli.go         CLIHandler
internal/helper/builtinplugins/registry.go  register Factory
internal/command/commands.go  register CLIHandler
```

## Key Steps
1. Implement `Factory(ctx, *logical.BackendConfig) (logical.Backend, error)`
2. Register in `registry.go` credentialBackends map
3. Register CLI handler in `commands.go` loginHandlers map
4. Separate list path with `role/?$` pattern

## SDK v2 Pitfalls (vs Vault)
- `logical.DecodeJSON` → `jsonutil.DecodeJSON`
- `StorageEntryJSON(ctx,...)` → `StorageEntryJSON(...)`
- `framework.TypeKVBlob` → `framework.TypeKVPairs`
- `CredentialValidationError` → `logical.ErrorResponse(...)`
- `framework.ParseJSON(io.Reader)` → `io.ReadAll + jsonutil.DecodeJSON`
- `Path: []string{...}` → `Path: "string"`

## Test Pattern
```go
func createBackendWithStorage(t *testing.T) (*myBackend, logical.Storage) {
  config := logical.TestBackendConfig()
  config.StorageView = &logical.InmemStorage{}
  b := newBackend(nil)
  require.NoError(t, b.Setup(context.Background(), config))
  return b, config.StorageView
}
```

## 5T Protocol
1. Traceable: log `source_origin`
2. Trackable: log operation context
3. Tangible: include user metadata
4. Transparent: never log raw tokens
5. Trustworthy: never return secrets in plaintext

## Additional Pitfalls
- **AuthRenew tests**: Use `logical.RenewOperation`, not `UpdateOperation`. Framework only routes to `AuthRenew` when `req.Operation == logical.RenewOperation` AND `req.Auth != nil`.
- **ListResponse keys**: `logical.ListResponse(keys)` puts keys in `resp.Data["keys"]`, NOT `["roles"]`. Tests must check `resp.Data["keys"]`.
- **write_file truncation**: Large files may be truncated with `[truncated]` markers. Verify compilation after writing. Prefer `patch` for incremental changes.
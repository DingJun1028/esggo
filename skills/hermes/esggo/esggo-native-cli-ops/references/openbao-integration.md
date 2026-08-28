# OpenBao × OmniKey Integration Pattern

## Context
This reference documents the integration of ESGGO's OmniKey credential system with OpenBao as a custom auth backend.

## OpenBao Backend Registry
- Path: `internal/helper/builtinplugins/registry.go`
- Credential backends registered in `credentialBackends` map (e.g., `"approle"`, `"jwt"`, `"kubernetes"`)
- Logical backends registered in `logicalBackends` map (e.g., `"kv"`, `"transit"`, `"pki"`)
- Each entry maps name → `{Factory: <package>.Factory, DeprecationStatus: <status>}`
- Factory signature: `func Factory(ctx context.Context, conf *logical.BackendConfig) (logical.Backend, error)`

## Required Go Environment
- Go version: 1.27.0 (pinned in `.go-version`)
- Build: `go build -o bin/bao .`
- Dev mode: `go run . server -dev`

## OmniKey Auth Backend Structure
Following the approle credential backend pattern (`internal/builtin/credential/approle/`):

```
internal/builtin/credential/omnikey/
├── backend.go         # Factory + Backend struct (mirrors approle/backend.go)
├── path_login.go      # POST /auth/omnikey/login (key → token)
├── path_role.go       # CRUD roles at /auth/omnikey/role/<name>
├── cli.go             # bao login integration
├── validation.go      # Input validation
└── path_login_test.go # Test coverage
```

## Registration
In `internal/helper/builtinplugins/registry.go`:
```go
import (
    credOmniKey "github.com/openbao/openbao/v2/internal/builtin/credential/omnikey"
    // ...
)

// In newRegistry():
credentialBackends: map[string]credentialBackend{
    "omnikey": {Factory: credOmniKey.Factory, ...},
    // ...
}
```

## 5T Protocol Mapping
- **Traceable**: Every secret access logs `source_origin` (the OmniKey that invoked it)
- **Trackable**: OpenBao audit devices capture full request/response lifecycle hooks
- **Tangible**: CLI provides clear success/failure feedback with key metadata
- **Transparent**: Role-to-policy mappings are inspectable via API
- **Trustworthy**: `Object.freeze()` equivalent — issued tokens are immutable; sealing via Shamir

## Common Pitfalls
1. Git clone on Windows may produce empty directory (only `.git/`) — use `--depth 1`
2. Go must be installed and on PATH; `go version` must return 1.27.0+
3. OpenBao module path is `github.com/openbao/openbao/v2` — all internal imports use `/v2` suffix
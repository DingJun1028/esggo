# esggo-hub config validation reference

Use `scripts/validate-hub-config.py` to validate `config.yaml` before
deploying hub workspaces, plugins, or integrations.

## What it checks

- `hub.name` / `hub.version`
- workspace paths exist
- plugin names are non-empty
- `integrations.manual.manual48.{md,html,viewer}` paths exist

## Invocation

```bash
python scripts/validate-hub-config.py
```

## Expected output

```
VALIDATION PASSED
WARN: ...
```

## Path notes

- Default config path: `docs/hub/config.example.yaml`
- Override with `ESGGO_HUB_CONFIG=/absolute/path/config.yaml`

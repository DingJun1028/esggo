# Intra-Repo Type Sync (vs Cross-Repo)

## Key Difference

**Cross-repo type sync** (cross-repo-type-sync skill): Two separate repos share types via generated artifacts.

**Intra-repo type sync** (this pattern): Single repo shares types between backend (Python/Pydantic) and frontend (TypeScript/Zod).

## When to Use Which

| Scenario | Pattern |
|----------|---------|
| Monorepo with shared package | Cross-repo |
| Single repo with Python backend + TypeScript frontend | **Intra-repo** |
| Multiple independent frontend apps | Cross-repo |

## Intra-Repo Pattern

```
repo/
├── backend/
│   └── src/types/api.py    # Pydantic (canonical)
├── frontend/
│   └── src/types/           # Generated TypeScript
└── scripts/
    └── generate_zod.py      # Pydantic → Zod generator
```

## Workflow

1. Edit Pydantic model in `src/types/api.py`
2. Run `python scripts/generate_zod.py`
3. Generated files appear in `web/src/types/`
4. Frontend imports from generated files

## Pitfalls

- Don't edit generated files manually
- Handle `anyOf` in JSON schema (Pydantic `Optional[str]` → `z.string().nullable()`)
- Ensure import statements are included in generated files
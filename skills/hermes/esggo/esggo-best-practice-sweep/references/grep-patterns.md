# ESGGO best-practice sweep — measurement commands

Run from repo root `/c/Project/esggo`.

## Error leaks (response bodies returning raw error.message)
git grep -nE '\(error as Error\)\.message|error\.message' -- 'app/**/route.ts' 'esggo-omni-center/app/**/route.ts' 2>/dev/null | grep -vE 'console\.(error|log|warn)'

## Dangerous `as any` casts (highest risk)
git grep -nE '\([^)]*as any\)' -- 'app/api/**/*.ts' 'src/**/*.ts' 2>/dev/null | grep -vE '__tests__|\.d\.ts'

## `: any` params/vars (core layer, excl tests/.d.ts)
git grep -nE ':\s*any\b' -- 'app/api/**/*.ts' 'src/**/*.ts' 2>/dev/null | grep -vE '__tests__|\.d\.ts'

## Route file count
git ls-files | grep -E 'app/.*/route\.(ts|tsx)$' | wc -l

## Verify leak cleared (should be 0 after fix)
git grep -nE '\(error as Error\)\.message|error\.message' -- 'app/**/route.ts' 'esggo-omni-center/app/**/route.ts' 2>/dev/null | grep -vE 'console\.' | wc -l

## Classify remaining any (index sig vs external boundary)
git grep -nE '\[key: string\]: any' -- 'app/api/**/*.ts' 'src/**/*.ts' 2>/dev/null | grep -vE '__tests__|\.d\.ts' | wc -l

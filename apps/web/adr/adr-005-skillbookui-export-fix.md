---
uuid: "1d766f6c-8795-4424-bfe4-befd22d62a02"
version: "1.0.0"
timestamp: "2026-06-04T10:36:23.567Z"
evidence: "adr\adr-005-skillbookui-export-fix.md"
---
# ADR-005: Update SkillBookUI Export Type and Data Connect Imports

## Context
- Attempted to compile project after modifying `@dataconnect/generated` imports in `dataconnect-services.ts`.
- Encountered missing default export error for `SkillBookUI` component imported as `SkillBookUIdefault` vs `SkillBookUI` in `omni-skills/page.tsx`.
- Multiple missing exports (`upsertEternalMemory`) triggered compilation failures.

## Decision
- Modified `lib/dataconnect-services.ts` to import all required functions from `@dataconnect/generated` explicitly.
- Updated `components/omni/SkillBookUI.tsx` to use `export default function SkillBookUI` instead of named export `export function SkillBookUI`.
- Added regression test `tests/SkillBookUI.test.ts` to prevent future regressions.
- Necessary for maintaining import stability and enabling system build.

## Consequences
- ✅ Resolved build block; project compiles successfully.
- ✅ Enabled subsequent Karma Protocol verification steps.
- ⚠️ Future changes to exported functions must maintain backward compatibility with imports across the monorepo.
- 🧪 Regression test provides safety net for default export usage.

## Alternatives Considered
- Keeping named export but re-exporting as default in intermediate index files.
- Using explicit import aliasing (`import { SkillBookUI as SkillBookUIName }`).
- No significant benefits compared to using direct default export.

## Status
- Implemented and verified.
- Test suite passes.
- Documentation updated.
- Architectural compliance with End-to-End Type Safety principle.

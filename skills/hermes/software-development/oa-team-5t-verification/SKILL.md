---
name: oa-team-5t-verification
description: Use for 5T Protocol implementation and verification.
trigger: Use when implementing or auditing 5T artifacts.
---

# 5T Protocol Implementation & Verification (ESG GO)

Ensures all AI-generated artifacts meet the 5T standards before they enter the production line to prevent hallucinations, tampering, and loss of provenance.

## Core Standards
- **Traceable**: Every artifact must have a `source_origin` identifying the originating agent/process.
- **Trackable**: Must include a unique `uuid` and a high-precision `timestamp`.
- **Tangible**: Must include an `evidence` dictionary containing verifiable output or user feedback.
- **Transparent**: Must include a `version` string and the actual `content` of the artifact.
- **Trustworthy**: Must include a `hash_lock` (SHA-256) of the content to prevent tampering.

## Implementation Workflow
1. **Seal**: Use a sealing function (e.g., `VerificationGate.seal`) to wrap raw content into a `PurifiedArtifact` dataclass, automatically generating the UUID, timestamp, and Hash Lock.
2. **Verify**: Pass the artifact through a `VerificationGate` that checks all 5T fields and re-calculates the hash to ensure integrity.
3. **Freeze**: Once verified, the artifact should be treated as immutable (e.g., using `Object.freeze()` in JS or returning a frozen dataclass/namedtuple in Python).

## Pitfalls & Debugging
- **Python Path Issues**: When running tests for core modules in a monorepo, ensure the project root is in `PYTHONPATH` (e.g., `export PYTHONPATH=$PYTHONPATH:/path/to/project`) to avoid `ModuleNotFoundError`.
- **Tamper Detection**: To test the 'Trustworthy' pillar, seal an artifact, manually modify the `content` field in the dictionary, and verify that the `VerificationGate` rejects it due to a Hash Lock mismatch.
- **Evidence Validation**: Ensure the `evidence` field is strictly a dictionary; `None` or other types should trigger a 'Tangible Error'.
- **§18 Cross-package isomorphism**: A sub-package 5T gate (e.g. `apps/aistation/src/incremental/gate.py`) MUST reuse `generate_hash_lock(source, content, timestamp)` with payload `f"{source}|{content}|{timestamp}"` and be asserted equal to the repo-root `src/core/verification.py::generate_hash_lock` in a test that does NOT `pytest.skip` when the root file is present. Verified 2026-08-27: the isomorphism test PASSED (not skipped), confirming the Python↔TS↔cross-package Hash Lock contract holds. Load the root module under a UNIQUE name (`importlib.util.spec_from_file_location("esggo_core_verification_x", path)`) to avoid the `src` package-name collision between `apps/aistation/src` and the repo-root `src`.

## Verification Script
See `scripts/verify_5t.py` for a standalone verification probe.

## OmniTag CLI Toolchain (esggo)
esggo 落地了 `cli/oa-cli` 的 `oa` CLI（`tag`/`audit` 子命令）+ `pnpm oa:audit` script + CI `omnitag-audit` job +
週期 cron，實作 §20.5/§20.6/§6.2 合約率 100% 門檻。反覆踩過的坑（json 模式不 exit 1、parser 誤匹配 TS 程式碼、
suggestOmniTag 前導斜線、oa-swarm 污染 lockfile）與本地三重驗證清單見 `references/omnitag-cli-toolchain.md`。

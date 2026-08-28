# AI Station Pipeline Tests — Background Thread Timeout Pitfall

## Problem
Tests in `tests/test_aistation.py` that run the **actual** ffmpeg/edge-tts pipeline
(e.g. `test_n8n_webhook_returns_compact_result`, `test_integration_render_runs_ffmpeg`,
`test_submit_marks_failed_on_render_error`) launch background rendering threads that
attempt to connect to edge-tts / OpenAI / Runway endpoints.

## Root Cause
These threads are **non-daemon** and cannot be killed on interpreter shutdown.
When the test suite finishes, pytest exits with "passed" status, but the process
hangs waiting for the background threads to finish — they're blocked on network
calls that will never return (no API key set, endpoint unreachable, etc.).

## Symptoms
- pytest shows `.........` (passing dots) then hangs
- Output ends with the last passing test count line, no summary banner
- Command times out (60s/120s/300s depending on timeout setting)
- Exit code may show `0` (from the piped `tail`) but actual process never exits

## Fix

### Option 1: Separate fast tests from pipeline tests
```bash
# Fast unit tests only (no rendering, no network):
.venv\\Scripts\\python.exe -m pytest \
  tests/test_entropy.py \
  tests/test_audit_5t.py \
  tests/test_notify_isolated.py \
  tests/test_brand_verify.py \
  tests/test_n8n_workflows.py \
  tests/test_oci_api.py \
  tests/test_oci_controller.py \
  tests/test_chapter10.py \
  -q --tb=short

# CrewAI swarm tests (pure structural, no rendering):
.venv\\Scripts\\python.exe -m pytest \
  oa-team-crewai/tests/ \
  -q --tb=short
```

### Option 2: Select out pipeline-triggering tests
```bash
.venv\\Scripts\\python.exe -m pytest tests/test_aistation.py \
  -q \
  -k "not webhook_returns_compact and not integration_render and not elevenlabs_real and not runway_real and not submit_marks_failed and not jobs_endpoints and not metrics_endpoint"
```

### Option 3: Use SIGTERM-aware test runner
```bash
timeout 30 .venv\\Scripts\\python.exe -m pytest tests/ -q --tb=short
```

## Context: When This Was Discovered
During the OA-Team 30 CrewAI Swarm build (2026-08-26), the full test suite
including pipeline tests caused terminal timeouts. The solution was to run
tests separately — fast unit tests complete in <2s, pipeline tests hang due
to non-daemon background threads.

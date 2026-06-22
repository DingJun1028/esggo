# Task Decomposition Patterns

Reference guide for the OA Task Orchestrator skill. Covers decomposition strategies, dependency graphs, failure handling, status display, and `delegate_task` usage.

---

## 1. Task Decomposition Patterns

### 1.1 Parallel Decomposition

Use when subtasks are **independent** — no shared state, no ordering requirements.

```
Task: "Generate a project scaffold"
  ├── Subtask A: Create directory structure
  ├── Subtask B: Write configuration files
  ├── Subtask C: Generate README
  └── Subtask D: Set up CI pipeline
```

**When to use:**

- Subtasks read from different sources
- No subtask output is another subtask's input
- Total wall-clock time matters more than complexity

**Trade-offs:**

- (+) Fastest wall-clock completion
- (+) Simplest failure isolation
- (−) Highest resource contention
- (−) Harder to share intermediate results

### 1.2 Serial (Sequential) Decomposition

Use when subtasks have **strict data dependencies** — each step feeds the next.

```
Task: "Deploy microservice"
  ├── Step 1: Run unit tests
  ├── Step 2: Build Docker image
  ├── Step 3: Push to registry
  └── Step 4: Update Kubernetes manifest
```

**When to use:**

- Output of step N is input of step N+1
- Steps mutate shared state (e.g., a database)
- Rollback must happen in reverse order

**Trade-offs:**

- (+) Predictable, easy to reason about
- (+) Natural rollback ordering
- (−) Slowest wall-clock time
- (−) Single point of failure blocks everything

### 1.3 Mixed-Phase Decomposition

Use when a task has **both parallel and serial phases** — the most common real-world pattern.

```
Task: "Release v2.0"
  ├── Phase 1 (Serial): Finalize spec & freeze API
  ├── Phase 2 (Parallel):
  │   ├── Team A: Implement backend endpoints
  │   ├── Team B: Build frontend components
  │   └── Team C: Write integration tests
  ├── Phase 3 (Serial): Integration & QA
  └── Phase 4 (Serial): Deploy & verify
```

**When to use:**

- Some work can happen concurrently but must converge
- Different teams/agents own different subsystems
- A gate (review, approval, merge) is required between phases

**Trade-offs:**

- (+) Balances speed and dependency management
- (+) Mirrors real team workflows
- (−) Requires explicit phase boundaries
- (−) Phase transitions need coordination

### 1.4 Pattern Selection Guide

| Criteria                  | Parallel | Serial | Mixed |
| ------------------------- | -------- | ------ | ----- |
| Subtask independence      | High     | Low    | Mixed |
| Wall-clock priority       | ★★★      | ★      | ★★    |
| Resource efficiency       | ★        | ★★★    | ★★    |
| Failure isolation         | ★★★      | ★      | ★★    |
| Implementation complexity | ★        | ★★     | ★★★   |

---

## 2. Dependency Graph Examples

### 2.1 Simple Linear Chain

```
[A] ──► [B] ──► [C] ──► [D]
```

Each node depends on the previous. Failure at any point blocks all downstream nodes.

### 2.2 Fan-Out / Fan-In

```
          ┌──► [B1] ──┐
          │            │
[A] ──────┼──► [B2] ──┼──► [C]
          │            │
          └──► [B3] ──┘
```

`B1`, `B2`, `B3` run in parallel after `A` completes. `C` waits for all three.

### 3.3 Diamond Dependency

```
       ┌──► [B] ──┐
[A] ───┤           ├──► [D]
       └──► [C] ──┘
```

Classic diamond: `D` requires both `B` and `C`, which both require `A`.

### 2.4 Complex DAG (Directed Acyclic Graph)

```
        ┌──► [B] ───────┐
        │                │
[A] ────┼──► [C] ──► [E] ├──► [G]
        │                │
        └──► [D] ──► [F]┘
```

- `A` is the root.
- `B` is independent after `A`.
- `C → E` and `D → F` are parallel chains.
- `G` converges on `B`, `E`, and `F`.

### 2.5 Graph with Optional / Best-Effort Dependencies

```
[A] ──► [B] ──► [C]
        ║
        ╚══► [D]  (best-effort: proceed even if D fails)
```

Solid arrows: hard dependency (must succeed).
Dashed arrows: soft dependency (proceed on failure with degraded output).

---

## 3. Failure Handling Strategies

### 3.1 Retry

Re-execute the failed subtask with the same inputs.

**Configuration:**
| Parameter | Default | Description |
|------------------|---------|--------------------------------------|
| `max_retries` | 3 | Maximum retry attempts |
| `backoff` | exponential | Delay between retries (1s, 2s, 4s…) |
| `retry_on` | `["timeout", "transient_error"]` | Which errors trigger retry |

**When to use:**

- Network timeouts, rate limits, transient I/O errors
- Idempotent operations only

**When NOT to use:**

- Logic errors (retrying won't help)
- Non-idempotent operations (e.g., sending emails)
- Persistent resource exhaustion

### 3.2 Degrade

Continue with reduced functionality or fallback output.

**Common degradation patterns:**
| Failure | Degraded Behavior |
|----------------------------|---------------------------------------|
| Image generation fails | Use placeholder / skip image |
| API rate limit hit | Serve cached response |
| Optional enrichment fails | Return core result without enrichment |
| Non-critical test fails | Mark as "known issue", proceed |

**When to use:**

- The failed subtask is non-critical to the main deliverable
- A reasonable fallback exists
- User experience is better with partial results than with a hard failure

### 3.3 Escalate

Stop automatic recovery and hand off to a human or higher-privilege agent.

**Escalation triggers:**

- All retries exhausted
- Security-sensitive operation fails
- Ambiguous state that requires human judgment
- Cost of wrong action exceeds threshold

**Escalation payload should include:**

1. Full dependency graph state (which nodes succeeded/failed)
2. Last error message and stack trace
3. What was attempted (retry count, degradation tried)
4. Recommended next actions

### 3.4 Strategy Decision Tree

```
Subtask failed
  │
  ├─ Is it transient? ──YES──► RETRY (up to max_retries)
  │       │                         │
  │       NO                   Still failing?
  │       │                         │
  │       ▼                         ▼
  │   Is it critical? ──NO──► DEGRADE (use fallback)
  │       │
  │       YES
  │       │
  │       ▼
  │   ESCALATE (human intervention)
  │
  └─ Is it a hard dependency? ──YES──► Block downstream, ESCALATE
          │
          NO
          │
          ▼
      Mark as best-effort failure, continue
```

---

## 4. Status Display Template

### 4.1 Table Format

Use this template to display task decomposition status to the user:

```
┌─────────────────────────────────────────────────────────────────────┐
│ Task: <task_name>                                                   │
│ Status: ● RUNNING  ◌ PENDING  ✓ DONE  ✗ FAILED  ◐ DEGRADED        │
├────┬──────────────────┬──────────┬──────────┬───────────┬──────────┤
│ #  │ Subtask          │ Status   │ Duration │ Retries   │ Notes    │
├────┼──────────────────┼──────────┼──────────┼───────────┼──────────┤
│ 1  │ <name>           │ ✓ Done   │ 12.3s    │ 0/3       │          │
│ 2  │ <name>           │ ● Running│ 4.1s     │ 1/3       │ Retrying │
│ 3  │ <name>           │ ✗ Failed │ 2.0s     │ 3/3       │ Timeout  │
│ 4  │ <name>           │ ◐ Degraded│ 1.5s    │ 0/3       │ Fallback │
│ 5  │ <name>           │ ◌ Pending│ —        │ —         │ Waiting  │
├────┴──────────────────┴──────────┴──────────┴───────────┴──────────┤
│ Overall: 1/5 done · 1 running · 1 failed · 1 degraded · 1 pending │
│ ETA: ~30s (based on remaining parallel work)                       │
└─────────────────────────────────────────────────────────────────────┘
```

### 4.2 Compact Inline Format

For inline status updates in conversation:

```
[1/5] ✓ Create dirs (12s) | ● Write configs (4s, retry 1/3) | ✗ Gen README (timeout) | ◐ Setup CI (fallback) | ◌ Commit
```

### 4.3 Status Legend

| Symbol | Meaning                                    |
| ------ | ------------------------------------------ |
| ◌      | Pending — waiting for dependencies         |
| ●      | Running — currently executing              |
| ✓      | Done — completed successfully              |
| ✗      | Failed — exhausted all recovery strategies |
| ◐      | Degraded — completed with fallback/partial |
| ⊘      | Skipped — dependency failed, not required  |

---

## 5. `delegate_task` Usage Examples

### 5.1 Basic Delegation

Delegate a single subtask to a subagent:

```python
result = delegate_task(
    task="Create the directory structure for a Python Flask project under /app",
    toolsets=["filesystem", "terminal"]
)
```

### 5.2 Parallel Delegation with Toolsets

Delegate multiple independent subtasks simultaneously:

```python
# Phase 2: Parallel implementation
results = []

# Backend agent
results.append(delegate_task(
    task="Implement REST API endpoints for /users and /orders in Flask",
    toolsets=["filesystem", "terminal", "read_file", "write_file", "patch"]
))

# Frontend agent
results.append(delegate_task(
    task="Build React components for UserList and OrderTable",
    toolsets=["filesystem", "terminal", "read_file", "write_file"]
))

# Test agent
results.append(delegate_task(
    task="Write pytest integration tests for /users and /orders endpoints",
    toolsets=["filesystem", "terminal", "read_file", "write_file"]
))

# Collect results
for r in results:
    print(f"Status: {r.status}, Output: {r.output}")
```

### 5.3 Serial Delegation with Dependency

Chain delegations where the second depends on the first:

```python
# Step 1: Analyze codebase
analysis = delegate_task(
    task="Analyze the codebase at /app and list all API endpoints with their auth requirements",
    toolsets=["filesystem", "read_file", "search_files"]
)

# Step 2: Use analysis output to generate tests
tests = delegate_task(
    task=f"Generate comprehensive tests for these endpoints: {analysis.output}",
    toolsets=["filesystem", "write_file", "terminal"]
)
```

### 5.4 Delegation with Search and Web Access

```python
result = delegate_task(
    task="Find the latest stable version of the 'requests' library and write a compatibility matrix for Python 3.9-3.12",
    toolsets=["terminal", "web_search", "web_fetch", "write_file"]
)
```

### 5.5 Delegation with Full Toolset (Autonomous Agent)

```python
result = delegate_task(
    task="""Set up a complete CI/CD pipeline for the project at /app:
    1. Create a GitHub Actions workflow file
    2. Add linting (flake8), testing (pytest), and building (docker) stages
    3. Configure branch protection rules documentation
    4. Verify the workflow file is valid YAML""",
    toolsets=[
        "filesystem", "terminal", "read_file", "write_file",
        "patch", "search_files", "web_search"
    ]
)
```

### 5.6 Toolset Reference

| Toolset        | Capabilities                         | Use When                  |
| -------------- | ------------------------------------ | ------------------------- |
| `filesystem`   | Read/write files, create directories | Any file manipulation     |
| `terminal`     | Execute shell commands               | Builds, installs, scripts |
| `read_file`    | Read file contents with pagination   | Inspecting existing code  |
| `write_file`   | Create or overwrite files            | Generating new files      |
| `patch`        | Targeted find-and-replace edits      | Modifying existing files  |
| `search_files` | Grep/find files by content or name   | Discovery, analysis       |
| `web_search`   | Search the web                       | Looking up documentation  |
| `web_fetch`    | Fetch and extract web page content   | Reading online resources  |

### 5.7 Best Practices for `delegate_task`

1. **Be specific about the output format** — tell the subagent exactly what to produce and where to put it.
2. **Grant minimum necessary toolsets** — don't give `terminal` access if only file reading is needed.
3. **Include context in the task string** — subagents don't share conversation history.
4. **Set clear success criteria** — "Create X such that Y passes" is better than "Create X".
5. **Handle failures at the orchestrator level** — check `result.status` and apply retry/degrade/escalate strategies.

---

_Part of the OA Task Orchestrator skill reference documentation._
_Last updated: 2026-06-22_

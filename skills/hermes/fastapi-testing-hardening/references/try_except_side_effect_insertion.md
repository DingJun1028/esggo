# Pitfall: inserting a side-effect into a `try/except` FastAPI route

Reproduced from the DeerFlow 2.5 ↔ OA-TWINS bridge work (2026-08). Cost 4 failed
`py_compile` / patch attempts before diagnosed.

## The failing pattern (DO NOT DO THIS)

```python
@router.post("/memory/facts")
async def create_memory_fact_endpoint(request, http_request):
    manager = await asyncio.to_thread(get_memory_manager)
    try:
        memory_data, fact_id = await asyncio.to_thread(
            manager.create_fact,
            content=request.content,
            user_id=_resolve_memory_user_id(http_request),
        )                          # <-- call closes here; try block ends here
    # WRONG: broadcast inserted after `)` but before `except`
    uid = _resolve_memory_user_id(http_request)
    asyncio.create_task(oab_put(uid, fact_id, {...}))
    except NotImplementedError:
        raise _unsupported_501(manager, "create fact") from None
    return MemoryResponse(**memory_data)
```

`python3 -m py_compile` → `SyntaxError: expected 'except' or 'finally' block (line N)`

Why: the `)` at 8-space indent is the *closing paren of the `to_thread(...)` call*, which is
inside the paren group started at `await asyncio.to_thread(`. Python reads line 321-327 as
one logical statement. The next line at 4-space indent is a new top-level statement, but it
sits between the try body and the `except` → illegal.

## The correct pattern (USE THIS)

```python
@router.post("/memory/facts")
async def create_memory_fact_endpoint(request, http_request):
    manager = await asyncio.to_thread(get_memory_manager)
    try:
        memory_data, fact_id = await asyncio.to_thread(
            manager.create_fact,
            content=request.content,
            user_id=_resolve_memory_user_id(http_request),
        )
    except NotImplementedError:
        raise _unsupported_501(manager, "create fact") from None
    except ValueError as exc:
        raise _map_memory_fact_value_error(exc) from exc
    except OSError as exc:
        raise HTTPException(status_code=500, detail="Failed to create memory fact.") from exc

    # OA-TWINS bridge: broadcast (non-blocking, after all except blocks, before return)
    uid = _resolve_memory_user_id(http_request)
    asyncio.create_task(oab_put(uid, fact_id, {"content": request.content, "source": "deerflow-2.5"}))
    return MemoryResponse(**memory_data)
```

The broadcast is at function top level — outside the try/except. Because `create_task` is
fire-and-forget and never raises into the caller, losing the try's shielding is harmless.

## Variant: single-line try body

```python
    try:
        memory_data = await asyncio.to_thread(manager.clear_memory, user_id=uid)
    except NotImplementedError:
        ...
```

Same rule: do NOT insert between the statement and `except`. Put broadcast after the except
chain. (If you must keep it inside the try, convert to multi-line and add the broadcast as a
second 4-space-indented statement *before* the call's closing `)`.)

## Verification mandate

After ANY edit that touches a `try/except` block in a route, run:
`python3 -m py_compile <path>` — ruff also catches it, but `py_compile` is the fastest
signal. "The anchor string matched" is NOT proof of syntactic validity.

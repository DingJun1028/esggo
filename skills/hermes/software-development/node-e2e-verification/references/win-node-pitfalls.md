# Windows / Node 24 E2E pitfalls (validated)

## 1. `EventSource` is not a Node global
Even on Node 24 there is no browser `EventSource`. A test using `new EventSource(url)` throws
`ReferenceError: EventSource is not defined`. Always read SSE via `fetch()` + `response.body.getReader()`
streaming (see `scripts/sse-helper.mjs`). Parse `text/event-stream` blocks split on `\n\n`,
lines `event:` / `data:`, JSON.parse the data.

## 2. `process.exit()` after `child.kill('SIGKILL')` crashes Node 24 on Windows
Symptom: a verify script prints success, then dies with:
```
Assertion failed: !(handle->flags & UV_HANDLE_CLOSING), file src\win\async.c, line 94
npm error code 3221226505
```
Cause: killing a child with SIGKILL leaves a closing libuv handle; calling `process.exit()`
synchronously prevents clean drain and trips the assertion. Fix: never call `process.exit()`
in a verify/acceptance script. Set `process.exitCode = 1` on failure and let the process
exit naturally after `child.kill('SIGKILL')`.

## 3. Background terminal commands swallow piped stdout
When a long-running server or test is launched via `terminal(background:true)` and its output
is piped (`2>&1 | tee log`), the harness log often shows only `stdin is not a tty` /
`no job control in this shell` and NONE of the script's `console.log`. The script may still
run fine (exit code visible), but you cannot read its verdict.
Workarounds, in order of preference:
- Run **foreground with a timeout**: `timeout 200 node scripts/e2e.mjs` (foreground max 600s).
- Have the script **write its result to a file** (e.g. `e2e-result.json`) and use `read_file`
  to inspect it — do not depend on captured stdout.
- For a server you only need to probe: start it foreground with `timeout 8 node server.mjs`
  first to confirm it boots and prints its listen line, then probe separately.

## 4. Fixture staleness loop
If a TTS/synthesis step writes a 0-byte file on a network blip, a guard like
`if (!fs.existsSync(f)) synth()` will NOT re-run (file exists), but a guard on size
`if (fs.statSync(f).size < 1000)` WILL — and then re-synth may hit the same transient DNS
failure, looping. Fix: delete the corrupt fixture before re-synth, and wrap the synth in a
retry loop (3–5 tries with `sleep 3`) for intermittent DNS (e.g. edge-tts → bing endpoint).

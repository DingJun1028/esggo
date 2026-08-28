# Tool Quirks & Verification Recipes (spec-reassembly-artifact)

## 1. read_file mis-flags CRLF/UTF-16 pastes as "Binary file"
Chat-pasted `.txt` fragments often arrive CRLF or UTF-16. `read_file` then errors:
`Binary file - cannot display as text. Use appropriate tools to handle this file type.`
**Fix:** read via terminal instead of `read_file`:
```bash
sed 's/\r$//' "/c/Users/dingj/AppData/Local/hermes/pastes/paste_1_160847.txt"
# or:
cat -v file | sed 's/\^M//g'
```

## 2. Hermes "Model not found" HTTP 404 diagnosis
Symptom: `HTTP 404: Model 'opencode/ling-3.0-flash-free' not found.`
Root cause: wrong **provider prefix** + wrong model name. The model lives under a
different provider. Diagnosis steps that worked:
```bash
# a. find the canonical name actually in the Nous catalog
grep -i 'ling-3.0-flash:free' "$HOME/AppData/Local/hermes/context_length_cache.yaml"
#   -> inclusionai/ling-3.0-flash:free@https://inference-api.nousresearch.com/v1
# b. confirm current config + fix it
hermes config get model.default
hermes config set model.default inclusionai/ling-3.0-flash:free   # provider resolves to nous
hermes config get model.default
```
Note: `opencode/` prefix only routes to OpenCode Zen/Go catalog (poolside laguna-*, etc.);
`inclusionai/ling-*` belongs to `nous`. The error string in history is the only trace —
the bad value is usually NOT persisted to config.yaml (it was a transient session state).

## 3. Node 24 runs TypeScript natively
No `tsc` install needed to execute:
```bash
node OmniBlueprintHub.ts        # runs directly (ESM auto-detected)
```
`npx typescript` may fail to resolve locally; for type-checking just rely on `node --check`
for JS, and accept that browser `.ts`/`.js` with `window` won't type-check under `tsc`
without `@types/node` + `--module nodenext`. Prefer real execution over type-check here.

## 4. Verification loop (proven this session)
```bash
# JS syntax (browser scripts)
for f in data.js app.js sync.js; do node --check "$f" && echo "OK $f"; done

# Engine real run
node OmniBlueprintHub.ts 2>&1 | tail -5     # expect exit 0 + table output

# HTTP serve + curl (background server)
python3 -m http.server 8765 &
sleep 1
for f in index.html live-sync.html styles.css data.js app.js sync.js; do
  echo "[$(curl -s -o /dev/null -w '%{http_code}' http://localhost:8765/$f)] $f"
done
curl -s http://localhost:8765/index.html | grep -o -E '萬能藍圖中心|便當盒|Single Data Table|IComponentCore' | sort -u
# kill server after
```
All 6 assets returned 200; key markers present → verified.

## 5. Writability check before bulk writes
```bash
touch /c/Project/esggo-learning-center/.write_test && echo WRITABLE && rm -f /c/Project/esggo-learning-center/.write_test
```

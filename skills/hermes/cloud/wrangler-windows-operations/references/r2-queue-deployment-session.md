# R2, Queue, and Deployment Operations Session Notes

## Date: 2026-07-28

### Environment Setup (Git Bash / MSYS)
```bash
export PYTHONUTF8='1'
export NODE_OPTIONS='--max-old-space-size=4096 --icu-data-dir=/c/Users/dingj/AppData/Local/vm/cache/node-icu'
```

### Command Sequence Executed

#### 1. List Worker Deployments
```bash
wrangler deployments list --name esggo-r2-events-consumer
```
**Result:** ✅ Success
- Worker: esggo-r2-events-consumer
- Version: 8dfc1d73-235b-41f6-9c2d-63379c7248ae

#### 2. List Queue Consumers
```bash
wrangler queues consumer list esggo-event-queue
```
**Result:** ✅ Success
- consumer_id: ac6ee60264c1416099b84e6ccb53b6af
- script: esggo-r2-events-consumer
- batch_size: 10, max_retries: 3, max_concurrency: 5

#### 3. Upload File to R2
First created test file:
```bash
echo "Hello from R2!" > tests/hello.txt
```

Then uploaded:
```bash
wrangler r2 object put esggo/tests/hello.txt --file tests/hello.txt --content-type text/plain
```
**Result:** ✅ Success

#### 4. Verify R2 Object
```bash
wrangler r2 object get esggo/tests/hello.txt
```
**Result:** ✅ Success

### Common Pitfalls Encountered

1. **`wrangler deployments list` requires `--name` flag**
   - Error: `Unknown argument: esggo-r2-events-consumer`
   - Fix: Use `wrangler deployments list --name <name>`

2. **R2 object path format**
   - Error: `Unknown argument: tests/hello.txt`
   - Fix: Use `bucket/path/file.txt` format

3. **R2 object list command not available**
   - Error: `Unknown arguments: prefix, list, esggo`
   - Fix: Use `wrangler r2 bucket list` or `wrangler r2 object get` to verify

4. **File must exist before upload**
   - Error: `The file "tests/hello.txt" does not exist`
   - Fix: Create file first with `echo "..." > tests/hello.txt`

### Verification Commands
```bash
# Verify bucket exists
wrangler r2 bucket list

# Verify object
wrangler r2 object get esggo/tests/hello.txt
```
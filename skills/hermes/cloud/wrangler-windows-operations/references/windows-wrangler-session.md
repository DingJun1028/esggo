# Windows Wrangler Session - 2026-07-28

## Commands Executed

### 1. List Worker Deployments
```bash
wrangler deployments list --name esggo-r2-events-consumer
```
**Result**: Worker `esggo-r2-events-consumer` deployed at 2026-07-28T01:37:31.714Z
Version: 8dfc1d73-235b-41f6-9c2d-63379c7248ae

### 2. List Queue Consumers
```bash
wrangler queues consumer list esggo-event-queue
```
**Result**: Consumer `ac6ee60264c1416099b84e6ccb53b6af` connected to `esggo-r2-events-consumer`
- batch_size: 10
- max_retries: 3
- max_concurrency: 5

### 3. Upload File to R2
```bash
# Create test file
echo "Hello from R2!" > tests/hello.txt

# Upload
wrangler r2 object put esggo/tests/hello.txt --file tests/hello.txt --content-type text/plain
```

### 4. Verify R2 Bucket
```bash
wrangler r2 bucket list  # Shows esggo bucket
wrangler r2 object get esggo/tests/hello.txt  # Verifies file exists
```

## Environment Variables Used

```bash
PYTHONUTF8='1'
NODE_OPTIONS='--max-old-space-size=4096 --icu-data-dir=/c/Users/dingj/AppData/Local/vm/cache/node-icu'
```

## Key Learnings

1. **Deployments list requires `--name` flag** - positional argument doesn't work
2. **R2 object list command not available** in this wrangler version - use bucket list or get
3. **POSIX paths required** in bash on Windows: `/c/Users/...` not `C:\Users\...`
4. **Test file must exist** before uploading to R2
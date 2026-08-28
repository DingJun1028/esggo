# GitHub retrieval when `git clone` times out (exit 124)

Observed in the Docker sandbox: `git clone`/`git fetch` of even modest repos
often hits the 120–240s timeout (exit 124) even though the remote is reachable.
Small requests (ls-remote, api.github.com) succeed.

## Confirm reachability (small, fast)
```bash
timeout 30 git ls-remote https://github.com/<owner>/<repo>.git
# expect: <sha>\tHEAD  and  <sha>\trefs/heads/<branch>
```

## List the file tree via API (no pack download)
```bash
curl -s "https://api.github.com/repos/<owner>/<repo>/git/trees/<branch>?recursive=0" \
  | python3 -c "import sys,json; d=json.load(sys.stdin); [print(t['type'][0], t['path']) for t in d.get('tree',[])]"
```

## Read individual files via raw host
```bash
curl -s "https://raw.githubusercontent.com/<owner>/<repo>/<branch>/<path>"
```

## Pull only needed files (avoids full-tree timeout)
```bash
git clone --filter=blob:none --no-checkout https://github.com/<owner>/<repo>.git
cd <repo>
git sparse-checkout set <path1> <path2> ...
git checkout <branch> -- <path1> <path2>
```
Use `git sparse-checkout add <more>` to grow the set later.

## Notes
- `web_extract` on `https://github.com/<owner>/<repo>` returns HTTP 404
  (Crawl4AI can't render GitHub HTML). Use `raw.` or `api.` hosts instead.
- `git ls-remote` returned HEAD even when `git clone` failed — that is the
  signal the repo exists and is public; network bandwidth (not auth) is the
  bottleneck.

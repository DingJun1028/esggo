# FTG Web Generator — Recipes (condensed from live session)

## 1. Generate a new version (CLI)
```bash
cd /c/Project/esggo
node apps/ftg-tools/ftg-gen.js --version 2.9 --theme stitch-dark --lang zh
# → apps/ftg-2.9/{index.html,styles.css,app.js,assets/*.jpg}
# photos copied from apps/ftg-3.0/assets if present
```
Variants:
- `--theme light` (bright ESG green) / `--theme stitch-dark` (midnight editorial)
- `--lang en` flips all copy to English

## 2. Generate via MCP (Hermes/Toolport)
```bash
cd /c/Project/esggo/apps/ftg-tools
printf '%s\n' '{"jsonrpc":"2.0","id":3,"method":"tools/call","params":{"name":"generate_ftg_page","arguments":{"version":"2.8","theme":"light","lang":"en"}}}' \
  | node ftg-mcp/server.js
```

## 3. Deploy to VPS (public at ftg.esggo.co/{version}/)
```bash
# local commit + push first
cd /c/Project/esggo && git add apps/ftg-{VER}/ && git commit -m "..." && git push origin main
# SCP (VPS /var/www is root-owned → need sudo mkdir + chown)
ssh -i ~/.ssh/esggo_original ubuntu@161.118.248.180 \
  'sudo mkdir -p /var/www/ftg-tours/{VER}/assets && sudo chown -R ubuntu:ubuntu /var/www/ftg-tours/{VER}'
scp -i ~/.ssh/esggo_original -o StrictHostKeyChecking=accept-new \
  apps/ftg-{VER}/{index.html,styles.css,app.js} ubuntu@161.118.248.180:/var/www/ftg-tours/{VER}/
scp -i ~/.ssh/esggo_original -o StrictHostKeyChecking=accept-new \
  apps/ftg-{VER}/assets/*.jpg ubuntu@161.118.248.180:/var/www/ftg-tours/{VER}/assets/
```

## 4. Verify live (NOT just HTTP 200 on HTML)
```bash
# a) HTML + title
curl -sS -m10 -o /dev/null -w 'ftg%d\n' https://ftg.esggo.co/{VER}/    # expect 200
curl -sS -m10 https://ftg.esggo.co/{VER}/ | grep '<title>'
# b) every image asset
for f in hero stay eco craft market restore; do
  curl -sS -m10 -o /dev/null -w "$f=%{http_code}\n" https://ftg.esggo.co/{VER}/assets/$f.jpg
done
# c) browser console proof images actually render (flex bug hid them at height 0)
#    browser_console: [...document.querySelectorAll('.card-pic')].map(e=>e.offsetHeight)
#    expect [180,180,180,...] not [0,0,0,...]
```

## 5. CF cache-bust on CSS/JS edit
Bump the query string in index.html: `styles.css?v=20260814c` → `?v=20260814d`.
CF caches `max-age=14400`; without the bump the old file serves for 4h.

## 6. Fix esggo-core crash loop (CI red)
On VPS:
```bash
pm2 delete esggo-core
sudo fuser -k 3000/tcp; sleep 2
cd /var/www/esggo && pm2 start ecosystem.config.cjs --only esggo-core
pm2 save
```
Then `gh run rerun <id> --failed` for the red "Deploy to Oracle VPS" run.
Root cause: duplicate PM2 esggo-core instances → EADDRINUSE on 3000 → 1900+ restarts → pm2 speedList TypeError → Actions exit 1.

## 7. Targeted verify (bypass broken hermes verify)
```bash
cd /c/Project/esggo/apps/ftg-tools
node --check ftg-gen.js && node --check ftg-mcp/server.js
printf '{"jsonrpc":"2.0","id":1,"method":"initialize"}\n{"jsonrpc":"2.0","id":2,"method":"tools/list"}\n' > /tmp/m.txt
node ftg-mcp/server.js < /tmp/m.txt | grep '"name"'
```
`hermes verify` fails at prisma EPERM in this monorepo — unrelated to static FTG files; do not rely on it for FTG work.

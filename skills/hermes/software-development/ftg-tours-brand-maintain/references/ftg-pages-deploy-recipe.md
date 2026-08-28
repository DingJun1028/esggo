# FTG GitHub Pages Deploy Recipe (verified 2026-08-28)

End-to-end sequence that actually brought `https://ftgtours.esggo.co` live with
65 images across 6 subpages. Each step was executed and verified with `curl`.

## Preconditions
- Local repo at `C:\Users\dingj\ftg-tours-website` was NOT a git repo initially.
- Target repo `DingJun1028/ftgtours-esggo-co` existed but was EMPTY.
- `gh` CLI logged in as `DingJun1028` with `repo`/`workflow` scopes.
- Cloudflare Global API Key available (email + `cfk_...` style key), zone `esggo.co` id `8dda3653e490290412f7be84a84e0dc9`.

## Sequence
1. `git init -b main` ; `git remote add origin https://github.com/DingJun1028/ftgtours-esggo-co.git`
2. Add all (`.gitignore` already excludes `node_modules`/`dist`). `git commit`.
3. `git push -u origin main` → triggers CI.
4. CI `deploy` job FAILS: `peaceiris/actions-gh-pages` → `403 Permission denied to github-actions[bot]`.
   FIX: add to `deploy` job:
   ```yaml
   permissions:
     contents: write
     pages: write
   ```
5. Re-push. Deploy succeeds, `gh-pages` branch created, but **live still stale** because
   DNS pointed at Cloudflare Tunnel, not GitHub Pages (see P7).
6. Diagnose DNS: `GET /zones/{zone}/dns_records?name=ftgtours.esggo.co` →
   `CNAME → <uuid>.cfargotunnel.com`. Repoint: `PATCH` the record to
   `content: dingjun1028.github.io`, `proxied: true`.
7. Enable Pages: `gh api -X POST /repos/X/pages -f source[branch]=gh-pages -f source[path]=/`
   → `cname: ftgtours.esggo.co`, `status: built`.
8. Switch CI to official Actions Pages (P8): `upload-pages-artifact@v3` + `deploy-pages@v4`
   with `permissions: { pages: write, id-token: write }` and `environment: github-pages`.
9. Deploy fails: `Branch "main" is not allowed to deploy to github-pages`.
   FIX: `gh api -X POST /repos/X/environments/github-pages/deployment-branch-policies -f name=main`
10. Add SPA fallback in build job: `cp dist/index.html dist/404.html` (so client routes render).
11. Re-push. Deploy green. Purge Cloudflare (`POST /zones/{zone}/purge_cache` `purge_everything`).
12. Wait ~60s. Verify: all 6 subpages return React app body; 65/65 images return 200.

## Verification commands (run after purge)
```bash
B="https://ftgtours.esggo.co"
# pages (body check, status may be 404 for subpages — that's OK, body is React app)
for p in "" esg-impact-note wellbeing-retreat family-day executive-retreat esg-team-day corporate-travel; do
  curl -s "$B/$p" | grep -q '<div id="root">' && echo "/$p OK" || echo "/$p FAIL"
done
# images: loop local dist/images/<dir> and curl each
for d in esg-impact-note wellbeing-retreat family-day executive-retreat esg-team-day corporate-travel; do
  for f in $(ls dist/images/$d); do
    curl -s -o /dev/null -w "%{http_code}" "$B/images/$d/$f" | grep -q 200 || echo "IMG FAIL $d/$f"
  done
done
# canonical
curl -s "$B/" | grep -oE 'canonical" href="[^"]*"'
```

## Gotchas confirmed
- `seo.js` `SITE_URL` edits do NOT change served canonical — edit `index.html` (P5).
- DNS-only Cloudflare token cannot purge; need Global Key or Cache-Purge token (P6).
- Tunnel CNAME masks all GitHub Pages changes (P7) — diagnose DNS FIRST.
- Legacy `peaceiris` locks to old deployment; use Actions Pages (P8).
- Cloudflare `cf-cache-status: HIT` on a 404 means it cached the old 404; purge + repoint fixes it.

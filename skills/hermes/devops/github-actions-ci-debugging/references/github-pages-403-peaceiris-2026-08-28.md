# GitHub Pages deploy 403 via peaceiris/actions-gh-pages

**Symptom**: the `Deploy to GitHub Pages` step fails with:
```
remote: Permission to {owner}/{repo}.git denied to github-actions[bot].
fatal: unable to access 'https://github.com/{owner}/{repo}.git/': The requested URL returned error: 403
```

**Root cause**: `peaceiris/actions-gh-pages@v3` pushes the built site to the `gh-pages` branch using the default `GITHUB_TOKEN`. Since GitHub tightened default token scopes, a workflow job without an explicit `permissions:` block cannot push — the bot token is denied.

**Fix**: add an explicit permission grant to the **deploy** job (not the workflow root unless all jobs need it):
```yaml
  deploy:
    needs: [build, lint, test]
    runs-on: ubuntu-latest
    permissions:
      contents: write      # allow push to gh-pages
      pages: write         # allow Pages API if used
    steps:
      - uses: peaceiris/actions-gh-pages@v3
        with:
          github_token: ${{ secrets.GITHUB_TOKEN }}
          publish_dir: ./dist/
```

**Enable Pages + custom domain**: `gh api POST /repos/{o}/{r}/pages` with `source[branch]=gh-pages` enables Pages and sets the custom `cname` from the repo's `CNAME` file. Until Pages is enabled (or DNS is pointed), the site returns 404 even though `gh-pages` exists.

**Verified 2026-08-28** on `DingJun1028/ftgtours-esggo-co`: first deploy run failed 403; adding `permissions: contents: write, pages: write` to the deploy job made the next run green and created `gh-pages` with `dist/`. After enabling Pages the site served at `https://ftgtours.esggo.co/`.

**CACHE GOTCHA (same session)**: even after a green deploy, `ftgtours.esggo.co` sits behind Cloudflare (orange-cloud). Cloudflare kept serving cached old responses (`cf-cache-status: HIT`, `Server: cloudflare`) — including old 404s — so the live site looked stale / images 404'd despite `gh-pages` having the files (raw.githubusercontent confirmed 200). A green CI run is NOT proof the site updated. Must **Purge Everything** in Cloudflare (or Cache Purge API) before `curl` shows new content.

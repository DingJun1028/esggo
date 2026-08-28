---
name: static-site-vps-deploy
title: Static Site VPS Deployment
description: Upload static sites to Ubuntu + nginx.
---

# Static Site VPS Deployment

## When to use
- Built `dist/` exists.
- Target is Ubuntu + nginx.
- Need upload + reload flow.

## Workflow
1. Build locally.
2. Upload to staging path.
3. Sync into nginx root.
4. Fix ownership.
5. Test and reload nginx.
6. Verify with curl.

## Language Toggle Pattern
- Add `<button id="langToggle" class="nav__lang" aria-label="Switch to English">EN</button>` in nav.
- Add `.nav__lang` styles: pill shape, min-height 44px, contrast-safe hover.
- Add `assets/js/lang-switch.js`:
  - `localStorage` key `ftg-lang` with values `zh-TW` or `en`.
  - Default `zh-TW`; toggle switches between `/` and `/en/` prefixes.
  - On toggle: update button text, store lang, navigate to counterpart path.
- Place `lang-switch.js` before `</body>` with `defer`.
- For `/en/` pages, ensure `lang="en"` in front matter so build injects it into layout.
- Button label: `EN` for zh-TW, `中文` for en.

## WebP + Lazy Loading Pattern
- Use `<picture><source srcset="...webp" type="image/webp"><img class="service-card__media" src="...png" loading="lazy" alt="..."></picture>` for all content images.
- Keep original PNG/JPG in repo; generate WebP via Pillow.
- Avoid `background-image` for lazy-able content images; use `<img loading="lazy">` instead.

## Form Webhook Hardening
- Use `AbortController` with 10s timeout on form submit fetch.
- Add `X-Form-Client: ftg-tours-web2` header for source tracing.
- On timeout, throw `webhook timeout`; on non-ok, include response text in error.
- Keep preview-mode fallback when `config.webhook_url` is empty.

## Accessibility Checklist
- Skip link: `<a class="skip-link" href="#main-content">跳至主要內容</a>` as first body child.
- Main landmark: wrap `{{content}}` in `<main id="main-content">{{content}}</main>`.
- Footer landmark: ensure `<footer class="footer">` exists in layout.
- Form autocomplete: `autocomplete="organization"`, `autocomplete="name"`, `autocomplete="email tel"`.
- Charset: include `<meta charset="UTF-8">` in layout head.
- Verify with automated a11y scan; fix missing landmarks/labels before deploy.

## SEO Checklist
- Per-page `<title>`, `<meta name="description">`, `<meta name="keywords">`.
- Open Graph: `og:title`, `og:description`, `og:type`, `og:url`, `og:image`.
- Twitter Card: `twitter:card`, `twitter:title`, `twitter:description`, `twitter:image`.
- `sitemap.xml` and `robots.txt` in `assets/`, copied to site root.
- GA placeholder in layout if not yet configured.

## Commands
```bash
npm run build
scp -r dist/* ubuntu@<vps>:/opt/esggo/apps/<app>/dist/
ssh ubuntu@<vps> '
  sudo rm -rf /var/www/<site>/* &&
  sudo cp -r /opt/esggo/apps/<app>/dist/* /var/www/<site>/ &&
  sudo chown -R www-data:www-data /var/www/<site> &&
  sudo nginx -t &&
  sudo systemctl reload nginx &&
  curl -I https://<host>/
'
```

## Pitfalls
- Load ssh-agent key if SSH prompts for password.
- Create nginx root if missing.
- 301 to HTTPS is expected when TLS is enabled.
- If SSH returns `Permission denied (publickey)`, reload ssh-agent and re-add key: `eval "$(ssh-agent -s)" && ssh-add ~/.ssh/<key>`.
- For FTG Tours, verified staging path is `/opt/esggo/apps/ftg-tours/dist/` and nginx root is `/var/www/ftg-tours/`.
- Existing site config may be symlinked from `/etc/nginx/sites-available/ftg-esggo`; reuse current config instead of overwriting.
- Always run `sudo nginx -t` before reload.
- Verify online with `curl -I https://<host>/`; expect `HTTP/2 200` when healthy.
- The static-site build script must support nested `pages/**/*.html`; if subdirectories are used, compute the relative asset prefix from output depth and rewrite `../assets/` references accordingly, otherwise `/en/` and deeper paths will break CSS/image links.
- When adding accessibility improvements, prefer semantic landmarks (`<main id="main-content">`) and a skip link over non-semantic `<div>` wrappers; use `<picture>` with WebP sources and `loading="lazy"` for above-the-fold and below-the-fold images alike.
- Form fields should include `autocomplete` attributes where semantically valid, e.g. `autocomplete="organization"`, `autocomplete="name"`, `autocomplete="email tel"`.

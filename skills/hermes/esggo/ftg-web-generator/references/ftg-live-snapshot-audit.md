# FTG Live Snapshot + Broken-Image + Brand Audit

Verified workflow from 2026-08-26: full pull of the live `ftg.esggo.co` site to local,
then an HTTP-status probe of every asset the homepage references, and a brand-residual grep.

## 0. SSH key fingerprint gate (always first)
```bash
ssh-keygen -lf /c/Users/dingj/.ssh/esggo_original
# must equal: SHA256:YGMYtfuYxdV6hJ8yXySOLbQn3ziqnMIHS5+HZlzwyys
# host: 161.118.248.180  (esggo-vps, single shared VPS)
```
Never scp/ssh without re-verifying this fingerprint when a host is newly trusted.

## 1. Full live snapshot (pull)
```bash
mkdir -p /c/Users/dingj/ftg-live-SNAP && \
scp -r -i "C:/Users/dingj/.ssh/esggo_original" -o StrictHostKeyChecking=accept-new \
    ubuntu@161.118.248.180:/var/www/ftgtours/ /c/Users/dingj/ftg-live-SNAP/
# NOTE: scp wraps into an extra ftgtours/ dir -> real files at
#       /c/Users/dingj/ftg-live-SNAP/ftgtours/
```
- Live root is `/var/www/ftgtours/` (NO hyphen). 3.0 homepage = `index.html` there.
- Total ~263M (subpage-images/ is 229M of legacy enterprise art).
- For text/code-only audit, exclude the big image trees:
```bash
ssh -i "C:/Users/dingj/.ssh/esggo_original" -o StrictHostKeyChecking=accept-new \
    ubuntu@161.118.248.180 "cd /var/www/ftgtours && tar czf - --exclude='./subpage-images' --exclude='./images' --exclude='./logos' --exclude='./assets/images' . " \
  | ( mkdir -p /c/Users/dingj/ftg-text-SNAP && cd /c/Users/dingj/ftg-text-SNAP && tar xzf - )
```

## 2. Broken-image probe (P14) — run AFTER every deploy
Homepage references `assets/logo.svg`, `assets/hero.jpg`, `assets/market.jpg`,
`assets/eco.jpg`, `assets/craft.jpg`, `assets/stay.jpg`. These are the slots that
break when image-gen finishes locally but upload is skipped.
```bash
cd /c/Users/dingj/ftg-live-SNAP/ftgtours
for u in logo.svg hero.jpg market.jpg eco.jpg craft.jpg stay.jpg; do
  code=$(curl -s -o /dev/null -w "%{http_code}" --connect-timeout 10 -m 15 "https://ftg.esggo.co/assets/$u")
  echo "  $u -> HTTP $code"
done
# expect all 200. Any 404 = asset was generated but NOT uploaded -> re-upload, do NOT regenerate.
```
Generic version (probe every asset the HTML references):
```bash
cd /c/Users/dingj/ftg-live-SNAP/ftgtours
grep -oE "(assets|images)/[A-Za-z0-9_./-]+\.(svg|jpg|jpeg|png|webp)" index.html \
  | sort -u | while read p; do
      echo "$p -> $(curl -s -o /dev/null -w '%{http_code}' "https://ftg.esggo.co/$p")"
    done
```

## 3. Brand residual check (P15)
```bash
cd /c/Users/dingj/ftg-live-SNAP/ftgtours
grep -rl '望趣\|聖趣\|創價' .        # must return NOTHING
# Legacy 望趣 pages that survive a 3.0 deploy:
#   features.html services.html process.html contact.html thank-you.html layout.html
#   -> rewrite or remove so whole site is 墾趣旅遊 FTG 3.0.
# feedback.html (ESG 旅程回饋) is 3.0-style -> keep.
```
Brand hard rule: strictly `墾趣旅遊`. Never `聖趣` / `望趣` / `創價`.

## 4. Where local generated assets land (when upload was skipped)
`C:/Users/dingj/tmp/ftg-assets/` — logo.png, hero.png, market.png, eco.png, craft.png, stay.png.
If the live probe (step 2) shows 404s but these files exist, the fix is to UPLOAD them
(convert to the extension index.html expects) — not to re-run image generation.

# FTG Tours Deploy Notes

## Verified paths
- Repo: `C:\Users\dingj\Downloads\FTG-Tours-Web2`
- VPS user: `ubuntu@161.118.248.180`
- App dist staging: `/opt/esggo/apps/ftg-tours/dist/`
- Nginx root: `/var/www/ftg-tours/`
- Nginx config: `/etc/nginx/sites-available/ftg-esggo`

## Commands
```bash
# Build
cd C:/Users/dingj/Downloads/FTG-Tours-Web2
npm run build

# Deploy
scp -r dist/* ubuntu@161.118.248.180:/opt/esggo/apps/ftg-tours/dist/
ssh ubuntu@161.118.248.180 'sudo rm -rf /var/www/ftg-tours/* && sudo cp -r /opt/esggo/apps/ftg-tours/dist/* /var/www/ftg-tours/ && sudo chown -R www-data:www-data /var/www/ftg-tours && sudo nginx -t && sudo systemctl reload nginx && curl -I https://ftg.esggo.co/'
```

## SSH key recovery
- If SSH prompts for password or returns `Permission denied (publickey)`, reload the agent:
  ```bash
  eval "$(ssh-agent -s)"
  ssh-add ~/.ssh/id_rsa_esggo
  ```

## Language toggle
- Button id: `langToggle`
- Class: `nav__lang`
- Script: `assets/js/lang-switch.js`
- Storage key: `ftg-lang`
- Values: `zh-TW`, `en`
- Behavior: switches between `/` and `/en/` prefixes

## Image optimization
- Script: `scripts/optimize-images.py`
- Outputs: `assets/images/optimized/`, `assets/images/webp/`
- Final images copied back to `assets/images/`
- Build script must support nested `pages/**/*.html` and rewrite asset paths by depth

## Build script requirements
- Must recursively discover `pages/**/*.html`
- Must preserve subdirectory structure in `dist/`
- Must compute relative asset prefix from output depth
- Must replace `../assets/` references with correct prefix for nested pages

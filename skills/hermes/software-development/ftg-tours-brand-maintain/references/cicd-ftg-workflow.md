# FTG 聖趣旅遊 CI/CD Workflow Reference

## VPS Details
- **IP**: 161.118.248.180 (Oracle ap-singapore-1, A1.Flex 4OCPU/24GB always-free)
- **Domain**: https://ftg.esggo.co/
- **Deploy target**: /var/www/ftg-tours/

## Workflow file
`.github/workflows/deploy-vps.yml` — "Deploy to VPS via SCP + reload nginx"

### Key fix (2026-08-26 session)
- `vps-host` must be `161.118.248.180` (NOT `161.118.252.147`)

## Deploy & Verify sequence
```bash
# 1. Rebuild locally
npm run build

# 2. Verify brand character in built output
python3 -c "
with open('dist/index.html', 'r', encoding='utf-8') as f:
    c = f.read()
print('Wrong char U+58BA:', c.count(chr(0x58BA)))
print('Correct char U+8056:', c.count(chr(0x8056)))
"

# 3. Commit & push
git add -A
git commit -m "fix: ..."
git push origin master

# 4. Wait for CI/CD (~50s)
sleep 50

# 5. Verify live
curl -sS https://ftg.esggo.co/ | grep -oE '<title>[^<]+</title>'
```

## Route verification
All routes return HTTP 200 (HashRouter SPA):
```
/                    → Home
/corporate-travel    → 企業員工旅遊
/family-day          → 企業家庭日
/esg-team-day        → ESG 戶外團隊日
/wellbeing-retreat   → 員工身心平衡旅程
/executive-retreat   → 高階主管共識營
/esg-impact-note     → ESG 影響報告
/privacy-policy      → 隱私政策
/terms-of-service    → 服務條款
```

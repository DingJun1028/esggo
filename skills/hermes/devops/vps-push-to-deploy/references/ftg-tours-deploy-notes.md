# FTG-Tours-Web2 Deploy Notes

- Remote directory: `/var/www/ftgtours`
- HTML root: `https://ftg.esggo.co/` -> HTTP 200
- Verified image assets:
  - `assets/images/home-overview.jpg`
  - `assets/images/employee-travel.png`
  - `assets/images/esg-team-day.png`
  - `assets/images/executive-retreat.png`
  - `assets/images/family-day.png`
  - `assets/images/hero-esg-impact-note.jpg`
  - `assets/images/services-overview.png`
  - `assets/images/wellbeing-retreat.png`
- Repo currently has no remote configured; local verification passes via `npm run build` + `npm test`
- Workflow YAML uses `"on"` quoting to avoid boolean parsing issues

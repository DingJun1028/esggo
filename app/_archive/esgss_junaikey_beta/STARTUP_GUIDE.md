# Startup Guide (After Reboot)

Welcome back! Since you have rebooted to clear the system issues, here is how to get the dashboard running.

## 1. Start Environment

Open your terminal (VS Code or PowerShell) and run:

```bash
# 1. Start the Development Server
cd "c:\Project\ESGss JunAiKey Beta"
npm run dev
```

## 2. Check Database (Optional but Recommended)

If you want real data, ensure Docker is running and try:

```bash
docker compose up -d esg-db
node server/run_migration.cjs
npm run --prefix server db:seed:factors
```

## 3. Mock Mode (Fail-safe)

If the database (Step 2) fails, don't worry.
The application is configured to **automatically load the Truth Dashboard in Mock Mode**.
Just open `http://localhost:5173` and you should see the dashboard.

_All your code is safely saved and synced to the cloud._


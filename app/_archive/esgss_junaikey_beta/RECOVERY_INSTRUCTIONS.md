# System Recovery Instructions

The "incorrect screen" issue on your dashboard is caused by a missing connection to the local PostgreSQL database. The application needs this database to load the Truth Dashboard data.

## 1. The Root Cause

- **Docker Error:** The system attempted to start the database container (`esg-db`) but failed with `unable to get image 'postgres:15-alpine'`, indicating a Docker network or configuration issue.

- **Connection Refused:** Because the database isn't running, the application cannot fetch the necessary data.

## 2. How to Fix It (When Docker is Working)

Once you have resolved the Docker issue (ensure Docker Desktop is running and has internet access), execute the following commands in your terminal:

```bash

# 1. Start the Database manually

docker compose -f docker-compose.yml up -d esg-db



# 2. Run the Database Migration (Creates the tables)

node server/run_migration.cjs



# 3. Seed the Initial Data (Populates emission factors)

npm run --prefix server db:seed:factors

```

## 3. Alternative: Using a Local Postgres (No Docker)

If you prefer running PostgreSQL natively on Windows (without Docker):

1. Install PostgreSQL 15+.

2. Create a user `esg_user` with password `esg_password`.

3. Create a database named `esg_dashboard`.

4. Run the same commands as above (Step 2 & 3).

## 4. Verification

After completing these steps:

- Refresh the browser.

- The Truth Dashboard should now display correctly with the carbon emission data.

_All your code changes have been successfully synchronized to the remote repository._


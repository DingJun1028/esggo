# VPS Database Deployment - Supabase 遷移指引

## 部署步驟

### 1. VPS PostgreSQL 初始化

```bash
# 在 VPS 上安裝 PostgreSQL 15
sudo apt update && sudo apt install postgresql-15

# 建立資料庫與用戶
sudo -u postgres psql
CREATE DATABASE esggo_production;
CREATE USER esggo_admin WITH PASSWORD 'secure_password';
GRANT ALL PRIVILEGES ON DATABASE esggo_production TO esggo_admin;
```

### 2. 資料表結構遷移

```bash
# 將 migration SQL 套用至 VPS
psql -U esggo_admin -d esggo_production -f supabase/migrations/20260618_create_omni_tables.sql
```

### 3. 環境變數設定

```bash
# .env.production
DATABASE_URL="postgresql://esggo_admin:password@vps-ip:5432/esggo_production"
SUPABASE_URL="https://your-supabase-url"  # 保留 DataConnect 用
```

### 4. 數據遷移（可選）

```bash
# � Supabase 匯出
pg_dump -h db.supabase.com -U postgres -d postgres --table=o omni_matrix_components --table=gri_standards --table=esg_benchmark_enterprises > esggo_data.sql

# 匯入至 VPS
psql -U esggo_admin -d esggo_production -f esggo_data.sql
```

## 資料庫連線池設定 (pgBouncer)

```ini
# /etc/pgbouncer/pgbouncer.ini
[databases]
esggo = host=localhost dbname=esggo_production

[pgbouncer]
pool_mode = transaction
max_client_conn = 100
default_pool_size = 20
```

## 自動備份腳本

```bash
# /etc/cron.daily/backup-esggo
#!/bin/bash
pg_dump -U esggo_admin esggo_production > /backup/esggo_$(date +%Y%m%d).sql
find /backup -name "esggo_*.sql" -mtime +7 -delete
```

## 需要修改的檔案

- `lib/db/supabase.ts` - 改用 `DATABASE_URL` 直連
- `lib/omni-core/*.ts` - 更新查詢邏輯
- `vercel.json` 或 `render.yaml` - 設定 VPS 環境變數

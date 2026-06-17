# ESGGO 部署指南

## Supabase 資料庫部署

1. 登入 Supabase Dashboard
2. 前往 SQL Editor
3. 執行 `supabase/migrations/20260618_create_omni_tables.sql`
4. 或執行 `pnpm run setup-esggo-tables` (需要 SUPABASE_URL & ANON_KEY)

## Docker 部署 (VPS)

```bash
# Build image
docker build -t esggo .

# Run container
docker run -d -p 3000:3000 \
  -e NEXT_PUBLIC_SUPABASE_URL=$SUPABASE_URL \
  -e NEXT_PUBLIC_SUPABASE_ANON_KEY=$SUPABASE_ANON_KEY \
  --name esggo-app esggo
```

## Render 部署

```bash
# 登入 Render
render login

# 部署
render deploy --service-id <service-id>
```

## 環境變數 (.env.local)

```bash
# Supabase
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=

# ESGGO API Key
ESGGO_API_KEY_TTL_DAYS=365
ESGGO_API_RATE_LIMIT=1000

# AI Engine
AI_ENGINE=local
AI_MODEL=llava-phi3:latest
```

## 驗證部署

```bash
# 健康檢查
curl http://localhost:3000/api/system/health

# 矩陀路由
curl http://localhost:3000/api/matrix
```

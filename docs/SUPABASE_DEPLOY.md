# Supabase Deployment Configuration

## Environment Variables (.env.production)

```
SUPABASE_URL=https://[project].supabase.co
SUPABASE_ANON_KEY=eyJ...
SUPABASE_SERVICE_ROLE_KEY=eyJ...
NEXT_PUBLIC_SUPABASE_URL=https://[project].supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
```

## Deploy Commands

```bash
# Link to Supabase project
supabase login
supabase link --project-ref [project-ref]

# Push database migrations
supabase db push

# Deploy Edge Functions (if any)
supabase functions deploy

# Generate TypeScript types
supabase gen types typescript --project-id [project-ref] --schema public > lib/types/supabase.ts
```

## Vercel Integration

```bash
# Link to Vercel project
npx vercel link

# Set environment variables
npx vercel env add SUPABASE_URL production
npx vercel env add SUPABASE_ANON_KEY production
```

## Health Check Endpoint

GET /api/system/health - Returns system status and uptime

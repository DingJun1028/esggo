# ESGGO Secret Mapping

| Local Key | GCP Secret Name | Target Environment | Purpose |
| :--- | :--- | :--- | :--- |
| SUPABASE_SERVICE_ROLE_KEY | SUPABASE_SERVICE_ROLE_KEY | VPS, Vercel | Database Admin |
| NEXT_PUBLIC_GEMINI_API_KEY | NEXT_PUBLIC_GEMINI_API_KEY | Vercel, VPS | AI Logic |
| OPENROUTER_API_KEY | OPENROUTER_API_KEY | VPS, Vercel | LLM Routing |
| FIREBASE_PRIVATE_KEY | FIREBASE_PRIVATE_KEY | VPS | Admin SDK |
| NOCODEBACKEND_API_KEY | NOCODEBACKEND_API_KEY | VPS | Data Storage |
| VERCEL_API_KEY | VERCEL_API_KEY | Local/CI | Deployment |

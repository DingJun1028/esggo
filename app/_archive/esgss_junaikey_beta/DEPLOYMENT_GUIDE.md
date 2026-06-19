# ?函蔡??

**?**: v1.0  
**?敺??*: 2026-02-06

---

## ?啣??瘙?
### ?垢

- Node.js: 18.x ??啁???- npm: 9.x ??啁???- Vercel CLI (?舫): ??啁???
### 敺垢

- Node.js: 18.x ??啁???- Supabase CLI: ??啁???- Docker: 20.x ??啁???
### 鞈?摨?
- Supabase (PostgreSQL): 15.x

---

## Supabase 撠?閮剖?

### 1. 撱箇??啣?獢?
1. ?? [Supabase Dashboard](https://supabase.com/dashboard)
2. 暺? "New Project"
3. 憛怠神撠??迂??蝣?4. 數據???(撱箄降數據?曹漪??)
5. 蝑?撠?撱箇?摰?

### 2. 閮剖?鞈?摨?
```sql
-- ?瑁? SQL ?誘撱箇?表格
-- 隢???init-db.sql ?辣
```

### 3. 閮剖? Edge Functions

```bash
# 摰? Supabase CLI
npm install -g supabase

# ?餃
supabase login

# ????獢?supabase init

# ?函蔡 Edge Functions
supabase functions deploy
```

---

## ?啣?霈?蔭

### ?垢?啣?霈

?萄遣 `.env.local` 瑼?嚗?
```env
# Supabase ?蔭
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key

# API ?蔭
VITE_API_BASE_URL=http://localhost:8080

# ???
VITE_ENABLE_MOCK_DATA=true
VITE_ENABLE_DEBUG_MODE=true
```

### 敺垢?啣?霈

?萄遣 `.env` 瑼?嚗?
```env
# Supabase ?蔭
SUPABASE_URL=your_supabase_url
SUPABASE_SERVICE_KEY=your_supabase_service_key

# JWT ?蔭
JWT_SECRET=your_jwt_secret_key
JWT_EXPIRES_IN=7d

# API ?蔭
PORT=8080
NODE_ENV=development
```

### ??啣?

```env
# ??啣?雿輻
NODE_ENV=production
VITE_ENABLE_MOCK_DATA=false
```

---

## 鞈?摨恍蝵?
### 1. ?瑁??瑞宏

```bash
# 雿輻 Supabase CLI
supabase db push
```

### 2. 蝔桀?鞈?

```bash
supabase db reset --seed-file seed.sql
```

### 3. ?遢鞈?

```bash
# ?臬鞈?摨?supabase db dump > backup_$(date +%Y%m%d).sql
```

---

## Edge Functions ?函蔡

### ?璅∪?

```bash
# ???砍 Edge Functions 璅⊥??supabase functions serve
```

### ?函蔡?啁??Ｙ憓?
```bash
# ?函蔡???functions
supabase functions deploy --project-ref your_project_ref

# ?函蔡?孵? function
supabase functions deploy function_name --project-ref your_project_ref
```

---

## ?垢?函蔡 (Vercel)

### 1. ?? Vercel

```bash
# 摰? Vercel CLI
npm i -g vercel

# ?餃
vercel login

# ???撠?
vercel link
```

### 2. ?函蔡

```bash
# ?汗?函蔡
vercel

# ??函蔡
vercel --prod
```

### 3. ?啣?霈閮剖?

??Vercel Dashboard 銝剛身摰?

1. ??撠? Settings
2. 暺? "Environment Variables"
3. 瘛餃????閬??啣?霈
4. 數據?拍?憓?(Production, Preview, Development)

---

## Docker ?函蔡

### 撱箸???

```bash
# 撱箸??垢??
docker build -t esgss-frontend .

# 撱箸?敺垢??
docker build -t esgss-backend -f Dockerfile.backend .
```

### ?瑁?摰孵

```bash
# ?瑁??垢
docker run -p 3000:3000 esgss-frontend

# ?瑁?敺垢
docker run -p 8080:8080 esgss-backend
```

### Docker Compose

```bash
# ???????docker-compose up -d

# ?迫?????docker-compose down
```

---

## 撽?皜

### ?函蔡?炎??
- [ ] ??憓??詨歇閮剖?
- [ ] 鞈?摨恍蝘餃歇摰?
- [ ] Edge Functions 撌脤蝵?- [ ] ?桀?皜祈岫??
- [ ] E2E 皜祈岫??

### ?函蔡敺?霅?
- [ ] ?亙熒瑼Ｘ蝡舫?甇?虜 (`/api/health`)
- [ ] API ?臭誑甇?虜隤?
- [ ] 數據?臭誑甇?Ⅱ霈撖?- [ ] ?航炊??甇?虜??
- [ ] Logger 甇?虜閮?

### ??啣?瑼Ｘ

- [ ] CDN 撌脫迤蝣箄身摰?- [ ] SSL ????
- [ ] Rate limiting 已完成- [ ] ???郎撌脰身摰?- [ ] ?遢蝑已完成
---

## 撣貉???

### Q: Edge Functions ?函蔡憭望?嚗?
蝣箔? Supabase CLI 撌脩?伐?銝?獢?ID 甇?Ⅱ??
### Q: ?⊥???鞈?摨恬?

瑼Ｘ?啣?霈銝剔? `SUPABASE_URL` ??`SUPABASE_SERVICE_KEY` ?臬甇?Ⅱ??
### Q: ?垢頛蝺拇嚗?
蝣箔?已完成gzip 憯葬??CDN ??
---

## ?賊?鞈?

- [API Reference](./API_REFERENCE.md)
- [元件??](./COMPONENT_GUIDE.md)
- [Supabase ?辣](https://supabase.com/docs)
- [Vercel ?辣](https://vercel.com/docs)


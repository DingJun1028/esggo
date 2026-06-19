# ?? 系統?函蔡?? (Deployment Guide)

**撠??迂**: ESGss x JunAiKey Beta

**?函蔡?格?**: Google Cloud Run / Docker Container

---

## 銝???啣?皞? (Environment Prep)

### 系統靘陷??
- [x] Node.js 20+
- [x] Docker Desktop
- [x] Google Cloud SDK (`gcloud`)
- [x] Git

### Google Cloud ?蔭
1. GCP ? ID: `esg-sunshine`
2. ?函蔡??? `asia-east1`
3. ? API: Cloud Run, Cloud Build, Artifact Registry, Cloud SQL, Redis.

---

## 鈭??蔭????(Config & Start)

### 1. 靘陷摰?
```bash
# 摰??垢?撅靘陷
npm install

# 摰?隡箸??函垢靘陷
cd server && npm install && cd ..
```

### 2. ?啣?霈??蔭
```bash
# 銴ˊ蝭??辣
cp .env.example .env

# 憛怠神敹???API Keys ??澈???靽⊥
```

### 3. ?砍?璅∪???
```bash
# ???垢
npm run dev:ui

# ??敺垢
npm run dev:backend

# 蝯曹???
npm run dev
```

---

## 銝?Cloud Run ?函蔡瘚?

### 摰孵????

#### 甇仿? 1: 瑽遣 Docker ?∪?
```bash
docker build -f Dockerfile.cloudrun -t esg-dashboard .
```

#### 甇仿? 2: ?券 Artifact Registry
```bash
docker tag esg-dashboard asia-east1-docker.pkg.dev/esg-sunshine/cloud-run-source-deploy/esg-dashboard
docker push asia-east1-docker.pkg.dev/esg-sunshine/cloud-run-source-deploy/esg-dashboard
```

#### 甇仿? 3: ?函蔡??Cloud Run
```bash
gcloud run deploy esg-dashboard-service \
  --image asia-east1-docker.pkg.dev/esg-sunshine/cloud-run-source-deploy/esg-dashboard \
  --platform managed \
  --region asia-east1 \
  --allow-unauthenticated
```

---

## ???箇?閮剜閮剔蔭

### Cloud SQL PostgreSQL
```bash
gcloud sql instances create esg-db --database-version=POSTGRES_14 --tier=db-f1-micro --region=asia-east1
```

### Redis (Cloud Memorystore)
```bash
gcloud redis instances create esg-redis --size=1 --region=asia-east1 --tier=basic
```

---

## 鈭??函蔡撽?

### ?亙熒瑼Ｘ
```bash
curl https://esg-dashboard-service-*.run.app
curl https://esg-backend-service-*.run.app/api/health
```

---

\*_?敺雁霅瑟?: 2026-01-28
\*_蝬剛風??_: ESG Sunshine Team


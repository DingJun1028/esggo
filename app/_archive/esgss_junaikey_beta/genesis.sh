#!/bin/bash

# 設定顏色
GREEN='\033[0;32m'
BLUE='\033[0;34m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${BLUE}🚀 Initializing Celestial Omnipotent Think Tank Protocol...${NC}"

# ---[ HARDENING: Security Check ]---
if [ -z "$DB_PASSWORD" ] || [ -z "$GEMINI_API_KEY" ] || [ -z "$ADMIN_SECRET" ]; then
    echo -e "${RED}❌ ERROR: Critical environment variables are not set.${NC}"
    echo -e "Please set the following variables before running genesis.sh:"
    echo -e "  - DB_PASSWORD"
    echo -e "  - GEMINI_API_KEY"
    echo -e "  - ADMIN_SECRET"
    exit 1
fi
echo -e "${GREEN}✅ Security pre-flight check passed.${NC}"
# ---[ END HARDENING ]---


# 1. 建立專案目錄
mkdir -p celestial-system
cd celestial-system

echo -e "${GREEN}✅ Created root directory: celestial-system${NC}"

# 2. 建立資料庫初始化腳本
cat > init.sql <<EOF
CREATE EXTENSION IF NOT EXISTS vector;
CREATE TABLE IF NOT EXISTS agents (
id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
name VARCHAR(255) NOT NULL,
system_prompt JSONB NOT NULL,
created_at TIMESTAMP DEFAULT NOW()
);
CREATE TABLE IF NOT EXISTS knowledge_chunks (
id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
content TEXT NOT NULL,
embedding VECTOR(768),
metadata JSONB DEFAULT '{}'
);
CREATE TABLE IF NOT EXISTS lessons (
id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
trigger_keywords TEXT,
lesson_content TEXT
);
EOF
echo -e "${GREEN}✅ Generated: init.sql${NC}"

# 3. 建立 Docker Compose
cat > docker-compose.yml <<EOF
version: '3.8'
services:
db:
image: pgvector/pgvector:pg16
container_name: celestial-db
restart: always
environment:
POSTGRES_USER: celestial_admin
POSTGRES_PASSWORD: \${DB_PASSWORD}
POSTGRES_DB: celestial_db
volumes:
- postgres_data:/var/lib/postgresql/data
- ./init.sql:/docker-entrypoint-initdb.d/init.sql
networks:
- celestial-net

redis:
image: redis:alpine
container_name: celestial-redis
restart: always
networks:
- celestial-net

backend:
build: ./server
container_name: celestial-backend
restart: always
depends_on:
- db
- redis
environment:
PORT: 3000
DATABASE_URL: postgres://celestial_admin:\${DB_PASSWORD}@db:5432/celestial_db
GEMINI_API_KEY: \${GEMINI_API_KEY}
ADMIN_SECRET: \${ADMIN_SECRET}
OPENAI_API_KEY: \${OPENAI_API_KEY}
volumes:
- ./backups:/backups
- ./server/skills:/app/skills
networks:
- celestial-net

worker:
build: ./server
container_name: celestial-worker
command: node worker.js
restart: always
depends_on:
- backend
- redis
environment:
DATABASE_URL: postgres://celestial_admin:\${DB_PASSWORD}@db:5432/celestial_db
GEMINI_API_KEY: \${GEMINI_API_KEY}
networks:
- celestial-net

tunnel:
image: cloudflare/cloudflared:latest
container_name: celestial-tunnel
restart: always
command: tunnel run
environment:
TUNNEL_TOKEN: \${TUNNEL_TOKEN}
networks:
- celestial-net

volumes:
postgres_data:

networks:
celestial-net:
driver: bridge
EOF
echo -e "${GREEN}✅ Generated: docker-compose.yml${NC}"

# 4. 建立後端結構 (Celestial Server)
mkdir -p server/utils
mkdir -p server/skills
mkdir -p server/scripts
mkdir -p backups

# 後端 Dockerfile
cat > server/Dockerfile <<EOF
FROM node:18-alpine
WORKDIR /app
RUN apk add --no-cache ffmpeg python3 make g++ postgresql-client
COPY package*.json ./
RUN npm install --production
COPY . .
EXPOSE 3000
CMD ["node", "server.js"]
EOF

# 後端 package.json
cat > server/package.json <<EOF
{
"name": "server",
"version": "2.0.0",
"main": "server.js",
"dependencies": {
"express": "^4.18.2",
"cors": "^2.8.5",
"pg": "^8.11.3",
"dotenv": "^16.3.1",
"@google/generative-ai": "^0.1.3",
"bullmq": "^4.12.0",
"ioredis": "^5.3.2",
"multer": "^1.4.5-lts.1",
"openai": "^4.20.1",
"axios": "^1.6.0"
}
}
EOF

# 建立空白的 server.js 和 worker.js (佔位用)
touch server/server.js
touch server/worker.js
touch server/utils/MemoryManager.js
touch server/utils/SwarmOrchestrator.js

# 建立備份腳本
cat > server/scripts/backup_db.sh <<EOF
#!/bin/sh
FILENAME="celestial_backup_\$(date +%Y%m%d_%H%M%S).sql"
PGPASSWORD=\$DB_PASSWORD pg_dump -h db -U celestial_admin celestial_db > /backups/\$FILENAME
echo "Backup created: \$FILENAME"
find /backups -name "*.sql" -mtime +7 -delete
EOF
chmod +x server/scripts/backup_db.sh

echo -e "${GREEN}✅ Generated: server structure${NC}"

# 5. 建立 CLI 結構 (JunAiKey)
mkdir -p jun-ai-key/src
cat > jun-ai-key/package.json <<EOF
{
"name": "jun-ai-key",
"version": "1.0.0",
"type": "module",
"bin": { "jak": "./index.js" },
"dependencies": {
"commander": "^11.1.0",
"axios": "^1.6.0",
"chalk": "^5.3.0",
"ora": "^7.0.1",
"inquirer": "^9.2.11",
"boxen": "^7.1.1",
"dotenv": "^16.3.1",
"chokidar": "^3.5.3"
}
}
EOF

touch jun-ai-key/index.js
touch jun-ai-key/src/api.js
touch jun-ai-key/src/chat.js
touch jun-ai-key/src/generator.js

echo -e "${GREEN}✅ Generated: jun-ai-key structure${NC}"

# 6. 建立 Synapse Watcher (本地監控腳本)
mkdir -p scripts
touch scripts/FolderWatcher.js

echo -e "${GREEN}✅ Generated: scripts/FolderWatcher.js${NC}"

# 7. 建立 .env 範本
cat > .env <<EOF
DB_PASSWORD=celestial_secret
GEMINI_API_KEY=
ADMIN_SECRET=my_secret_token
TUNNEL_TOKEN=
OPENAI_API_KEY=
EOF

echo -e "${BLUE}🎉 Genesis Complete.${NC}"
echo -e "Next steps:"
echo -e "1. Fill in the code for server.js, worker.js, etc. (from our conversation)."
echo -e "2. Edit .env with your real API keys."
echo -e "3. Run 'docker-compose up -d --build' to awaken the system."

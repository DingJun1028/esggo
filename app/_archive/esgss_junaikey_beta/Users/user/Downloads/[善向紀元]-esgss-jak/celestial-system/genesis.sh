#!/bin/bash

# 萬能智庫 - 創世腳本
# 自動生成完整的專案結構

echo -e "\033[0;34m🌌 Initializing Celestial Omnipotent Think Tank Protocol...\033[0m"

# 檢查是否在正確目錄
if [ ! -d "celestial-system" ]; then
    mkdir -p celestial-system
    cd celestial-system
fi

echo -e "\033[0;32m✔ Project root ready\033[0m"

# 1. 建立資料庫初始化腳本
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
echo -e "\033[0;32m✔ Database schema created\033[0m"

# 2. 建立 Docker Compose
cat > docker-compose.yml <<EOF
version: '3.8'
services:
db:
image: pgvector/pgvector:pg16
container_name: celestial-db
restart: always
environment:
POSTGRES_USER: celestial_admin
POSTGRES_PASSWORD: \${DB_PASSWORD:-celestial_secret}
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
build: ./celestial-server
container_name: celestial-backend
restart: always
depends_on:
- db
- redis
environment:
PORT: 3000
DATABASE_URL: postgres://celestial_admin:\${DB_PASSWORD:-celestial_secret}@db:5432/celestial_db
GEMINI_API_KEY: \${GEMINI_API_KEY}
ADMIN_SECRET: \${ADMIN_SECRET}
OPENAI_API_KEY: \${OPENAI_API_KEY}
volumes:
- ./backups:/backups
networks:
- celestial-net

worker:
build: ./celestial-server
container_name: celestial-worker
command: node worker.js
restart: always
depends_on:
- backend
- redis
environment:
DATABASE_URL: postgres://celestial_admin:\${DB_PASSWORD:-celestial_secret}@db:5432/celestial_db
GEMINI_API_KEY: \${GEMINI_API_KEY}
networks:
- celestial-net

volumes:
postgres_data:

networks:
celestial-net:
driver: bridge
EOF
echo -e "\033[0;32m✔ Docker Compose configuration created\033[0m"

# 3. 建立後端結構
mkdir -p celestial-server/utils
mkdir -p celestial-server/skills
mkdir -p backups

# 後端 Dockerfile
cat > celestial-server/Dockerfile <<EOF
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
cat > celestial-server/package.json <<EOF
{
"name": "celestial-server",
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

# 空的後端檔案 (待填充)
touch celestial-server/server.js
touch celestial-server/worker.js
touch celestial-server/utils/MemoryManager.js
touch celestial-server/utils/SwarmOrchestrator.js

echo -e "\033[0;32m✔ Backend structure created\033[0m"

# 4. 建立 CLI 結構
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

echo -e "\033[0;32m✔ CLI structure created\033[0m"

# 5. 建立環境變數範本
cat > .env <<EOF
DB_PASSWORD=celestial_secret
GEMINI_API_KEY=
ADMIN_SECRET=my_secret_token
TUNNEL_TOKEN=
OPENAI_API_KEY=
EOF

echo -e "\033[0;32m✔ Environment template created\033[0m"

echo -e "\033[0;34m🌌 Genesis Complete!\033[0m"
echo -e "\033[0;37mNext steps:\033[0m"
echo -e "1. Fill in the code for server.js, worker.js, etc."
echo -e "2. Edit .env with your real API keys."
echo -e "3. Run 'docker-compose up -d --build' to awaken the system."
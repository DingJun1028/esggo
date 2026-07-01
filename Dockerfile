FROM node:22-alpine AS deps
WORKDIR /app
# 升級系統套件以修復已知的 Alpine 漏洞
RUN apk upgrade --no-cache
# 啟用 corepack 以支援 pnpm
RUN corepack enable pnpm

# 複製 package.json 與 lock 檔案
COPY package.json pnpm-lock.yaml* ./
# 安裝所有相依套件
RUN pnpm install --frozen-lockfile

FROM node:22-alpine AS builder
WORKDIR /app
RUN apk upgrade --no-cache
RUN corepack enable pnpm

# 複製所有原始碼
COPY . .
# 從 deps 階段複製 node_modules
COPY --from=deps /app/node_modules ./node_modules

# 執行建置
RUN pnpm run build

FROM node:22-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
RUN apk upgrade --no-cache
RUN corepack enable pnpm

# 複製構建出的靜態資源與 .next
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next ./.next
# 拷貝完整的 node_modules 以解決 ADR-005 提到的 "sh: next: not found" 問題
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/next.config.ts ./next.config.ts

EXPOSE 3000

# 啟動服務
CMD ["pnpm", "start"]

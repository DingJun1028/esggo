# ==========================================
# 完全代主自行 - Docker 配置
# ==========================================

# 多階段建構
FROM node:18-alpine AS builder

WORKDIR /app

# 複製套件管理檔案
COPY package.json pnpm-lock.yaml ./

# 安裝 pnpm
RUN corepack enable && corepack prepare pnpm@latest --activate

# 安裝依賴
RUN pnpm install --frozen-lockfile

# 複製原始碼
COPY . .

# 建構應用程式
RUN pnpm build

# ==========================================
# 生產映像
# ==========================================

FROM node:18-alpine AS production

WORKDIR /app

# 安裝 dumb-init (處理 PID 1 問題)
RUN apk add --no-cache dumb-init

# 創建非 root 用戶
RUN addgroup -g 1001 -S appgroup && \
    adduser -S appuser -u 1001

# 複製建構結果
COPY --from=builder --chown=appuser:appgroup /app/dist ./dist
COPY --from=builder --chown=appuser:appgroup /app/node_modules ./node_modules
COPY --from=builder --chown=appuser:appgroup /app/package.json ./

# 設置環境變數
ENV NODE_ENV=production
ENV PORT=3000

# 暴露端口
EXPOSE 3000

# 切換到非 root 用戶
USER appuser

# 健康檢查
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD node --check "http://localhost:3000/api/healthz" || exit 1

# 啟動應用程式
ENTRYPOINT ["dumb-init", "--"]
CMD ["node", "dist/server.js"]

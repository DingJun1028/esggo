# ESG Backend Server - Production Optimized Dockerfile
# 🌿 上善若水：適應生產環境，流動而穩固

# ===========================================
# STAGE 1: Builder - 編譯 TypeScript
# ===========================================
FROM node:20-alpine AS builder

WORKDIR /app

# Copy package files
COPY package.json package-lock.json* ./

# Install ALL dependencies (including devDependencies for build)
RUN npm ci

# Copy source code
COPY . .

# Build TypeScript to JavaScript
# This creates the /app/dist directory with compiled code
RUN npm run build

# ===========================================
# STAGE 2: Production - 精簡執行環境
# ===========================================
FROM node:20-alpine

WORKDIR /app

# Create non-root user for security
RUN addgroup -S appgroup && adduser -S appuser -G appgroup

# Copy ONLY production dependencies from builder
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/package-lock.json* ./package-lock.json

# Install production dependencies only
RUN npm ci --only=production && npm cache clean --force

# Copy compiled JavaScript from builder
COPY --from=builder /app/dist ./dist

# Copy any additional runtime files (if needed)
# COPY --from=builder /app/config ./config

# Set correct ownership
RUN chown -R appuser:appgroup /app

# Set environment to production
ENV NODE_ENV=production

# Switch to non-root user
USER appuser

# Expose backend port
EXPOSE 3001

# Health check endpoint (will be used by docker-compose)
HEALTHCHECK --interval=30s --timeout=10s --retries=3 --start-period=40s \
    CMD node -e "require('http').get('http://localhost:3001/api/health', (r) => process.exit(r.statusCode === 200 ? 0 : 1))"

# Start the compiled server
CMD ["node", "dist/server/server.js"]

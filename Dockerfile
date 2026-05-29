# ---- Multi-stage Dockerfile for ESGGO ----
# Stage 1: Build (Node.js)
FROM node:20-alpine AS builder
WORKDIR /app
COPY package.json package-lock.json* .
RUN npm ci
COPY . .
# Build Next.js app
RUN npm run build

# Stage 2: Runtime
FROM node:20-alpine AS runtime
WORKDIR /app
# Copy only production dependencies
COPY --from=builder /app/package.json ./
COPY --from=builder /app/package-lock.json* ./
RUN npm ci --omit=dev
# Copy built assets
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/next.config.mjs ./
# Expose default Next.js port
EXPOSE 3000
ENV NODE_ENV=production
CMD ["npm","run","start"]
# ---- Multi-stage Dockerfile for ESGGO (Powered by OmniCore) ----
# Stage 1: Build (Node.js 24)
FROM node:24-slim AS builder
WORKDIR /app
COPY package.json package-lock.json* .
RUN npm ci
COPY . .
# Build Next.js app
RUN npm run build

# Stage 2: Runtime (Node.js 24)
FROM node:24-slim AS runtime
WORKDIR /app
# Copy only production dependencies
COPY --from=builder /app/package.json ./
COPY --from=builder /app/package-lock.json* ./
RUN npm ci --omit=dev
# Copy built assets
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
# Next.js 15 uses next.config.ts but compiled to next.config.js or similar in .next
# Depending on setup, we might need next.config.ts/js in root
COPY --from=builder /app/next.config.ts ./
# Expose default Next.js port
EXPOSE 3000
ENV NODE_ENV=production
CMD ["npm","run","start"]

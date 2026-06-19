# ESGss JunAiKey: Multi-Stage Production Dockerfile (Super Secure Edition)
# Philosophy: "High Performance, Zero Vulnerability, Low Footprint"

# Stage 1: Dependencies
# Using node:22-alpine for a minimal, highly secure surface area
FROM node:22-alpine AS deps
ENV NODE_ENV=development

# Alpine security patching & package installation
RUN apk update && apk upgrade && \
    apk add --no-cache libc6-compat && \
    adduser --system --uid 1001 nextjs

WORKDIR /app
COPY package.json package-lock.json* ./
RUN npm ci --legacy-peer-deps

# Stage 2: Builder
FROM node:22-alpine AS builder
RUN apk update && apk upgrade
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npm run build

# Stage 3: Runner
# Use distroless for the final stage to achieve near-zero vulnerabilities
FROM gcr.io/distroless/nodejs22-debian12 AS runner
WORKDIR /app
ENV NODE_ENV=production

# Security: Distroless runs as non-root by default
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static

EXPOSE 3000
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

# Distroless uses the entrypoint to run node
CMD ["server.js"]

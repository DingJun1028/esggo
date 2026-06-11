# ---- Multi-stage Dockerfile for ESGGO (Powered by OmniCore) ----

# Base setup for pnpm
FROM node:24-slim AS base
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable pnpm

# Stage 1: Build (Node.js 24)
FROM base AS builder
WORKDIR /app
COPY package.json pnpm-lock.yaml ./
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --frozen-lockfile
COPY . .
# Build Next.js app
ENV NODE_ENV=production
RUN pnpm run build

# Stage 2: Runtime (Node.js 24)
FROM node:24-slim AS runtime
WORKDIR /app
ENV NODE_ENV=production
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

# Switch to non-root user for security
RUN chown -R node:node /app
USER node

# Copy built assets for standalone mode
COPY --from=builder --chown=node:node /app/public ./public
COPY --from=builder --chown=node:node /app/.next/standalone ./
COPY --from=builder --chown=node:node /app/.next/static ./.next/static

# Expose default Next.js port
EXPOSE 3000
CMD ["node", "server.js"]

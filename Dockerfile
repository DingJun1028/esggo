FROM node:20-alpine AS builder

WORKDIR /app

# Install pnpm
RUN npm install -g pnpm@10

# Copy entire repository for workspace-aware install
COPY . .

# Install dependencies
RUN pnpm install --frozen-lockfile

# Build application
RUN pnpm run build

# Production stage
FROM node:20-alpine AS runner
WORKDIR /app

# Install pnpm
RUN npm install -g pnpm@10

# Copy built application
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/pnpm-lock.yaml ./pnpm-lock.yaml
COPY --from=builder /app/next.config.mjs ./next.config.mjs

# Install production dependencies only
RUN pnpm install --prod --frozen-lockfile

EXPOSE 3000

ENV NODE_ENV=production
ENV PORT=3000

CMD ["pnpm", "start"]

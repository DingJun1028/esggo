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
COPY --from=builder /app/next.config.ts ./next.config.ts
COPY --from=builder /app/pnpm-workspace.yaml ./pnpm-workspace.yaml

# Copy local file dependencies required for pnpm install
COPY --from=builder /app/packages/types ./packages/types
COPY --from=builder /app/src/dataconnect-admin-generated ./src/dataconnect-admin-generated
COPY --from=builder /app/src/dataconnect-generated ./src/dataconnect-generated

# Install production dependencies only
RUN pnpm install --prod --frozen-lockfile

EXPOSE 3000

ENV NODE_ENV=production
ENV PORT=3000

CMD ["pnpm", "start"]

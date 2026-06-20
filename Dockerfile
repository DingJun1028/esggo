# ESGGO Docker Deployment - VPS 容器化部署
FROM node:20-alpine AS builder

WORKDIR /app

# Install pnpm
RUN npm install -g pnpm@9

# Copy package files and required local workspace packages
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY src/dataconnect-admin-generated ./src/dataconnect-admin-generated
COPY src/dataconnect-generated ./src/dataconnect-generated
RUN pnpm install --frozen-lockfile

# Copy source code
COPY . .

# Build application
RUN pnpm run build

# Production stage
FROM node:20-alpine AS runner
WORKDIR /app

# Install pnpm
RUN npm install -g pnpm@9

# Copy built application
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/pnpm-lock.yaml ./pnpm-lock.yaml
COPY --from=builder /app/pnpm-workspace.yaml ./pnpm-workspace.yaml
COPY --from=builder /app/next.config.mjs ./next.config.mjs
COPY --from=builder /app/src/dataconnect-admin-generated ./src/dataconnect-admin-generated
COPY --from=builder /app/src/dataconnect-generated ./src/dataconnect-generated

# Install production dependencies only
RUN pnpm install --prod --frozen-lockfile

EXPOSE 3000

ENV NODE_ENV=production
ENV PORT=3000

CMD ["pnpm", "start"]
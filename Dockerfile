FROM node:22-alpine AS deps
WORKDIR /app
# pnpm is used in this repo
RUN corepack enable pnpm
COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile --prod --ignore-scripts

FROM node:22-alpine AS builder
WORKDIR /app
RUN corepack enable pnpm
COPY . .
# install all deps for build
RUN pnpm install --frozen-lockfile --ignore-scripts
RUN pnpm run build

FROM node:22-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/public ./public
COPY --from=builder /app/package.json ./package.json

EXPOSE 3000
CMD ["npm", "start"]

# Multi-stage build for production
FROM node:22-alpine AS base
WORKDIR /app
ENV PNPM_HOME="/pnpm"
ENV PATH="${PNPM_HOME}:${PATH}"
RUN corepack enable && corepack prepare pnpm@10.4.1 --activate

FROM base AS builder
COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile
COPY . .
RUN pnpm build

FROM base AS runner
WORKDIR /app
ENV NODE_ENV=production
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/package.json ./
COPY --from=builder /app/index.ts ./index.ts
# tsx is required by the real TypeScript server entry point.
COPY --from=builder /app/node_modules ./node_modules
USER node
EXPOSE 3000
CMD ["./node_modules/.bin/tsx", "index.ts"]

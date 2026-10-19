# Secure T local SPA/API runtime; never fetch unrelated repositories or run an IDE.
FROM node:22-bookworm-slim AS builder
WORKDIR /app
RUN corepack enable && corepack prepare pnpm@11.25.0 --activate
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
RUN pnpm install --frozen-lockfile --ignore-scripts
COPY . .
RUN pnpm build

FROM node:22-bookworm-slim
ENV NODE_ENV=production
WORKDIR /app
COPY --from=builder --chown=node:node /app /app
USER node
EXPOSE 3000
CMD ["./node_modules/.bin/tsx", "index.ts"]

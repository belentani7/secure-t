# Multi-stage build for production
FROM node:22-alpine AS base
WORKDIR /app
ENV PNPM_HOME="/pnpm"
ENV PATH="${PNPM_HOME}:${PATH}"
RUN corepack enable && corepack prepare pnpm@9.0.0 --activate

FROM base AS builder
COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile
COPY . .
RUN pnpm build
RUN pnpm exec tsc index.ts --ignoreConfig --outDir dist/server --target ES2022 --module NodeNext --moduleResolution NodeNext --esModuleInterop --skipLibCheck

FROM base AS runner
WORKDIR /app
ENV NODE_ENV=production
COPY --from=builder --chown=node:node /app/dist ./dist
COPY --from=builder --chown=node:node /app/package.json ./
COPY --from=builder --chown=node:node /app/pnpm-lock.yaml ./
RUN pnpm install --prod --frozen-lockfile
USER node
EXPOSE 3000
CMD ["node", "dist/server/index.js"]

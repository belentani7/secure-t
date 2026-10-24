# Local demo server. The published learning campus uses GitHub Pages instead.
FROM node:22-alpine AS base
WORKDIR /app
ENV PNPM_HOME="/pnpm"
ENV PATH="${PNPM_HOME}:${PATH}"
RUN corepack enable && corepack prepare pnpm@11.25.0 --activate

FROM base AS builder
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
RUN pnpm install --frozen-lockfile --ignore-scripts
COPY . .
RUN pnpm typecheck && pnpm build

FROM base AS runner
ENV NODE_ENV=production
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/index.ts ./index.ts
COPY --from=builder /app/package.json /app/pnpm-lock.yaml /app/pnpm-workspace.yaml ./
RUN pnpm install --prod --frozen-lockfile --ignore-scripts
USER node
EXPOSE 3000
# Node 22.18+ supports erasable TypeScript syntax; tsx is a dev dependency.
CMD ["node", "index.ts"]

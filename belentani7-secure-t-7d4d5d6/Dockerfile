# Multi-stage build optimizado para producción con Node.js 22 Alpine
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
ENV PORT=3000

# Copiar artefactos necesarios para ejecución en producción
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/index.ts ./index.ts
COPY --from=builder /app/package.json /app/pnpm-lock.yaml /app/pnpm-workspace.yaml ./
RUN pnpm install --prod --frozen-lockfile --ignore-scripts

# Ejecutar bajo un usuario sin privilegios root por seguridad
USER node
EXPOSE 3000

CMD ["node", "index.ts"]
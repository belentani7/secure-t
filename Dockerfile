# secure T · campus AURUM
#
# Imagen de dos etapas: se compila el contenido y la web con todas las
# dependencias, y la imagen final sólo lleva lo necesario para servirla.
# El resultado pesa poco y no incluye código de desarrollo ni tests.

FROM node:22-alpine AS build
WORKDIR /repo

# Dependencias primero: si el material no cambia, la caché se reutiliza.
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY packages/shared/package.json packages/shared/
COPY packages/agent/package.json packages/agent/
COPY apps/web/package.json apps/web/
RUN corepack enable && corepack prepare pnpm@10 --activate && pnpm install --frozen-lockfile

# Código y contenido
COPY . .

# Material didáctico → catálogo + índice BM25 + digest (fuente única: campus/)
RUN pnpm content:all

# Compilación de la web AURUM (modo servidor: incluye /api/agent)
RUN pnpm --filter @secure-t/web build

FROM node:22-alpine AS runtime
WORKDIR /repo
ENV NODE_ENV=production PORT=3000 HOSTNAME=0.0.0.0

COPY --from=build /repo/node_modules ./node_modules
COPY --from=build /repo/apps/web ./apps/web
COPY --from=build /repo/packages ./packages
COPY --from=build /repo/campus ./campus
COPY --from=build /repo/conceptos ./conceptos
COPY --from=build /repo/package.json ./package.json

EXPOSE 3000
USER node

HEALTHCHECK --interval=30s --timeout=5s --start-period=20s \
  CMD node -e "fetch('http://127.0.0.1:3000/').then(r => process.exit(r.ok ? 0 : 1)).catch(() => process.exit(1))"

CMD ["pnpm", "--filter", "@secure-t/web", "start"]

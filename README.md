# secure T

[![CI Status](https://github.com/belentani7/secure-t/actions/workflows/ci.yml/badge.svg)](https://github.com/belentani7/secure-t/actions)
[![License: AGPL-3.0](https://img.shields.io/badge/license-AGPL--3.0--only-blue.svg)](LICENSE)
[![Node.js Version](https://img.shields.io/badge/node-22+-green.svg)](package.json)

**Universidad digital de ciberseguridad e inteligencia artificial**

## Campus en vivo

- Campus: https://secure-t.netlify.app/
- Matrícula anónima local (sin e-mail, token UUID en tu navegador): https://secure-t.netlify.app/enroll
- Espejo GitHub Pages (redirige al campus): https://belentani7.github.io/secure-t/

## Auditoría 2026-09-14 (full-ship)

Alcance: frontend + backend + seguridad + secretos + licencias. Gates en verde:
`tsc --noEmit` OK · `vitest` 35/35 · `pnpm build` OK · gitleaks (código + 72 commits) `no leaks found`.

Reparado (CRITICO+ALTO primero):
- Embudo: CTAs `Apply now` / `Create your profile` → ruta real `/enroll`.
- Catálogo único: la galería y el onboarding leen `academic/curriculum.ts`; `findLesson` acepta `course.code`.
- Backend: `requireValidToken` en rutas mutantes, enrollments self-only (`learnerId` = UUID del token), `PUT progress` reescrito con validación y rangos, `x-role` solo con `ALLOW_HEADER_ROLES=true` (deny-by-default), locales whitelist `es/pt/en`, tope 2000 chars en IA, `verifyCredential` honesto (formato offline, no autoritativo), `api/index.ts` apto para serverless.
- Frontend honesto: cockpit sin alumno inventado, stats marcadas `demo`, `ErrorBoundary` sin stack en prod.
- Deploy: `/api/* → 404` en Netlify (el backend Express no se despliega; frontend estático), headers HSTS/nosniff/frame-deny, Pages redirige al campus.
- Legal: `template.json` y `edu-engine` en AGPL-3.0-only; NOTICE sin claims de reúso literal (verificado: sin código vendorizado).

Límites conocidos: backend sin desplegar (a propósito; requiere Docker/VPS/PaaS), Portal con zonas demo, `ca` no cubierto en todo el frontend.

secure T es una plataforma educativa open source orientada a ciberseguridad, IA y formación técnica avanzada. Combina campus digital, laboratorios aislados, tutoría IA gobernada, evaluación por evidencia y credenciales verificables.

> **Descargo legal:** Esta aplicación NO afirma acreditación universitaria ni validez oficial de títulos. Las capacidades no implementadas están documentadas como pendientes en [IMPLEMENTATION_STATUS.md](docs/IMPLEMENTATION_STATUS.md).

---

## 💝 ¿Por qué secure T?

**Nace de la convicción de que la educación es el acto más generoso de compartir.**

Cuando alguien que amamos nos enseña algo, esa sabiduría merece ser transmitida. Lee [ABOUT.md](ABOUT.md) para entender la visión detrás de este proyecto.

**¿Es una plataforma real de cursos?** Sí. [VERIFICATION.md](VERIFICATION.md) detalla cada componente funcional.

---

## 🚀 Inicio rápido

### Requisitos
- Node.js 22+
- pnpm 10.4+
- Docker & Docker Compose (para servicios locales)
- PostgreSQL (via Docker recomendado)

### Setup

```bash
# Instalar dependencias
pnpm install

# Validar tipos y tests
pnpm check
pnpm test

# Levantar servicios locales (PostgreSQL, Redis, etc.)
docker compose -f infrastructure/docker-compose.yml up -d

# Configurar variables de entorno
cp .env.example .env

# Generar esquema BD con Drizzle
pnpm db:generate

# Desarrollo
pnpm dev

# Build para producción
pnpm build
pnpm start
```

La aplicación estará disponible en `http://localhost:3000`.

---

## 📚 Documentación

| Documento | Contenido |
|-----------|----------|
| [**ACADEMIC_MODEL.md**](docs/ACADEMIC_MODEL.md) | Modelo educativo, competencias y evaluación por evidencia |
| [**ARCHITECTURE.md**](docs/ARCHITECTURE.md) | Diseño modular, fronteras, y decisiones técnicas |
| [**AI_GOVERNANCE.md**](docs/AI_GOVERNANCE.md) | Governance de IA, permisos y auditoría |
| [**LAB_ARCHITECTURE.md**](docs/LAB_ARCHITECTURE.md) | Cyber range aislado y entornos de laboratorio |
| [**DEPLOYMENT.md**](docs/DEPLOYMENT.md) | Despliegue en Vercel, Docker, y configuración de producción |
| [**SECURITY.md**](docs/SECURITY.md) | Seguridad, privacidad y mitigación de riesgos |
| [**DECISIONS.md**](docs/DECISIONS.md) | Architecture Decision Records (ADRs) |
| [**ROADMAP.md**](docs/ROADMAP.md) | Mapa de ruta y próximas fases |
| [**IMPLEMENTATION_STATUS.md**](docs/IMPLEMENTATION_STATUS.md) | Estado de cada módulo y features pendientes |
| [**CURRICULUM.md**](docs/CURRICULUM.md) | Currículo propuesto y contenidos académicos |

---

## 📁 Estructura del Proyecto

```
secure-t/
├── client/              React 19 + Vite campus web
├── server/              Express API + AI Gateway
├── drizzle/             Esquema PostgreSQL y migraciones
├── ai/                  Routing, permisos, proveedores de modelos
├── academic/            Motor académico: cursos, competencias, evaluación
├── labs/                Cyber range: entornos aislados y desafíos
├── voice/               Síntesis de voz y consentimiento
├── rag/                 Recuperación de fuentes aprobadas
├── audit/               Eventos de auditoría sin secretos
├── notifications/       Contrato de tareas y estados terminales
├── tests/               Suites de testing (vitest)
├── infrastructure/      Docker Compose y configuración
├── docs/                Documentación completa
└── package.json         Workspaces y definición de proyecto
```

---

## 🏛️ Principios Fundamentales

- **Open source first**: Código abierto, evaluación continua de dependencias
- **Seguridad y privacidad por diseño**: Auditoría, RBAC, cero confianza
- **Estándares abiertos**: LTI, xAPI, verificación de credenciales
- **Separación de autoridades**: Academia desacoplada de tutoría IA
- **Mínimo privilegio**: Permisos granulares, validación en cada capa
- **Evidencia antes de mastery**: Evaluación observable, sin arbitra­riedad
- **Código de estudiantes aislado**: Sandboxing, sin ejecución en servidor principal

---

## 🔧 Tech Stack

| Capa | Tecnologías |
|------|------------|
| **Frontend** | React 19, Vite, TailwindCSS 4, Shadcn/ui, Recharts, Framer Motion |
| **Backend** | Express.js, Node.js 22, TypeScript 5.6 |
| **Database** | PostgreSQL, Drizzle ORM |
| **AI** | Groq API, Supabase Auth, voz (Kokoro/Chatterbox) |
| **DevOps** | Docker, Vercel, GitHub Actions |
| **Testing** | Vitest, TypeScript strict mode |

---

## 🔄 CI/CD

- **GitHub Actions**: Typecheck, tests y build en:
  - Push a `main`
  - Pull requests
  - Nightly schedule (3 AM UTC)
  - Manual dispatch

- **Vercel**: Despliegue automático configurado mediante [vercel.json](vercel.json)
  - Requiere conectar repositorio al equipo Vercel
  - Usa variables de entorno aseguradas en Vercel dashboard

---

## 🤝 Contribuciones

1. Fork el repositorio
2. Crea rama: `git checkout -b feature/tu-feature`
3. Commit: `git commit -am 'feat: descripción clara'`
4. Push: `git push origin feature/tu-feature`
5. Abre Pull Request con descripción de cambios

**Política de commits**: Sigue [Conventional Commits](https://www.conventionalcommits.org/)
- `feat:` nuevas features
- `fix:` correcciones
- `docs:` documentación
- `test:` tests
- `refactor:` refactoring
- `chore:` dependencias, CI/CD

---

## 📋 Estado del Proyecto

- ✅ Campus React/Vite + API Express
- ✅ Progreso de aprendizaje + tutoría básica
- ✅ CI/CD con GitHub Actions
- 🚧 PostgreSQL/Drizzle + autenticación RBAC
- 🚧 Laboratorios aislados (cyber range)
- 🚧 Evaluación por evidencia persistente
- 🚧 Credenciales verificables
- 🗓️ Voz sintética (Kokoro/Chatterbox)
- 🗓️ Interoperabilidad LTI

Ver [IMPLEMENTATION_STATUS.md](docs/IMPLEMENTATION_STATUS.md) para detalles completos.

---

## 📄 Licencia

Licenciado bajo [AGPL-3.0-only](LICENSE). 

Consulta [NOTICE-ATRIBUCIONES.md](NOTICE-ATRIBUCIONES.md) para créditos de componentes y librerías.

---

## 🆘 Soporte

- **Issues**: [GitHub Issues](https://github.com/belentani7/secure-t/issues)
- **Discussions**: [GitHub Discussions](https://github.com/belentani7/secure-t/discussions)
- **Documentación**: Ver carpeta [docs/](docs/)
- **Contacto**: belentani7studio@proton.me

---

## 🎯 Visión a Futuro

secure T busca convertirse en una alternativa real de universidad digital con:
- Currículo de 4 años acreditado
- Laboratorios en infraestructura aislada
- Comunidad de estudiantes y faculty
- Credenciales verificables en blockchain
- Integración con plataformas LMS estándar (LTI)
- Tutoría IA transparente y gobernada

Seguir roadmap completo en [ROADMAP.md](docs/ROADMAP.md).

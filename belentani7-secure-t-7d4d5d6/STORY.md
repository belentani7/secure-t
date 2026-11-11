# Secure T — Universidad Digital Soberana

## 1. Premisa
Universidad digital especializada en **Ciberseguridad e Inteligencia Artificial**. Educación práctica, sin barreras económicas, con credenciales verificables por hash (blockchain: PLANNED).

## 2. Intención
Democratizar la educación en ciberseguridad y IA. Formar profesionales listos para defenderse contra amenazas digitales y desarrollar IA responsable. Credenciales verificables por hash (anclaje blockchain: PLANNED).

## 3. Pilares educativos

| Pilar | Descripción | Duración |
|---|---|---|
| **Cursos** | Undergraduate programs | Variable |
| **Laboratorios** | Cyber Range hands-on | Práctico |
| **Certificaciones** | Hash-verified (blockchain: PLANNED) | Permanente |

## 4. Estructura académica

### Cursos Principales (4)
- Ciberseguridad Ofensiva
- Ciberseguridad Defensiva
- Inteligencia Artificial Aplicada
- Gobernanza y Compliance

### Programas Académicos (4 años)
- Año 1: Fundamentos
- Año 2: Especialización
- Año 3: Laboratorio práctico
- Año 4: Proyecto final + Certificación

### Laboratorios
- Cyber Range (entorno simulado de ataque)
- Máquinas virtuales vulnerables
- Desafíos progresivos

### Certificaciones
- Verificables por hash SHA-256 (VERIFIED)
- Anclaje en blockchain: PLANNED (fase 2)
- Shareable en LinkedIn
- Verificables por hash por cualquiera (sin depender de terceros)

## 5. Stack técnico
- **Frontend**: HTML5 + CSS3 + JavaScript vanilla
- **CDN**: Tailwind CSS (CDN version)
- **Icons**: Lucide (CDN version)
- **Deploy**: Static (python -m http.server)
- **Storage**: Archivos estáticos

## 6. Componentes principales
- Navigation (fixed)
- Hero section
- Courses grid
- Labs section
- Certifications showcase
- Footer

## 7. Funcionalidades actuales
✅ Landing trilingüe PT/ES/EN (PT por defecto) con pricing, FAQ y trust strip
✅ Campus PWA offline con hub de cursos
✅ Página LMS por curso: semanas renderizadas, quiz interactivo embebido,
   laboratorio, proyecto+examen, rúbrica, glosario, chuleta, recursos
✅ Progreso anónimo por token local (semanas, quiz, laboratorio, proyecto,
   examen con gating) — export/import JSON
✅ Credencial con sello SHA-256 generable y verificable sin servidor
✅ Búsqueda local en todo el material (49+ entradas)
✅ Quiz superado (≥70 %) se marca solo en el progreso
✅ Dark/Light theme toggle · responsive · reduced-motion

⚠️ Enroll/login: NO EXISTE (por diseño: acceso sin registro)
⚠️ Contenido docente PT/EN: PLANNED (ES es la fuente; ver campus/idiomas.md)
⚠️ Laboratorios cyber range en vivo: PLANNED (hay 4 labs guiados locales)

## 8. Tono
- Profesional, seguro, técnico
- Énfasis en "soberanía digital"
- Lenguaje directo y formal
- Valores: práctica, acceso, descentralización

## 9. Política de idiomas (regla fija del ecosistema)
Orden de prioridad: **Português → Español → English** (català como idioma
adicional del ecosistema). Aplica a cápsulas diarias, voces IA, listas de
recursos, menús y cualquier contenido multilingüe generado por eduforge.

## 10. Estado actual
VERIFIED — producto navegable de extremo a extremo: entrar → curso →
semanas → quiz → laboratorio → examen (gating) → credencial verificable.
Generación determinista (eduforge), tests de comportamiento y auditoría
automática de 14 secciones. Limitaciones declaradas: sin URLs en vivo
(deploys gated en secrets), contenido docente ES-only (PT/EN PLANNED).

## 11. Estructura de archivos
```
secure-t-university/
  index.html          ← Landing trilingüe (punto de entrada)
  /ui/                ← i18n (152 claves × PT/ES/EN)
  /campus/            ← GENERADO por eduforge (no editar a mano)
    cursos/<slug>/    ← página LMS + semanas + quiz + lab + rúbrica + examen
    progreso.html · credencial.html · buscar.html · idiomas.md
  /public/            ← robots + sitemap (rutas reales, __BASE_URL__)
  /tests/             ← tests de comportamiento
```

## 12. Variables de entorno
Ninguna requerida para versión actual (estática).
Para versión futura con backend:
- `API_ENDPOINT` → Backend URL
- `BLOCKCHAIN_API` → Para certificaciones
- `AUTH_PROVIDER` → OAuth/JWT

## 13. Ampliación futura
- Backend API (Node.js, Python)
- Database (usuario, progreso, certificaciones)
- Authentication (login/register)
- Course content management
- Lab provisioning system
- Blockchain integration (certificaciones)
- Community forum
- Analytics dashboard
- Mobile app

---

## DEPLOYMENT CHECKLIST

| Item | Status | Evidencia |
|---|---|---|
| HTML balanceado | VERIFIED | eduforge audit (sección HTML, parser propio) |
| CSS carga | VERIFIED | tokens.css + Tailwind CDN en landing; tokens.css en campus |
| JS válido | VERIFIED | node --check sobre i18n y scripts embebidos (audit sección JS) |
| Enlaces | VERIFIED | audit LINKS: todos los href + anclas resuelven |
| Responsive | PARTIAL | breakpoints móviles en landing y sidebar de curso; test manual pendiente |
| Performance | PARTIAL | páginas <150 KB, ≤3 CDN por página (audit PERFORMANCE); Lighthouse no ejecutado |
| Accesibilidad | PARTIAL | basics automatizados (lang, skip-link, focus-visible, reduced-motion, alt); revisión WCAG manual pendiente |
| Dev server | VERIFIED | python -m http.server 8080 |
| Producción | PLANNED | workflows listos pero gated en secrets; sin URLs en vivo |

## STATUS: READY WITH WARNINGS

El producto es navegable y verificable de extremo a extremo, con tests y
auditoría automática. NO es "production ready" hasta: configurar secrets de
deploy (URLs en vivo), traducir contenido docente PT/EN (PLANNED) y revisión
manual de accesibilidad/responsive.

---

## PUBLICACIÓN (PLANNED)

Al configurar los secrets, los workflows desplegarán a Vercel/Netlify/
Cloudflare. Reemplazar `__BASE_URL__` en `public/robots.txt` y
`public/sitemap.xml` por el dominio real. No anunciar URLs hasta verificar
que responden 200.

---

## CONCLUSIÓN

Secure T University es un proyecto educativo abierto (ciberseguridad + IA)
con generación determinista, evaluación por evidencia y credencial honesta
(hash verificable; blockchain PLANNED). Las limitaciones están declaradas
en `campus/idiomas.md` y en este checklist.

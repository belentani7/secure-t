# secure T

Instituto aberto de cibersegurança e inteligência artificial: quatro programas de
vinte semanas, gratuitos, **PT na interface**, currículo fonte em espanhol,
offline-first — e um convite discreto a **passar adiante**.

Em linha: <https://belentani7.github.io/secure-t/>

## Listão (o que já é real)

| Capacidade | Estado |
|---|---|
| 4 cursos × 20 semanas + quiz/lab/exame | publicado |
| Landing trilingue PT→ES→EN | publicado |
| Campus PT-first + PWA (`sw.js` v2) | publicado |
| Voz neural PT/ES/EN/CA (`edge-tts`, `campus/voces/`) | publicado |
| Credencial SHA-256 offline | publicado |
| Bíblia de termos (`ui/biblia.js`) + `conceptos/` | publicado |
| Onboarding PT `campus/comecar.html` | publicado |
| JSON-LD EducationalOrganization | publicado |
| Página `campus/passa-adiante.html` (nasceu do amor) | publicado |
| `llms.txt` para agentes | publicado |
| Blockchain / acreditação oficial | **PLANNED** (não inventado) |

## Que é este repositório

Um campus estático. A portada `index.html` (trilingue via `ui/i18n.js`)
liga aos quatro programas. O material vive em `campus/`: sem base de dados em
produção nem contas de utilizador. Há ainda uma camada SPA local (`client/`) e
um servidor opcional (`pnpm start`); nenhum dos dois vai para GitHub Pages.

| Programa | Carpeta |
|---|---|
| Ciberseguridad Ofensiva: Pensar como Atacante | `campus/cursos/ciber-ofensiva/` |
| Ciberseguridad Defensiva: Operar como SOC | `campus/cursos/ciber-defensiva/` |
| Inteligencia Artificial Aplicada y Segura | `campus/cursos/ia-aplicada-segura/` |
| Gobernanza y Compliance Digital | `campus/cursos/gobernanza-compliance/` |

Cada curso tiene veinte semanas con lectura, practica guiada y un caso real, mas
`quiz.json` (16 items), `laboratorio.md`, `rubrica.md`, `glosario.md`, `chuleta.md`,
`examen.md` y `syllabus.md`. El hub incluye rutas profesionales honestas
(`campus/rutas.html`), centro de amenazas, credencial SHA-256 offline y busqueda local.

## Privacidad por diseno

No hay cuenta, no hay correo y no hay seguimiento. El progreso se guarda en el
`localStorage` del navegador con un token anonimo que nunca se envia a ningun sitio.

## Tests

Los tests del campus se ejecutan con **pytest** sobre los artefactos publicados,
no sobre el motor:

```bash
pip install pytest
python -m pytest -q tests/
```

`tests/test_campus.py` valida el esquema de los quizzes (>=12 items), la coherencia
de la evaluacion, la estructura de las paginas de curso, los enlaces reales de la
portada, el SEO minimo, i18n, y que el workflow de Pages no lleve tokens personales.
`tests/test_forge_smoke.py` cubre el arranque del motor educativo.

La capa SPA y los modulos de dominio (gobernanza de agentes, RBAC, auditoria,
curriculo, notificaciones) se validan con **vitest** y **tsc**:

```bash
pnpm install
pnpm test         # gobernanza, contratos, curriculo, notificaciones
pnpm typecheck    # tsc --noEmit
pnpm build        # vite build -> dist/public
```

## CI

El workflow vive en `.github/workflows/ci.yml` (no en la raiz: GitHub solo ejecuta
los que estan en esa carpeta). Ejecuta pytest, valida el JSON del campus, pasa los
tests del motor educativo y de la capa SPA (vitest + typecheck) y aplica
**gitleaks** sobre el historial completo para que ningun secreto vuelva a entrar.

## Despliegue

Dos destinos, una sola fuente:

- **GitHub Pages** via `.github/workflows/pages.yml`, que publica
  `index.html`, `404.html`, `campus/`, `ui/`, `conceptos/`, `STORY.md`,
  `.well-known/` y `open-data/`. Antes de subir, comprueba que no haya secretos.
- **Netlify**, con `publish = "public"`. Nunca la raiz del repositorio: eso dejaria
  accesibles por URL los scripts, los tests y el material de trabajo.

## Motor educativo (eduforge)

`lib/edu-engine/` contiene el motor que genera y valida el curriculo. Tiene tests
propios (`lib/edu-engine/tests/`), ejecutados por el CI del repositorio: el
workflow anidado que tenia en su carpeta nunca corrio, porque GitHub solo lee
`.github/workflows/` de la raiz. La carpeta `audit/` guarda
los informes de auditoria del propio repositorio: que se reviso, que se encontro y
que quedo pendiente.

## Que NO esta

Esta seccion existe para que nadie confunda lo publicado con lo deseado.

| Elemento | Estado |
|---|---|
| Campus estatico (4 cursos, 20 semanas) | publicado |
| Landing trilingue + SEO canonico secure-t | publicado |
| Quizzes 16 items/curso + LMS | publicado |
| Rutas profesionales + mapa curricular | publicado |
| Tests con pytest | publicado, en CI |
| Tests con vitest (capa SPA y dominio) | restaurados, en CI |
| Escaneo de secretos en CI | publicado |
| Capa SPA React + servidor local (`pnpm start`) | restaurada en el repo; no se publica en Pages |
| Traduccion PT y EN del contenido docente | **PLANNED** |
| Catala del contenido docente | **PLANNED** |
| Backend con base de datos | retirado; el campus no lo necesita |
| Credenciales verificables emitidas (hash offline) | publicado (SHA-256 local) |
| Anclaje blockchain de credenciales | **PLANNED** |

La landing declara el estado real de idiomas en `campus/idiomas.md`: nada se marca
como traducido sin estarlo.

## Licencia

MIT para el codigo. El material didactico cita sus fuentes en cada semana.

---

## Parte del indice educativo

Esta plataforma forma parte del conjunto educativo de **Belentani / NOIACORE**:
formacion gratuita y abierta. El indice completo vive en el nodo central:

**<https://github.com/belentani7/open-school/blob/main/INDICE-EDUCATIVO.md>**

| Plataforma | Que ensena | Enlace |
|---|---|---|
| Open School | Instituto digital universal | https://open-school-gamma.vercel.app |
| ManosAbiertas | IA y ofimatica para recien llegados | https://belentani7.github.io/ManosAbiertas/ |
| WILLIAMSCHOOL | Escuela comunitaria (curriculo Nepal) | https://williamschool.vercel.app |
| UX Academy | Diseno UX/Producto, trilingue | https://ux-academy-professional.vercel.app |
| secure T | Ciberseguridad e IA aplicada | https://belentani7.github.io/secure-t/ |

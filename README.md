# secure T

Instituto abierto de ciberseguridad e inteligencia artificial: cuatro programas de
veinte semanas, gratuitos, en espanol y funcionales sin conexion.

En linea: <https://belentani7.github.io/secure-t/>

## Que es este repositorio

Un campus estatico. La portada `index.html` enlaza los cuatro programas y todo el
material vive en `campus/`: sin base de datos en produccion ni cuentas de usuario,
se abre desde el disco. El repositorio contiene ademas una capa SPA local
(`client/`, React + Vite) y un servidor estatico opcional con API de demostracion
(`pnpm start`); ninguna de las dos se publica en GitHub Pages.

| Programa | Carpeta |
|---|---|
| Ciberseguridad Ofensiva: Pensar como Atacante | `campus/cursos/ciber-ofensiva/` |
| Ciberseguridad Defensiva: Operar como SOC | `campus/cursos/ciber-defensiva/` |
| Inteligencia Artificial Aplicada y Segura | `campus/cursos/ia-aplicada-segura/` |
| Gobernanza y Compliance Digital | `campus/cursos/gobernanza-compliance/` |

Cada curso tiene veinte semanas con lectura, practica guiada y un caso real, mas
`quiz.json`, `laboratorio.md`, `rubrica.md`, `glosario.md`, `chuleta.md`, `examen.md`
y `syllabus.md`.

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

`tests/test_campus.py` valida el esquema de los quizzes, la coherencia de la
evaluacion, la estructura de las paginas de curso, los enlaces reales de la portada,
el SEO minimo, y que el workflow de Pages no lleve tokens personales.
`tests/test_forge_smoke.py` cubre el arranque del motor educativo.

La capa SPA y los modulos de dominio (gobernanza de agentes, RBAC, auditoria,
curriculo, notificaciones) se validan con **vitest** y **tsc**:

```bash
pnpm install
pnpm test         # 22 tests: gobernanza, contratos, curriculo, notificaciones
pnpm typecheck    # tsc --noEmit
pnpm build        # vite build -> dist/public
```

## CI

`.github/workflows/ci.yml` instala dependencias fijadas, valida tipos y ejecuta
los tests y la compilacion de la SPA local. Gitleaks comprueba el codigo actual
sin imprimir valores secretos; este gate no certifica el historial completo.
`campus-publication.yml` ejecuta pytest, el motor educativo y las pruebas offline,
ensambla el campus y prueba los cuatro quizzes y el progreso en Chromium.

## Despliegue

Dos destinos, una sola fuente:

- **GitHub Pages** via `.github/workflows/pages.yml`, que publica unicamente
  el campus completo con `python3 scripts/build_site.py --destination _site`.
  Antes de subir, comprueba que no
  haya secretos en lo que va a publicarse.
- **Netlify**, con `publish = "site-dist"` y el mismo ensamblador. Nunca la raiz del repositorio: eso dejaria
  accesibles por URL los scripts, los tests y el material de trabajo.

El ensamblador usa la portada y los cursos vigentes de la raiz, incluye conceptos,
recursos de voz y metadatos publicos, y comprueba sus referencias HTML locales.
No publica la copia incompleta de `public/campus/`. Si una comprobacion falla,
conserva el artefacto anterior. Para probar exactamente la entrega:

```bash
python3 scripts/build_site.py
python3 -m http.server 8000 --directory site-dist
```

## Estación de prácticas (Secure T Workstation)

El laboratorio **ya incluido en el campus estático** vive en `campus/workstation/`.
Ofrece un terminal de comandos estrictamente simulados (`help`, `ls`, `cat`,
`grep`, `head`, `timeline`, `case`), seis casos interdisciplinarios (SOC, cloud, IA segura y privacidad) con datos sintéticos, una
guía de análisis y un cuaderno de evidencias local con exportación e importación
JSON. No abre sockets, no ejecuta código del alumnado, no consulta APIs y no
emite certificados. Los casos se autoevalúan solo en estructura y decisión
inicial; la calidad del análisis libre requiere revisión humana.

El enlace está en `campus/index.html` y `campus/academia/index.html`. La
construcción estática copia el módulo completo y valida los enlaces.

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
| Tests con pytest | publicado, en CI |
| Tests con vitest (capa SPA y dominio) | restaurados, en CI |
| Escaneo de secretos en CI | publicado |
| Capa SPA React + servidor local (`pnpm start`) | restaurada en el repo; no se publica en Pages |
| Traduccion PT y EN del contenido docente | **PLANNED** |
| Catala del contenido docente | **PLANNED** |
| Backend con base de datos | retirado; el campus no lo necesita |
| Credenciales verificables emitidas | **PLANNED** |

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
| Aprende Brasil | Educacion para Brasil | https://aprende-brasil.vercel.app/ |
| Lingua Aberta | Idiomas, progresion CEFR | https://belentani7.github.io/lingua-aberta-empresa/ |
| Cruzando el Charco | Acogida y arraigo | https://belentani7.github.io/Cruzando-el-charco/ |
| secure-t | Ciberseguridad e IA | https://belentani7.github.io/secure-t/ |

**PT > ES > EN > CA.** Gratuito, accesible (WCAG) y conectado.

## Mission Control — entrenamiento SOC interactivo

**Implementado en** `campus/workstation/mission.html`, accesible desde el PC de alumnos, campus y academia.
Seis investigaciones con 24 decisiones guiadas, 48 tarjetas de recuerdo activo y programación de repaso,
cuaderno de evidencia (hechos, hipótesis y verificación autorizada), filtros, progreso local, exportación/importación
JSON validado, CSS accesible/responsive y caché offline del campus. No añade repositorios, cuenta de usuario,
telemetría, shell real, servicios externos ni credenciales académicas. Los escenarios son sintéticos.

**Normativa de referencia:** NIST SP 800-61 Rev. 3 (2025), OWASP LLM01:2025 y RGPD, art. 5.
**Comprobación:** `node --test tests/mission-control.test.cjs` y
`node tests/browser-mission.cjs` dentro del entorno Playwright de la CI.
Los resultados de una autoevaluación guardada por el propio navegador **no constituyen acreditación**.


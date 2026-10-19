# secure T

Instituto abierto de ciberseguridad e inteligencia artificial: cuatro programas de
veinte semanas, gratuitos, en espanol y funcionales sin conexion.

URL prevista para GitHub Pages: <https://belentani7.github.io/secure-t/> (no se confirma como activa).
La publicacion desde un repositorio privado requiere un plan de GitHub compatible;
no se cambia la visibilidad del codigo para habilitar Pages.


## Campus digital de cinco años (fase de desarrollo)

- **Entrada principal:** `campus/academia/index.html` — interfaz con **portugués de Brasil por defecto**, traducciones de navegación, materias y lecciones al español y al inglés.
- **Mapa académico:** 5 años, 10 semestres, 60 asignaturas y **240 unidades planificadas**, en ciberseguridad, desarrollo web e idiomas.
- **Contenido redactado y utilizable actualmente:** **96 unidades de los cuatro primeros semestres**, con explicación original y ejercicio específico por unidad en PT/ES/EN, incluidos los cambios `lesson-content.js`, `lesson-content-2.js` y `lesson-content-3.js` y `lesson-content-4.js`. **Las otras 144 son temarios pendientes de desarrollar, revisar y evaluar**; no presentarlas como lecciones realizadas.
- **Biblioteca:** fuentes externas y clases largas atribuidas, sin copiar obras ni prometer contenidos de terceros bajo licencia Secure-T.
- **Laboratorios funcionales:** simulación SOC con eventos ficticios, interfaz HTML/CSS aislada y **comparación SHA-256 mediante Web Crypto local**. No se escanean dispositivos ajenos ni se suben textos.
- **Tutor:** orientación curricular interactiva local y preguntas formativas; lectura de voz y dictado con consentimiento y capacidades del navegador. El modelo lingüístico local es experimental y opcional. No existe IA remota gratuita universal ni corrección institucional.
- **Repaso:** 96 tarjetas de evocación espaciada, almacenamiento únicamente en el navegador, sin notas oficiales.
- **Autoevaluación práctica:** 24 preguntas originales de opción múltiple, una por asignatura de los primeros cuatro semestres, localizadas en PT/ES/EN. El navegador muestra explicación, no emite notas oficiales ni almacena respuestas.
- **Portabilidad privada:** exportación/importación validada de notas, evidencias y calendario de repaso; borrado local explícito que conserva la preferencia del idioma. Los escritos locales no deben contener información sensible.

- **Fusos:** Rio de Janeiro (`America/Sao_Paulo`), Barcelona (`Europe/Madrid`) y Dublin (`Europe/Dublin`); utilizan `Intl.DateTimeFormat` para cambios estacionales.
- **Origen humano:** la página “Sobre” reconoce discretamente que la idea nació inspirada por el amor, sin atribuirse a terceros ni exponer identidades.
- **Acreditación:** Secure-T sigue siendo un proyecto educativo independiente, **no una universidad oficialmente acreditada** ni un emisor de títulos académicos.
- **Revisión editorial:** las 96 lecciones son materiales introductorios escritos, pendientes de revisión docente externa; aún no equivalen a 5 años completos de docencia.

Validación puntual ejecutada: 96 identificadores pertenecen al mapa de 240, sus seis campos de lectura y actividad PT/ES/EN están presentes, el repaso local inicia como `1/96`, acepta autoevaluación y permite cambio de idioma; ejecución completa de CI/Playwright pendiente. No fusionar ni declarar producción validada por estas pruebas aisladas.

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

- **GitHub Pages** via `.github/workflows/pages.yml`, preparado para publicar unicamente
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
| Campus estatico (4 cursos, 20 semanas) | Implementado en codigo; publicacion externa no verificada |
| Tests con pytest | Configurados en CI; ultima ejecucion no valida |
| Tests con vitest (capa SPA y dominio) | Configurados; ejecucion verde pendiente |
| Escaneo de secretos en CI | Configurado; claves historicas requieren revocacion externa (issue #6) |
| Capa SPA React + servidor local (`pnpm start`) | restaurada en el repo; no se publica en Pages |
| Traduccion PT y EN del contenido docente | **PLANNED** |
| Catala del contenido docente | **PLANNED** |
| Backend con base de datos | retirado; el campus no lo necesita |
| Constancias SHA-256 locales | Integridad autocontenida, sin firma de emisor |
| Credenciales institucionales verificables | **PLANNED** |

La landing declara el estado real de idiomas en `campus/idiomas.md`: nada se marca
como traducido sin estarlo.

## API opcional y tutor IA

`pnpm start` arranca el servidor Express de demostración. Las rutas
`/api/catalog` y `/api/progress` son datos demo, **no** registros
académicos autenticados ni persistencia real. En producción, el tutor
`/api/tutor` permanece deshabilitado (HTTP 503) sin
`SECURE_T_TUTOR_API_KEY`. Si se configura esta clave en el **servidor**,
cada petición debe aportar `x-secure-t-key`; existe además un límite
de diez solicitudes por minuto por IP. **No incorporar esa clave en
código JavaScript del cliente**: para habilitarlo a usuarios finales se
necesita sesión segura, autorización server-side y protección ante
abuso. Ollama se configura con `OLLAMA_URL` y `OLLAMA_MODEL`; no se
publica ni se descarga un modelo automáticamente.

`node --test tests/api-security.test.mjs` verifica las restricciones de
producción sobre el servidor real una vez instaladas las dependencias.

## Contenedores

`Dockerfile` compila la SPA/API local de Secure T con Node 22 y ejecuta el
servicio como usuario no privilegiado. `docker-compose.yml` solo sirve para
desarrollo local: escucha en 127.0.0.1 y exige `POSTGRES_PASSWORD`,
`MINIO_ROOT_USER` y `MINIO_ROOT_PASSWORD` mediante un archivo `.env` no
versionado. `.env.example` contiene los nombres, nunca valores reales.
La API de ejemplo no es un backend académico con autenticación productiva.

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

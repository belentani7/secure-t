# Índice educativo — Belentani / NOIACORE

Todas las plataformas educativas del ecosistema, con su material real y su estado.
Formación **gratuita y abierta** para quien la necesita: migrantes, comunidades sin recursos,
personas que se reciclan.

**Regla:** ninguna plataforma educativa es una isla. Todas enlazan este índice.

---

## Plataformas publicadas

| Plataforma | Qué enseña | Enlace |
|---|---|---|
| **Open School** | Instituto digital universal | [open-school](https://open-school-gamma.vercel.app) |
| **ManosAbiertas** | IA y ofimática para recién llegados | [ManosAbiertas](https://belentani7.github.io/ManosAbiertas/) |
| **WILLIAMSCHOOL** | Escuela comunitaria (currículo Nepal) | [williamschool](https://williamschool.vercel.app) |
| **UX Academy** | Diseño UX/Producto, trilingüe | [ux-academy](https://ux-academy-professional.vercel.app) |
| **Aprende Brasil** | Educación para Brasil | [aprende-brasil](https://aprende-brasil.vercel.app/) |
| **Lingua Aberta** | Idiomas, progresión CEFR | [lingua-aberta](https://belentani7.github.io/lingua-aberta-empresa/) |
| **Cruzando el Charco** | Acogida y arraigo | [Cruzando el Charco](https://belentani7.github.io/Cruzando-el-charco/) |
| **secure-t** | Ciberseguridad e IA | [secure-t](https://belentani7.github.io/secure-t/) |

---

## Material real, curso por curso

### Open School — `campus/`

| Carpeta | Contenido |
|---|---|
| `cursos/ciberseguridad-5-anios/` | Itinerario completo de ciberseguridad a 5 años |
| `capsulas/` | **22 cápsulas diarias** (2026-09-08 a 2026-09-29) |
| `voces/` | Bienvenidas en audio en **4 idiomas**: CA, EN, ES, PT |
| `agente/` | Agente de acompañamiento del alumno |
| `open-data/` | Datos abiertos + `topics.json` |

Es una **PWA offline-first** (`sw.js`, `manifest.webmanifest`): funciona sin conexión, que es
justo lo que necesita alguien con datos móviles limitados.

### ManosAbiertas — `campus/` + `apps/`

Mismo campus que Open School, más:

| Carpeta | Contenido |
|---|---|
| `campus/juegos/` | **5 juegos educativos**: catalán, falsos amigos, matemáticas, súper quiz, trilingüe |
| `docs/` | Documentación del proyecto |
| `open-data/` | Pack de datos abiertos |
| `prisma/` | Base de datos |

Los juegos cubren **matemáticas, idiomas y cultura** en varios idiomas.

### UX Academy — `materials/`

Programa completo de 12 módulos, de la investigación al portfolio:

1. Plan de investigación
2. Guía de entrevistas
3. Tablero de síntesis
4. Persona y journey
5. Flujo de usuario y wireframe
6. Test de usabilidad
7. Especificación de design system
8. Brief de proyecto final
9. Esquema de caso de estudio
10. Checklist de evidencias de portfolio
11. Presentación de portfolio
12. Guía de reflexión

Más `fcc-import/` y `projects/`. **Es el programa más completo del conjunto.**

### Aprende Brasil — `data/`

Base de datos propia (`aprende.db`) y datos abiertos.

### Cruzando el Charco — `data/` + `docs/`

Guías prácticas de acogida: papeles, salud, vivienda y comunidad para hombres migrantes
LGBT+ en L'Hospitalet y Barcelona. `news.json` con actualidad.

---

## Datos abiertos compartidos

`edu-open-data/portals/` es el motor de enriquecimiento con datos abiertos, y ya cubre
**12 portales**:

```
aprende-brasil          lingua-aberta           open-school
cruzando-el-charco      lingua-aberta-empresa   secure-t
linguaforge             manos-abiertas-2026     secure-t-university
manosabiertas           ux-academy              williamschool
```

Los datos se documentan y se atribuyen en `NOTICE-ATRIBUCIONES.md` donde existe.

---

## Plataformas con material listo, sin web publicada

| Proyecto | Material |
|---|---|
| **manos-abiertas** | Plataforma PT para brasileños, `contenido/curriculum-interno/`, corpus ES-PT |
| **manos-abiertas-docs** | Currículo y recursos, pack `open-data/` |
| **william-recursos-educativos** | Portal de recursos educativos en español |
| **william.game** | Juego educativo móvil: minijuegos de inglés y español |
| **edu-open-data** | Motor de datos abiertos para 12 portales |
| **mentorai-windows** | Profesor local de informática, con base de conocimiento |
| **linguaforge-v2** | Aprendizaje de lenguas CEFR, open source |
| **niche-lang-app** | App móvil de aprendizaje de idiomas |

Estas tienen material real dentro; lo que les falta es la **puerta** (web publicada).

---

## Líneas de trabajo

| Línea | Plataformas |
|---|---|
| Alfabetización digital | ManosAbiertas, Open School |
| Idiomas | Lingua Aberta, linguaforge, Aprende Brasil, niche-lang |
| Diseño y producto | UX Academy |
| Tecnología y seguridad | secure-t, MentorAI |
| Derechos y acogida | Cruzando el Charco |
| Infancia y comunidad | WILLIAMSCHOOL, william.game, william-recursos |

---

## Idiomas

**PT > ES > EN > CA.** El orden no es decorativo: buena parte del público es lusohablante, y
las voces de bienvenida ya existen en los cuatro idiomas.

---

## Principios

1. **Gratuito.** Sin registro, sin coste, sin barrera.
2. **Accesible.** WCAG no es opcional. Funciona sin conexión donde se pueda.
3. **Real.** Se enseña lo que sirve para encontrar trabajo o resolver un problema hoy.
4. **Conectado.** Ninguna plataforma educativa queda aislada.

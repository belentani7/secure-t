# secure T

Instituto abierto de ciberseguridad e inteligencia artificial: cuatro programas de
veinte semanas, gratuitos, en espanol y funcionales sin conexion.

En linea: <https://belentani7.github.io/secure-t/>

## Que es este repositorio

Un campus estatico. La portada `index.html` enlaza los cuatro programas y todo el
material vive en `campus/`: no hay servidor de aplicaciones, no hay base de datos en
produccion y no hay cuentas de usuario. Se puede abrir desde el disco.

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

Los tests se ejecutan con **pytest** sobre los artefactos publicados, no sobre el motor:

```bash
pip install pytest
python -m pytest -q tests/
```

`tests/test_campus.py` valida el esquema de los quizzes, la coherencia de la
evaluacion, la estructura de las paginas de curso, los enlaces reales de la portada,
el SEO minimo, y que el workflow de Pages no lleve tokens personales.
`tests/test_forge_smoke.py` cubre el arranque del motor educativo.

## CI

El workflow vive en `.github/workflows/ci.yml` (no en la raiz: GitHub solo ejecuta
los que estan en esa carpeta). Ejecuta pytest, valida el JSON del campus y pasa
**gitleaks** sobre el historial completo para que ningun secreto vuelva a entrar.

## Despliegue

Dos destinos, una sola fuente:

- **GitHub Pages** via `.github/workflows/pages.yml`, que publica unicamente
  `index.html`, `404.html`, `campus/` y `ui/`. Antes de subir, comprueba que no
  haya secretos en lo que va a publicarse.
- **Netlify**, con `publish = "public"`. Nunca la raiz del repositorio: eso dejaria
  accesibles por URL los scripts, los tests y el material de trabajo.

## Motor educativo (eduforge)

`lib/edu-engine/` contiene el motor que genera y valida el curriculo. Tiene tests
propios (`lib/edu-engine/tests/`) y su propio workflow. La carpeta `audit/` guarda
los informes de auditoria del propio repositorio: que se reviso, que se encontro y
que quedo pendiente.

## Que NO esta

Esta seccion existe para que nadie confunda lo publicado con lo deseado.

| Elemento | Estado |
|---|---|
| Campus estatico (4 cursos, 20 semanas) | publicado |
| Tests con pytest | publicado, en CI |
| Escaneo de secretos en CI | publicado |
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

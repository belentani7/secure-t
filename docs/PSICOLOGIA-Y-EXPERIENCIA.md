# Psicología y experiencia — de la evidencia al token

> Por qué AURUM se ve y se comporta como se ve. Cada afirmación de este documento
> termina en un número que está en el código y en un test que lo exige. Si algo no
> se ha podido comprobar, se dice aquí mismo.

La petición de partida fue una **obra de arte** y una **experiencia grande**: que el
campus no se sienta como una web más, sino como un lugar. Ese objetivo, mal
entendido, se convierte en adornos: animaciones que marean, degradados que tapan
contenido, botones que brillan en todas partes y no se ve ninguno. Este documento
es la respuesta de ingeniería a esa petición: el efecto emocional se construye con
decisiones medibles, no con gusto.

## 1. Método

```
hallazgo publicado  →  token tipado (packages/ui/src/psychology.ts)
                    →  aplicación real (apps/web/src/app/globals.css, componentes)
                    →  test que lo exige (packages/ui/tests/psychology.test.ts, tests/contracts.test.ts)
```

Regla de la casa: **un principio que no se puede violar por accidente no está
aplicado**. Por eso los números no viven en comentarios ni en la memoria de quien
escribe CSS, sino en constantes exportadas que el resto del proyecto importa, y
por eso el test comprueba también contra el CSS real (`globals.css`) y el árbol de
componentes, no sólo contra sí mismo.

## 2. Tabla de trazabilidad

| Principio | Fuente | Token en código | Dónde se aplica | Test |
| --- | --- | --- | --- | --- |
| Menos saturación ⇒ más estatus percibido (inflexión 20–30 % de saturación); el efecto mide color **de producto** y se invierte si la marca se presenta como innovadora | Zhou, Xiao, Yoon y Zhu, *The Color of Status*, **JCR** (2025), doi `10.1093/jcr/ucaf029` | `BALANCE` (60·30·10), superficies `--aurum-glass` de baja croma, `--color-gold` reservado a función | `globals.css` (bloque `PSICOLOGÍA APLICADA`), `BALANCE.accent.share = 10` | `psychology.test.ts` · «balance de color 60·30·10»; `arte-visual`/contraste en `audit:site` |
| Escala modular y jerarquía legible sin pensar | práctica tipográfica establecida (escala de tercera menor) | `TYPE_SCALE` (`ratio: 1.25`) | tamaños `--psy-*` del CSS | `psychology.test.ts` · «la escala es modular y creciente» |
| Medida de lectura cómoda: 45–75 caracteres; por encima de 80 el ojo pierde el inicio de línea | tradición tipográfica (Bringhurst, *The Elements of Typographic Style*) y literatura de lectura en pantalla | `MEASURE` (`bodyCh: 68`, `maxCh: 80`) | `--psy-measure-body: 68ch` | `psychology.test.ts` · `clampMeasure` |
| Ritmo vertical regular (8 px) y proximidad (Gestalt) | principios de la Gestalt; rejilla de 8 px | `SPACING` (`unitPx: 8`) | utilidades de espacio del CSS | `psychology.test.ts` · `--psy-target-gap` |
| Ley de Hick: el tiempo de decisión crece con el número de opciones | Hick (1952); Hyman (1953) | `CHUNKING.maxPrimary = 6`, `hickTime(n)` | cabecera: 6 primarios + `<details class="nav-more">` | `psychology.test.ts` · «la navegación respeta el máximo primario» |
| Ley de Miller / chunking: 4–5 elementos visuales, no 7 | Miller (1956) | `CHUNKING.maxVisibleFilters = 8`, `maxFooterLinks = 14` | filtros por bloque, pie corto | `psychology.test.ts` · «Miller se respeta» |
| Efecto Von Restorff: lo distinto se recuerda; si todo grita, nada se oye | Von Restorff (1933) | `ATTENTION.maxAccents = 1` | un solo botón dorado por vista | `psychology.test.ts` · «un solo acento por vista» |
| Ley de Fitts: objetivos grandes y cercanos se aciertan antes y con menos error | Fitts (1954) | `TARGETS.minPx = 44`, `gapPx = 8`, `fittsOk()` | `--psy-target`, separación entre botones | `psychology.test.ts` · «objetivos alcanzables» |
| Norma: 24×24 px CSS es el mínimo **legal** de WCAG 2.2 SC 2.5.8 (AA); 44×44 es SC 2.5.5 (AAA, WCAG 2.1) y guía de plataforma | W3C WCAG 2.2 / 2.1 | `TARGETS.wcagMinimumPx = 24` frente a `minPx = 44` | ambos citados en el código | «no confunde mínimos normativos» |
| Efecto estético-usabilidad: lo que se siente bien se percibe como más fácil | Kurosu y Kashimura (1995); Tractinsky (1997) | — (política de diseño, no token) | acabado del sistema AURUM | justificado aquí; el contraste sí se verifica |
| Regla del pico-final: se recuerda el pico y el final, no la media | Kahneman y colaboradores (1993, 1996) | `PEAK_END`, `RIO` | horizonte de Río arriba y abajo de la portada | `psychology.test.ts` · «está en la portada, abre y cierra» |
| Vestibular: el parallax y el desplazamiento grande son los desencadenantes típicos; WCAG 2.3.3 exige poder desactivarlo | W3C WCAG 2.3.3 *Animation from Interactions* | `MOTION` (`maxRevealShift: 12`, `maxHoverShift: 2`, `maxScale: 1.02`), `forbidden[]` | `html[data-psy="on"] .psy-reveal`, promesa `no-preference` | `psychology.test.ts` · «movimiento respetuoso» y «todo lo animado vive dentro de `prefers-reduced-motion`» |
| Transiciones de página sin coste de red | especificación CSS View Transitions (línea base disponible) | `DURATION.calmMs = 320` | `@view-transition { navigation: auto }` + `psy-cross-fade` | `psychology.test.ts` · «usan View Transitions nativas» |

## 3. Color: por qué negro y dorado, y por qué el dorado ocupa tan poco

El campus es un lugar donde se estudia durante **cinco años**. Eso descarta dos
extremos: una interfaz brillante y saturada que agote la vista en sesiones largas,
y una mancha oscura plana en la que no se encuentre nada. La regla 60·30·10 resuelve
el reparto: el negro neutro domina, las superficies de cristal separan el contenido
del vacío **sin convertirlo en cajas opacas**, y el dorado queda para lo que pide una
decisión.

La evidencia que sostiene la parte de «sofisticación» es Zhou y colaboradores (2025,
*Journal of Consumer Research*): menos saturación eleva el estatus percibido, con un
punto de inflexión entre el 20 % y el 30 % de saturación, y con un mediador claro —
la percepción de continuidad histórica—. Tres precisiones que se respetan en el código
y que conviene no barrer bajo la alfombra:

1. Aquel trabajo mide color **de producto** (un reloj, un bolso), no acentos de
   interfaz. La transposición que hacemos —superficies de baja croma y un único acento
   brillante— va en la misma dirección, pero **no es un resultado transferido por
   derecho**, y así se declara en el propio `psychology.ts`.
2. El efecto se **invierte** cuando la marca se presenta como innovadora. Aquí el
   dorado no se usa para reclamar estatus: señala función (la acción, el dato vivo, el
   estado). El campus, abierto y gratuito, no compite por estatus de lujo.
3. La accesibilidad manda: ningún texto depende del dorado para su contraste. El
   acento es decoración y refuerzo; el contraste vive en la paleta de texto, y se
   verifica en cada página.

## 4. Tipografía: el héroe invisible

Dos decisiones que nadie ve —el tamaño del texto y la anchura de la línea— deciden
si alguien aguanta dos horas de estudio o veinte minutos. La escala es modular (razón
1,25), lo que produce jerarquía sin tamaños arbitrarios, y la medida de lectura se
limita a 68 caracteres (`clampMeasure()` impide salirse de 45–80). Las medidas están
en `ch`, no en píxeles, para que sigan funcionando cuando alguien cambie la fuente o
el tamaño del sistema —que es exactamente lo que hacen las personas con fatiga visual,
y son quienes más van a usar esto—.

## 5. Decisión: se elige menos veces

La cabecera tenía demasiados destinos con el mismo peso. Se partió en dos escalones
—**seis destinos primarios** y un grupo plegado en `<details>` nativo— por dos motivos
que se refuerzan: la ley de Hick (el tiempo de decisión crece con el número de
opciones) y la de Miller (la memoria de trabajo sostiene cuatro o cinco elementos
visuales de un vistazo, no siete). El detalle técnico que hace esto correcto y no
cosmético: `<details>` es HTML estándar, funciona **sin JavaScript**, es accesible por
teclado y aparece en el export estático. Nada quedó inaccesible: siete secciones
siguen a un clic, y hay un test que lo comprueba.

## 6. Movimiento: pequeño, lento y desactivable

El movimiento excesivo no es una cuestión de gusto: el trastorno vestibular es físico
y WCAG 2.3.3 exige que lo disparado por interacción se pueda desactivar. Las reglas
de la casa, verificadas por test:

- El desplazamiento al aparecer es de **12 px** como máximo y la elevación al pasar,
  de **2 px**; nunca se animan bloques grandes de texto.
- Las microinteracciones duran entre **90 y 400 ms**; lo ambiental, **minutos**.
- Nada que se pueda leer como parallax, zoom de página ni rotación (lista `forbidden`).
- **Sin rebote**: la elasticidad comunica juego, no rigor.
- Todo lo animado vive dentro de `prefers-reduced-motion: no-preference`, con la red
  de seguridad `reduce` que apaga duraciones. El navegador no interpreta el movimiento
  como movimiento: sólo opacidad, color y desplazamientos de un dígito.
- El **reveal por aparición no existe sin JavaScript**. La marca `html[data-psy="on"]`
  la añade un componente cliente **después** de comprobar `IntersectionObserver` y la
  preferencia del sistema. Si el JS no llega, todo el contenido es visible: la promesa
  de funcionamiento sin conexión no se puede romper por un efecto.

Las transiciones entre páginas usan **View Transitions nativas** (`@view-transition`)
con un fundido de 220 ms. Se evaluaron librerías —Motion (~12 kB), GSAP core (~22 kB),
`auto-animate`— y se descartaron: el sitio ya tiene una promesa de peso ligero, funciona
sin JS y la auditoría vigila cada kilobyte. Añadir una dependencia para un fundido que
hace el navegador sería pagar por algo que ya tenemos.

## 7. El guiño: Río de Janeiro

Río aparece como **sombra**, no como ilustración: el Cristo Redentor sobre el Corcovado
y el Pan de Azúcar, dibujados en un `<svg>` **en línea** dentro del propio HTML, con
siluetas más oscuras que el fondo (`#07070a`–`#0d0d16`), un filo dorado de un píxel,
bruma que deriva durante 96 s y luces de ciudad que parpadean cada 7 s.

Decisiones y su porqué:

- **SVG en línea, cero peticiones**: coherente con la promesa de máxima privacidad y
  con el funcionamiento sin conexión. No hay imagen que cargar ni URL que seguir.
- **`aria-hidden` y sin texto**: es decoración. No aparece en el árbol de
  accesibilidad, no se anuncia, no añade ruido a quien usa lector de pantalla, y no
  hay `<text>`, `<title>` ni `aria-label` que lo delaten.
- **Opacidad 0,42 y tonos más oscuros que el fondo**: se ve al mirar y no estorba al
  leer. Un guiño que interrumpe no es un guiño, es una interrupción.
- **Primer y último cuadro**: abre la portada y la despide (`.rio-cierre`), aplicando
  la regla del pico-final —de una sesión se recuerda el pico y el final—.
- **Se apaga antes de molestar**: con movimiento reducido queda quieto; con alto
  contraste (`[data-contrast="high"]`) desaparece por completo. La accesibilidad tiene
  prioridad sobre el guiño, y el test lo exige.
- **Ids únicos por instancia** (`scope="hero" | "cierre"`): la portada lleva el
  horizonte dos veces y el validador del export no admite `id` repetidos.

## 8. Lo que **no** se hace

- **Nada de parallax de pantalla completa, zoom ni rotación.** Está en la lista
  `MOTION.forbidden` y un test lo recorre.
- **Nada de vídeo de fondo ni de carrusel automático.** Interrumpen la lectura y
  gastan datos de quien estudia con conexión lenta.
- **Nada de librería de animación.** La decisión está medida: el peso se paga en cada
  visita y la auditoría (`pnpm audit:site`) avisa por encima de 250 kB.
- **Nada de texto que sólo se distinga por color**: el color es refuerzo, nunca la
  información.
- **Nada de animar en el camino crítico**: lo que se anima es opacidad y
  desplazamientos de un dígito, compuestos por GPU, y sólo en `no-preference`.

## 9. Límites honestos de esta capa

- **No hay estudio con usuarios.** Las conclusiones provienen de literatura publicada
  y de normas; no hemos hecho pruebas con personas reales. Cualquier afirmación sobre
  «el campus se siente mejor» es una hipótesis razonada, no un resultado medido en
  AURUM. Los tamaños de efecto citados son de los estudios originales, no nuestros.
- **La verificación de contraste es estática** (auditoría del export + axe en CI). El
  contraste percibido en pantallas reales, con brillo automático o modo nocturno del
  sistema, no se ha medido.
- **View Transitions** degrada con elegancia en navegadores que no las soportan: la
  navegación funciona igual, sin fundido. No se ha medido la diferencia percibida.
- **La medición de peso** (0,4 kB para las constantes de movimiento) es del export
  estático de este repositorio en esta fecha; puede variar al cambiar el contenido.

## 10. Cómo comprobarlo

```bash
pnpm test                 # incluye packages/ui/tests/psychology.test.ts y tests/contracts.test.ts
pnpm --filter @secure-t/web typecheck
pnpm site && pnpm audit:site   # 0 errores esperados; el guiño se valida en el HTML real
pnpm e2e                  # axe sobre la matriz de rutas, ahora con /experiencia
```

Archivos que sostienen esta capa:

| Archivo | Qué contiene |
| --- | --- |
| `packages/ui/src/psychology.ts` | los números, con su fuente y sus límites declarados |
| `packages/ui/tests/psychology.test.ts` | veinte pruebas que los exigen, incluso contra el CSS real |
| `apps/web/src/app/globals.css` | los tokens aplicados (`--psy-*`), el reveal, `.aurum-rio`, `@view-transition` |
| `apps/web/src/components/motion-rhythm.tsx` | el reveal progresivo: sólo con JS y sin movimiento reducido |
| `apps/web/src/components/rio-horizon.tsx` | el horizonte, en SVG en línea |
| `apps/web/src/components/experience-view.tsx` | la página `/experiencia`, que publica esta capa con sus cifras |
| `apps/web/src/components/site-header.tsx` | los dos escalones de navegación (Hick y Miller aplicados) |

---

*Documento vivo. Si un token cambia, cambia aquí y cambia su test: en ese orden o en
el inverso, nunca en uno solo.*

# Oferta — secure T

> Todo lo que se afirma aquí está en el repositorio y se puede abrir. No hay clientes,
> alumnado ni testimonios: no existen todavía y no se inventan.

## Qué se vende

**Un aula de seguridad digital para 15 personas durante 12 semanas**, con cuatro cursos
completos, laboratorio guiado, evaluaciones con banco de preguntas y constancia local de
recorrido para cada participante.

Se vende a la organización, no al alumno: la empresa o entidad paga el aula y sus personas
entran sin registro, sin matrícula y sin coste. Es la fase 2 del paywall (`plataforma/PAYWALL.md`),
«patrocinio», y nada más.

Qué hay dentro, comprobable:

| Pieza | Qué es | Dónde se comprueba |
|---|---|---|
| Cuatro cursos | Seguridad defensiva (SOC), ofensiva autorizada, IA aplicada segura, gobernanza y compliance | `campus/itinerarios/cursos-completos.html` |
| 20 unidades por curso | Cada semana es un documento con lección y práctica | `campus/itinerarios/cursos/*/semana-01…20.html` |
| Laboratorio aislado | Editor HTML/CSS con vista previa en `iframe sandbox`, sin scripts ni red | `campus/academia/index.html` (panel `lab-web`) |
| Evaluación | Banco de preguntas con corrección y explicación | `campus/itinerarios/course-player.js` + `quiz.json` por curso |
| Progreso | Recorrido guardado en el navegador, sin cuenta | `campus/credencial.html` (`stt-progreso` en `localStorage`) |
| Constancia | Bloque con huella SHA-256 verificable por un tercero | `campus/credencial.html` |
| Centro de amenazas y buscador | Material de consulta dentro del campus | `campus/amenazas.html`, `campus/buscar.html` |

## A quién

1. **Empresas de 20 a 200 personas** que necesitan que su plantilla no técnica deje de ser un
   riesgo: phishing, contraseñas, datos de clientes, uso de IA sin criterio.
2. **Consultoras y despachos** que quieren formar a su gente junior en defensa antes de
   ponerla delante de un cliente.
3. **Entidades de formación** que buscan un currículo listo para impartir, con laboratorio,
   sin construirlo desde cero.

No se vende a quien busca un título: la constancia no lo es, y el propio producto lo dice en
pantalla.

## Precio

| Plan | Personas | Duración | Sin IVA | IVA 21 % | Total |
|---|---|---|---|---|---|
| Aula 15 | 15 | 12 semanas | 2.900 € | 609 € | **3.509 €** |
| Aula 40 | 40 | 12 semanas | 5.800 € | 1.218 € | **7.018 €** |

Pago único por aula. Incluye dos sesiones en directo con el autor (apertura y cierre), el
informe de recorrido por participante y 90 días de acceso al campus en los equipos de la
organización. Sin coste por persona.

## Garantía

**Primera sesión sin riesgo: si tras la sesión de apertura la organización decide no seguir,
se devuelve el 100 % del importe.** Sin condiciones sobre el material ya descargado: el
material es abierto, no hay nada que recuperar.

## Objeciones

### «Ya tenemos una plataforma de formación corporativa»

Perfecto: esto no compite con un LMS. El aula se entrega como sitio estático que se puede
servir desde vuestro propio dominio o abrir en local, y el contenido cubre seguridad e IA
aplicada con laboratorio, que es lo que un LMS genérico no trae escrito. Si vuestro LMS
importa HTML, se importa; si no, se usa aparte durante 12 semanas.

### «¿La constancia vale como certificado?»

No. `campus/credencial.html` lo dice en la primera pantalla: la huella demuestra coherencia
interna del bloque, **no** identidad, autoría ni resultados de examen, y cualquiera puede
generar otro bloque. Sirve como constancia interna de la organización. Vender esto como
certificación sería mentir, y la propia ficha del repositorio excluye «prometer certificación
oficial».

### «¿Enseñáis a atacar sistemas?»

Se enseña a **pensar como un atacante para defender mejor**, en entornos propios o con
autorización escrita, y el material lo declara en cada unidad («no implica intervención en
sistemas ajenos»). Si la organización busca un curso de explotación ofensiva real, no es este
producto y se dice en la primera llamada.

## Lo que no se vende

- **Certificación oficial.** No hay entidad certificadora detrás.
- **Bolsa de prácticas.** Figura como pendiente en `plataforma/FICHA.md`.
- **Plataforma con cuentas y panel de administración.** El progreso vive en el navegador del
  alumno; no hay backend que gestione usuarios.
- **Servicios de auditoría o test de intrusión.** No se ofrecen y no se han hecho.

# Ficha de venta — Aula de seguridad digital · secure T

**Una página. Cinco minutos. Decidir.**

---

## Problema

Una empresa de 40 personas no tiene equipo de seguridad, pero sí tiene correo corporativo,
datos de clientes y una plantilla que abre adjuntos. No puede permitirse un consultor durante
seis meses, y un curso genérico de una hora no cambia nada. Lo que falta es un currículo
ordenado, con laboratorio y con evaluación, que alguien pueda entregar y cerrar con un
informe.

## Promesa

**En 12 semanas, 15 personas de la organización recorren cuatro cursos completos —80
unidades— con laboratorio y evaluaciones, sin registro, sin cuentas y sin pagar matrícula, y
la dirección recibe un informe de quién hizo qué.**

No prometemos certificar, ni convertir a nadie en analista, ni dejar la empresa «segura»:
prometemos formación real, medida y terminada.

## Prueba

Se puede abrir antes de pagar:

| Afirmación | Dónde |
|---|---|
| 4 cursos × 20 unidades | `campus/itinerarios/cursos-completos.html`; `cursos/*/semana-01…20.html` |
| Laboratorio aislado (iframe `sandbox`, sin red ni scripts) | `campus/academia/index.html`, panel `lab-web` |
| Evaluación con explicación por respuesta | `campus/itinerarios/course-player.js` + `quiz.json` de cada curso |
| Constancia con huella SHA-256, verificable, sin emisor | `campus/credencial.html` |
| Progreso sin cuenta | `localStorage` (`stt-progreso`), token anónimo local |
| Límite explícito: no es certificación | Texto propio de `credencial.html`, primera pantalla |

Prueba que **no** existe y no se alega: ningún cliente formado, ningún test de eficacia, ninguna
acreditación institucional. El repositorio declara «sin certificación oficial» en el pie de
todas las lecciones.

## Precio

| Plan | Personas | Sin IVA | Con IVA |
|---|---|---|---|
| Aula 15 | 15 | 2.900 € | 3.509 € |
| Aula 40 | 40 | 5.800 € | 7.018 € |

Pago único. Incluye dos (o tres) sesiones en directo, el campus instalado y el informe de
recorrido. Cero coste por persona.

**Garantía:** sesión de apertura con devolución del 100 % si la organización decide no seguir.

## CTA

Correo con asunto **«Aula»**: organización, personas a formar, mes de inicio. Respuesta con dos
huecos para la apertura y proforma. Nada más.

## Quién está detrás

El autor del repositorio `secure-t`: escribe el currículo, el campus y el laboratorio. No hay
institución académica detrás y no se presenta como tal; por eso la constancia se llama
constancia.

## Una frase para el comité

> «No es un curso online más: es un aula cerrada de 12 semanas con laboratorio, evaluación e
> informe, que se paga una vez y no exige cuentas a nadie. Y si no convence en la primera
> sesión, se devuelve entera.»

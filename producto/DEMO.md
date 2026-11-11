# Guion de demo — secure T (3 minutos)

Se enseña el campus, no una presentación. Nada de hablar de Python ni de reglas del
repositorio.

**Preparación**

- `campus/index.html`, `campus/itinerarios/cursos-completos.html` y `campus/academia/index.html`
  abiertos en pestañas.
- Una evaluación (`quiz`) ya cargada, para no esperar.
- Ventana sin marcadores, zoom 125 %.

---

## 0:00 – 0:25 · El catálogo

> «Cuatro cursos. No cien. Cada uno veinte unidades: defensa, ataque autorizado, IA segura y
> gobernanza. Esto es todo lo que tu equipo necesita saber, sin relleno.»

- Pantalla: catálogo. Señalar los cuatro títulos y «20 semanas» en cada tarjeta.
- No abrir los cuatro. Uno.

## 0:25 – 1:00 · Una unidad real

> «Esto es una semana, no un vídeo de diez minutos. Documento completo, con la práctica al
> final y el botón de registrar lectura.»

- Abrir `cursos/ciber-defensiva/semana-01.html`. Desplazar una vez, despacio.
- Pulsar «Registrar lectura y práctica». El estado cambia a marcado.

## 1:00 – 1:40 · El laboratorio (la parte que convence)

> «Aquí está lo que ningún curso barato tiene: un laboratorio. Editamos HTML y CSS y vemos el
> resultado en una vista previa aislada. Sin scripts, sin red, sin formularios. No se puede
> romper nada.»

- Abrir el panel `lab-web`. Cambiar el `<h1>` por «Prueba» y pulsar actualizar.
- Señalar el texto de seguridad del propio panel: `sandbox`, sin JavaScript, sin red.
- Este es el argumento: el aula es segura por construcción.

## 1:40 – 2:10 · Evaluación

> «Cada curso tiene banco de preguntas con explicación. No es un test de tres opciones al azar:
> al corregir, dice por qué.»

- Abrir la evaluación, contestar una pregunta mal a propósito, corregir, leer la explicación en
  voz alta.

## 2:10 – 2:35 · Constancia y su límite

> «Al terminar, cada persona genera una constancia con huella SHA-256. Es verificable por
> cualquiera. Y dice claramente lo que no es: no acredita identidad ni aprendizaje ante un
> tercero. No vendemos títulos.»

- Abrir `campus/credencial.html`. Leer el aviso en voz alta: eso genera confianza, no la quita.

## 2:35 – 3:00 · Cierre

> «2.900 euros más IVA por 15 personas, 12 semanas, dos sesiones conmigo y un informe al
> final. Si tras la sesión de apertura no os convence, se devuelve entera. ¿Quién sería la
> persona que convoca al grupo?»

---

## Preguntas y respuestas cortas

| Pregunta | Respuesta |
|---|---|
| «¿Es un certificado?» | No. Es constancia interna verificable. El título no lo damos. |
| «¿Se puede usar en móvil?» | El campus es estático y responsive; el laboratorio se disfruta en pantalla grande. |
| «¿Necesita internet?» | Se sirve desde vuestro dominio o en local. El laboratorio no usa red. |
| «¿Quién lo ha hecho?» | El autor del repositorio. Clientes, ninguno todavía: no los voy a inventar. |
| «¿Enseñáis hacking?» | Punto de vista del atacante en entornos autorizados. Nada sobre sistemas ajenos. |

## Lo que no se dice en esta demo

- «Certificado», «título», «acreditado», «homologado». Ninguna de las cuatro es verdad.
- «Como un bootcamp». No lo es.
- Cifras de empleabilidad. No existen.

# Métricas — Aula de seguridad digital · secure T

Tres números. Contados a mano, porque el campus no tiene analítica y no se le va a poner.

## Punto de partida (10 de noviembre de 2026)

| # | Indicador | Inicial | Fuente |
|---|---|---|---|
| 1 | Llamadas de encaje con empresas | **0** | No hay ninguna registrada |
| 2 | Aulas pagadas | **0** | Sin pasarela ni factura emitida |
| 3 | Personas que completan las 20 unidades de un curso | **0** | Sin aula arrancada |

## Objetivo a 30 días (10 de diciembre de 2026)

| # | Indicador | Objetivo | Umbral de fracaso |
|---|---|---|---|
| 1 | Llamadas de encaje | **6** | menos de 3 |
| 2 | Aulas pagadas | **1** | 0 |
| 3 | Personas con curso completo | **8** | menos de 3 |

## Definiciones operativas

**1. Llamada de encaje:** conversación de 20 minutos con alguien que puede decidir o influir
en el presupuesto de formación. Se cuenta la llamada hecha, no el correo enviado. Fuente:
agenda.

**2. Aula pagada:** dinero ingresado y factura emitida. Proforma enviada no cuenta. Fuente:
extracto bancario.

**3. Persona con curso completo:** alguien que ha generado la constancia de un curso, lo que el
propio sistema solo permite con las 20 semanas, el quiz, el laboratorio, el proyecto y el
examen marcados. Es la única métrica de aprendizaje que el producto puede demostrar sin
analítica: la cuenta la organización al recibir el informe, no nosotros por detrás.

## Por qué no se miden otras cosas

- **Visitas**: no hay analítica y añadirla contradiría la promesa de página limpia.
- **Satisfacción con encuesta**: con 8 personas y sin serie histórica no dice nada; se sustituye
  por la tasa de curso completo, que es un hecho.
- **NPS**: mismo problema, y además nadie lo ha pedido todavía.

## Señal de parada

Si a los 30 días hay 6 llamadas y 0 aulas, el precio no es el problema: el comprador no ve el
riesgo que resuelve. Antes de tocar el precio, se pregunta por escrito a las seis empresas qué
les frena y se reescribe la oferta. Bajar el precio con 0 conversaciones cerradas solo enseña
que el precio era una excusa.

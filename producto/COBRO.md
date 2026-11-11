# Cobro — secure T

## Qué se cobra y cuándo

Pago único por aula, antes de la sesión de apertura. Si tras esa sesión la organización no
sigue, se devuelve el 100 %.

| Momento | Qué ocurre | Importe |
|---|---|---|
| Llamada de encaje | 20 minutos, sin coste | 0 € |
| Reserva | factura proforma y pago | 100 % del aula |
| Apertura | sesión de 90 min con el equipo | — |
| Cierre | informe de recorrido | — |
| Garantía | si no siguen tras la apertura | −100 % |

## Pasarela elegida

**Transferencia SEPA con factura** como vía principal —el comprador es una empresa o una
entidad pública y necesita factura, no un recibo— y **Stripe Checkout** como alternativa para
quien prefiera tarjeta.

Estado real: **no hay pasarela configurada ni claves en el repositorio**. El alta pendiente:

1. Cuenta de empresa en Stripe (CIF, cuenta de abono, verificación: 2–5 días).
2. Dos `Price` de pago único: `aula-15` (2.900 €) y `aula-40` (5.800 €), EUR, con IVA 21 %
   aplicado en el checkout.
3. Facturación española con numeración propia y concepto «formación»; la pasarela solo cobra.
4. Mientras el alta termina: proforma + transferencia. Es como se cobrará el primer aula.

No se piden datos de tarjeta en ningún punto del campus: es estático y no tiene backend.

## Qué datos hacen falta

- Razón social, CIF y dirección fiscal.
- Persona de contacto con correo y teléfono.
- Número de personas a formar y mes de inicio.
- Para el informe: nombres o identificadores internos que la organización decida usar. Se
  entregan en un fichero que la organización custodia; no se suben a ningún servidor nuestro.

## Qué se entrega tras pagar

1. Factura en PDF con IVA desglosado (24 h laborables).
2. Paquete del campus (sitio estático con los cuatro cursos, laboratorio y evaluaciones) e
   instrucciones de instalación, en 3 días laborables.
3. Agenda de las sesiones de apertura y cierre.
4. Plantilla de informe de recorrido y su entrega al cierre.

## Política de reembolso

- **30 días** desde el pago, o devolución íntegra si la organización no sigue tras la sesión de
  apertura.
- Vía: transferencia o la misma pasarela, en 7 días laborables.
- Si el campus no funciona en los equipos de la organización y no se resuelve en 10 días, la
  devolución es íntegra, incluidas las sesiones ya impartidas.

## Lo que no se cobra nunca

- El acceso individual del alumno: cero (`plataforma/PAYWALL.md`).
- La llamada de encaje.
- El contenido: está publicado y se puede leer sin pagar.

## Antes de publicar

El correo de la landing (`aulas@secure-t.example`) es un marcador: se sustituye por una
dirección real antes de publicar. Y no se anuncia la constancia como «certificado» en ningún
material de cobro, porque el propio producto dice lo contrario.

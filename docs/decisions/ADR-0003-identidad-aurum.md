# ADR-0003 · Identidad AURUM: negro y dorado

- **Estado:** aceptado (2026-10-11)
- **Contexto:** el encargo pide diseño «negro y dorado», con azul sólo si es necesario. El campus clásico usa un
  tema oscuro con acento lima (`tokens.css`) que sus tests protegen.
- **Decisión:** la capa nueva usa fondo casi negro (`#07070a`), dorado (`#d4af37`, `#f2d477`) como acento
  principal y azul (`#5aa9ff`) únicamente para información secundaria y estados. Los tokens se editan sólo en el
  campus clásico si no rompen sus tests; AURUM tiene sus propios tokens en `packages/ui`.
- **Por qué:** el dorado sobre negro es legible (contraste AA/AAA comprobado), transmite la idea de «instituto» sin
  caer en el morado corporativo, y no obliga a reescribir el campus clásico.
- **Alternativas descartadas:** reemplazar `tokens.css` del campus clásico (los tests de contraste y de tema claro
  lo cubren); paleta lima (ya existía, no aportaba la identidad pedida).
- **Consecuencias:** dos paletas documentadas; la de AURUM es la que se muestra en portada, campus nuevo, agente,
  calendario y credencial.

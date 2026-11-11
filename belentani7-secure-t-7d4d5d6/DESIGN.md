# DESIGN.md — secureT

## Direction
Dark por defecto (ambiente de terminal de seguridad), con modo light disponible. Paleta propia: fondo #0b1322, primario #b6ff2e (lime), acento #38e1ff (cyan), secundario rgba(56,225,255,0.12), destructivo #ff6b5e (coral). Tipografía: Inter (cuerpo), Sora (display), JetBrains Mono (código/datos).

## Craft floor (bans aplicados)
- No eyebrow/kicker encima de headings. El heading habla por sí mismo.
- Sin sección numérica (01/02/03) salvo que la secuencia lleve información.
- Sin gradient text. Enfasis por peso o tamaño.
- Sin glass/blur como decoración.
- Sin border-left/right coloreado >1px en cards.
- Sin hard offset shadows fuera de neobrutalismo.
- Tracking floor -0.04em; -0.02/-0.03 prefiere.
- Card radius 12-16px; pills solo para controles pequeños.
- Contraste ≥4.5:1 cuerpo, ≥3:1 texto grande.
- Estados: hover, disabled, loading, error, empty + focus visible.

## Tokens
--background: #0b1322 / #f4f7fb (light)
--foreground: #e8f1ff / #0d1626
--primary: #b6ff2e / #4d7a00
--accent: #38e1ff / #067a94
--destructive: #ff6b5e / #b3372c
--border: rgba(56,225,255,0.18) / rgba(13,22,38,0.14)
--radius: 18px (contenedor), 12-16px (cards)

## Surfaces
- Home: Persuade. Hero sin métrica de héroe (big number + label). Tres disciplinas sin números de sección.
- Campus: Operate. Catálogo de cursos con búsqueda y filtro por nivel.
- Progress: Operate. Cockpit de aprendizaje con progreso real.
- Mentor: Operate. Retroalimentación humana + recomendación de IA.
- Portal: Operate. Secciones record, credentials, research, faculty, admin, settings.
- Notifications: Operate. Centro de notificaciones con estado real.
- NotFound: Read. 404 con camino de regreso.

## i18n
9 idiomas: es, en, ca, fr, it, pt, de, nl, ja. Selector de idioma persistente (localStorage). Todo el copy de UI, rutas públicas y errores traducidos.

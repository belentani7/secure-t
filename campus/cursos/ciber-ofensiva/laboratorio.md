# Lab guiado: Juice Shop en local (legal)

**Curso:** Ciberseguridad Ofensiva: Pensar como Atacante · **Duración estimada:** 3–4 h · **Nivel:** universitario

## Objetivo

Encontrar y documentar 3 vulnerabilidades del OWASP Top 10 en un entorno creado para ser vulnerable.

## Marco legal y ético

Juice Shop is deliberately vulnerable and local: it is the legal way to practice. NEVER against systems you don't own.

## Pasos

1. Install Docker Desktop (or Docker Engine).
2. Levantar el objetivo: `docker run --rm -p 3000:80 bkimminich/juice-shop` → http://localhost:3000
3. Recon: walk the app, view page source, check /ftp route, error messages.
4. Vector 1 (inyección): in login, test `' or 1=1--` and document what happens.
5. Vector 2 (control de acceso): open a product URL and try changing the ID to another user's.
6. Vector 3 (XSS): find a field that reflects text and try `<script>alert(1)</script>`.
7. For each one: screenshot + step-by-step reproduction + CVSS + remediation.
8. Cleanup: `docker stop <id>` and delete local containers.

## Evidencia a entregar

3 hallazgos completos (formato del informe de la chuleta) en `evidencia-ofensiva.md`.

## Criterio de superación

La evidencia debe permitir que otra persona **reproduzca** el resultado sin preguntarte
nada. Si no es reproducible, no es evidencia (ver [rúbrica](rubrica.md)).

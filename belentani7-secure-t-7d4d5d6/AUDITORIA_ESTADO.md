# AUDITORIA_ESTADO — secure-t

> Repositorio físico: `belentani-ecosystem/educacion/secure-t`
> Producto principal del ecosistema.

## Situación actual

| Indicador | Valor |
|-----------|-------|
| Categoría | educacion |
| Lenguaje | HTML |
| Rama | main |
| package.json | Sí |
| Python | No |
| Docker | Sí |
| README | Sí |
| AGENTS.md | Sí |
| Tests | Sí |
| CI | Sí |

## Comentarios

- Universidad digital de ciberseguridad e IA.
- Repo prioritario. Protocolo de seguridad obligatorio (R1-R8) antes de merge a main.

## Comando para arreglar y elevar

```bash
npm install
npm run dev
npm run build
npm run test
docker compose up -d --build
# Auditoría de seguridad obligatoria: SECURITY_AUDIT_PROTOCOL.md (R1-R8)
gitleaks detect --source .

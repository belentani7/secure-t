# Guía de Contribuciones — secure T

¡Gracias por tu interés en contribuir a secure T! Este documento describe cómo participar en el proyecto.

## Cómo Contribuir

### 1. Reportar Issues

Abre un [issue nuevo](https://github.com/belentani7/secure-t/issues) con:
- **Título claro**: describe el problema o feature en 1 línea
- **Descripción**: contexto, pasos para reproducir, resultado esperado
- **Entorno**: Sistema operativo, Node.js version, navegador (si aplica)
- **Screenshots/logs**: adjunta outputs relevantes

### 2. Proponer Features

Usa la etiqueta `enhancement` al abrir issue. Incluye:
- Caso de uso: ¿por qué se necesita?
- Propuesta: ¿cómo debería funcionar?
- Alternativas: ¿hay otras formas de resolver esto?

### 3. Pull Requests

#### Setup
```bash
git clone https://github.com/belentani7/secure-t.git
cd secure-t
git checkout -b feature/tu-feature-name
pnpm install
```

#### Desarrollo
```bash
# Validar cambios
pnpm check  # TypeScript strict mode
pnpm test   # Vitest
pnpm build  # Vite + esbuild

# Formateo automático (prettier)
pnpm format
```

#### Commits
Sigue [Conventional Commits](https://www.conventionalcommits.org/):
```
feat(academic): agregar evaluación por portafolio
fix(auth): corregir expiración de tokens RBAC
docs: actualizar roadmap de laboratorios
test(ai): mejorar cobertura de routing de modelos
refactor(ui): extraer hook de autenticación
chore: actualizar drizzle a v0.46
```

#### PR Checklist
- [ ] Branch desde `main` y actualizado
- [ ] Commits son atómicos y con mensajes claros
- [ ] CI pasa (tests, typecheck, build)
- [ ] Documentación actualizada (README, docs/, comentarios)
- [ ] Sin cambios innecesarios de formatting
- [ ] No introduce secretos (env vars, API keys)

#### Review
Esperamos feedback constructivo. Mantén conversaciones respectuosas.

---

## Estructura de Código

### Convenciones
- **TypeScript**: strict mode, tipos explícitos
- **React**: functional components + hooks
- **Nombres**: camelCase para variables/funciones, PascalCase para componentes
- **Imports**: agrupa por: estándar → librerías → proyectos locales
- **Testing**: ubicar junto al código (`*.test.ts`)

### Ejemplos

**Componente React:**
```tsx
// client/src/components/LabCard.tsx
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface LabCardProps {
  title: string;
  difficulty: "beginner" | "intermediate" | "advanced";
}

export function LabCard({ title, difficulty }: LabCardProps) {
  return (
    <Card>
      <h3>{title}</h3>
      <Badge>{difficulty}</Badge>
    </Card>
  );
}
```

**Función de Server:**
```typescript
// server/api/labs.ts
import { Router } from "express";
import { validateRBAC } from "@/middleware/rbac";

export const labsRouter = Router();

labsRouter.get("/", validateRBAC("labs:read"), async (req, res) => {
  try {
    const labs = await db.select().from(labsTable);
    res.json(labs);
  } catch (error) {
    res.status(500).json({ error: String(error) });
  }
});
```

### Documentación
- Commenta **por qué**, no **qué**
- Documenta interfaces públicas
- Actualiza docs/ cuando cambias arquitectura

---

## Testing

```bash
# Correr tests
pnpm test

# Watch mode
pnpm test --watch

# Cobertura
pnpm test --coverage
```

Apunta a cobertura >80%. Enfócate en lógica crítica: auth, validación, auditoría.

---

## Seguridad

⚠️ **Antes de pushear:**
1. ✅ No incluyes secretos (API keys, tokens, contraseñas)
2. ✅ Usas variables de entorno (`.env.example`)
3. ✅ Validás inputs en client y server
4. ✅ Checkeás [SECURITY.md](docs/SECURITY.md) para riesgos

**Vulnerabilidad de seguridad?** NO abras issue público. Contacta: belentani7pedro@gmail.com

---

## Licencia

Al contribuir, aceptas que tu código sea licenciado bajo AGPL-3.0-only.

---

¡Gracias por mejorar secure T! 🚀

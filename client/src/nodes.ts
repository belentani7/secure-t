// SECURE-T — registro de los 15 nodos independientes.
// Fuente unica de verdad: cada nodo es un modulo autonomo (vista, ruta o sistema)
// con estado observable. Orden psicologico: CORE -> EDUCACION -> GOBIERNO.

export type NodeLayer = "core" | "education" | "governance";

export interface NodeSpec {
  id: string;
  name: string;
  route: string;
  layer: NodeLayer;
  kind: "view" | "route" | "system";
  status: "online" | "degraded" | "offline";
  description: string;
}

export const NODES: NodeSpec[] = [
  // — CAPA 1: NUCLEO (identidad + acceso) —
  { id: "N01", name: "Token Anonimo", route: "/credentials", layer: "core", kind: "route", status: "online", description: "UUID sin PII · 365 dias · solo localStorage" },
  { id: "N02", name: "Verificacion", route: "/credentials", layer: "core", kind: "system", status: "online", description: "Verificacion estricta stateless · 401 si expira" },
  { id: "N03", name: "Onboarding", route: "/", layer: "core", kind: "system", status: "online", description: "4 pasos · sin email · sin telefono" },
  { id: "N04", name: "Notificaciones", route: "/notifications", layer: "core", kind: "route", status: "online", description: "Cola local · cero rastreo externo" },

  // — CAPA 2: EDUCACION (curriculum + practica) —
  { id: "N05", name: "Dashboard", route: "/", layer: "education", kind: "view", status: "online", description: "Momentum semanal + siguiente accion" },
  { id: "N06", name: "Curriculum", route: "/", layer: "education", kind: "view", status: "online", description: "120 creditos · 4 anos · Theory→Evidence" },
  { id: "N07", name: "Catalogo", route: "/", layer: "education", kind: "view", status: "online", description: "8 cursos · 40 modulos" },
  { id: "N08", name: "Cyber Labs", route: "/", layer: "education", kind: "view", status: "online", description: "Entornos sinteticos efimeros · sin red de produccion" },
  { id: "N09", name: "Competencias", route: "/", layer: "education", kind: "view", status: "online", description: "Evidencia calibrada · no solo porcentajes" },
  { id: "N10", name: "Lecciones", route: "/lesson/", layer: "education", kind: "route", status: "online", description: "Contenido multilingue PT/ES/EN" },

  // — CAPA 3: GOBIERNO (supervision + monetizacion) —
  { id: "N11", name: "Astra Mentor", route: "/", layer: "governance", kind: "system", status: "online", description: "IA gobernada por politicas · no autoridad academica" },
  { id: "N12", name: "Comunidad", route: "/", layer: "governance", kind: "view", status: "online", description: "SOC study room + faculty review queue" },
  { id: "N13", name: "Planes", route: "/", layer: "governance", kind: "view", status: "online", description: "Gratis / Premium 9e / Organizaciones 199e" },
  { id: "N14", name: "Certificados", route: "/record", layer: "governance", kind: "route", status: "online", description: "Presigned HMAC 24h + watermark" },
  { id: "N15", name: "Administracion", route: "/admin", layer: "governance", kind: "route", status: "online", description: "Faculty · rúbricas · auditoria sin PII" },
];

export const LAYERS: { layer: NodeLayer; label: string; accent: string }[] = [
  { layer: "core", label: "Nucleo", accent: "#b8f36b" },
  { layer: "education", label: "Educacion", accent: "#6be7f3" },
  { layer: "governance", label: "Gobierno", accent: "#bda2ff" },
];

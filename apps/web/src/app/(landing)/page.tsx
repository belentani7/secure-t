import { Landing } from "@/components/landing";

/**
 * Portada canónica en portugués (idioma por defecto del ecosistema PT > ES > EN > CA).
 * El contenido se genera en tiempo de build desde el material real de `campus/`.
 */
export default function HomePage() {
  return <Landing locale="pt" />;
}

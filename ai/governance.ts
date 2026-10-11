/**
 * Gobernanza de agentes (adaptador del repositorio).
 *
 * La implementación canónica vive en `packages/agent/src/governance.ts`, que
 * comparten la web, el servidor opcional y estos tests. Este fichero se
 * conserva para no romper a ningún consumidor anterior (contrato P8 · C10).
 */
export * from "../packages/agent/src/governance";

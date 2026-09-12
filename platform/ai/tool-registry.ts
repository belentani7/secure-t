import type { Actor, Capability } from "../core/contracts.js";
import { can } from "../core/contracts.js";

export interface ToolContext { actor: Actor; requestId: string; }
export interface ToolDefinition<I = unknown, O = unknown> {
  name: string; capability: Capability; description: string;
  input: (value: unknown) => I;
  execute: (input: I, ctx: ToolContext) => Promise<O>;
}

const tools = new Map<string, ToolDefinition>();
export function registerTool<I, O>(tool: ToolDefinition<I, O>): void { if (tools.has(tool.name)) throw new Error(`Tool already registered: ${tool.name}`); tools.set(tool.name, tool as ToolDefinition); }
export function listTools(): Pick<ToolDefinition, "name" | "capability" | "description">[] { return [...tools.values()].map(({ name, capability, description }) => ({ name, capability, description })); }

export async function executeTool(name: string, rawInput: unknown, ctx: ToolContext): Promise<unknown> {
  const tool = tools.get(name);
  if (!tool) throw new Error(`Unknown tool: ${name}`);
  if (!can(ctx.actor.role, tool.capability)) throw new Error(`Forbidden capability: ${tool.capability}`);
  return tool.execute(tool.input(rawInput), ctx);
}

registerTool({
  name: "content.transform", capability: "content.transform",
  description: "Transform approved source content into structured learning artifacts without removing provenance.",
  input: (v: unknown) => { if (!v || typeof v !== "object") throw new Error("invalid input"); return v as Record<string, unknown>; },
  execute: async (input) => ({ status: "accepted", operation: "content.transform", input }),
});

registerTool({
  name: "data.analyze", capability: "data.analyze",
  description: "Profile an approved dataset and return statistical/quality signals.",
  input: (v: unknown) => { if (!v || typeof v !== "object") throw new Error("invalid input"); return v as Record<string, unknown>; },
  execute: async (input) => ({ status: "accepted", operation: "data.analyze", input }),
});

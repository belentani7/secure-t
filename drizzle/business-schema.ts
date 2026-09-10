import { boolean, integer, jsonb, pgEnum, pgTable, real, text, timestamp, uuid, varchar } from "drizzle-orm/pg-core";

const timestamps = { createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(), updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull() };
export const businessArea = pgEnum("business_area", ["TRUST_SAFETY", "MODEL_EVALUATION", "AUTOMATION_CONSULTING", "DIGITAL_INCLUSION"]);
export const accountStatus = pgEnum("account_status", ["PROSPECT", "ACTIVE", "PAUSED", "CLOSED"]);
export const opportunityStage = pgEnum("opportunity_stage", ["QUALIFIED", "DISCOVERY", "PROPOSAL", "WON", "LOST"]);
export const projectStatus = pgEnum("project_status", ["PLANNED", "ACTIVE", "REVIEW", "DELIVERED", "ARCHIVED"]);
export const pipelineRunStatus = pgEnum("pipeline_run_status", ["BACKLOG", "READY", "IN_PROGRESS", "BLOCKED", "DONE", "CANCELLED"]);

export const businessAccounts = pgTable("business_accounts", {
  id: uuid("id").defaultRandom().primaryKey(), name: varchar("name", { length: 240 }).notNull(), area: businessArea("area").notNull(), status: accountStatus("status").default("PROSPECT").notNull(), owner: varchar("owner", { length: 180 }).notNull(), notes: text("notes"), ...timestamps,
});
export const businessOpportunities = pgTable("business_opportunities", {
  id: uuid("id").defaultRandom().primaryKey(), accountId: uuid("account_id").references(() => businessAccounts.id).notNull(), title: varchar("title", { length: 240 }).notNull(), stage: opportunityStage("stage").default("QUALIFIED").notNull(), valueCents: integer("value_cents").notNull(), probability: real("probability").notNull(), nextAction: text("next_action").notNull(), dueAt: timestamp("due_at", { withTimezone: true }), ...timestamps,
});
export const businessProjects = pgTable("business_projects", {
  id: uuid("id").defaultRandom().primaryKey(), accountId: uuid("account_id").references(() => businessAccounts.id).notNull(), opportunityId: uuid("opportunity_id").references(() => businessOpportunities.id), title: varchar("title", { length: 240 }).notNull(), area: businessArea("area").notNull(), status: projectStatus("status").default("PLANNED").notNull(), acceptanceCriteria: jsonb("acceptance_criteria").$type<string[]>().default([]).notNull(), owner: varchar("owner", { length: 180 }).notNull(), ...timestamps,
});
export const businessEvidence = pgTable("business_evidence", {
  id: uuid("id").defaultRandom().primaryKey(), projectId: uuid("project_id").references(() => businessProjects.id), kind: varchar("kind", { length: 40 }).notNull(), title: varchar("title", { length: 240 }).notNull(), uri: text("uri").notNull(), hash: varchar("hash", { length: 128 }), verified: boolean("verified").default(false).notNull(), ...timestamps,
});
export const businessPipelineRuns = pgTable("business_pipeline_runs", {
  id: uuid("id").defaultRandom().primaryKey(), type: varchar("type", { length: 60 }).notNull(), status: pipelineRunStatus("status").default("IN_PROGRESS").notNull(), input: jsonb("input").$type<Record<string, unknown>>().default({}).notNull(), output: jsonb("output").$type<Record<string, unknown>>(), error: text("error"), startedAt: timestamp("started_at", { withTimezone: true }).defaultNow().notNull(), finishedAt: timestamp("finished_at", { withTimezone: true }), ...timestamps,
});

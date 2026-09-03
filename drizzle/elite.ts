// Tablas élite (spec §2 adaptado Prisma→Drizzle). APPEND-ONLY: no toca schema.ts.
// Convención: uuid PK, timestamps created_at/updated_at, snake_case columnas.
import { boolean, integer, jsonb, pgTable, real, text, timestamp, uuid, varchar } from "drizzle-orm/pg-core";

const ts = {
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
};

// Credenciales verificables (F3)
export const certificates = pgTable("certificates", {
  id: uuid("id").defaultRandom().primaryKey(),
  code: varchar("code", { length: 32 }).notNull().unique(),
  userId: uuid("user_id").notNull(),
  courseId: uuid("course_id").notNull(),
  hash: varchar("hash", { length: 128 }).notNull(),
  revoked: boolean("revoked").default(false).notNull(),
  issuedAt: timestamp("issued_at", { withTimezone: true }).defaultNow().notNull(),
  ...ts,
});

// Foro (F4)
export const threads = pgTable("threads", {
  id: uuid("id").defaultRandom().primaryKey(),
  courseId: uuid("course_id"),
  authorId: uuid("author_id").notNull(),
  title: varchar("title", { length: 240 }).notNull(),
  pinned: boolean("pinned").default(false).notNull(),
  locked: boolean("locked").default(false).notNull(),
  ...ts,
});
export const posts = pgTable("posts", {
  id: uuid("id").defaultRandom().primaryKey(),
  threadId: uuid("thread_id").notNull(),
  authorId: uuid("author_id").notNull(),
  parentId: uuid("parent_id"),
  body: text("body").notNull(),
  ...ts,
});
export const reactions = pgTable("reactions", {
  id: uuid("id").defaultRandom().primaryKey(),
  postId: uuid("post_id").notNull(),
  userId: uuid("user_id").notNull(),
  kind: varchar("kind", { length: 40 }).notNull(),
  ...ts,
});
export const teams = pgTable("teams", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: varchar("name", { length: 120 }).notNull(),
  score: integer("score").default(0).notNull(),
  ...ts,
});

// Mentoría (F4)
export const mentorProfiles = pgTable("mentor_profiles", {
  userId: uuid("user_id").primaryKey(),
  expertise: jsonb("expertise").$type<string[]>().default([]).notNull(),
  priceHour: real("price_hour").default(0).notNull(),
  rating: real("rating").default(5).notNull(),
  ...ts,
});
export const bookings = pgTable("bookings", {
  id: uuid("id").defaultRandom().primaryKey(),
  mentorId: uuid("mentor_id").notNull(),
  studentId: uuid("student_id").notNull(),
  start: timestamp("start", { withTimezone: true }).notNull(),
  end: timestamp("end", { withTimezone: true }).notNull(),
  status: varchar("status", { length: 40 }).default("PENDING").notNull(),
  notes: text("notes"),
  ...ts,
});

// Comercio + becas (F3, Stripe test-mode)
export const plans = pgTable("plans", {
  id: uuid("id").defaultRandom().primaryKey(),
  slug: varchar("slug", { length: 80 }).notNull().unique(),
  priceMonthly: real("price_monthly").notNull(),
  features: jsonb("features").default({}).notNull(),
  ...ts,
});
export const subscriptions = pgTable("subscriptions", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: uuid("user_id").notNull().unique(),
  planId: uuid("plan_id").notNull(),
  stripeSubId: varchar("stripe_sub_id", { length: 120 }).unique(),
  status: varchar("status", { length: 40 }).notNull(),
  currentPeriodEnd: timestamp("current_period_end", { withTimezone: true }),
  ...ts,
});
export const orders = pgTable("orders", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: uuid("user_id").notNull(),
  amount: real("amount").notNull(),
  kind: varchar("kind", { length: 40 }).notNull(),
  stripeId: varchar("stripe_id", { length: 120 }),
  at: timestamp("at", { withTimezone: true }).defaultNow().notNull(),
  ...ts,
});
export const coupons = pgTable("coupons", {
  code: varchar("code", { length: 40 }).primaryKey(),
  pct: real("pct").notNull(),
  expires: timestamp("expires", { withTimezone: true }),
  ...ts,
});
export const scholarships = pgTable("scholarships", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: uuid("user_id").notNull(),
  pct: real("pct").notNull(),
  reason: text("reason").notNull(),
  grantedBy: varchar("granted_by", { length: 180 }).notNull(),
  ...ts,
});

// Academia extra: intentos quiz, tareas, assets, cohortes
export const quizAttempts = pgTable("quiz_attempts", {
  id: uuid("id").defaultRandom().primaryKey(),
  lessonId: uuid("lesson_id").notNull(),
  userId: uuid("user_id").notNull(),
  answers: jsonb("answers").default({}).notNull(),
  score: real("score").notNull(),
  passed: boolean("passed").notNull(),
  at: timestamp("at", { withTimezone: true }).defaultNow().notNull(),
  ...ts,
});
export const assignments = pgTable("elite_assignments", {
  id: uuid("id").defaultRandom().primaryKey(),
  courseId: uuid("course_id").notNull(),
  lessonId: uuid("lesson_id"),
  title: jsonb("title").default({}).notNull(),
  brief: jsonb("brief").default({}).notNull(),
  rubric: jsonb("rubric").default({}).notNull(),
  weight: real("weight").default(1).notNull(),
  dueAt: timestamp("due_at", { withTimezone: true }),
  ...ts,
});
export const submissions = pgTable("elite_submissions", {
  id: uuid("id").defaultRandom().primaryKey(),
  assignmentId: uuid("assignment_id").notNull(),
  userId: uuid("user_id").notNull(),
  body: jsonb("body").default({}).notNull(),
  fileUrl: text("file_url"),
  status: varchar("status", { length: 40 }).default("DRAFT").notNull(),
  score: real("score"),
  feedback: jsonb("feedback").default({}).notNull(),
  attempts: integer("attempts").default(0).notNull(),
  submittedAt: timestamp("submitted_at", { withTimezone: true }),
  ...ts,
});
export const lessonAssets = pgTable("lesson_assets", {
  id: uuid("id").defaultRandom().primaryKey(),
  lessonId: uuid("lesson_id").notNull(),
  kind: varchar("kind", { length: 40 }).notNull(),
  url: text("url"),
  body: jsonb("body").default({}).notNull(),
  meta: jsonb("meta").default({}).notNull(),
  ...ts,
});
export const cohorts = pgTable("cohorts", {
  id: uuid("id").defaultRandom().primaryKey(),
  courseId: uuid("course_id").notNull(),
  start: timestamp("start", { withTimezone: true }).notNull(),
  end: timestamp("end", { withTimezone: true }).notNull(),
  capacity: integer("capacity").default(500).notNull(),
  ...ts,
});

// IA / gobernanza (F6-F7): sesiones tutor, borradores, flags, riesgo, reportes, feature flags
export const tutorSessions = pgTable("tutor_sessions", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: uuid("user_id").notNull(),
  locale: varchar("locale", { length: 8 }).default("es").notNull(),
  messages: jsonb("messages").default([]).notNull(),
  tokens: integer("tokens").default(0).notNull(),
  at: timestamp("at", { withTimezone: true }).defaultNow().notNull(),
  ...ts,
});
export const contentDrafts = pgTable("content_drafts", {
  id: uuid("id").defaultRandom().primaryKey(),
  courseSlug: varchar("course_slug", { length: 120 }).notNull(),
  locale: varchar("locale", { length: 8 }).notNull(),
  payload: jsonb("payload").default({}).notNull(),
  status: varchar("status", { length: 40 }).default("REVIEW").notNull(),
  agentVersion: varchar("agent_version", { length: 40 }).notNull(),
  authorId: uuid("author_id"),
  ...ts,
});
export const flags = pgTable("flags", {
  id: uuid("id").defaultRandom().primaryKey(),
  targetType: varchar("target_type", { length: 40 }).notNull(),
  targetId: varchar("target_id", { length: 80 }).notNull(),
  reporterId: uuid("reporter_id").notNull(),
  reason: text("reason").notNull(),
  status: varchar("status", { length: 40 }).default("OPEN").notNull(),
  resolution: text("resolution"),
  ...ts,
});
export const riskScores = pgTable("risk_scores", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: uuid("user_id").notNull(),
  score: real("score").notNull(),
  factors: jsonb("factors").default({}).notNull(),
  at: timestamp("at", { withTimezone: true }).defaultNow().notNull(),
  ...ts,
});
export const agentReports = pgTable("agent_reports", {
  id: uuid("id").defaultRandom().primaryKey(),
  date: timestamp("date", { withTimezone: true }).notNull().unique(),
  stats: jsonb("stats").default({}).notNull(),
  ...ts,
});
export const featureFlags = pgTable("feature_flags", {
  key: varchar("key", { length: 80 }).primaryKey(),
  enabled: boolean("enabled").default(false).notNull(),
  rollout: integer("rollout").default(100).notNull(),
  ...ts,
});

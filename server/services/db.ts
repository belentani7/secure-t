import { getDb, isDbConnected, query, schema } from "../db/index.js";
import { eq, and } from "drizzle-orm";

interface LessonProgressInput {
  userId: string;
  lessonId: string;
  completed?: boolean;
  timeSpentMinutes?: number;
}

interface EnrollInput {
  userId: string;
  courseId: string;
  academicTermId?: string;
}

interface SubmitEvaluationInput {
  userId: string;
  evaluationId: string;
  score?: number;
  feedback?: string;
}

interface LabInstanceInput {
  userId: string;
  labId: string;
  expiresAt?: Date;
}

interface SubmissionInput {
  userId: string;
  labInstanceId: string;
  artifactUri?: string;
}

interface AuditEventInput {
  userId: string | null;
  agentId: string;
  action: string;
  tool: string;
  authorization: string;
  inputMetadata?: Record<string, unknown>;
  outputMetadata?: Record<string, unknown>;
  result: string;
  error?: string;
}

export const dbService = {
  query,

  synchronized: async () => isDbConnected(),

  getCompetencies: async (): Promise<any[]> => {
    if (isDbConnected()) {
      return getDb()!.select().from(schema.competencies);
    }
    return [];
  },

  getCompetency: async (code: string) => {
    if (isDbConnected()) {
      const rows = await getDb()!
        .select()
        .from(schema.competencies)
        .where(eq(schema.competencies.code, code));
      return rows[0] ?? null;
    }
    return null;
  },

  getUser: async (userId: string) => {
    if (isDbConnected()) {
      const rows = await getDb()!
        .select()
        .from(schema.users)
        .where(eq(schema.users.id, userId));
      return rows[0] ?? null;
    }
    return null;
  },

  getEnrollments: async (userId: string) => {
    if (isDbConnected()) {
      return getDb()!
        .select()
        .from(schema.enrollments)
        .where(eq(schema.enrollments.userId, userId));
    }
    return [];
  },

  enrollInCourse: async (input: EnrollInput) => {
    if (isDbConnected()) {
      const rows = await getDb()!
        .insert(schema.enrollments)
        .values({
          userId: input.userId,
          courseId: input.courseId,
          ...(input.academicTermId ? { academicTermId: input.academicTermId } : {}),
        })
        .returning();
      return rows[0] ?? null;
    }
    return { userId: input.userId, courseId: input.courseId, status: "ENROLLED" };
  },

  updateEnrollmentStatus: async (enrollmentId: string, status: string) => {
    if (isDbConnected()) {
      const rows = await getDb()!
        .update(schema.enrollments)
        .set({ status: status as any })
        .where(eq(schema.enrollments.id, enrollmentId))
        .returning();
      return rows[0] ?? null;
    }
    return { id: enrollmentId, status };
  },

  getLessonProgress: async (userId: string, lessonId: string) => {
    if (isDbConnected()) {
      const rows = await getDb()!
        .select()
        .from(schema.studentLessonProgress)
        .where(
          and(
            eq(schema.studentLessonProgress.userId, userId),
            eq(schema.studentLessonProgress.lessonId, lessonId)
          )
        );
      return rows[0] ?? null;
    }
    return null;
  },

  updateLessonProgress: async (input: LessonProgressInput) => {
    if (isDbConnected()) {
      const existing = await getDb()!
        .select()
        .from(schema.studentLessonProgress)
        .where(
          and(
            eq(schema.studentLessonProgress.userId, input.userId),
            eq(schema.studentLessonProgress.lessonId, input.lessonId)
          )
        );
      if (existing.length > 0) {
        const rows = await getDb()!
          .update(schema.studentLessonProgress)
          .set({
            ...(typeof input.completed === "boolean" ? { completed: input.completed } : {}),
            ...(typeof input.timeSpentMinutes === "number" ? { timeSpentMinutes: input.timeSpentMinutes } : {}),
          })
          .where(
            and(
              eq(schema.studentLessonProgress.userId, input.userId),
              eq(schema.studentLessonProgress.lessonId, input.lessonId)
            )
          )
          .returning();
        return rows[0] ?? null;
      }
      const rows = await getDb()!
        .insert(schema.studentLessonProgress)
        .values({
          userId: input.userId,
          lessonId: input.lessonId,
          completed: input.completed ?? false,
          timeSpentMinutes: input.timeSpentMinutes ?? 0,
        })
        .returning();
      return rows[0] ?? null;
    }
    return { userId: input.userId, lessonId: input.lessonId, completed: input.completed ?? false };
  },

  getEvaluations: async (lessonId: string) => {
    if (isDbConnected()) {
      return getDb()!
        .select()
        .from(schema.evaluations)
        .where(eq(schema.evaluations.lessonId, lessonId));
    }
    return [];
  },

  submitEvaluation: async (input: SubmitEvaluationInput) => {
    if (isDbConnected()) {
      const rows = await getDb()!
        .insert(schema.studentEvaluations)
        .values({
          userId: input.userId,
          evaluationId: input.evaluationId,
          ...(typeof input.score === "number" ? { score: input.score } : {}),
          ...(input.feedback ? { feedback: input.feedback } : {}),
          status: "SUBMITTED",
        })
        .returning();
      return rows[0] ?? null;
    }
    return { userId: input.userId, evaluationId: input.evaluationId, status: "SUBMITTED" };
  },

  getEvaluationHistory: async (userId: string, evaluationId: string) => {
    if (isDbConnected()) {
      return getDb()!
        .select()
        .from(schema.studentEvaluationsHistory)
        .where(
          and(
            eq(schema.studentEvaluationsHistory.userId, userId),
            eq(schema.studentEvaluationsHistory.evaluationId, evaluationId)
          )
        );
    }
    return [];
  },

  getLabInstances: async (userId: string) => {
    if (isDbConnected()) {
      return query(
        "SELECT * FROM lab_instances WHERE user_id = $1 ORDER BY created_at DESC",
        [userId]
      );
    }
    return [];
  },

  createLabInstance: async (input: LabInstanceInput) => {
    if (isDbConnected()) {
      const rows = await query(
        `INSERT INTO lab_instances (user_id, lab_id, expires_at, status)
         VALUES ($1, $2, $3, 'READY') RETURNING *`,
        [input.userId, input.labId, input.expiresAt?.toISOString() ?? null]
      );
      return rows[0] ?? null;
    }
    return { userId: input.userId, labId: input.labId, status: "READY" };
  },

  getSubmissions: async (labInstanceId: string) => {
    if (isDbConnected()) {
      return query(
        "SELECT * FROM submissions WHERE lab_instance_id = $1 ORDER BY created_at DESC",
        [labInstanceId]
      );
    }
    return [];
  },

  createSubmission: async (input: SubmissionInput) => {
    if (isDbConnected()) {
      const rows = await query(
        `INSERT INTO submissions (user_id, lab_instance_id, artifact_uri, status)
         VALUES ($1, $2, $3, 'SUBMITTED') RETURNING *`,
        [input.userId, input.labInstanceId, input.artifactUri ?? null]
      );
      return rows[0] ?? null;
    }
    return { userId: input.userId, labInstanceId: input.labInstanceId, status: "SUBMITTED" };
  },

  createAuditEvent: async (input: AuditEventInput) => {
    if (isDbConnected()) {
      const rows = await getDb()!
        .insert(schema.aiAuditEvents)
        .values({
          userId: input.userId,
          agentId: input.agentId,
          action: input.action,
          tool: input.tool,
          authorization: input.authorization,
          inputMetadata: input.inputMetadata ?? {},
          outputMetadata: input.outputMetadata ?? {},
          result: input.result,
          error: input.error,
        })
        .returning();
      return rows[0] ?? null;
    }
    return { agentId: input.agentId, action: input.action, result: input.result };
  },
};

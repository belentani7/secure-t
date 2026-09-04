import { dbService } from "../../server/services/db.js";
import { type Request, type Response } from "express";

export type CompetencyId = string;
export type EnrollmentId = string;
export type LessonProgressId = string;
export type EvaluationId = string;
export type AuditEventId = string;

/** Repository for competency-related operations */
export const competencyRepository = {
  listAll: async (): Promise<any[]> => {
    return dbService.getCompetencies();
  },
  getByCode: async (code: string) => {
    return dbService.getCompetency(code);
  },
  earn: async (userId: string, competencyId: string) => {
    const existing = await dbService.getUser(userId);
    if (!existing) {
      const error = new Error(`User ${userId} not found for competency ${competencyId}`);
      throw error;
    }
    // Update or create student competency
    await dbService.updateLessonProgress({
      userId,
      lessonId: competencyId, // Using lessonId field as placeholder
      completed: true,
    });
  },
};

/** Repository for enrollment-related operations */
export const enrollmentRepository = {
  listByUser: async (userId: string) => {
    return dbService.getEnrollments(userId);
  },
  enroll: async (userId: string, courseId: string, academicTermId?: string) => {
    return dbService.enrollInCourse({ userId, courseId, academicTermId });
  },
  updateStatus: async (enrollmentId: string, status: string) => {
    return dbService.updateEnrollmentStatus(enrollmentId, status);
  },
};

/** Repository for lesson progress tracking */
export const progressRepository = {
  getByUserAndLesson: async (userId: string, lessonId: string) => {
    return dbService.getLessonProgress(userId, lessonId);
  },
  update: async (userId: string, lessonId: string, completed: boolean, timeSpentMinutes?: number) => {
    return dbService.updateLessonProgress({ userId, lessonId, completed, timeSpentMinutes });
  },
  markCompleted: async (userId: string, lessonId: string) => {
    return dbService.updateLessonProgress({ userId, lessonId, completed: true });
  },
};

/** Repository for evaluation operations */
export const evaluationRepository = {
  listByLesson: async (lessonId: string) => {
    return dbService.getEvaluations(lessonId);
  },
  submit: async (userId: string, evaluationId: string, score?: number, feedback?: string) => {
    return dbService.submitEvaluation({ userId, evaluationId, score, feedback });
  },
  getHistory: async (userId: string, evaluationId: string) => {
    return dbService.getEvaluationHistory(userId, evaluationId);
  },
};

/** Repository for lab operations */
export const labRepository = {
  listByUser: async (userId: string) => {
    return dbService.getLabInstances(userId);
  },
  create: async (userId: string, labId: string, expiresAt?: Date) => {
    return dbService.createLabInstance({ userId, labId, expiresAt });
  },
};

/** Repository for submission operations */
export const submissionRepository = {
  listByLab: async (labInstanceId: string) => {
    return dbService.getSubmissions(labInstanceId);
  },
  create: async (userId: string, labInstanceId: string, artifactUri?: string) => {
    return dbService.createSubmission({ userId, labInstanceId, artifactUri });
  },
};

/** Repository for audit event operations */
export const auditRepository = {
  create: async (data: {
    userId: string | null;
    agentId: string;
    action: string;
    tool: string;
    authorization: string;
    inputMetadata?: Record<string, unknown>;
    outputMetadata?: Record<string, unknown>;
    result: string;
    error?: string;
  }) => {
    return dbService.createAuditEvent(data);
  },
  listByUser: async (userId: string) => {
    return dbService.query(
      "SELECT * FROM ai_audit_events WHERE user_id = $1 ORDER BY created_at DESC",
      [userId]
    );
  },
  listByAgent: async (agentId: string) => {
    return dbService.query(
      "SELECT * FROM ai_audit_events WHERE agent_id = $1 ORDER BY created_at DESC",
      [agentId]
    );
  },
};
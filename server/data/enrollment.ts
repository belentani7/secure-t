/**
 * Course enrollment system
 * Track student registrations, progress, status
 */

import { nanoid } from "nanoid";

export type EnrollmentStatus = "enrolled" | "in_progress" | "completed" | "paused";

export interface Enrollment {
  id: string;
  learnerId: string;
  courseCode: string;
  enrolledAt: string;
  startedAt?: string;
  completedAt?: string;
  status: EnrollmentStatus;
  progress: number; // 0-100
  hoursSpent: number;
  lastAccessedAt: string;
}

export interface CourseCart {
  learnerId: string;
  courses: string[]; // course codes
  addedAt: string;
}

/**
 * Enroll learner in course
 */
export function enrollLearner(
  learnerId: string,
  courseCode: string
): Enrollment {
  return {
    id: `enroll-${nanoid(12)}`,
    learnerId,
    courseCode,
    enrolledAt: new Date().toISOString(),
    status: "enrolled",
    progress: 0,
    hoursSpent: 0,
    lastAccessedAt: new Date().toISOString(),
  };
}

/**
 * Update enrollment progress
 */
export function updateEnrollmentProgress(
  enrollment: Enrollment,
  progress: number,
  hoursSpent: number
): Enrollment {
  return {
    ...enrollment,
    progress: Math.min(100, Math.max(0, progress)),
    hoursSpent,
    status: progress === 100 ? "completed" : "in_progress",
    startedAt: enrollment.startedAt || new Date().toISOString(),
    completedAt: progress === 100 ? new Date().toISOString() : undefined,
    lastAccessedAt: new Date().toISOString(),
  };
}

/**
 * Sample enrollments for demo
 */
export const sampleEnrollments: Enrollment[] = [
  {
    id: "enroll-demo-001",
    learnerId: "learner-alex",
    courseCode: "CY-101",
    enrolledAt: "2026-08-15T10:00:00Z",
    startedAt: "2026-08-16T14:30:00Z",
    status: "in_progress",
    progress: 72,
    hoursSpent: 18.5,
    lastAccessedAt: "2026-09-03T09:15:00Z",
  },
  {
    id: "enroll-demo-002",
    learnerId: "learner-alex",
    courseCode: "CS-110",
    enrolledAt: "2026-08-20T10:00:00Z",
    startedAt: "2026-08-22T15:00:00Z",
    status: "in_progress",
    progress: 48,
    hoursSpent: 12.0,
    lastAccessedAt: "2026-09-02T11:45:00Z",
  },
  {
    id: "enroll-demo-003",
    learnerId: "learner-alex",
    courseCode: "NET-201",
    enrolledAt: "2026-08-25T10:00:00Z",
    status: "enrolled",
    progress: 0,
    hoursSpent: 0,
    lastAccessedAt: "2026-08-25T10:00:00Z",
  },
];

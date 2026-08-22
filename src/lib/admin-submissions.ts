/**
 * Admin submission review queue (B8) — A12 endpoints.
 */

import { api } from "@/lib/api";
import type { StudentTaskAssignment } from "@/lib/tasks";

export type ReviewActionStatus = "completed" | "in_progress";

export interface SubmissionQueueItem extends StudentTaskAssignment {
  student_name: string;
}

export interface ReviewSubmissionBody {
  status: ReviewActionStatus;
  admin_feedback?: string | null;
}

export const ADMIN_ASSIGNMENTS_API_PATH = "/api/v1/admin/assignments";

export async function fetchSubmittedAssignments(token: string): Promise<SubmissionQueueItem[]> {
  return api.get<SubmissionQueueItem[]>(`${ADMIN_ASSIGNMENTS_API_PATH}?status=submitted`, {
    token,
  });
}

export async function reviewAssignment(
  assignmentId: string,
  body: ReviewSubmissionBody,
  token: string,
): Promise<StudentTaskAssignment> {
  return api.patch<StudentTaskAssignment>(
    `${ADMIN_ASSIGNMENTS_API_PATH}/${assignmentId}/review`,
    body,
    { token },
  );
}

export function formatSubmittedAt(value: string | null): string {
  if (!value) return "—";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleString(undefined, {
    dateStyle: "medium",
    timeStyle: "short",
  });
}

/**
 * Student task assignments (B5) — A11 my-tasks list and submit.
 */

import { api } from "@/lib/api";

export const MY_TASKS_API_PATH = "/api/v1/student/my-tasks";

export type AssignmentStatus = "assigned" | "in_progress" | "submitted" | "completed";

export interface AssignedTaskDetails {
  title: string;
  description: string;
  stack: string;
}

export interface StudentTaskAssignment {
  id: string;
  student_id: string;
  task_id: string;
  assigned_at: string;
  assigned_by: string;
  status: AssignmentStatus;
  submission_link: string | null;
  submitted_at: string | null;
  admin_feedback: string | null;
  created_at: string;
  updated_at: string;
  task: AssignedTaskDetails;
}

export function formatAssignmentStatus(status: AssignmentStatus): string {
  switch (status) {
    case "assigned":
      return "Assigned";
    case "in_progress":
      return "In progress";
    case "submitted":
      return "Submitted";
    case "completed":
      return "Completed";
    default:
      return status;
  }
}

export function statusBadgeClasses(status: AssignmentStatus): string {
  switch (status) {
    case "completed":
      return "bg-success-bg text-success";
    case "submitted":
      return "bg-surface-raised text-ink-secondary";
    case "in_progress":
      return "bg-warning-bg text-warning";
    case "assigned":
    default:
      return "bg-warning-bg text-warning";
  }
}

export async function fetchMyTasks(token: string): Promise<StudentTaskAssignment[]> {
  return api.get<StudentTaskAssignment[]>(MY_TASKS_API_PATH, { token });
}

export async function submitTaskAssignment(
  assignmentId: string,
  submissionLink: string,
  token: string,
): Promise<StudentTaskAssignment> {
  return api.patch<StudentTaskAssignment>(
    `${MY_TASKS_API_PATH}/${assignmentId}/submit`,
    { submission_link: submissionLink },
    { token },
  );
}

export function validateSubmissionLink(value: string): string | null {
  const trimmed = value.trim();
  if (!trimmed) return "Submission link is required.";
  try {
    const url = new URL(trimmed);
    if (url.protocol !== "http:" && url.protocol !== "https:") {
      return "Enter a valid http or https URL.";
    }
    return null;
  } catch {
    return "Enter a valid URL (e.g. https://your-project.example.com).";
  }
}

export interface TaskProgressSummary {
  total: number;
  completed: number;
  submitted: number;
  inProgress: number;
  assigned: number;
  /** Percent of tasks marked completed by admin — use for certificate readiness. */
  completionPercent: number;
  /** Percent of tasks submitted or completed — student's handed-in work. */
  submissionPercent: number;
  readyForCertificate: boolean;
}

export function summarizeTaskProgress(
  assignments: StudentTaskAssignment[],
): TaskProgressSummary {
  const total = assignments.length;
  if (total === 0) {
    return {
      total: 0,
      completed: 0,
      submitted: 0,
      inProgress: 0,
      assigned: 0,
      completionPercent: 0,
      submissionPercent: 0,
      readyForCertificate: false,
    };
  }

  let completed = 0;
  let submitted = 0;
  let inProgress = 0;
  let assigned = 0;

  for (const assignment of assignments) {
    switch (assignment.status) {
      case "completed":
        completed += 1;
        break;
      case "submitted":
        submitted += 1;
        break;
      case "in_progress":
        inProgress += 1;
        break;
      case "assigned":
      default:
        assigned += 1;
        break;
    }
  }

  const completionPercent = Math.round((completed / total) * 100);
  const submissionPercent = Math.round(((completed + submitted) / total) * 100);

  return {
    total,
    completed,
    submitted,
    inProgress,
    assigned,
    completionPercent,
    submissionPercent,
    readyForCertificate: completed === total,
  };
}

export function formatProgressLabel(summary: TaskProgressSummary): string {
  if (summary.total === 0) return "No tasks";
  if (summary.readyForCertificate) return "100% — ready for certificate";
  return `${summary.completionPercent}% complete`;
}

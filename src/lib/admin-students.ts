/**
 * Admin student review and task assignment (B7) — A8/A9/A10 endpoints.
 */

import { api } from "@/lib/api";
import type { StudentTaskAssignment } from "@/lib/tasks";

export type StudentAccessStatus = "pending" | "granted";

export interface AdminStudent {
  id: string;
  name: string;
  email: string | null;
  phone: string | null;
  domain_id: string | null;
  internship_plan_id: string | null;
  chosen_duration_weeks: number | null;
  college: string | null;
  year_of_study: string | null;
  payment_screenshot_url: string | null;
  access_status: StudentAccessStatus | string;
  access_granted_by: string | null;
  created_at: string;
  updated_at: string;
}

export interface ManualAssignTasksResult {
  newly_created: number;
  already_assigned: number;
  assignments: StudentTaskAssignment[];
}

export const ADMIN_STUDENTS_API_PATH = "/api/v1/admin/students";

export async function fetchAdminStudents(
  token: string,
  accessStatus?: StudentAccessStatus,
): Promise<AdminStudent[]> {
  const path = accessStatus
    ? `${ADMIN_STUDENTS_API_PATH}?access_status=${accessStatus}`
    : ADMIN_STUDENTS_API_PATH;
  return api.get<AdminStudent[]>(path, { token });
}

export async function fetchAdminStudent(
  token: string,
  studentId: string,
): Promise<AdminStudent> {
  return api.get<AdminStudent>(`${ADMIN_STUDENTS_API_PATH}/${studentId}`, { token });
}

export async function grantStudentAccess(
  token: string,
  studentId: string,
): Promise<AdminStudent> {
  return api.patch<AdminStudent>(
    `${ADMIN_STUDENTS_API_PATH}/${studentId}/grant-access`,
    {},
    { token },
  );
}

export async function fetchStudentAssignments(
  token: string,
  studentId: string,
): Promise<StudentTaskAssignment[]> {
  return api.get<StudentTaskAssignment[]>(`${ADMIN_STUDENTS_API_PATH}/${studentId}/tasks`, {
    token,
  });
}

export async function assignTasksToStudent(
  token: string,
  studentId: string,
  taskIds: string[],
): Promise<ManualAssignTasksResult> {
  return api.post<ManualAssignTasksResult>(
    `${ADMIN_STUDENTS_API_PATH}/${studentId}/assign-tasks`,
    { task_ids: taskIds },
    { token },
  );
}

export function hasPaymentScreenshot(student: AdminStudent): boolean {
  return Boolean(student.payment_screenshot_url);
}

export function isAccessGranted(student: AdminStudent): boolean {
  return student.access_status === "granted";
}

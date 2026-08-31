/**
 * Admin task CRUD (B6) — A4/A5 endpoints.
 */

import { api } from "@/lib/api";

export interface AdminTask {
  id: string;
  domain_id: string;
  internship_plan_id: string;
  title: string;
  description: string;
  stack: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface AdminTaskCreateBody {
  domain_id: string;
  internship_plan_id: string;
  title: string;
  description: string;
  stack: string;
}

export interface AdminTaskUpdateBody {
  domain_id?: string;
  internship_plan_id?: string;
  title?: string;
  description?: string;
  stack?: string;
  is_active?: boolean;
}

export interface AdminTaskFilters {
  domain_id?: string;
  internship_plan_id?: string;
}

export const ADMIN_TASKS_API_PATH = "/api/v1/admin/tasks";

export async function fetchAdminTasks(
  token: string,
  filters: AdminTaskFilters = {},
): Promise<AdminTask[]> {
  const params = new URLSearchParams();
  if (filters.domain_id) params.set("domain_id", filters.domain_id);
  if (filters.internship_plan_id) params.set("internship_plan_id", filters.internship_plan_id);
  const query = params.toString();
  const path = query ? `${ADMIN_TASKS_API_PATH}?${query}` : ADMIN_TASKS_API_PATH;
  return api.get<AdminTask[]>(path, { token });
}

export async function fetchPremiumAdminTasks(
  token: string,
  domainId?: string,
): Promise<AdminTask[]> {
  const params = new URLSearchParams();
  if (domainId) params.set("domain_id", domainId);
  const query = params.toString();
  const path = query
    ? `${ADMIN_TASKS_API_PATH}/premium?${query}`
    : `${ADMIN_TASKS_API_PATH}/premium`;
  return api.get<AdminTask[]>(path, { token });
}

export async function createAdminTask(
  body: AdminTaskCreateBody,
  token: string,
): Promise<AdminTask> {
  return api.post<AdminTask>(ADMIN_TASKS_API_PATH, body, { token });
}

export async function updateAdminTask(
  taskId: string,
  body: AdminTaskUpdateBody,
  token: string,
): Promise<AdminTask> {
  return api.patch<AdminTask>(`${ADMIN_TASKS_API_PATH}/${taskId}`, body, { token });
}

export async function deactivateAdminTask(taskId: string, token: string): Promise<AdminTask> {
  return api.delete<AdminTask>(`${ADMIN_TASKS_API_PATH}/${taskId}`, { token });
}

export function isUuid(value: string): boolean {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(
    value.trim(),
  );
}

export function shortenId(id: string): string {
  return `${id.slice(0, 8)}…`;
}

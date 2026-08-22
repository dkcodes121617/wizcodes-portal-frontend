/**
 * Admin internship plan CRUD (B6) — A3 endpoints.
 */

import { api } from "@/lib/api";

export type InternshipPlanTier = "basic_299" | "premium_999";

export interface InternshipPlan {
  id: string;
  tier: InternshipPlanTier | string;
  price: number;
  min_duration_weeks: number;
  max_duration_weeks: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface InternshipPlanCreateBody {
  tier: InternshipPlanTier;
  price: number;
  min_duration_weeks: number;
  max_duration_weeks: number;
}

export interface InternshipPlanUpdateBody {
  tier?: InternshipPlanTier;
  price?: number;
  min_duration_weeks?: number;
  max_duration_weeks?: number;
  is_active?: boolean;
}

export const ADMIN_PLANS_API_PATH = "/api/v1/admin/internship-plans";

export function formatPlanTier(tier: string): string {
  if (tier === "basic_299") return "Basic";
  if (tier === "premium_999") return "Premium";
  return tier.replace(/_/g, " ");
}

export async function fetchAdminPlans(token: string): Promise<InternshipPlan[]> {
  return api.get<InternshipPlan[]>(ADMIN_PLANS_API_PATH, { token });
}

export async function createAdminPlan(
  body: InternshipPlanCreateBody,
  token: string,
): Promise<InternshipPlan> {
  return api.post<InternshipPlan>(ADMIN_PLANS_API_PATH, body, { token });
}

export async function updateAdminPlan(
  planId: string,
  body: InternshipPlanUpdateBody,
  token: string,
): Promise<InternshipPlan> {
  return api.patch<InternshipPlan>(`${ADMIN_PLANS_API_PATH}/${planId}`, body, { token });
}

export async function deactivateAdminPlan(
  planId: string,
  token: string,
): Promise<InternshipPlan> {
  return api.delete<InternshipPlan>(`${ADMIN_PLANS_API_PATH}/${planId}`, { token });
}

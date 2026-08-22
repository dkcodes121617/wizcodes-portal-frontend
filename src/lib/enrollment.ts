/**
 * Enrollment API types and helpers (B2).
 *
 * Domain list expects `GET /api/v1/domains` (public, active domains) — this
 * endpoint is not yet implemented on the backend; the enroll page surfaces
 * that gap instead of hardcoding domains.
 */

import { ApiError, api } from "@/lib/api";
import type { StudentProfile } from "@/lib/auth";

export interface DomainOption {
  id: string;
  name: string;
  slug: string;
  is_active: boolean;
}

export interface InternshipPlanOption {
  id: string;
  tier: string;
  price: number;
  min_duration_weeks: number;
  max_duration_weeks: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface EnrollmentRequestBody {
  domain_id: string;
  internship_plan_id: string;
  chosen_duration_weeks: number;
  college: string;
  year_of_study: string;
}

export const DOMAINS_API_PATH = "/api/v1/domains";
export const INTERNSHIP_PLANS_API_PATH = "/api/v1/internship-plans";
export const ENROLL_API_PATH = "/api/v1/student/enroll";

export function isStudentEnrolled(student: StudentProfile): boolean {
  return student.domain_id != null;
}

export function formatPlanTier(tier: string): string {
  if (tier === "basic_299") return "Basic";
  if (tier === "premium_999") return "Premium";
  return tier.replace(/_/g, " ");
}

export function formatPlanLabel(plan: InternshipPlanOption): string {
  return `${formatPlanTier(plan.tier)} — ₹${plan.price} (${plan.min_duration_weeks}–${plan.max_duration_weeks} weeks)`;
}

export async function fetchActiveDomains(): Promise<DomainOption[]> {
  return api.get<DomainOption[]>(DOMAINS_API_PATH);
}

export async function fetchActiveInternshipPlans(): Promise<InternshipPlanOption[]> {
  return api.get<InternshipPlanOption[]>(INTERNSHIP_PLANS_API_PATH);
}

export async function submitEnrollment(
  body: EnrollmentRequestBody,
  token: string,
): Promise<StudentProfile> {
  return api.post<StudentProfile>(ENROLL_API_PATH, body, { token });
}

export function isDomainsEndpointMissing(error: unknown): boolean {
  return error instanceof ApiError && (error.status === 404 || error.status === 0);
}

export const DOMAINS_ENDPOINT_GAP_MESSAGE =
  "The backend does not yet expose a public domain list (GET /api/v1/domains). Enrollment cannot be completed until that endpoint is added.";

export function resolveDomainName(
  domainId: string | null,
  domains: DomainOption[],
): string | null {
  if (!domainId) return null;
  return domains.find((domain) => domain.id === domainId)?.name ?? null;
}

export function resolvePlanLabel(
  planId: string | null,
  plans: InternshipPlanOption[],
): string | null {
  if (!planId) return null;
  const plan = plans.find((entry) => entry.id === planId);
  return plan ? formatPlanLabel(plan) : null;
}

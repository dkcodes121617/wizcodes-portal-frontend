/**
 * Client-side auth token storage.
 *
 * The API client accepts a bearer token per request via `token` in options;
 * this module is the single place that reads and writes that token.
 */

const TOKEN_KEY = "wizcodes_auth_token";

export interface TokenResponse {
  access_token: string;
  token_type: "bearer";
}

export interface StudentProfile {
  id: string;
  name: string;
  email: string | null;
  phone: string | null;
  domain_id: string | null;
  internship_plan_id: string | null;
  chosen_duration_weeks: number | null;
  college: string | null;
  year_of_study: string | null;
  certificate_name: string | null;
  internship_start_date: string | null;
  internship_end_date: string | null;
  payment_screenshot_url: string | null;
  access_status: string;
  access_granted_by: string | null;
  created_at: string;
  updated_at: string;
}

export function getToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(TOKEN_KEY);
}

export function setToken(token: string): void {
  localStorage.setItem(TOKEN_KEY, token);
}

export function clearToken(): void {
  localStorage.removeItem(TOKEN_KEY);
}

export function isAuthenticated(): boolean {
  return Boolean(getToken());
}

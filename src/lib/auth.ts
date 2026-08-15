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

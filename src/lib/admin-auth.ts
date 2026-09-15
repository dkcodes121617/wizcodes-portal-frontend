/**
 * Admin auth token storage (B6) — separate from student auth so both sessions
 * can coexist in the same browser without overwriting each other.
 */

import { api } from "@/lib/api";
import type { TokenResponse } from "@/lib/auth";

const ADMIN_TOKEN_KEY = "wizcodes_admin_auth_token";

export interface AdminProfile {
  id: string;
  name: string;
  email: string;
  role: "admin" | "super_admin";
  created_at: string;
  updated_at: string;
}

export function getAdminToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(ADMIN_TOKEN_KEY);
}

export function setAdminToken(token: string): void {
  localStorage.setItem(ADMIN_TOKEN_KEY, token);
}

export function clearAdminToken(): void {
  localStorage.removeItem(ADMIN_TOKEN_KEY);
}

export function isAdminAuthenticated(): boolean {
  return Boolean(getAdminToken());
}

export async function loginAdmin(email: string, password: string): Promise<TokenResponse> {
  return api.post<TokenResponse>("/api/v1/auth/admin/login", { email, password });
}

export async function fetchAdminProfile(token: string): Promise<AdminProfile> {
  return api.get<AdminProfile>("/api/v1/auth/admin/me", { token });
}

export type AdminRole = AdminProfile["role"];

export interface AdminCreateBody {
  name: string;
  email: string;
  password: string;
  role?: AdminRole;
}

export function isSuperAdmin(profile: AdminProfile): boolean {
  return profile.role === "super_admin";
}

export async function fetchAdmins(token: string): Promise<AdminProfile[]> {
  return api.get<AdminProfile[]>("/api/v1/auth/admin/admins", { token });
}

export async function createAdmin(token: string, body: AdminCreateBody): Promise<AdminProfile> {
  return api.post<AdminProfile>("/api/v1/auth/admin/create", body, { token });
}

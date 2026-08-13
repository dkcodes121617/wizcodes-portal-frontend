/**
 * Thin fetch wrapper around the backend.
 *
 * Every request goes through `env.apiUrl`, so switching environments is a
 * one-variable change and there is no place for a hardcoded host to hide.
 *
 * Requests are sent without credentials on purpose: the backend allows any
 * origin (`CORS_ORIGINS=*`), and browsers refuse to honour a wildcard for
 * credentialed requests. Pass a bearer token via `token` instead.
 */

import { env } from "@/lib/env";

export class ApiError extends Error {
  constructor(
    readonly status: number,
    message: string,
    readonly requestId?: string,
    readonly body?: unknown,
  ) {
    super(message);
    this.name = "ApiError";
  }
}

export interface ApiRequestOptions extends Omit<RequestInit, "body"> {
  /** JSON-serialisable request body. */
  body?: unknown;
  /** Bearer token, if the endpoint requires authentication. */
  token?: string;
  /** Abort the request after this many milliseconds. Defaults to 15s. */
  timeoutMs?: number;
}

const DEFAULT_TIMEOUT_MS = 15_000;

export async function apiFetch<T>(path: string, options: ApiRequestOptions = {}): Promise<T> {
  const { body, token, timeoutMs = DEFAULT_TIMEOUT_MS, headers, ...init } = options;

  const url = `${env.apiUrl}${path.startsWith("/") ? path : `/${path}`}`;

  const requestHeaders = new Headers(headers);
  requestHeaders.set("Accept", "application/json");
  if (body !== undefined) requestHeaders.set("Content-Type", "application/json");
  if (token) requestHeaders.set("Authorization", `Bearer ${token}`);

  // AbortSignal.timeout keeps a slow backend from hanging a page render.
  const signal = init.signal ?? AbortSignal.timeout(timeoutMs);

  let response: Response;
  try {
    response = await fetch(url, {
      ...init,
      headers: requestHeaders,
      body: body === undefined ? undefined : JSON.stringify(body),
      credentials: "omit",
      signal,
    });
  } catch (cause) {
    const reason = cause instanceof Error ? cause.message : "unknown error";
    throw new ApiError(0, `Could not reach the API at ${url}: ${reason}`);
  }

  const requestId = response.headers.get("X-Request-ID") ?? undefined;

  if (response.status === 204) return undefined as T;

  const isJson = response.headers.get("content-type")?.includes("application/json");
  const payload = isJson ? await response.json().catch(() => null) : await response.text();

  if (!response.ok) {
    const detail =
      (isJson && payload && typeof payload === "object" && "detail" in payload
        ? String((payload as { detail: unknown }).detail)
        : null) ?? `Request failed with status ${response.status}`;
    throw new ApiError(response.status, detail, requestId, payload);
  }

  return payload as T;
}

export const api = {
  get: <T>(path: string, options?: ApiRequestOptions) =>
    apiFetch<T>(path, { ...options, method: "GET" }),
  post: <T>(path: string, body?: unknown, options?: ApiRequestOptions) =>
    apiFetch<T>(path, { ...options, method: "POST", body }),
  patch: <T>(path: string, body?: unknown, options?: ApiRequestOptions) =>
    apiFetch<T>(path, { ...options, method: "PATCH", body }),
  delete: <T>(path: string, options?: ApiRequestOptions) =>
    apiFetch<T>(path, { ...options, method: "DELETE" }),
} as const;

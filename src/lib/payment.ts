/**
 * Payment screenshot upload (B3) — multipart upload to A7 endpoint.
 */

import { ApiError } from "@/lib/api";
import type { StudentProfile } from "@/lib/auth";
import { env } from "@/lib/env";

export const PAYMENT_SCREENSHOT_API_PATH = "/api/v1/student/payment-screenshot";

export const PAYMENT_ACCESS_PENDING = "pending";
export const PAYMENT_ACCESS_GRANTED = "granted";

export const PAYMENT_SCREENSHOT_MAX_BYTES = 10 * 1024 * 1024;

const ALLOWED_IMAGE_TYPES = new Set(["image/jpeg", "image/png", "image/webp", "image/gif"]);

export function validatePaymentScreenshotFile(file: File): string | null {
  if (!ALLOWED_IMAGE_TYPES.has(file.type)) {
    return "Only image files are allowed (JPEG, PNG, WebP, or GIF).";
  }
  if (file.size > PAYMENT_SCREENSHOT_MAX_BYTES) {
    return "Payment screenshot must be 10 MB or smaller.";
  }
  if (file.size === 0) {
    return "Selected file is empty.";
  }
  return null;
}

export function resolvePaymentScreenshotUrl(relativePath: string | null): string | null {
  if (!relativePath) return null;
  if (relativePath.startsWith("http://") || relativePath.startsWith("https://")) {
    return relativePath;
  }
  return `${env.apiUrl}/${relativePath.replace(/^\//, "")}`;
}

export async function uploadPaymentScreenshot(
  file: File,
  token: string,
): Promise<StudentProfile> {
  const formData = new FormData();
  formData.append("file", file);

  const url = `${env.apiUrl}${PAYMENT_SCREENSHOT_API_PATH}`;
  const response = await fetch(url, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: "application/json",
    },
    body: formData,
    credentials: "omit",
    signal: AbortSignal.timeout(60_000),
  });

  const isJson = response.headers.get("content-type")?.includes("application/json");
  const payload = isJson ? await response.json().catch(() => null) : await response.text();

  if (!response.ok) {
    const detail =
      (isJson && payload && typeof payload === "object" && "detail" in payload
        ? String((payload as { detail: unknown }).detail)
        : null) ?? `Upload failed with status ${response.status}`;
    throw new ApiError(
      response.status,
      detail,
      response.headers.get("X-Request-ID") ?? undefined,
      payload,
    );
  }

  return payload as StudentProfile;
}

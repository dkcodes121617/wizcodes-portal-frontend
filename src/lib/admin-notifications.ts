/**
 * Admin notification sending API.
 */

import { api } from "@/lib/api";

export type NotificationAudience = "single" | "all" | "pending" | "granted" | "custom";

export interface SendNotificationPayload {
  title: string;
  body: string;
  audience: NotificationAudience;
  student_id?: string;
  student_ids?: string[];
}

export interface SendNotificationResult {
  recipients: number;
  notification_ids: string[];
}

export const ADMIN_NOTIFICATIONS_API_PATH = "/api/v1/admin/notifications";

export async function sendNotification(
  token: string,
  payload: SendNotificationPayload,
): Promise<SendNotificationResult> {
  return api.post<SendNotificationResult>(`${ADMIN_NOTIFICATIONS_API_PATH}/send`, payload, {
    token,
  });
}

export const NOTIFICATION_AUDIENCE_LABELS: Record<NotificationAudience, string> = {
  single: "One student",
  all: "All students",
  pending: "Pending approval",
  granted: "Approved students",
  custom: "Selected students",
};

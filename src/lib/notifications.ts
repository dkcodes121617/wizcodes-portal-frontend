/**
 * Student notification inbox API.
 */

import { api } from "@/lib/api";

export interface Notification {
  id: string;
  student_id: string;
  title: string;
  body: string;
  read_at: string | null;
  sent_by_admin_id: string | null;
  created_at: string;
  updated_at: string;
}

export interface UnreadCountResponse {
  unread_count: number;
}

export const STUDENT_NOTIFICATIONS_API_PATH = "/api/v1/student/notifications";

export async function fetchNotifications(token: string): Promise<Notification[]> {
  return api.get<Notification[]>(STUDENT_NOTIFICATIONS_API_PATH, { token });
}

export async function fetchUnreadCount(token: string): Promise<number> {
  const response = await api.get<UnreadCountResponse>(
    `${STUDENT_NOTIFICATIONS_API_PATH}/unread-count`,
    { token },
  );
  return response.unread_count;
}

export async function markNotificationRead(
  token: string,
  notificationId: string,
): Promise<Notification> {
  return api.patch<Notification>(
    `${STUDENT_NOTIFICATIONS_API_PATH}/${notificationId}/read`,
    {},
    { token },
  );
}

export async function markAllNotificationsRead(token: string): Promise<{ updated: number }> {
  return api.patch<{ updated: number }>(
    `${STUDENT_NOTIFICATIONS_API_PATH}/read-all`,
    {},
    { token },
  );
}

export function formatNotificationTime(iso: string): string {
  const date = new Date(iso);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);

  if (diffMins < 1) return "Just now";
  if (diffMins < 60) return `${diffMins}m ago`;

  const diffHours = Math.floor(diffMins / 60);
  if (diffHours < 24) return `${diffHours}h ago`;

  return date.toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
    year: date.getFullYear() !== now.getFullYear() ? "numeric" : undefined,
  });
}

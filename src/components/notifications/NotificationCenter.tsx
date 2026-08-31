"use client";

import { useCallback, useEffect, useRef, useState } from "react";

import { Button } from "@/components/ui/Button";
import { ApiError } from "@/lib/api";
import { getToken } from "@/lib/auth";
import {
  fetchNotifications,
  fetchUnreadCount,
  formatNotificationTime,
  markAllNotificationsRead,
  markNotificationRead,
  type Notification,
} from "@/lib/notifications";

function BellIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M15 17H9l-.5 2h7l-.5-2ZM18 8a6 6 0 1 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9Z"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function NotificationCenter() {
  const [open, setOpen] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  const loadNotifications = useCallback(async () => {
    const token = getToken();
    if (!token) return;

    setLoading(true);
    setError(null);

    try {
      const [items, count] = await Promise.all([
        fetchNotifications(token),
        fetchUnreadCount(token),
      ]);
      setNotifications(items);
      setUnreadCount(count);
    } catch (cause) {
      setError(cause instanceof ApiError ? cause.message : "Could not load notifications.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadNotifications();
    const interval = window.setInterval(() => {
      void loadNotifications();
    }, 60000);
    return () => window.clearInterval(interval);
  }, [loadNotifications]);

  useEffect(() => {
    if (!open) return;

    void loadNotifications();

    function handleClickOutside(event: MouseEvent) {
      if (!panelRef.current?.contains(event.target as Node)) {
        setOpen(false);
      }
    }

    function handleEscape(event: KeyboardEvent) {
      if (event.key === "Escape") setOpen(false);
    }

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleEscape);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscape);
    };
  }, [open, loadNotifications]);

  async function handleMarkRead(notification: Notification) {
    if (notification.read_at) return;

    const token = getToken();
    if (!token) return;

    try {
      const updated = await markNotificationRead(token, notification.id);
      setNotifications((current) =>
        current.map((item) => (item.id === updated.id ? updated : item)),
      );
      setUnreadCount((count) => Math.max(0, count - 1));
    } catch {
      // Keep UI responsive; next refresh will sync.
    }
  }

  async function handleMarkAllRead() {
    const token = getToken();
    if (!token) return;

    try {
      await markAllNotificationsRead(token);
      const now = new Date().toISOString();
      setNotifications((current) =>
        current.map((item) => (item.read_at ? item : { ...item, read_at: now })),
      );
      setUnreadCount(0);
    } catch (cause) {
      setError(cause instanceof ApiError ? cause.message : "Could not mark all as read.");
    }
  }

  return (
    <div className="relative" ref={panelRef}>
      <button
        type="button"
        className="border-border bg-surface text-ink-secondary hover:text-ink relative inline-flex h-10 w-10 items-center justify-center rounded-lg border transition-colors"
        aria-label={`Notifications${unreadCount > 0 ? `, ${unreadCount} unread` : ""}`}
        aria-expanded={open}
        onClick={() => setOpen((value) => !value)}
      >
        <BellIcon className="h-5 w-5" />
        {unreadCount > 0 ? (
          <span className="bg-brand text-surface absolute -top-1 -right-1 flex h-5 min-w-5 items-center justify-center rounded-full px-1 text-[10px] font-bold">
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        ) : null}
      </button>

      {open ? (
        <div className="border-border bg-surface absolute right-0 z-50 mt-2 w-[min(22rem,calc(100vw-2rem))] overflow-hidden rounded-xl border shadow-lg">
          <div className="border-border flex items-center justify-between border-b px-4 py-3">
            <div>
              <p className="text-ink text-sm font-semibold">Notifications</p>
              <p className="text-ink-muted text-xs">
                {unreadCount > 0 ? `${unreadCount} unread` : "You're all caught up"}
              </p>
            </div>
            {unreadCount > 0 ? (
              <button
                type="button"
                className="text-brand text-xs font-medium hover:underline"
                onClick={() => void handleMarkAllRead()}
              >
                Mark all read
              </button>
            ) : null}
          </div>

          <div className="max-h-96 overflow-y-auto">
            {loading && notifications.length === 0 ? (
              <p className="text-ink-muted px-4 py-8 text-center text-sm">Loading…</p>
            ) : null}

            {error ? (
              <p
                className="bg-danger-bg text-danger m-3 rounded-lg px-3 py-2 text-xs"
                role="alert"
              >
                {error}
              </p>
            ) : null}

            {!loading && notifications.length === 0 ? (
              <p className="text-ink-muted px-4 py-8 text-center text-sm">
                No notifications yet.
              </p>
            ) : null}

            <ul>
              {notifications.map((notification) => {
                const unread = !notification.read_at;

                return (
                  <li key={notification.id} className="border-border border-b last:border-b-0">
                    <button
                      type="button"
                      className={`hover:bg-surface-raised w-full px-4 py-3 text-left transition-colors ${
                        unread ? "bg-baby-wash/40" : ""
                      }`}
                      onClick={() => void handleMarkRead(notification)}
                    >
                      <div className="flex items-start justify-between gap-3">
                        <p className="text-ink text-sm font-medium">{notification.title}</p>
                        {unread ? (
                          <span
                            className="bg-brand mt-1 h-2 w-2 shrink-0 rounded-full"
                            aria-hidden
                          />
                        ) : null}
                      </div>
                      <p className="text-ink-secondary mt-1 text-sm leading-relaxed">
                        {notification.body}
                      </p>
                      <p className="text-ink-muted mt-2 text-xs">
                        {formatNotificationTime(notification.created_at)}
                      </p>
                    </button>
                  </li>
                );
              })}
            </ul>
          </div>

          <div className="border-border border-t px-4 py-3">
            <Button
              variant="secondary"
              className="w-full"
              onClick={() => void loadNotifications()}
            >
              Refresh
            </Button>
          </div>
        </div>
      ) : null}
    </div>
  );
}

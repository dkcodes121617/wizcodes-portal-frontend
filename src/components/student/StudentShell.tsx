"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState, type ReactNode } from "react";

import { NotificationCenter } from "@/components/notifications/NotificationCenter";
import { Button } from "@/components/ui/Button";
import { ApiError, api } from "@/lib/api";
import { clearToken, getToken, type StudentProfile } from "@/lib/auth";

export function StudentShell({ children }: { children: ReactNode }) {
  const router = useRouter();
  const [student, setStudent] = useState<StudentProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function guard() {
      const token = getToken();
      if (!token) {
        router.replace("/login");
        return;
      }

      try {
        const profile = await api.get<StudentProfile>("/api/v1/auth/student/me", { token });
        if (!cancelled) setStudent(profile);
      } catch (cause) {
        if (cancelled) return;
        clearToken();
        if (cause instanceof ApiError && cause.status === 401) {
          router.replace("/login");
          return;
        }
        setError(cause instanceof ApiError ? cause.message : "Could not verify your session.");
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    void guard();

    return () => {
      cancelled = true;
    };
  }, [router]);

  function handleLogout() {
    clearToken();
    router.replace("/login");
  }

  if (loading) {
    return (
      <div className="flex min-h-full flex-1 items-center justify-center px-6 py-16">
        <p className="text-ink-secondary text-sm">Loading…</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-full flex-1 items-center justify-center px-6 py-16">
        <p className="bg-danger-bg text-danger rounded-lg px-4 py-3 text-sm" role="alert">
          {error}
        </p>
      </div>
    );
  }

  return (
    <div className="flex min-h-full flex-1 flex-col">
      <header className="border-border bg-surface sticky top-0 z-40 border-b">
        <div className="mx-auto flex max-w-5xl items-center justify-between gap-4 px-6 py-4">
          <div className="min-w-0">
            <Link href="/dashboard" className="text-xl font-bold tracking-tight">
              <span className="text-wordmark-wiz">Wiz</span>
              <span className="text-wordmark-codes">Codes</span>
            </Link>
            {student ? (
              <p className="text-ink-muted mt-0.5 truncate text-xs">
                Signed in as {student.name}
              </p>
            ) : null}
          </div>

          <div className="flex items-center gap-3">
            <NotificationCenter />
            <Button variant="secondary" onClick={handleLogout}>
              Log out
            </Button>
          </div>
        </div>
      </header>

      <div className="flex flex-1 flex-col">{children}</div>
    </div>
  );
}

"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import { Button } from "@/components/ui/Button";
import { ApiError } from "@/lib/api";
import { api } from "@/lib/api";
import { clearToken, getToken, type StudentProfile } from "@/lib/auth";

export default function DashboardPage() {
  const router = useRouter();
  const [student, setStudent] = useState<StudentProfile | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = getToken();
    if (!token) {
      router.replace("/login");
      return;
    }

    const authToken = token;
    let cancelled = false;

    async function loadProfile() {
      try {
        const profile = await api.get<StudentProfile>("/api/v1/auth/student/me", {
          token: authToken,
        });
        if (!cancelled) setStudent(profile);
      } catch (cause) {
        if (cancelled) return;
        clearToken();
        if (cause instanceof ApiError && cause.status === 401) {
          router.replace("/login");
          return;
        }
        setError(cause instanceof ApiError ? cause.message : "Could not load your profile.");
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    void loadProfile();

    return () => {
      cancelled = true;
    };
  }, [router]);

  function handleLogout() {
    clearToken();
    router.push("/login");
  }

  if (loading) {
    return (
      <main className="flex flex-1 items-center justify-center px-6 py-16">
        <p className="text-ink-secondary text-sm">Loading your dashboard…</p>
      </main>
    );
  }

  if (error) {
    return (
      <main className="flex flex-1 items-center justify-center px-6 py-16">
        <div className="border-border bg-surface w-full max-w-md rounded-2xl border p-10 text-center">
          <p className="text-danger text-sm">{error}</p>
          <Button className="mt-6" onClick={() => router.push("/login")}>
            Back to login
          </Button>
        </div>
      </main>
    );
  }

  return (
    <main className="flex flex-1 items-center justify-center px-6 py-16">
      <div className="border-border bg-surface w-full max-w-xl rounded-2xl border p-10 text-center shadow-sm">
        <p className="text-ink-muted text-xs font-medium tracking-[0.2em] uppercase">
          Student dashboard
        </p>
        <h1 className="mt-4 text-3xl font-semibold tracking-tight">
          Welcome, {student?.name ?? "student"}
        </h1>
        <p className="text-ink-secondary mt-3 text-sm">
          You are signed in. Enrollment features will appear here later.
        </p>
        <div className="bg-brand-gradient mx-auto mt-8 h-1 w-24 rounded-full" />
        <Button variant="secondary" className="mt-8" onClick={handleLogout}>
          Log out
        </Button>
      </div>
    </main>
  );
}

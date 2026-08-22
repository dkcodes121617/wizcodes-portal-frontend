"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState, type ReactNode } from "react";

import { Button } from "@/components/ui/Button";
import { ApiError } from "@/lib/api";
import {
  clearAdminToken,
  fetchAdminProfile,
  getAdminToken,
  type AdminProfile,
} from "@/lib/admin-auth";

const NAV_ITEMS = [
  { href: "/admin/students", label: "Students" },
  { href: "/admin/submissions", label: "Submissions" },
  { href: "/admin/plans", label: "Plans" },
  { href: "/admin/tasks", label: "Tasks" },
] as const;

function navClass(active: boolean): string {
  return active
    ? "bg-surface-raised text-ink font-medium"
    : "text-ink-secondary hover:bg-surface-raised hover:text-ink";
}

export function AdminShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [admin, setAdmin] = useState<AdminProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function guard() {
      const token = getAdminToken();
      if (!token) {
        router.replace("/admin/login");
        return;
      }

      try {
        const profile = await fetchAdminProfile(token);
        if (!cancelled) setAdmin(profile);
      } catch (cause) {
        if (cancelled) return;
        clearAdminToken();
        if (cause instanceof ApiError && cause.status === 401) {
          router.replace("/admin/login");
          return;
        }
        setError(cause instanceof ApiError ? cause.message : "Could not verify admin session.");
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
    clearAdminToken();
    router.replace("/admin/login");
  }

  if (loading) {
    return (
      <div className="flex min-h-full flex-1 items-center justify-center px-6 py-16">
        <p className="text-ink-secondary text-sm">Loading admin panel…</p>
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
    <div className="flex min-h-full flex-1">
      <aside className="border-border bg-surface w-56 shrink-0 border-r px-4 py-6">
        <p className="text-ink-muted px-3 text-xs font-medium tracking-wide uppercase">
          WizCodes Admin
        </p>
        {admin ? (
          <p className="text-ink-secondary mt-2 px-3 text-xs">
            {admin.name}
            <span className="text-ink-muted block">{admin.email}</span>
          </p>
        ) : null}

        <nav className="mt-6 space-y-1">
          {NAV_ITEMS.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`block rounded-lg px-3 py-2 text-sm transition-colors ${navClass(pathname === item.href)}`}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="mt-8 px-3">
          <Button variant="secondary" className="w-full" onClick={handleLogout}>
            Log out
          </Button>
        </div>
      </aside>

      <main className="flex-1 px-6 py-8">{children}</main>
    </div>
  );
}

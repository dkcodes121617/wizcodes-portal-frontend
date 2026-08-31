"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import {
  AccessGrantedSection,
  LockedTasksSection,
} from "@/components/dashboard/DashboardSections";
import { EnrollmentSummary } from "@/components/dashboard/EnrollmentSummary";
import { PaymentSection } from "@/components/dashboard/PaymentSection";
import { StudentTaskList } from "@/components/dashboard/StudentTaskList";
import { Button } from "@/components/ui/Button";
import { ApiError, api } from "@/lib/api";
import { clearToken, getToken, type StudentProfile } from "@/lib/auth";
import {
  fetchActiveDomains,
  fetchActiveInternshipPlans,
  isStudentEnrolled,
  resolveDomainName,
  resolvePlanLabel,
  type DomainOption,
  type InternshipPlanOption,
} from "@/lib/enrollment";
import { PAYMENT_ACCESS_GRANTED, PAYMENT_ACCESS_PENDING } from "@/lib/payment";

export default function DashboardPage() {
  const router = useRouter();
  const [student, setStudent] = useState<StudentProfile | null>(null);
  const [domains, setDomains] = useState<DomainOption[]>([]);
  const [plans, setPlans] = useState<InternshipPlanOption[]>([]);
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
        if (cancelled) return;

        if (!isStudentEnrolled(profile)) {
          router.replace("/enroll");
          return;
        }

        const [plansResult, domainsResult] = await Promise.allSettled([
          fetchActiveInternshipPlans(),
          fetchActiveDomains(),
        ]);

        if (!cancelled) {
          if (plansResult.status === "fulfilled") setPlans(plansResult.value);
          if (domainsResult.status === "fulfilled") setDomains(domainsResult.value);
          setStudent(profile);
        }
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

  const domainLabel =
    resolveDomainName(student?.domain_id ?? null, domains) ?? student?.domain_id ?? "—";
  const planLabel =
    resolvePlanLabel(student?.internship_plan_id ?? null, plans) ??
    student?.internship_plan_id ??
    "—";

  const accessPending = student?.access_status === PAYMENT_ACCESS_PENDING;
  const accessGranted = student?.access_status === PAYMENT_ACCESS_GRANTED;

  const subtitle = accessGranted
    ? "Your access is active. Review your enrollment below and check your assigned tasks."
    : "Complete payment verification below. Your tasks unlock once an admin approves your screenshot.";

  return (
    <main className="flex flex-1 justify-center px-6 py-16">
      <div className="border-border bg-surface w-full max-w-xl rounded-2xl border p-10 shadow-sm">
        <div className="text-center">
          <p className="text-ink-muted text-xs font-medium tracking-[0.2em] uppercase">
            Student dashboard
          </p>
          <h1 className="mt-4 text-3xl font-semibold tracking-tight">
            Welcome, {student?.name ?? "student"}
          </h1>
          <p className="text-ink-secondary mt-3 text-sm">{subtitle}</p>
        </div>

        <div className="mt-8">
          <EnrollmentSummary
            domainLabel={domainLabel}
            planLabel={planLabel}
            durationWeeks={student?.chosen_duration_weeks ?? null}
            college={student?.college ?? null}
          />
        </div>

        {accessPending && student ? (
          <>
            <PaymentSection student={student} onStudentUpdated={setStudent} />
            <LockedTasksSection />
          </>
        ) : null}

        {accessGranted ? (
          <>
            <AccessGrantedSection />
            <StudentTaskList />
          </>
        ) : null}
      </div>
    </main>
  );
}

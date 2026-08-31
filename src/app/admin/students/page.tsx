"use client";

import { useEffect, useMemo, useState } from "react";

import { StudentDetailPanel } from "@/components/admin/StudentDetailPanel";
import { Button } from "@/components/ui/Button";
import { ApiError } from "@/lib/api";
import { getAdminToken } from "@/lib/admin-auth";
import { fetchAdminPlans, formatPlanTier, type InternshipPlan } from "@/lib/admin-plans";
import {
  fetchAdminStudents,
  fetchStudentAssignments,
  hasPaymentScreenshot,
  type AdminStudent,
  type StudentAccessStatus,
} from "@/lib/admin-students";
import { fetchActiveDomains, type DomainOption } from "@/lib/enrollment";
import {
  formatProgressLabel,
  summarizeTaskProgress,
  type StudentTaskAssignment,
} from "@/lib/tasks";

type AccessFilter = "pending" | "granted";

function PaymentBadge({ uploaded }: { uploaded: boolean }) {
  return (
    <span
      className={`rounded-full px-2.5 py-1 text-xs font-medium ${uploaded ? "bg-success-bg text-success" : "bg-warning-bg text-warning"}`}
    >
      {uploaded ? "Uploaded" : "Missing"}
    </span>
  );
}

function ProgressBadge({ assignments }: { assignments: StudentTaskAssignment[] | null }) {
  if (assignments === null) {
    return <span className="text-ink-muted text-xs">…</span>;
  }

  const summary = summarizeTaskProgress(assignments);

  if (summary.total === 0) {
    return <span className="text-ink-muted text-xs">No tasks</span>;
  }

  const tone = summary.readyForCertificate
    ? "bg-success-bg text-success"
    : summary.completionPercent > 0 || summary.submitted > 0
      ? "bg-warning-bg text-warning"
      : "bg-surface-raised text-ink-muted";

  return (
    <span className={`rounded-full px-2.5 py-1 text-xs font-medium ${tone}`}>
      {formatProgressLabel(summary)}
    </span>
  );
}

export default function AdminStudentsPage() {
  const [students, setStudents] = useState<AdminStudent[]>([]);
  const [plans, setPlans] = useState<InternshipPlan[]>([]);
  const [domains, setDomains] = useState<DomainOption[]>([]);
  const [assignmentMap, setAssignmentMap] = useState<
    Record<string, StudentTaskAssignment[] | null>
  >({});
  const [accessFilter, setAccessFilter] = useState<AccessFilter>("pending");
  const [selectedStudentId, setSelectedStudentId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const planLabelById = useMemo(
    () => new Map(plans.map((plan) => [plan.id, formatPlanTier(plan.tier)])),
    [plans],
  );

  const domainLabelById = useMemo(
    () => new Map(domains.map((domain) => [domain.id, domain.name])),
    [domains],
  );

  const selectedStudent = students.find((student) => student.id === selectedStudentId) ?? null;

  useEffect(() => {
    let cancelled = false;

    async function loadPlansAndDomains() {
      const token = getAdminToken();
      if (!token) return;

      try {
        const [plansData, domainsData] = await Promise.all([
          fetchAdminPlans(token),
          fetchActiveDomains(),
        ]);
        if (!cancelled) {
          setPlans(plansData);
          setDomains(domainsData);
        }
      } catch {
        // Labels only; list still works without them.
      }
    }

    void loadPlansAndDomains();

    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    let cancelled = false;

    async function loadStudents() {
      const token = getAdminToken();
      if (!token) return;

      setLoading(true);
      setError(null);
      try {
        const data = await fetchAdminStudents(token, accessFilter as StudentAccessStatus);
        if (!cancelled) {
          setStudents(data);
          setSelectedStudentId((current) =>
            current && data.some((student) => student.id === current) ? current : null,
          );

          if (accessFilter === "granted" && token) {
            const progressEntries = await Promise.all(
              data.map(async (student) => {
                try {
                  const assignments = await fetchStudentAssignments(token, student.id);
                  return [student.id, assignments] as const;
                } catch {
                  return [student.id, []] as const;
                }
              }),
            );
            if (!cancelled) {
              setAssignmentMap(Object.fromEntries(progressEntries));
            }
          } else if (!cancelled) {
            setAssignmentMap({});
          }
        }
      } catch (cause) {
        if (!cancelled) {
          setError(cause instanceof ApiError ? cause.message : "Could not load students.");
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    void loadStudents();

    return () => {
      cancelled = true;
    };
  }, [accessFilter]);

  function handleStudentUpdated(updated: AdminStudent) {
    setStudents((current) =>
      current.map((student) => (student.id === updated.id ? updated : student)),
    );
    if (accessFilter === "pending" && updated.access_status === "granted") {
      setSelectedStudentId(updated.id);
    }
  }

  function handleAssignmentsUpdated(studentId: string, assignments: StudentTaskAssignment[]) {
    setAssignmentMap((current) => ({ ...current, [studentId]: assignments }));
  }

  return (
    <div className="mx-auto flex h-[calc(100vh-4rem)] max-w-7xl gap-0">
      <div className="flex min-w-0 flex-1 flex-col">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <h1 className="text-ink text-2xl font-semibold tracking-tight">Students</h1>
            <p className="text-ink-secondary mt-1 text-sm">
              Review payments, track internship progress, and manage Premium task assignment.
            </p>
          </div>

          <div className="flex gap-2">
            <Button
              variant={accessFilter === "pending" ? "primary" : "secondary"}
              onClick={() => setAccessFilter("pending")}
            >
              Pending
            </Button>
            <Button
              variant={accessFilter === "granted" ? "primary" : "secondary"}
              onClick={() => setAccessFilter("granted")}
            >
              Granted
            </Button>
          </div>
        </div>

        <section className="border-border mt-6 flex-1 overflow-hidden rounded-xl border">
          {loading ? (
            <p className="text-ink-secondary px-5 py-6 text-sm">Loading students…</p>
          ) : error ? (
            <p
              className="bg-danger-bg text-danger m-5 rounded-lg px-4 py-3 text-sm"
              role="alert"
            >
              {error}
            </p>
          ) : students.length === 0 ? (
            <p className="text-ink-secondary px-5 py-6 text-sm">
              No {accessFilter} students found.
            </p>
          ) : (
            <div className="h-full overflow-auto">
              <table className="w-full min-w-[720px] text-left text-sm">
                <thead className="text-ink-muted bg-surface-raised/60 sticky top-0 text-xs uppercase">
                  <tr>
                    <th className="px-5 py-3 font-medium">Name</th>
                    <th className="px-5 py-3 font-medium">Domain</th>
                    <th className="px-5 py-3 font-medium">Plan</th>
                    <th className="px-5 py-3 font-medium">Duration</th>
                    <th className="px-5 py-3 font-medium">
                      {accessFilter === "granted" ? "Progress" : "Payment"}
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-border divide-y">
                  {students.map((student) => {
                    const selected = student.id === selectedStudentId;
                    return (
                      <tr
                        key={student.id}
                        className={`cursor-pointer transition-colors ${selected ? "bg-surface-raised" : "hover:bg-surface-raised/60"}`}
                        onClick={() => setSelectedStudentId(student.id)}
                      >
                        <td className="text-ink px-5 py-3 font-medium">{student.name}</td>
                        <td
                          className="text-ink-secondary px-5 py-3"
                          title={student.domain_id ?? undefined}
                        >
                          {student.domain_id
                            ? (domainLabelById.get(student.domain_id) ?? "Unknown domain")
                            : "—"}
                        </td>
                        <td className="text-ink-secondary px-5 py-3">
                          {student.internship_plan_id
                            ? (planLabelById.get(student.internship_plan_id) ?? "—")
                            : "—"}
                        </td>
                        <td className="text-ink-secondary px-5 py-3">
                          {student.chosen_duration_weeks
                            ? `${student.chosen_duration_weeks} wks`
                            : "—"}
                        </td>
                        <td className="px-5 py-3">
                          {accessFilter === "granted" ? (
                            <ProgressBadge assignments={assignmentMap[student.id] ?? null} />
                          ) : (
                            <PaymentBadge uploaded={hasPaymentScreenshot(student)} />
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </div>

      {selectedStudent ? (
        <StudentDetailPanel
          key={`${selectedStudent.id}-${selectedStudent.access_status}-${selectedStudent.updated_at}`}
          student={selectedStudent}
          plans={plans}
          domains={domains}
          onStudentUpdated={handleStudentUpdated}
          onAssignmentsUpdated={handleAssignmentsUpdated}
          onClose={() => setSelectedStudentId(null)}
        />
      ) : null}
    </div>
  );
}

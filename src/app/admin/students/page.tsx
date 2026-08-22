"use client";

import { useEffect, useMemo, useState } from "react";

import { StudentDetailPanel } from "@/components/admin/StudentDetailPanel";
import { Button } from "@/components/ui/Button";
import { ApiError } from "@/lib/api";
import { getAdminToken } from "@/lib/admin-auth";
import { fetchAdminPlans, formatPlanTier, type InternshipPlan } from "@/lib/admin-plans";
import {
  fetchAdminStudents,
  hasPaymentScreenshot,
  type AdminStudent,
  type StudentAccessStatus,
} from "@/lib/admin-students";
import { shortenId } from "@/lib/admin-tasks";

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

export default function AdminStudentsPage() {
  const [students, setStudents] = useState<AdminStudent[]>([]);
  const [plans, setPlans] = useState<InternshipPlan[]>([]);
  const [accessFilter, setAccessFilter] = useState<AccessFilter>("pending");
  const [selectedStudentId, setSelectedStudentId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const planLabelById = useMemo(
    () => new Map(plans.map((plan) => [plan.id, formatPlanTier(plan.tier)])),
    [plans],
  );

  const selectedStudent = students.find((student) => student.id === selectedStudentId) ?? null;

  useEffect(() => {
    let cancelled = false;

    async function loadPlans() {
      const token = getAdminToken();
      if (!token) return;

      try {
        const data = await fetchAdminPlans(token);
        if (!cancelled) setPlans(data);
      } catch {
        // Plans are only used for labels; list still works without them.
      }
    }

    void loadPlans();

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

  return (
    <div className="mx-auto flex h-[calc(100vh-4rem)] max-w-7xl gap-0">
      <div className="flex min-w-0 flex-1 flex-col">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <h1 className="text-ink text-2xl font-semibold tracking-tight">Students</h1>
            <p className="text-ink-secondary mt-1 text-sm">
              Review pending payments and manage Premium task assignment.
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
                    <th className="px-5 py-3 font-medium">Payment</th>
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
                          className="text-ink-secondary px-5 py-3 font-mono text-xs"
                          title={student.domain_id ?? undefined}
                        >
                          {student.domain_id ? shortenId(student.domain_id) : "—"}
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
                          <PaymentBadge uploaded={hasPaymentScreenshot(student)} />
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
          onStudentUpdated={handleStudentUpdated}
          onClose={() => setSelectedStudentId(null)}
        />
      ) : null}
    </div>
  );
}

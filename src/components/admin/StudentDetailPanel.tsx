"use client";

import { useEffect, useMemo, useState } from "react";

import { Button } from "@/components/ui/Button";
import { StudentTaskProgress } from "@/components/admin/StudentTaskProgress";
import { ApiError } from "@/lib/api";
import { getAdminToken } from "@/lib/admin-auth";
import { formatPlanTier, type InternshipPlan } from "@/lib/admin-plans";
import {
  assignTasksToStudent,
  fetchStudentAssignments,
  grantStudentAccess,
  hasPaymentScreenshot,
  isAccessGranted,
  type AdminStudent,
} from "@/lib/admin-students";
import { fetchPremiumAdminTasks, shortenId, type AdminTask } from "@/lib/admin-tasks";
import { resolvePaymentScreenshotUrl } from "@/lib/payment";
import { type StudentTaskAssignment } from "@/lib/tasks";

const PREMIUM_TIER = "premium_999";
const BASIC_TIER = "basic_299";

interface StudentDetailPanelProps {
  student: AdminStudent;
  plans: InternshipPlan[];
  onStudentUpdated: (student: AdminStudent) => void;
  onAssignmentsUpdated?: (studentId: string, assignments: StudentTaskAssignment[]) => void;
  onClose: () => void;
}

function planTierForStudent(student: AdminStudent, plans: InternshipPlan[]): string | null {
  if (!student.internship_plan_id) return null;
  return plans.find((plan) => plan.id === student.internship_plan_id)?.tier ?? null;
}

function isPremiumStudent(student: AdminStudent, plans: InternshipPlan[]): boolean {
  return planTierForStudent(student, plans) === PREMIUM_TIER;
}

function isBasicStudent(student: AdminStudent, plans: InternshipPlan[]): boolean {
  return planTierForStudent(student, plans) === BASIC_TIER;
}

export function StudentDetailPanel({
  student,
  plans,
  onStudentUpdated,
  onAssignmentsUpdated,
  onClose,
}: StudentDetailPanelProps) {
  const [assignments, setAssignments] = useState<StudentTaskAssignment[]>([]);
  const [premiumTasks, setPremiumTasks] = useState<AdminTask[]>([]);
  const [selectedTaskIds, setSelectedTaskIds] = useState<string[]>([]);
  const [loadingDetail, setLoadingDetail] = useState(false);
  const [granting, setGranting] = useState(false);
  const [assigning, setAssigning] = useState(false);
  const [grantSuccess, setGrantSuccess] = useState<string | null>(null);
  const [assignSuccess, setAssignSuccess] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [imageLoadFailed, setImageLoadFailed] = useState(false);

  const granted = isAccessGranted(student);
  const premium = isPremiumStudent(student, plans);
  const basic = isBasicStudent(student, plans);
  const screenshotUrl = resolvePaymentScreenshotUrl(student.payment_screenshot_url);
  const planLabel = student.internship_plan_id
    ? formatPlanTier(planTierForStudent(student, plans) ?? "")
    : "—";

  const assignedTaskIds = useMemo(
    () => new Set(assignments.map((assignment) => assignment.task_id)),
    [assignments],
  );

  useEffect(() => {
    if (!granted) return;

    let cancelled = false;
    const studentId = student.id;
    const domainId = student.domain_id;
    const studentIsPremium = isPremiumStudent(student, plans);

    async function loadGrantedData() {
      const token = getAdminToken();
      if (!token) return;

      setLoadingDetail(true);
      setError(null);
      try {
        const assignmentList = await fetchStudentAssignments(token, studentId);
        if (cancelled) return;
        setAssignments(assignmentList);
        onAssignmentsUpdated?.(studentId, assignmentList);

        if (studentIsPremium && domainId) {
          const tasks = await fetchPremiumAdminTasks(token, domainId);
          if (!cancelled) setPremiumTasks(tasks.filter((task) => task.is_active));
        } else if (!cancelled) {
          setPremiumTasks([]);
        }
      } catch (cause) {
        if (!cancelled) {
          setError(
            cause instanceof ApiError ? cause.message : "Could not load student details.",
          );
        }
      } finally {
        if (!cancelled) setLoadingDetail(false);
      }
    }

    void loadGrantedData();

    return () => {
      cancelled = true;
    };
  }, [granted, student, plans]);

  async function handleGrantAccess() {
    const token = getAdminToken();
    if (!token) return;

    setGranting(true);
    setError(null);
    setGrantSuccess(null);
    try {
      const updated = await grantStudentAccess(token, student.id);
      onStudentUpdated(updated);
      setGrantSuccess("Access granted successfully.");
    } catch (cause) {
      setError(cause instanceof ApiError ? cause.message : "Could not grant access.");
    } finally {
      setGranting(false);
    }
  }

  async function handleAssignTasks() {
    if (selectedTaskIds.length === 0) {
      setError("Select at least one task to assign.");
      return;
    }

    const token = getAdminToken();
    if (!token) return;

    setAssigning(true);
    setError(null);
    setAssignSuccess(null);
    try {
      const result = await assignTasksToStudent(token, student.id, selectedTaskIds);
      setAssignments(result.assignments);
      onAssignmentsUpdated?.(student.id, result.assignments);
      setSelectedTaskIds([]);
      setAssignSuccess(
        `Assigned ${result.newly_created} task(s)` +
          (result.already_assigned > 0
            ? ` (${result.already_assigned} already assigned).`
            : "."),
      );
    } catch (cause) {
      setError(cause instanceof ApiError ? cause.message : "Could not assign tasks.");
    } finally {
      setAssigning(false);
    }
  }

  function toggleTaskSelection(taskId: string) {
    setSelectedTaskIds((current) =>
      current.includes(taskId) ? current.filter((id) => id !== taskId) : [...current, taskId],
    );
  }

  return (
    <aside className="border-border bg-surface flex w-full max-w-xl shrink-0 flex-col border-l">
      <div className="border-border flex items-start justify-between gap-3 border-b px-5 py-4">
        <div>
          <h2 className="text-ink text-lg font-semibold">{student.name}</h2>
          <p className="text-ink-secondary mt-1 text-sm">
            {student.email ?? student.phone ?? "No contact on file"}
          </p>
        </div>
        <Button variant="ghost" onClick={onClose}>
          Close
        </Button>
      </div>

      <div className="flex-1 space-y-6 overflow-y-auto px-5 py-5">
        <section>
          <p className="text-ink-muted text-xs font-medium tracking-wide uppercase">
            Enrollment
          </p>
          <dl className="mt-3 space-y-2 text-sm">
            <div className="flex justify-between gap-4">
              <dt className="text-ink-secondary">Plan</dt>
              <dd className="text-ink text-right font-medium">{planLabel}</dd>
            </div>
            <div className="flex justify-between gap-4">
              <dt className="text-ink-secondary">Duration</dt>
              <dd className="text-ink text-right">
                {student.chosen_duration_weeks ? `${student.chosen_duration_weeks} weeks` : "—"}
              </dd>
            </div>
            <div className="flex justify-between gap-4">
              <dt className="text-ink-secondary">Domain</dt>
              <dd className="text-ink font-mono text-xs" title={student.domain_id ?? undefined}>
                {student.domain_id ? shortenId(student.domain_id) : "—"}
              </dd>
            </div>
            <div className="flex justify-between gap-4">
              <dt className="text-ink-secondary">College</dt>
              <dd className="text-ink text-right">{student.college ?? "—"}</dd>
            </div>
            <div className="flex justify-between gap-4">
              <dt className="text-ink-secondary">Year</dt>
              <dd className="text-ink text-right">{student.year_of_study ?? "—"}</dd>
            </div>
            <div className="flex justify-between gap-4">
              <dt className="text-ink-secondary">Access</dt>
              <dd className="text-ink text-right capitalize">{student.access_status}</dd>
            </div>
          </dl>
        </section>

        <section>
          <p className="text-ink-muted text-xs font-medium tracking-wide uppercase">
            Payment screenshot
          </p>
          {screenshotUrl && !imageLoadFailed ? (
            // eslint-disable-next-line @next/next/no-img-element -- admin must view the raw uploaded proof URL
            <img
              src={screenshotUrl}
              alt="Payment screenshot uploaded by student"
              className="border-border mt-3 max-h-80 w-full rounded-lg border object-contain"
              onError={() => setImageLoadFailed(true)}
            />
          ) : (
            <p className="text-ink-secondary mt-3 text-sm">
              {hasPaymentScreenshot(student)
                ? "Screenshot uploaded but could not be displayed."
                : "No payment screenshot uploaded yet."}
            </p>
          )}
        </section>

        {!granted ? (
          <section>
            <Button
              className="w-full"
              loading={granting}
              disabled={granting || !hasPaymentScreenshot(student)}
              onClick={() => void handleGrantAccess()}
            >
              Grant access
            </Button>
            {!hasPaymentScreenshot(student) ? (
              <p className="text-ink-muted mt-2 text-xs">
                A payment screenshot is required before access can be granted.
              </p>
            ) : null}
          </section>
        ) : (
          <p className="bg-success-bg text-success rounded-lg px-4 py-3 text-sm">
            Access already granted.
          </p>
        )}

        {grantSuccess ? (
          <p className="bg-success-bg text-success rounded-lg px-4 py-3 text-sm" role="status">
            {grantSuccess}
          </p>
        ) : null}

        {error ? (
          <p className="bg-danger-bg text-danger rounded-lg px-4 py-3 text-sm" role="alert">
            {error}
          </p>
        ) : null}

        {granted ? (
          <StudentTaskProgress assignments={assignments} loading={loadingDetail} />
        ) : null}

        {granted && basic ? (
          <section>
            <p className="text-ink-muted text-xs font-medium tracking-wide uppercase">
              Basic plan notes
            </p>
            <p className="text-ink-secondary mt-2 text-sm">
              Basic plans are assigned automatically when access is granted.
            </p>
          </section>
        ) : null}

        {granted && premium ? (
          <section>
            <p className="text-ink-muted text-xs font-medium tracking-wide uppercase">
              Premium task assignment
            </p>
            <p className="text-ink-secondary mt-2 text-sm">
              Select Premium tasks for this student&apos;s domain, then assign manually.
            </p>

            {loadingDetail ? (
              <p className="text-ink-secondary mt-3 text-sm">Loading tasks…</p>
            ) : premiumTasks.length === 0 ? (
              <p className="text-ink-secondary mt-3 text-sm">
                No active Premium tasks found for this domain.
              </p>
            ) : (
              <ul className="mt-3 space-y-2">
                {premiumTasks.map((task) => {
                  const alreadyAssigned = assignedTaskIds.has(task.id);
                  const checked = selectedTaskIds.includes(task.id);
                  return (
                    <li
                      key={task.id}
                      className={`border-border rounded-lg border px-4 py-3 text-sm ${alreadyAssigned ? "bg-surface-raised/80 opacity-80" : ""}`}
                    >
                      <label className="flex cursor-pointer items-start gap-3">
                        <input
                          type="checkbox"
                          className="mt-1"
                          checked={checked}
                          disabled={alreadyAssigned || assigning}
                          onChange={() => toggleTaskSelection(task.id)}
                        />
                        <span className="flex-1">
                          <span className="text-ink font-medium">{task.title}</span>
                          {alreadyAssigned ? (
                            <span className="bg-success-bg text-success ml-2 rounded-full px-2 py-0.5 text-xs font-medium">
                              Already assigned
                            </span>
                          ) : null}
                          <span className="text-ink-secondary mt-1 block text-xs">
                            {task.description}
                          </span>
                        </span>
                      </label>
                    </li>
                  );
                })}
              </ul>
            )}

            <Button
              className="mt-4 w-full"
              loading={assigning}
              disabled={assigning || selectedTaskIds.length === 0}
              onClick={() => void handleAssignTasks()}
            >
              Assign selected tasks
            </Button>

            {assignSuccess ? (
              <p
                className="bg-success-bg text-success mt-3 rounded-lg px-4 py-3 text-sm"
                role="status"
              >
                {assignSuccess}
              </p>
            ) : null}
          </section>
        ) : null}
      </div>
    </aside>
  );
}

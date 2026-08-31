"use client";

import {
  formatAssignmentStatus,
  statusBadgeClasses,
  summarizeTaskProgress,
  type AssignmentStatus,
  type StudentTaskAssignment,
  type TaskProgressSummary,
} from "@/lib/tasks";

function ProgressBar({ summary }: { summary: TaskProgressSummary }) {
  if (summary.total === 0) return null;

  const completedWidth = (summary.completed / summary.total) * 100;
  const submittedWidth = (summary.submitted / summary.total) * 100;

  return (
    <div className="bg-surface-raised h-2.5 w-full overflow-hidden rounded-full">
      <div className="flex h-full w-full">
        <div className="bg-success h-full transition-all" style={{ width: `${completedWidth}%` }} />
        <div
          className="bg-warning h-full transition-all"
          style={{ width: `${submittedWidth}%` }}
        />
      </div>
    </div>
  );
}

function formatSubmittedAt(value: string | null): string {
  if (!value) return "—";
  return new Date(value).toLocaleString();
}

export function StudentTaskProgress({
  assignments,
  loading,
}: {
  assignments: StudentTaskAssignment[];
  loading?: boolean;
}) {
  const summary = summarizeTaskProgress(assignments);

  if (loading) {
    return <p className="text-ink-secondary text-sm">Loading task progress…</p>;
  }

  return (
    <section className="space-y-4">
      <div>
        <p className="text-ink-muted text-xs font-medium tracking-wide uppercase">
          Internship progress
        </p>

        {summary.total === 0 ? (
          <p className="text-ink-secondary mt-3 text-sm">No tasks assigned yet.</p>
        ) : (
          <div className="mt-3 space-y-3">
            <div className="flex flex-wrap items-end justify-between gap-3">
              <div>
                <p className="text-ink text-3xl font-semibold tracking-tight">
                  {summary.completionPercent}%
                </p>
                <p className="text-ink-secondary mt-1 text-sm">
                  {summary.completed} of {summary.total} tasks completed
                </p>
              </div>
              {summary.readyForCertificate ? (
                <span className="bg-success-bg text-success rounded-full px-3 py-1 text-xs font-medium">
                  Ready for certificate
                </span>
              ) : summary.submissionPercent > summary.completionPercent ? (
                <span className="bg-warning-bg text-warning rounded-full px-3 py-1 text-xs font-medium">
                  {summary.submissionPercent}% submitted — review pending
                </span>
              ) : null}
            </div>

            <ProgressBar summary={summary} />

            <div className="text-ink-muted flex flex-wrap gap-x-4 gap-y-1 text-xs">
              <span>
                <span className="bg-success mr-1.5 inline-block h-2 w-2 rounded-full" />
                Completed {summary.completed}
              </span>
              <span>
                <span className="bg-warning mr-1.5 inline-block h-2 w-2 rounded-full" />
                Submitted {summary.submitted}
              </span>
              <span>
                <span className="bg-surface-raised border-border mr-1.5 inline-block h-2 w-2 rounded-full border" />
                In progress {summary.inProgress + summary.assigned}
              </span>
            </div>
          </div>
        )}
      </div>

      {assignments.length > 0 ? (
        <ul className="space-y-2">
          {assignments.map((assignment) => {
            const status = assignment.status as AssignmentStatus;
            return (
              <li
                key={assignment.id}
                className="border-border rounded-lg border px-4 py-3 text-sm"
              >
                <div className="flex flex-wrap items-start justify-between gap-2">
                  <p className="text-ink font-medium">{assignment.task.title}</p>
                  <span
                    className={`rounded-full px-2.5 py-1 text-xs font-medium ${statusBadgeClasses(status)}`}
                  >
                    {formatAssignmentStatus(status)}
                  </span>
                </div>

                {assignment.submission_link ? (
                  <div className="mt-2">
                    <a
                      href={assignment.submission_link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-brand hover:text-brand-strong text-xs break-all"
                    >
                      View submission
                    </a>
                    <p className="text-ink-muted mt-1 text-xs">
                      Submitted {formatSubmittedAt(assignment.submitted_at)}
                    </p>
                  </div>
                ) : (
                  <p className="text-ink-muted mt-2 text-xs">No submission yet</p>
                )}

                {assignment.admin_feedback ? (
                  <p className="text-ink-secondary bg-surface-raised mt-2 rounded-md px-3 py-2 text-xs">
                    Feedback: {assignment.admin_feedback}
                  </p>
                ) : null}
              </li>
            );
          })}
        </ul>
      ) : null}
    </section>
  );
}

"use client";

import { FormEvent, useEffect, useState } from "react";

import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { ApiError } from "@/lib/api";
import { getToken } from "@/lib/auth";
import {
  fetchMyTasks,
  formatAssignmentStatus,
  statusBadgeClasses,
  submitTaskAssignment,
  validateSubmissionLink,
  type AssignmentStatus,
  type StudentTaskAssignment,
} from "@/lib/tasks";

function SubmissionLink({ href, label = "Your submission" }: { href: string; label?: string }) {
  return (
    <div>
      <p className="text-ink-muted text-xs font-medium tracking-wide uppercase">{label}</p>
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className="text-brand hover:text-brand-strong mt-1 inline-block text-sm break-all"
      >
        {href}
      </a>
    </div>
  );
}

function TaskCard({
  assignment,
  onUpdated,
}: {
  assignment: StudentTaskAssignment;
  onUpdated: (updated: StudentTaskAssignment) => void;
}) {
  const [link, setLink] = useState(assignment.submission_link ?? "");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const status = assignment.status as AssignmentStatus;
  const canSubmit = status === "assigned" || status === "in_progress" || status === "submitted";

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const validationError = validateSubmissionLink(link);
    if (validationError) {
      setError(validationError);
      return;
    }

    const token = getToken();
    if (!token) {
      setError("You are not signed in.");
      return;
    }

    setSubmitting(true);
    setError(null);

    try {
      const updated = await submitTaskAssignment(assignment.id, link.trim(), token);
      onUpdated(updated);
    } catch (cause) {
      setError(
        cause instanceof ApiError ? cause.message : "Submission failed. Please try again.",
      );
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <article className="border-border rounded-xl border px-5 py-4">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <h3 className="text-ink text-base font-semibold">{assignment.task.title}</h3>
        <span
          className={`rounded-full px-2.5 py-1 text-xs font-medium ${statusBadgeClasses(status)}`}
        >
          {formatAssignmentStatus(status)}
        </span>
      </div>

      <p className="text-ink-secondary mt-3 text-sm leading-relaxed">
        {assignment.task.description}
      </p>

      <p className="text-ink-muted mt-3 text-xs font-medium tracking-wide uppercase">Stack</p>
      <p className="text-ink mt-1 text-sm">{assignment.task.stack}</p>

      {status === "submitted" ? (
        <p className="text-ink-secondary mt-4 text-sm">Submitted — waiting for review.</p>
      ) : null}

      {status === "completed" && assignment.submission_link ? (
        <div className="mt-4">
          <SubmissionLink href={assignment.submission_link} />
        </div>
      ) : null}

      {status === "completed" && assignment.admin_feedback ? (
        <div className="border-border bg-surface-raised mt-4 rounded-lg border px-4 py-3 text-left">
          <p className="text-ink-muted text-xs font-medium tracking-wide uppercase">
            Admin feedback
          </p>
          <p className="text-ink-secondary mt-2 text-sm">{assignment.admin_feedback}</p>
        </div>
      ) : null}

      {canSubmit ? (
        <form
          className="mt-4 space-y-3"
          onSubmit={(event) => void handleSubmit(event)}
          noValidate
        >
          {assignment.submission_link && status === "submitted" ? (
            <SubmissionLink href={assignment.submission_link} label="Current submission" />
          ) : null}

          <Input
            label={assignment.submission_link ? "Update submission link" : "Submission link"}
            name={`submission-${assignment.id}`}
            type="url"
            placeholder="https://your-project.example.com or deployment URL"
            value={link}
            onChange={(event) => {
              setLink(event.target.value);
              setError(null);
            }}
            error={error ?? undefined}
            disabled={submitting}
            required
          />

          <Button type="submit" className="w-full" loading={submitting} disabled={submitting}>
            {assignment.submission_link ? "Update submission" : "Submit"}
          </Button>
        </form>
      ) : null}
    </article>
  );
}

export function StudentTaskList() {
  const [tasks, setTasks] = useState<StudentTaskAssignment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function loadTasks() {
      const token = getToken();
      if (!token) {
        if (!cancelled) {
          setError("You are not signed in.");
          setLoading(false);
        }
        return;
      }

      try {
        const assignments = await fetchMyTasks(token);
        if (!cancelled) setTasks(assignments);
      } catch (cause) {
        if (!cancelled) {
          setError(cause instanceof ApiError ? cause.message : "Could not load your tasks.");
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    void loadTasks();

    return () => {
      cancelled = true;
    };
  }, []);

  function handleTaskUpdated(updated: StudentTaskAssignment) {
    setTasks((current) => current.map((task) => (task.id === updated.id ? updated : task)));
  }

  return (
    <section className="border-border mt-8 rounded-xl border px-5 py-6 text-left">
      <p className="text-ink-muted text-xs font-medium tracking-wide uppercase">
        Your assigned tasks
      </p>

      {loading ? (
        <p className="text-ink-secondary mt-4 text-sm">Loading your tasks…</p>
      ) : error ? (
        <p className="bg-danger-bg text-danger mt-4 rounded-lg px-4 py-3 text-sm" role="alert">
          {error}
        </p>
      ) : tasks.length === 0 ? (
        <p className="text-ink-secondary mt-4 text-sm">
          Your tasks are being prepared — check back shortly.
        </p>
      ) : (
        <div className="mt-4 space-y-4">
          {tasks.map((assignment) => (
            <TaskCard
              key={`${assignment.id}-${assignment.status}-${assignment.submission_link ?? ""}`}
              assignment={assignment}
              onUpdated={handleTaskUpdated}
            />
          ))}
        </div>
      )}
    </section>
  );
}

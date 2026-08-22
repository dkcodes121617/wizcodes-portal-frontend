"use client";

import { useEffect, useState } from "react";

import { Button } from "@/components/ui/Button";
import { ApiError } from "@/lib/api";
import { getAdminToken } from "@/lib/admin-auth";
import {
  fetchSubmittedAssignments,
  formatSubmittedAt,
  reviewAssignment,
  type ReviewActionStatus,
  type SubmissionQueueItem,
} from "@/lib/admin-submissions";

function ReviewPanel({
  item,
  onReviewed,
  onClose,
}: {
  item: SubmissionQueueItem;
  onReviewed: (assignmentId: string) => void;
  onClose: () => void;
}) {
  const [feedback, setFeedback] = useState("");
  const [submitting, setSubmitting] = useState<ReviewActionStatus | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  async function handleReview(status: ReviewActionStatus) {
    const token = getAdminToken();
    if (!token) return;

    setSubmitting(status);
    setError(null);
    setSuccess(null);

    try {
      await reviewAssignment(
        item.id,
        {
          status,
          admin_feedback: feedback.trim() || null,
        },
        token,
      );
      setSuccess(
        status === "completed"
          ? "Marked as completed."
          : "Sent back to the student as in progress.",
      );
      onReviewed(item.id);
    } catch (cause) {
      setError(cause instanceof ApiError ? cause.message : "Review action failed.");
    } finally {
      setSubmitting(null);
    }
  }

  return (
    <aside className="border-border bg-surface flex w-full max-w-lg shrink-0 flex-col border-l">
      <div className="border-border flex items-start justify-between gap-3 border-b px-5 py-4">
        <div>
          <h2 className="text-ink text-lg font-semibold">Review submission</h2>
          <p className="text-ink-secondary mt-1 text-sm">{item.student_name}</p>
        </div>
        <Button variant="ghost" onClick={onClose}>
          Close
        </Button>
      </div>

      <div className="flex-1 space-y-5 overflow-y-auto px-5 py-5">
        <section>
          <p className="text-ink-muted text-xs font-medium tracking-wide uppercase">Task</p>
          <p className="text-ink mt-2 font-medium">{item.task.title}</p>
          <p className="text-ink-secondary mt-2 text-sm">{item.task.description}</p>
        </section>

        <section>
          <p className="text-ink-muted text-xs font-medium tracking-wide uppercase">Submission</p>
          {item.submission_link ? (
            <a
              href={item.submission_link}
              target="_blank"
              rel="noopener noreferrer"
              className="text-brand hover:text-brand-strong mt-2 inline-block break-all text-sm"
            >
              {item.submission_link}
            </a>
          ) : (
            <p className="text-ink-secondary mt-2 text-sm">No submission link on record.</p>
          )}
          <p className="text-ink-muted mt-2 text-xs">
            Submitted {formatSubmittedAt(item.submitted_at)}
          </p>
        </section>

        <section>
          <label htmlFor="admin-feedback" className="text-ink text-sm font-medium">
            Feedback (optional)
          </label>
          <textarea
            id="admin-feedback"
            className="border-border bg-surface text-ink placeholder:text-ink-muted focus:border-brand mt-2 min-h-28 w-full rounded-lg border px-4 py-2.5 text-sm transition-colors outline-none focus:ring-2 focus:ring-[color-mix(in_srgb,var(--color-brand)_25%,transparent)]"
            placeholder="Notes for the student — especially useful when sending back for rework."
            value={feedback}
            onChange={(event) => setFeedback(event.target.value)}
            disabled={submitting !== null}
          />
        </section>

        {error ? (
          <p className="bg-danger-bg text-danger rounded-lg px-4 py-3 text-sm" role="alert">
            {error}
          </p>
        ) : null}

        {success ? (
          <p className="bg-success-bg text-success rounded-lg px-4 py-3 text-sm" role="status">
            {success}
          </p>
        ) : null}

        <div className="space-y-3">
          <Button
            className="w-full"
            loading={submitting === "completed"}
            disabled={submitting !== null}
            onClick={() => void handleReview("completed")}
          >
            Mark completed
          </Button>
          <Button
            variant="secondary"
            className="w-full"
            loading={submitting === "in_progress"}
            disabled={submitting !== null}
            onClick={() => void handleReview("in_progress")}
          >
            Send back as in progress
          </Button>
        </div>
      </div>
    </aside>
  );
}

export default function AdminSubmissionsPage() {
  const [items, setItems] = useState<SubmissionQueueItem[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const selectedItem = items.find((item) => item.id === selectedId) ?? null;

  async function reloadQueue() {
    const token = getAdminToken();
    if (!token) return;

    setLoading(true);
    setError(null);
    try {
      const data = await fetchSubmittedAssignments(token);
      setItems(data);
      setSelectedId((current) => (current && data.some((item) => item.id === current) ? current : null));
    } catch (cause) {
      setError(cause instanceof ApiError ? cause.message : "Could not load submissions.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    let cancelled = false;

    async function load() {
      const token = getAdminToken();
      if (!token) return;

      setLoading(true);
      setError(null);
      try {
        const data = await fetchSubmittedAssignments(token);
        if (!cancelled) setItems(data);
      } catch (cause) {
        if (!cancelled) {
          setError(cause instanceof ApiError ? cause.message : "Could not load submissions.");
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    void load();

    return () => {
      cancelled = true;
    };
  }, []);

  function handleReviewed(assignmentId: string) {
    setItems((current) => current.filter((item) => item.id !== assignmentId));
    setSelectedId(null);
  }

  return (
    <div className="mx-auto flex h-[calc(100vh-4rem)] max-w-7xl gap-0">
      <div className="flex min-w-0 flex-1 flex-col">
        <div>
          <h1 className="text-ink text-2xl font-semibold tracking-tight">Submissions</h1>
          <p className="text-ink-secondary mt-1 text-sm">
            Review submitted student work across all assignments.
          </p>
        </div>

        <section className="border-border mt-6 flex-1 overflow-hidden rounded-xl border">
          {loading ? (
            <p className="text-ink-secondary px-5 py-6 text-sm">Loading submissions…</p>
          ) : error ? (
            <div className="m-5 space-y-3">
              <p className="bg-danger-bg text-danger rounded-lg px-4 py-3 text-sm" role="alert">
                {error}
              </p>
              <Button variant="secondary" onClick={() => void reloadQueue()}>
                Try again
              </Button>
            </div>
          ) : items.length === 0 ? (
            <div className="px-5 py-10 text-center">
              <p className="text-ink text-base font-medium">You&apos;re all caught up</p>
              <p className="text-ink-secondary mt-2 text-sm">
                No submissions are waiting for review right now.
              </p>
            </div>
          ) : (
            <div className="h-full overflow-auto">
              <table className="w-full min-w-[760px] text-left text-sm">
                <thead className="text-ink-muted bg-surface-raised/60 sticky top-0 text-xs uppercase">
                  <tr>
                    <th className="px-5 py-3 font-medium">Student</th>
                    <th className="px-5 py-3 font-medium">Task</th>
                    <th className="px-5 py-3 font-medium">Submission</th>
                    <th className="px-5 py-3 font-medium">Submitted</th>
                  </tr>
                </thead>
                <tbody className="divide-border divide-y">
                  {items.map((item) => {
                    const selected = item.id === selectedId;
                    return (
                      <tr
                        key={item.id}
                        className={`cursor-pointer transition-colors ${selected ? "bg-surface-raised" : "hover:bg-surface-raised/60"}`}
                        onClick={() => setSelectedId(item.id)}
                      >
                        <td className="text-ink px-5 py-3 font-medium">{item.student_name}</td>
                        <td className="text-ink-secondary px-5 py-3">{item.task.title}</td>
                        <td className="px-5 py-3">
                          {item.submission_link ? (
                            <a
                              href={item.submission_link}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-brand hover:text-brand-strong break-all"
                              onClick={(event) => event.stopPropagation()}
                            >
                              View submission
                            </a>
                          ) : (
                            <span className="text-ink-muted">—</span>
                          )}
                        </td>
                        <td className="text-ink-secondary px-5 py-3">
                          {formatSubmittedAt(item.submitted_at)}
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

      {selectedItem ? (
        <ReviewPanel
          key={selectedItem.id}
          item={selectedItem}
          onReviewed={handleReviewed}
          onClose={() => setSelectedId(null)}
        />
      ) : null}
    </div>
  );
}

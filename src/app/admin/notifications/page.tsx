"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";

import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { ApiError } from "@/lib/api";
import { getAdminToken } from "@/lib/admin-auth";
import {
  NOTIFICATION_AUDIENCE_LABELS,
  sendNotification,
  type NotificationAudience,
} from "@/lib/admin-notifications";
import { fetchAdminStudents, type AdminStudent } from "@/lib/admin-students";

const AUDIENCE_OPTIONS: NotificationAudience[] = [
  "single",
  "all",
  "pending",
  "granted",
  "custom",
];

export default function AdminNotificationsPage() {
  const [students, setStudents] = useState<AdminStudent[]>([]);
  const [loadingStudents, setLoadingStudents] = useState(true);
  const [audience, setAudience] = useState<NotificationAudience>("single");
  const [studentId, setStudentId] = useState("");
  const [selectedStudentIds, setSelectedStudentIds] = useState<string[]>([]);
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  useEffect(() => {
    const token = getAdminToken();
    if (!token) {
      setLoadingStudents(false);
      return;
    }

    const authToken = token;
    let cancelled = false;

    async function loadStudents() {
      try {
        const rows = await fetchAdminStudents(authToken);
        if (!cancelled) setStudents(rows);
      } catch (cause) {
        if (!cancelled) {
          setError(cause instanceof ApiError ? cause.message : "Could not load students.");
        }
      } finally {
        if (!cancelled) setLoadingStudents(false);
      }
    }

    void loadStudents();

    return () => {
      cancelled = true;
    };
  }, []);

  const studentOptions = useMemo(
    () =>
      students.map((student) => ({
        id: student.id,
        label: `${student.name}${student.email ? ` · ${student.email}` : student.phone ? ` · ${student.phone}` : ""}`,
      })),
    [students],
  );

  function toggleStudentSelection(id: string) {
    setSelectedStudentIds((current) =>
      current.includes(id) ? current.filter((value) => value !== id) : [...current, id],
    );
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setSuccess(null);

    const token = getAdminToken();
    if (!token) {
      setError("Admin session expired. Please sign in again.");
      return;
    }

    const trimmedTitle = title.trim();
    const trimmedBody = body.trim();
    if (!trimmedTitle || !trimmedBody) {
      setError("Title and message are required.");
      return;
    }

    if (audience === "single" && !studentId) {
      setError("Choose a student to notify.");
      return;
    }

    if (audience === "custom" && selectedStudentIds.length === 0) {
      setError("Select at least one student.");
      return;
    }

    setSubmitting(true);

    try {
      const result = await sendNotification(token, {
        title: trimmedTitle,
        body: trimmedBody,
        audience,
        student_id: audience === "single" ? studentId : undefined,
        student_ids: audience === "custom" ? selectedStudentIds : undefined,
      });
      setSuccess(`Notification sent to ${result.recipients} student(s).`);
      setTitle("");
      setBody("");
      setSelectedStudentIds([]);
    } catch (cause) {
      setError(cause instanceof ApiError ? cause.message : "Could not send notification.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="flex-1 px-6 py-8">
      <div className="mx-auto max-w-3xl">
        <h1 className="text-ink text-2xl font-semibold tracking-tight">Notifications</h1>
        <p className="text-ink-secondary mt-2 text-sm">
          Send a personalised message to one student or a group. Students see it in their
          notification center immediately after sign in.
        </p>

        <form
          className="border-border bg-surface mt-8 space-y-6 rounded-2xl border p-6 shadow-sm"
          onSubmit={(event) => void handleSubmit(event)}
        >
          <Select
            id="audience"
            label="Recipients"
            value={audience}
            onChange={(event) => setAudience(event.target.value as NotificationAudience)}
          >
            {AUDIENCE_OPTIONS.map((option) => (
              <option key={option} value={option}>
                {NOTIFICATION_AUDIENCE_LABELS[option]}
              </option>
            ))}
          </Select>

          {audience === "single" ? (
            <Select
              id="student"
              label="Student"
              value={studentId}
              onChange={(event) => setStudentId(event.target.value)}
              disabled={loadingStudents}
              placeholder="Select a student"
            >
              {studentOptions.map((student) => (
                <option key={student.id} value={student.id}>
                  {student.label}
                </option>
              ))}
            </Select>
          ) : null}

          {audience === "custom" ? (
            <div>
              <p className="text-ink text-sm font-medium">Selected students</p>
              <div className="border-border mt-2 max-h-56 overflow-y-auto rounded-lg border">
                {loadingStudents ? (
                  <p className="text-ink-muted px-4 py-3 text-sm">Loading students…</p>
                ) : (
                  <ul>
                    {studentOptions.map((student) => {
                      const checked = selectedStudentIds.includes(student.id);

                      return (
                        <li key={student.id} className="border-border border-b last:border-b-0">
                          <label className="hover:bg-surface-raised flex cursor-pointer items-center gap-3 px-4 py-3 text-sm">
                            <input
                              type="checkbox"
                              checked={checked}
                              onChange={() => toggleStudentSelection(student.id)}
                            />
                            <span>{student.label}</span>
                          </label>
                        </li>
                      );
                    })}
                  </ul>
                )}
              </div>
              <p className="text-ink-muted mt-2 text-xs">
                {selectedStudentIds.length} student(s) selected
              </p>
            </div>
          ) : null}

          <Input
            id="title"
            label="Title"
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            placeholder="Payment approved"
            maxLength={255}
          />

          <div>
            <label htmlFor="body" className="text-ink text-sm font-medium">
              Message
            </label>
            <textarea
              id="body"
              className="border-border bg-surface text-ink placeholder:text-ink-muted focus:border-brand focus:ring-brand/20 mt-2 min-h-32 w-full rounded-lg border px-3 py-2 text-sm outline-none focus:ring-2"
              value={body}
              onChange={(event) => setBody(event.target.value)}
              placeholder="Write your personalised message here…"
              maxLength={5000}
            />
          </div>

          {error ? (
            <p className="bg-danger-bg text-danger rounded-lg px-4 py-3 text-sm" role="alert">
              {error}
            </p>
          ) : null}

          {success ? (
            <p
              className="bg-success-bg text-success rounded-lg px-4 py-3 text-sm"
              role="status"
            >
              {success}
            </p>
          ) : null}

          <Button type="submit" disabled={submitting}>
            {submitting ? "Sending…" : "Send notification"}
          </Button>
        </form>
      </div>
    </div>
  );
}

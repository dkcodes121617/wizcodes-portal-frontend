"use client";

import { FormEvent, useEffect, useMemo, useState, type TextareaHTMLAttributes } from "react";

import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { ApiError } from "@/lib/api";
import { getAdminToken } from "@/lib/admin-auth";
import { fetchActiveDomains, type DomainOption } from "@/lib/enrollment";
import { fetchAdminPlans, formatPlanTier, type InternshipPlan } from "@/lib/admin-plans";
import {
  createAdminTask,
  deactivateAdminTask,
  fetchAdminTasks,
  shortenId,
  updateAdminTask,
  type AdminTask,
} from "@/lib/admin-tasks";

type FormMode = "create" | "edit";

interface TaskFormState {
  domain_id: string;
  internship_plan_id: string;
  title: string;
  description: string;
  github_link: string;
}

const EMPTY_FORM: TaskFormState = {
  domain_id: "",
  internship_plan_id: "",
  title: "",
  description: "",
  github_link: "",
};

function StatusBadge({ active }: { active: boolean }) {
  return (
    <span
      className={`rounded-full px-2.5 py-1 text-xs font-medium ${active ? "bg-success-bg text-success" : "bg-surface-raised text-ink-muted"}`}
    >
      {active ? "Active" : "Inactive"}
    </span>
  );
}

function Textarea({
  label,
  error,
  id,
  className = "",
  ...props
}: TextareaHTMLAttributes<HTMLTextAreaElement> & { label: string; error?: string }) {
  const textareaId = id ?? props.name;
  return (
    <div className="space-y-1.5">
      <label htmlFor={textareaId} className="text-ink text-sm font-medium">
        {label}
      </label>
      <textarea
        id={textareaId}
        className={`border-border bg-surface text-ink placeholder:text-ink-muted focus:border-brand min-h-28 w-full rounded-lg border px-4 py-2.5 text-sm transition-colors outline-none focus:ring-2 focus:ring-[color-mix(in_srgb,var(--color-brand)_25%,transparent)] ${error ? "border-danger" : ""} ${className}`}
        {...props}
      />
      {error ? <p className="text-danger text-xs">{error}</p> : null}
    </div>
  );
}

export default function AdminTasksPage() {
  const [plans, setPlans] = useState<InternshipPlan[]>([]);
  const [domains, setDomains] = useState<DomainOption[]>([]);
  const [tasks, setTasks] = useState<AdminTask[]>([]);
  const [loadingPlans, setLoadingPlans] = useState(true);
  const [loadingDomains, setLoadingDomains] = useState(true);
  const [loadingTasks, setLoadingTasks] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [filterPlanId, setFilterPlanId] = useState("");
  const [filterDomainId, setFilterDomainId] = useState("");
  const [formMode, setFormMode] = useState<FormMode>("create");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<TaskFormState>(EMPTY_FORM);
  const [formError, setFormError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [actionId, setActionId] = useState<string | null>(null);

  const planLabelById = useMemo(
    () => new Map(plans.map((plan) => [plan.id, formatPlanTier(plan.tier)])),
    [plans],
  );

  const domainLabelById = useMemo(
    () => new Map(domains.map((domain) => [domain.id, domain.name])),
    [domains],
  );

  async function reloadTasks(planId: string, domainId: string) {
    const token = getAdminToken();
    if (!token || !planId) {
      setTasks([]);
      return;
    }

    setLoadingTasks(true);
    setError(null);
    try {
      const data = await fetchAdminTasks(token, {
        internship_plan_id: planId,
        domain_id: domainId.trim() || undefined,
      });
      setTasks(data);
    } catch (cause) {
      setError(cause instanceof ApiError ? cause.message : "Could not load tasks.");
    } finally {
      setLoadingTasks(false);
    }
  }

  useEffect(() => {
    let cancelled = false;

    async function run() {
      const token = getAdminToken();
      if (!token) return;

      setLoadingPlans(true);
      setError(null);
      try {
        const data = await fetchAdminPlans(token);
        if (cancelled) return;
        setPlans(data);
        const basicPlan = data.find((plan) => plan.tier === "basic_299");
        if (basicPlan) {
          setFilterPlanId((current) => current || basicPlan.id);
          setForm((current) => ({
            ...current,
            internship_plan_id: current.internship_plan_id || basicPlan.id,
          }));
        }
      } catch (cause) {
        if (!cancelled) {
          setError(cause instanceof ApiError ? cause.message : "Could not load plans.");
        }
      } finally {
        if (!cancelled) setLoadingPlans(false);
      }
    }

    void run();

    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    let cancelled = false;

    async function run() {
      setLoadingDomains(true);
      try {
        const data = await fetchActiveDomains();
        if (cancelled) return;
        const activeDomains = data.filter((domain) => domain.is_active);
        setDomains(activeDomains);
        setForm((current) => ({
          ...current,
          domain_id: current.domain_id || activeDomains[0]?.id || "",
        }));
      } catch (cause) {
        if (!cancelled) {
          setError(cause instanceof ApiError ? cause.message : "Could not load domains.");
        }
      } finally {
        if (!cancelled) setLoadingDomains(false);
      }
    }

    void run();

    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (!filterPlanId) return;

    let cancelled = false;

    async function run() {
      const token = getAdminToken();
      if (!token) return;

      setLoadingTasks(true);
      setError(null);
      try {
        const data = await fetchAdminTasks(token, {
          internship_plan_id: filterPlanId,
          domain_id: filterDomainId.trim() || undefined,
        });
        if (!cancelled) setTasks(data);
      } catch (cause) {
        if (!cancelled) {
          setError(cause instanceof ApiError ? cause.message : "Could not load tasks.");
        }
      } finally {
        if (!cancelled) setLoadingTasks(false);
      }
    }

    void run();

    return () => {
      cancelled = true;
    };
  }, [filterPlanId, filterDomainId]);

  function resetForm() {
    setFormMode("create");
    setEditingId(null);
    setForm({
      ...EMPTY_FORM,
      internship_plan_id: filterPlanId,
      domain_id: filterDomainId.trim(),
    });
    setFormError(null);
  }

  function startEdit(task: AdminTask) {
    setFormMode("edit");
    setEditingId(task.id);
    setForm({
      domain_id: task.domain_id,
      internship_plan_id: task.internship_plan_id,
      title: task.title,
      description: task.description,
      github_link: task.github_link,
    });
    setFormError(null);
  }

  function validateForm(): TaskFormState | null {
    if (!form.domain_id) {
      setFormError("Select a domain.");
      return null;
    }
    if (!form.internship_plan_id) {
      setFormError("Select an internship plan.");
      return null;
    }
    if (!form.title.trim()) {
      setFormError("Title is required.");
      return null;
    }
    if (!form.description.trim()) {
      setFormError("Description is required.");
      return null;
    }
    if (!form.github_link.trim()) {
      setFormError("GitHub link is required.");
      return null;
    }
    return {
      ...form,
      domain_id: form.domain_id.trim(),
      title: form.title.trim(),
      description: form.description.trim(),
      github_link: form.github_link.trim(),
    };
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const body = validateForm();
    if (!body) return;

    const token = getAdminToken();
    if (!token) return;

    setSaving(true);
    setFormError(null);
    try {
      if (formMode === "create") {
        await createAdminTask(body, token);
      } else if (editingId) {
        await updateAdminTask(editingId, body, token);
      }
      resetForm();
      await reloadTasks(filterPlanId, filterDomainId);
    } catch (cause) {
      setFormError(cause instanceof ApiError ? cause.message : "Could not save task.");
    } finally {
      setSaving(false);
    }
  }

  async function handleDeactivate(taskId: string) {
    const token = getAdminToken();
    if (!token) return;

    setActionId(taskId);
    try {
      await deactivateAdminTask(taskId, token);
      await reloadTasks(filterPlanId, filterDomainId);
    } catch (cause) {
      setError(cause instanceof ApiError ? cause.message : "Could not deactivate task.");
    } finally {
      setActionId(null);
    }
  }

  return (
    <div className="mx-auto max-w-6xl">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-ink text-2xl font-semibold tracking-tight">Tasks</h1>
          <p className="text-ink-secondary mt-1 text-sm">
            Manage the shared task bank by plan and domain.
          </p>
        </div>
        {formMode === "edit" ? (
          <Button variant="secondary" onClick={resetForm}>
            Cancel edit
          </Button>
        ) : null}
      </div>

      <section className="border-border mt-8 rounded-xl border px-5 py-5">
        <h2 className="text-ink text-sm font-semibold">Filters</h2>
        <p className="text-ink-secondary mt-1 text-sm">
          Choose a plan first — tasks are not listed until a plan is selected.
        </p>

        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <Select
            label="Internship plan"
            name="filter_plan"
            value={filterPlanId}
            onChange={(event) => setFilterPlanId(event.target.value)}
            disabled={loadingPlans}
            placeholder="Select a plan"
          >
            {plans.map((plan) => (
              <option key={plan.id} value={plan.id}>
                {formatPlanTier(plan.tier)} — ₹{plan.price}
              </option>
            ))}
          </Select>

          <Select
            label="Domain (optional filter)"
            name="filter_domain"
            value={filterDomainId}
            onChange={(event) => setFilterDomainId(event.target.value)}
            disabled={!filterPlanId || loadingDomains}
          >
            <option value="">All domains</option>
            {domains.map((domain) => (
              <option key={domain.id} value={domain.id}>
                {domain.name}
              </option>
            ))}
          </Select>
        </div>
      </section>

      <section className="border-border mt-8 rounded-xl border px-5 py-5">
        <h2 className="text-ink text-sm font-semibold">
          {formMode === "create" ? "Create task" : "Edit task"}
        </h2>
        <form className="mt-4 space-y-4" onSubmit={(event) => void handleSubmit(event)}>
          <div className="grid gap-4 sm:grid-cols-2">
            <Select
              label="Domain"
              name="domain_id"
              value={form.domain_id}
              onChange={(event) =>
                setForm((current) => ({ ...current, domain_id: event.target.value }))
              }
              disabled={saving || loadingDomains || domains.length === 0}
              placeholder="Select a domain"
              required
            >
              {domains.map((domain) => (
                <option key={domain.id} value={domain.id}>
                  {domain.name}
                </option>
              ))}
            </Select>

            <Select
              label="Internship plan"
              name="internship_plan_id"
              value={form.internship_plan_id}
              onChange={(event) =>
                setForm((current) => ({ ...current, internship_plan_id: event.target.value }))
              }
              disabled={saving}
              placeholder="Select a plan"
            >
              {plans.map((plan) => (
                <option key={plan.id} value={plan.id}>
                  {formatPlanTier(plan.tier)}
                </option>
              ))}
            </Select>
          </div>

          <Input
            label="Title"
            name="title"
            value={form.title}
            onChange={(event) =>
              setForm((current) => ({ ...current, title: event.target.value }))
            }
            disabled={saving}
            required
          />

          <Textarea
            label="Description"
            name="description"
            value={form.description}
            onChange={(event) =>
              setForm((current) => ({ ...current, description: event.target.value }))
            }
            disabled={saving}
            required
          />

          <Input
            label="GitHub link"
            name="github_link"
            type="url"
            placeholder="https://github.com/org/repo"
            value={form.github_link}
            onChange={(event) =>
              setForm((current) => ({ ...current, github_link: event.target.value }))
            }
            disabled={saving}
            required
          />

          {formError ? (
            <p className="bg-danger-bg text-danger rounded-lg px-4 py-3 text-sm" role="alert">
              {formError}
            </p>
          ) : null}

          <Button type="submit" loading={saving}>
            {formMode === "create" ? "Create task" : "Save changes"}
          </Button>
        </form>
      </section>

      <section className="border-border mt-8 rounded-xl border">
        <div className="border-border border-b px-5 py-4">
          <h2 className="text-ink text-sm font-semibold">Tasks in view</h2>
        </div>

        {!filterPlanId ? (
          <p className="text-ink-secondary px-5 py-6 text-sm">Select a plan to load tasks.</p>
        ) : loadingTasks ? (
          <p className="text-ink-secondary px-5 py-6 text-sm">Loading tasks…</p>
        ) : error ? (
          <p className="bg-danger-bg text-danger m-5 rounded-lg px-4 py-3 text-sm" role="alert">
            {error}
          </p>
        ) : tasks.length === 0 ? (
          <p className="text-ink-secondary px-5 py-6 text-sm">
            No tasks match the current filters.
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[760px] text-left text-sm">
              <thead className="text-ink-muted bg-surface-raised/60 text-xs uppercase">
                <tr>
                  <th className="px-5 py-3 font-medium">Title</th>
                  <th className="px-5 py-3 font-medium">Domain</th>
                  <th className="px-5 py-3 font-medium">Plan</th>
                  <th className="px-5 py-3 font-medium">Status</th>
                  <th className="px-5 py-3 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-border divide-y">
                {tasks.map((task) => (
                  <tr key={task.id}>
                    <td className="px-5 py-3">
                      <p className="text-ink font-medium">{task.title}</p>
                      <a
                        href={task.github_link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-brand hover:text-brand-strong mt-1 inline-block text-xs"
                      >
                        Repo link
                      </a>
                    </td>
                    <td className="text-ink-secondary px-5 py-3" title={task.domain_id}>
                      {domainLabelById.get(task.domain_id) ?? shortenId(task.domain_id)}
                    </td>
                    <td className="text-ink-secondary px-5 py-3">
                      {planLabelById.get(task.internship_plan_id) ?? "—"}
                    </td>
                    <td className="px-5 py-3">
                      <StatusBadge active={task.is_active} />
                    </td>
                    <td className="px-5 py-3">
                      <div className="flex flex-wrap gap-2">
                        <Button variant="ghost" onClick={() => startEdit(task)}>
                          Edit
                        </Button>
                        {task.is_active ? (
                          <Button
                            variant="secondary"
                            loading={actionId === task.id}
                            disabled={actionId === task.id}
                            onClick={() => void handleDeactivate(task.id)}
                          >
                            Deactivate
                          </Button>
                        ) : null}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
}

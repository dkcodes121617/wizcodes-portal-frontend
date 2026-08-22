"use client";

import { FormEvent, useEffect, useState } from "react";

import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { ApiError } from "@/lib/api";
import { getAdminToken } from "@/lib/admin-auth";
import {
  createAdminPlan,
  deactivateAdminPlan,
  fetchAdminPlans,
  formatPlanTier,
  updateAdminPlan,
  type InternshipPlan,
  type InternshipPlanCreateBody,
  type InternshipPlanTier,
} from "@/lib/admin-plans";

type FormMode = "create" | "edit";

interface PlanFormState {
  tier: InternshipPlanTier;
  price: string;
  min_duration_weeks: string;
  max_duration_weeks: string;
}

const EMPTY_FORM: PlanFormState = {
  tier: "basic_299",
  price: "",
  min_duration_weeks: "",
  max_duration_weeks: "",
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

export default function AdminPlansPage() {
  const [plans, setPlans] = useState<InternshipPlan[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [formMode, setFormMode] = useState<FormMode>("create");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<PlanFormState>(EMPTY_FORM);
  const [formError, setFormError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [actionId, setActionId] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function run() {
      const token = getAdminToken();
      if (!token) return;

      setLoading(true);
      setError(null);
      try {
        const data = await fetchAdminPlans(token);
        if (!cancelled) setPlans(data);
      } catch (cause) {
        if (!cancelled) {
          setError(cause instanceof ApiError ? cause.message : "Could not load plans.");
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    void run();

    return () => {
      cancelled = true;
    };
  }, []);

  async function reloadPlans() {
    const token = getAdminToken();
    if (!token) return;

    setLoading(true);
    setError(null);
    try {
      const data = await fetchAdminPlans(token);
      setPlans(data);
    } catch (cause) {
      setError(cause instanceof ApiError ? cause.message : "Could not load plans.");
    } finally {
      setLoading(false);
    }
  }

  function resetForm() {
    setFormMode("create");
    setEditingId(null);
    setForm(EMPTY_FORM);
    setFormError(null);
  }

  function startEdit(plan: InternshipPlan) {
    setFormMode("edit");
    setEditingId(plan.id);
    setForm({
      tier: plan.tier as InternshipPlanTier,
      price: String(plan.price),
      min_duration_weeks: String(plan.min_duration_weeks),
      max_duration_weeks: String(plan.max_duration_weeks),
    });
    setFormError(null);
  }

  function parseForm(): InternshipPlanCreateBody | null {
    const price = Number(form.price);
    const min_duration_weeks = Number(form.min_duration_weeks);
    const max_duration_weeks = Number(form.max_duration_weeks);

    if (!Number.isInteger(price) || price <= 0) {
      setFormError("Price must be a positive whole number (rupees).");
      return null;
    }
    if (!Number.isInteger(min_duration_weeks) || min_duration_weeks <= 0) {
      setFormError("Minimum duration must be a positive whole number of weeks.");
      return null;
    }
    if (!Number.isInteger(max_duration_weeks) || max_duration_weeks <= 0) {
      setFormError("Maximum duration must be a positive whole number of weeks.");
      return null;
    }
    if (min_duration_weeks > max_duration_weeks) {
      setFormError("Minimum duration cannot exceed maximum duration.");
      return null;
    }

    return {
      tier: form.tier,
      price,
      min_duration_weeks,
      max_duration_weeks,
    };
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const body = parseForm();
    if (!body) return;

    const token = getAdminToken();
    if (!token) return;

    setSaving(true);
    setFormError(null);
    try {
      if (formMode === "create") {
        await createAdminPlan(body, token);
      } else if (editingId) {
        await updateAdminPlan(editingId, body, token);
      }
      resetForm();
      await reloadPlans();
    } catch (cause) {
      setFormError(cause instanceof ApiError ? cause.message : "Could not save plan.");
    } finally {
      setSaving(false);
    }
  }

  async function handleDeactivate(planId: string) {
    const token = getAdminToken();
    if (!token) return;

    setActionId(planId);
    try {
      await deactivateAdminPlan(planId, token);
      await reloadPlans();
    } catch (cause) {
      setError(cause instanceof ApiError ? cause.message : "Could not deactivate plan.");
    } finally {
      setActionId(null);
    }
  }

  return (
    <div className="mx-auto max-w-5xl">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-ink text-2xl font-semibold tracking-tight">Internship plans</h1>
          <p className="text-ink-secondary mt-1 text-sm">
            Create and manage Basic and Premium internship tiers.
          </p>
        </div>
        {formMode === "edit" ? (
          <Button variant="secondary" onClick={resetForm}>
            Cancel edit
          </Button>
        ) : null}
      </div>

      <section className="border-border mt-8 rounded-xl border px-5 py-5">
        <h2 className="text-ink text-sm font-semibold">
          {formMode === "create" ? "Create plan" : "Edit plan"}
        </h2>
        <form
          className="mt-4 grid gap-4 sm:grid-cols-2"
          onSubmit={(event) => void handleSubmit(event)}
        >
          <Select
            label="Tier"
            name="tier"
            value={form.tier}
            onChange={(event) =>
              setForm((current) => ({
                ...current,
                tier: event.target.value as InternshipPlanTier,
              }))
            }
            disabled={saving}
          >
            <option value="basic_299">Basic (basic_299)</option>
            <option value="premium_999">Premium (premium_999)</option>
          </Select>

          <Input
            label="Price (₹)"
            name="price"
            type="number"
            min={1}
            step={1}
            value={form.price}
            onChange={(event) =>
              setForm((current) => ({ ...current, price: event.target.value }))
            }
            disabled={saving}
            required
          />

          <Input
            label="Min duration (weeks)"
            name="min_duration_weeks"
            type="number"
            min={1}
            step={1}
            value={form.min_duration_weeks}
            onChange={(event) =>
              setForm((current) => ({ ...current, min_duration_weeks: event.target.value }))
            }
            disabled={saving}
            required
          />

          <Input
            label="Max duration (weeks)"
            name="max_duration_weeks"
            type="number"
            min={1}
            step={1}
            value={form.max_duration_weeks}
            onChange={(event) =>
              setForm((current) => ({ ...current, max_duration_weeks: event.target.value }))
            }
            disabled={saving}
            required
          />

          {formError ? (
            <p
              className="bg-danger-bg text-danger rounded-lg px-4 py-3 text-sm sm:col-span-2"
              role="alert"
            >
              {formError}
            </p>
          ) : null}

          <div className="sm:col-span-2">
            <Button type="submit" loading={saving}>
              {formMode === "create" ? "Create plan" : "Save changes"}
            </Button>
          </div>
        </form>
      </section>

      <section className="border-border mt-8 rounded-xl border">
        <div className="border-border border-b px-5 py-4">
          <h2 className="text-ink text-sm font-semibold">All plans</h2>
        </div>

        {loading ? (
          <p className="text-ink-secondary px-5 py-6 text-sm">Loading plans…</p>
        ) : error ? (
          <p className="bg-danger-bg text-danger m-5 rounded-lg px-4 py-3 text-sm" role="alert">
            {error}
          </p>
        ) : plans.length === 0 ? (
          <p className="text-ink-secondary px-5 py-6 text-sm">No plans yet.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[640px] text-left text-sm">
              <thead className="text-ink-muted bg-surface-raised/60 text-xs uppercase">
                <tr>
                  <th className="px-5 py-3 font-medium">Tier</th>
                  <th className="px-5 py-3 font-medium">Price</th>
                  <th className="px-5 py-3 font-medium">Duration</th>
                  <th className="px-5 py-3 font-medium">Status</th>
                  <th className="px-5 py-3 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-border divide-y">
                {plans.map((plan) => (
                  <tr key={plan.id}>
                    <td className="text-ink px-5 py-3 font-medium">
                      {formatPlanTier(plan.tier)}
                    </td>
                    <td className="text-ink-secondary px-5 py-3">₹{plan.price}</td>
                    <td className="text-ink-secondary px-5 py-3">
                      {plan.min_duration_weeks}–{plan.max_duration_weeks} weeks
                    </td>
                    <td className="px-5 py-3">
                      <StatusBadge active={plan.is_active} />
                    </td>
                    <td className="px-5 py-3">
                      <div className="flex flex-wrap gap-2">
                        <Button variant="ghost" onClick={() => startEdit(plan)}>
                          Edit
                        </Button>
                        {plan.is_active ? (
                          <Button
                            variant="secondary"
                            loading={actionId === plan.id}
                            disabled={actionId === plan.id}
                            onClick={() => void handleDeactivate(plan.id)}
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

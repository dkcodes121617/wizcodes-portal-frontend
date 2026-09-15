"use client";

import { FormEvent, useEffect, useState } from "react";

import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { ApiError } from "@/lib/api";
import {
  createAdmin,
  fetchAdminProfile,
  fetchAdmins,
  getAdminToken,
  isSuperAdmin,
  type AdminProfile,
  type AdminRole,
} from "@/lib/admin-auth";

interface AdminFormState {
  name: string;
  email: string;
  password: string;
  role: AdminRole;
}

const EMPTY_FORM: AdminFormState = {
  name: "",
  email: "",
  password: "",
  role: "admin",
};

function RoleBadge({ role }: { role: AdminRole }) {
  const isSuper = role === "super_admin";

  return (
    <span
      className={`rounded-full px-2.5 py-1 text-xs font-medium ${
        isSuper ? "bg-brand/10 text-brand" : "bg-surface-raised text-ink-secondary"
      }`}
    >
      {isSuper ? "Super admin" : "Admin"}
    </span>
  );
}

function formatAdminDate(value: string): string {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;

  return date.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

export default function AdminAdminsPage() {
  const [currentAdmin, setCurrentAdmin] = useState<AdminProfile | null>(null);
  const [admins, setAdmins] = useState<AdminProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [form, setForm] = useState<AdminFormState>(EMPTY_FORM);
  const [formError, setFormError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [creating, setCreating] = useState(false);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      const token = getAdminToken();
      if (!token) return;

      setLoading(true);
      setError(null);

      try {
        const profile = await fetchAdminProfile(token);
        if (cancelled) return;

        setCurrentAdmin(profile);

        if (!isSuperAdmin(profile)) {
          setError("Only super admins can manage admin access.");
          return;
        }

        const rows = await fetchAdmins(token);
        if (!cancelled) setAdmins(rows);
      } catch (cause) {
        if (!cancelled) {
          setError(
            cause instanceof ApiError ? cause.message : "Could not load admin accounts.",
          );
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

  async function reloadAdmins() {
    const token = getAdminToken();
    if (!token) return;

    const rows = await fetchAdmins(token);
    setAdmins(rows);
  }

  async function handleCreate(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setFormError(null);
    setSuccess(null);

    const name = form.name.trim();
    const email = form.email.trim();

    if (!name) {
      setFormError("Name is required.");
      return;
    }
    if (!email) {
      setFormError("Email is required.");
      return;
    }
    if (form.password.length < 8) {
      setFormError("Password must be at least 8 characters.");
      return;
    }

    const token = getAdminToken();
    if (!token) {
      setFormError("You are not signed in.");
      return;
    }

    setCreating(true);

    try {
      const created = await createAdmin(token, {
        name,
        email,
        password: form.password,
        role: form.role,
      });
      setAdmins((current) =>
        [...current, created].sort((a, b) => a.email.localeCompare(b.email)),
      );
      setForm(EMPTY_FORM);
      setSuccess(
        `Admin access granted to ${created.email}. Share the login credentials securely.`,
      );
    } catch (cause) {
      setFormError(
        cause instanceof ApiError ? cause.message : "Could not create admin account.",
      );
    } finally {
      setCreating(false);
    }
  }

  if (loading) {
    return <p className="text-ink-secondary text-sm">Loading admin accounts…</p>;
  }

  if (error) {
    return (
      <p className="bg-danger-bg text-danger rounded-lg px-4 py-3 text-sm" role="alert">
        {error}
      </p>
    );
  }

  return (
    <div className="mx-auto max-w-4xl space-y-8">
      <div>
        <h1 className="text-ink text-2xl font-semibold tracking-tight">Admin access</h1>
        <p className="text-ink-secondary mt-2 text-sm">
          Grant admin panel access to another person by creating their account. They can sign in
          at <span className="font-medium">/admin/login</span> with the email and password you
          set.
        </p>
      </div>

      <section className="border-border rounded-xl border p-5">
        <h2 className="text-ink text-base font-semibold">Grant admin access</h2>
        <p className="text-ink-secondary mt-1 text-sm">
          New admins can manage students, tasks, plans, and submissions. Super admins can also
          add other admins.
        </p>

        <form
          className="mt-5 space-y-4"
          onSubmit={(event) => void handleCreate(event)}
          noValidate
        >
          <Input
            label="Full name"
            name="name"
            value={form.name}
            onChange={(event) => {
              setForm((current) => ({ ...current, name: event.target.value }));
              setFormError(null);
              setSuccess(null);
            }}
            placeholder="Person receiving admin access"
            required
          />

          <Input
            label="Email"
            name="email"
            type="email"
            autoComplete="off"
            value={form.email}
            onChange={(event) => {
              setForm((current) => ({ ...current, email: event.target.value }));
              setFormError(null);
              setSuccess(null);
            }}
            placeholder="admin@example.com"
            required
          />

          <Input
            label="Password"
            name="password"
            type="password"
            autoComplete="new-password"
            value={form.password}
            onChange={(event) => {
              setForm((current) => ({ ...current, password: event.target.value }));
              setFormError(null);
              setSuccess(null);
            }}
            placeholder="At least 8 characters"
            required
          />

          <Select
            label="Access level"
            name="role"
            value={form.role}
            onChange={(event) => {
              setForm((current) => ({
                ...current,
                role: event.target.value as AdminRole,
              }));
              setFormError(null);
              setSuccess(null);
            }}
          >
            <option value="admin">Admin — manage portal content</option>
            <option value="super_admin">Super admin — can add other admins</option>
          </Select>

          {formError ? (
            <p className="bg-danger-bg text-danger rounded-lg px-4 py-3 text-sm" role="alert">
              {formError}
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

          <Button type="submit" loading={creating} disabled={creating}>
            Grant admin access
          </Button>
        </form>
      </section>

      <section className="border-border rounded-xl border p-5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="text-ink text-base font-semibold">Current admins</h2>
            <p className="text-ink-secondary mt-1 text-sm">
              {admins.length} account{admins.length === 1 ? "" : "s"} with admin panel access.
            </p>
          </div>
          <Button
            type="button"
            variant="secondary"
            onClick={() =>
              void reloadAdmins().catch(() => setError("Could not refresh admin list."))
            }
          >
            Refresh
          </Button>
        </div>

        <div className="mt-5 overflow-x-auto">
          <table className="min-w-full text-left text-sm">
            <thead>
              <tr className="border-border border-b">
                <th className="text-ink-muted px-3 py-2 font-medium">Name</th>
                <th className="text-ink-muted px-3 py-2 font-medium">Email</th>
                <th className="text-ink-muted px-3 py-2 font-medium">Role</th>
                <th className="text-ink-muted px-3 py-2 font-medium">Added</th>
              </tr>
            </thead>
            <tbody>
              {admins.map((admin) => (
                <tr key={admin.id} className="border-border border-b last:border-b-0">
                  <td className="text-ink px-3 py-3 font-medium">
                    {admin.name}
                    {admin.id === currentAdmin?.id ? (
                      <span className="text-ink-muted ml-2 text-xs font-normal">(you)</span>
                    ) : null}
                  </td>
                  <td className="text-ink-secondary px-3 py-3">{admin.email}</td>
                  <td className="px-3 py-3">
                    <RoleBadge role={admin.role} />
                  </td>
                  <td className="text-ink-secondary px-3 py-3">
                    {formatAdminDate(admin.created_at)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}

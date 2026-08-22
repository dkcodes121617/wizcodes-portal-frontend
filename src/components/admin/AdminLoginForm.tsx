"use client";

import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";

import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { ApiError } from "@/lib/api";
import { loginAdmin, setAdminToken } from "@/lib/admin-auth";

interface FormState {
  email: string;
  password: string;
}

interface FieldErrors {
  email?: string;
  password?: string;
  form?: string;
}

export function AdminLoginForm() {
  const router = useRouter();
  const [values, setValues] = useState<FormState>({ email: "", password: "" });
  const [errors, setErrors] = useState<FieldErrors>({});
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const nextErrors: FieldErrors = {};
    if (!values.email.trim()) nextErrors.email = "Email is required";
    if (!values.password) nextErrors.password = "Password is required";
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

    setLoading(true);
    try {
      const response = await loginAdmin(values.email.trim(), values.password);
      setAdminToken(response.access_token);
      router.push("/admin");
    } catch (error) {
      setErrors({
        form: error instanceof ApiError ? error.message : "Something went wrong. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="flex flex-1 items-center justify-center px-6 py-16">
      <div className="border-border bg-surface w-full max-w-md rounded-2xl border p-8 shadow-sm sm:p-10">
        <div className="text-center">
          <p className="text-ink-muted text-xs font-medium tracking-[0.2em] uppercase">
            WizCodes Admin
          </p>
          <h1 className="mt-3 text-2xl font-semibold tracking-tight">Admin sign in</h1>
          <p className="text-ink-secondary mt-2 text-sm">Use your admin email and password</p>
        </div>

        <form className="mt-8 space-y-5" onSubmit={(event) => void handleSubmit(event)} noValidate>
          <Input
            label="Email"
            name="email"
            type="email"
            autoComplete="username"
            placeholder="admin@wizcodes.com"
            value={values.email}
            onChange={(event) => {
              setValues((current) => ({ ...current, email: event.target.value }));
              setErrors({});
            }}
            error={errors.email}
            required
          />

          <Input
            label="Password"
            name="password"
            type="password"
            autoComplete="current-password"
            value={values.password}
            onChange={(event) => {
              setValues((current) => ({ ...current, password: event.target.value }));
              setErrors({});
            }}
            error={errors.password}
            required
          />

          {errors.form ? (
            <p className="bg-danger-bg text-danger rounded-lg px-4 py-3 text-sm" role="alert">
              {errors.form}
            </p>
          ) : null}

          <Button type="submit" className="w-full" loading={loading}>
            Sign in
          </Button>
        </form>
      </div>
    </main>
  );
}

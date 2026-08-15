"use client";

import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";

import { AuthCard, AuthLink } from "@/components/auth/AuthCard";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { ApiError } from "@/lib/api";
import { api } from "@/lib/api";
import { setToken, type TokenResponse } from "@/lib/auth";

interface FormState {
  identifier: string;
  password: string;
}

interface FieldErrors {
  identifier?: string;
  password?: string;
  form?: string;
}

export function LoginForm() {
  const router = useRouter();
  const [values, setValues] = useState<FormState>({ identifier: "", password: "" });
  const [errors, setErrors] = useState<FieldErrors>({});
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const nextErrors: FieldErrors = {};
    if (!values.identifier.trim()) {
      nextErrors.identifier = "Email or phone is required";
    }
    if (!values.password) {
      nextErrors.password = "Password is required";
    }
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

    setLoading(true);
    try {
      const response = await api.post<TokenResponse>("/api/v1/auth/student/login", {
        identifier: values.identifier.trim(),
        password: values.password,
      });
      setToken(response.access_token);
      router.push("/dashboard");
    } catch (error) {
      if (error instanceof ApiError) {
        setErrors({ form: error.message });
      } else {
        setErrors({ form: "Something went wrong. Please try again." });
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <AuthCard
      title="Welcome back"
      subtitle="Log in with your email or phone number"
      footer={
        <>
          New here? <AuthLink href="/signup">Create an account</AuthLink>
        </>
      }
    >
      <form className="space-y-5" onSubmit={handleSubmit} noValidate>
        <Input
          label="Email or phone"
          name="identifier"
          autoComplete="username"
          placeholder="you@college.edu or +91 98765 43210"
          value={values.identifier}
          onChange={(event) => {
            setValues((current) => ({ ...current, identifier: event.target.value }));
            setErrors({});
          }}
          error={errors.identifier}
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
          Log in
        </Button>
      </form>
    </AuthCard>
  );
}

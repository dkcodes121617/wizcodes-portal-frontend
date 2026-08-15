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
  name: string;
  email: string;
  phone: string;
  password: string;
  confirmPassword: string;
}

interface FieldErrors {
  name?: string;
  email?: string;
  phone?: string;
  password?: string;
  confirmPassword?: string;
  form?: string;
}

function validate(values: FormState): FieldErrors {
  const errors: FieldErrors = {};

  if (!values.name.trim()) {
    errors.name = "Name is required";
  }

  const email = values.email.trim();
  const phone = values.phone.trim().replace(/\s+/g, "");

  if (!email && !phone) {
    errors.form = "Provide an email or a phone number";
  }

  if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    errors.email = "Enter a valid email address";
  }

  if (phone && !/^\+?[\d\-()]{5,31}$/.test(phone)) {
    errors.phone = "Enter a valid phone number";
  }

  if (values.password.length < 8) {
    errors.password = "Password must be at least 8 characters";
  }

  if (values.password !== values.confirmPassword) {
    errors.confirmPassword = "Passwords do not match";
  }

  return errors;
}

export function SignupForm() {
  const router = useRouter();
  const [values, setValues] = useState<FormState>({
    name: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState<FieldErrors>({});
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const nextErrors = validate(values);
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

    setLoading(true);
    try {
      const payload = {
        name: values.name.trim(),
        email: values.email.trim() || undefined,
        phone: values.phone.trim().replace(/\s+/g, "") || undefined,
        password: values.password,
      };

      const response = await api.post<TokenResponse>("/api/v1/auth/student/signup", payload);
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

  function updateField<K extends keyof FormState>(key: K, value: FormState[K]) {
    setValues((current) => ({ ...current, [key]: value }));
    setErrors((current) => ({ ...current, [key]: undefined, form: undefined }));
  }

  return (
    <AuthCard
      title="Create your account"
      subtitle="Sign up with your email or phone number"
      footer={
        <>
          Already have an account? <AuthLink href="/login">Log in</AuthLink>
        </>
      }
    >
      <form className="space-y-5" onSubmit={handleSubmit} noValidate>
        <Input
          label="Full name"
          name="name"
          autoComplete="name"
          value={values.name}
          onChange={(event) => updateField("name", event.target.value)}
          error={errors.name}
          required
        />

        <Input
          label="Email"
          name="email"
          type="email"
          autoComplete="email"
          placeholder="you@college.edu"
          value={values.email}
          onChange={(event) => updateField("email", event.target.value)}
          error={errors.email}
        />

        <Input
          label="Phone"
          name="phone"
          type="tel"
          autoComplete="tel"
          placeholder="+91 98765 43210"
          value={values.phone}
          onChange={(event) => updateField("phone", event.target.value)}
          error={errors.phone}
        />

        <Input
          label="Password"
          name="password"
          type="password"
          autoComplete="new-password"
          value={values.password}
          onChange={(event) => updateField("password", event.target.value)}
          error={errors.password}
          required
        />

        <Input
          label="Confirm password"
          name="confirmPassword"
          type="password"
          autoComplete="new-password"
          value={values.confirmPassword}
          onChange={(event) => updateField("confirmPassword", event.target.value)}
          error={errors.confirmPassword}
          required
        />

        {errors.form ? (
          <p className="bg-danger-bg text-danger rounded-lg px-4 py-3 text-sm" role="alert">
            {errors.form}
          </p>
        ) : null}

        <Button type="submit" className="w-full" loading={loading}>
          Create account
        </Button>
      </form>
    </AuthCard>
  );
}

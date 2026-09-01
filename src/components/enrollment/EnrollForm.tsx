"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useEffect, useMemo, useState } from "react";

import { AuthCard } from "@/components/auth/AuthCard";
import { Button } from "@/components/ui/Button";
import { DateInput } from "@/components/ui/DateInput";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { SupportContactNote } from "@/components/support/SupportContactNote";
import { ApiError, api } from "@/lib/api";
import { clearToken, getToken, type StudentProfile } from "@/lib/auth";
import {
  formatIsoDateDdMmYyyy,
  getMaxInternshipEndDateIso,
  isInternshipEndDateValid,
} from "@/lib/dates";
import {
  DOMAINS_ENDPOINT_GAP_MESSAGE,
  fetchActiveDomains,
  fetchActiveInternshipPlans,
  formatPlanLabel,
  isDomainsEndpointMissing,
  isStudentEnrolled,
  submitEnrollment,
  type DomainOption,
  type InternshipPlanOption,
} from "@/lib/enrollment";

const YEAR_OPTIONS = ["1st year", "2nd year", "3rd year", "4th year", "Graduate", "Other"];

interface FieldErrors {
  domain_id?: string;
  internship_plan_id?: string;
  chosen_duration_weeks?: string;
  college?: string;
  year_of_study?: string;
  certificate_name?: string;
  internship_start_date?: string;
  internship_end_date?: string;
  form?: string;
}

export function EnrollForm() {
  const router = useRouter();
  const [domains, setDomains] = useState<DomainOption[]>([]);
  const [plans, setPlans] = useState<InternshipPlanOption[]>([]);
  const [domainId, setDomainId] = useState("");
  const [planId, setPlanId] = useState("");
  const [durationWeeks, setDurationWeeks] = useState("");
  const [college, setCollege] = useState("");
  const [yearOfStudy, setYearOfStudy] = useState("");
  const [certificateName, setCertificateName] = useState("");
  const [internshipStartDate, setInternshipStartDate] = useState("");
  const [internshipEndDate, setInternshipEndDate] = useState("");
  const [errors, setErrors] = useState<FieldErrors>({});
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [domainsUnavailable, setDomainsUnavailable] = useState(false);

  const selectedPlan = useMemo(
    () => plans.find((plan) => plan.id === planId) ?? null,
    [planId, plans],
  );

  const duration = Number(durationWeeks);
  const maxEndDate = useMemo(() => {
    if (!internshipStartDate || !durationWeeks || Number.isNaN(duration) || duration <= 0) {
      return null;
    }
    return getMaxInternshipEndDateIso(internshipStartDate, duration);
  }, [internshipStartDate, durationWeeks, duration]);

  useEffect(() => {
    if (!internshipStartDate || !maxEndDate || !internshipEndDate) return;
    if (internshipEndDate < internshipStartDate || internshipEndDate > maxEndDate) {
      setInternshipEndDate("");
    }
  }, [internshipStartDate, maxEndDate]);

  useEffect(() => {
    const token = getToken();
    if (!token) {
      router.replace("/login");
      return;
    }

    const authToken = token;
    let cancelled = false;

    async function load() {
      try {
        const profile = await api.get<StudentProfile>("/api/v1/auth/student/me", {
          token: authToken,
        });
        if (cancelled) return;
        if (isStudentEnrolled(profile)) {
          router.replace("/dashboard");
          return;
        }

        setCertificateName(profile.name);

        const [plansResult, domainsResult] = await Promise.allSettled([
          fetchActiveInternshipPlans(),
          fetchActiveDomains(),
        ]);

        if (cancelled) return;

        if (plansResult.status === "fulfilled") {
          setPlans(plansResult.value);
        } else {
          setErrors({
            form:
              plansResult.reason instanceof ApiError
                ? plansResult.reason.message
                : "Could not load internship plans.",
          });
        }

        if (domainsResult.status === "fulfilled") {
          setDomains(domainsResult.value.filter((domain) => domain.is_active));
          setDomainsUnavailable(false);
        } else if (isDomainsEndpointMissing(domainsResult.reason)) {
          setDomainsUnavailable(true);
        } else {
          setErrors({
            form:
              domainsResult.reason instanceof ApiError
                ? domainsResult.reason.message
                : "Could not load domains.",
          });
        }
      } catch (cause) {
        if (cancelled) return;
        if (cause instanceof ApiError && cause.status === 401) {
          clearToken();
          router.replace("/login");
          return;
        }
        setErrors({
          form: cause instanceof ApiError ? cause.message : "Could not load enrollment data.",
        });
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    void load();

    return () => {
      cancelled = true;
    };
  }, [router]);

  function validate(): FieldErrors {
    const nextErrors: FieldErrors = {};

    if (!domainId) nextErrors.domain_id = "Select a domain";
    if (!planId) nextErrors.internship_plan_id = "Select a plan";

    const duration = Number(durationWeeks);
    if (!durationWeeks || Number.isNaN(duration) || duration <= 0) {
      nextErrors.chosen_duration_weeks = "Enter a valid duration in weeks";
    } else if (selectedPlan) {
      if (
        duration < selectedPlan.min_duration_weeks ||
        duration > selectedPlan.max_duration_weeks
      ) {
        nextErrors.chosen_duration_weeks = `Duration must be between ${selectedPlan.min_duration_weeks} and ${selectedPlan.max_duration_weeks} weeks for this plan`;
      }
    }

    if (!college.trim()) nextErrors.college = "College is required";
    if (!yearOfStudy) nextErrors.year_of_study = "Year of study is required";

    if (!certificateName.trim()) {
      nextErrors.certificate_name = "Full name for certificate is required";
    }

    if (!internshipStartDate) {
      nextErrors.internship_start_date = "Start date is required";
    }

    if (!internshipEndDate) {
      nextErrors.internship_end_date = "End date is required";
    } else if (
      internshipStartDate &&
      duration > 0 &&
      !isInternshipEndDateValid(internshipStartDate, internshipEndDate, duration)
    ) {
      const maxLabel = maxEndDate ? formatIsoDateDdMmYyyy(maxEndDate) : "";
      nextErrors.internship_end_date = maxLabel
        ? `End date must be between ${formatIsoDateDdMmYyyy(internshipStartDate)} and ${maxLabel}`
        : "End date is outside the selected internship duration";
    }

    return nextErrors;
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (domainsUnavailable) return;

    const nextErrors = validate();
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

    const token = getToken();
    if (!token) {
      router.replace("/login");
      return;
    }

    setSubmitting(true);
    try {
      await submitEnrollment(
        {
          domain_id: domainId,
          internship_plan_id: planId,
          chosen_duration_weeks: Number(durationWeeks),
          college: college.trim(),
          year_of_study: yearOfStudy,
          certificate_name: certificateName.trim(),
          internship_start_date: internshipStartDate,
          internship_end_date: internshipEndDate,
        },
        token,
      );
      router.push("/dashboard");
    } catch (error) {
      setErrors({
        form:
          error instanceof ApiError ? error.message : "Enrollment failed. Please try again.",
      });
    } finally {
      setSubmitting(false);
    }
  }

  if (loading) {
    return (
      <main className="flex flex-1 items-center justify-center px-6 py-16">
        <p className="text-ink-secondary text-sm">Loading enrollment options…</p>
      </main>
    );
  }

  return (
    <AuthCard
      title="Choose your internship"
      subtitle="Select a domain, plan, and duration to continue"
      footer={
        <>
          Need to switch accounts?{" "}
          <Link
            href="/login"
            className="text-brand hover:text-brand-strong font-medium transition-colors"
          >
            Log in
          </Link>
        </>
      }
    >
      {domainsUnavailable ? (
        <p className="bg-warning-bg text-warning rounded-lg px-4 py-3 text-sm" role="alert">
          {DOMAINS_ENDPOINT_GAP_MESSAGE}
        </p>
      ) : null}

      <form className="space-y-5" onSubmit={handleSubmit} noValidate>
        <Select
          label="Domain"
          name="domain_id"
          value={domainId}
          onChange={(event) => {
            setDomainId(event.target.value);
            setErrors((current) => ({ ...current, domain_id: undefined, form: undefined }));
          }}
          error={errors.domain_id}
          placeholder="Select a domain"
          required
          disabled={domainsUnavailable || domains.length === 0}
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
          value={planId}
          onChange={(event) => {
            const nextPlanId = event.target.value;
            const nextPlan = plans.find((plan) => plan.id === nextPlanId) ?? null;
            setPlanId(nextPlanId);
            setDurationWeeks(nextPlan ? String(nextPlan.min_duration_weeks) : "");
            setInternshipEndDate("");
            setErrors((current) => ({
              ...current,
              internship_plan_id: undefined,
              chosen_duration_weeks: undefined,
              form: undefined,
            }));
          }}
          error={errors.internship_plan_id}
          placeholder="Select a plan"
          required
          disabled={plans.length === 0}
        >
          {plans.map((plan) => (
            <option key={plan.id} value={plan.id}>
              {formatPlanLabel(plan)}
            </option>
          ))}
        </Select>

        <div className="space-y-1.5">
          <Input
            label="Duration (weeks)"
            name="chosen_duration_weeks"
            type="number"
            min={selectedPlan?.min_duration_weeks ?? 1}
            max={selectedPlan?.max_duration_weeks ?? undefined}
            value={durationWeeks}
            onChange={(event) => {
              setDurationWeeks(event.target.value);
              setInternshipEndDate("");
              setErrors((current) => ({
                ...current,
                chosen_duration_weeks: undefined,
                internship_end_date: undefined,
                form: undefined,
              }));
            }}
            error={errors.chosen_duration_weeks}
            disabled={!selectedPlan}
            required
          />
          {selectedPlan ? (
            <p className="text-ink-muted text-xs">
              Allowed for this plan: {selectedPlan.min_duration_weeks}–
              {selectedPlan.max_duration_weeks} weeks
            </p>
          ) : null}
        </div>

        <Input
          label="College"
          name="college"
          value={college}
          onChange={(event) => {
            setCollege(event.target.value);
            setErrors((current) => ({ ...current, college: undefined, form: undefined }));
          }}
          error={errors.college}
          required
        />

        <Select
          label="Year of study"
          name="year_of_study"
          value={yearOfStudy}
          onChange={(event) => {
            setYearOfStudy(event.target.value);
            setErrors((current) => ({ ...current, year_of_study: undefined, form: undefined }));
          }}
          error={errors.year_of_study}
          placeholder="Select your year"
          required
        >
          {YEAR_OPTIONS.map((year) => (
            <option key={year} value={year}>
              {year}
            </option>
          ))}
        </Select>

        <Input
          label="Full name (for offer letter & certificate)"
          name="certificate_name"
          value={certificateName}
          onChange={(event) => {
            setCertificateName(event.target.value);
            setErrors((current) => ({ ...current, certificate_name: undefined, form: undefined }));
          }}
          error={errors.certificate_name}
          placeholder="As it should appear on official documents"
          required
        />

        <div className="grid gap-5 sm:grid-cols-2">
          <DateInput
            label="Internship start date"
            name="internship_start_date"
            value={internshipStartDate}
            onChange={(nextValue) => {
              setInternshipStartDate(nextValue);
              setInternshipEndDate("");
              setErrors((current) => ({
                ...current,
                internship_start_date: undefined,
                internship_end_date: undefined,
                form: undefined,
              }));
            }}
            error={errors.internship_start_date}
            required
          />
          <DateInput
            label="Internship end date"
            name="internship_end_date"
            value={internshipEndDate}
            min={internshipStartDate || undefined}
            max={maxEndDate || undefined}
            onChange={(nextValue) => {
              setInternshipEndDate(nextValue);
              setErrors((current) => ({
                ...current,
                internship_end_date: undefined,
                form: undefined,
              }));
            }}
            error={errors.internship_end_date}
            disabled={!internshipStartDate || !maxEndDate}
            required
          />
        </div>
        <p className="text-ink-muted -mt-2 text-xs">
          Dates use DD/MM/YYYY and will be printed on your offer letter and internship certificate.
          {internshipStartDate && maxEndDate ? (
            <>
              {" "}
              For {duration} week{duration === 1 ? "" : "s"}, select an end date up to{" "}
              {formatIsoDateDdMmYyyy(maxEndDate)}.
            </>
          ) : null}
        </p>

        {errors.form ? (
          <p className="bg-danger-bg text-danger rounded-lg px-4 py-3 text-sm" role="alert">
            {errors.form}
          </p>
        ) : null}

        <Button
          type="submit"
          className="w-full"
          loading={submitting}
          disabled={domainsUnavailable || domains.length === 0 || plans.length === 0}
        >
          Complete enrollment
        </Button>

        <SupportContactNote className="text-center text-xs" />
      </form>
    </AuthCard>
  );
}

import type { InputHTMLAttributes } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
}

export function Input({ label, error, id, className = "", ...props }: InputProps) {
  const inputId = id ?? props.name;

  return (
    <div className="space-y-1.5">
      <label htmlFor={inputId} className="text-ink text-sm font-medium">
        {label}
      </label>
      <input
        id={inputId}
        className={`border-border bg-surface text-ink placeholder:text-ink-muted focus:border-brand w-full rounded-lg border px-4 py-2.5 text-sm transition-colors outline-none focus:ring-2 focus:ring-[color-mix(in_srgb,var(--color-brand)_25%,transparent)] ${error ? "border-danger" : ""} ${className}`}
        {...props}
      />
      {error ? <p className="text-danger text-xs">{error}</p> : null}
    </div>
  );
}

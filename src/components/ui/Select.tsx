import type { SelectHTMLAttributes } from "react";

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label: string;
  error?: string;
  placeholder?: string;
}

export function Select({
  label,
  error,
  id,
  className = "",
  placeholder,
  children,
  ...props
}: SelectProps) {
  const selectId = id ?? props.name;

  return (
    <div className="space-y-1.5">
      <label htmlFor={selectId} className="text-ink text-sm font-medium">
        {label}
      </label>
      <select
        id={selectId}
        className={`border-border bg-surface text-ink focus:border-brand w-full rounded-lg border px-4 py-2.5 text-sm transition-colors outline-none focus:ring-2 focus:ring-[color-mix(in_srgb,var(--color-brand)_25%,transparent)] ${error ? "border-danger" : ""} ${className}`}
        {...props}
      >
        {placeholder ? (
          <option value="" disabled>
            {placeholder}
          </option>
        ) : null}
        {children}
      </select>
      {error ? <p className="text-danger text-xs">{error}</p> : null}
    </div>
  );
}

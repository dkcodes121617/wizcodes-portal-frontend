import Link from "next/link";

interface TermsAcceptanceFieldProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  error?: string;
  id?: string;
}

export function TermsAcceptanceField({
  checked,
  onChange,
  error,
  id = "accept-terms",
}: TermsAcceptanceFieldProps) {
  return (
    <div className="space-y-1.5">
      <label htmlFor={id} className="flex cursor-pointer items-start gap-3 text-sm">
        <input
          id={id}
          name="acceptTerms"
          type="checkbox"
          checked={checked}
          onChange={(event) => onChange(event.target.checked)}
          className="border-border text-brand mt-0.5 size-4 shrink-0 rounded focus:ring-[color-mix(in_srgb,var(--color-brand)_25%,transparent)]"
        />
        <span className="text-ink-secondary leading-relaxed">
          I agree to the{" "}
          <Link
            href="/terms"
            className="text-brand hover:text-brand-strong font-medium transition-colors"
            target="_blank"
            rel="noopener noreferrer"
          >
            Terms &amp; Conditions
          </Link>{" "}
          of WizCodes Portal.
        </span>
      </label>
      {error ? <p className="text-danger text-xs">{error}</p> : null}
    </div>
  );
}

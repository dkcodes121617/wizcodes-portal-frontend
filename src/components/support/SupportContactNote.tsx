import { SUPPORT_EMAIL, SUPPORT_EMAIL_HREF } from "@/lib/support";

interface SupportContactNoteProps {
  className?: string;
}

export function SupportContactNote({ className = "" }: SupportContactNoteProps) {
  return (
    <p className={`text-ink-secondary text-sm ${className}`.trim()}>
      For any support or payment-related queries, contact us at{" "}
      <a
        href={SUPPORT_EMAIL_HREF}
        className="text-brand hover:text-brand-strong font-medium transition-colors"
      >
        {SUPPORT_EMAIL}
      </a>
      .
    </p>
  );
}

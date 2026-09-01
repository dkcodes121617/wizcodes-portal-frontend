import { SupportContactNote } from "@/components/support/SupportContactNote";

function LockIcon() {
  return (
    <svg
      aria-hidden="true"
      className="text-ink-muted h-5 w-5 shrink-0"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={1.5}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M16.5 10.5V7.875a4.875 4.875 0 1 0-9.75 0V10.5m11.25 0H4.875A1.125 1.125 0 0 0 3.75 11.625v7.125A1.125 1.125 0 0 0 4.875 19.875h14.25A1.125 1.125 0 0 0 20.25 18.75v-7.125A1.125 1.125 0 0 0 19.125 10.5Z"
      />
    </svg>
  );
}

export function AccessGrantedSection() {
  return (
    <section className="border-border mt-8 rounded-xl border px-5 py-4 text-left">
      <p className="text-ink-muted text-xs font-medium tracking-wide uppercase">Access</p>
      <p className="bg-success-bg text-success mt-3 rounded-lg px-4 py-3 text-sm font-medium">
        Access granted — your payment has been approved. Your internship tasks are now available
        below.
      </p>
    </section>
  );
}

export function LockedTasksSection() {
  return (
    <section
      className="border-border bg-surface-raised/60 mt-8 rounded-xl border border-dashed px-5 py-6 text-left opacity-80"
      aria-label="Tasks locked until payment is verified"
    >
      <div className="flex items-start gap-3">
        <LockIcon />
        <div>
          <p className="text-ink-muted text-xs font-medium tracking-wide uppercase">
            Your tasks
          </p>
          <p className="text-ink-secondary mt-2 text-sm">
            Your tasks will appear here once your payment is verified. This is a normal waiting
            step — nothing is wrong.
          </p>
        </div>
      </div>

      <SupportContactNote className="mt-5" />
    </section>
  );
}

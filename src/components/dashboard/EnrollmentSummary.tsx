interface EnrollmentSummaryProps {
  domainLabel: string;
  planLabel: string;
  durationWeeks: number | null;
  college: string | null;
}

export function EnrollmentSummary({
  domainLabel,
  planLabel,
  durationWeeks,
  college,
}: EnrollmentSummaryProps) {
  return (
    <dl className="border-border space-y-4 rounded-xl border px-5 py-4 text-left text-sm">
      <div>
        <dt className="text-ink-muted text-xs font-medium tracking-wide uppercase">Domain</dt>
        <dd className="text-ink mt-1 font-medium">{domainLabel}</dd>
      </div>
      <div>
        <dt className="text-ink-muted text-xs font-medium tracking-wide uppercase">Plan</dt>
        <dd className="text-ink mt-1 font-medium">{planLabel}</dd>
      </div>
      <div>
        <dt className="text-ink-muted text-xs font-medium tracking-wide uppercase">Duration</dt>
        <dd className="text-ink mt-1 font-medium">
          {durationWeeks ? `${durationWeeks} weeks` : "—"}
        </dd>
      </div>
      {college ? (
        <div>
          <dt className="text-ink-muted text-xs font-medium tracking-wide uppercase">College</dt>
          <dd className="text-ink mt-1 font-medium">{college}</dd>
        </div>
      ) : null}
    </dl>
  );
}

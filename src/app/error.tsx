"use client";

/**
 * Route-level error boundary. The raw error is never rendered — in production
 * Next.js replaces it with a generic message anyway, and showing internals to a
 * user is a leak. `digest` is the server-side correlation id.
 */
export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <main className="flex flex-1 items-center justify-center px-6 py-16">
      <div className="border-border bg-surface w-full max-w-md rounded-2xl border p-10 text-center">
        <h1 className="text-2xl font-semibold tracking-tight">Something went wrong</h1>

        <p className="text-ink-secondary mt-3 text-sm">
          The page could not be loaded. Please try again.
        </p>

        {error.digest ? (
          <p className="text-ink-muted mt-4 font-mono text-xs">Reference: {error.digest}</p>
        ) : null}

        <button
          type="button"
          onClick={reset}
          className="bg-brand hover:bg-brand-strong mt-8 rounded-lg px-5 py-2.5 text-sm font-medium text-white transition-colors"
        >
          Try again
        </button>
      </div>
    </main>
  );
}

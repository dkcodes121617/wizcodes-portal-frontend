/**
 * Placeholder home page.
 *
 * Intentionally minimal — it exists so the scaffold renders and so the brand
 * tokens in globals.css are exercised at least once. Replace it wholesale.
 */
import Link from "next/link";

export default function Home() {
  return (
    <main className="flex flex-1 items-center justify-center px-6 py-16">
      <div className="border-border bg-surface w-full max-w-xl rounded-2xl border p-10 text-center shadow-sm">
        <p className="text-ink-muted text-xs font-medium tracking-[0.2em] uppercase">
          Scaffold ready
        </p>

        <h1 className="mt-4 text-4xl font-semibold tracking-tight">
          <span className="text-wordmark-wiz">Wiz</span>
          <span className="text-wordmark-codes">Codes</span>
        </h1>

        <p className="text-ink-secondary mt-4 text-base">
          Next.js 16 · Tailwind CSS v4 · FastAPI · Neon Postgres
        </p>

        <div className="bg-brand-gradient mx-auto mt-8 h-1 w-24 rounded-full" />

        <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
          <Link
            href="/signup"
            className="bg-brand hover:bg-brand-strong rounded-lg px-5 py-2.5 text-sm font-medium text-white transition-colors"
          >
            Sign up
          </Link>
          <Link
            href="/login"
            className="border-border bg-surface hover:bg-surface-raised text-ink rounded-lg border px-5 py-2.5 text-sm font-medium transition-colors"
          >
            Log in
          </Link>
        </div>
      </div>
    </main>
  );
}

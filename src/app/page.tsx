/**
 * Placeholder home page.
 *
 * Intentionally minimal — it exists so the scaffold renders and so the brand
 * tokens in globals.css are exercised at least once. Replace it wholesale.
 */
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
      </div>
    </main>
  );
}

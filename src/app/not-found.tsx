import Link from "next/link";

export default function NotFound() {
  return (
    <main className="flex flex-1 items-center justify-center px-6 py-16">
      <div className="border-border bg-surface w-full max-w-md rounded-2xl border p-10 text-center">
        <p className="text-brand text-5xl font-semibold tracking-tight">404</p>

        <h1 className="mt-3 text-2xl font-semibold tracking-tight">Page not found</h1>

        <p className="text-ink-secondary mt-3 text-sm">
          The page you are looking for does not exist or has moved.
        </p>

        <Link
          href="/"
          className="bg-brand hover:bg-brand-strong mt-8 inline-block rounded-lg px-5 py-2.5 text-sm font-medium text-white transition-colors"
        >
          Back to home
        </Link>
      </div>
    </main>
  );
}

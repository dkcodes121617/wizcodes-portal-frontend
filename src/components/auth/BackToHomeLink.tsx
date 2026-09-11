import Link from "next/link";

export function BackToHomeLink() {
  return (
    <Link
      href="/"
      className="text-ink-secondary hover:text-ink inline-flex items-center gap-1.5 text-sm font-medium transition-colors"
    >
      <span aria-hidden>←</span>
      Back to home
    </Link>
  );
}

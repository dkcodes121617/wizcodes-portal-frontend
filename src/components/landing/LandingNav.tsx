import Link from "next/link";

function Wordmark() {
  return (
    <span className="text-xl font-bold tracking-tight">
      <span className="text-wordmark-wiz">Wiz</span>
      <span className="text-wordmark-codes">Codes</span>
    </span>
  );
}

const navLink = "text-ink-secondary hover:text-ink text-sm font-medium transition-colors";

export function LandingNav() {
  return (
    <header className="landing-nav sticky top-0 z-50">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-6 px-6 py-4">
        <Link href="/" className="shrink-0">
          <Wordmark />
        </Link>

        <nav className="hidden items-center gap-8 md:flex" aria-label="Main">
          <a href="#domains" className={navLink}>
            Domains
          </a>
          <a href="#why" className={navLink}>
            Why WizCodes
          </a>
          <a href="#pricing" className={navLink}>
            Pricing
          </a>
          <a href="#how-it-works" className={navLink}>
            How it works
          </a>
        </nav>

        <div className="flex items-center gap-3">
          <Link href="/login" className={`${navLink} hidden sm:inline`}>
            Sign in
          </Link>
          <Link href="/signup" className="btn-primary">
            Get started
          </Link>
        </div>
      </div>
    </header>
  );
}

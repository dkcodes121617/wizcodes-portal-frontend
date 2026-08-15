import Link from "next/link";
import type { ReactNode } from "react";

interface AuthCardProps {
  title: string;
  subtitle: string;
  children: ReactNode;
  footer: ReactNode;
}

export function AuthCard({ title, subtitle, children, footer }: AuthCardProps) {
  return (
    <main className="flex flex-1 items-center justify-center px-6 py-16">
      <div className="border-border bg-surface w-full max-w-md rounded-2xl border p-8 shadow-sm sm:p-10">
        <div className="text-center">
          <p className="text-ink-muted text-xs font-medium tracking-[0.2em] uppercase">
            WizCodes Portal
          </p>
          <h1 className="mt-3 text-2xl font-semibold tracking-tight">{title}</h1>
          <p className="text-ink-secondary mt-2 text-sm">{subtitle}</p>
        </div>

        <div className="mt-8">{children}</div>

        <div className="text-ink-secondary mt-8 text-center text-sm">{footer}</div>
      </div>
    </main>
  );
}

export function AuthLink({ href, children }: { href: "/login" | "/signup"; children: ReactNode }) {
  return (
    <Link href={href} className="text-brand hover:text-brand-strong font-medium transition-colors">
      {children}
    </Link>
  );
}

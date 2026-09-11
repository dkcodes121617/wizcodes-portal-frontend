"use client";

import Link from "next/link";

import { useIsAuthenticated } from "@/hooks/use-is-authenticated";

interface PricingCardProps {
  name: string;
  price: string;
  duration: string;
  features: string[];
  highlighted?: boolean;
}

export function PricingCard({
  name,
  price,
  duration,
  features,
  highlighted = false,
}: PricingCardProps) {
  const signedIn = useIsAuthenticated();

  return (
    <article className={`pricing-panel ${highlighted ? "pricing-panel-featured" : ""}`}>
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <h3 className="text-ink text-lg font-semibold">{name}</h3>
          {highlighted ? <p className="text-ink-muted mt-1 text-sm">{duration}</p> : null}
        </div>

        {highlighted ? (
          <span className="pricing-panel-badge shrink-0">Recommended</span>
        ) : (
          <p className="text-ink-muted shrink-0 text-sm">{duration}</p>
        )}
      </div>

      <p className="pricing-panel-price mt-4 sm:mt-5">{price}</p>
      <p className="text-ink-muted mt-1 text-sm">per internship</p>

      <ul className="border-border mt-5 space-y-2.5 border-t pt-5 sm:mt-8 sm:space-y-3 sm:pt-8">
        {features.map((feature) => (
          <li key={feature} className="pricing-panel-feature">
            {feature}
          </li>
        ))}
      </ul>

      <Link
        href={signedIn ? "/dashboard" : "/signup"}
        className={`mt-5 w-full text-center sm:mt-8 ${highlighted ? "btn-primary" : "btn-secondary"}`}
      >
        {signedIn ? "Go to dashboard" : "Get started"}
      </Link>
    </article>
  );
}

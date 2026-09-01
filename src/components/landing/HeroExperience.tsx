import { HeroPreview } from "@/components/landing/HeroPreview";
import type { ReactNode } from "react";

interface HeroExperienceProps {
  children: ReactNode;
}

export function HeroExperience({ children }: HeroExperienceProps) {
  return (
    <section className="hero-section">
      <div className="hero-section-glow" aria-hidden />

      <div className="relative z-10 mx-auto max-w-4xl px-4 py-12 text-center sm:px-6 sm:py-20 lg:py-28">
        <div>{children}</div>

        <div className="mx-auto mt-8 w-full max-w-md sm:mt-14 sm:max-w-lg">
          <HeroPreview />
        </div>
      </div>
    </section>
  );
}

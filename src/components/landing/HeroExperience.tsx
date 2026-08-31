"use client";

import { HeroPreview } from "@/components/landing/HeroPreview";
import { motion, useReducedMotion } from "framer-motion";
import type { ReactNode } from "react";

interface HeroExperienceProps {
  children: ReactNode;
}

export function HeroExperience({ children }: HeroExperienceProps) {
  const reduceMotion = useReducedMotion();

  return (
    <section className="hero-section">
      <div className="hero-section-glow" aria-hidden />

      <div className="relative z-10 mx-auto grid max-w-6xl items-center gap-14 px-6 py-20 lg:grid-cols-[1.05fr_0.95fr] lg:gap-16 lg:py-28">
        <motion.div
          className="text-center lg:text-left"
          initial={reduceMotion ? false : { opacity: 0, y: 20 }}
          animate={reduceMotion ? undefined : { opacity: 1, y: 0 }}
          transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
        >
          {children}
        </motion.div>

        <motion.div
          className="mx-auto w-full max-w-md lg:max-w-none"
          initial={reduceMotion ? false : { opacity: 0, y: 24 }}
          animate={reduceMotion ? undefined : { opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.08, ease: [0.22, 1, 0.36, 1] }}
        >
          <HeroPreview />
        </motion.div>
      </div>
    </section>
  );
}

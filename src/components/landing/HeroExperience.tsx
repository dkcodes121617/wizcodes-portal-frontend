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

      <div className="relative z-10 mx-auto max-w-4xl px-6 py-20 text-center lg:py-28">
        <motion.div
          initial={reduceMotion ? false : { opacity: 0, y: 20 }}
          animate={reduceMotion ? undefined : { opacity: 1, y: 0 }}
          transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
        >
          {children}
        </motion.div>

        <motion.div
          className="mx-auto mt-14 w-full max-w-lg"
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

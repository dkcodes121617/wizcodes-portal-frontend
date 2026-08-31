"use client";

import { motion, useReducedMotion } from "framer-motion";

export function HeroBadge() {
  const reduceMotion = useReducedMotion();

  return (
    <motion.div
      className="hero-badge glass inline-flex items-center gap-2 rounded-full px-4 py-1.5"
      initial={reduceMotion ? false : { opacity: 0, scale: 0.92 }}
      animate={reduceMotion ? undefined : { opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
    >
      <span className="hero-badge-dot" aria-hidden />
      <span className="text-ink-secondary text-xs font-medium tracking-wide">
        Now enrolling for 2026
      </span>
    </motion.div>
  );
}

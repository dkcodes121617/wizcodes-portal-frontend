"use client";

import { motion, useReducedMotion } from "framer-motion";
import type { ElementType, ReactNode } from "react";

interface ScrollRevealProps {
  children: ReactNode;
  className?: string;
  delay?: number;
  as?: ElementType;
}

export function ScrollReveal({
  children,
  className,
  delay = 0,
  as: Component = "div",
}: ScrollRevealProps) {
  const reduceMotion = useReducedMotion();
  const Static = Component as "div";

  if (reduceMotion) {
    return <Static className={className}>{children}</Static>;
  }

  const motionProps = {
    className,
    initial: { opacity: 1, y: 12 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, amount: 0.15 },
    transition: { duration: 0.5, delay, ease: [0.22, 1, 0.36, 1] as const },
  };

  if (Component === "li") {
    return <motion.li {...motionProps}>{children}</motion.li>;
  }

  return <motion.div {...motionProps}>{children}</motion.div>;
}

"use client";

import { motion, useReducedMotion, type HTMLMotionProps } from "framer-motion";
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
  const MotionComponent = motion.create(Component) as typeof motion.div;

  if (reduceMotion) {
    const Static = Component as "div";
    return <Static className={className}>{children}</Static>;
  }

  const motionProps: HTMLMotionProps<"div"> = {
    className,
    initial: { opacity: 0, y: 32 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, amount: 0.2, margin: "-60px" },
    transition: { duration: 0.65, delay, ease: [0.22, 1, 0.36, 1] },
  };

  return <MotionComponent {...motionProps}>{children}</MotionComponent>;
}

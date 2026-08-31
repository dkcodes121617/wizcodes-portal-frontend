"use client";

import {
  motion,
  useMotionTemplate,
  useMotionValue,
  useReducedMotion,
  useSpring,
} from "framer-motion";
import { FloatingParticles } from "@/components/landing/FloatingParticles";
import { useCallback, useRef, type ReactNode } from "react";

interface HeroExperienceProps {
  children: ReactNode;
  cards: ReactNode;
}

export function HeroExperience({ children, cards }: HeroExperienceProps) {
  const reduceMotion = useReducedMotion();
  const sectionRef = useRef<HTMLElement>(null);
  const cardsRef = useRef<HTMLDivElement>(null);

  const mouseX = useMotionValue(0.5);
  const mouseY = useMotionValue(0.5);
  const parallaxX = useSpring(0, { stiffness: 120, damping: 22 });
  const parallaxY = useSpring(0, { stiffness: 120, damping: 22 });
  const tiltX = useSpring(0, { stiffness: 100, damping: 24 });
  const tiltY = useSpring(0, { stiffness: 100, damping: 24 });

  const spotlight = useMotionTemplate`radial-gradient(680px circle at ${mouseX}px ${mouseY}px, color-mix(in srgb, var(--color-baby) 28%, transparent), transparent 65%)`;

  const handlePointerMove = useCallback(
    (event: React.PointerEvent<HTMLElement>) => {
      if (reduceMotion) return;

      const bounds = sectionRef.current?.getBoundingClientRect();
      if (!bounds) return;

      const x = event.clientX - bounds.left;
      const y = event.clientY - bounds.top;
      mouseX.set(x);
      mouseY.set(y);

      const offsetX = (event.clientX - bounds.left - bounds.width / 2) / bounds.width;
      const offsetY = (event.clientY - bounds.top - bounds.height / 2) / bounds.height;
      parallaxX.set(offsetX * 18);
      parallaxY.set(offsetY * 14);
      tiltX.set(offsetY * -5);
      tiltY.set(offsetX * 5);
    },
    [mouseX, mouseY, parallaxX, parallaxY, tiltX, tiltY, reduceMotion],
  );

  const handlePointerLeave = useCallback(() => {
    parallaxX.set(0);
    parallaxY.set(0);
    tiltX.set(0);
    tiltY.set(0);
  }, [parallaxX, parallaxY, tiltX, tiltY]);

  return (
    <section
      ref={sectionRef}
      className="hero-stage bg-warm-wash relative overflow-hidden"
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
    >
      <div className="hero-aurora hero-aurora-a" aria-hidden />
      <div className="hero-aurora hero-aurora-b" aria-hidden />
      <div className="hero-aurora hero-aurora-c" aria-hidden />
      <div className="hero-grid" aria-hidden />
      <FloatingParticles />

      {!reduceMotion ? (
        <motion.div
          className="pointer-events-none absolute inset-0 z-[1]"
          style={{ background: spotlight }}
          aria-hidden
        />
      ) : null}

      <div className="relative z-10 mx-auto max-w-6xl px-6 py-16 lg:py-24">
        <motion.div
          className="relative z-10 mx-auto max-w-3xl text-center"
          initial={reduceMotion ? false : { opacity: 0, y: 28 }}
          animate={reduceMotion ? undefined : { opacity: 1, y: 0 }}
          transition={{ duration: 0.75, ease: [0.22, 1, 0.36, 1] }}
        >
          {children}
        </motion.div>

        <motion.div
          ref={cardsRef}
          className="hero-cards-stage relative z-10 mx-auto mt-12 h-52 w-full max-w-md sm:mt-14 sm:h-60 sm:max-w-lg lg:mt-16 lg:h-64 lg:max-w-xl"
          style={
            reduceMotion
              ? undefined
              : {
                  x: parallaxX,
                  y: parallaxY,
                  rotateX: tiltX,
                  rotateY: tiltY,
                  transformPerspective: 1200,
                }
          }
        >
          {cards}
        </motion.div>
      </div>

      <div className="hero-divider" aria-hidden />
    </section>
  );
}

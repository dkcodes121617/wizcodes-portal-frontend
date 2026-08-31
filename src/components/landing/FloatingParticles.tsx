"use client";

import { useReducedMotion } from "framer-motion";
import type { CSSProperties } from "react";

const PARTICLES = Array.from({ length: 18 }, (_, index) => ({
  id: index,
  left: `${(index * 17 + 7) % 100}%`,
  top: `${(index * 23 + 11) % 85}%`,
  size: index % 3 === 0 ? 4 : index % 3 === 1 ? 3 : 2,
  delay: `${(index * 0.7) % 5}s`,
  duration: `${8 + (index % 6)}s`,
}));

export function FloatingParticles() {
  const reduceMotion = useReducedMotion();
  if (reduceMotion) return null;

  return (
    <div className="pointer-events-none absolute inset-0 z-[2] overflow-hidden" aria-hidden>
      {PARTICLES.map((particle) => (
        <span
          key={particle.id}
          className="hero-particle"
          style={
            {
              left: particle.left,
              top: particle.top,
              width: particle.size,
              height: particle.size,
              "--particle-delay": particle.delay,
              "--particle-duration": particle.duration,
            } as CSSProperties
          }
        />
      ))}
    </div>
  );
}

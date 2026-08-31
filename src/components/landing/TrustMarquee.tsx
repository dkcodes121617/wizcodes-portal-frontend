"use client";

const MARQUEE_ITEMS = [
  "GitHub repos",
  "Real tasks",
  "Offer letters",
  "Certificates",
  "1:1 mentorship",
  "Portfolio-ready work",
] as const;

export function TrustMarquee() {
  const loop = [...MARQUEE_ITEMS, ...MARQUEE_ITEMS];

  return (
    <div className="trust-marquee mt-10 overflow-hidden" aria-hidden>
      <div className="trust-marquee-track">
        {loop.map((item, index) => (
          <span key={`${item}-${index}`} className="trust-marquee-item">
            {item}
          </span>
        ))}
      </div>
    </div>
  );
}

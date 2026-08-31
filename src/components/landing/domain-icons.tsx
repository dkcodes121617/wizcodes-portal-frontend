import type { SVGProps } from "react";

export type DomainIconProps = SVGProps<SVGSVGElement> & { idSuffix?: string };

export function WebDevIcon({ idSuffix = "web", ...props }: DomainIconProps) {
  const body = `web-body-${idSuffix}`;
  const screen = `web-screen-${idSuffix}`;
  const shine = `web-shine-${idSuffix}`;

  return (
    <svg viewBox="0 0 48 48" fill="none" aria-hidden {...props}>
      <defs>
        <linearGradient id={body} x1="6" y1="8" x2="42" y2="40" gradientUnits="userSpaceOnUse">
          <stop stopColor="var(--color-web)" />
          <stop offset="1" stopColor="var(--color-brand-strong)" />
        </linearGradient>
        <linearGradient
          id={screen}
          x1="10"
          y1="18"
          x2="38"
          y2="34"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="var(--color-surface)" />
          <stop offset="1" stopColor="var(--color-web-bg)" />
        </linearGradient>
        <linearGradient
          id={shine}
          x1="8"
          y1="10"
          x2="28"
          y2="22"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="var(--color-surface)" stopOpacity="0.45" />
          <stop offset="1" stopColor="var(--color-surface)" stopOpacity="0" />
        </linearGradient>
      </defs>
      <rect x="5" y="9" width="38" height="30" rx="7" fill={`url(#${body})`} />
      <rect
        x="8"
        y="12"
        width="32"
        height="6"
        rx="3"
        fill="var(--color-brand-deep)"
        fillOpacity="0.35"
      />
      <circle cx="11.5" cy="15" r="1.1" fill="var(--color-surface)" fillOpacity="0.85" />
      <circle cx="15.5" cy="15" r="1.1" fill="var(--color-surface)" fillOpacity="0.55" />
      <circle cx="19.5" cy="15" r="1.1" fill="var(--color-surface)" fillOpacity="0.35" />
      <rect x="10" y="20" width="28" height="16" rx="3.5" fill={`url(#${screen})`} />
      <ellipse cx="18" cy="14" rx="12" ry="5" fill={`url(#${shine})`} />
      <path
        d="M14.5 27.5 12 30l2.5 2.5M22 32h7M33.5 27.5 36 30l-2.5 2.5"
        stroke="var(--color-brand-strong)"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M17 24.5h4.5"
        stroke="var(--color-web)"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
    </svg>
  );
}

export function AiMlIcon({ idSuffix = "ai", ...props }: DomainIconProps) {
  const chip = `ai-chip-${idSuffix}`;
  const glow = `ai-glow-${idSuffix}`;
  const node = `ai-node-${idSuffix}`;

  return (
    <svg viewBox="0 0 48 48" fill="none" aria-hidden {...props}>
      <defs>
        <linearGradient
          id={chip}
          x1="14"
          y1="14"
          x2="34"
          y2="34"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="var(--color-ai)" />
          <stop offset="1" stopColor="var(--color-brand-deep)" />
        </linearGradient>
        <linearGradient id={glow} x1="8" y1="12" x2="40" y2="36" gradientUnits="userSpaceOnUse">
          <stop stopColor="var(--color-ai)" stopOpacity="0.35" />
          <stop offset="1" stopColor="var(--color-ai-bg)" stopOpacity="0" />
        </linearGradient>
        <radialGradient
          id={node}
          cx="0"
          cy="0"
          r="1"
          gradientUnits="userSpaceOnUse"
          gradientTransform="translate(24 24) scale(10)"
        >
          <stop stopColor="var(--color-surface)" />
          <stop offset="1" stopColor="var(--color-ai-bg)" />
        </radialGradient>
      </defs>
      <circle cx="24" cy="24" r="17" fill={`url(#${glow})`} />
      <path
        d="M12 24h5M31 24h5M24 12v5M24 31v5M15.5 15.5l3.5 3.5M29 29l3.5 3.5M32.5 15.5 29 19M19 29l-3.5 3.5"
        stroke="var(--color-ai)"
        strokeWidth="1.4"
        strokeLinecap="round"
        strokeOpacity="0.55"
      />
      <rect x="15" y="15" width="18" height="18" rx="5" fill={`url(#${chip})`} />
      <rect x="18.5" y="18.5" width="11" height="11" rx="2.5" fill={`url(#${node})`} />
      <circle
        cx="12"
        cy="24"
        r="2.6"
        fill="var(--color-ai-bg)"
        stroke="var(--color-ai)"
        strokeWidth="1.4"
      />
      <circle
        cx="36"
        cy="15"
        r="2.6"
        fill="var(--color-ai-bg)"
        stroke="var(--color-ai)"
        strokeWidth="1.4"
      />
      <circle
        cx="36"
        cy="33"
        r="2.6"
        fill="var(--color-ai-bg)"
        stroke="var(--color-ai)"
        strokeWidth="1.4"
      />
      <circle cx="24" cy="24" r="2" fill="var(--color-surface)" fillOpacity="0.9" />
      <path
        d="M14.6 24h1.8M32.6 15h1.8M32.6 33h1.8"
        stroke="var(--color-ai)"
        strokeWidth="1.2"
        strokeLinecap="round"
      />
    </svg>
  );
}

export function MobileDevIcon({ idSuffix = "mobile", ...props }: DomainIconProps) {
  const body = `mobile-body-${idSuffix}`;
  const screen = `mobile-screen-${idSuffix}`;
  const shine = `mobile-shine-${idSuffix}`;

  return (
    <svg viewBox="0 0 48 48" fill="none" aria-hidden {...props}>
      <defs>
        <linearGradient id={body} x1="15" y1="5" x2="33" y2="43" gradientUnits="userSpaceOnUse">
          <stop stopColor="var(--color-mobile)" />
          <stop offset="1" stopColor="var(--color-brand-strong)" />
        </linearGradient>
        <linearGradient
          id={screen}
          x1="19"
          y1="11"
          x2="29"
          y2="33"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="var(--color-surface)" />
          <stop offset="1" stopColor="var(--color-mobile-bg)" />
        </linearGradient>
        <linearGradient
          id={shine}
          x1="17"
          y1="7"
          x2="27"
          y2="18"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="var(--color-surface)" stopOpacity="0.5" />
          <stop offset="1" stopColor="var(--color-surface)" stopOpacity="0" />
        </linearGradient>
      </defs>
      <rect x="15" y="5" width="18" height="38" rx="5.5" fill={`url(#${body})`} />
      <rect
        x="17.5"
        y="7.5"
        width="13"
        height="3"
        rx="1.5"
        fill="var(--color-surface)"
        fillOpacity="0.25"
      />
      <rect x="18.5" y="11.5" width="11" height="24" rx="2.5" fill={`url(#${screen})`} />
      <ellipse cx="21" cy="10" rx="6" ry="3" fill={`url(#${shine})`} />
      <rect
        x="20.5"
        y="15"
        width="3.2"
        height="3.2"
        rx="0.8"
        fill="var(--color-mobile)"
        fillOpacity="0.85"
      />
      <rect
        x="24.8"
        y="15"
        width="3.2"
        height="3.2"
        rx="0.8"
        fill="var(--color-mobile)"
        fillOpacity="0.65"
      />
      <rect
        x="20.5"
        y="19.5"
        width="3.2"
        height="3.2"
        rx="0.8"
        fill="var(--color-mobile)"
        fillOpacity="0.65"
      />
      <rect
        x="24.8"
        y="19.5"
        width="3.2"
        height="3.2"
        rx="0.8"
        fill="var(--color-brand-strong)"
        fillOpacity="0.75"
      />
      <path
        d="M22.2 26.2 24 28.4l3.4-4.2"
        stroke="var(--color-mobile)"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx="24" cy="37.5" r="2" fill="var(--color-surface)" fillOpacity="0.85" />
    </svg>
  );
}

export type DomainIconId = "web" | "ai" | "mobile";

export const DOMAIN_ICONS = {
  web: WebDevIcon,
  ai: AiMlIcon,
  mobile: MobileDevIcon,
} as const;

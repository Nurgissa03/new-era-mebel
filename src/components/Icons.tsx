import type { SVGProps } from 'react';

type P = SVGProps<SVGSVGElement> & { size?: number };

const base = (size: number, sw: number, rest: SVGProps<SVGSVGElement>) => ({
  width: size,
  height: size,
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: sw,
  strokeLinecap: 'round' as const,
  strokeLinejoin: 'round' as const,
  'aria-hidden': true,
  ...rest,
});

export const IconPhone = ({ size = 18, ...r }: P) => (
  <svg {...base(size, 1.8, r)}>
    <path d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2z" />
  </svg>
);

export const IconArrow = ({ size = 18, ...r }: P) => (
  <svg {...base(size, 2, r)}>
    <path d="M5 12h14M13 6l6 6-6 6" />
  </svg>
);

export const IconSearch = ({ size = 40, ...r }: P) => (
  <svg {...base(size, 1.4, r)}>
    <circle cx="11" cy="11" r="7" />
    <path d="M20 20l-4-4" />
  </svg>
);

export const IconCheckCircle = ({ size = 56, ...r }: P) => (
  <svg {...base(size, 1.6, r)}>
    <circle cx="12" cy="12" r="10" />
    <path d="M7.5 12.5l3 3 6-6.5" />
  </svg>
);

export const IconPlus = ({ size = 22, ...r }: P) => (
  <svg {...base(size, 2, r)}>
    <path d="M12 5v14M5 12h14" />
  </svg>
);

export const IconMenu = ({ size = 20, ...r }: P) => (
  <svg {...base(size, 1.8, r)}>
    <path d="M4 8h16M4 16h16" />
  </svg>
);

export const IconClose = ({ size = 20, ...r }: P) => (
  <svg {...base(size, 1.8, r)}>
    <path d="M6 6l12 12M18 6L6 18" />
  </svg>
);

export const IconCamera = ({ size = 22, ...r }: P) => (
  <svg {...base(size, 1.6, r)}>
    <rect x="3" y="6" width="18" height="14" rx="2" />
    <circle cx="12" cy="13" r="3.5" />
    <path d="M8 6l1.5-2h5L16 6" />
  </svg>
);

export const IconDrag = ({ size = 22, ...r }: P) => (
  <svg {...base(size, 2, r)}>
    <path d="M9 6l-6 6 6 6M15 6l6 6-6 6" />
  </svg>
);

/** Иконки услуг из макета. */
export const ServiceIcon = ({ name }: { name: string }) => {
  const p = { width: 36, height: 36, viewBox: '0 0 24 24', fill: 'none', stroke: 'var(--accent)', strokeWidth: 1.4, strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const, 'aria-hidden': true };
  switch (name) {
    case 'wardrobe':
      return (
        <svg {...p}>
          <rect x="4" y="3" width="16" height="17" />
          <path d="M12 3v17M10 10v3M14 10v3M6 20v1.5M18 20v1.5" />
        </svg>
      );
    case 'kitchen':
      return (
        <svg {...p}>
          <rect x="3" y="3" width="18" height="6" />
          <rect x="3" y="12" width="18" height="9" />
          <path d="M9 12v9M15 12v9M5 11h14" />
        </svg>
      );
    case 'bed':
      return (
        <svg {...p}>
          <path d="M3 19V7M3 14h18v5M21 19v-5M3 11h18" />
          <rect x="5" y="8" width="5" height="3" />
        </svg>
      );
    case 'table':
      return (
        <svg {...p}>
          <path d="M3 9h18M6 9v11M18 9v11M8 9v8M16 9v8" />
        </svg>
      );
    case 'kids':
      return (
        <svg {...p}>
          <rect x="4" y="13" width="7" height="7" />
          <rect x="13" y="13" width="7" height="7" />
          <rect x="8.5" y="5" width="7" height="7" />
        </svg>
      );
    default:
      return (
        <svg {...p}>
          <rect x="3" y="8" width="13" height="12" />
          <path d="M3 12h13M16 14h5M19 12l2 2-2 2" />
        </svg>
      );
  }
};

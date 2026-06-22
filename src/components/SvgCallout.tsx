import { ReactNode } from 'react';

/**
 * Leader-line callout for the SVG simulator infographics.
 * Draws a dot on the part (x,y) and a thin line to a labelled pill placed in
 * the margin (lx,ly). anchor="end" right-aligns the pill (for right-side labels).
 */
export function Callout({ x, y, lx, ly, anchor = 'start', dot, children }: {
  x: number; y: number; lx: number; ly: number;
  anchor?: 'start' | 'end'; dot: string; children: ReactNode;
}) {
  const width = 168;
  const boxX = anchor === 'end' ? lx - width : lx;
  const textX = anchor === 'end' ? lx - 10 : lx + 10;
  return (
    <g>
      <line x1={x} y1={y} x2={lx} y2={ly} stroke="#cbd5e1" strokeWidth="1.3" strokeLinecap="round" opacity="0.9" />
      <circle cx={x} cy={y} r="4" fill={dot} stroke="#f8fafc" strokeWidth="1.3" />
      <rect x={boxX} y={ly - 13} width={width} height="26" rx="6" fill="#0f172a" stroke={dot} strokeWidth="1.1" opacity="0.96" />
      <text x={textX} y={ly + 4} fill="#f8fafc" fontSize="12" fontWeight="700" textAnchor={anchor === 'end' ? 'end' : 'start'}>
        {children}
      </text>
    </g>
  );
}

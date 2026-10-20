import { useId } from "react";

const TILE_SIZE = 48;

const PLAID_STRIPES = [
  { offset: 6, width: 9, fill: "var(--plaid-band)" },
  { offset: 22, width: 3, fill: "var(--plaid-stripe)" },
  { offset: 35, width: 0.75, fill: "var(--plaid-line)" },
  { offset: 38, width: 0.75, fill: "var(--plaid-line)" },
] as const;

export function PlaidStrip() {
  const patternId = useId();

  return (
    <svg
      aria-hidden="true"
      focusable="false"
      width="100%"
      height="100%"
      className="block shrink-0 text-foreground"
    >
      <defs>
        <pattern
          id={patternId}
          width={TILE_SIZE}
          height={TILE_SIZE}
          y="-8"
          patternUnits="userSpaceOnUse"
        >
          <rect width={TILE_SIZE} height={TILE_SIZE} fill="var(--surface)" />
          {PLAID_STRIPES.map(({ offset, width, fill }) => (
            <g key={offset} fill={fill}>
              <rect x={offset} width={width} height={TILE_SIZE} />
              <rect y={offset} width={TILE_SIZE} height={width} />
            </g>
          ))}
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill={`url(#${patternId})`} />
      <g stroke="var(--foreground)">
        <line x2="100%" y1="0.5" y2="0.5" />
        <line x2="100%" y1="100%" y2="100%" transform="translate(0 -0.5)" />
      </g>
    </svg>
  );
}

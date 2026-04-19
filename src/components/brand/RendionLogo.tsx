interface RendionLogoProps {
  size?: number;
  className?: string;
  color?: string;
}

/**
 * rendion.de brand mark: minimal house silhouette with integrated checkmark.
 * The checkmark forms the right side of the roof and continues downward,
 * creating a single unified mark.
 *
 * Works at 24px (header), 32px (nav), 48px (login), 64px (hero).
 * Uses viewBox for responsive scaling.
 */
export function RendionLogo({
  size = 24,
  className,
  color = "#745b82",
}: RendionLogoProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 32 32"
      width={size}
      height={size}
      fill="none"
      className={className}
      aria-hidden="true"
      focusable="false"
    >
      {/* House body */}
      <path
        d="M6 15v11a1 1 0 0 0 1 1h18a1 1 0 0 0 1-1V15"
        fill={color}
        fillOpacity={0.1}
        stroke={color}
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* Roof left side + checkmark forming right side of roof */}
      <path
        d="M3 17l13-12 5.5 5.5L29 3"
        fill="none"
        stroke={color}
        strokeWidth={2.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* Door */}
      <rect
        x={13}
        y={20}
        width={6}
        height={7}
        rx={0.5}
        fill={color}
        fillOpacity={0.25}
        stroke={color}
        strokeWidth={1.5}
        strokeLinejoin="round"
      />
    </svg>
  );
}

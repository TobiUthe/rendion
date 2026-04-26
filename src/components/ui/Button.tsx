import { forwardRef, type ButtonHTMLAttributes, type AnchorHTMLAttributes } from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";

/* ── Variant × Size style maps ─────────────────────────────── */

const variantStyles = {
  primary:
    "bg-primary-600 text-white shadow-sm hover:bg-primary-700 active:scale-[0.98]",
  secondary:
    "border border-[var(--color-border)] bg-[var(--color-surface)] text-[var(--color-foreground)] shadow-sm hover:bg-[var(--color-surface-elevated)]",
  ghost:
    "text-[var(--color-text-secondary)] hover:bg-[var(--color-surface-elevated)] hover:text-[var(--color-foreground)]",
  destructive:
    "bg-danger-600 text-white shadow-sm hover:bg-danger-700 active:scale-[0.98]",
  gradient:
    "bg-gradient-to-r from-primary-700 via-primary-600 to-primary-500 text-white shadow-sm hover:from-primary-800 hover:via-primary-700 hover:to-primary-600 active:scale-[0.97]",
  link:
    "text-primary-600 underline-offset-2 hover:underline p-0 h-auto",
} as const;

const sizeStyles = {
  sm: "h-8 px-3 text-sm gap-1.5 rounded-lg",
  md: "h-10 px-4 text-sm gap-2 rounded-lg",
  lg: "h-12 px-6 text-base gap-2 rounded-xl",
} as const;

const iconOnlySizeStyles = {
  sm: "h-8 w-8 rounded-lg",
  md: "h-10 w-10 rounded-lg",
  lg: "h-12 w-12 rounded-xl",
} as const;

/* ── Shared base classes ───────────────────────────────────── */

const baseStyles =
  "inline-flex items-center justify-center font-medium transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-600 disabled:pointer-events-none disabled:opacity-50";

/* ── Types ─────────────────────────────────────────────────── */

type Variant = keyof typeof variantStyles;
type Size = keyof typeof sizeStyles;

interface SharedProps {
  variant?: Variant;
  size?: Size;
  /** Render as icon-only button (square, no text padding) */
  iconOnly?: boolean;
  className?: string;
}

type ButtonAsButton = SharedProps &
  ButtonHTMLAttributes<HTMLButtonElement> & {
    href?: never;
  };

type ButtonAsLink = SharedProps &
  Omit<AnchorHTMLAttributes<HTMLAnchorElement>, "href"> & {
    href: string;
  };

type ButtonProps = ButtonAsButton | ButtonAsLink;

/**
 * Universal Button component.
 *
 * Renders a `<button>` by default, or a Next.js `<Link>` when `href` is provided.
 *
 * ```tsx
 * <Button variant="primary" size="md">Speichern</Button>
 * <Button variant="secondary" href="/analysen">Zurück</Button>
 * <Button variant="ghost" size="sm" iconOnly><Plus className="h-4 w-4" /></Button>
 * ```
 */
export const Button = forwardRef<
  HTMLButtonElement | HTMLAnchorElement,
  ButtonProps
>(function Button(props, ref) {
  const {
    variant = "primary",
    size = "md",
    iconOnly = false,
    className,
    ...rest
  } = props;

  const classes = cn(
    baseStyles,
    variantStyles[variant],
    iconOnly ? iconOnlySizeStyles[size] : sizeStyles[size],
    className
  );

  if ("href" in rest && rest.href) {
    const { href, ...linkRest } = rest as ButtonAsLink;
    return (
      <Link
        ref={ref as React.Ref<HTMLAnchorElement>}
        href={href}
        className={classes}
        {...linkRest}
      />
    );
  }

  const buttonRest = rest as ButtonAsButton;
  return (
    <button
      ref={ref as React.Ref<HTMLButtonElement>}
      className={classes}
      {...buttonRest}
    />
  );
});

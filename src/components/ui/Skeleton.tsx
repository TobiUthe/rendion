/**
 * Reusable skeleton placeholder with pulse animation.
 * Use for loading states before content is available.
 */
export function Skeleton({
  className = "",
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={`animate-pulse rounded-lg bg-neutral-200/60 ${className}`}
      {...props}
    />
  );
}

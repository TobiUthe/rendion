interface LoadingSpinnerProps {
  size?: "sm" | "md" | "lg";
  className?: string;
}

const SIZE_MAP = {
  sm: "h-6 w-6 border-2",
  md: "h-8 w-8 border-4",
  lg: "h-10 w-10 border-4",
} as const;

export function LoadingSpinner({ size = "md", className = "" }: LoadingSpinnerProps) {
  return (
    <div className={`flex items-center justify-center ${className}`}>
      <div
        className={`animate-spin rounded-full border-sand-200 border-t-primary-500 ${SIZE_MAP[size]}`}
        role="status"
        aria-label="Wird geladen"
      >
        <span className="sr-only">Wird geladen...</span>
      </div>
    </div>
  );
}

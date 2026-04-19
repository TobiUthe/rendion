import type { ReactNode } from "react";
import { Header } from "./Header";
import { Footer } from "./Footer";

interface PublicLayoutProps {
  children: ReactNode;
  /**
   * Container width preset for the main content area.
   * - "default" = 72rem / 1152px
   * - "narrow"  = 56rem / 896px  (articles, legal pages)
   * - "wide"    = 80rem / 1280px (landing pages)
   * - "full"    = no container constraint (child manages its own widths)
   */
  width?: "default" | "narrow" | "wide" | "full";
}

const widthClass: Record<NonNullable<PublicLayoutProps["width"]>, string> = {
  default: "container-lg page-px",
  narrow: "container-md page-px",
  wide: "container-xl page-px",
  full: "",
};

/**
 * Standard layout for all public (unauthenticated) pages.
 *
 * Wraps content with Header + Footer and a consistent container.
 * Replaces ad-hoc `<Header /> <main>...</main> <Footer />` patterns.
 */
export function PublicLayout({
  children,
  width = "default",
}: PublicLayoutProps) {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main id="main-content" tabIndex={-1} className="flex-1 outline-none">
        {width === "full" ? (
          children
        ) : (
          <div className={widthClass[width]}>{children}</div>
        )}
      </main>
      <Footer />
    </div>
  );
}

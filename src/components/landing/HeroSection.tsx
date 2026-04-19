"use client";

import { useEffect, useRef, useState, useCallback } from "react";

export function HeroSection() {
  return (
    <section className="py-10 md:py-16">
      {/* Hero copy + social proof */}
      <div className="mx-auto max-w-3xl text-center">
        <h1 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold leading-tight tracking-[-0.02em] text-neutral-900">
          Immobilien{" "}
          <span
            className="bg-gradient-to-r from-primary-600 via-primary-500 to-primary-400 bg-clip-text text-transparent"
          >
            klar berechnet.
          </span>
        </h1>
        <p className="mx-auto mt-4 max-w-xl text-lg leading-relaxed text-neutral-500">
          Rendite, Cashflow & Langfrist-Prognosen berechnen, kostenlos und ohne Anmeldung.
        </p>

        {/* Social proof stats */}
        <div className="mt-8 flex flex-wrap items-center justify-center gap-0">
          <AnimatedStat target={10000} suffix="+" label="Analysen berechnet" delay={0} />
          <span className="mx-6 hidden h-8 w-px bg-sand-200 sm:block" aria-hidden="true" />
          <SocialProofStat value="Kostenlos" label="Ohne Anmeldung" delay={100} />
          <span className="mx-6 hidden h-8 w-px bg-sand-200 sm:block" aria-hidden="true" />
          <SocialProofStat value="DSGVO" label="Datenschutz-konform" delay={200} />
        </div>

        <p className="mt-6 text-sm text-neutral-500">
          Kostenlos, ohne Anmeldung — Ergebnis in 2 Minuten
        </p>
      </div>
    </section>
  );
}

/** Formats a number with German thousands separator (dot). */
function formatDE(n: number): string {
  return n.toLocaleString("de-DE");
}

/** Animated count-up stat that triggers when visible via IntersectionObserver. */
function AnimatedStat({
  target,
  suffix = "",
  label,
  delay = 0,
}: {
  target: number;
  suffix?: string;
  label: string;
  delay?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [display, setDisplay] = useState("0");
  const hasAnimated = useRef(false);

  const animate = useCallback(() => {
    if (hasAnimated.current) return;
    hasAnimated.current = true;

    const duration = 1600; // ms
    let start: number | null = null;

    function step(timestamp: number) {
      if (start === null) start = timestamp;
      const elapsed = timestamp - start;
      const progress = Math.min(elapsed / duration, 1);
      // Ease-out cubic for a satisfying deceleration
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = Math.round(eased * target);
      setDisplay(formatDE(current) + suffix);

      if (progress < 1) {
        requestAnimationFrame(step);
      }
    }

    requestAnimationFrame(step);
  }, [target, suffix]);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    // If IntersectionObserver is not supported, animate immediately
    if (typeof IntersectionObserver === "undefined") {
      animate();
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          animate();
          observer.disconnect();
        }
      },
      { threshold: 0.3 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [animate]);

  return (
    <div
      ref={ref}
      className="flex flex-col animate-fade-in-up"
      style={{ animationDelay: `${delay}ms` }}
    >
      <span className="font-display text-xl sm:text-2xl font-bold text-primary-600">
        {display}
      </span>
      <span className="text-sm text-neutral-500">{label}</span>
    </div>
  );
}

function SocialProofStat({ value, label, delay = 0 }: { value: string; label: string; delay?: number }) {
  return (
    <div className="flex flex-col animate-fade-in-up" style={{ animationDelay: `${delay}ms` }}>
      <span className="font-display text-xl sm:text-2xl font-bold text-primary-600">
        {value}
      </span>
      <span className="text-sm text-neutral-500">{label}</span>
    </div>
  );
}

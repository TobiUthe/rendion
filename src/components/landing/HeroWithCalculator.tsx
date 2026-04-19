"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { HeroBackground } from "./HeroBackground";
import { Calculator } from "@/components/calculator/Calculator";

export function HeroWithCalculator() {
  return (
    <section className="relative">
      <HeroBackground />
      <div className="grid items-center gap-10 py-10 lg:grid-cols-[1.1fr_0.9fr] lg:gap-16 lg:py-20">
        <HeroCopy />
        <div id="rechner" className="scroll-mt-24">
          <Calculator />
        </div>
      </div>
    </section>
  );
}

function HeroCopy() {
  return (
    <div className="text-center lg:text-left">
      <span className="inline-flex items-center gap-2 rounded-full border border-sand-200/80 bg-white/70 px-3 py-1 text-xs font-medium text-neutral-600 shadow-sm backdrop-blur">
        <span className="h-1.5 w-1.5 rounded-full bg-pine-500" />
        Rendite in 5 Sekunden
      </span>
      <h1 className="mt-5 font-display text-3xl font-bold leading-tight tracking-[-0.02em] text-balance text-neutral-900 sm:text-4xl lg:text-5xl">
        Immobilien{" "}
        <span className="bg-gradient-to-r from-primary-600 via-primary-500 to-primary-400 bg-clip-text text-transparent">
          klar berechnet.
        </span>
      </h1>
      <p className="mx-auto mt-4 max-w-xl text-lg leading-relaxed text-neutral-500 lg:mx-0">
        Rendite, Cashflow und 30-Jahre-Prognose berechnen — kostenlos, ohne Anmeldung,
        DSGVO-konform.
      </p>

      <div className="mt-8 flex flex-wrap items-center justify-center gap-0 lg:justify-start">
        <AnimatedStat target={10000} suffix="+" label="Analysen berechnet" delay={0} />
        <span className="mx-6 hidden h-8 w-px bg-sand-200 sm:block" aria-hidden="true" />
        <SocialProofStat value="Kostenlos" label="Ohne Anmeldung" delay={100} />
        <span className="mx-6 hidden h-8 w-px bg-sand-200 sm:block" aria-hidden="true" />
        <SocialProofStat value="DSGVO" label="Datenschutz-konform" delay={200} />
      </div>
    </div>
  );
}

function formatDE(n: number): string {
  return n.toLocaleString("de-DE");
}

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
    const duration = 1600;
    let start: number | null = null;

    function step(timestamp: number) {
      if (start === null) start = timestamp;
      const elapsed = timestamp - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = Math.round(eased * target);
      setDisplay(formatDE(current) + suffix);
      if (progress < 1) requestAnimationFrame(step);
    }

    requestAnimationFrame(step);
  }, [target, suffix]);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
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
      { threshold: 0.3 },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [animate]);

  return (
    <div ref={ref} className="flex flex-col animate-fade-in-up" style={{ animationDelay: `${delay}ms` }}>
      <span className="font-display text-xl font-bold text-primary-600 sm:text-2xl">{display}</span>
      <span className="text-sm text-neutral-500">{label}</span>
    </div>
  );
}

function SocialProofStat({ value, label, delay = 0 }: { value: string; label: string; delay?: number }) {
  return (
    <div className="flex flex-col animate-fade-in-up" style={{ animationDelay: `${delay}ms` }}>
      <span className="font-display text-xl font-bold text-primary-600 sm:text-2xl">{value}</span>
      <span className="text-sm text-neutral-500">{label}</span>
    </div>
  );
}

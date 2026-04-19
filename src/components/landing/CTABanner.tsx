"use client";

import { Button } from "@/components/ui/Button";
import { trackEvent } from "@/lib/analytics/umami";

export function CTABanner() {
  return (
    <section className="px-4 py-16 lg:px-8">
      <div className="mx-auto max-w-4xl rounded-xl border border-sand-200 bg-gradient-to-br from-sand-50 to-white px-6 py-12 text-center shadow-sm sm:px-12 sm:py-14">
        <h2 className="font-display text-2xl font-semibold tracking-tight text-neutral-900 sm:text-3xl">
          Bereit für Ihre erste Analyse?
        </h2>
        <p className="mt-2 text-base text-neutral-500">
          Kostenlos und ohne Anmeldung. In unter 2 Minuten.
        </p>
        <Button
          variant="gradient"
          href="/#rechner"
          className="mt-6 rounded-full px-8 py-3 text-sm-plus"
          onClick={() => trackEvent("cta_click", { location: "cta_banner" })}
        >
          Jetzt berechnen
        </Button>
      </div>
    </section>
  );
}

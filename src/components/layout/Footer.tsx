"use client";

import Link from "next/link";
import { RendionLogo } from "@/components/brand/RendionLogo";

export function Footer() {
  return (
    <footer className="border-t border-sand-200 text-neutral-400">
      <div className="mx-auto grid max-w-7xl gap-10 px-6 py-12 text-center md:grid-cols-4 md:text-left">
        {/* Left column — Brand */}
        <div>
          <p className="inline-flex items-center gap-2 font-semibold text-neutral-500">
            <RendionLogo size={24} color="currentColor" />
            <span>rendion</span>
          </p>
          <hr className="my-3 border-sand-100" />
          <p className="font-display italic text-xs text-neutral-400">
            Immobilien klar berechnet.
          </p>
        </div>

        {/* Product links */}
        <div>
          <h4 className="font-display mb-2 text-xs font-semibold uppercase tracking-wider text-neutral-500">
            Produkt
          </h4>
          <ul className="space-y-1.5 text-sm">
            <li>
              <Link
                href="/#rechner"
                className="transition hover:text-neutral-600"
              >
                Rechner
              </Link>
            </li>
            <li>
              <Link
                href="/#funktionen"
                className="transition hover:text-neutral-600"
              >
                Funktionen
              </Link>
            </li>
          </ul>
        </div>

        {/* Legal links */}
        <div>
          <h4 className="font-display mb-2 text-xs font-semibold uppercase tracking-wider text-neutral-500">
            Rechtliches
          </h4>
          <ul className="space-y-1.5 text-sm">
            <li>
              <Link
                href="/datenschutz"
                className="transition hover:text-neutral-600"
              >
                Datenschutz
              </Link>
            </li>
            <li>
              <Link
                href="/impressum"
                className="transition hover:text-neutral-600"
              >
                Impressum
              </Link>
            </li>
          </ul>
        </div>

        {/* Newsletter */}
        <div>
          <h4 className="font-display mb-2 text-xs font-semibold uppercase tracking-wider text-neutral-500">
            Newsletter
          </h4>
          <p className="mb-3 text-sm text-neutral-400">
            Marktbericht & neue Funktionen — monatlich.
          </p>
          <form
            onSubmit={(e) => e.preventDefault()}
            className="flex flex-col gap-2 sm:flex-row md:flex-col"
            aria-label="Newsletter-Anmeldung"
          >
            <input
              type="email"
              placeholder="ihre@email.de"
              disabled
              className="w-full rounded-lg border border-sand-200 bg-sand-50 px-3 py-2 text-sm text-[var(--color-text-secondary)] placeholder:text-[var(--color-text-tertiary)] disabled:cursor-not-allowed disabled:opacity-60"
              aria-label="E-Mail-Adresse"
            />
            <button
              type="submit"
              disabled
              className="rounded-lg bg-primary-600 px-3 py-2 text-sm font-medium text-white opacity-50 cursor-not-allowed whitespace-nowrap"
            >
              Anmelden
            </button>
          </form>
          <p className="mt-2 text-xs text-neutral-400">Bald verfügbar</p>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-sand-100 px-6 py-4">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-2 text-xs text-neutral-400 sm:flex-row">
          <p>&copy; {new Date().getFullYear()} rendion</p>
        </div>
      </div>
    </footer>
  );
}

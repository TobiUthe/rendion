"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Menu, X } from "lucide-react";
import { RendionLogo } from "@/components/brand/RendionLogo";
import { ThemeToggle } from "@/components/layout/ThemeToggle";
import { useMockAuth, clearMockAuth } from "@/lib/auth/mockAuth";

export function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const router = useRouter();
  const authed = useMockAuth();

  const handleLogout = () => {
    clearMockAuth();
    setMobileOpen(false);
    router.push("/");
    router.refresh();
  };

  return (
    <header className="sticky top-0 z-[var(--z-header)] shadow-[0_1px_0_0_rgba(0,0,0,0.04)] bg-[var(--color-surface)]/80 backdrop-blur-[24px]">
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:z-50 focus:top-2 focus:left-2 focus:rounded-lg focus:bg-primary-600 focus:px-4 focus:py-2 focus:text-sm focus:font-medium focus:text-white focus:shadow-lg"
      >
        Zum Inhalt springen
      </a>
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 sm:px-6 py-3">
        <Link
          href="/"
          className="flex items-center gap-2 text-[17px] font-semibold tracking-tight text-neutral-900"
        >
          <RendionLogo size={28} />
          <span>rendion</span>
        </Link>

        <div className="hidden md:flex items-center gap-2">
          <ThemeToggle />
          {authed === null ? (
            <div className="h-10 w-44" aria-hidden="true" />
          ) : authed ? (
            <>
              <Link
                href="/dashboard"
                className="rounded-full px-4 py-2.5 text-sm-plus font-medium text-neutral-500 transition hover:text-neutral-900"
              >
                Dashboard
              </Link>
              <button
                type="button"
                onClick={handleLogout}
                className="rounded-full bg-neutral-100 px-4 py-2.5 text-sm-plus font-medium text-neutral-700 transition hover:bg-neutral-200"
              >
                Abmelden
              </button>
            </>
          ) : (
            <>
              <Link
                href="/anmelden"
                className="rounded-full px-4 py-2.5 text-sm-plus font-medium text-neutral-500 transition hover:text-neutral-900"
              >
                Anmelden
              </Link>
              <Link
                href="/registrieren"
                className="rounded-full bg-gradient-to-r from-primary-700 via-primary-600 to-primary-500 px-4 py-2.5 text-sm-plus font-medium text-white shadow-sm transition hover:from-primary-800 hover:via-primary-700 hover:to-primary-600 active:scale-[0.97]"
              >
                Kostenlos starten
              </Link>
            </>
          )}
        </div>

        <div className="flex md:hidden items-center gap-1">
          <ThemeToggle />
          <button
            type="button"
            onClick={() => setMobileOpen((prev) => !prev)}
            className="rounded-lg p-2 text-neutral-600 transition hover:text-neutral-900"
            aria-label="Menü öffnen"
            aria-expanded={mobileOpen}
            aria-controls="mobile-nav"
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      <div
        id="mobile-nav"
        className={`md:hidden border-t border-sand-100 bg-[var(--color-surface)]/95 backdrop-blur-[24px] px-4 overflow-hidden transition-all duration-300 ease-out ${
          mobileOpen ? "max-h-56 pb-4 pt-2" : "max-h-0"
        }`}
      >
        <nav className="flex flex-col gap-1">
          {authed ? (
            <>
              <Link
                href="/dashboard"
                onClick={() => setMobileOpen(false)}
                className="rounded-lg px-3 py-2.5 text-left text-sm-plus font-medium text-neutral-600 transition hover:bg-neutral-50 hover:text-neutral-900"
              >
                Dashboard
              </Link>
              <button
                type="button"
                onClick={handleLogout}
                className="rounded-lg px-3 py-2.5 text-left text-sm-plus font-medium text-neutral-600 transition hover:bg-neutral-50 hover:text-neutral-900"
              >
                Abmelden
              </button>
            </>
          ) : (
            <>
              <Link
                href="/anmelden"
                onClick={() => setMobileOpen(false)}
                className="rounded-lg px-3 py-2.5 text-left text-sm-plus font-medium text-neutral-600 transition hover:bg-neutral-50 hover:text-neutral-900"
              >
                Anmelden
              </Link>
              <Link
                href="/registrieren"
                onClick={() => setMobileOpen(false)}
                className="rounded-lg px-3 py-2.5 text-left text-sm-plus font-medium text-neutral-600 transition hover:bg-neutral-50 hover:text-neutral-900"
              >
                Konto erstellen
              </Link>
              <Link
                href="/registrieren"
                onClick={() => setMobileOpen(false)}
                className="mt-2 block w-full rounded-full bg-gradient-to-r from-primary-700 via-primary-600 to-primary-500 px-4 py-2.5 text-center text-sm-plus font-medium text-white shadow-sm transition hover:from-primary-800 hover:via-primary-700 hover:to-primary-600 active:scale-[0.97]"
              >
                Kostenlos starten
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}

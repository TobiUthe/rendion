"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { setMockAuth } from "@/lib/auth/mockAuth";
import { RouteProgressBar } from "@/components/ui/RouteProgressBar";
import { trackEvent } from "@/lib/analytics/umami";

interface MockAuthFormProps {
  mode: "signin" | "signup";
  title: string;
  submitLabel: string;
  redirectTo?: string;
}

export function MockAuthForm({ mode, title, submitLabel, redirectTo = "/dashboard" }: MockAuthFormProps) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const altHref = mode === "signin" ? "/registrieren" : "/anmelden";
  const altLabel = mode === "signin" ? "Noch kein Konto? Registrieren" : "Schon registriert? Anmelden";

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    trackEvent("auth_submit", { mode });
    setMockAuth();
    startTransition(() => {
      router.push(redirectTo);
    });
  };

  return (
    <div className="mx-auto w-full max-w-md">
      <RouteProgressBar active={pending} />
      <div className="rounded-xl border border-sand-200 bg-white p-6 shadow-sm sm:p-8">
        <h1 className="font-display text-2xl font-bold leading-snug text-neutral-900">{title}</h1>
        <p className="mt-2 text-sm text-neutral-500">
          Demo-Modus: Jede Eingabe wird akzeptiert. Du landest direkt im Dashboard.
        </p>

        <form onSubmit={onSubmit} className="mt-6 flex flex-col gap-4" noValidate>
          <Input
            label="E-Mail"
            type="email"
            placeholder="demo@rendion.de"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoComplete={mode === "signup" ? "email" : "username"}
          />
          <Input
            label="Passwort"
            type="password"
            placeholder="Beliebig"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete={mode === "signup" ? "new-password" : "current-password"}
          />

          <Button type="submit" variant="primary" size="lg" className="mt-2 w-full" disabled={pending}>
            {pending ? "Einen Moment…" : submitLabel}
          </Button>
        </form>

        <div className="mt-4 flex items-center justify-between text-sm">
          <Link href={altHref} className="text-primary-600 underline-offset-2 hover:underline">
            {altLabel}
          </Link>
          <Link href="/" className="text-neutral-500 underline-offset-2 hover:underline">
            Startseite
          </Link>
        </div>
      </div>
    </div>
  );
}

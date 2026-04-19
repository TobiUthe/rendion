import {
  BarChart3,
  TrendingUp,
  LineChart,
  ArrowLeftRight,
  Award,
  Receipt,
  Dices,
} from "lucide-react";
import type { ReactNode } from "react";

/* ── Background glass shapes ── */

function BentoBackground() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
      {/* Top-left blob */}
      <svg
        viewBox="0 0 400 400"
        className="absolute -left-20 -top-16 h-80 w-80 opacity-[0.07] blur-3xl"
      >
        <circle cx="200" cy="200" r="180" className="fill-primary-400" />
      </svg>

      {/* Top-right rounded square */}
      <svg
        viewBox="0 0 300 300"
        className="absolute -right-10 -top-8 h-64 w-64 opacity-[0.05] blur-2xl"
      >
        <rect x="30" y="30" width="240" height="240" rx="60" className="fill-accent-400" />
      </svg>

      {/* Center-left ring */}
      <svg
        viewBox="0 0 200 200"
        className="absolute left-[8%] top-[45%] h-48 w-48 opacity-[0.04] blur-xl"
      >
        <circle cx="100" cy="100" r="80" fill="none" className="stroke-primary-500" strokeWidth="24" />
      </svg>

      {/* Bottom-right blob */}
      <svg
        viewBox="0 0 500 400"
        className="absolute -bottom-20 -right-24 h-72 w-96 opacity-[0.06] blur-3xl"
      >
        <ellipse cx="250" cy="200" rx="220" ry="170" className="fill-primary-300" />
      </svg>

      {/* Bottom-left accent diamond */}
      <svg
        viewBox="0 0 200 200"
        className="absolute -bottom-8 left-[15%] h-40 w-40 opacity-[0.04] blur-2xl"
      >
        <rect
          x="40" y="40" width="120" height="120" rx="20"
          className="fill-warning-400"
          transform="rotate(45 100 100)"
        />
      </svg>

      {/* Mid-right small circle */}
      <svg
        viewBox="0 0 120 120"
        className="absolute right-[12%] top-[30%] h-28 w-28 opacity-[0.05] blur-xl"
      >
        <circle cx="60" cy="60" r="50" className="fill-success-400" />
      </svg>
    </div>
  );
}

/* ── Mini SVG illustrations per card ── */

function MiniBarChart() {
  return (
    <svg viewBox="0 0 120 48" fill="none" className="h-12 w-full" aria-hidden="true">
      <rect x="4" y="28" width="14" height="20" rx="3" className="fill-primary-200/60" />
      <rect x="24" y="18" width="14" height="30" rx="3" className="fill-primary-300/60" />
      <rect x="44" y="8" width="14" height="40" rx="3" className="fill-primary-400/60" />
      <rect x="64" y="14" width="14" height="34" rx="3" className="fill-primary-300/60" />
      <rect x="84" y="22" width="14" height="26" rx="3" className="fill-primary-200/60" />
      <rect x="104" y="4" width="14" height="44" rx="3" className="fill-primary-500/50" />
    </svg>
  );
}

function MiniCashflowLine() {
  return (
    <svg viewBox="0 0 120 48" fill="none" className="h-12 w-full" aria-hidden="true">
      <polyline
        points="4,40 20,32 40,36 60,20 80,24 100,12 116,8"
        className="stroke-success-500/50"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
      <polyline
        points="4,40 20,32 40,36 60,20 80,24 100,12 116,8 116,48 4,48"
        className="fill-success-500/10"
        fill="currentColor"
      />
    </svg>
  );
}

function MiniDealScore() {
  return (
    <svg viewBox="0 0 120 48" fill="none" className="h-12 w-full" aria-hidden="true">
      {/* Gauge segments A through F */}
      <rect x="4" y="20" width="16" height="16" rx="3" className="fill-success-500/50" />
      <rect x="24" y="20" width="16" height="16" rx="3" className="fill-success-500/30" />
      <rect x="44" y="20" width="16" height="16" rx="3" className="fill-warning-500/30" />
      <rect x="64" y="20" width="16" height="16" rx="3" className="fill-warning-500/20" />
      <rect x="84" y="20" width="16" height="16" rx="3" className="fill-primary-200/30" />
      <rect x="104" y="20" width="12" height="16" rx="3" className="fill-primary-200/20" />
      {/* Pointer on B grade */}
      <polygon points="32,40 28,46 36,46" className="fill-primary-500/60" />
    </svg>
  );
}

function MiniMonteCarlo() {
  return (
    <svg viewBox="0 0 120 48" fill="none" className="h-12 w-full" aria-hidden="true">
      {/* Confidence band - outer (90%) */}
      <path
        d="M4 30 Q30 28 60 22 T116 8 L116 40 Q90 36 60 34 T4 38 Z"
        className="fill-primary-200/30"
      />
      {/* Confidence band - inner (50%) */}
      <path
        d="M4 32 Q30 30 60 24 T116 12 L116 36 Q90 34 60 30 T4 36 Z"
        className="fill-primary-300/30"
      />
      {/* Median line */}
      <path
        d="M4 34 Q30 30 60 26 T116 16"
        className="stroke-primary-500/60"
        strokeWidth="2"
        strokeLinecap="round"
        fill="none"
      />
    </svg>
  );
}

function MiniTaxShield() {
  return (
    <svg viewBox="0 0 120 48" fill="none" className="h-12 w-full" aria-hidden="true">
      {/* Descending steps representing depreciation */}
      <rect x="4" y="8" width="18" height="40" rx="3" className="fill-warning-500/40" />
      <rect x="26" y="14" width="18" height="34" rx="3" className="fill-warning-500/35" />
      <rect x="48" y="20" width="18" height="28" rx="3" className="fill-warning-500/30" />
      <rect x="70" y="26" width="18" height="22" rx="3" className="fill-warning-500/25" />
      <rect x="92" y="32" width="18" height="16" rx="3" className="fill-warning-500/20" />
    </svg>
  );
}

function MiniProjection() {
  return (
    <svg viewBox="0 0 120 48" fill="none" className="h-12 w-full" aria-hidden="true">
      <path
        d="M4 44 Q30 38 50 30 T96 10 L116 4"
        className="stroke-primary-500/50"
        strokeWidth="2.5"
        strokeLinecap="round"
        fill="none"
      />
      <path
        d="M4 44 Q30 38 50 30 T96 10 L116 4 L116 48 L4 48 Z"
        className="fill-primary-500/8"
      />
      {/* Dashed trend line */}
      <line x1="4" y1="42" x2="116" y2="8" className="stroke-primary-300/40" strokeWidth="1" strokeDasharray="4 3" />
    </svg>
  );
}

function MiniComparison() {
  return (
    <svg viewBox="0 0 120 48" fill="none" className="h-12 w-full" aria-hidden="true">
      {/* Two diverging lines */}
      <polyline
        points="4,40 30,34 60,24 90,16 116,6"
        className="stroke-primary-500/50"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
      <polyline
        points="4,40 30,36 60,30 90,26 116,20"
        className="stroke-accent-500/50"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
        strokeDasharray="5 3"
      />
    </svg>
  );
}

/* ── Feature definitions ── */

interface Feature {
  icon: typeof BarChart3;
  title: string;
  description: string;
  accent: string;
  iconBg: string;
  gradient: string;
  illustration: ReactNode;
  span: string;
  /** Wide cards get larger padding, title, and illustration */
  size?: "lg" | "default";
  /** Show a PRO badge */
  pro?: boolean;
}

const features: Feature[] = [
  // ── Row 1: 2-1 ──
  {
    icon: BarChart3,
    title: "KPI-Dashboard",
    description:
      "Bruttorendite, Nettocashflow, Cap Rate, DSCR und 6 weitere Kennzahlen auf einen Blick.",
    accent: "text-primary-600",
    iconBg: "bg-primary-100",
    gradient: "from-primary-50/80 to-white",
    illustration: <MiniBarChart />,
    span: "sm:col-span-2 lg:col-span-2",
    size: "lg",
  },
  {
    icon: Award,
    title: "Deal Scoring",
    description:
      "Automatische A–F Bewertung auf Basis von Rendite, Cashflow und Standort.",
    accent: "text-accent-600",
    iconBg: "bg-accent-50",
    gradient: "from-accent-50/60 to-white",
    illustration: <MiniDealScore />,
    span: "lg:col-span-1",
    pro: true,
  },
  // ── Row 2: 1-1-1 ──
  {
    icon: TrendingUp,
    title: "Cashflow-Analyse",
    description:
      "Monatliche Einnahmen und Ausgaben mit Steuerberechnung — auf den Cent genau.",
    accent: "text-success-500",
    iconBg: "bg-success-50",
    gradient: "from-success-50/60 to-white",
    illustration: <MiniCashflowLine />,
    span: "lg:col-span-1",
  },
  {
    icon: LineChart,
    title: "30-Jahres-Prognose",
    description:
      "Vermögensaufbau, Wertsteigerung und Eigenkapitalentwicklung über drei Jahrzehnte.",
    accent: "text-primary-600",
    iconBg: "bg-primary-100",
    gradient: "from-primary-50/40 to-white",
    illustration: <MiniProjection />,
    span: "lg:col-span-1",
  },
  {
    icon: ArrowLeftRight,
    title: "ETF-Vergleich",
    description:
      "Immobilie vs. ETF-Sparplan — welche Anlage performt besser?",
    accent: "text-accent-600",
    iconBg: "bg-accent-50",
    gradient: "from-accent-50/50 to-white",
    illustration: <MiniComparison />,
    span: "lg:col-span-1",
  },
  // ── Row 3: 1-2 ──
  {
    icon: Receipt,
    title: "AfA & Steuereffekte",
    description:
      "Abschreibungen, Werbungskosten und steuerliche Auswirkungen auf Ihren Cashflow.",
    accent: "text-warning-500",
    iconBg: "bg-warning-50",
    gradient: "from-warning-50/50 to-white",
    illustration: <MiniTaxShield />,
    span: "lg:col-span-1",
  },
  {
    icon: Dices,
    title: "Profi-Analyse",
    description:
      "Finanzierungs-Baukasten, Monte-Carlo-Simulation, Stresstests und Sensitivitätsanalyse.",
    accent: "text-primary-600",
    iconBg: "bg-primary-100",
    gradient: "from-primary-50/60 to-white",
    illustration: <MiniMonteCarlo />,
    span: "sm:col-span-2 lg:col-span-2",
    size: "lg",
    pro: true,
  },
];

export function FeatureBentoGrid() {
  return (
    <section id="funktionen" className="relative overflow-hidden px-4 py-16">
      <BentoBackground />
      <div className="relative mx-auto max-w-6xl">
        <h2 className="font-display text-center text-2xl sm:text-3xl font-semibold text-neutral-900">
          Professionelle Immobilienanalyse
        </h2>
        <p className="mt-3 text-center text-neutral-500">
          Von der Erstbewertung bis zur Monte-Carlo-Simulation
        </p>

        <div className="mt-10 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((feature, index) => {
            const isLg = feature.size === "lg";
            return (
              <div
                key={feature.title}
                className={`group animate-fade-in-up rounded-xl bg-gradient-to-br ${feature.gradient} border border-sand-200/80 shadow-sm backdrop-blur-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md ${feature.span} ${isLg ? "p-8" : "p-6"}`}
                style={{ animationDelay: `${Math.min(index * 40, 200)}ms` }}
              >
                <div className={isLg ? "sm:flex sm:items-start sm:justify-between sm:gap-6" : ""}>
                  <div className={isLg ? "max-w-[60%]" : ""}>
                    <div className="flex items-center gap-2">
                      <div className={`inline-flex items-center justify-center rounded-xl ${feature.iconBg} ${feature.accent} ${isLg ? "h-12 w-12" : "h-10 w-10"}`}>
                        <feature.icon className={isLg ? "size-6" : "size-5"} />
                      </div>
                      {feature.pro && (
                        <span className="inline-flex items-center rounded-full bg-accent-100 px-2 py-0.5 text-xs font-medium text-accent-700">
                          PRO
                        </span>
                      )}
                    </div>
                    <h3 className={`font-display mt-4 font-semibold text-neutral-900 ${isLg ? "text-xl" : "text-lg"}`}>
                      {feature.title}
                    </h3>
                    <p className={`mt-2 leading-relaxed text-neutral-500 ${isLg ? "text-base" : "text-sm-plus"}`}>
                      {feature.description}
                    </p>
                  </div>
                  {isLg && (
                    <div className="hidden shrink-0 self-center opacity-60 transition-opacity duration-200 group-hover:opacity-90 sm:block sm:w-36">
                      {feature.illustration}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

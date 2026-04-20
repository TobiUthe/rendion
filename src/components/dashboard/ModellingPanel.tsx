"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";
import { HEADINGS, BODY, DATA } from "@/lib/design-tokens";

export function ModellingPanel() {
  const [zinssatz, setZinssatz] = useState(4.0);
  const [tilgungsrate, setTilgungsrate] = useState(2.5);
  const [wertsteigerung, setWertsteigerung] = useState(2.0);
  const [mieterhoehung, setMieterhoehung] = useState(1.5);

  return (
    <div id="modelling-panel" className="lg:sticky lg:top-[4.5rem] self-start space-y-4">
      <div className="rounded-xl border border-sand-200 bg-white shadow-sm p-5">
        <h3 className={cn(HEADINGS.h3, "mb-4")}>
          Parameter anpassen
        </h3>

        <div className="space-y-4">
          <div>
            <label className="flex items-center justify-between mb-2">
              <span className={cn(BODY.formLabel)}>Zinssatz</span>
              <span className={cn(DATA.parameterValue)}>{zinssatz.toFixed(1)} %</span>
            </label>
            <input
              type="range"
              min="1"
              max="8"
              step="0.1"
              value={zinssatz}
              onChange={(e) => setZinssatz(parseFloat(e.target.value))}
              className="w-full h-2 bg-sand-200 rounded-lg appearance-none cursor-pointer accent-primary-600 modelling-slider-range"
              style={{ "--range-fill": `${((zinssatz - 1) / (8 - 1)) * 100}%` } as React.CSSProperties}
            />
            <div className={cn(DATA.axisLabel, "flex justify-between mt-1")}>
              <span>1%</span>
              <span>8%</span>
            </div>
          </div>

          <div>
            <label className="flex items-center justify-between mb-2">
              <span className={cn(BODY.formLabel)}>Tilgungsrate</span>
              <span className={cn(DATA.parameterValue)}>{tilgungsrate.toFixed(1)} %</span>
            </label>
            <input
              type="range"
              min="1"
              max="6"
              step="0.1"
              value={tilgungsrate}
              onChange={(e) => setTilgungsrate(parseFloat(e.target.value))}
              className="w-full h-2 bg-sand-200 rounded-lg appearance-none cursor-pointer accent-primary-600 modelling-slider-range"
              style={{ "--range-fill": `${((tilgungsrate - 1) / (6 - 1)) * 100}%` } as React.CSSProperties}
            />
            <div className={cn(DATA.axisLabel, "flex justify-between mt-1")}>
              <span>1%</span>
              <span>6%</span>
            </div>
          </div>

          <div>
            <label className="flex items-center justify-between mb-2">
              <span className={cn(BODY.formLabel)}>Wertsteigerung p.a.</span>
              <span className={cn(DATA.parameterValue)}>{wertsteigerung.toFixed(1)} %</span>
            </label>
            <input
              type="range"
              min="0"
              max="5"
              step="0.1"
              value={wertsteigerung}
              onChange={(e) => setWertsteigerung(parseFloat(e.target.value))}
              className="w-full h-2 bg-sand-200 rounded-lg appearance-none cursor-pointer accent-primary-600 modelling-slider-range"
              style={{ "--range-fill": `${(wertsteigerung / 5) * 100}%` } as React.CSSProperties}
            />
            <div className={cn(DATA.axisLabel, "flex justify-between mt-1")}>
              <span>0%</span>
              <span>5%</span>
            </div>
          </div>

          <div>
            <label className="flex items-center justify-between mb-2">
              <span className={cn(BODY.formLabel)}>Mieterhöhung p.a.</span>
              <span className={cn(DATA.parameterValue)}>{mieterhoehung.toFixed(1)} %</span>
            </label>
            <input
              type="range"
              min="0"
              max="5"
              step="0.1"
              value={mieterhoehung}
              onChange={(e) => setMieterhoehung(parseFloat(e.target.value))}
              className="w-full h-2 bg-sand-200 rounded-lg appearance-none cursor-pointer accent-primary-600 modelling-slider-range"
              style={{ "--range-fill": `${(mieterhoehung / 5) * 100}%` } as React.CSSProperties}
            />
            <div className={cn(DATA.axisLabel, "flex justify-between mt-1")}>
              <span>0%</span>
              <span>5%</span>
            </div>
          </div>
        </div>

        <div className="mt-6 rounded-lg border border-sand-200 bg-sand-50 px-4 py-3 text-center">
          <p className={cn(BODY.strong)}>
            Live-Neuberechnung
          </p>
          <p className={cn(BODY.muted, "mt-0.5")}>
            Kommt in Kürze — aktuell Demo-Daten
          </p>
          <span className="mt-2 inline-flex items-center gap-1.5 rounded-full bg-warning-50 border border-warning-200 px-2.5 py-0.5 text-xs font-medium text-warning-700">
            <span className="h-1.5 w-1.5 rounded-full bg-warning-500 animate-pulse" />
            In Entwicklung
          </span>
        </div>
      </div>
    </div>
  );
}

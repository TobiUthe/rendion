"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";

export function ModellingPanel() {
  const [zinssatz, setZinssatz] = useState(4.0);
  const [tilgungsrate, setTilgungsrate] = useState(2.5);
  const [wertsteigerung, setWertsteigerung] = useState(2.0);
  const [mieterhoehung, setMieterhoehung] = useState(1.5);

  return (
    <div id="modelling-panel" className="lg:sticky lg:top-[4.5rem] self-start space-y-4">
      <div className="rounded-xl border border-sand-200 bg-white shadow-sm p-5">
        <h3 className="font-display text-lg font-semibold text-neutral-900 mb-4">
          Parameter anpassen
        </h3>

        <div className="space-y-4">
          <div>
            <label className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-neutral-600">Zinssatz</span>
              <span className="font-mono text-sm font-semibold text-primary-600">{zinssatz.toFixed(1)} %</span>
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
            <div className="flex justify-between text-xs text-neutral-400 mt-1">
              <span>1%</span>
              <span>8%</span>
            </div>
          </div>

          <div>
            <label className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-neutral-600">Tilgungsrate</span>
              <span className="font-mono text-sm font-semibold text-primary-600">{tilgungsrate.toFixed(1)} %</span>
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
            <div className="flex justify-between text-xs text-neutral-400 mt-1">
              <span>1%</span>
              <span>6%</span>
            </div>
          </div>

          <div>
            <label className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-neutral-600">Wertsteigerung p.a.</span>
              <span className="font-mono text-sm font-semibold text-primary-600">{wertsteigerung.toFixed(1)} %</span>
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
            <div className="flex justify-between text-xs text-neutral-400 mt-1">
              <span>0%</span>
              <span>5%</span>
            </div>
          </div>

          <div>
            <label className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-neutral-600">Mieterhöhung p.a.</span>
              <span className="font-mono text-sm font-semibold text-primary-600">{mieterhoehung.toFixed(1)} %</span>
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
            <div className="flex justify-between text-xs text-neutral-400 mt-1">
              <span>0%</span>
              <span>5%</span>
            </div>
          </div>
        </div>

        <div className="mt-6 rounded-lg border border-sand-200 bg-sand-50 px-4 py-3 text-center">
          <p className="text-sm font-medium text-neutral-500">
            Live-Neuberechnung
          </p>
          <p className="text-xs text-neutral-400 mt-0.5">
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

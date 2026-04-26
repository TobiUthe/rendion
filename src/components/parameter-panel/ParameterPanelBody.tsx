'use client';

import { useState, useCallback } from 'react';
import { SegmentedControl } from '@/components/ui/SegmentedControl';
import { CurrencyInput } from '@/components/ui/CurrencyInput';
import { PercentInput } from '@/components/ui/PercentInput';
import { YearsInput } from '@/components/ui/YearsInput';
import { LockedField } from './LockedField';
import { UpsellFooter } from './UpsellFooter';
import { PARAMETER_TABS, type ParameterTab } from './types';
import { formatEuro, formatPercent as _formatPercent, formatYears } from '@/lib/format';

// In the parameter panel, percent values can have up to 2 significant decimal places
// (e.g. maklerSatz: 3.57). Use decimals:2 to preserve precision in locked-field display.
const formatPercent = (v: number) => _formatPercent(v, { decimals: 2 });
import type { ErgebnisView } from '@/lib/calculator/mapResultToView';
import type { QuickCalcInput } from '@/lib/schemas/calculator';

interface ParameterPanelBodyProps {
  input: QuickCalcInput;
  view?: ErgebnisView;
  unlockedTabs: readonly ParameterTab[];
  onInputChange?: (input: QuickCalcInput) => void;
  onAuthRequest: () => void;
}

export function ParameterPanelBody({
  input,
  view,
  unlockedTabs,
  onInputChange,
  onAuthRequest,
}: ParameterPanelBodyProps) {
  const [activeTab, setActiveTab] = useState<ParameterTab>('basisdaten');

  const updateField = useCallback(
    <K extends keyof QuickCalcInput>(key: K, value: QuickCalcInput[K]) => {
      if (!onInputChange) return;
      onInputChange({ ...input, [key]: value });
    },
    [input, onInputChange],
  );

  const isUnlocked = (tab: ParameterTab) => unlockedTabs.includes(tab);

  return (
    <div>
      <div className="-mx-1 overflow-x-auto no-scrollbar">
        <div className="min-w-max px-1">
          <SegmentedControl
            value={activeTab}
            onChange={(v) => setActiveTab(v as ParameterTab)}
            options={PARAMETER_TABS}
          />
        </div>
      </div>

      <div className="mt-6 grid gap-3 grid-cols-1 sm:grid-cols-2">
        {activeTab === 'basisdaten' &&
          (isUnlocked('basisdaten') ? (
            <>
              <CurrencyInput
                label="Kaufpreis"
                value={input.kaufpreis}
                onChange={(v) => updateField('kaufpreis', v)}
              />
              <CurrencyInput
                label="Kaltmiete / Monat"
                value={input.kaltmiete}
                onChange={(v) => updateField('kaltmiete', v)}
              />
              <CurrencyInput
                label="Eigenkapital"
                value={input.eigenkapital}
                onChange={(v) => updateField('eigenkapital', v)}
              />
            </>
          ) : (
            <>
              <LockedField label="Kaufpreis" value={formatEuro(input.kaufpreis)} onClick={onAuthRequest} />
              <LockedField label="Kaltmiete / Monat" value={formatEuro(input.kaltmiete)} onClick={onAuthRequest} />
              <LockedField label="Eigenkapital" value={formatEuro(input.eigenkapital)} onClick={onAuthRequest} />
            </>
          ))}

        {activeTab === 'kaufnebenkosten' &&
          (isUnlocked('kaufnebenkosten') ? (
            <>
              <PercentInput
                label="Grunderwerbsteuer"
                value={input.grunderwerbsteuerSatz}
                onChange={(v) => updateField('grunderwerbsteuerSatz', v)}
              />
              <PercentInput
                label="Maklergebühr"
                value={input.maklerSatz}
                onChange={(v) => updateField('maklerSatz', v)}
              />
              <PercentInput
                label="Notargebühr"
                value={input.notarSatz}
                onChange={(v) => updateField('notarSatz', v)}
              />
              <PercentInput
                label="Grundbuchgebühr"
                value={input.grundbuchSatz}
                onChange={(v) => updateField('grundbuchSatz', v)}
              />
              {view && (
                <LockedField
                  label="Summe Kaufnebenkosten"
                  value={formatEuro(view.kaufnebenkosten)}
                  onClick={onAuthRequest}
                />
              )}
            </>
          ) : (
            <>
              <LockedField label="Grunderwerbsteuer" value={formatPercent(input.grunderwerbsteuerSatz)} onClick={onAuthRequest} />
              <LockedField label="Maklergebühr" value={formatPercent(input.maklerSatz)} onClick={onAuthRequest} />
              <LockedField label="Notargebühr" value={formatPercent(input.notarSatz)} onClick={onAuthRequest} />
              <LockedField label="Grundbuchgebühr" value={formatPercent(input.grundbuchSatz)} onClick={onAuthRequest} />
              {view && (
                <LockedField
                  label="Summe Kaufnebenkosten"
                  value={formatEuro(view.kaufnebenkosten)}
                  onClick={onAuthRequest}
                />
              )}
            </>
          ))}

        {activeTab === 'finanzierung' &&
          (isUnlocked('finanzierung') ? (
            <>
              <PercentInput
                label="Zinssatz"
                value={input.zinssatzPa}
                onChange={(v) => updateField('zinssatzPa', v)}
              />
              <PercentInput
                label="Tilgung"
                value={input.tilgungPa}
                onChange={(v) => updateField('tilgungPa', v)}
              />
              <YearsInput
                label="Zinsbindung"
                value={input.zinsbindung}
                onChange={(v) => updateField('zinsbindung', v)}
              />
              <LockedField label="Finanzierungsart" value="Annuitätendarlehen" onClick={onAuthRequest} />
            </>
          ) : (
            <>
              <LockedField label="Zinssatz" value={formatPercent(input.zinssatzPa)} onClick={onAuthRequest} />
              <LockedField label="Tilgung" value={formatPercent(input.tilgungPa)} onClick={onAuthRequest} />
              <LockedField label="Zinsbindung" value={formatYears(input.zinsbindung)} onClick={onAuthRequest} />
              <LockedField label="Finanzierungsart" value="Annuitätendarlehen" onClick={onAuthRequest} />
            </>
          ))}

        {activeTab === 'nebenkosten' &&
          (isUnlocked('nebenkosten') ? (
            <>
              <CurrencyInput
                label="Nicht umlagefähig / Monat"
                value={input.nichtUmlagefaehig}
                onChange={(v) => updateField('nichtUmlagefaehig', v)}
              />
              <CurrencyInput
                label="Grundsteuer / Monat"
                value={input.grundsteuerMonat}
                onChange={(v) => updateField('grundsteuerMonat', v)}
              />
              <CurrencyInput
                label="Instandhaltung / Monat"
                value={input.instandhaltungsruecklageMonat}
                onChange={(v) => updateField('instandhaltungsruecklageMonat', v)}
              />
              <CurrencyInput
                label="Verwaltung / Monat"
                value={input.verwaltungskostenMonat}
                onChange={(v) => updateField('verwaltungskostenMonat', v)}
              />
            </>
          ) : (
            <>
              <LockedField
                label="Nicht umlagefähig"
                value={`${formatEuro(input.nichtUmlagefaehig)} / Monat`}
                onClick={onAuthRequest}
              />
              <LockedField
                label="Grundsteuer / Monat"
                value={formatEuro(input.grundsteuerMonat)}
                onClick={onAuthRequest}
              />
              <LockedField
                label="Instandhaltungsrücklage"
                value={`${formatEuro(input.instandhaltungsruecklageMonat)} / Monat`}
                onClick={onAuthRequest}
              />
              <LockedField
                label="Verwaltung / Monat"
                value={formatEuro(input.verwaltungskostenMonat)}
                onClick={onAuthRequest}
              />
            </>
          ))}

        {activeTab === 'steuern' &&
          (isUnlocked('steuern') ? (
            <>
              <PercentInput
                label="Grenzsteuersatz"
                value={input.grenzsteuersatz}
                onChange={(v) => updateField('grenzsteuersatz', v)}
              />
              <PercentInput
                label="AfA-Satz"
                value={input.afaSatz}
                onChange={(v) => updateField('afaSatz', v)}
              />
              <PercentInput
                label="Mietsteigerung p.a."
                value={input.mietsteigerungPa}
                onChange={(v) => updateField('mietsteigerungPa', v)}
              />
              <PercentInput
                label="Wertsteigerung p.a."
                value={input.wertsteigerungPa}
                onChange={(v) => updateField('wertsteigerungPa', v)}
              />
              <PercentInput
                label="Leerstandsquote"
                value={input.leerstandsquote}
                onChange={(v) => updateField('leerstandsquote', v)}
              />
            </>
          ) : (
            <>
              <LockedField label="Grenzsteuersatz" value={formatPercent(input.grenzsteuersatz)} onClick={onAuthRequest} />
              <LockedField label="AfA-Satz" value={formatPercent(input.afaSatz)} onClick={onAuthRequest} />
              <LockedField label="Mietsteigerung p.a." value={formatPercent(input.mietsteigerungPa)} onClick={onAuthRequest} />
              <LockedField label="Wertsteigerung p.a." value={formatPercent(input.wertsteigerungPa)} onClick={onAuthRequest} />
              <LockedField label="Leerstandsquote" value={formatPercent(input.leerstandsquote)} onClick={onAuthRequest} />
            </>
          ))}
      </div>

      {!isUnlocked(activeTab) && <UpsellFooter onClick={onAuthRequest} />}
    </div>
  );
}

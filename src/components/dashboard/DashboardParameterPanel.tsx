'use client';

import { useState } from 'react';
import { ParameterPanel } from '@/components/parameter-panel/ParameterPanel';
import { Modal } from '@/components/ui/Modal';
import { MockAuthForm } from '@/components/auth/MockAuthForm';
import { useMockAuth } from '@/lib/auth/mockAuth';
import type { ParameterTab } from '@/components/parameter-panel/types';
import type { ErgebnisView } from '@/lib/calculator/mapResultToView';
import type { QuickCalcInput } from '@/lib/schemas/calculator';

const ALL_TABS: readonly ParameterTab[] = [
  'basisdaten',
  'kaufnebenkosten',
  'finanzierung',
  'nebenkosten',
  'steuern',
];

interface DashboardParameterPanelProps {
  input: QuickCalcInput;
  view?: ErgebnisView;
  onInputChange: (input: QuickCalcInput) => void;
}

export function DashboardParameterPanel({
  input,
  view,
  onInputChange,
}: DashboardParameterPanelProps) {
  const [authOpen, setAuthOpen] = useState(false);
  const authed = useMockAuth();

  // Treat pre-hydration (null) as unauthed to avoid a flash of editable inputs.
  const isAuthed = authed === true;

  return (
    <>
      <ParameterPanel
        input={input}
        view={view}
        onInputChange={isAuthed ? onInputChange : undefined}
        onAuthRequest={() => setAuthOpen(true)}
        inlineFrom="lg"
        unlockedTabs={isAuthed ? ALL_TABS : []}
        defaultExpanded
      />
      <Modal
        open={authOpen}
        onClose={() => setAuthOpen(false)}
        title="Analyse anpassen"
      >
        <MockAuthForm mode="signup" title="Konto erstellen" submitLabel="Kostenlos registrieren" />
      </Modal>
    </>
  );
}

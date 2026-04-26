export type ParameterTab =
  | 'basisdaten'
  | 'kaufnebenkosten'
  | 'finanzierung'
  | 'nebenkosten'
  | 'steuern';

export const PARAMETER_TABS: readonly { value: ParameterTab; label: string }[] = [
  { value: 'basisdaten', label: 'Basisdaten' },
  { value: 'kaufnebenkosten', label: 'Kaufnebenkosten' },
  { value: 'finanzierung', label: 'Finanzierung' },
  { value: 'nebenkosten', label: 'Nebenkosten' },
  { value: 'steuern', label: 'Steuern & Prognosen' },
] as const;

'use client';

import { useSyncExternalStore } from 'react';

function subscribe(breakpoint: number) {
  return (onChange: () => void) => {
    const mql = window.matchMedia(`(max-width: ${breakpoint - 1}px)`);
    mql.addEventListener('change', onChange);
    return () => mql.removeEventListener('change', onChange);
  };
}

export function useIsMobile(breakpoint = 640): boolean {
  const getSnapshot = () =>
    typeof window !== 'undefined' &&
    window.matchMedia(`(max-width: ${breakpoint - 1}px)`).matches;

  return useSyncExternalStore(subscribe(breakpoint), getSnapshot, () => false);
}

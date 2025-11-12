'use client';

import { createContext, useContext, useMemo } from 'react';
import { useReducedMotion } from 'framer-motion';
import type { PropsWithChildren } from 'react';

type MotionConfig = {
  defaultDuration: number;
  ease: [number, number, number, number] | 'easeOut' | 'easeInOut' | 'easeIn';
};

const MotionContext = createContext<MotionConfig>({
  defaultDuration: 0.35,
  ease: 'easeOut',
});

export function useMotionConfig() {
  return useContext(MotionContext);
}

export default function MotionProvider({ children }: PropsWithChildren) {
  const prefersReducedMotion = useReducedMotion();
  const value = useMemo<MotionConfig>(
    () => ({
      defaultDuration: prefersReducedMotion ? 0 : 0.35,
      ease: prefersReducedMotion ? 'easeOut' : 'easeOut',
    }),
    [prefersReducedMotion]
  );

  return <MotionContext.Provider value={value}>{children}</MotionContext.Provider>;
}



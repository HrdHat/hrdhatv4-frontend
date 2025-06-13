import type { ReactNode } from 'react';

import ModeDeviceBanner from '@/components/Debug/ModeDeviceBanner';

import { useFormMode } from './FormModeProvider';
import GuidedRenderer from './guided/GuidedRenderer';
import QuickFillRenderer from './quick/QuickFillRenderer';

interface FormLayoutProps {
  children: ReactNode;
}

export default function FormLayout({ children }: FormLayoutProps) {
  const { mode } = useFormMode();

  if (mode === 'guided') {
    return (
      <>
        <ModeDeviceBanner />
        <GuidedRenderer />
      </>
    );
  }

  return (
    <>
      <ModeDeviceBanner />
      <QuickFillRenderer>{children}</QuickFillRenderer>
    </>
  );
}

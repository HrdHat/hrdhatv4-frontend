import type { ReactNode } from 'react';
import { useFormMode } from './FormModeProvider';
import QuickFillRenderer from './quick/QuickFillRenderer';
import GuidedRenderer from './guided/GuidedRenderer';
import ModeDeviceBanner from '@/components/Debug/ModeDeviceBanner';

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

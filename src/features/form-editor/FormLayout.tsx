import type { ReactNode } from 'react';

import ModeDeviceBanner from '@/components/Debug/ModeDeviceBanner';

import { useFormMode } from '@/features/form-editor/FormModeProvider';
import GuidedRenderer from '@/features/form-editor/guided/GuidedRenderer';
import QuickFillRenderer from '@/features/form-editor/quick/QuickFillRenderer';

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

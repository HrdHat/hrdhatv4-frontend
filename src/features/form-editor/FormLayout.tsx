import type { ReactNode } from 'react';
import { useFormMode } from './FormModeProvider';
import QuickFillRenderer from './quick/QuickFillRenderer';
import GuidedRenderer from './guided/GuidedRenderer';

interface FormLayoutProps {
  children: ReactNode;
}

export default function FormLayout({ children }: FormLayoutProps) {
  const { mode } = useFormMode();

  if (mode === 'guided') {
    return <GuidedRenderer />;
  }

  // default quick-fill path – forward children to quick renderer
  return <QuickFillRenderer>{children}</QuickFillRenderer>;
}

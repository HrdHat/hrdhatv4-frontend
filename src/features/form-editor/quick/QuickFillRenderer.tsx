import type { ReactNode } from 'react';

interface QuickFillRendererProps {
  children: ReactNode;
}

export default function QuickFillRenderer({
  children,
}: QuickFillRendererProps) {
  return <>{children}</>;
}

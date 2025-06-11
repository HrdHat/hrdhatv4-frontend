import type { ReactNode } from 'react';
import { createContext, useContext, useState, useCallback } from 'react';

export type FormMode = 'quick' | 'guided';

interface FormModeContextValue {
  mode: FormMode;
  setMode: (mode: FormMode) => void;
  // optional helpers for navigation can be added later
}

const FormModeContext = createContext<FormModeContextValue | undefined>(
  undefined
);

interface FormModeProviderProps {
  initialMode: FormMode;
  children: ReactNode;
}

export default function FormModeProvider({
  initialMode,
  children,
}: FormModeProviderProps) {
  const [mode, setModeState] = useState<FormMode>(initialMode);

  const setMode = useCallback((newMode: FormMode) => {
    setModeState(newMode);
  }, []);

  return (
    <FormModeContext.Provider value={{ mode, setMode }}>
      {children}
    </FormModeContext.Provider>
  );
}

export function useFormMode() {
  const ctx = useContext(FormModeContext);
  if (!ctx) {
    throw new Error('useFormMode must be used within a FormModeProvider');
  }
  return ctx;
}

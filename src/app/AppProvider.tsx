import type { ReactNode } from 'react';
import { BrowserRouter } from 'react-router-dom';

import Provider from './provider';

interface AppProviderProps {
  children: ReactNode;
}

/**
 * AppProvider
 * Consolidates all global providers so tests and App.tsx consume just one wrapper.
 * Currently includes:
 *   – Supabase Auth Provider (Provider)
 *   – React Router BrowserRouter
 * Extend this wrapper when adding React Query, ThemeProvider, etc.
 */
export default function AppProvider({ children }: AppProviderProps) {
  return (
    <Provider>
      <BrowserRouter>{children}</BrowserRouter>
    </Provider>
  );
}

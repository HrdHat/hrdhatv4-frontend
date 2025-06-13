import type { ReactNode } from 'react';
import { useEffect } from 'react';

import { supabase } from '@/config/supabaseClient';
import { useAuthStore } from '@/stores/authStore';
import { logger } from '@/utils/logger';

interface ProviderProps {
  children: ReactNode;
}

export default function Provider({ children }: ProviderProps) {
  useEffect(() => {
    logger.log('Provider mounted: checking session');
    // On mount, check current session
    const checkSession = async () => {
      logger.log('Session check started');
      const { data, error } = await supabase.auth.getUser();
      logger.log('Session check result', { user: data?.user, error });
      if (data?.user) {
        useAuthStore.setState({ user: data.user, loading: false, error: null });
      } else {
        useAuthStore.setState({
          user: null,
          loading: false,
          error: error?.message || null,
        });
      }
    };
    checkSession();

    // Listen for auth state changes
    const { data: listener } = supabase.auth.onAuthStateChange(
      (event, session) => {
        logger.log('Auth state changed', { event, session });
        if (session?.user) {
          useAuthStore.setState({
            user: session.user,
            loading: false,
            error: null,
          });
        } else {
          useAuthStore.setState({ user: null, loading: false, error: null });
        }
      }
    );

    // Cleanup on unmount
    return () => {
      logger.log('Provider unmounted: unsubscribed from auth listener');
      listener?.subscription.unsubscribe();
    };
  }, []);

  return <>{children}</>;
}

import type { ReactNode } from 'react';
import { useEffect } from 'react';
import { supabase } from '../config/supabaseClient';
import { useAuthStore } from '../stores/authStore';

interface ProviderProps {
  children: ReactNode;
}

export default function Provider({ children }: ProviderProps) {
  useEffect(() => {
    // On mount, check current session
    const checkSession = async () => {
      const { data, error } = await supabase.auth.getUser();
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
      listener?.subscription.unsubscribe();
    };
  }, []);

  return <>{children}</>;
}

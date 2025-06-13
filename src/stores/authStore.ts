import { create } from 'zustand';

import { supabase } from '@/config/supabaseClient';
import type { User } from '@supabase/supabase-js';
import { logger } from '@/utils/logger';

interface AuthState {
  user: User | null;
  loading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
  signup: (
    email: string,
    password: string,
    profile: { firstName: string; lastName: string; company: string }
  ) => Promise<void>;
  logout: () => Promise<void>;
  refreshSession: () => Promise<void>;
}

export const useAuthStore = create<AuthState>(set => ({
  user: null,
  loading: false,
  error: null,

  login: async (email, password) => {
    logger.log('Login attempt', { email });
    set({ loading: true, error: null });

    // Check current session first
    const { data: sessionData } = await supabase.auth.getSession();
    logger.log('Current session before login', {
      session: sessionData.session,
    });

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) {
      logger.error('Login error', error);
      logger.log('Login error details', {
        message: error.message,
        status: error.status,
        name: error.name,
      });
      set({ error: error.message, loading: false });
    } else {
      logger.log('Login success', { user: data.user });
      logger.log('User email verified?', {
        email_confirmed_at: data.user?.email_confirmed_at,
        created_at: data.user?.created_at,
      });
      set({ user: data.user, loading: false, error: null });
      logger.log('User state updated after login', { user: data.user });
    }
  },

  signup: async (email, password, profile) => {
    logger.log('Signup attempt', { email, profile });
    set({ loading: true, error: null });
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          // Supabase user metadata must be snake_case
          // eslint-disable-next-line @typescript-eslint/naming-convention
          first_name: profile.firstName,
          // eslint-disable-next-line @typescript-eslint/naming-convention
          last_name: profile.lastName,
          company: profile.company,
        },
      },
    });
    if (error) {
      logger.error('Signup error', error);
      set({ error: error.message, loading: false });
    } else {
      logger.log('Signup success', { user: data.user });
      set({ user: data.user, loading: false, error: null });
      logger.log('User state updated after signup', { user: data.user });
    }
  },

  logout: async () => {
    logger.log('Logout attempt');
    set({ loading: true, error: null });
    const { error } = await supabase.auth.signOut();
    if (error) {
      logger.error('Logout error', error);
      set({ error: error.message, loading: false });
    } else {
      logger.log('Logout success');
      set({ user: null, loading: false, error: null });
      logger.log('User state cleared after logout');
    }
  },

  refreshSession: async () => {
    logger.log('Session refresh attempt');
    set({ loading: true, error: null });
    const { data, error } = await supabase.auth.getUser();
    if (error) {
      logger.error('Session refresh error', error);
      set({ error: error.message, loading: false });
      logger.log('User state cleared after session refresh error or no user');
    } else {
      logger.log('Session refresh success', { user: data.user });
      set({ user: data.user, loading: false, error: null });
      logger.log('User state updated after session refresh', {
        user: data.user,
      });
    }
  },
}));

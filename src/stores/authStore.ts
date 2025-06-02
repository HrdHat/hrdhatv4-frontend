import { create } from 'zustand';
import { supabase } from '../config/supabaseClient';
import type { User } from '@supabase/supabase-js';

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
    set({ loading: true, error: null });
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) {
      set({ error: error.message, loading: false });
    } else {
      set({ user: data.user, loading: false, error: null });
    }
  },

  signup: async (email, password, profile) => {
    set({ loading: true, error: null });
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          first_name: profile.firstName,
          last_name: profile.lastName,
          company: profile.company,
        },
      },
    });
    if (error) {
      set({ error: error.message, loading: false });
    } else {
      set({ user: data.user, loading: false, error: null });
    }
  },

  logout: async () => {
    set({ loading: true, error: null });
    const { error } = await supabase.auth.signOut();
    if (error) {
      set({ error: error.message, loading: false });
    } else {
      set({ user: null, loading: false, error: null });
    }
  },

  refreshSession: async () => {
    set({ loading: true, error: null });
    const { data, error } = await supabase.auth.getUser();
    if (error) {
      set({ error: error.message, loading: false });
    } else {
      set({ user: data.user, loading: false, error: null });
    }
  },
}));

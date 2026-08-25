// src/lib/store/useAuthStore.ts
import { create } from 'zustand';
import { supabase, isSupabaseConfigured } from '@/lib/supabase/client';
import type { User, Session } from '@supabase/supabase-js';

export type SyncStatus = 'guest' | 'synced' | 'syncing' | 'error';

interface AuthState {
  user: User | null;
  session: Session | null;
  isLoading: boolean;
  isGuest: boolean;
  syncStatus: SyncStatus;
  errorMessage: string | null;

  setSyncStatus: (status: SyncStatus) => void;
  initAuth: () => Promise<void>;
  signInWithGitHub: () => Promise<void>;
  signOut: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  session: null,
  isLoading: true,
  isGuest: true,
  syncStatus: 'guest',
  errorMessage: null,

  setSyncStatus: (status) => set({ syncStatus: status }),

  initAuth: async () => {
    if (!isSupabaseConfigured || !supabase) {
      set({ isLoading: false, isGuest: true, syncStatus: 'guest' });
      return;
    }

    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        set({
          user: session.user,
          session,
          isGuest: false,
          isLoading: false,
          syncStatus: 'synced',
        });
      } else {
        set({
          user: null,
          session: null,
          isGuest: true,
          isLoading: false,
          syncStatus: 'guest',
        });
      }

      // Listen for real-time auth changes
      supabase.auth.onAuthStateChange((_event, newSession) => {
        if (newSession) {
          set({
            user: newSession.user,
            session: newSession,
            isGuest: false,
            syncStatus: 'synced',
          });
        } else {
          set({
            user: null,
            session: null,
            isGuest: true,
            syncStatus: 'guest',
          });
        }
      });
    } catch (err: any) {
      console.warn('Auth initialization fallback to guest mode:', err.message);
      set({ isLoading: false, isGuest: true, syncStatus: 'guest' });
    }
  },

  signInWithGitHub: async () => {
    if (!isSupabaseConfigured || !supabase) {
      alert(
        'Supabase is not configured yet. Please add NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY to .env.local / Vercel Environment Variables'
      );
      return;
    }

    set({ isLoading: true, errorMessage: null });
    
    // Automatically detect current domain (e.g. https://greatcode.in or http://localhost:3000)
    const redirectUrl =
      typeof window !== 'undefined'
        ? `${window.location.origin}`
        : '';

    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'github',
      options: {
        redirectTo: redirectUrl,
      },
    });

    if (error) {
      set({ errorMessage: error.message, isLoading: false });
    }
  },

  signOut: async () => {
    if (supabase) {
      await supabase.auth.signOut();
    }
    set({
      user: null,
      session: null,
      isGuest: true,
      syncStatus: 'guest',
    });
  },
}));

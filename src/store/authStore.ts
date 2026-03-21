import { create } from 'zustand';
import type { User, Session } from '@supabase/supabase-js';
import { supabase, type Subscription } from '../lib/supabase';

interface AuthStore {
  user: User | null;
  session: Session | null;
  subscription: Subscription | null;
  loading: boolean;
  initialized: boolean;

  initialize: () => Promise<void>;
  signIn: (email: string, password: string) => Promise<string | null>;
  signUp: (email: string, password: string) => Promise<string | null>;
  signOut: () => Promise<void>;
  fetchSubscription: (userId: string) => Promise<void>;
  hasAccess: () => boolean;
}

export const useAuthStore = create<AuthStore>((set, get) => ({
  user: null,
  session: null,
  subscription: null,
  loading: false,
  initialized: false,

  initialize: async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (session?.user) {
      set({ session, user: session.user });
      await get().fetchSubscription(session.user.id);
    }
    set({ initialized: true });

    supabase.auth.onAuthStateChange(async (_event, session) => {
      set({ session, user: session?.user ?? null });
      if (session?.user) {
        await get().fetchSubscription(session.user.id);
      } else {
        set({ subscription: null });
      }
    });
  },

  signIn: async (email, password) => {
    set({ loading: true });
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (!error && data.user) {
      await get().fetchSubscription(data.user.id);
    }
    set({ loading: false });
    return error?.message ?? null;
  },

  signUp: async (email, password) => {
    set({ loading: true });
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: { emailRedirectTo: window.location.origin },
    });
    if (!error && data.user) {
      // Le trigger Supabase crée la subscription automatiquement
      // On attend un court instant puis on la charge
      await new Promise(r => setTimeout(r, 500));
      await get().fetchSubscription(data.user.id);
      set({ user: data.user });
    }
    set({ loading: false });
    return error?.message ?? null;
  },

  signOut: async () => {
    await supabase.auth.signOut();
    set({ user: null, session: null, subscription: null });
  },

  fetchSubscription: async (userId) => {
    const { data } = await supabase
      .from('subscriptions')
      .select('*')
      .eq('user_id', userId)
      .single();
    set({ subscription: data });
  },

  hasAccess: () => {
    const { subscription, user } = get();
    // Pas encore chargé mais user connecté → on laisse passer (fetchSubscription en cours)
    if (!subscription && user) return true;
    if (!subscription) return false;
    if (subscription.status === 'active') return true;
    if (subscription.status === 'trial') {
      return new Date(subscription.trial_ends_at) > new Date();
    }
    return false;
  },
}));

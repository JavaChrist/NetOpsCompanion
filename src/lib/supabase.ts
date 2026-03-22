import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Variables VITE_SUPABASE_URL et VITE_SUPABASE_ANON_KEY manquantes dans .env.local');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export type SubscriptionStatus = 'trial' | 'active' | 'expired' | 'cancelled';
export type SubscriptionPlan = 'monthly' | 'annual';

export interface Subscription {
  id: string;
  user_id: string;
  status: SubscriptionStatus;
  plan: SubscriptionPlan | null;
  first_name: string | null;
  mollie_customer_id: string | null;
  mollie_subscription_id: string | null;
  trial_ends_at: string;
  current_period_end: string | null;
  created_at: string;
}

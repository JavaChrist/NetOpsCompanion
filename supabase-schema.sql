-- ============================================================
-- Exécuter dans Supabase → SQL Editor
-- ============================================================

-- 1. Créer la table subscriptions
create table if not exists public.subscriptions (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users(id) on delete cascade not null unique,
  status text not null default 'trial' check (status in ('trial', 'active', 'expired', 'cancelled')),
  plan text check (plan in ('monthly', 'annual')),
  mollie_customer_id text,
  mollie_subscription_id text,
  mollie_payment_id text,
  trial_ends_at timestamptz not null default (now() + interval '30 days'),
  current_period_end timestamptz,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- 2. RLS
alter table public.subscriptions enable row level security;

drop policy if exists "Users can view own subscription" on public.subscriptions;
drop policy if exists "Users can insert own subscription" on public.subscriptions;
drop policy if exists "Service role can update subscriptions" on public.subscriptions;
drop policy if exists "Service role can upsert subscriptions" on public.subscriptions;

create policy "Users can view own subscription"
  on public.subscriptions for select
  using (auth.uid() = user_id);

create policy "Service role full access"
  on public.subscriptions for all
  using (true);

-- 3. Trigger : crée automatiquement la subscription à l'inscription
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.subscriptions (user_id, status, trial_ends_at)
  values (new.id, 'trial', now() + interval '30 days')
  on conflict (user_id) do nothing;
  return new;
end;
$$ language plpgsql security definer;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

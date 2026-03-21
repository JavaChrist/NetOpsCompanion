-- ============================================================
-- GESTION DES ACCÈS GRATUITS — NetOps Companion
-- Supabase → SQL Editor → coller la requête → Run
-- ============================================================


-- ── Donner un accès gratuit par EMAIL ────────────────────────
UPDATE public.subscriptions
SET 
  status = 'active',
  plan = 'annual',
  current_period_end = '2099-12-31 00:00:00+00'
WHERE user_id = (
  SELECT id FROM auth.users WHERE email = 'collegue@email.com'
);


-- ── Donner un accès gratuit par USER_ID ──────────────────────
UPDATE public.subscriptions
SET 
  status = 'active',
  plan = 'annual',
  current_period_end = '2099-12-31 00:00:00+00'
WHERE user_id = 'uuid-du-user-ici';


-- ── Révoquer un accès gratuit par EMAIL ──────────────────────
UPDATE public.subscriptions
SET 
  status = 'expired',
  plan = NULL,
  current_period_end = NULL
WHERE user_id = (
  SELECT id FROM auth.users WHERE email = 'collegue@email.com'
);


-- ── Voir tous les abonnements actifs ─────────────────────────
SELECT 
  u.email,
  s.status,
  s.plan,
  s.trial_ends_at,
  s.current_period_end,
  s.created_at
FROM public.subscriptions s
JOIN auth.users u ON u.id = s.user_id
ORDER BY s.created_at DESC;

import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Check, Zap, Calendar, CheckCircle } from 'lucide-react';
import { useAuthStore } from '../store/authStore';
import { clsx } from 'clsx';

const features = [
  '225+ commandes réseau',
  '55 diagnostics guidés',
  '40 checklists terrain',
  'Mode hors-ligne (PWA)',
  'Historique & favoris',
  'Mises à jour incluses',
];

export function PricingPage() {
  const [plan, setPlan] = useState<'monthly' | 'annual'>('annual');
  const [firstName, setFirstName] = useState('');
  const [loading, setLoading] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const { user, subscription, fetchSubscription } = useAuthStore();
  const location = useLocation();
  const navigate = useNavigate();

  // Détecter le retour après paiement Mollie
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    if (params.get('success') === '1' && user) {
      setPaymentSuccess(true);
      setTimeout(async () => {
        await fetchSubscription(user.id);
        navigate('/', { replace: true });
      }, 3000);
    }
  }, [location, user]);

  const trialDaysLeft = subscription
    ? Math.max(0, Math.ceil((new Date(subscription.trial_ends_at).getTime() - Date.now()) / 86400000))
    : 0;

  const handleSubscribe = async () => {
    if (!user) return;
    if (!firstName.trim()) {
      alert('Merci d\'entrer ton prénom avant de continuer.');
      return;
    }
    setLoading(true);
    try {
      const res = await fetch('/api/create-checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ plan, userId: user.id, email: user.email, firstName: firstName.trim() }),
      });
      const data = await res.json();
      if (data.checkoutUrl) {
        window.location.href = data.checkoutUrl;
      }
    } catch {
      alert('Erreur lors de la création du paiement. Réessaie.');
    }
    setLoading(false);
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">

      {/* Message succès paiement */}
      {paymentSuccess && (
        <div className="flex items-center gap-3 px-4 py-4 rounded-xl bg-green-500/10 border border-green-500/30 text-green-400">
          <CheckCircle className="w-5 h-5 flex-shrink-0" />
          <div>
            <p className="font-medium">Paiement confirmé !</p>
            <p className="text-sm text-green-500/80">Ton abonnement est actif. Redirection en cours…</p>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="text-center">
        <h1 className="text-2xl font-bold text-white mb-2">Abonnement NetOps Companion</h1>
        {subscription?.status === 'trial' && trialDaysLeft > 0 && (
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-accent/10 border border-accent/30 text-sm text-accent">
            <Zap className="w-3.5 h-3.5" />
            {trialDaysLeft} jour{trialDaysLeft > 1 ? 's' : ''} d'essai restant{trialDaysLeft > 1 ? 's' : ''}
          </div>
        )}
        {subscription?.status === 'expired' && (
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-red-500/10 border border-red-500/30 text-sm text-red-400">
            Période d'essai terminée — Abonne-toi pour continuer
          </div>
        )}
      </div>

      {/* Toggle mensuel / annuel */}
      <div className="flex justify-center">
        <div className="flex rounded-xl bg-surface-700 p-1">
          <button
            onClick={() => setPlan('monthly')}
            className={clsx(
              'px-5 py-2 text-sm font-medium rounded-lg transition-all',
              plan === 'monthly' ? 'bg-surface-900 text-white shadow' : 'text-slate-400 hover:text-slate-200'
            )}
          >
            Mensuel
          </button>
          <button
            onClick={() => setPlan('annual')}
            className={clsx(
              'px-5 py-2 text-sm font-medium rounded-lg transition-all flex items-center gap-2',
              plan === 'annual' ? 'bg-surface-900 text-white shadow' : 'text-slate-400 hover:text-slate-200'
            )}
          >
            Annuel
            <span className="text-xs px-1.5 py-0.5 rounded-full bg-accent/20 text-accent font-semibold">-34%</span>
          </button>
        </div>
      </div>

      {/* Carte prix */}
      <div className="rounded-2xl border-2 border-accent/40 bg-surface-800 p-6 shadow-lg shadow-accent/5">
        <div className="flex items-start justify-between mb-6">
          <div>
            <div className="flex items-end gap-1">
              <span className="text-4xl font-bold text-white">
                {plan === 'monthly' ? '9,99' : '79'}
              </span>
              <span className="text-lg text-slate-400 mb-1">€</span>
              <span className="text-slate-500 mb-1">/{plan === 'monthly' ? 'mois' : 'an'}</span>
            </div>
            {plan === 'annual' && (
              <p className="text-xs text-accent mt-1">
                Soit 6,58€/mois · Économise 40,88€/an
              </p>
            )}
          </div>
          <div className="p-2.5 rounded-xl bg-accent/10 border border-accent/20">
            <Calendar className="w-5 h-5 text-accent" />
          </div>
        </div>

        {/* Features */}
        <ul className="space-y-2.5 mb-6">
          {features.map((f) => (
            <li key={f} className="flex items-center gap-2.5 text-sm text-slate-300">
              <Check className="w-4 h-4 text-accent flex-shrink-0" />
              {f}
            </li>
          ))}
        </ul>

        {/* Champ prénom */}
        {subscription?.status !== 'active' && (
          <div className="mb-4">
            <label className="block text-xs font-medium text-slate-400 mb-1.5">Ton prénom</label>
            <input
              type="text"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              placeholder="Ex : Jean"
              autoComplete="given-name"
              className="w-full bg-surface-700 border border-surface-500 rounded-xl px-4 py-2.5 text-sm text-slate-200 placeholder-slate-500 outline-none focus:border-accent/60 focus:bg-surface-600 transition-all"
            />
          </div>
        )}

        <button
          onClick={handleSubscribe}
          disabled={loading || subscription?.status === 'active'}
          className="w-full py-3 rounded-xl bg-accent text-surface-900 font-bold text-sm hover:bg-accent/90 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? 'Redirection…' :
           subscription?.status === 'active' ? '✓ Abonnement actif' :
           `S'abonner · ${plan === 'monthly' ? '9,99€/mois' : '79€/an'}`}
        </button>

        <p className="text-xs text-slate-500 text-center mt-3">
          Paiement sécurisé par Mollie · Annulable à tout moment
        </p>
      </div>

      {/* Trial info */}
      <div className="rounded-xl border border-surface-600 bg-surface-800 p-4 text-center">
        <p className="text-sm text-slate-400">
          <span className="text-white font-medium">30 jours gratuits</span> inclus à la création du compte.<br />
          Aucune carte bancaire requise pendant l'essai.
        </p>
      </div>
    </div>
  );
}

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Mail, Lock, Eye, EyeOff } from 'lucide-react';
import { useAuthStore } from '../store/authStore';
import { clsx } from 'clsx';

export function LoginPage() {
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const { signIn, signUp, loading } = useAuthStore();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (mode === 'login') {
      const err = await signIn(email, password);
      if (err) { setError(err); return; }
      navigate('/');
    } else {
      const err = await signUp(email, password);
      if (err) { setError(err); return; }
      // Rediriger directement, la période d'essai est active
      navigate('/');
    }
  };

  return (
    <div className="min-h-screen bg-surface-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md">

        {/* Logo */}
        <div className="flex flex-col items-center mb-8">
          <div className="p-3 rounded-2xl bg-accent/20 border border-accent/30 mb-3">
            <img src="/icons/logo48.png" alt="NetOps" className="w-10 h-10" />
          </div>
          <h1 className="text-xl font-bold text-white">NetOps Companion</h1>
          <p className="text-sm text-slate-400 mt-1">Assistant réseau pour techniciens terrain</p>
        </div>

        {/* Card */}
        <div className="bg-surface-800 rounded-2xl border border-surface-600 p-6">

          {/* Tabs */}
          <div className="flex rounded-xl bg-surface-700 p-1 mb-6">
            <button
              onClick={() => { setMode('login'); setError(null); }}
              className={clsx(
                'flex-1 py-2 text-sm font-medium rounded-lg transition-all',
                mode === 'login' ? 'bg-surface-900 text-white shadow' : 'text-slate-400 hover:text-slate-200'
              )}
            >
              Connexion
            </button>
            <button
              onClick={() => { setMode('register'); setError(null); }}
              className={clsx(
                'flex-1 py-2 text-sm font-medium rounded-lg transition-all',
                mode === 'register' ? 'bg-surface-900 text-white shadow' : 'text-slate-400 hover:text-slate-200'
              )}
            >
              Créer un compte
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email */}
            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1.5">Email</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  placeholder="ton@email.com"
                  className="w-full bg-surface-700 border border-surface-500 rounded-xl pl-10 pr-4 py-2.5 text-sm text-slate-200 placeholder-slate-500 outline-none focus:border-accent/60 focus:bg-surface-600 transition-all"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1.5">Mot de passe</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  minLength={6}
                  placeholder="••••••••"
                  className="w-full bg-surface-700 border border-surface-500 rounded-xl pl-10 pr-10 py-2.5 text-sm text-slate-200 placeholder-slate-500 outline-none focus:border-accent/60 focus:bg-surface-600 transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Error / Success */}
            {error && (
              <div className="px-3 py-2.5 rounded-lg bg-red-500/10 border border-red-500/30 text-xs text-red-400">
                {error}
              </div>
            )}
            {success && (
              <div className="px-3 py-2.5 rounded-lg bg-green-500/10 border border-green-500/30 text-xs text-green-400">
                {success}
              </div>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 rounded-xl bg-accent text-surface-900 font-semibold text-sm hover:bg-accent/90 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Chargement…' : mode === 'login' ? 'Se connecter' : 'Créer mon compte'}
            </button>
          </form>

          {/* Trial info */}
          {mode === 'register' && (
            <p className="text-xs text-slate-500 text-center mt-4">
              ✓ 30 jours gratuits · Aucune carte requise pour commencer
            </p>
          )}
        </div>

        <p className="text-xs text-slate-600 text-center mt-4">
          NetOps Companion · <span className="text-accent">9,99€/mois</span> ou <span className="text-accent">79€/an</span>
        </p>
      </div>
    </div>
  );
}

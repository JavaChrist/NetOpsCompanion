import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Terminal,
  Stethoscope,
  CheckSquare,
  Star,
  History,
  ArrowRight,
  TrendingUp,
} from 'lucide-react';
import { commands } from '../data/commands';
import { diagnostics } from '../data/diagnostics';
import { checklists } from '../data/checklists';
import { categories } from '../data/categories';
import { useHistoryStore, useSettingsStore } from '../store';
import { useAuthStore } from '../store/authStore';
import { formatRelativeDate } from '../utils';
import { CommandCard } from '../components/CommandCard';
import { DiagnosticCard } from '../components/DiagnosticCard';
import { CategoryCard } from '../components/CategoryCard';

const stats = [
  { label: 'Commandes', value: commands.length, icon: Terminal, href: '/commands' },
  { label: 'Diagnostics', value: diagnostics.length, icon: Stethoscope, href: '/diagnostics' },
  { label: 'Checklists', value: checklists.length, icon: CheckSquare, href: '/checklists' },
  { label: 'Catégories', value: categories.length, icon: TrendingUp, href: '/commands' },
];

const quickAccess = [
  { label: 'Base de commandes', href: '/commands', icon: Terminal, desc: 'CMD, PowerShell, Nmap…' },
  { label: 'Diagnostics guidés', href: '/diagnostics', icon: Stethoscope, desc: 'Résoudre étape par étape' },
  { label: 'Checklists terrain', href: '/checklists', icon: CheckSquare, desc: 'Mise en service, audit…' },
  { label: 'Mes favoris', href: '/favorites', icon: Star, desc: 'Accès rapide aux favoris' },
];

export function DashboardPage() {
  const { entries } = useHistoryStore();
  const { showWelcome } = useSettingsStore();
  const { subscription, user, fetchSubscription } = useAuthStore();

  // Recharger la subscription à chaque visite du dashboard
  useEffect(() => {
    if (user) fetchSubscription(user.id);
  }, [user?.id]);

  const recentEntries = entries.slice(0, 5);
  const featuredCommands = commands.filter((c) => ['cmd-ipconfig-all', 'cmd-nmap-ping-scan', 'cmd-arp-a', 'cmd-ping-basic'].includes(c.id));

  const greeting = subscription?.first_name
    ? `Bonjour, ${subscription.first_name}.`
    : 'Bonjour, technicien.';

  return (
    <div className="space-y-8">
      {/* Header — conditionné par showWelcome */}
      {showWelcome && (
      <div>
        <div className="flex items-center gap-2 mb-1">
          <img src="/icons/logo32.png" alt="NetOps" className="w-4 h-4" />
          <span className="text-xs font-medium text-accent uppercase tracking-wider">NetOps Companion</span>
        </div>
        <h1 className="text-2xl font-bold text-white mb-1">{greeting}</h1>
        <p className="text-slate-400 text-sm">
          Votre assistant réseau & vidéosurveillance. Commandes, diagnostics et checklists en un seul endroit.
        </p>
      </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {stats.map(({ label, value, icon: Icon, href }) => (
          <Link
            key={label}
            to={href}
            className="flex items-center gap-3 rounded-xl border border-surface-600 bg-surface-800 p-4 hover:border-accent/40 hover:bg-surface-700 transition-all"
          >
            <div className="p-2 rounded-lg bg-accent/10 border border-accent/20">
              <Icon className="w-4 h-4 text-accent" />
            </div>
            <div>
              <div className="text-xl font-bold text-white">{value}</div>
              <div className="text-xs text-slate-500">{label}</div>
            </div>
          </Link>
        ))}
      </div>

      {/* Quick access */}
      <div>
        <h2 className="text-sm font-semibold text-slate-300 mb-3 flex items-center gap-2">
          <ArrowRight className="w-4 h-4 text-accent" />
          Accès rapide
        </h2>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          {quickAccess.map(({ label, href, icon: Icon, desc }) => (
            <Link
              key={href}
              to={href}
              className="group flex flex-col items-center justify-center gap-2 rounded-xl border border-surface-600 bg-surface-800 p-5 hover:border-accent/40 hover:bg-surface-700 transition-all text-center"
            >
              <div className="p-2.5 rounded-xl bg-surface-600 group-hover:bg-accent/15 border border-surface-500 group-hover:border-accent/30 transition-all">
                <Icon className="w-5 h-5 text-slate-400 group-hover:text-accent" />
              </div>
              <div>
                <div className="text-sm font-medium text-slate-200 group-hover:text-white">{label}</div>
                <div className="text-xs text-slate-500 mt-0.5">{desc}</div>
              </div>
            </Link>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Featured commands */}
        <div className="lg:col-span-2 space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-semibold text-slate-300 flex items-center gap-2">
              <Terminal className="w-4 h-4 text-accent" />
              Commandes essentielles
            </h2>
            <Link to="/commands" className="text-xs text-accent hover:underline flex items-center gap-1">
              Voir tout <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {featuredCommands.map((cmd) => (
              <CommandCard key={cmd.id} command={cmd} compact />
            ))}
          </div>
        </div>

        {/* Sidebar: history + recent diagnostics */}
        <div className="space-y-4">
          {recentEntries.length > 0 && (
            <div>
              <div className="flex items-center justify-between mb-2">
                <h2 className="text-sm font-semibold text-slate-300 flex items-center gap-2">
                  <History className="w-4 h-4 text-slate-500" />
                  Récemment consulté
                </h2>
                <Link to="/history" className="text-xs text-slate-500 hover:text-accent">
                  Voir tout
                </Link>
              </div>
              <div className="space-y-1">
                {recentEntries.map((entry, i) => (
                  <Link
                    key={i}
                    to={entry.type !== 'search' && entry.id ? `/${entry.type === 'command' ? 'commands' : entry.type === 'diagnostic' ? 'diagnostics' : 'checklists'}/${entry.id}` : '/history'}
                    className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-surface-700 transition-all"
                  >
                    <div className="w-1.5 h-1.5 rounded-full bg-accent/60 flex-shrink-0" />
                    <span className="text-xs text-slate-400 truncate flex-1">{entry.title}</span>
                    <span className="text-xs text-slate-600 flex-shrink-0">{formatRelativeDate(entry.visitedAt)}</span>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* Categories */}
          <div>
            <h2 className="text-sm font-semibold text-slate-300 mb-2 flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-slate-500" />
              Catégories
            </h2>
            <div className="space-y-1.5">
              {categories.slice(0, 6).map((cat) => (
                <CategoryCard
                  key={cat.id}
                  category={cat}
                  href={`/commands?category=${cat.id}`}
                />
              ))}
              <Link
                to="/commands"
                className="block text-center text-xs text-accent hover:underline py-1"
              >
                Voir toutes les catégories →
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Recent diagnostics */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-sm font-semibold text-slate-300 flex items-center gap-2">
            <Stethoscope className="w-4 h-4 text-accent" />
            Diagnostics guidés récents
          </h2>
          <Link to="/diagnostics" className="text-xs text-accent hover:underline flex items-center gap-1">
            Voir tout <ArrowRight className="w-3 h-3" />
          </Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {diagnostics.slice(0, 3).map((d) => (
            <DiagnosticCard key={d.id} diagnostic={d} />
          ))}
        </div>
      </div>
    </div>
  );
}

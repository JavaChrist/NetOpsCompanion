import { Link } from 'react-router-dom';
import { History, Trash2, Terminal, Stethoscope, CheckSquare, Search } from 'lucide-react';
import { useHistoryStore } from '../store';
import { formatRelativeDate } from '../utils';
import { clsx } from 'clsx';

const typeConfig = {
  command: { icon: Terminal, label: 'Commande', color: 'text-accent', href: (id: string) => `/commands/${id}` },
  diagnostic: { icon: Stethoscope, label: 'Diagnostic', color: 'text-violet-400', href: (id: string) => `/diagnostics/${id}` },
  checklist: { icon: CheckSquare, label: 'Checklist', color: 'text-green-400', href: (id: string) => `/checklists/${id}` },
  search: { icon: Search, label: 'Recherche', color: 'text-slate-400', href: () => '/commands' },
};

export function HistoryPage() {
  const { entries, clearHistory } = useHistoryStore();

  if (entries.length === 0) {
    return (
      <div className="space-y-6">
        <h1 className="text-xl font-bold text-white flex items-center gap-2">
          <History className="w-5 h-5 text-accent" />
          Historique
        </h1>
        <div className="text-center py-20">
          <History className="w-12 h-12 text-slate-700 mx-auto mb-4" />
          <p className="text-slate-400">Aucun historique pour le moment.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold text-white flex items-center gap-2">
          <History className="w-5 h-5 text-accent" />
          Historique
          <span className="text-sm font-normal text-slate-500">({entries.length})</span>
        </h1>
        <button
          onClick={clearHistory}
          className="flex items-center gap-2 px-3 py-2 rounded-lg border border-surface-600 text-slate-500 hover:text-red-400 hover:border-red-400/30 text-sm transition-all"
        >
          <Trash2 className="w-4 h-4" />
          Vider
        </button>
      </div>

      <div className="rounded-xl border border-surface-600 bg-surface-800 overflow-hidden divide-y divide-surface-600/50">
        {entries.map((entry, i) => {
          const conf = typeConfig[entry.type];
          const Icon = conf.icon;
          const href = entry.id ? conf.href(entry.id) : '/';

          return (
            <Link
              key={i}
              to={href}
              className="flex items-center gap-3 px-4 py-3 hover:bg-surface-700 transition-colors"
            >
              <Icon className={clsx('w-4 h-4 flex-shrink-0', conf.color)} />
              <div className="flex-1 min-w-0">
                <span className="text-sm text-slate-300 truncate block">{entry.title}</span>
                <span className="text-xs text-slate-500">{conf.label}</span>
              </div>
              <span className="text-xs text-slate-600 flex-shrink-0">
                {formatRelativeDate(entry.visitedAt)}
              </span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}

import { useState } from 'react';
import { clsx } from 'clsx';
import { ScrollText, ChevronDown, ChevronUp, AlertTriangle, Info } from 'lucide-react';
import { logReferences } from '../../data/genetec';
import { GenetecBreadcrumb } from '../../components/genetec/GenetecBreadcrumb';

const SEVERITY_STYLES: Record<string, string> = {
  info: 'text-blue-400 bg-blue-500/10 border-blue-500/20',
  warning: 'text-amber-400 bg-amber-500/10 border-amber-500/20',
  critical: 'text-rose-400 bg-rose-500/10 border-rose-500/20',
  fatal: 'text-red-400 bg-red-500/10 border-red-500/20',
};
const SEVERITY_LABELS: Record<string, string> = {
  info: 'Info', warning: 'Avertissement', critical: 'Critique', fatal: 'Bloquant',
};
const SEVERITY_FILTERS = ['Tous', 'info', 'warning', 'critical', 'fatal'] as const;

export function GenetecLogsPage() {
  const [expanded, setExpanded] = useState<Set<string>>(new Set());
  const [filter, setFilter] = useState<string>('Tous');

  const toggle = (id: string) => {
    setExpanded(prev => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const filtered = filter === 'Tous' ? logReferences : logReferences.filter(l => l.severity === filter);

  return (
    <div className="space-y-6">
      <div>
        <GenetecBreadcrumb crumbs={[{ label: 'Logs & Événements' }]} />
        <h1 className="text-2xl font-bold text-white mb-1">Logs & Événements</h1>
        <p className="text-slate-400 text-sm">
          Référence des événements Genetec : source, signification, causes et actions recommandées.
        </p>
      </div>

      {/* Filtres */}
      <div className="flex gap-2 flex-wrap">
        {SEVERITY_FILTERS.map(f => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={clsx(
              'px-3 py-1.5 rounded-lg text-xs font-medium border transition-all',
              filter === f
                ? 'bg-accent/15 border-accent/40 text-accent'
                : 'border-surface-600 bg-surface-800 text-slate-400 hover:text-slate-200 hover:bg-surface-700'
            )}
          >
            {f === 'Tous' ? 'Tous' : SEVERITY_LABELS[f]}
          </button>
        ))}
      </div>

      {/* Log list */}
      <div className="space-y-2">
        {filtered.map(log => {
          const isOpen = expanded.has(log.id);
          return (
            <div
              key={log.id}
              className={clsx(
                'rounded-xl border transition-all',
                isOpen ? 'border-accent/30 bg-surface-700' : 'border-surface-600 bg-surface-800'
              )}
            >
              <button
                onClick={() => toggle(log.id)}
                className="w-full flex items-center gap-3 px-4 py-3 text-left"
              >
                <AlertTriangle className={clsx('w-4 h-4 flex-shrink-0', SEVERITY_STYLES[log.severity].split(' ')[0])} />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-sm font-medium text-slate-200">{log.eventName}</span>
                    <span className={clsx('text-xs px-2 py-0.5 rounded-full border flex-shrink-0', SEVERITY_STYLES[log.severity])}>
                      {SEVERITY_LABELS[log.severity]}
                    </span>
                  </div>
                  <div className="text-xs text-slate-500">{log.source} · {log.component}</div>
                </div>
                {isOpen
                  ? <ChevronUp className="w-4 h-4 text-slate-500 flex-shrink-0" />
                  : <ChevronDown className="w-4 h-4 text-slate-500 flex-shrink-0" />
                }
              </button>

              {isOpen && (
                <div className="px-4 pb-4 space-y-4 border-t border-surface-600 pt-3">
                  <div>
                    <p className="text-sm text-slate-300 leading-relaxed">{log.description}</p>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="rounded-lg bg-surface-700 border border-surface-500 p-3">
                      <p className="text-xs font-semibold text-slate-400 mb-1">Impact</p>
                      <p className="text-xs text-slate-300 leading-relaxed">{log.impact}</p>
                    </div>
                    <div className="rounded-lg bg-surface-700 border border-surface-500 p-3">
                      <p className="text-xs font-semibold text-slate-400 mb-1.5">Causes probables</p>
                      <ul className="space-y-1">
                        {log.probableCauses.map((c, i) => (
                          <li key={i} className="flex items-start gap-1.5 text-xs text-slate-300">
                            <span className="text-accent flex-shrink-0">•</span>
                            {c}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-slate-400 mb-2">Actions recommandées</p>
                    <ol className="space-y-1.5">
                      {log.recommendedActions.map((a, i) => (
                        <li key={i} className="flex items-start gap-2 text-xs text-slate-300">
                          <span className="flex-shrink-0 w-4 h-4 rounded-full bg-surface-600 border border-surface-500 text-xs flex items-center justify-center text-slate-500 font-medium">
                            {i + 1}
                          </span>
                          {a}
                        </li>
                      ))}
                    </ol>
                  </div>
                  {log.relatedDiagnostics && log.relatedDiagnostics.length > 0 && (
                    <div className="flex items-center gap-2">
                      <Info className="w-3.5 h-3.5 text-accent flex-shrink-0" />
                      <span className="text-xs text-slate-500">
                        Diagnostics liés :{' '}
                        {log.relatedDiagnostics.map(id => (
                          <a
                            key={id}
                            href={`/genetec/diagnostic/${id}`}
                            className="text-accent hover:underline"
                          >
                            {id}
                          </a>
                        )).reduce((acc: React.ReactNode[], el, i) => [...acc, i > 0 ? ', ' : '', el], [])}
                      </span>
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

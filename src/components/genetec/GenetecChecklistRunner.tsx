import { useState } from 'react';
import { clsx } from 'clsx';
import { CheckCircle2, Circle, AlertTriangle, Info } from 'lucide-react';
import type { GenetecChecklist } from '../../data/genetec/types';

interface GenetecChecklistRunnerProps {
  checklist: GenetecChecklist;
}

export function GenetecChecklistRunner({ checklist }: GenetecChecklistRunnerProps) {
  const [checked, setChecked] = useState<Set<string>>(new Set());

  const toggle = (id: string) => {
    setChecked(prev => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const criticalItems = checklist.items.filter(i => i.critical);
  const criticalDone = criticalItems.filter(i => checked.has(i.id)).length;
  const totalDone = checked.size;
  const total = checklist.items.length;
  const allCriticalDone = criticalDone === criticalItems.length;
  const allDone = totalDone === total;

  return (
    <div className="space-y-5">
      {/* Progress header */}
      <div className="rounded-xl border border-surface-600 bg-surface-800 p-4">
        <div className="flex items-center justify-between mb-3">
          <div>
            <p className="text-sm font-semibold text-white">{checklist.title}</p>
            <p className="text-xs text-slate-500 mt-0.5">{checklist.description}</p>
          </div>
          <span className="text-sm font-bold text-accent tabular-nums">{totalDone}/{total}</span>
        </div>
        <div className="h-1.5 bg-surface-600 rounded-full overflow-hidden">
          <div
            className={clsx('h-full rounded-full transition-all duration-300', allDone ? 'bg-emerald-400' : 'bg-accent')}
            style={{ width: `${Math.round((totalDone / total) * 100)}%` }}
          />
        </div>
        <div className="flex items-center gap-4 mt-2 text-xs text-slate-500">
          <span>{criticalDone}/{criticalItems.length} points critiques</span>
          {allDone && <span className="text-emerald-400 font-medium">✓ Checklist complète</span>}
          {!allDone && allCriticalDone && <span className="text-amber-400">Points critiques OK</span>}
        </div>
      </div>

      {/* Items */}
      <div className="space-y-2">
        {checklist.items.map(item => {
          const isDone = checked.has(item.id);
          return (
            <button
              key={item.id}
              onClick={() => toggle(item.id)}
              className={clsx(
                'w-full flex items-start gap-3 rounded-xl border px-4 py-3 text-left transition-all',
                isDone
                  ? 'border-emerald-500/30 bg-emerald-500/5'
                  : item.critical
                  ? 'border-surface-500 bg-surface-800 hover:border-accent/40 hover:bg-surface-700'
                  : 'border-surface-600 bg-surface-800 hover:border-surface-500 hover:bg-surface-700'
              )}
            >
              {isDone
                ? <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                : <Circle className={clsx('w-4 h-4 flex-shrink-0 mt-0.5', item.critical ? 'text-slate-400' : 'text-slate-600')} />
              }
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className={clsx('text-sm', isDone ? 'text-emerald-300 line-through' : 'text-slate-200')}>
                    {item.label}
                  </span>
                  {item.critical && !isDone && (
                    <span className="text-xs px-1.5 py-0.5 rounded border border-rose-500/30 bg-rose-500/10 text-rose-400 flex-shrink-0">
                      Critique
                    </span>
                  )}
                </div>
                {item.description && !isDone && (
                  <p className="text-xs text-slate-500 mt-0.5 leading-relaxed">{item.description}</p>
                )}
                {item.logsToCheck && !isDone && (
                  <div className="flex items-start gap-1.5 mt-1.5">
                    <Info className="w-3 h-3 text-accent flex-shrink-0 mt-0.5" />
                    <span className="text-xs text-slate-500">{item.logsToCheck.join(' · ')}</span>
                  </div>
                )}
                {item.parameters && item.parameters.length > 0 && !isDone && (
                  <div className="flex flex-wrap gap-2 mt-1.5">
                    {item.parameters.map((p, i) => (
                      <span key={i} className="text-xs font-mono px-2 py-0.5 rounded bg-surface-700 border border-surface-500 text-slate-400">
                        {p.name}: <span className="text-accent">{p.value}</span>
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </button>
          );
        })}
      </div>

      {/* Final status */}
      {!allCriticalDone && (
        <div className="flex items-start gap-2.5 p-3 rounded-xl border border-rose-500/20 bg-rose-500/5">
          <AlertTriangle className="w-4 h-4 text-rose-400 flex-shrink-0 mt-0.5" />
          <p className="text-xs text-rose-300">
            {criticalItems.length - criticalDone} point(s) critique(s) restant(s). Ne pas valider l'intervention tant que tous les points critiques ne sont pas cochés.
          </p>
        </div>
      )}
    </div>
  );
}

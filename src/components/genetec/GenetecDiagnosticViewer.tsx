import { useState } from 'react';
import { clsx } from 'clsx';
import { AlertTriangle, ChevronDown, ChevronUp, ShieldAlert, Info, Zap } from 'lucide-react';
import type { GenetecDiagnosticFlow } from '../../data/genetec/types';

const SEVERITY_STYLES: Record<string, { badge: string; border: string; icon: string }> = {
  info: { badge: 'text-blue-400 bg-blue-500/10 border-blue-500/20', border: 'border-blue-500/20', icon: 'text-blue-400' },
  warning: { badge: 'text-amber-400 bg-amber-500/10 border-amber-500/20', border: 'border-amber-500/20', icon: 'text-amber-400' },
  critical: { badge: 'text-rose-400 bg-rose-500/10 border-rose-500/20', border: 'border-rose-500/20', icon: 'text-rose-400' },
  fatal: { badge: 'text-red-400 bg-red-500/10 border-red-500/20', border: 'border-red-500/20', icon: 'text-red-400' },
};

const SEVERITY_LABELS: Record<string, string> = {
  info: 'Information',
  warning: 'Avertissement',
  critical: 'Critique',
  fatal: 'Bloquant',
};

const PROBABILITY_STYLES: Record<string, string> = {
  high: 'text-rose-400 bg-rose-500/10 border-rose-500/20',
  medium: 'text-amber-400 bg-amber-500/10 border-amber-500/20',
  low: 'text-slate-400 bg-surface-700 border-surface-500',
};

const PROBABILITY_LABELS: Record<string, string> = {
  high: 'Probabilité haute',
  medium: 'Probabilité moyenne',
  low: 'Probabilité faible',
};

interface GenetecDiagnosticViewerProps {
  flow: GenetecDiagnosticFlow;
}

export function GenetecDiagnosticViewer({ flow }: GenetecDiagnosticViewerProps) {
  const [expandedCauses, setExpandedCauses] = useState<Set<string>>(new Set([flow.causes[0]?.id]));

  const toggleCause = (id: string) => {
    setExpandedCauses(prev => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const severity = SEVERITY_STYLES[flow.severity];

  return (
    <div className="space-y-5">
      {/* Symptôme + sévérité */}
      <div className={clsx('rounded-xl border p-5', severity.border, 'bg-surface-800')}>
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="flex items-center gap-2.5">
            <ShieldAlert className={clsx('w-5 h-5 flex-shrink-0', severity.icon)} />
            <h2 className="text-lg font-bold text-white">{flow.symptom}</h2>
          </div>
          <span className={clsx('text-xs font-medium px-2.5 py-1 rounded-full border flex-shrink-0', severity.badge)}>
            {SEVERITY_LABELS[flow.severity]}
          </span>
        </div>
        <p className="text-sm text-slate-400 leading-relaxed">{flow.description}</p>
      </div>

      {/* Actions immédiates */}
      <div className="rounded-xl border border-surface-600 bg-surface-800 p-4">
        <h3 className="text-sm font-semibold text-slate-300 mb-3 flex items-center gap-2">
          <Zap className="w-4 h-4 text-accent" />
          Actions immédiates
        </h3>
        <ol className="space-y-2">
          {flow.immediateActions.map((action, i) => (
            <li key={i} className="flex items-start gap-2.5 text-sm text-slate-300">
              <span className="flex-shrink-0 w-5 h-5 rounded-full bg-accent/20 border border-accent/30 text-xs flex items-center justify-center text-accent font-medium">
                {i + 1}
              </span>
              {action}
            </li>
          ))}
        </ol>
      </div>

      {/* Causes */}
      <div>
        <h3 className="text-sm font-semibold text-slate-300 mb-3 flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 text-accent" />
          Causes probables — par ordre de probabilité
        </h3>
        <div className="space-y-2">
          {flow.causes.map((cause, idx) => {
            const isOpen = expandedCauses.has(cause.id);
            return (
              <div
                key={cause.id}
                className={clsx(
                  'rounded-xl border transition-all',
                  isOpen ? 'border-accent/30 bg-surface-700' : 'border-surface-600 bg-surface-800'
                )}
              >
                {/* Cause header */}
                <button
                  onClick={() => toggleCause(cause.id)}
                  className="w-full flex items-center gap-3 px-4 py-3 text-left"
                >
                  <span className="flex-shrink-0 w-5 h-5 rounded-full bg-surface-600 border border-surface-500 text-xs flex items-center justify-center text-slate-400 font-medium">
                    {idx + 1}
                  </span>
                  <span className="flex-1 text-sm font-medium text-slate-200">{cause.description}</span>
                  <span className={clsx('text-xs px-2 py-0.5 rounded-full border flex-shrink-0', PROBABILITY_STYLES[cause.probability])}>
                    {PROBABILITY_LABELS[cause.probability]}
                  </span>
                  {isOpen
                    ? <ChevronUp className="w-4 h-4 text-slate-500 flex-shrink-0" />
                    : <ChevronDown className="w-4 h-4 text-slate-500 flex-shrink-0" />
                  }
                </button>

                {/* Cause details */}
                {isOpen && (
                  <div className="px-4 pb-4 space-y-4 border-t border-surface-600 pt-3">
                    {/* Check steps */}
                    <div>
                      <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-2">Points à vérifier</h4>
                      <ol className="space-y-1.5">
                        {cause.checkSteps.map((step, i) => (
                          <li key={i} className="flex items-start gap-2.5 text-sm text-slate-300">
                            <span className="flex-shrink-0 w-5 h-5 rounded-full bg-surface-600 border border-surface-500 text-xs flex items-center justify-center text-slate-500 font-medium">
                              {i + 1}
                            </span>
                            {step}
                          </li>
                        ))}
                      </ol>
                    </div>

                    {/* Corrective actions */}
                    <div>
                      <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-2">Actions correctives</h4>
                      <ul className="space-y-1.5">
                        {cause.correctiveActions.map((action, i) => (
                          <li key={i} className="flex items-start gap-2 text-sm text-slate-300">
                            <span className="text-accent flex-shrink-0 mt-0.5">→</span>
                            {action}
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Logs */}
                    {cause.logsToCheck && cause.logsToCheck.length > 0 && (
                      <div>
                        <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-2">Logs à consulter</h4>
                        <div className="space-y-1.5">
                          {cause.logsToCheck.map((log, i) => (
                            <div key={i} className="flex items-start gap-2 text-xs text-slate-400 bg-surface-700 rounded-lg px-3 py-2">
                              <Info className="w-3.5 h-3.5 text-accent flex-shrink-0 mt-0.5" />
                              {log}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {cause.escalate && (
                      <div className="flex items-start gap-2.5 p-3 rounded-lg bg-rose-500/10 border border-rose-500/20">
                        <AlertTriangle className="w-4 h-4 text-rose-400 flex-shrink-0 mt-0.5" />
                        <p className="text-xs text-rose-300">Si cette cause est confirmée, une escalade est nécessaire.</p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Critères d'escalade */}
      {flow.escalationCriteria && flow.escalationCriteria.length > 0 && (
        <div className="rounded-xl border border-rose-500/20 bg-rose-500/5 p-4">
          <h3 className="text-sm font-semibold text-rose-400 mb-2 flex items-center gap-2">
            <AlertTriangle className="w-4 h-4" />
            Critères d'escalade
          </h3>
          <ul className="space-y-1.5">
            {flow.escalationCriteria.map((c, i) => (
              <li key={i} className="flex items-start gap-2 text-xs text-rose-300">
                <span className="flex-shrink-0">•</span>
                {c}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

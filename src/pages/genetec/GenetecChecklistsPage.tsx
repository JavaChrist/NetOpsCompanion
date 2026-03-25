import { useState } from 'react';
import { clsx } from 'clsx';
import { ClipboardList } from 'lucide-react';
import { checklists } from '../../data/genetec';
import { GenetecBreadcrumb } from '../../components/genetec/GenetecBreadcrumb';
import { GenetecChecklistRunner } from '../../components/genetec/GenetecChecklistRunner';

const TIMING_LABELS: Record<string, string> = {
  commissioning: 'Mise en service',
  'pre-intervention': 'Avant intervention',
  'post-intervention': 'Après intervention',
  'post-update': 'Après mise à jour',
  periodic: 'Périodique',
};

export function GenetecChecklistsPage() {
  const [active, setActive] = useState<string | null>(null);

  return (
    <div className="space-y-6">
      <div>
        <GenetecBreadcrumb crumbs={[{ label: 'Checklists' }]} />
        <h1 className="text-2xl font-bold text-white mb-1">Checklists Genetec</h1>
        <p className="text-slate-400 text-sm">
          Recettes terrain interactives pour la mise en service, les interventions et les mises à jour.
        </p>
      </div>

      {/* Sélection checklist */}
      {!active && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {checklists.map(c => (
            <button
              key={c.id}
              onClick={() => setActive(c.id)}
              className="group flex items-start gap-4 rounded-xl border border-surface-600 bg-surface-800 p-4 hover:border-accent/40 hover:bg-surface-700 transition-all text-left"
            >
              <div className="p-2.5 rounded-xl bg-accent/10 border border-accent/20 flex-shrink-0">
                <ClipboardList className="w-5 h-5 text-accent" />
              </div>
              <div className="min-w-0">
                <div className="text-sm font-medium text-slate-200 group-hover:text-white mb-0.5">{c.title}</div>
                <div className="text-xs text-slate-500 leading-relaxed mb-2">{c.description}</div>
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-xs px-2 py-0.5 rounded-full border border-surface-500 bg-surface-700 text-slate-400">
                    {TIMING_LABELS[c.timing]}
                  </span>
                  <span className="text-xs text-slate-600">{c.items.length} points · {c.estimatedTime}</span>
                </div>
              </div>
            </button>
          ))}
        </div>
      )}

      {/* Checklist runner */}
      {active && (() => {
        const checklist = checklists.find(c => c.id === active);
        if (!checklist) return null;
        return (
          <div className="space-y-4">
            <button
              onClick={() => setActive(null)}
              className={clsx(
                'flex items-center gap-2 px-3 py-1.5 rounded-lg border border-surface-600 bg-surface-800',
                'text-xs text-slate-400 hover:text-slate-200 hover:bg-surface-700 transition-all'
              )}
            >
              ← Changer de checklist
            </button>
            <GenetecChecklistRunner checklist={checklist} />
          </div>
        );
      })()}
    </div>
  );
}

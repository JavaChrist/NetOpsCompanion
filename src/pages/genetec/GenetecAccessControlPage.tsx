import { Link } from 'react-router-dom';
import { KeyRound, BookOpen, Stethoscope, ArrowRight } from 'lucide-react';
import { procedures, diagnostics } from '../../data/genetec';
import { GenetecBreadcrumb } from '../../components/genetec/GenetecBreadcrumb';

const acProcedures = procedures.filter(p => p.domain === 'access-control');
const acDiagnostics = diagnostics.filter(d => d.domain === 'access-control');

const SEVERITY_STYLES: Record<string, string> = {
  warning: 'text-amber-400 bg-amber-500/10 border-amber-500/20',
  critical: 'text-rose-400 bg-rose-500/10 border-rose-500/20',
  info: 'text-blue-400 bg-blue-500/10 border-blue-500/20',
  fatal: 'text-red-400 bg-red-500/10 border-red-500/20',
};
const SEVERITY_LABELS: Record<string, string> = {
  info: 'Info', warning: 'Avertissement', critical: 'Critique', fatal: 'Bloquant',
};
const SKILL_STYLES: Record<string, string> = {
  'débutant': 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20',
  'intermédiaire': 'text-amber-400 bg-amber-500/10 border-amber-500/20',
  'avancé': 'text-orange-400 bg-orange-500/10 border-orange-500/20',
  'expert': 'text-rose-400 bg-rose-500/10 border-rose-500/20',
};

export function GenetecAccessControlPage() {
  return (
    <div className="space-y-8">
      <div>
        <GenetecBreadcrumb crumbs={[{ label: 'Contrôle d\'accès' }]} />
        <h1 className="text-2xl font-bold text-white mb-1">Contrôle d'accès / Synergis</h1>
        <p className="text-slate-400 text-sm">
          Configuration guidée et diagnostic des contrôleurs, portes, lecteurs et badges.
        </p>
      </div>

      {/* Procédures */}
      <div>
        <h2 className="text-sm font-semibold text-slate-300 mb-3 flex items-center gap-2">
          <BookOpen className="w-4 h-4 text-accent" />
          Procédures de configuration
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {acProcedures.map(p => (
            <Link
              key={p.id}
              to={`/genetec/procedure/${p.id}`}
              className="group flex items-start gap-4 rounded-xl border border-surface-600 bg-surface-800 p-4 hover:border-accent/40 hover:bg-surface-700 transition-all"
            >
              <div className="p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex-shrink-0">
                <BookOpen className="w-5 h-5 text-emerald-400" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap mb-1">
                  <span className="text-sm font-medium text-slate-200 group-hover:text-white">{p.title}</span>
                  <span className={`text-xs px-2 py-0.5 rounded-full border ${SKILL_STYLES[p.skillLevel]}`}>
                    {p.skillLevel}
                  </span>
                </div>
                <div className="text-xs text-slate-500 leading-relaxed mb-1">{p.description}</div>
                <div className="text-xs text-slate-600">{p.estimatedTime} · {p.steps.length} étapes</div>
              </div>
              <ArrowRight className="w-4 h-4 text-slate-600 group-hover:text-accent flex-shrink-0 mt-0.5 transition-colors" />
            </Link>
          ))}
        </div>
      </div>

      {/* Diagnostics */}
      <div>
        <h2 className="text-sm font-semibold text-slate-300 mb-3 flex items-center gap-2">
          <Stethoscope className="w-4 h-4 text-accent" />
          Diagnostics guidés par symptôme
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {acDiagnostics.map(d => (
            <Link
              key={d.id}
              to={`/genetec/diagnostic/${d.id}`}
              className="group flex items-start gap-4 rounded-xl border border-surface-600 bg-surface-800 p-4 hover:border-accent/40 hover:bg-surface-700 transition-all"
            >
              <div className={`p-2.5 rounded-xl border flex-shrink-0 ${SEVERITY_STYLES[d.severity]}`}>
                <Stethoscope className="w-5 h-5" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap mb-1">
                  <span className="text-sm font-medium text-slate-200 group-hover:text-white">{d.symptom}</span>
                  <span className={`text-xs px-2 py-0.5 rounded-full border ${SEVERITY_STYLES[d.severity]}`}>
                    {SEVERITY_LABELS[d.severity]}
                  </span>
                </div>
                <div className="text-xs text-slate-500 leading-relaxed mb-1">{d.description}</div>
                <div className="text-xs text-slate-600">{d.causes.length} cause{d.causes.length > 1 ? 's' : ''} analysée{d.causes.length > 1 ? 's' : ''}</div>
              </div>
              <ArrowRight className="w-4 h-4 text-slate-600 group-hover:text-accent flex-shrink-0 mt-0.5 transition-colors" />
            </Link>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <Link to="/genetec/checklists" className="group flex items-center gap-3 rounded-xl border border-surface-600 bg-surface-800 px-4 py-3 hover:border-accent/40 hover:bg-surface-700 transition-all">
          <KeyRound className="w-4 h-4 text-accent flex-shrink-0" />
          <span className="text-sm text-slate-300 group-hover:text-white">Checklist mise en service</span>
          <ArrowRight className="w-4 h-4 text-slate-600 group-hover:text-accent ml-auto" />
        </Link>
        <Link to="/genetec/logs" className="group flex items-center gap-3 rounded-xl border border-surface-600 bg-surface-800 px-4 py-3 hover:border-accent/40 hover:bg-surface-700 transition-all">
          <KeyRound className="w-4 h-4 text-slate-500 flex-shrink-0" />
          <span className="text-sm text-slate-300 group-hover:text-white">Référence logs accès</span>
          <ArrowRight className="w-4 h-4 text-slate-600 group-hover:text-accent ml-auto" />
        </Link>
      </div>
    </div>
  );
}

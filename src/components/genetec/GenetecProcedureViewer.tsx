import { useState } from 'react';
import { clsx } from 'clsx';
import {
  CheckCircle2,
  Circle,
  ChevronLeft,
  ChevronRight,
  AlertTriangle,
  Lightbulb,
  Clock,
  BarChart2,
  FileText,
} from 'lucide-react';
import type { GenetecGuidedProcedure } from '../../data/genetec/types';

const SKILL_COLORS: Record<string, string> = {
  'débutant': 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20',
  'intermédiaire': 'text-amber-400 bg-amber-500/10 border-amber-500/20',
  'avancé': 'text-orange-400 bg-orange-500/10 border-orange-500/20',
  'expert': 'text-rose-400 bg-rose-500/10 border-rose-500/20',
};

interface GenetecProcedureViewerProps {
  procedure: GenetecGuidedProcedure;
}

export function GenetecProcedureViewer({ procedure }: GenetecProcedureViewerProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [completed, setCompleted] = useState<Set<number>>(new Set());
  const [validationChecked, setValidationChecked] = useState<Set<number>>(new Set());
  const [phase, setPhase] = useState<'intro' | 'steps' | 'validation'>('intro');

  const step = procedure.steps[currentStep];
  const totalSteps = procedure.steps.length;
  const progress = Math.round(((currentStep + (completed.has(currentStep) ? 1 : 0)) / totalSteps) * 100);

  const toggleCompleted = (idx: number) => {
    setCompleted(prev => {
      const next = new Set(prev);
      next.has(idx) ? next.delete(idx) : next.add(idx);
      return next;
    });
  };

  const toggleValidation = (idx: number) => {
    setValidationChecked(prev => {
      const next = new Set(prev);
      next.has(idx) ? next.delete(idx) : next.add(idx);
      return next;
    });
  };

  const goNext = () => {
    if (currentStep < totalSteps - 1) {
      setCurrentStep(s => s + 1);
    } else {
      setPhase('validation');
    }
  };

  const goPrev = () => {
    if (phase === 'validation') {
      setPhase('steps');
    } else if (currentStep > 0) {
      setCurrentStep(s => s - 1);
    } else {
      setPhase('intro');
    }
  };

  // ── INTRO ───────────────────────────────────────────────────────────────────
  if (phase === 'intro') {
    return (
      <div className="space-y-6">
        {/* Header */}
        <div className="rounded-xl border border-surface-600 bg-surface-800 p-6">
          <div className="flex items-start justify-between gap-4 mb-4">
            <div>
              <h2 className="text-xl font-bold text-white mb-1">{procedure.title}</h2>
              <p className="text-sm text-slate-400">{procedure.description}</p>
            </div>
            <span className={clsx('text-xs font-medium px-2.5 py-1 rounded-full border flex-shrink-0', SKILL_COLORS[procedure.skillLevel])}>
              {procedure.skillLevel}
            </span>
          </div>
          <div className="flex items-center gap-4 text-xs text-slate-500">
            <span className="flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5" />
              {procedure.estimatedTime}
            </span>
            <span className="flex items-center gap-1.5">
              <BarChart2 className="w-3.5 h-3.5" />
              {totalSteps} étapes
            </span>
          </div>
        </div>

        {/* Avertissements */}
        {procedure.warnings && procedure.warnings.length > 0 && (
          <div className="rounded-xl border border-amber-500/20 bg-amber-500/5 p-4 space-y-2">
            {procedure.warnings.map((w, i) => (
              <div key={i} className="flex items-start gap-2.5 text-sm text-amber-300">
                <AlertTriangle className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" />
                {w}
              </div>
            ))}
          </div>
        )}

        {/* Prérequis */}
        <div className="rounded-xl border border-surface-600 bg-surface-800 p-4">
          <h3 className="text-sm font-semibold text-slate-300 mb-3 flex items-center gap-2">
            <FileText className="w-4 h-4 text-accent" />
            Prérequis
          </h3>
          <ul className="space-y-2">
            {procedure.prerequisites.map((p, i) => (
              <li key={i} className="flex items-start gap-2.5 text-sm text-slate-300">
                <CheckCircle2 className="w-4 h-4 text-surface-500 flex-shrink-0 mt-0.5" />
                {p}
              </li>
            ))}
          </ul>
        </div>

        <button
          onClick={() => setPhase('steps')}
          className="w-full py-3 rounded-xl bg-accent text-surface-900 font-bold text-sm hover:bg-accent/90 transition-all flex items-center justify-center gap-2"
        >
          Démarrer la procédure
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    );
  }

  // ── VALIDATION ──────────────────────────────────────────────────────────────
  if (phase === 'validation') {
    const allChecked = validationChecked.size === procedure.validationChecks.length;
    return (
      <div className="space-y-6">
        <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/5 p-4">
          <h3 className="text-sm font-semibold text-emerald-400 mb-1">Procédure terminée — Points de validation</h3>
          <p className="text-xs text-slate-400">Vérifier chaque point avant de clore l'intervention.</p>
        </div>
        <div className="space-y-2">
          {procedure.validationChecks.map((check, i) => (
            <button
              key={i}
              onClick={() => toggleValidation(i)}
              className={clsx(
                'w-full flex items-center gap-3 rounded-xl border px-4 py-3 text-left transition-all',
                validationChecked.has(i)
                  ? 'border-emerald-500/40 bg-emerald-500/10'
                  : 'border-surface-600 bg-surface-800 hover:border-accent/40 hover:bg-surface-700'
              )}
            >
              {validationChecked.has(i)
                ? <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                : <Circle className="w-4 h-4 text-slate-600 flex-shrink-0" />
              }
              <span className={clsx('text-sm', validationChecked.has(i) ? 'text-emerald-300 line-through' : 'text-slate-300')}>
                {check}
              </span>
            </button>
          ))}
        </div>
        <div className="flex gap-3">
          <button
            onClick={goPrev}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-surface-600 bg-surface-800 text-sm text-slate-400 hover:text-slate-200 hover:bg-surface-700 transition-all"
          >
            <ChevronLeft className="w-4 h-4" />
            Retour
          </button>
          {allChecked && (
            <div className="flex-1 py-2.5 rounded-xl border border-emerald-500/30 bg-emerald-500/10 text-sm text-emerald-400 font-medium text-center">
              ✓ Intervention validée
            </div>
          )}
        </div>
      </div>
    );
  }

  // ── STEPS ───────────────────────────────────────────────────────────────────
  return (
    <div className="space-y-5">
      {/* Progress */}
      <div>
        <div className="flex items-center justify-between text-xs text-slate-500 mb-2">
          <span>Étape {currentStep + 1} / {totalSteps}</span>
          <span>{progress}% complété</span>
        </div>
        <div className="h-1.5 bg-surface-600 rounded-full overflow-hidden">
          <div
            className="h-full bg-accent rounded-full transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
        {/* Step dots */}
        <div className="flex gap-1.5 mt-2 flex-wrap">
          {procedure.steps.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrentStep(i)}
              className={clsx(
                'w-6 h-6 rounded-full text-xs font-medium border transition-all',
                i === currentStep
                  ? 'bg-accent text-surface-900 border-accent'
                  : completed.has(i)
                  ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40'
                  : 'bg-surface-700 text-slate-500 border-surface-600 hover:border-slate-500'
              )}
            >
              {completed.has(i) ? '✓' : i + 1}
            </button>
          ))}
        </div>
      </div>

      {/* Step card */}
      <div className="rounded-xl border border-surface-600 bg-surface-800 p-5 space-y-4">
        <h3 className="text-base font-semibold text-white">{step.title}</h3>
        <p className="text-sm text-slate-300 leading-relaxed">{step.description}</p>

        {step.substeps && step.substeps.length > 0 && (
          <ol className="space-y-2">
            {step.substeps.map((sub, i) => (
              <li key={i} className="flex items-start gap-2.5 text-sm text-slate-300">
                <span className="flex-shrink-0 w-5 h-5 rounded-full bg-surface-600 border border-surface-500 text-xs flex items-center justify-center text-slate-400 font-medium">
                  {i + 1}
                </span>
                {sub}
              </li>
            ))}
          </ol>
        )}

        {step.parameters && step.parameters.length > 0 && (
          <div className="rounded-lg border border-surface-500 overflow-hidden">
            <div className="px-3 py-2 bg-surface-700 border-b border-surface-500">
              <span className="text-xs font-medium text-slate-400">Paramètres</span>
            </div>
            <div className="divide-y divide-surface-600">
              {step.parameters.map((param, i) => (
                <div key={i} className="flex items-start justify-between gap-4 px-3 py-2.5">
                  <div>
                    <span className="text-xs font-medium text-slate-300">{param.name}</span>
                    {param.description && <p className="text-xs text-slate-500 mt-0.5">{param.description}</p>}
                  </div>
                  <span className="text-xs font-mono text-accent flex-shrink-0">{param.value}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {step.warning && (
          <div className="flex items-start gap-2.5 p-3 rounded-lg bg-amber-500/10 border border-amber-500/20">
            <AlertTriangle className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" />
            <p className="text-xs text-amber-300 leading-relaxed">{step.warning}</p>
          </div>
        )}

        {step.tip && (
          <div className="flex items-start gap-2.5 p-3 rounded-lg bg-blue-500/10 border border-blue-500/20">
            <Lightbulb className="w-4 h-4 text-blue-400 flex-shrink-0 mt-0.5" />
            <p className="text-xs text-blue-300 leading-relaxed">{step.tip}</p>
          </div>
        )}

        {step.logsToCheck && step.logsToCheck.length > 0 && (
          <div className="space-y-1">
            <span className="text-xs font-medium text-slate-500">Logs à consulter :</span>
            {step.logsToCheck.map((log, i) => (
              <div key={i} className="flex items-start gap-2 text-xs text-slate-500">
                <span className="text-accent flex-shrink-0">›</span>
                {log}
              </div>
            ))}
          </div>
        )}

        {step.validation && (
          <div className="p-3 rounded-lg bg-surface-700 border border-surface-500">
            <span className="text-xs font-medium text-slate-400">Validation : </span>
            <span className="text-xs text-slate-300">{step.validation}</span>
          </div>
        )}
      </div>

      {/* Mark complete + navigation */}
      <div className="space-y-3">
        <button
          onClick={() => toggleCompleted(currentStep)}
          className={clsx(
            'w-full flex items-center justify-center gap-2 py-2.5 rounded-xl border text-sm font-medium transition-all',
            completed.has(currentStep)
              ? 'border-emerald-500/40 bg-emerald-500/10 text-emerald-400'
              : 'border-surface-500 bg-surface-700 text-slate-400 hover:border-accent/40 hover:text-accent'
          )}
        >
          {completed.has(currentStep)
            ? <><CheckCircle2 className="w-4 h-4" /> Étape validée</>
            : <><Circle className="w-4 h-4" /> Marquer comme complétée</>
          }
        </button>

        <div className="flex gap-3">
          <button
            onClick={goPrev}
            disabled={currentStep === 0 && phase === 'steps'}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-surface-600 bg-surface-800 text-sm text-slate-400 hover:text-slate-200 hover:bg-surface-700 transition-all disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <ChevronLeft className="w-4 h-4" />
            Précédent
          </button>
          <button
            onClick={goNext}
            className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl bg-accent text-surface-900 text-sm font-semibold hover:bg-accent/90 transition-all"
          >
            {currentStep < totalSteps - 1 ? 'Étape suivante' : 'Terminer'}
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}

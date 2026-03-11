import { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  AlertTriangle,
  CheckCircle2,
  Circle,
  Clock,
  Terminal,
  Info,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import { getDiagnosticById, getCategoryById, getCategoryColor, getLevelColor, getLevelLabel } from '../utils';
import { useHistoryStore } from '../store';
import { FavoriteButton } from '../components/ui/FavoriteButton';
import { CopyCommandButton } from '../components/ui/CopyCommandButton';
import { Badge } from '../components/ui/Badge';
import { clsx } from 'clsx';

export function DiagnosticDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const diag = id ? getDiagnosticById(id) : undefined;
  const { addEntry } = useHistoryStore();
  const [completedSteps, setCompletedSteps] = useState<Set<number>>(new Set());
  const [expandedStep, setExpandedStep] = useState<number | null>(0);

  useEffect(() => {
    if (diag) addEntry({ type: 'diagnostic', id: diag.id, title: diag.title });
  }, [diag?.id]);

  if (!diag) {
    return (
      <div className="text-center py-20">
        <p className="text-slate-400">Diagnostic introuvable.</p>
        <button onClick={() => navigate(-1)} className="mt-4 text-accent text-sm hover:underline">Retour</button>
      </div>
    );
  }

  const category = getCategoryById(diag.category);
  const toggleStep = (n: number) => {
    setCompletedSteps((prev) => {
      const s = new Set(prev);
      s.has(n) ? s.delete(n) : s.add(n);
      return s;
    });
  };

  const progressPct = Math.round((completedSteps.size / diag.steps.length) * 100);

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <Link to="/diagnostics" className="inline-flex items-center gap-2 text-sm text-slate-400 hover:text-accent">
        <ArrowLeft className="w-4 h-4" />
        Diagnostics guidés
      </Link>

      {/* Header */}
      <div className="rounded-2xl border border-surface-600 bg-surface-800 p-6">
        <div className="flex items-start justify-between gap-3 mb-4">
          <div className="flex-1">
            <h1 className="text-lg font-bold text-white leading-snug mb-2">{diag.title}</h1>
            <div className="flex flex-wrap gap-2 mb-3">
              {category && (
                <Badge className={clsx('border', getCategoryColor(category.color))}>{category.label}</Badge>
              )}
              <Badge className={clsx('border', getLevelColor(diag.level))}>{getLevelLabel(diag.level)}</Badge>
              {diag.estimatedTime && (
                <span className="flex items-center gap-1 text-xs text-slate-500">
                  <Clock className="w-3 h-3" />
                  {diag.estimatedTime}
                </span>
              )}
            </div>
            <p className="text-sm text-slate-300">{diag.description}</p>
          </div>
          <FavoriteButton type="diagnostics" id={diag.id} />
        </div>

        {/* Progress */}
        <div>
          <div className="flex items-center justify-between text-xs text-slate-500 mb-1.5">
            <span>Progression</span>
            <span>{completedSteps.size}/{diag.steps.length} étapes</span>
          </div>
          <div className="h-2 bg-surface-600 rounded-full overflow-hidden">
            <div
              className={clsx('h-full rounded-full transition-all duration-500', progressPct === 100 ? 'bg-green-500' : 'bg-accent')}
              style={{ width: `${progressPct}%` }}
            />
          </div>
        </div>
      </div>

      {/* Caution */}
      {diag.caution && (
        <div className="rounded-xl border border-yellow-500/30 bg-yellow-500/5 p-4">
          <h2 className="text-xs font-semibold text-yellow-400 uppercase tracking-wide mb-2 flex items-center gap-2">
            <AlertTriangle className="w-3.5 h-3.5" />
            Attention
          </h2>
          <p className="text-sm text-yellow-300/80">{diag.caution}</p>
        </div>
      )}

      {/* Steps */}
      <div className="space-y-3">
        <h2 className="text-sm font-semibold text-slate-300">Étapes de diagnostic</h2>
        {diag.steps.map((step) => {
          const isCompleted = completedSteps.has(step.stepNumber);
          const isExpanded = expandedStep === step.stepNumber;

          return (
            <div
              key={step.stepNumber}
              className={clsx(
                'rounded-xl border transition-all',
                isCompleted
                  ? 'border-green-500/30 bg-green-500/5'
                  : 'border-surface-600 bg-surface-800'
              )}
            >
              {/* Step header */}
              <div
                className="flex items-center gap-3 p-4 cursor-pointer"
                onClick={() => setExpandedStep(isExpanded ? null : step.stepNumber)}
              >
                <button
                  onClick={(e) => { e.stopPropagation(); toggleStep(step.stepNumber); }}
                  className="flex-shrink-0"
                >
                  {isCompleted ? (
                    <CheckCircle2 className="w-5 h-5 text-green-400" />
                  ) : (
                    <Circle className="w-5 h-5 text-slate-500 hover:text-accent" />
                  )}
                </button>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-slate-500 font-mono">#{step.stepNumber}</span>
                    <span className={clsx('text-sm font-medium', isCompleted ? 'text-green-400 line-through' : 'text-slate-200')}>
                      {step.title}
                    </span>
                  </div>
                </div>
                {isExpanded ? (
                  <ChevronUp className="w-4 h-4 text-slate-500" />
                ) : (
                  <ChevronDown className="w-4 h-4 text-slate-500" />
                )}
              </div>

              {/* Step body */}
              {isExpanded && (
                <div className="px-4 pb-4 pt-0 space-y-3 border-t border-surface-600/50">
                  <p className="text-sm text-slate-300 pt-3">{step.description}</p>

                  {step.commands && step.commands.length > 0 && (
                    <div className="space-y-2">
                      <p className="text-xs font-medium text-slate-400 flex items-center gap-1.5">
                        <Terminal className="w-3.5 h-3.5" />
                        Commandes
                      </p>
                      {step.commands.map((cmd, i) => (
                        <div key={i} className="flex items-center gap-2 bg-surface-900 rounded-lg px-3 py-2">
                          <code className="flex-1 text-xs font-mono text-accent truncate">{cmd}</code>
                          <CopyCommandButton text={cmd} />
                        </div>
                      ))}
                    </div>
                  )}

                  {step.checkpoints && step.checkpoints.length > 0 && (
                    <div>
                      <p className="text-xs font-medium text-slate-400 mb-1.5">Points de contrôle</p>
                      <ul className="space-y-1">
                        {step.checkpoints.map((cp, i) => (
                          <li key={i} className="flex items-start gap-2 text-xs text-slate-400">
                            <span className="text-accent mt-0.5">✓</span>
                            {cp}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {step.tip && (
                    <div className="flex items-start gap-2 p-3 rounded-lg bg-accent/5 border border-accent/20">
                      <Info className="w-3.5 h-3.5 text-accent flex-shrink-0 mt-0.5" />
                      <p className="text-xs text-slate-300">{step.tip}</p>
                    </div>
                  )}

                  {step.warning && (
                    <div className="flex items-start gap-2 p-3 rounded-lg bg-yellow-500/5 border border-yellow-500/20">
                      <AlertTriangle className="w-3.5 h-3.5 text-yellow-400 flex-shrink-0 mt-0.5" />
                      <p className="text-xs text-yellow-300/80">{step.warning}</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Probable causes */}
      <div className="rounded-xl border border-surface-600 bg-surface-800 p-4">
        <h2 className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-3">Causes probables</h2>
        <ul className="space-y-1.5">
          {diag.probableCauses.map((cause, i) => (
            <li key={i} className="flex items-start gap-2 text-sm text-slate-300">
              <span className="text-red-400/70 mt-0.5">→</span>
              {cause}
            </li>
          ))}
        </ul>
      </div>

      {/* Best practices */}
      <div className="rounded-xl border border-surface-600 bg-surface-800 p-4">
        <h2 className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-3">Bonnes pratiques</h2>
        <ul className="space-y-1.5">
          {diag.bestPractices.map((bp, i) => (
            <li key={i} className="flex items-start gap-2 text-sm text-slate-300">
              <span className="text-green-400/70 mt-0.5">✓</span>
              {bp}
            </li>
          ))}
        </ul>
      </div>

      {/* Variants */}
      {diag.variants && diag.variants.length > 0 && (
        <div className="rounded-xl border border-surface-600 bg-surface-800 p-4">
          <h2 className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-3">Variantes / Cas particuliers</h2>
          <ul className="space-y-1.5">
            {diag.variants.map((v, i) => (
              <li key={i} className="flex items-start gap-2 text-sm text-slate-300">
                <span className="text-violet-400/70 mt-0.5">◆</span>
                {v}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

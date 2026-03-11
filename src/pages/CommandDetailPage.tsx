import { useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  AlertTriangle,
  Info,
  Tag,
  Wrench,
  BookOpen,
  Stethoscope,
} from 'lucide-react';
import { getCommandById, getCategoryById, getCategoryColor, getLevelColor, getLevelLabel, getToolColor } from '../utils';
import { useHistoryStore } from '../store';
import { CopyCommandButton } from '../components/ui/CopyCommandButton';
import { FavoriteButton } from '../components/ui/FavoriteButton';
import { Badge } from '../components/ui/Badge';
import { clsx } from 'clsx';
import { commands } from '../data/commands';
import { CommandCard } from '../components/CommandCard';

export function CommandDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const cmd = id ? getCommandById(id) : undefined;
  const { addEntry } = useHistoryStore();

  useEffect(() => {
    if (cmd) {
      addEntry({ type: 'command', id: cmd.id, title: cmd.title });
    }
  }, [cmd?.id]);

  if (!cmd) {
    return (
      <div className="text-center py-20">
        <p className="text-slate-400">Commande introuvable.</p>
        <button onClick={() => navigate(-1)} className="mt-4 text-accent text-sm hover:underline">
          Retour
        </button>
      </div>
    );
  }

  const category = getCategoryById(cmd.category);

  const relatedCommands = cmd.relatedDiagnostics
    ? commands.filter((c) => c.category === cmd.category && c.id !== cmd.id).slice(0, 3)
    : [];

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Back */}
      <Link
        to="/commands"
        className="inline-flex items-center gap-2 text-sm text-slate-400 hover:text-accent transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        Base de commandes
      </Link>

      {/* Header card */}
      <div className="rounded-2xl border border-surface-600 bg-surface-800 p-6">
        <div className="flex items-start justify-between gap-3 mb-4">
          <div>
            <h1 className="text-lg font-bold text-white leading-snug">{cmd.title}</h1>
            <div className="flex flex-wrap gap-2 mt-2">
              {category && (
                <Badge className={clsx('border', getCategoryColor(category.color))}>
                  {category.label}
                </Badge>
              )}
              <Badge className={clsx('border', getToolColor(cmd.tool))}>{cmd.tool}</Badge>
              <Badge className={clsx('border', getLevelColor(cmd.level))}>
                {getLevelLabel(cmd.level)}
              </Badge>
            </div>
          </div>
          <FavoriteButton type="commands" id={cmd.id} className="flex-shrink-0" />
        </div>

        {/* Command block */}
        <div className="rounded-xl bg-surface-900 border border-surface-600 p-4 mb-4">
          <div className="flex items-center justify-between gap-2 mb-2">
            <span className="text-xs text-slate-500 font-medium uppercase tracking-wide">{cmd.tool}</span>
            <CopyCommandButton text={cmd.command} size="md" />
          </div>
          <code className="block text-sm font-mono text-accent whitespace-pre-wrap break-all">
            {cmd.command}
          </code>
        </div>

        {/* Description */}
        <p className="text-sm text-slate-300 leading-relaxed">{cmd.description}</p>
      </div>

      {/* Field usage */}
      <div className="rounded-xl border border-surface-600 bg-surface-800 p-4">
        <h2 className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-2 flex items-center gap-2">
          <Wrench className="w-3.5 h-3.5" />
          Utilisation terrain
        </h2>
        <p className="text-sm text-slate-300">{cmd.fieldUsage}</p>
      </div>

      {/* Use cases */}
      {cmd.useCases.length > 0 && (
        <div className="rounded-xl border border-surface-600 bg-surface-800 p-4">
          <h2 className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-3 flex items-center gap-2">
            <BookOpen className="w-3.5 h-3.5" />
            Cas d'usage
          </h2>
          <ul className="space-y-2">
            {cmd.useCases.map((uc, i) => (
              <li key={i} className="flex items-start gap-2 text-sm text-slate-300">
                <span className="w-4 h-4 rounded-full bg-accent/20 border border-accent/30 text-accent text-xs flex items-center justify-center flex-shrink-0 mt-0.5">
                  {i + 1}
                </span>
                {uc}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Examples */}
      {cmd.examples && cmd.examples.length > 0 && (
        <div className="rounded-xl border border-surface-600 bg-surface-800 p-4">
          <h2 className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-3">
            Exemples
          </h2>
          <div className="space-y-3">
            {cmd.examples.map((ex, i) => (
              <div key={i} className="rounded-lg bg-surface-900 border border-surface-600 p-3">
                <div className="flex items-center justify-between gap-2 mb-1">
                  <span className="text-xs text-slate-400">{ex.label}</span>
                  <CopyCommandButton text={ex.command} />
                </div>
                <code className="text-xs font-mono text-accent block">{ex.command}</code>
                {ex.description && (
                  <p className="text-xs text-slate-500 mt-1">{ex.description}</p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Notes */}
      {cmd.notes && (
        <div className="rounded-xl border border-accent/20 bg-accent/5 p-4">
          <h2 className="text-xs font-semibold text-accent uppercase tracking-wide mb-2 flex items-center gap-2">
            <Info className="w-3.5 h-3.5" />
            Conseils terrain
          </h2>
          <p className="text-sm text-slate-300">{cmd.notes}</p>
        </div>
      )}

      {/* Warning */}
      {cmd.warning && (
        <div className="rounded-xl border border-yellow-500/30 bg-yellow-500/5 p-4">
          <h2 className="text-xs font-semibold text-yellow-400 uppercase tracking-wide mb-2 flex items-center gap-2">
            <AlertTriangle className="w-3.5 h-3.5" />
            Avertissement
          </h2>
          <p className="text-sm text-yellow-300/80">{cmd.warning}</p>
        </div>
      )}

      {/* Tags */}
      {cmd.tags.length > 0 && (
        <div className="flex flex-wrap gap-1.5 items-center">
          <Tag className="w-3.5 h-3.5 text-slate-500" />
          {cmd.tags.map((tag) => (
            <Badge key={tag} className="bg-surface-700 border-surface-600 text-slate-400">
              {tag}
            </Badge>
          ))}
        </div>
      )}

      {/* Related */}
      {relatedCommands.length > 0 && (
        <div>
          <h2 className="text-sm font-semibold text-slate-300 mb-3 flex items-center gap-2">
            <Stethoscope className="w-4 h-4 text-slate-500" />
            Commandes similaires
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {relatedCommands.map((c) => (
              <CommandCard key={c.id} command={c} compact />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

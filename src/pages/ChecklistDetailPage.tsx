import { useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, RotateCcw, Info } from 'lucide-react';
import { getChecklistById, getCategoryById, getCategoryColor } from '../utils';
import { useHistoryStore, useChecklistStore } from '../store';
import { FavoriteButton } from '../components/ui/FavoriteButton';
import { CopyCommandButton } from '../components/ui/CopyCommandButton';
import { Badge } from '../components/ui/Badge';
import { clsx } from 'clsx';

export function ChecklistDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const checklist = id ? getChecklistById(id) : undefined;
  const { addEntry } = useHistoryStore();
  const { toggleItem, isChecked, resetChecklist, progress } = useChecklistStore();

  useEffect(() => {
    if (checklist) addEntry({ type: 'checklist', id: checklist.id, title: checklist.title });
  }, [checklist?.id]);

  if (!checklist) {
    return (
      <div className="text-center py-20">
        <p className="text-slate-400">Checklist introuvable.</p>
        <button onClick={() => navigate(-1)} className="mt-4 text-accent text-sm hover:underline">Retour</button>
      </div>
    );
  }

  const category = getCategoryById(checklist.category);
  const p = progress[checklist.id];
  const totalItems = checklist.sections.reduce((acc, s) => acc + s.items.length, 0);
  const checkedItems = p ? Object.values(p.checkedItems).filter(Boolean).length : 0;
  const progressPct = totalItems > 0 ? Math.round((checkedItems / totalItems) * 100) : 0;

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <Link to="/checklists" className="inline-flex items-center gap-2 text-sm text-slate-400 hover:text-accent">
        <ArrowLeft className="w-4 h-4" />
        Checklists
      </Link>

      {/* Header */}
      <div className="rounded-2xl border border-surface-600 bg-surface-800 p-6">
        <div className="flex items-start justify-between gap-3 mb-4">
          <div className="flex-1">
            <h1 className="text-lg font-bold text-white mb-2">{checklist.title}</h1>
            <div className="flex flex-wrap gap-2 mb-2">
              {category && (
                <Badge className={clsx('border', getCategoryColor(category.color))}>{category.label}</Badge>
              )}
              {checklist.estimatedTime && (
                <span className="text-xs text-slate-500">{checklist.estimatedTime}</span>
              )}
            </div>
            <p className="text-sm text-slate-300">{checklist.description}</p>
          </div>
          <FavoriteButton type="checklists" id={checklist.id} />
        </div>

        {/* Progress */}
        <div>
          <div className="flex items-center justify-between text-xs text-slate-500 mb-1.5">
            <span>
              {progressPct === 100 ? (
                <span className="text-green-400 font-medium">✓ Checklist complète !</span>
              ) : (
                `${checkedItems}/${totalItems} points validés`
              )}
            </span>
            {checkedItems > 0 && (
              <button
                onClick={() => resetChecklist(checklist.id)}
                className="flex items-center gap-1 text-slate-500 hover:text-red-400 transition-colors"
              >
                <RotateCcw className="w-3 h-3" />
                Réinitialiser
              </button>
            )}
          </div>
          <div className="h-2 bg-surface-600 rounded-full overflow-hidden">
            <div
              className={clsx('h-full rounded-full transition-all duration-500', progressPct === 100 ? 'bg-green-500' : 'bg-accent')}
              style={{ width: `${progressPct}%` }}
            />
          </div>
        </div>
      </div>

      {/* Sections */}
      {checklist.sections.map((section) => (
        <div key={section.id} className="rounded-xl border border-surface-600 bg-surface-800 overflow-hidden">
          <div className="px-4 py-3 bg-surface-700 border-b border-surface-600">
            <h2 className="text-sm font-semibold text-slate-200">{section.title}</h2>
          </div>
          <div className="divide-y divide-surface-600/50">
            {section.items.map((item) => {
              const checked = isChecked(checklist.id, item.id);
              return (
                <div
                  key={item.id}
                  className={clsx(
                    'flex items-start gap-3 px-4 py-3 cursor-pointer transition-colors',
                    checked ? 'bg-green-500/5 hover:bg-green-500/10' : 'hover:bg-surface-700'
                  )}
                  onClick={() => toggleItem(checklist.id, item.id)}
                >
                  {/* Checkbox */}
                  <div className={clsx(
                    'flex-shrink-0 w-5 h-5 rounded border-2 flex items-center justify-center mt-0.5 transition-all',
                    checked ? 'bg-green-500 border-green-500' : 'border-slate-500 hover:border-accent'
                  )}>
                    {checked && (
                      <svg className="w-3 h-3 text-white" viewBox="0 0 12 12" fill="currentColor">
                        <path d="M10 3L5 8.5 2 5.5" stroke="white" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className={clsx('text-sm', checked ? 'text-slate-500 line-through' : 'text-slate-200')}>
                        {item.label}
                      </span>
                      {item.critical && !checked && (
                        <span className="text-xs text-red-400 bg-red-400/10 border border-red-400/20 px-1.5 py-0.5 rounded">
                          Critique
                        </span>
                      )}
                    </div>
                    {item.description && (
                      <p className="text-xs text-slate-500 mt-0.5">{item.description}</p>
                    )}
                    {item.command && (
                      <div
                        className="flex items-center gap-2 mt-1.5 bg-surface-900 rounded-lg px-2.5 py-1.5"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <code className="flex-1 text-xs font-mono text-accent truncate">{item.command}</code>
                        <CopyCommandButton text={item.command} />
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ))}

      {checklist.notes && (
        <div className="flex items-start gap-3 p-4 rounded-xl bg-accent/5 border border-accent/20">
          <Info className="w-4 h-4 text-accent flex-shrink-0 mt-0.5" />
          <p className="text-sm text-slate-300">{checklist.notes}</p>
        </div>
      )}
    </div>
  );
}

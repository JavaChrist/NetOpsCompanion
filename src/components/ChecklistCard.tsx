import { Link } from 'react-router-dom';
import { clsx } from 'clsx';
import { Clock, CheckSquare } from 'lucide-react';
import type { ChecklistTemplate } from '../types';
import { getCategoryById, getCategoryColor } from '../utils';
import { useChecklistStore } from '../store';
import { FavoriteButton } from './ui/FavoriteButton';
import { Badge } from './ui/Badge';

interface ChecklistCardProps {
  checklist: ChecklistTemplate;
}

export function ChecklistCard({ checklist }: ChecklistCardProps) {
  const category = getCategoryById(checklist.category);
  const { progress } = useChecklistStore();
  const p = progress[checklist.id];

    const totalItems = checklist.sections.reduce((acc: number, s: typeof checklist.sections[0]) => acc + s.items.length, 0);
  const checkedItems = p
    ? Object.values(p.checkedItems).filter(Boolean).length
    : 0;
  const progressPct = totalItems > 0 ? Math.round((checkedItems / totalItems) * 100) : 0;

  return (
    <Link
      to={`/checklists/${checklist.id}`}
      className={clsx(
        'group block rounded-xl border border-surface-600 bg-surface-800 p-4',
        'hover:border-accent/40 hover:bg-surface-700 transition-all duration-150'
      )}
    >
      <div className="flex items-start justify-between gap-2 mb-2">
        <div className="flex-1 min-w-0">
          <h3 className="text-sm font-medium text-slate-200 group-hover:text-accent leading-snug">
            {checklist.title}
          </h3>
        </div>
        <FavoriteButton type="checklists" id={checklist.id} />
      </div>

      <p className="text-xs text-slate-400 mb-3 line-clamp-2">{checklist.description}</p>

      {/* Progress bar */}
      {checkedItems > 0 && (
        <div className="mb-3">
          <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
            <span>Progression</span>
            <span>{checkedItems}/{totalItems}</span>
          </div>
          <div className="h-1.5 bg-surface-600 rounded-full overflow-hidden">
            <div
              className={clsx(
                'h-full rounded-full transition-all',
                progressPct === 100 ? 'bg-green-500' : 'bg-accent'
              )}
              style={{ width: `${progressPct}%` }}
            />
          </div>
        </div>
      )}

      <div className="flex flex-wrap items-center gap-2">
        {category && (
          <Badge className={clsx('border', getCategoryColor(category.color))}>
            {category.label}
          </Badge>
        )}
        <div className="ml-auto flex items-center gap-3 text-xs text-slate-500">
          {checklist.estimatedTime && (
            <span className="flex items-center gap-1">
              <Clock className="w-3 h-3" />
              {checklist.estimatedTime}
            </span>
          )}
          <span className="flex items-center gap-1">
            <CheckSquare className="w-3 h-3" />
            {totalItems} points
          </span>
        </div>
      </div>
    </Link>
  );
}

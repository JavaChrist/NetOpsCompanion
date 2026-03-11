import { Link } from 'react-router-dom';
import { clsx } from 'clsx';
import { Clock, ChevronRight } from 'lucide-react';
import type { DiagnosticGuide } from '../types';
import { getCategoryById, getCategoryColor, getLevelColor, getLevelLabel } from '../utils';
import { FavoriteButton } from './ui/FavoriteButton';
import { Badge } from './ui/Badge';

interface DiagnosticCardProps {
  diagnostic: DiagnosticGuide;
}

export function DiagnosticCard({ diagnostic }: DiagnosticCardProps) {
  const category = getCategoryById(diagnostic.category);

  return (
    <Link
      to={`/diagnostics/${diagnostic.id}`}
      className={clsx(
        'group block rounded-xl border border-surface-600 bg-surface-800 p-4',
        'hover:border-accent/40 hover:bg-surface-700 transition-all duration-150'
      )}
    >
      <div className="flex items-start justify-between gap-2 mb-2">
        <div className="flex-1 min-w-0">
          <h3 className="text-sm font-medium text-slate-200 group-hover:text-accent leading-snug">
            {diagnostic.title}
          </h3>
        </div>
        <FavoriteButton type="diagnostics" id={diagnostic.id} />
      </div>

      <p className="text-xs text-slate-400 mb-3 line-clamp-2">{diagnostic.problemSummary}</p>

      <div className="flex flex-wrap items-center gap-2">
        {category && (
          <Badge className={clsx('border', getCategoryColor(category.color))}>
            {category.label}
          </Badge>
        )}
        <Badge className={clsx('border', getLevelColor(diagnostic.level))}>
          {getLevelLabel(diagnostic.level)}
        </Badge>

        <div className="ml-auto flex items-center gap-3 text-xs text-slate-500">
          {diagnostic.estimatedTime && (
            <span className="flex items-center gap-1">
              <Clock className="w-3 h-3" />
              {diagnostic.estimatedTime}
            </span>
          )}
          <span className="flex items-center gap-1">
            {diagnostic.steps.length} étapes
            <ChevronRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
          </span>
        </div>
      </div>
    </Link>
  );
}

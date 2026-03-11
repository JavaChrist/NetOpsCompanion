import { Link } from 'react-router-dom';
import { clsx } from 'clsx';
import type { Category } from '../types';
import { getCategoryColor, countCommandsByCategory } from '../utils';
import {
  Network,
  ArrowRightLeft,
  Globe,
  Radar,
  ScanSearch,
  Cpu,
  Camera,
  Plug,
  Activity,
  Shield,
  Wrench,
  Radio,
} from 'lucide-react';

const iconMap: Record<string, React.ElementType> = {
  Network,
  ArrowRightLeft,
  Globe,
  Radar,
  ScanSearch,
  Cpu,
  Camera,
  Broadcast: Radio,
  Plug,
  Activity,
  Shield,
  Wrench,
};

interface CategoryCardProps {
  category: Category;
  href?: string;
}

export function CategoryCard({ category, href }: CategoryCardProps) {
  const Icon = iconMap[category.icon] ?? Network;
  const counts = countCommandsByCategory();
  const count = counts[category.id] ?? 0;

  const colorClasses = getCategoryColor(category.color);

  const inner = (
    <div
      className={clsx(
        'group flex items-start gap-3 rounded-xl border p-4',
        'bg-surface-800 hover:bg-surface-700 transition-all duration-150',
        'border-surface-600 hover:border-opacity-60',
        `hover:border-[currentColor]`
      )}
    >
      <div className={clsx('p-2 rounded-lg border', colorClasses, 'flex-shrink-0')}>
        <Icon className="w-4 h-4" />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between gap-2">
          <h3 className="text-sm font-medium text-slate-200 group-hover:text-white truncate">
            {category.label}
          </h3>
          {count > 0 && (
            <span className="text-xs text-slate-500 flex-shrink-0">{count}</span>
          )}
        </div>
        <p className="text-xs text-slate-500 mt-0.5 line-clamp-1">{category.description}</p>
      </div>
    </div>
  );

  if (href) {
    return <Link to={href}>{inner}</Link>;
  }

  return inner;
}

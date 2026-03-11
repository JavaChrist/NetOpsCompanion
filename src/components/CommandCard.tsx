import { Link } from 'react-router-dom';
import { clsx } from 'clsx';
import type { CommandEntry } from '../types';
import { getCategoryById, getCategoryColor, getLevelColor, getLevelLabel, getToolColor } from '../utils';
import { CopyCommandButton } from './ui/CopyCommandButton';
import { FavoriteButton } from './ui/FavoriteButton';
import { Badge } from './ui/Badge';

interface CommandCardProps {
  command: CommandEntry;
  compact?: boolean;
}

export function CommandCard({ command, compact = false }: CommandCardProps) {
  const category = getCategoryById(command.category);

  return (
    <Link
      to={`/commands/${command.id}`}
      className={clsx(
        'group block rounded-xl border border-surface-600 bg-surface-800',
        'hover:border-accent/40 hover:bg-surface-700',
        'transition-all duration-150',
        compact ? 'p-3' : 'p-4'
      )}
    >
      <div className="flex items-start justify-between gap-2 mb-2">
        <div className="flex-1 min-w-0">
          <h3 className="text-sm font-medium text-slate-200 group-hover:text-accent truncate">
            {command.title}
          </h3>
          {!compact && (
            <p className="text-xs text-slate-500 mt-0.5 line-clamp-2">{command.description}</p>
          )}
        </div>
        <FavoriteButton type="commands" id={command.id} />
      </div>

      {/* Command code block */}
      <div className="flex items-center gap-2 bg-surface-900 rounded-lg px-3 py-2 mb-3 group/cmd">
        <code className="flex-1 text-xs font-mono text-accent truncate">{command.command}</code>
        <CopyCommandButton text={command.command} />
      </div>

      {/* Badges */}
      <div className="flex flex-wrap gap-1.5">
        {category && (
          <Badge className={clsx('border', getCategoryColor(category.color))}>
            {category.label}
          </Badge>
        )}
        <Badge className={clsx('border', getToolColor(command.tool))}>{command.tool}</Badge>
        <Badge className={clsx('border', getLevelColor(command.level))}>
          {getLevelLabel(command.level)}
        </Badge>
      </div>
    </Link>
  );
}

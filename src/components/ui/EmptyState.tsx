import { SearchX } from 'lucide-react';

interface EmptyStateProps {
  title?: string;
  description?: string;
  icon?: React.ReactNode;
}

export function EmptyState({
  title = 'Aucun résultat',
  description = 'Essayez de modifier votre recherche ou vos filtres.',
  icon,
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <div className="text-slate-600 mb-4">
        {icon ?? <SearchX className="w-12 h-12" />}
      </div>
      <h3 className="text-slate-400 font-medium mb-1">{title}</h3>
      <p className="text-slate-500 text-sm max-w-xs">{description}</p>
    </div>
  );
}

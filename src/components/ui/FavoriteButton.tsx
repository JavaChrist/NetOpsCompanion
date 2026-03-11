import { Star } from 'lucide-react';
import { useFavoritesStore } from '../../store';
import { clsx } from 'clsx';

interface FavoriteButtonProps {
  type: 'commands' | 'diagnostics' | 'checklists';
  id: string;
  className?: string;
}

export function FavoriteButton({ type, id, className }: FavoriteButtonProps) {
  const { isFavorite, toggleFavorite } = useFavoritesStore();
  const fav = isFavorite(type, id);

  return (
    <button
      onClick={(e) => {
        e.stopPropagation();
        e.preventDefault();
        toggleFavorite(type, id);
      }}
      title={fav ? 'Retirer des favoris' : 'Ajouter aux favoris'}
      className={clsx(
        'p-1.5 rounded transition-all',
        fav
          ? 'text-yellow-400 hover:text-yellow-300'
          : 'text-slate-500 hover:text-yellow-400',
        className
      )}
    >
      <Star className={clsx('w-4 h-4', fav && 'fill-current')} />
    </button>
  );
}

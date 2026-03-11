import { Menu, Bell } from 'lucide-react';
import { SearchBar } from '../SearchBar';
import { useLocation } from 'react-router-dom';

const pageLabels: Record<string, string> = {
  '/': 'Dashboard',
  '/commands': 'Base de commandes',
  '/diagnostics': 'Diagnostics guidés',
  '/checklists': 'Checklists terrain',
  '/favorites': 'Favoris',
  '/history': 'Historique',
  '/settings': 'Paramètres',
};

interface TopbarProps {
  onMenuClick: () => void;
}

export function Topbar({ onMenuClick }: TopbarProps) {
  const location = useLocation();
  const pathBase = '/' + location.pathname.split('/')[1];
  const label = pageLabels[pathBase] ?? 'NetOps Companion';

  return (
    <header className="sticky top-0 z-30 flex items-center gap-3 px-4 py-3 border-b border-surface-600 bg-surface-900/90 backdrop-blur-sm">
      <button
        onClick={onMenuClick}
        className="lg:hidden p-2 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-surface-700"
      >
        <Menu className="w-5 h-5" />
      </button>

      <h1 className="text-sm font-medium text-slate-300 hidden sm:block flex-shrink-0">
        {label}
      </h1>

      <div className="flex-1">
        <SearchBar className="w-full max-w-2xl mx-auto" />
      </div>

      <button className="p-2 rounded-lg text-slate-500 hover:text-slate-300 hover:bg-surface-700 flex-shrink-0">
        <Bell className="w-4 h-4" />
      </button>
    </header>
  );
}

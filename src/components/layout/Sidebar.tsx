import { NavLink, useLocation } from 'react-router-dom';
import { clsx } from 'clsx';
import {
  LayoutDashboard,
  Terminal,
  Stethoscope,
  CheckSquare,
  Star,
  History,
  Settings,
  X,
} from 'lucide-react';

const navItems = [
  { to: '/', icon: LayoutDashboard, label: 'Dashboard', exact: true },
  { to: '/commands', icon: Terminal, label: 'Commandes' },
  { to: '/diagnostics', icon: Stethoscope, label: 'Diagnostics' },
  { to: '/checklists', icon: CheckSquare, label: 'Checklists' },
  { to: '/favorites', icon: Star, label: 'Favoris' },
  { to: '/history', icon: History, label: 'Historique' },
];

const bottomItems = [
  { to: '/settings', icon: Settings, label: 'Paramètres' },
];

interface SidebarProps {
  open: boolean;
  onClose: () => void;
}

export function Sidebar({ open, onClose }: SidebarProps) {
  const location = useLocation();

  const isActive = (to: string, exact?: boolean) => {
    if (exact) return location.pathname === to;
    return location.pathname.startsWith(to);
  };

  return (
    <>
      {/* Mobile overlay */}
      {open && (
        <div
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside
        className={clsx(
          'fixed top-0 left-0 z-50 h-full w-64 flex flex-col',
          'bg-surface-800 border-r border-surface-600',
          'transition-transform duration-200 ease-in-out',
          'lg:relative lg:translate-x-0 lg:z-auto lg:h-full lg:w-full',
          open ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        {/* Logo */}
        <div className="flex items-center justify-between px-2 py-3 safe-pt border-b border-surface-600">
          <div className="flex items-center gap-3">
            <div className="p-1.5 rounded-lg bg-accent/20 border border-accent/30 flex-shrink-0">
              <img src="/icons/logo48.png" alt="NetOps" className="w-6 h-6" />
            </div>
            <div>
              <span className="text-sm font-semibold text-white">NetOps</span>
              <span className="text-sm font-semibold text-accent"> Companion</span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="lg:hidden p-1 rounded text-slate-500 hover:text-slate-300"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
          {navItems.map(({ to, icon: Icon, label, exact }) => (
            <NavLink
              key={to}
              to={to}
              end={exact}
              onClick={onClose}
              className={({ isActive: navActive }) =>
                clsx(
                  'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all',
                  navActive || (!exact && isActive(to))
                    ? 'bg-accent/15 text-accent font-medium'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-surface-700'
                )
              }
            >
              <Icon className="w-4 h-4 flex-shrink-0" />
              {label}
            </NavLink>
          ))}
        </nav>

        {/* Bottom */}
        <div className="px-3 py-3 safe-pb border-t border-surface-600 space-y-0.5">
          {bottomItems.map(({ to, icon: Icon, label }) => (
            <NavLink
              key={to}
              to={to}
              onClick={onClose}
              className={({ isActive: navActive }) =>
                clsx(
                  'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all',
                  navActive
                    ? 'bg-accent/15 text-accent font-medium'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-surface-700'
                )
              }
            >
              <Icon className="w-4 h-4 flex-shrink-0" />
              {label}
            </NavLink>
          ))}
          <div className="px-3 py-2 text-xs text-slate-600">
            v1.0.0 · NetOps Companion
          </div>
        </div>
      </aside>
    </>
  );
}

import { Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';

interface Crumb {
  label: string;
  to?: string;
}

interface GenetecBreadcrumbProps {
  crumbs: Crumb[];
}

export function GenetecBreadcrumb({ crumbs }: GenetecBreadcrumbProps) {
  return (
    <nav className="flex items-center gap-1.5 text-xs mb-1">
      <Link to="/genetec" className="text-slate-500 hover:text-accent transition-colors">
        Genetec
      </Link>
      {crumbs.map((crumb, i) => (
        <span key={i} className="flex items-center gap-1.5">
          <ChevronRight className="w-3 h-3 text-slate-600 flex-shrink-0" />
          {crumb.to ? (
            <Link to={crumb.to} className="text-slate-500 hover:text-accent transition-colors">
              {crumb.label}
            </Link>
          ) : (
            <span className="text-accent">{crumb.label}</span>
          )}
        </span>
      ))}
    </nav>
  );
}

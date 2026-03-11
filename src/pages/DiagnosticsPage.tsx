import { useState } from 'react';
import { Stethoscope, Filter, X } from 'lucide-react';
import { useDiagnosticSearch } from '../hooks/useSearch';
import { DiagnosticCard } from '../components/DiagnosticCard';
import { FilterPanel } from '../components/FilterPanel';
import { EmptyState } from '../components/ui/EmptyState';
import { clsx } from 'clsx';

export function DiagnosticsPage() {
  const [query, setQuery] = useState('');
  const [filters, setFilters] = useState({ category: undefined as string | undefined, level: undefined as string | undefined });
  const [showFilters, setShowFilters] = useState(false);

  const results = useDiagnosticSearch(query, filters);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-white flex items-center gap-2">
            <Stethoscope className="w-5 h-5 text-accent" />
            Diagnostics guidés
          </h1>
          <p className="text-sm text-slate-400 mt-0.5">
            Procédures étape par étape pour résoudre les problèmes terrain
          </p>
        </div>
        <button
          onClick={() => setShowFilters((v) => !v)}
          className={clsx(
            'flex items-center gap-2 px-3 py-2 rounded-lg border text-sm',
            showFilters
              ? 'bg-accent/15 border-accent/50 text-accent'
              : 'bg-surface-700 border-surface-600 text-slate-400'
          )}
        >
          <Filter className="w-4 h-4" />
          Filtres
        </button>
      </div>

      <div className="relative">
        <Stethoscope className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Rechercher un problème, symptôme, équipement…"
          className="w-full pl-9 pr-9 py-2.5 bg-surface-700 border border-surface-600 rounded-xl text-sm text-slate-200 placeholder-slate-500 outline-none focus:border-accent/50"
        />
        {query && (
          <button onClick={() => setQuery('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500">
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {showFilters && (
        <FilterPanel
          filters={filters}
          onFilterChange={(k, v) => setFilters((f) => ({ ...f, [k]: v }))}
          showTools={false}
        />
      )}

      {results.length === 0 ? (
        <EmptyState title="Aucun diagnostic trouvé" />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {results.map((d) => (
            <DiagnosticCard key={d.id} diagnostic={d} />
          ))}
        </div>
      )}
    </div>
  );
}

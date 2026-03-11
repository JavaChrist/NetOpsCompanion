import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Filter, Terminal, X } from 'lucide-react';
import { categories } from '../data/categories';
import { useCommandSearch } from '../hooks/useSearch';
import { CommandCard } from '../components/CommandCard';
import { FilterPanel } from '../components/FilterPanel';
import { EmptyState } from '../components/ui/EmptyState';
import { clsx } from 'clsx';

export function CommandsPage() {
  const [searchParams] = useSearchParams();
  const [query, setQuery] = useState(searchParams.get('q') ?? '');
  const [filters, setFilters] = useState({
    category: searchParams.get('category') ?? undefined,
    level: undefined as string | undefined,
    tool: undefined as string | undefined,
  });
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    const q = searchParams.get('q');
    if (q) setQuery(q);
    const cat = searchParams.get('category');
    if (cat) setFilters((f) => ({ ...f, category: cat }));
  }, [searchParams]);

  const results = useCommandSearch(query, filters);

  const handleFilterChange = (key: string, value: string | undefined) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const activeFilterCount = Object.values(filters).filter(Boolean).length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-white flex items-center gap-2">
            <Terminal className="w-5 h-5 text-accent" />
            Base de commandes
          </h1>
          <p className="text-sm text-slate-400 mt-0.5">{results.length} commande{results.length !== 1 ? 's' : ''}</p>
        </div>
        <button
          onClick={() => setShowFilters((v) => !v)}
          className={clsx(
            'flex items-center gap-2 px-3 py-2 rounded-lg border text-sm transition-all',
            showFilters
              ? 'bg-accent/15 border-accent/50 text-accent'
              : 'bg-surface-700 border-surface-600 text-slate-400 hover:border-slate-500'
          )}
        >
          <Filter className="w-4 h-4" />
          Filtres
          {activeFilterCount > 0 && (
            <span className="w-4 h-4 rounded-full bg-accent text-surface-900 text-xs font-bold flex items-center justify-center">
              {activeFilterCount}
            </span>
          )}
        </button>
      </div>

      {/* Search input */}
      <div className="relative">
        <Terminal className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Rechercher par commande, tag, outil, protocole…"
          className="w-full pl-9 pr-9 py-2.5 bg-surface-700 border border-surface-600 rounded-xl text-sm text-slate-200 placeholder-slate-500 outline-none focus:border-accent/50"
        />
        {query && (
          <button
            onClick={() => setQuery('')}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      <div className="flex gap-6">
        {/* Filters panel - desktop */}
        {showFilters && (
          <div className="hidden lg:block w-56 flex-shrink-0">
            <FilterPanel filters={filters} onFilterChange={handleFilterChange} />
          </div>
        )}

        <div className="flex-1 min-w-0 space-y-6">
          {/* Filters panel - mobile */}
          {showFilters && (
            <div className="lg:hidden">
              <FilterPanel filters={filters} onFilterChange={handleFilterChange} />
            </div>
          )}

          {/* Category filter chips */}
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => handleFilterChange('category', undefined)}
              className={clsx(
                'px-3 py-1.5 rounded-lg text-xs border transition-all',
                !filters.category
                  ? 'bg-accent/15 border-accent/40 text-accent'
                  : 'bg-surface-700 border-surface-600 text-slate-400 hover:border-slate-500'
              )}
            >
              Toutes
            </button>
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => handleFilterChange('category', cat.id === filters.category ? undefined : cat.id)}
                className={clsx(
                  'px-3 py-1.5 rounded-lg text-xs border transition-all',
                  cat.id === filters.category
                    ? 'bg-accent/15 border-accent/40 text-accent'
                    : 'bg-surface-700 border-surface-600 text-slate-400 hover:border-slate-500'
                )}
              >
                {cat.label}
              </button>
            ))}
          </div>

          {/* Results */}
          {results.length === 0 ? (
            <EmptyState
              title="Aucune commande trouvée"
              description="Essayez d'autres mots-clés ou réinitialisez les filtres."
            />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3">
              {results.map((cmd) => (
                <CommandCard key={cmd.id} command={cmd} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

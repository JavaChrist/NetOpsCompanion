import { useState } from 'react';
import { CheckSquare, X } from 'lucide-react';
import { useChecklistSearch } from '../hooks/useSearch';
import { ChecklistCard } from '../components/ChecklistCard';
import { EmptyState } from '../components/ui/EmptyState';

export function ChecklistsPage() {
  const [query, setQuery] = useState('');
  const results = useChecklistSearch(query);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-bold text-white flex items-center gap-2">
          <CheckSquare className="w-5 h-5 text-accent" />
          Checklists terrain
        </h1>
        <p className="text-sm text-slate-400 mt-0.5">
          Procédures cochables pour mise en service, audit et dépannage
        </p>
      </div>

      <div className="relative">
        <CheckSquare className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Rechercher une checklist…"
          className="w-full pl-9 pr-9 py-2.5 bg-surface-700 border border-surface-600 rounded-xl text-sm text-slate-200 placeholder-slate-500 outline-none focus:border-accent/50"
        />
        {query && (
          <button onClick={() => setQuery('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500">
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {results.length === 0 ? (
        <EmptyState title="Aucune checklist trouvée" />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {results.map((cl) => (
            <ChecklistCard key={cl.id} checklist={cl} />
          ))}
        </div>
      )}
    </div>
  );
}

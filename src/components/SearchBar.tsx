import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Terminal, Stethoscope, CheckSquare, X } from 'lucide-react';
import { useGlobalSearch } from '../hooks/useSearch';
import { useHistoryStore } from '../store';
import { clsx } from 'clsx';

interface SearchBarProps {
  autoFocus?: boolean;
  className?: string;
}

export function SearchBar({ autoFocus, className }: SearchBarProps) {
  const [query, setQuery] = useState('');
  const [focused, setFocused] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();
  const { addEntry } = useHistoryStore();
  const results = useGlobalSearch(query);

  const showDropdown = focused && query.trim().length > 0;

  useEffect(() => {
    if (autoFocus) inputRef.current?.focus();
  }, [autoFocus]);

  const handleSelect = (type: string, id: string, title: string, path: string) => {
    addEntry({ type: type as 'command' | 'diagnostic' | 'checklist', id, title });
    setQuery('');
    setFocused(false);
    navigate(path);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      setQuery('');
      setFocused(false);
    }
    if (e.key === 'Enter' && query.trim()) {
      addEntry({ type: 'search', query, title: `Recherche : ${query}` });
      navigate(`/commands?q=${encodeURIComponent(query)}`);
      setFocused(false);
    }
  };

  return (
    <div className={clsx('relative', className)}>
      <div
        className={clsx(
          'flex items-center gap-2 rounded-xl border bg-surface-700 px-3 py-2',
          focused ? 'border-accent/60 bg-surface-600' : 'border-surface-500'
        )}
      >
        <Search className="w-4 h-4 text-slate-500 flex-shrink-0" />
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => setFocused(true)}
          onBlur={() => setTimeout(() => setFocused(false), 150)}
          onKeyDown={handleKeyDown}
          placeholder="Rechercher une commande, protocole, équipement…"
          className="flex-1 bg-transparent text-sm text-slate-200 placeholder-slate-500 outline-none"
        />
        {query && (
          <button onClick={() => setQuery('')} className="text-slate-500 hover:text-slate-300">
            <X className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      {/* Dropdown results */}
      {showDropdown && (
        <div className="absolute top-full mt-1 left-0 right-0 z-50 rounded-xl border border-surface-500 bg-surface-800 shadow-2xl overflow-hidden">
          {results.total === 0 ? (
            <div className="px-4 py-6 text-center text-sm text-slate-500">
              Aucun résultat pour « {query} »
            </div>
          ) : (
            <div className="max-h-96 overflow-y-auto">
              {results.commands.length > 0 && (
                <div>
                  <div className="px-3 py-2 text-xs font-medium text-slate-500 bg-surface-900 flex items-center gap-2">
                    <Terminal className="w-3 h-3" />
                    Commandes ({results.commands.length})
                  </div>
                  {results.commands.map((c) => (
                    <button
                      key={c.id}
                      onMouseDown={() => handleSelect('command', c.id, c.title, `/commands/${c.id}`)}
                      className="w-full flex items-start gap-3 px-3 py-2.5 hover:bg-surface-700 text-left"
                    >
                      <code className="text-xs font-mono text-accent mt-0.5 truncate max-w-[120px]">
                        {c.command}
                      </code>
                      <span className="text-sm text-slate-300 truncate">{c.title}</span>
                    </button>
                  ))}
                </div>
              )}
              {results.diagnostics.length > 0 && (
                <div>
                  <div className="px-3 py-2 text-xs font-medium text-slate-500 bg-surface-900 flex items-center gap-2">
                    <Stethoscope className="w-3 h-3" />
                    Diagnostics
                  </div>
                  {results.diagnostics.map((d) => (
                    <button
                      key={d.id}
                      onMouseDown={() => handleSelect('diagnostic', d.id, d.title, `/diagnostics/${d.id}`)}
                      className="w-full px-3 py-2.5 hover:bg-surface-700 text-left text-sm text-slate-300 truncate"
                    >
                      {d.title}
                    </button>
                  ))}
                </div>
              )}
              {results.checklists.length > 0 && (
                <div>
                  <div className="px-3 py-2 text-xs font-medium text-slate-500 bg-surface-900 flex items-center gap-2">
                    <CheckSquare className="w-3 h-3" />
                    Checklists
                  </div>
                  {results.checklists.map((cl) => (
                    <button
                      key={cl.id}
                      onMouseDown={() => handleSelect('checklist', cl.id, cl.title, `/checklists/${cl.id}`)}
                      className="w-full px-3 py-2.5 hover:bg-surface-700 text-left text-sm text-slate-300 truncate"
                    >
                      {cl.title}
                    </button>
                  ))}
                </div>
              )}
              <div className="px-3 py-2 border-t border-surface-600 text-xs text-slate-500">
                Appuyer sur <kbd className="px-1 py-0.5 rounded bg-surface-600 text-slate-300">↵</kbd> pour voir tous les résultats
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

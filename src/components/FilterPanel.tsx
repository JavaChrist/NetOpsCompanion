import { clsx } from 'clsx';

interface FilterOption {
  value: string;
  label: string;
  color?: string;
}

interface FilterGroupProps {
  label: string;
  options: FilterOption[];
  value?: string;
  onChange: (value: string | undefined) => void;
}

function FilterGroup({ label, options, value, onChange }: FilterGroupProps) {
  return (
    <div>
      <p className="text-xs font-medium text-slate-400 mb-2">{label}</p>
      <div className="flex flex-wrap gap-1.5">
        <button
          onClick={() => onChange(undefined)}
          className={clsx(
            'px-2.5 py-1 rounded-lg text-xs border transition-all',
            !value
              ? 'bg-accent/20 border-accent/50 text-accent'
              : 'bg-surface-600 border-surface-500 text-slate-400 hover:border-slate-400'
          )}
        >
          Tous
        </button>
        {options.map((opt) => (
          <button
            key={opt.value}
            onClick={() => onChange(opt.value === value ? undefined : opt.value)}
            className={clsx(
              'px-2.5 py-1 rounded-lg text-xs border transition-all',
              opt.value === value
                ? 'bg-accent/20 border-accent/50 text-accent'
                : 'bg-surface-600 border-surface-500 text-slate-400 hover:border-slate-400'
            )}
          >
            {opt.label}
          </button>
        ))}
      </div>
    </div>
  );
}

interface FilterPanelProps {
  filters: {
    category?: string;
    level?: string;
    tool?: string;
  };
  onFilterChange: (key: string, value: string | undefined) => void;
  showTools?: boolean;
}

const levelOptions: FilterOption[] = [
  { value: 'beginner', label: 'Débutant' },
  { value: 'intermediate', label: 'Intermédiaire' },
  { value: 'advanced', label: 'Avancé' },
];

const toolOptions: FilterOption[] = [
  { value: 'CMD', label: 'CMD' },
  { value: 'PowerShell', label: 'PowerShell' },
  { value: 'Nmap', label: 'Nmap' },
  { value: 'Wireshark', label: 'Wireshark' },
  { value: 'Terrain', label: 'Terrain' },
  { value: 'ONVIF', label: 'ONVIF' },
];

export function FilterPanel({ filters, onFilterChange, showTools = true }: FilterPanelProps) {
  return (
    <div className="rounded-xl border border-surface-600 bg-surface-800 p-4 space-y-4">
      <FilterGroup
        label="Niveau"
        options={levelOptions}
        value={filters.level}
        onChange={(v) => onFilterChange('level', v)}
      />
      {showTools && (
        <FilterGroup
          label="Outil"
          options={toolOptions}
          value={filters.tool}
          onChange={(v) => onFilterChange('tool', v)}
        />
      )}
    </div>
  );
}

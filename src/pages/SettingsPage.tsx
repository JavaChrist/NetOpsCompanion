import { Settings, Moon, Layout, Eye } from 'lucide-react';
import { useSettingsStore } from '../store';
import { clsx } from 'clsx';

interface ToggleProps {
  checked: boolean;
  onChange: (v: boolean) => void;
  label: string;
  description?: string;
  icon?: React.ReactNode;
}

function Toggle({ checked, onChange, label, description, icon }: ToggleProps) {
  return (
    <div className="flex items-center justify-between gap-4 py-3">
      <div className="flex items-start gap-3">
        {icon && <div className="mt-0.5 text-slate-400">{icon}</div>}
        <div>
          <p className="text-sm font-medium text-slate-200">{label}</p>
          {description && <p className="text-xs text-slate-500 mt-0.5">{description}</p>}
        </div>
      </div>
      <button
        onClick={() => onChange(!checked)}
        className={clsx(
          'relative w-10 h-5.5 rounded-full transition-colors flex-shrink-0',
          checked ? 'bg-accent' : 'bg-surface-500'
        )}
        style={{ height: '22px', width: '40px' }}
      >
        <span
          className={clsx(
            'absolute top-0.5 w-4 h-4 rounded-full bg-white transition-transform shadow',
            checked ? 'translate-x-5' : 'translate-x-0.5'
          )}
        />
      </button>
    </div>
  );
}

export function SettingsPage() {
  const { compactMode, showWelcome, update } = useSettingsStore();

  return (
    <div className="max-w-2xl space-y-6">
      <h1 className="text-xl font-bold text-white flex items-center gap-2">
        <Settings className="w-5 h-5 text-accent" />
        Paramètres
      </h1>

      <div className="rounded-xl border border-surface-600 bg-surface-800 overflow-hidden">
        <div className="px-4 py-3 bg-surface-700 border-b border-surface-600">
          <h2 className="text-sm font-semibold text-slate-300">Affichage</h2>
        </div>
        <div className="px-4 divide-y divide-surface-600/50">
          <Toggle
            checked={true}
            onChange={() => {}}
            label="Thème sombre"
            description="Le thème clair sera disponible dans une prochaine version"
            icon={<Moon className="w-4 h-4" />}
          />
          <Toggle
            checked={compactMode}
            onChange={(v) => update({ compactMode: v })}
            label="Mode compact"
            description="Réduire l'espacement pour afficher plus de contenu"
            icon={<Layout className="w-4 h-4" />}
          />
          <Toggle
            checked={showWelcome}
            onChange={(v) => update({ showWelcome: v })}
            label="Message de bienvenue"
            description="Afficher le message sur le dashboard"
            icon={<Eye className="w-4 h-4" />}
          />
        </div>
      </div>

      {/* Info */}
      <div className="rounded-xl border border-surface-600 bg-surface-800 p-4 space-y-3">
        <h2 className="text-sm font-semibold text-slate-300">À propos</h2>
        <div className="space-y-2 text-sm text-slate-400">
          <div className="flex justify-between">
            <span>Version</span>
            <span className="text-slate-300">1.0.0</span>
          </div>
          <div className="flex justify-between">
            <span>Mode</span>
            <span className="text-slate-300">PWA / Hors-ligne (partiel)</span>
          </div>
          <div className="flex justify-between">
            <span>Stack</span>
            <span className="text-slate-300">React + Vite + TailwindCSS</span>
          </div>
        </div>
      </div>

      <p className="text-xs text-slate-600 text-center">
        NetOps Companion — Assistant réseau & vidéosurveillance pour techniciens terrain
      </p>
    </div>
  );
}

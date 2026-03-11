import { Link } from 'react-router-dom';
import { Star, Terminal, Stethoscope, CheckSquare, Inbox } from 'lucide-react';
import { useFavoritesStore } from '../store';
import { getCommandById, getDiagnosticById, getChecklistById } from '../utils';
import { CommandCard } from '../components/CommandCard';
import { DiagnosticCard } from '../components/DiagnosticCard';
import { ChecklistCard } from '../components/ChecklistCard';

export function FavoritesPage() {
  const { commands: favCmds, diagnostics: favDiags, checklists: favCls } = useFavoritesStore();

  const commands = favCmds.map(getCommandById).filter(Boolean) as ReturnType<typeof getCommandById>[];
  const diagnostics = favDiags.map(getDiagnosticById).filter(Boolean) as ReturnType<typeof getDiagnosticById>[];
  const checklists = favCls.map(getChecklistById).filter(Boolean) as ReturnType<typeof getChecklistById>[];

  const total = commands.length + diagnostics.length + checklists.length;

  if (total === 0) {
    return (
      <div className="space-y-6">
        <h1 className="text-xl font-bold text-white flex items-center gap-2">
          <Star className="w-5 h-5 text-yellow-400" />
          Favoris
        </h1>
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <Inbox className="w-12 h-12 text-slate-700 mb-4" />
          <h2 className="text-slate-400 font-medium mb-1">Aucun favori enregistré</h2>
          <p className="text-slate-500 text-sm max-w-xs mb-6">
            Cliquez sur l'étoile ★ d'une commande, d'un diagnostic ou d'une checklist pour l'ajouter ici.
          </p>
          <div className="flex gap-3">
            <Link to="/commands" className="px-4 py-2 rounded-lg bg-accent/15 border border-accent/30 text-accent text-sm hover:bg-accent/25">
              Explorer les commandes
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <h1 className="text-xl font-bold text-white flex items-center gap-2">
        <Star className="w-5 h-5 text-yellow-400 fill-current" />
        Favoris
        <span className="text-sm font-normal text-slate-500">({total})</span>
      </h1>

      {commands.length > 0 && (
        <section>
          <h2 className="text-sm font-semibold text-slate-300 mb-3 flex items-center gap-2">
            <Terminal className="w-4 h-4 text-accent" />
            Commandes ({commands.length})
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3">
            {commands.map((cmd) => cmd && <CommandCard key={cmd.id} command={cmd} />)}
          </div>
        </section>
      )}

      {diagnostics.length > 0 && (
        <section>
          <h2 className="text-sm font-semibold text-slate-300 mb-3 flex items-center gap-2">
            <Stethoscope className="w-4 h-4 text-accent" />
            Diagnostics ({diagnostics.length})
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {diagnostics.map((d) => d && <DiagnosticCard key={d.id} diagnostic={d} />)}
          </div>
        </section>
      )}

      {checklists.length > 0 && (
        <section>
          <h2 className="text-sm font-semibold text-slate-300 mb-3 flex items-center gap-2">
            <CheckSquare className="w-4 h-4 text-accent" />
            Checklists ({checklists.length})
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {checklists.map((cl) => cl && <ChecklistCard key={cl.id} checklist={cl} />)}
          </div>
        </section>
      )}
    </div>
  );
}

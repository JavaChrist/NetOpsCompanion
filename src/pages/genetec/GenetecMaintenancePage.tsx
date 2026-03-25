import { Link } from 'react-router-dom';
import { Wrench, ArrowRight, CheckCircle2, AlertTriangle, Download } from 'lucide-react';

const updateProcedure = [
  'Sauvegarder la base de données SQL Server (backup complet)',
  'Exporter la configuration Genetec via Config Tool → Backup',
  'Vérifier la compatibilité de la nouvelle version avec les plugins installés',
  'Arrêter tous les services Genetec (Genetec Server, Archiveur, etc.)',
  'Lancer l\'installateur Genetec Security Center en mode mise à jour',
  'Laisser l\'assistant de mise à jour s\'exécuter sans interruption',
  'Redémarrer le serveur après l\'installation',
  'Vérifier que tous les services démarrent correctement',
  'Contrôler l\'état des entités dans Config Tool',
  'Tester un flux vidéo et un accès badge',
];

const maintenanceTasks = [
  { label: 'Vérifier l\'espace disque des archiveurs', freq: 'Hebdomadaire', level: 'warning' },
  { label: 'Contrôler les caméras en erreur', freq: 'Hebdomadaire', level: 'warning' },
  { label: 'Tester les sauvegardes SQL Server', freq: 'Mensuel', level: 'ok' },
  { label: 'Vérifier les licences actives', freq: 'Trimestriel', level: 'ok' },
  { label: 'Mettre à jour le firmware des contrôleurs', freq: 'Semestriel', level: 'ok' },
  { label: 'Audit complet des droits utilisateurs', freq: 'Annuel', level: 'ok' },
];

export function GenetecMaintenancePage() {
  return (
    <div className="space-y-8">
      <div>
        <div className="flex items-center gap-2 mb-1">
          <Link to="/genetec" className="text-xs text-slate-500 hover:text-accent transition-colors">Genetec</Link>
          <span className="text-xs text-slate-600">/</span>
          <span className="text-xs text-accent">Maintenance</span>
        </div>
        <h1 className="text-2xl font-bold text-white mb-1">Mises à jour / Maintenance</h1>
        <p className="text-slate-400 text-sm">
          Procédures de mise à jour et tâches de maintenance préventive Genetec.
        </p>
      </div>

      {/* Procédure de mise à jour */}
      <div>
        <h2 className="text-sm font-semibold text-slate-300 mb-3 flex items-center gap-2">
          <Download className="w-4 h-4 text-accent" />
          Procédure de mise à jour Security Center
        </h2>
        <div className="rounded-xl border border-surface-600 bg-surface-800 p-4">
          <div className="flex items-center gap-2 mb-3">
            <Wrench className="w-4 h-4 text-sky-400 flex-shrink-0" />
            <h3 className="text-sm font-semibold text-white">Étapes de mise à jour</h3>
          </div>
          <ol className="space-y-2">
            {updateProcedure.map((step, i) => (
              <li key={i} className="flex items-start gap-2.5 text-sm text-slate-300">
                <span className="flex-shrink-0 w-5 h-5 rounded-full bg-surface-600 border border-surface-500 text-xs flex items-center justify-center text-slate-400 font-medium">{i + 1}</span>
                {step}
              </li>
            ))}
          </ol>
          <div className="mt-4 p-3 rounded-lg bg-amber-500/10 border border-amber-500/20">
            <div className="flex items-start gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" />
              <p className="text-xs text-amber-300">Planifier la mise à jour hors heures de production. Prévoir 1h à 2h d'interruption selon la taille de l'installation.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Tâches de maintenance récurrentes */}
      <div>
        <h2 className="text-sm font-semibold text-slate-300 mb-3 flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-accent" />
          Maintenance préventive récurrente
        </h2>
        <div className="space-y-2">
          {maintenanceTasks.map(({ label, freq, level }) => (
            <div key={label} className="flex items-center justify-between rounded-xl border border-surface-600 bg-surface-800 px-4 py-3">
              <div className="flex items-center gap-3">
                <div className={`w-2 h-2 rounded-full flex-shrink-0 ${level === 'warning' ? 'bg-amber-400' : 'bg-emerald-400'}`} />
                <span className="text-sm text-slate-200">{label}</span>
              </div>
              <span className="text-xs text-slate-500 flex-shrink-0 ml-4">{freq}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <Link to="/genetec/checklists" className="group flex items-center gap-3 rounded-xl border border-surface-600 bg-surface-800 px-4 py-3 hover:border-accent/40 hover:bg-surface-700 transition-all">
          <CheckCircle2 className="w-4 h-4 text-accent flex-shrink-0" />
          <span className="text-sm text-slate-300 group-hover:text-white">Checklists maintenance</span>
          <ArrowRight className="w-4 h-4 text-slate-600 group-hover:text-accent ml-auto" />
        </Link>
        <Link to="/genetec/logs" className="group flex items-center gap-3 rounded-xl border border-surface-600 bg-surface-800 px-4 py-3 hover:border-accent/40 hover:bg-surface-700 transition-all">
          <Wrench className="w-4 h-4 text-sky-400 flex-shrink-0" />
          <span className="text-sm text-slate-300 group-hover:text-white">Logs post mise à jour</span>
          <ArrowRight className="w-4 h-4 text-slate-600 group-hover:text-accent ml-auto" />
        </Link>
      </div>
    </div>
  );
}

import { Link } from 'react-router-dom';
import {
  ShieldCheck,
  LayoutDashboard,
  Camera,
  KeyRound,
  ScrollText,
  Wrench,
  ClipboardList,
  HelpCircle,
  Activity,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  Wifi,
  Server,
} from 'lucide-react';

const statusItems = [
  { label: 'Archiveur principal', status: 'ok', detail: '192.168.1.10 — en ligne' },
  { label: 'Archiveur secondaire', status: 'ok', detail: '192.168.1.11 — en ligne' },
  { label: 'Serveur de répertoire', status: 'ok', detail: '192.168.1.5 — Genetec SC 5.11' },
  { label: 'Connexion base de données', status: 'warning', detail: 'Latence élevée détectée' },
  { label: 'Licence Security Center', status: 'ok', detail: 'Valide — expire 2026-12-31' },
];

const modules = [
  { to: '/genetec/cameras', icon: Camera, label: 'Caméras / Vidéosurveillance', color: 'text-purple-400', bg: 'bg-purple-500/10 border-purple-500/20' },
  { to: '/genetec/access-control', icon: KeyRound, label: 'Contrôle d\'accès', color: 'text-emerald-400', bg: 'bg-emerald-500/10 border-emerald-500/20' },
  { to: '/genetec/logs', icon: ScrollText, label: 'Logs & Diagnostics', color: 'text-amber-400', bg: 'bg-amber-500/10 border-amber-500/20' },
  { to: '/genetec/maintenance', icon: Wrench, label: 'Maintenance', color: 'text-sky-400', bg: 'bg-sky-500/10 border-sky-500/20' },
  { to: '/genetec/checklists', icon: ClipboardList, label: 'Checklists', color: 'text-accent', bg: 'bg-accent/10 border-accent/20' },
  { to: '/genetec/faq', icon: HelpCircle, label: 'FAQ / Incidents', color: 'text-rose-400', bg: 'bg-rose-500/10 border-rose-500/20' },
];

export function GenetecOverviewPage() {
  return (
    <div className="space-y-8">
      <div>
        <div className="flex items-center gap-2 mb-1">
          <Link to="/genetec" className="text-xs text-slate-500 hover:text-accent transition-colors">Genetec</Link>
          <span className="text-xs text-slate-600">/</span>
          <span className="text-xs text-accent">Vue d'ensemble</span>
        </div>
        <h1 className="text-2xl font-bold text-white mb-1">Vue d'ensemble</h1>
        <p className="text-slate-400 text-sm">État global du système Genetec Security Center.</p>
      </div>

      {/* État des services */}
      <div>
        <h2 className="text-sm font-semibold text-slate-300 mb-3 flex items-center gap-2">
          <Activity className="w-4 h-4 text-accent" />
          État des services
        </h2>
        <div className="space-y-2">
          {statusItems.map(({ label, status, detail }) => (
            <div key={label} className="flex items-center justify-between rounded-xl border border-surface-600 bg-surface-800 px-4 py-3">
              <div className="flex items-center gap-3">
                <div className={`w-2 h-2 rounded-full flex-shrink-0 ${status === 'ok' ? 'bg-emerald-400' : 'bg-amber-400'}`} />
                <span className="text-sm text-slate-200">{label}</span>
              </div>
              <span className="text-xs text-slate-500">{detail}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Infos système */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div className="rounded-xl border border-surface-600 bg-surface-800 p-4 space-y-3">
          <h3 className="text-sm font-semibold text-slate-300 flex items-center gap-2">
            <Server className="w-4 h-4 text-accent" />
            Informations serveur
          </h3>
          <div className="space-y-2 text-sm">
            {[
              ['Version SC', '5.11.x'],
              ['OS Serveur', 'Windows Server 2019'],
              ['SQL Server', 'SQL Server 2019'],
              ['Fuseau horaire', 'UTC+1 (Paris)'],
            ].map(([k, v]) => (
              <div key={k} className="flex justify-between">
                <span className="text-slate-500">{k}</span>
                <span className="text-slate-300 font-mono text-xs">{v}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="rounded-xl border border-surface-600 bg-surface-800 p-4 space-y-3">
          <h3 className="text-sm font-semibold text-slate-300 flex items-center gap-2">
            <Wifi className="w-4 h-4 text-accent" />
            Réseau & Connectivité
          </h3>
          <div className="space-y-2 text-sm">
            {[
              ['Adresse serveur', '192.168.1.5'],
              ['Port SDK', '4502'],
              ['Port Web', '443 (HTTPS)'],
              ['Protocole caméras', 'RTSP / ONVIF'],
            ].map(([k, v]) => (
              <div key={k} className="flex justify-between">
                <span className="text-slate-500">{k}</span>
                <span className="text-slate-300 font-mono text-xs">{v}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Navigation vers sous-modules */}
      <div>
        <h2 className="text-sm font-semibold text-slate-300 mb-3 flex items-center gap-2">
          <LayoutDashboard className="w-4 h-4 text-slate-500" />
          Accéder aux sous-modules
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {modules.map(({ to, icon: Icon, label, color, bg }) => (
            <Link
              key={to}
              to={to}
              className="group flex items-center gap-3 rounded-xl border border-surface-600 bg-surface-800 px-4 py-3 hover:border-accent/40 hover:bg-surface-700 transition-all"
            >
              <div className={`p-1.5 rounded-lg border flex-shrink-0 ${bg}`}>
                <Icon className={`w-4 h-4 ${color}`} />
              </div>
              <span className="text-sm text-slate-300 group-hover:text-white truncate">{label}</span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}

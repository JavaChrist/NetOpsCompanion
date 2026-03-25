import { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ShieldCheck,
  Camera,
  KeyRound,
  ScrollText,
  Wrench,
  ClipboardList,
  HelpCircle,
  ArrowRight,
  BookOpen,
  Stethoscope,
  ListChecks,
  Search,
} from 'lucide-react';
import { procedures, diagnostics, checklists } from '../../data/genetec';

const domains = [
  {
    to: '/genetec/cameras',
    icon: Camera,
    label: 'Vidéo / Omnicast',
    desc: 'Caméras, flux, enregistrement, archivage',
    color: 'text-purple-400',
    bg: 'bg-purple-500/10 border-purple-500/20',
    count: { procedures: 2, diagnostics: 2 },
  },
  {
    to: '/genetec/access-control',
    icon: KeyRound,
    label: 'Contrôle d\'accès / Synergis',
    desc: 'Contrôleurs, portes, lecteurs, badges',
    color: 'text-emerald-400',
    bg: 'bg-emerald-500/10 border-emerald-500/20',
    count: { procedures: 2, diagnostics: 2 },
  },
  {
    to: '/genetec/logs',
    icon: ScrollText,
    label: 'Logs & Événements',
    desc: 'Référence des événements Genetec',
    color: 'text-amber-400',
    bg: 'bg-amber-500/10 border-amber-500/20',
    count: { procedures: 0, diagnostics: 8 },
  },
  {
    to: '/genetec/maintenance',
    icon: Wrench,
    label: 'Maintenance',
    desc: 'Mises à jour, procédures, vérifications',
    color: 'text-sky-400',
    bg: 'bg-sky-500/10 border-sky-500/20',
    count: { procedures: 1, diagnostics: 0 },
  },
  {
    to: '/genetec/checklists',
    icon: ClipboardList,
    label: 'Checklists',
    desc: 'Recettes, mise en service, post-update',
    color: 'text-accent',
    bg: 'bg-accent/10 border-accent/20',
    count: { procedures: 0, diagnostics: 0 },
  },
  {
    to: '/genetec/faq',
    icon: HelpCircle,
    label: 'FAQ / Incidents',
    desc: 'Résolutions rapides des problèmes courants',
    color: 'text-rose-400',
    bg: 'bg-rose-500/10 border-rose-500/20',
    count: { procedures: 0, diagnostics: 4 },
  },
];

const stats = [
  { label: 'Procédures guidées', value: procedures.length, icon: BookOpen, href: '/genetec/cameras' },
  { label: 'Diagnostics', value: diagnostics.length, icon: Stethoscope, href: '/genetec/cameras' },
  { label: 'Checklists', value: checklists.length, icon: ListChecks, href: '/genetec/checklists' },
  { label: 'Événements logs', value: 8, icon: ScrollText, href: '/genetec/logs' },
];

export function GenetecPage() {
  const [query, setQuery] = useState('');

  const q = query.toLowerCase().trim();
  const filteredProcedures = q
    ? procedures.filter(p => p.title.toLowerCase().includes(q) || p.description.toLowerCase().includes(q))
    : [];
  const filteredDiagnostics = q
    ? diagnostics.filter(d => d.symptom.toLowerCase().includes(q) || d.description.toLowerCase().includes(q))
    : [];
  const hasResults = filteredProcedures.length > 0 || filteredDiagnostics.length > 0;

  return (
    <div className="space-y-8">

      {/* Header */}
      <div>
        <div className="flex items-center gap-2 mb-1">
          <ShieldCheck className="w-4 h-4 text-accent" />
          <span className="text-xs font-medium text-accent uppercase tracking-wider">Module Genetec</span>
        </div>
        <h1 className="text-2xl font-bold text-white mb-1">Genetec Security Center</h1>
        <p className="text-slate-400 text-sm">
          Assistant d'exploitation : configuration guidée, diagnostic, logs et checklists terrain.
        </p>
      </div>

      {/* Recherche */}
      <div className="relative">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
        <input
          type="text"
          value={query}
          onChange={e => setQuery(e.target.value)}
          placeholder="Rechercher une procédure, un symptôme, un équipement…"
          className="w-full bg-surface-800 border border-surface-600 rounded-xl pl-10 pr-4 py-2.5 text-sm text-slate-200 placeholder-slate-500 outline-none focus:border-accent/60 focus:bg-surface-700 transition-all"
        />
      </div>

      {/* Résultats de recherche */}
      {q && (
        <div className="space-y-3">
          {!hasResults && (
            <p className="text-sm text-slate-500 text-center py-4">Aucun résultat pour « {query} »</p>
          )}
          {filteredProcedures.length > 0 && (
            <div>
              <h2 className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2">Procédures</h2>
              {filteredProcedures.map(p => (
                <Link
                  key={p.id}
                  to={`/genetec/procedure/${p.id}`}
                  className="group flex items-center gap-3 rounded-xl border border-surface-600 bg-surface-800 px-4 py-3 hover:border-accent/40 hover:bg-surface-700 transition-all mb-2"
                >
                  <BookOpen className="w-4 h-4 text-accent flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium text-slate-200 group-hover:text-white">{p.title}</div>
                    <div className="text-xs text-slate-500 truncate">{p.description}</div>
                  </div>
                  <ArrowRight className="w-4 h-4 text-slate-600 group-hover:text-accent flex-shrink-0" />
                </Link>
              ))}
            </div>
          )}
          {filteredDiagnostics.length > 0 && (
            <div>
              <h2 className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2">Diagnostics</h2>
              {filteredDiagnostics.map(d => (
                <Link
                  key={d.id}
                  to={`/genetec/diagnostic/${d.id}`}
                  className="group flex items-center gap-3 rounded-xl border border-surface-600 bg-surface-800 px-4 py-3 hover:border-accent/40 hover:bg-surface-700 transition-all mb-2"
                >
                  <Stethoscope className="w-4 h-4 text-amber-400 flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium text-slate-200 group-hover:text-white">{d.symptom}</div>
                    <div className="text-xs text-slate-500 truncate">{d.description}</div>
                  </div>
                  <ArrowRight className="w-4 h-4 text-slate-600 group-hover:text-accent flex-shrink-0" />
                </Link>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Stats — masquées pendant la recherche */}
      {!q && (
        <>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
            {stats.map(({ label, value, icon: Icon, href }) => (
              <Link
                key={label}
                to={href}
                className="flex items-center gap-3 rounded-xl border border-surface-600 bg-surface-800 p-4 hover:border-accent/40 hover:bg-surface-700 transition-all"
              >
                <div className="p-2 rounded-lg bg-accent/10 border border-accent/20">
                  <Icon className="w-4 h-4 text-accent" />
                </div>
                <div>
                  <div className="text-xl font-bold text-white">{value}</div>
                  <div className="text-xs text-slate-500">{label}</div>
                </div>
              </Link>
            ))}
          </div>

          {/* Domaines */}
          <div>
            <h2 className="text-sm font-semibold text-slate-300 mb-3 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-accent" />
              Domaines du module
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {domains.map(({ to, icon: Icon, label, desc, color, bg, count }) => (
                <Link
                  key={to}
                  to={to}
                  className="group flex items-start gap-4 rounded-xl border border-surface-600 bg-surface-800 p-4 hover:border-accent/40 hover:bg-surface-700 transition-all"
                >
                  <div className={`p-2.5 rounded-xl border flex-shrink-0 ${bg}`}>
                    <Icon className={`w-5 h-5 ${color}`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium text-slate-200 group-hover:text-white mb-0.5">{label}</div>
                    <div className="text-xs text-slate-500 leading-relaxed mb-2">{desc}</div>
                    <div className="flex items-center gap-3 text-xs text-slate-600">
                      {count.procedures > 0 && <span>{count.procedures} procédure{count.procedures > 1 ? 's' : ''}</span>}
                      {count.diagnostics > 0 && <span>{count.diagnostics} diagnostic{count.diagnostics > 1 ? 's' : ''}</span>}
                    </div>
                  </div>
                  <ArrowRight className="w-4 h-4 text-slate-600 group-hover:text-accent flex-shrink-0 mt-0.5 transition-colors" />
                </Link>
              ))}
            </div>
          </div>

          {/* Accès rapide procédures */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-sm font-semibold text-slate-300 flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-accent" />
                Procédures guidées
              </h2>
            </div>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
              {procedures.map(p => (
                <Link
                  key={p.id}
                  to={`/genetec/procedure/${p.id}`}
                  className="group flex flex-col items-center justify-center gap-2 rounded-xl border border-surface-600 bg-surface-800 p-5 hover:border-accent/40 hover:bg-surface-700 transition-all text-center"
                >
                  <div className="p-2.5 rounded-xl bg-surface-600 group-hover:bg-accent/15 border border-surface-500 group-hover:border-accent/30 transition-all">
                    <BookOpen className="w-5 h-5 text-slate-400 group-hover:text-accent" />
                  </div>
                  <div>
                    <div className="text-sm font-medium text-slate-200 group-hover:text-white">{p.title}</div>
                    <div className="text-xs text-slate-500 mt-0.5">{p.estimatedTime}</div>
                  </div>
                </Link>
              ))}
            </div>
          </div>

          {/* Accès rapide diagnostics */}
          <div>
            <h2 className="text-sm font-semibold text-slate-300 mb-3 flex items-center gap-2">
              <Stethoscope className="w-4 h-4 text-accent" />
              Diagnostics guidés
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {diagnostics.map(d => (
                <Link
                  key={d.id}
                  to={`/genetec/diagnostic/${d.id}`}
                  className="group flex items-center gap-3 rounded-xl border border-surface-600 bg-surface-800 px-4 py-3 hover:border-accent/40 hover:bg-surface-700 transition-all"
                >
                  <Stethoscope className="w-4 h-4 text-amber-400 flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium text-slate-200 group-hover:text-white">{d.symptom}</div>
                    <div className="text-xs text-slate-500 truncate">{d.description}</div>
                  </div>
                  <ArrowRight className="w-4 h-4 text-slate-600 group-hover:text-accent flex-shrink-0" />
                </Link>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}

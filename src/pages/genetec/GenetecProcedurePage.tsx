import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { procedures } from '../../data/genetec';
import { GenetecBreadcrumb } from '../../components/genetec/GenetecBreadcrumb';
import { GenetecProcedureViewer } from '../../components/genetec/GenetecProcedureViewer';

const DOMAIN_LABEL: Record<string, string> = {
  video: 'Vidéo',
  'access-control': 'Contrôle d\'accès',
  system: 'Système',
  network: 'Réseau',
};

const DOMAIN_ROUTE: Record<string, string> = {
  video: '/genetec/cameras',
  'access-control': '/genetec/access-control',
  system: '/genetec',
  network: '/genetec',
};

export function GenetecProcedurePage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const procedure = procedures.find(p => p.id === id);

  if (!procedure) {
    return (
      <div className="space-y-4">
        <GenetecBreadcrumb crumbs={[{ label: 'Procédure introuvable' }]} />
        <div className="rounded-xl border border-surface-600 bg-surface-800 p-8 text-center">
          <p className="text-slate-400 mb-4">Cette procédure n'existe pas ou a été supprimée.</p>
          <button
            onClick={() => navigate('/genetec')}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-accent text-surface-900 text-sm font-semibold"
          >
            <ArrowLeft className="w-4 h-4" />
            Retour au module Genetec
          </button>
        </div>
      </div>
    );
  }

  const domainRoute = DOMAIN_ROUTE[procedure.domain] ?? '/genetec';
  const domainLabel = DOMAIN_LABEL[procedure.domain] ?? 'Genetec';

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <GenetecBreadcrumb
          crumbs={[
            { label: domainLabel, to: domainRoute },
            { label: 'Procédures', to: domainRoute },
            { label: procedure.title },
          ]}
        />
        <div className="mt-1 flex items-center gap-3">
          <button
            onClick={() => navigate(-1)}
            className="p-1.5 rounded-lg text-slate-500 hover:text-slate-300 hover:bg-surface-700 transition-all"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <span className="text-xs text-slate-500">Procédure guidée</span>
        </div>
      </div>

      <GenetecProcedureViewer procedure={procedure} />
    </div>
  );
}

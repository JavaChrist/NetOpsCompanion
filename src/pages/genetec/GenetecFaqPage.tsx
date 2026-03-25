import { Link } from 'react-router-dom';
import { HelpCircle, ArrowRight, Camera, KeyRound, ScrollText } from 'lucide-react';

const faqs = [
  {
    category: 'Vidéosurveillance',
    icon: Camera,
    color: 'text-purple-400',
    bg: 'bg-purple-500/10 border-purple-500/20',
    items: [
      {
        q: 'Une caméra passe hors ligne régulièrement',
        a: 'Vérifier la stabilité du PoE (switch non géré → passer sur switch manageable). Contrôler le câble réseau (longueur max 90m). Mettre à jour le firmware de la caméra. Augmenter le délai de reconnexion dans Config Tool.',
      },
      {
        q: 'Le flux vidéo est en retard (latence élevée)',
        a: 'Réduire le débit vidéo dans les propriétés de la caméra. Vérifier la charge de l\'archiveur (CPU/RAM). S\'assurer que la résolution d\'enregistrement est adaptée au réseau.',
      },
      {
        q: 'Impossible d\'ajouter une caméra ONVIF',
        a: 'Vérifier que le profil ONVIF S est activé sur la caméra. Créer un utilisateur dédié avec droits administrateur. Tester via ONVIF Device Manager avant d\'ajouter dans Genetec.',
      },
      {
        q: 'L\'enregistrement s\'arrête sur une caméra',
        a: 'Vérifier l\'espace disque de l\'archiveur. Contrôler le planning d\'enregistrement dans Config Tool. Vérifier les logs de l\'archiveur pour détecter une erreur d\'écriture.',
      },
    ],
  },
  {
    category: 'Contrôle d\'accès',
    icon: KeyRound,
    color: 'text-emerald-400',
    bg: 'bg-emerald-500/10 border-emerald-500/20',
    items: [
      {
        q: 'Un badge ne fonctionne plus sur un lecteur spécifique',
        a: 'Vérifier que la porte est bien en ligne dans Config Tool. Tester un autre badge valide. Contrôler les horaires d\'accès associés au badge. Vérifier les logs d\'accès refusé pour identifier la cause exacte.',
      },
      {
        q: 'Un contrôleur d\'accès est hors ligne',
        a: 'Pinger l\'adresse IP du contrôleur. Vérifier l\'alimentation. Redémarrer le contrôleur depuis Config Tool → clic droit → Reboot. Contrôler le câblage réseau.',
      },
      {
        q: 'La porte reste verrouillée après un badge valide',
        a: 'Tester l\'ouverture manuelle depuis Config Tool. Vérifier le câblage de l\'électroserrure. Contrôler la tension d\'alimentation de la serrure (12V/24V selon modèle).',
      },
    ],
  },
  {
    category: 'Système & Serveur',
    icon: ScrollText,
    color: 'text-amber-400',
    bg: 'bg-amber-500/10 border-amber-500/20',
    items: [
      {
        q: 'Impossible de se connecter à Security Desk',
        a: 'Vérifier que le service "Genetec Server" est démarré sur le serveur. Contrôler la connectivité réseau vers le serveur (port 4502). Vérifier les identifiants de connexion. Consulter les logs Windows pour des erreurs de service.',
      },
      {
        q: 'L\'archiveur indique "Disque plein"',
        a: 'Libérer de l\'espace disque ou ajouter un disque. Réduire la rétention vidéo dans les propriétés de l\'archiveur. Activer la purge automatique des enregistrements anciens.',
      },
      {
        q: 'La licence Genetec expire bientôt',
        a: 'Contacter le revendeur Genetec ou le programme SMA pour renouveler. Le renouvellement s\'effectue via le portail Genetec GTAP. Après renouvellement, appliquer la nouvelle licence dans Config Tool → Licenses.',
      },
    ],
  },
];

export function GenetecFaqPage() {
  return (
    <div className="space-y-8">
      <div>
        <div className="flex items-center gap-2 mb-1">
          <Link to="/genetec" className="text-xs text-slate-500 hover:text-accent transition-colors">Genetec</Link>
          <span className="text-xs text-slate-600">/</span>
          <span className="text-xs text-accent">FAQ</span>
        </div>
        <h1 className="text-2xl font-bold text-white mb-1">FAQ / Incidents fréquents</h1>
        <p className="text-slate-400 text-sm">
          Résolutions rapides des pannes et problèmes courants sur Genetec Security Center.
        </p>
      </div>

      <div className="space-y-8">
        {faqs.map(({ category, icon: Icon, color, bg, items }) => (
          <div key={category}>
            <h2 className="text-sm font-semibold text-slate-300 mb-3 flex items-center gap-2">
              <div className={`p-1.5 rounded-lg border ${bg}`}>
                <Icon className={`w-3.5 h-3.5 ${color}`} />
              </div>
              {category}
            </h2>
            <div className="space-y-3">
              {items.map(({ q, a }) => (
                <div key={q} className="rounded-xl border border-surface-600 bg-surface-800 p-4">
                  <div className="flex items-start gap-2 mb-2">
                    <HelpCircle className="w-4 h-4 text-accent flex-shrink-0 mt-0.5" />
                    <h3 className="text-sm font-semibold text-white">{q}</h3>
                  </div>
                  <p className="text-sm text-slate-400 leading-relaxed pl-6">{a}</p>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      <Link to="/genetec/logs" className="group flex items-center gap-3 rounded-xl border border-surface-600 bg-surface-800 px-4 py-3 hover:border-accent/40 hover:bg-surface-700 transition-all">
        <ScrollText className="w-4 h-4 text-amber-400 flex-shrink-0" />
        <span className="text-sm text-slate-300 group-hover:text-white">Consulter les logs pour aller plus loin</span>
        <ArrowRight className="w-4 h-4 text-slate-600 group-hover:text-accent ml-auto" />
      </Link>
    </div>
  );
}

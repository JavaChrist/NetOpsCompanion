import type { ChecklistTemplate } from '../types';

export const checklists: ChecklistTemplate[] = [
  {
    id: 'cl-camera-install',
    title: 'Mise en service caméra IP',
    description: 'Checklist complète pour la mise en service d\'une nouvelle caméra IP sur site.',
    category: 'video-surveillance',
    tags: ['caméra', 'installation', 'mise en service', 'ip'],
    estimatedTime: '20-30 min',
    sections: [
      {
        id: 'phys',
        title: 'Vérifications physiques',
        items: [
          { id: 'phys-1', label: 'Caméra fixée et orientée correctement', critical: true },
          { id: 'phys-2', label: 'Câblage RJ45 testé et correctement terminé', critical: true },
          { id: 'phys-3', label: 'LED de la caméra allumée (alimentation OK)', critical: true },
          { id: 'phys-4', label: 'LED du port switch active (lien OK)', critical: true },
          { id: 'phys-5', label: 'PoE : LED PoE du switch allumée ou budgétaire PoE vérifié', description: 'Uniquement si alimentation PoE' },
        ],
      },
      {
        id: 'network',
        title: 'Configuration réseau',
        items: [
          { id: 'net-1', label: 'Caméra pingable depuis le réseau', critical: true, command: 'ping 192.168.x.x' },
          { id: 'net-2', label: 'IP DHCP ou statique correctement configurée', critical: true },
          { id: 'net-3', label: 'Caméra dans le bon VLAN caméra', critical: true },
          { id: 'net-4', label: 'Passerelle et DNS configurés (si statique)' },
          { id: 'net-5', label: 'Port switch en mode access sur le bon VLAN' },
        ],
      },
      {
        id: 'access',
        title: 'Accès et sécurité',
        items: [
          { id: 'acc-1', label: 'Interface web accessible', critical: true },
          { id: 'acc-2', label: 'Mot de passe par défaut changé', critical: true, description: 'Ne jamais laisser le mot de passe usine' },
          { id: 'acc-3', label: 'Firmware à jour si requis' },
          { id: 'acc-4', label: 'Date/heure synchronisée (NTP configuré)' },
        ],
      },
      {
        id: 'stream',
        title: 'Flux vidéo',
        items: [
          { id: 'str-1', label: 'Flux principal visible dans VLC ou ONVIF Device Manager', critical: true, command: 'vlc rtsp://...' },
          { id: 'str-2', label: 'Qualité d\'image correcte (focus, exposition)', critical: true },
          { id: 'str-3', label: 'ONVIF détecté et fonctionnel' },
          { id: 'str-4', label: 'Profils de flux configurés (H.264/H.265, résolution, FPS)' },
          { id: 'str-5', label: 'Flux secondaire configuré si requis par le VMS' },
        ],
      },
      {
        id: 'vms',
        title: 'Intégration VMS',
        items: [
          { id: 'vms-1', label: 'Caméra ajoutée dans le VMS', critical: true },
          { id: 'vms-2', label: 'Flux vidéo visible dans le VMS', critical: true },
          { id: 'vms-3', label: 'Enregistrement vidéo fonctionnel' },
          { id: 'vms-4', label: 'Alarmes et événements configurés si requis' },
          { id: 'vms-5', label: 'Caméra nommée selon convention de nommage du site' },
        ],
      },
    ],
    notes: 'Toujours documenter les paramètres réseau (IP, MAC, VLAN) dans le fichier de recette du site.',
  },

  {
    id: 'cl-camera-debug',
    title: 'Diagnostic caméra perdue / non répondante',
    description: 'Checklist de dépannage pour une caméra IP qui ne répond plus.',
    category: 'video-surveillance',
    tags: ['caméra', 'diagnostic', 'dépannage', 'perdue'],
    estimatedTime: '15-30 min',
    sections: [
      {
        id: 'phy',
        title: 'Couche physique',
        items: [
          { id: 'db-phy-1', label: 'LED de la caméra visible et normale', critical: true },
          { id: 'db-phy-2', label: 'LED port switch indique lien actif', critical: true },
          { id: 'db-phy-3', label: 'Câble remplacé ou testé', critical: true },
          { id: 'db-phy-4', label: 'PoE vérifié (budget, port, connecteur)', description: 'Tester sur un autre port PoE' },
        ],
      },
      {
        id: 'ip',
        title: 'Couche réseau',
        items: [
          { id: 'db-ip-1', label: 'Scan nmap sur la plage réseau effectué', command: 'nmap -sn 192.168.1.0/24' },
          { id: 'db-ip-2', label: 'Recherche dans la table ARP', command: 'arp -a' },
          { id: 'db-ip-3', label: 'Recherche dans les baux DHCP' },
          { id: 'db-ip-4', label: 'Plage 169.254.x.x scannée si APIPA suspectée', command: 'nmap -sn 169.254.0.0/16' },
        ],
      },
      {
        id: 'net',
        title: 'Configuration réseau',
        items: [
          { id: 'db-net-1', label: 'VLAN du port switch vérifié' },
          { id: 'db-net-2', label: '802.1X vérifié (EAPOL capturé si nécessaire)' },
          { id: 'db-net-3', label: 'IP de la caméra en conflit vérifiée', command: 'arp -a | findstr "IP_CAM"' },
        ],
      },
      {
        id: 'reset',
        title: 'Reset et restauration',
        items: [
          { id: 'db-rst-1', label: 'Reset logiciel tenté depuis interface web (si accessible)' },
          { id: 'db-rst-2', label: 'Reset usine tenté (bouton physique)', description: 'Consulter le manuel du modèle', critical: false },
          { id: 'db-rst-3', label: 'Reconfiguration IP après reset', critical: true },
        ],
      },
    ],
  },

  {
    id: 'cl-network-pre-install',
    title: 'Validation réseau avant installation',
    description: 'Vérifications réseau à effectuer avant de déployer des équipements sur un site.',
    category: 'network-config',
    tags: ['réseau', 'pré-installation', 'validation', 'vlan', 'dhcp'],
    estimatedTime: '30-45 min',
    sections: [
      {
        id: 'infra',
        title: 'Infrastructure',
        items: [
          { id: 'pre-1', label: 'Schéma réseau du site disponible', critical: true },
          { id: 'pre-2', label: 'Plan d\'adressage IP validé et documenté', critical: true },
          { id: 'pre-3', label: 'VLANs créés sur tous les switches concernés', critical: true },
          { id: 'pre-4', label: 'Trunks inter-switches configurés pour les VLANs', critical: true },
        ],
      },
      {
        id: 'dhcp',
        title: 'DHCP',
        items: [
          { id: 'dhcp-1', label: 'Scope DHCP créé pour chaque VLAN caméra', critical: true },
          { id: 'dhcp-2', label: 'DHCP relay (ip helper-address) configuré', critical: true },
          { id: 'dhcp-3', label: 'Pool DHCP suffisamment dimensionné (nb caméras + marge)' },
          { id: 'dhcp-4', label: 'Test DHCP : un équipement test reçoit bien une IP' },
        ],
      },
      {
        id: 'connect',
        title: 'Connectivité',
        items: [
          { id: 'conn-1', label: 'Accès au VMS depuis le VLAN caméra validé (ping)' },
          { id: 'conn-2', label: 'Accès NTP configuré depuis les caméras' },
          { id: 'conn-3', label: 'Firewall / ACL entre VLANs vérifiés' },
          { id: 'conn-4', label: 'Ports nécessaires ouverts (RTSP 554, ONVIF 80/3702)' },
        ],
      },
      {
        id: 'poe',
        title: 'PoE',
        items: [
          { id: 'poe-1', label: 'Budget PoE total du switch calculé vs consommation prévue', critical: true },
          { id: 'poe-2', label: 'Type PoE compatible avec les caméras (802.3af / 802.3at / 802.3bt)' },
          { id: 'poe-3', label: 'Alimentation redondante ou UPS pour les switches PoE' },
        ],
      },
    ],
  },

  {
    id: 'cl-poe-switch-check',
    title: 'Contrôle switch PoE',
    description: 'Diagnostic d\'un switch PoE suspect ou lors d\'une vérification de déploiement.',
    category: 'poe-switch',
    tags: ['poe', 'switch', 'couche2', 'diagnostic'],
    estimatedTime: '15-20 min',
    sections: [
      {
        id: 'poe',
        title: 'Vérification PoE',
        items: [
          { id: 'poe-ck-1', label: 'Budget PoE total vs consommation actuelle', critical: true, command: 'show power inline' },
          { id: 'poe-ck-2', label: 'Chaque port PoE actif vérifié (DEL / GUI switch)', critical: true },
          { id: 'poe-ck-3', label: 'Pas de port en erreur PoE (overload, fault)' },
          { id: 'poe-ck-4', label: 'Classe PoE cohérente avec les équipements branchés' },
        ],
      },
      {
        id: 'vlan',
        title: 'VLAN',
        items: [
          { id: 'vlan-1', label: 'VLANs actifs conformes au plan', command: 'show vlan brief' },
          { id: 'vlan-2', label: 'Ports access dans le bon VLAN', command: 'show interfaces trunk' },
          { id: 'vlan-3', label: 'Ports trunk configurés correctement' },
        ],
      },
      {
        id: 'security',
        title: 'Sécurité',
        items: [
          { id: 'sec-1', label: 'Spanning Tree actif et stable', command: 'show spanning-tree' },
          { id: 'sec-2', label: 'Port security ou 802.1X selon politique de sécurité' },
          { id: 'sec-3', label: 'Pas de boucle réseau détectée' },
        ],
      },
    ],
  },

  {
    id: 'cl-windows-audit',
    title: 'Audit rapide Windows (poste VMS / serveur)',
    description: 'Vérifications de sécurité et d\'intégrité sur un poste Windows hébergeant un VMS ou un NVR.',
    category: 'cybersecurity',
    tags: ['windows', 'audit', 'sécurité', 'vms', 'serveur'],
    estimatedTime: '20-30 min',
    sections: [
      {
        id: 'system',
        title: 'Système',
        items: [
          { id: 'sys-1', label: 'Windows à jour (Windows Update vérifié)' },
          { id: 'sys-2', label: 'Antivirus actif et base à jour' },
          { id: 'sys-3', label: 'Pas de logiciel non autorisé installé' },
          { id: 'sys-4', label: 'Logs d\'événements Windows vérifiés (erreurs récentes)' },
        ],
      },
      {
        id: 'network-win',
        title: 'Réseau',
        items: [
          { id: 'net-w1', label: 'Adresse IP statique configurée', command: 'ipconfig /all', critical: true },
          { id: 'net-w2', label: 'Pare-feu Windows actif et règles vérifiées' },
          { id: 'net-w3', label: 'Ports ouverts conformes aux besoins VMS', command: 'netstat -ano | findstr LISTENING' },
          { id: 'net-w4', label: 'Pas de connexion suspecte active', command: 'netstat -ano | findstr ESTABLISHED' },
        ],
      },
      {
        id: 'accounts',
        title: 'Comptes et droits',
        items: [
          { id: 'acc-a1', label: 'Compte administrateur local désactivé ou renommé' },
          { id: 'acc-a2', label: 'Comptes utilisateurs VMS avec droits minimaux' },
          { id: 'acc-a3', label: 'Mots de passe robustes configurés' },
          { id: 'acc-a4', label: 'Droits utilisateur courant vérifiés', command: 'whoami /all' },
        ],
      },
      {
        id: 'services-win',
        title: 'Services',
        items: [
          { id: 'svc-1', label: 'Services VMS actifs et démarrage automatique', command: 'sc query type= all state= running' },
          { id: 'svc-2', label: 'Services inutiles désactivés' },
          { id: 'svc-3', label: 'RDP sécurisé ou désactivé si non nécessaire' },
        ],
      },
    ],
  },

  // ── Nouvelles checklists ──────────────────────────────────────────────

  {
    id: 'cl-nvr-validation',
    title: 'Validation NVR avant mise en production',
    description: "Vérifications à effectuer sur un NVR avant sa mise en service sur un site.",
    category: 'video-surveillance',
    tags: ['nvr', 'validation', 'mise en service', 'enregistrement'],
    estimatedTime: '30-45 min',
    sections: [
      {
        id: 'nvr-hw',
        title: 'Matériel et alimentation',
        items: [
          { id: 'nvr-hw-1', label: 'NVR alimenté et démarré correctement', critical: true },
          { id: 'nvr-hw-2', label: 'Disques durs détectés et initialisés', critical: true },
          { id: 'nvr-hw-3', label: 'RAID configuré si applicable', description: 'RAID1 recommandé pour la redondance' },
          { id: 'nvr-hw-4', label: 'Ventilation correcte, pas de surchauffe' },
        ],
      },
      {
        id: 'nvr-net',
        title: 'Réseau',
        items: [
          { id: 'nvr-net-1', label: 'IP statique configurée sur le NVR', critical: true },
          { id: 'nvr-net-2', label: 'NVR pingable depuis le réseau de gestion', critical: true },
          { id: 'nvr-net-3', label: 'NVR dans le bon VLAN (VLAN caméra ou gestion)' },
          { id: 'nvr-net-4', label: 'Interface web du NVR accessible depuis le poste de gestion' },
          { id: 'nvr-net-5', label: 'NTP configuré — date/heure synchronisée', critical: true, description: 'Critique pour la valeur légale des enregistrements' },
        ],
      },
      {
        id: 'nvr-cam',
        title: 'Caméras',
        items: [
          { id: 'nvr-cam-1', label: 'Toutes les caméras ajoutées et visibles dans le NVR', critical: true },
          { id: 'nvr-cam-2', label: 'Flux vidéo en direct visible pour chaque caméra', critical: true },
          { id: 'nvr-cam-3', label: 'Caméras nommées selon convention du site' },
          { id: 'nvr-cam-4', label: 'Résolution et FPS configurés selon le cahier des charges' },
        ],
      },
      {
        id: 'nvr-rec',
        title: 'Enregistrement',
        items: [
          { id: 'nvr-rec-1', label: 'Planning d\'enregistrement configuré (continu / détection)', critical: true },
          { id: 'nvr-rec-2', label: 'Test d\'enregistrement et relecture effectué', critical: true },
          { id: 'nvr-rec-3', label: 'Durée de rétention calculée et conforme au RGPD / cahier des charges' },
          { id: 'nvr-rec-4', label: 'Alerte de perte de caméra configurée si disponible' },
        ],
      },
      {
        id: 'nvr-sec',
        title: 'Sécurité',
        items: [
          { id: 'nvr-sec-1', label: 'Mot de passe administrateur changé', critical: true },
          { id: 'nvr-sec-2', label: 'Comptes utilisateurs créés avec droits minimaux' },
          { id: 'nvr-sec-3', label: 'UPS connecté si disponible (protection coupure secteur)' },
        ],
      },
    ],
    notes: 'La date/heure correcte est indispensable pour la valeur légale des enregistrements. Toujours vérifier avant la mise en production.',
  },

  {
    id: 'cl-video-stream-validation',
    title: 'Validation flux vidéo caméra',
    description: "Vérifications techniques du flux vidéo d'une caméra IP lors de la mise en service ou du dépannage.",
    category: 'video-surveillance',
    tags: ['flux', 'vidéo', 'rtsp', 'qualité', 'validation'],
    estimatedTime: '10-15 min',
    sections: [
      {
        id: 'stream-access',
        title: 'Accès au flux',
        items: [
          { id: 'str-acc-1', label: 'Flux RTSP principal accessible via VLC', critical: true, command: 'vlc rtsp://user:pass@IP:554/...' },
          { id: 'str-acc-2', label: 'Flux secondaire (sous-flux) disponible si requis' },
          { id: 'str-acc-3', label: 'Port 554 ouvert et accessible depuis le poste VMS', command: 'Test-NetConnection IP -Port 554' },
          { id: 'str-acc-4', label: 'ONVIF actif et flux visible dans ONVIF Device Manager' },
        ],
      },
      {
        id: 'stream-quality',
        title: 'Qualité de l\'image',
        items: [
          { id: 'str-q-1', label: 'Image nette et correctement exposée', critical: true },
          { id: 'str-q-2', label: 'Angle de vue conforme au plan de caméra' },
          { id: 'str-q-3', label: 'Pas de reflet, contre-jour ou obstruction visible' },
          { id: 'str-q-4', label: 'Vision nocturne / IR fonctionnelle (si applicable)', description: 'Tester en simulant l\'obscurité ou en vérifiant la détection IR auto' },
          { id: 'str-q-5', label: 'Qualité image stable (pas de freeze, artefacts ou déchirure)' },
        ],
      },
      {
        id: 'stream-tech',
        title: 'Paramètres techniques',
        items: [
          { id: 'str-t-1', label: 'Codec H.264 ou H.265 configuré selon le VMS', critical: true },
          { id: 'str-t-2', label: 'Résolution conforme au cahier des charges' },
          { id: 'str-t-3', label: 'FPS configuré (15 ou 25 FPS selon usage)' },
          { id: 'str-t-4', label: 'Bitrate adapté au réseau (VBR ou CBR configuré)' },
          { id: 'str-t-5', label: 'I-Frame interval configuré correctement (1-2 secondes)' },
        ],
      },
    ],
  },

  {
    id: 'cl-dhcp-troubleshoot',
    title: 'Dépannage attribution DHCP',
    description: "Checklist de diagnostic pour résoudre les problèmes d'attribution d'adresse IP par DHCP.",
    category: 'network-config',
    tags: ['dhcp', 'ip', 'attribution', 'dépannage', 'réseau'],
    estimatedTime: '15-20 min',
    sections: [
      {
        id: 'dhcp-client',
        title: 'Côté client',
        items: [
          { id: 'dhcp-c-1', label: 'Interface configurée en DHCP (pas en statique)', critical: true, command: 'ipconfig /all' },
          { id: 'dhcp-c-2', label: 'Bail DHCP libéré et renouvelé', command: 'ipconfig /release && ipconfig /renew' },
          { id: 'dhcp-c-3', label: 'Pas d\'adresse APIPA 169.254.x.x après renouvellement' },
          { id: 'dhcp-c-4', label: 'Capture Wireshark : DHCP Discover envoyé par le client', command: 'bootp' },
        ],
      },
      {
        id: 'dhcp-network',
        title: 'Réseau',
        items: [
          { id: 'dhcp-n-1', label: 'Client sur le bon VLAN avec scope DHCP correspondant', critical: true },
          { id: 'dhcp-n-2', label: 'DHCP relay (ip helper-address) configuré sur le routeur/switch L3', critical: true, description: 'Nécessaire si le serveur DHCP est sur un autre VLAN' },
          { id: 'dhcp-n-3', label: 'Pas de boucle réseau (STP stable)', description: 'Une boucle peut empêcher les broadcasts DHCP' },
        ],
      },
      {
        id: 'dhcp-server',
        title: 'Serveur DHCP',
        items: [
          { id: 'dhcp-s-1', label: 'Pool DHCP actif pour le VLAN concerné', critical: true },
          { id: 'dhcp-s-2', label: 'Plage d\'adresses non épuisée (adresses disponibles)', critical: true },
          { id: 'dhcp-s-3', label: 'Pas d\'exclusion erronée sur la MAC de l\'équipement' },
          { id: 'dhcp-s-4', label: 'Service DHCP actif et fonctionnel sur le serveur', command: 'sc query type= all state= running' },
          { id: 'dhcp-s-5', label: 'Logs DHCP vérifiés : Request/Ack visible pour l\'équipement' },
        ],
      },
    ],
  },

  {
    id: 'cl-vlan-check',
    title: 'Vérification configuration VLAN caméra',
    description: "Audit de la configuration VLAN dédiée aux caméras IP sur un réseau segmenté.",
    category: 'poe-switch',
    tags: ['vlan', 'switch', 'caméra', 'segmentation', 'réseau'],
    estimatedTime: '20-30 min',
    sections: [
      {
        id: 'vlan-design',
        title: 'Conception',
        items: [
          { id: 'vlan-d-1', label: 'VLAN caméra défini avec un ID dédié (ex: VLAN 20)', critical: true },
          { id: 'vlan-d-2', label: 'Plage IP du VLAN caméra documentée' },
          { id: 'vlan-d-3', label: 'Séparation réseau caméra / réseau bureautique respectée', critical: true },
        ],
      },
      {
        id: 'vlan-switch',
        title: 'Configuration switch',
        items: [
          { id: 'vlan-s-1', label: 'VLAN créé sur tous les switches du chemin', critical: true, command: 'show vlan brief' },
          { id: 'vlan-s-2', label: 'Ports caméra configurés en mode access sur le bon VLAN', critical: true, command: 'show interfaces GigabitEthernet0/1 switchport' },
          { id: 'vlan-s-3', label: 'VLAN propagé sur tous les trunks inter-switches', command: 'show interfaces trunk' },
          { id: 'vlan-s-4', label: 'VLAN actif (pas Inactive dans show vlan brief)' },
        ],
      },
      {
        id: 'vlan-services',
        title: 'Services réseau',
        items: [
          { id: 'vlan-svc-1', label: 'Scope DHCP dédié au VLAN caméra', critical: true },
          { id: 'vlan-svc-2', label: 'DHCP relay configuré (ip helper-address)', critical: true },
          { id: 'vlan-svc-3', label: 'ACL inter-VLAN autorisant le trafic VMS ↔ caméras' },
          { id: 'vlan-svc-4', label: 'NTP accessible depuis le VLAN caméra' },
          { id: 'vlan-svc-5', label: 'Test : une caméra test reçoit une IP dans la bonne plage', critical: true },
        ],
      },
    ],
  },

  {
    id: 'cl-network-connectivity-test',
    title: 'Test complet de connectivité réseau',
    description: "Série de tests à effectuer pour valider la connectivité réseau d'un poste ou équipement.",
    category: 'network-config',
    tags: ['connectivité', 'test', 'réseau', 'diagnostic', 'validation'],
    estimatedTime: '10-15 min',
    sections: [
      {
        id: 'conn-local',
        title: 'Connectivité locale',
        items: [
          { id: 'conn-l-1', label: 'IP attribuée (pas APIPA 169.254.x.x)', critical: true, command: 'ipconfig /all' },
          { id: 'conn-l-2', label: 'Passerelle pingable', critical: true, command: 'ping 192.168.1.1' },
          { id: 'conn-l-3', label: 'DNS configuré et fonctionnel', command: 'nslookup 8.8.8.8' },
          { id: 'conn-l-4', label: 'Table ARP contient la MAC de la passerelle', command: 'arp -a' },
        ],
      },
      {
        id: 'conn-remote',
        title: 'Connectivité vers équipements cibles',
        items: [
          { id: 'conn-r-1', label: 'Ping vers la caméra ou équipement cible OK', critical: true },
          { id: 'conn-r-2', label: 'Port HTTP/RTSP accessible via Test-NetConnection', command: 'Test-NetConnection IP -Port 80' },
          { id: 'conn-r-3', label: 'Traceroute effectué sans saut manquant anormal', command: 'tracert -d IP' },
        ],
      },
      {
        id: 'conn-internet',
        title: 'Connectivité Internet (si nécessaire)',
        items: [
          { id: 'conn-i-1', label: 'Ping 8.8.8.8 OK (Internet accessible)', command: 'ping 8.8.8.8' },
          { id: 'conn-i-2', label: 'Résolution DNS publique OK', command: 'nslookup google.com' },
        ],
      },
    ],
  },

  {
    id: 'cl-intermittent-video-debug',
    title: 'Diagnostic perte vidéo intermittente',
    description: "Checklist de diagnostic pour une caméra dont le flux vidéo est instable ou se coupe aléatoirement.",
    category: 'video-surveillance',
    tags: ['vidéo', 'intermittent', 'coupure', 'flux', 'diagnostic'],
    estimatedTime: '20-30 min',
    sections: [
      {
        id: 'intermit-physical',
        title: 'Couche physique',
        items: [
          { id: 'int-p-1', label: 'Câble remplacé par un câble de test connu bon', critical: true },
          { id: 'int-p-2', label: 'Connecteurs RJ45 re-sertis ou remplacés' },
          { id: 'int-p-3', label: 'Erreurs CRC sur le port switch vérifiées', command: 'show interfaces GigabitEthernet0/1' },
          { id: 'int-p-4', label: 'Longueur câble < 90m (en production, laisser de la marge)' },
          { id: 'int-p-5', label: 'Alimentation PoE stable (pas de fluctuation)', command: 'show power inline' },
        ],
      },
      {
        id: 'intermit-network',
        title: 'Réseau',
        items: [
          { id: 'int-n-1', label: 'Ping continu pendant une coupure — observation résultat', command: 'ping IP -t' },
          { id: 'int-n-2', label: 'Bande passante estimée vs disponible calculée' },
          { id: 'int-n-3', label: 'Pas de congestion switch (output drops = 0)', command: 'show interfaces' },
          { id: 'int-n-4', label: 'Pathping effectué pour localiser les pertes', command: 'pathping IP' },
        ],
      },
      {
        id: 'intermit-stream',
        title: 'Paramètres flux',
        items: [
          { id: 'int-s-1', label: 'Bitrate de la caméra réduit (test)', critical: false },
          { id: 'int-s-2', label: 'FPS réduit temporairement (test)', critical: false },
          { id: 'int-s-3', label: 'Flux H.264 testé à la place de H.265 si applicable' },
          { id: 'int-s-4', label: 'Nombre de clients connectés simultanément vérifiés', description: 'Certaines caméras limitent à 3-5 flux simultanés' },
        ],
      },
      {
        id: 'intermit-cam',
        title: 'État de la caméra',
        items: [
          { id: 'int-c-1', label: 'Température caméra vérifiée (pas de surchauffe)' },
          { id: 'int-c-2', label: 'Logs de la caméra consultés (erreurs/redémarrages)' },
          { id: 'int-c-3', label: 'Firmware caméra à jour' },
        ],
      },
    ],
  },

  {
    id: 'cl-site-acceptance',
    title: 'Recette de site vidéosurveillance',
    description: "Checklist de recette finale lors de la livraison d'un système de vidéosurveillance IP complet à un client.",
    category: 'video-surveillance',
    tags: ['recette', 'livraison', 'site', 'validation', 'client'],
    estimatedTime: '60-90 min',
    sections: [
      {
        id: 'recette-infra',
        title: 'Infrastructure réseau',
        items: [
          { id: 'rec-i-1', label: 'Plan d\'adressage IP documenté et remis au client', critical: true },
          { id: 'rec-i-2', label: 'Schéma réseau à jour (VLANs, switches, routeurs)', critical: true },
          { id: 'rec-i-3', label: 'Tableau de câblage caméras complété (caméra, port switch, IP, MAC)', critical: true },
          { id: 'rec-i-4', label: 'Redondance réseau vérifiée si applicable' },
        ],
      },
      {
        id: 'recette-cameras',
        title: 'Caméras',
        items: [
          { id: 'rec-c-1', label: '100% des caméras actives et visibles dans le VMS/NVR', critical: true },
          { id: 'rec-c-2', label: 'Image de chaque caméra vérifiée (qualité, angle, zone couverte)', critical: true },
          { id: 'rec-c-3', label: 'Vision nocturne testée sur toutes les caméras extérieures', critical: true },
          { id: 'rec-c-4', label: 'Nommage des caméras conforme au plan de caméra' },
          { id: 'rec-c-5', label: 'Firmware caméras à jour sur la version validée' },
        ],
      },
      {
        id: 'recette-enregistrement',
        title: 'Enregistrement',
        items: [
          { id: 'rec-e-1', label: 'Enregistrement continu ou sur détection validé sur toutes les caméras', critical: true },
          { id: 'rec-e-2', label: 'Test de relecture effectué (H-24 minimum)', critical: true },
          { id: 'rec-e-3', label: 'Durée de rétention conforme au cahier des charges', critical: true },
          { id: 'rec-e-4', label: 'Export vidéo testé (format lisible sans logiciel propriétaire si exigé)' },
        ],
      },
      {
        id: 'recette-securite',
        title: 'Sécurité',
        items: [
          { id: 'rec-s-1', label: 'Mots de passe changés sur tous les équipements (caméras, NVR, switches)', critical: true },
          { id: 'rec-s-2', label: 'Accès à distance sécurisé (VPN ou certificat HTTPS) si applicable' },
          { id: 'rec-s-3', label: 'Accès ONVIF limité aux comptes autorisés' },
        ],
      },
      {
        id: 'recette-doc',
        title: 'Documentation',
        items: [
          { id: 'rec-d-1', label: 'PV de recette signé par le client', critical: true },
          { id: 'rec-d-2', label: 'Identifiants remis au client dans un document sécurisé', critical: true },
          { id: 'rec-d-3', label: 'Guide d\'utilisation remis au client' },
          { id: 'rec-d-4', label: 'Contrat de maintenance signé si applicable' },
        ],
      },
    ],
    notes: 'La recette engage la responsabilité du technicien et de l\'entreprise. Ne jamais signer sans avoir vérifié l\'ensemble des points.',
  },

  {
    id: 'cl-switch-poe-deployment',
    title: 'Déploiement switch PoE — mise en service',
    description: "Procédure de mise en service d'un switch PoE pour un réseau de caméras IP.",
    category: 'poe-switch',
    tags: ['switch', 'poe', 'déploiement', 'mise en service', 'cisco'],
    estimatedTime: '30-45 min',
    sections: [
      {
        id: 'sw-hw',
        title: 'Matériel',
        items: [
          { id: 'sw-h-1', label: 'Switch alimenté et démarré', critical: true },
          { id: 'sw-h-2', label: 'Alimentation secteur redondante ou UPS si applicable' },
          { id: 'sw-h-3', label: 'Budget PoE total calculé (somme des caméras + 20%)', critical: true },
          { id: 'sw-h-4', label: 'Firmware switch à jour si recommandé' },
        ],
      },
      {
        id: 'sw-config',
        title: 'Configuration de base',
        items: [
          { id: 'sw-c-1', label: 'IP de management configurée', critical: true },
          { id: 'sw-c-2', label: 'Nom d\'hôte configuré', description: 'Facilite l\'identification dans les outils réseau' },
          { id: 'sw-c-3', label: 'Mot de passe SSH/Telnet changé', critical: true },
          { id: 'sw-c-4', label: 'NTP configuré', description: 'Indispensable pour les logs horodatés' },
          { id: 'sw-c-5', label: 'Banner de connexion configurée si politique de sécurité' },
        ],
      },
      {
        id: 'sw-vlan',
        title: 'VLANs',
        items: [
          { id: 'sw-v-1', label: 'VLAN caméra créé', critical: true, command: 'show vlan brief' },
          { id: 'sw-v-2', label: 'Ports caméra configurés en access sur le VLAN caméra', critical: true },
          { id: 'sw-v-3', label: 'Port uplink configuré en trunk avec VLANs autorisés', critical: true },
          { id: 'sw-v-4', label: 'VLAN de management sur interface de management' },
        ],
      },
      {
        id: 'sw-poe',
        title: 'PoE',
        items: [
          { id: 'sw-p-1', label: 'PoE actif sur les ports caméra', command: 'show power inline' },
          { id: 'sw-p-2', label: 'Pas de port PoE en erreur (Fault/Err-disable)' },
          { id: 'sw-p-3', label: 'Puissance PoE par port cohérente avec la classe de la caméra' },
        ],
      },
      {
        id: 'sw-validation',
        title: 'Validation',
        items: [
          { id: 'sw-val-1', label: 'Configuration sauvegardée (write memory / copy run start)', critical: true },
          { id: 'sw-val-2', label: 'Test de connectivité depuis une caméra test : IP obtenue, ping OK', critical: true },
          { id: 'sw-val-3', label: 'Spanning Tree actif et stable', command: 'show spanning-tree' },
        ],
      },
    ],
    notes: 'Toujours sauvegarder la configuration avant et après l\'intervention (write memory). En cas de problème, restauration possible depuis la configuration sauvegardée.',
  },

  {
    id: 'cl-technicien-workstation',
    title: 'Vérification poste technicien terrain',
    description: "Checklist de préparation et validation du poste portable d'un technicien réseau/vidéosurveillance avant une intervention.",
    category: 'terrain-tips',
    tags: ['poste', 'technicien', 'outils', 'préparation', 'terrain'],
    estimatedTime: '10-15 min',
    sections: [
      {
        id: 'tech-tools',
        title: 'Outils logiciels',
        items: [
          { id: 'tech-t-1', label: 'Nmap installé et fonctionnel', command: 'nmap --version' },
          { id: 'tech-t-2', label: 'Wireshark installé et droits de capture vérifiés' },
          { id: 'tech-t-3', label: 'VLC installé (test de flux RTSP)' },
          { id: 'tech-t-4', label: 'ONVIF Device Manager disponible' },
          { id: 'tech-t-5', label: 'NetOps Companion accessible (PWA installée ou offline)' },
          { id: 'tech-t-6', label: 'Navigateur avec accès aux interfaces web d\'administration' },
        ],
      },
      {
        id: 'tech-network',
        title: 'Réseau',
        items: [
          { id: 'tech-n-1', label: 'Carte réseau filaire (RJ45) disponible ou adaptateur USB-RJ45', critical: true },
          { id: 'tech-n-2', label: 'Câble RJ45 de rechange dans le sac', critical: true },
          { id: 'tech-n-3', label: 'IP statique configurée rapidement (procédure mémorisée)' },
          { id: 'tech-n-4', label: 'Accès Wi-Fi de secours disponible si nécessaire' },
        ],
      },
      {
        id: 'tech-docs',
        title: 'Documentation',
        items: [
          { id: 'tech-d-1', label: 'Plan réseau du site disponible (PDF offline ou papier)', critical: true },
          { id: 'tech-d-2', label: 'Tableau IP (adresses réservées, VLAN) disponible' },
          { id: 'tech-d-3', label: 'Credentials d\'accès aux équipements disponibles (gestionnaire de mots de passe)', critical: true },
          { id: 'tech-d-4', label: 'Numéros de support constructeurs disponibles' },
        ],
      },
    ],
  },

  {
    id: 'cl-cyber-network-audit',
    title: 'Audit sécurité réseau caméras',
    description: "Vérifications de sécurité à effectuer sur une installation de vidéosurveillance IP.",
    category: 'cybersecurity',
    tags: ['cybersécurité', 'audit', 'réseau', 'caméras', 'sécurité'],
    estimatedTime: '45-60 min',
    sections: [
      {
        id: 'cyber-credentials',
        title: 'Gestion des accès',
        items: [
          { id: 'cyb-c-1', label: 'Aucune caméra avec le mot de passe usine', critical: true },
          { id: 'cyb-c-2', label: 'Compte admin avec mot de passe complexe sur chaque caméra', critical: true },
          { id: 'cyb-c-3', label: 'Comptes de test ou temporaires supprimés' },
          { id: 'cyb-c-4', label: 'Accès Telnet désactivé sur les switches (SSH uniquement)', critical: true },
          { id: 'cyb-c-5', label: 'Mot de passe NVR changé' },
        ],
      },
      {
        id: 'cyber-network',
        title: 'Segmentation réseau',
        items: [
          { id: 'cyb-n-1', label: 'Caméras sur un VLAN dédié isolé du réseau bureautique', critical: true },
          { id: 'cyb-n-2', label: 'ACL limitant l\'accès au VLAN caméra', critical: true },
          { id: 'cyb-n-3', label: 'Accès Internet des caméras bloqué si non nécessaire' },
          { id: 'cyb-n-4', label: 'NTP interne utilisé (pas de serveur NTP externe pour les caméras)' },
        ],
      },
      {
        id: 'cyber-firmware',
        title: 'Firmwares et mises à jour',
        items: [
          { id: 'cyb-f-1', label: 'Version firmware caméras vérifiée (CVE connues ?)' },
          { id: 'cyb-f-2', label: 'Firmware NVR à jour' },
          { id: 'cyb-f-3', label: 'Firmware switches à jour (sécurité)' },
          { id: 'cyb-f-4', label: 'Processus de mise à jour firmware documenté' },
        ],
      },
      {
        id: 'cyber-exposure',
        title: 'Exposition réseau',
        items: [
          { id: 'cyb-e-1', label: 'Scan Nmap des caméras effectué — ports inutiles fermés', critical: true, command: 'nmap --top-ports 100 IP' },
          { id: 'cyb-e-2', label: 'UPnP désactivé sur les caméras et le routeur', critical: true },
          { id: 'cyb-e-3', label: 'Pas de redirection de port vers les caméras depuis Internet', critical: true },
          { id: 'cyb-e-4', label: 'Services inutiles désactivés sur les caméras (FTP, Telnet, SNMP v1/v2)' },
        ],
      },
    ],
    notes: 'Un audit de sécurité doit être planifié annuellement. Les CVE sur les caméras IP sont nombreuses et régulièrement publiées. Maintenir les firmwares à jour est la mesure la plus efficace.',
  },

  // ── Checklists Lot 1 ──────────────────────────────────────────────────
  {
    id: 'cl-switch-config-audit',
    title: 'Audit configuration switch managé',
    description: "Vérification complète de la configuration d'un switch managé avant ou après installation.",
    category: 'poe-switch',
    tags: ['switch', 'audit', 'vlan', 'sécurité', 'configuration'],
    estimatedTime: '20-30 min',
    sections: [
      {
        id: 'sca-identity',
        title: 'Identification du switch',
        items: [
          { id: 'sca-id-1', label: 'Relevé du hostname, modèle et numéro de série', critical: false },
          { id: 'sca-id-2', label: 'Version firmware notée et comparée à la dernière version disponible', critical: true },
          { id: 'sca-id-3', label: 'IP de management configurée et documentée', critical: true },
        ],
      },
      {
        id: 'sca-vlan',
        title: 'Configuration VLAN',
        items: [
          { id: 'sca-vlan-1', label: 'Liste des VLANs configurés vérifiée et conforme au plan de nommage', critical: true },
          { id: 'sca-vlan-2', label: 'Aucun port en VLAN 1 (VLAN de management par défaut)', critical: true },
          { id: 'sca-vlan-3', label: 'Ports access affectés au bon VLAN', critical: true },
          { id: 'sca-vlan-4', label: 'Ports trunk configurés avec VLANs autorisés explicites', critical: false },
        ],
        commands: ['show vlan brief', 'show interfaces trunk'],
      },
      {
        id: 'sca-stp',
        title: 'Spanning Tree Protocol',
        items: [
          { id: 'sca-stp-1', label: 'STP activé sur tous les VLANs', critical: true },
          { id: 'sca-stp-2', label: 'PortFast activé uniquement sur les ports access (terminaux)', critical: false },
          { id: 'sca-stp-3', label: 'BPDU Guard activé sur les ports PortFast', critical: true },
          { id: 'sca-stp-4', label: 'Root Bridge configuré intentionnellement (pas par défaut)', critical: false },
        ],
        commands: ['show spanning-tree summary', 'show spanning-tree detail'],
      },
      {
        id: 'sca-poe',
        title: 'PoE (si applicable)',
        items: [
          { id: 'sca-poe-1', label: 'Budget PoE total noté et suffisant pour les équipements', critical: true },
          { id: 'sca-poe-2', label: 'Consommation PoE actuelle relevée (< 80% du budget)', critical: true },
          { id: 'sca-poe-3', label: 'Priorité PoE configurée sur les équipements critiques', critical: false },
        ],
        commands: ['show power inline'],
      },
      {
        id: 'sca-security',
        title: 'Sécurité',
        items: [
          { id: 'sca-sec-1', label: 'Mot de passe de management changé (pas le défaut)', critical: true },
          { id: 'sca-sec-2', label: 'Telnet désactivé, SSH activé uniquement', critical: true },
          { id: 'sca-sec-3', label: 'SNMP community string changée si SNMP actif', critical: true },
          { id: 'sca-sec-4', label: 'Ports non utilisés désactivés (shutdown)', critical: false },
        ],
        commands: ['show line', 'show running-config | include snmp|telnet|ssh'],
      },
    ],
    notes: "Effectuer cet audit systématiquement lors de l'installation et après toute intervention sur la configuration.",
  },
  {
    id: 'cl-linux-network-check',
    title: 'Vérification réseau équipement Linux (NVR / serveur)',
    description: "Procédure de vérification réseau sur un équipement Linux (NVR, serveur VMS, passerelle).",
    category: 'network-config',
    tags: ['linux', 'réseau', 'nvr', 'serveur', 'vérification'],
    estimatedTime: '10-15 min',
    sections: [
      {
        id: 'lnc-interfaces',
        title: 'État des interfaces',
        items: [
          { id: 'lnc-if-1', label: 'Interface réseau principale UP', critical: true },
          { id: 'lnc-if-2', label: 'Adresse IP correcte (pas 169.254.x.x)', critical: true },
          { id: 'lnc-if-3', label: 'Masque de sous-réseau correct', critical: true },
          { id: 'lnc-if-4', label: 'MTU à 1500 (ou adaptée si VLAN/tunnels)', critical: false },
        ],
        commands: ['ip addr show', 'ip link show'],
      },
      {
        id: 'lnc-routing',
        title: 'Routage',
        items: [
          { id: 'lnc-rt-1', label: 'Route par défaut présente et correcte', critical: true },
          { id: 'lnc-rt-2', label: 'Passerelle accessible (ping)', critical: true },
          { id: 'lnc-rt-3', label: 'Pas de routes statiques conflictuelles', critical: false },
        ],
        commands: ['ip route show', 'ping -c 4 <passerelle>'],
      },
      {
        id: 'lnc-dns',
        title: 'DNS',
        items: [
          { id: 'lnc-dns-1', label: 'Serveurs DNS configurés dans /etc/resolv.conf', critical: true },
          { id: 'lnc-dns-2', label: 'Résolution de noms fonctionnelle', critical: true },
        ],
        commands: ['cat /etc/resolv.conf', 'dig google.com +short'],
      },
      {
        id: 'lnc-ports',
        title: 'Services et ports',
        items: [
          { id: 'lnc-port-1', label: 'Seuls les ports nécessaires sont en écoute', critical: true },
          { id: 'lnc-port-2', label: 'Service RTSP en écoute sur port 554 (si NVR)', critical: false },
          { id: 'lnc-port-3', label: 'Interface web de management accessible', critical: false },
        ],
        commands: ['ss -tlnp', 'ss -tlnp | grep :554'],
      },
    ],
    notes: "Sur les NVR Linux, l'accès SSH peut être désactivé par défaut. Utiliser l'interface de management constructeur si disponible.",
  },
  {
    id: 'cl-wifi-site-survey',
    title: 'Validation couverture WiFi terrain',
    description: "Checklist de validation de la couverture WiFi sur un site avant mise en service.",
    category: 'connectivity',
    tags: ['wifi', 'site survey', 'couverture', 'signal', 'validation'],
    estimatedTime: '30-60 min',
    sections: [
      {
        id: 'wss-preparation',
        title: 'Préparation',
        items: [
          { id: 'wss-prep-1', label: 'Plan du site disponible', critical: false },
          { id: 'wss-prep-2', label: 'Liste des points d\'accès et leur emplacement documentée', critical: false },
          { id: 'wss-prep-3', label: 'SSID et paramètres de connexion disponibles', critical: true },
          { id: 'wss-prep-4', label: 'Outil de mesure WiFi disponible (smartphone, outil dédié)', critical: true },
        ],
      },
      {
        id: 'wss-coverage',
        title: 'Mesures de couverture',
        items: [
          { id: 'wss-cov-1', label: 'Signal ≥ -65 dBm dans toutes les zones opérationnelles', critical: true },
          { id: 'wss-cov-2', label: 'Pas de zones mortes dans les périmètres critiques', critical: true },
          { id: 'wss-cov-3', label: 'Roaming testé entre les différents points d\'accès', critical: false },
          { id: 'wss-cov-4', label: 'Signal mesuré aux angles et zones les plus éloignées', critical: true },
        ],
        commands: ['netsh wlan show interfaces'],
      },
      {
        id: 'wss-connectivity',
        title: 'Tests de connectivité',
        items: [
          { id: 'wss-conn-1', label: 'Connexion au SSID établie sans erreur', critical: true },
          { id: 'wss-conn-2', label: 'IP DHCP obtenue correctement (pas d\'APIPA)', critical: true },
          { id: 'wss-conn-3', label: 'Latence vers la passerelle < 20ms', critical: true },
          { id: 'wss-conn-4', label: 'Débit suffisant pour l\'usage prévu (flux vidéo, VoIP…)', critical: true },
        ],
        commands: ['ping -n 10 <passerelle>', 'ipconfig'],
      },
      {
        id: 'wss-interference',
        title: 'Interférences',
        items: [
          { id: 'wss-int-1', label: 'Canaux WiFi vérifiés et optimisés (1, 6, 11 en 2.4 GHz)', critical: false },
          { id: 'wss-int-2', label: 'Bande 5 GHz disponible et utilisée si possible', critical: false },
          { id: 'wss-int-3', label: 'Absence d\'équipements interférants identifiée (four micro-ondes, Bluetooth…)', critical: false },
        ],
        commands: ['netsh wlan show networks mode=bssid'],
      },
    ],
    notes: "Pour les installations vidéosurveillance WiFi, viser un signal minimum de -60 dBm pour garantir la stabilité des flux vidéo. Documenter les mesures avec captures d'écran.",
  },
  {
    id: 'cl-maintenance-preventive-camera',
    title: 'Maintenance préventive caméra IP',
    description: "Checklist de maintenance préventive périodique pour une caméra IP installée.",
    category: 'video-surveillance',
    tags: ['caméra', 'maintenance', 'préventive', 'vérification', 'périodique'],
    estimatedTime: '15-20 min par caméra',
    sections: [
      {
        id: 'mpc-physique',
        title: 'État physique',
        items: [
          { id: 'mpc-phy-1', label: 'Propreté optique vérifiée (vitre, optique)', critical: true },
          { id: 'mpc-phy-2', label: 'Boîtier intact, pas de dommages visibles', critical: false },
          { id: 'mpc-phy-3', label: 'Fixation mécanique ferme, pas de jeu', critical: true },
          { id: 'mpc-phy-4', label: 'Câbles bien fixés, pas de tension ou pli excessif', critical: false },
          { id: 'mpc-phy-5', label: 'Joints d\'étanchéité en bon état (si extérieur)', critical: true },
        ],
      },
      {
        id: 'mpc-image',
        title: 'Qualité image',
        items: [
          { id: 'mpc-img-1', label: 'Image nette et sans condensation', critical: true },
          { id: 'mpc-img-2', label: 'Orientation correcte (champ de vision non obstrué)', critical: true },
          { id: 'mpc-img-3', label: 'Mode nuit / infrarouge fonctionnel (si applicable)', critical: false },
          { id: 'mpc-img-4', label: 'WDR / BLC correctement configurés pour les contre-jours', critical: false },
        ],
        commands: ['cmd-rtsp-vlc', 'cmd-ffprobe-rtsp'],
      },
      {
        id: 'mpc-reseau',
        title: 'Réseau',
        items: [
          { id: 'mpc-net-1', label: 'Caméra accessible en ping', critical: true },
          { id: 'mpc-net-2', label: 'Interface web accessible', critical: false },
          { id: 'mpc-net-3', label: 'IP statique ou réservation DHCP vérifiée', critical: true },
          { id: 'mpc-net-4', label: 'Firmware vérifié et à jour si patch sécurité disponible', critical: false },
        ],
        commands: ['cmd-ping-basic', 'cmd-camera-web-access'],
      },
      {
        id: 'mpc-enregistrement',
        title: 'Enregistrement',
        items: [
          { id: 'mpc-rec-1', label: 'Caméra visible dans le VMS', critical: true },
          { id: 'mpc-rec-2', label: 'Enregistrement actif (statut ON dans le VMS)', critical: true },
          { id: 'mpc-rec-3', label: 'Relecture d\'un enregistrement récent testée', critical: true },
          { id: 'mpc-rec-4', label: 'Couverture de rétention conforme aux exigences', critical: false },
        ],
      },
    ],
    notes: "Fréquence recommandée : semestrielle pour les caméras extérieures, annuelle pour les intérieures. Documenter les anomalies et les corrections apportées.",
  },
  {
    id: 'cl-network-incident-response',
    title: 'Réponse à un incident réseau (protocole terrain)',
    description: "Procédure de réponse à un incident réseau en mode terrain : étapes ordonnées pour diagnostiquer et rétablir le service.",
    category: 'terrain-tips',
    tags: ['incident', 'réseau', 'urgence', 'protocole', 'diagnostic', 'terrain'],
    estimatedTime: '30-120 min (selon gravité)',
    sections: [
      {
        id: 'nir-triage',
        title: 'Triage initial',
        items: [
          { id: 'nir-t-1', label: 'Périmètre de l\'incident identifié (un équipement, un segment, tout le site)', critical: true },
          { id: 'nir-t-2', label: 'Heure de début d\'incident notée', critical: true },
          { id: 'nir-t-3', label: 'Changements récents répertoriés (nouveau matériel, mise à jour, reconfiguration)', critical: true },
          { id: 'nir-t-4', label: 'Équipements impactés listés', critical: true },
        ],
      },
      {
        id: 'nir-isolation',
        title: 'Isolation du problème',
        items: [
          { id: 'nir-iso-1', label: 'Test de connectivité physique (câbles, LEDs switch)', critical: true },
          { id: 'nir-iso-2', label: 'Test de connectivité locale (ping gateway)', critical: true },
          { id: 'nir-iso-3', label: 'Test de résolution DNS', critical: true },
          { id: 'nir-iso-4', label: 'Test de connectivité Internet / réseau étendu', critical: false },
          { id: 'nir-iso-5', label: 'Problème isolé : couche physique / réseau / application', critical: true },
        ],
        commands: ['cmd-ping-basic', 'cmd-tracert', 'cmd-nslookup-basic'],
      },
      {
        id: 'nir-diagnostics',
        title: 'Diagnostics approfondis',
        items: [
          { id: 'nir-diag-1', label: 'Logs switch/routeur consultés', critical: false },
          { id: 'nir-diag-2', label: 'Table ARP vérifiée (pas de conflit ou d\'entrée suspecte)', critical: false },
          { id: 'nir-diag-3', label: 'Table de routage vérifiée', critical: false },
          { id: 'nir-diag-4', label: 'Capture Wireshark lancée si nécessaire', critical: false },
        ],
        commands: ['cmd-arp-a', 'cmd-route-print', 'cmd-switch-show-log'],
      },
      {
        id: 'nir-resolution',
        title: 'Résolution et validation',
        items: [
          { id: 'nir-res-1', label: 'Cause racine identifiée', critical: true },
          { id: 'nir-res-2', label: 'Correction appliquée', critical: true },
          { id: 'nir-res-3', label: 'Tests de validation effectués et concluants', critical: true },
          { id: 'nir-res-4', label: 'Tous les équipements impactés vérifiés', critical: true },
          { id: 'nir-res-5', label: 'Rapport d\'incident préparé (cause, correction, prévention)', critical: false },
        ],
      },
    ],
    notes: "En cas d\'incident grave (réseau site down), prévenir immédiatement le responsable avant de commencer les diagnostics. Ne jamais effectuer de changements de configuration sans autorisation.",
  },

  // ── Checklists Lot 2 ──────────────────────────────────────────────────
  {
    id: 'cl-vms-installation',
    title: 'Installation et validation VMS',
    description: "Procédure de validation d'un logiciel VMS (Video Management System) avant mise en service.",
    category: 'video-surveillance',
    tags: ['vms', 'installation', 'validation', 'logiciel', 'serveur'],
    estimatedTime: '45-90 min',
    sections: [
      {
        id: 'vms-server',
        title: 'Serveur VMS',
        items: [
          { id: 'vms-srv-1', label: 'OS Windows Server à jour (patchs de sécurité appliqués)', critical: true },
          { id: 'vms-srv-2', label: 'Ressources suffisantes : RAM, CPU, stockage (voir prérequis éditeur)', critical: true },
          { id: 'vms-srv-3', label: 'Antivirus configuré avec exclusions dossiers VMS', critical: false },
          { id: 'vms-srv-4', label: 'Mise à jour automatique Windows désactivée (hors fenêtre de maintenance)', critical: false },
          { id: 'vms-srv-5', label: 'IP statique configurée sur le serveur VMS', critical: true },
        ],
        commands: ['cmd-ps-get-netipaddress'],
      },
      {
        id: 'vms-install',
        title: 'Installation logicielle',
        items: [
          { id: 'vms-inst-1', label: 'Version VMS compatible avec les caméras du site', critical: true },
          { id: 'vms-inst-2', label: 'Licence activée et valide', critical: true },
          { id: 'vms-inst-3', label: 'Services VMS démarrés et configurés en démarrage automatique', critical: true },
          { id: 'vms-inst-4', label: 'Stockage vidéo configuré (chemin, capacité, rétention)', critical: true },
          { id: 'vms-inst-5', label: 'Base de données VMS en bon état', critical: false },
        ],
      },
      {
        id: 'vms-cameras',
        title: 'Intégration caméras',
        items: [
          { id: 'vms-cam-1', label: 'Toutes les caméras prévues ajoutées et en ligne', critical: true },
          { id: 'vms-cam-2', label: 'Flux vidéo visibles sur toutes les caméras', critical: true },
          { id: 'vms-cam-3', label: 'Enregistrement actif sur toutes les caméras', critical: true },
          { id: 'vms-cam-4', label: 'Relecture d\'enregistrements testée', critical: true },
          { id: 'vms-cam-5', label: 'Alertes de caméra hors ligne configurées', critical: false },
        ],
        commands: ['cmd-rtsp-vlc', 'cmd-ping-basic'],
      },
      {
        id: 'vms-network',
        title: 'Réseau et sécurité',
        items: [
          { id: 'vms-net-1', label: 'VMS accessible depuis les postes clients', critical: true },
          { id: 'vms-net-2', label: 'Ports pare-feu ouverts (8080, 443, etc.)', critical: true },
          { id: 'vms-net-3', label: 'Accès distant sécurisé configuré (VPN ou HTTPS)', critical: false },
          { id: 'vms-net-4', label: 'Comptes utilisateurs créés avec les bons niveaux d\'accès', critical: true },
        ],
      },
    ],
    notes: "Réaliser un test de coupure de réseau (débrancher une caméra) pour vérifier que l'alerte remonte bien dans le VMS.",
  },
  {
    id: 'cl-cyber-hardening-server',
    title: 'Durcissement sécurité serveur Windows',
    description: "Checklist de durcissement basique d'un serveur Windows (VMS, NVR, serveur réseau).",
    category: 'cybersecurity',
    tags: ['durcissement', 'hardening', 'sécurité', 'serveur', 'windows'],
    estimatedTime: '30-60 min',
    sections: [
      {
        id: 'chs-accounts',
        title: 'Comptes utilisateurs',
        items: [
          { id: 'chs-acc-1', label: 'Compte Administrateur local renommé ou désactivé', critical: true },
          { id: 'chs-acc-2', label: 'Mot de passe administrateur fort (12+ caractères, complexe)', critical: true },
          { id: 'chs-acc-3', label: 'Aucun compte invité actif', critical: true },
          { id: 'chs-acc-4', label: 'Seuls les comptes nécessaires ont des droits admin locaux', critical: true },
          { id: 'chs-acc-5', label: 'Politique de verrouillage de compte configurée', critical: false },
        ],
        commands: ['cmd-ps-get-localuser', 'cmd-ps-get-localgroup'],
      },
      {
        id: 'chs-services',
        title: 'Services et ports',
        items: [
          { id: 'chs-svc-1', label: 'Services non nécessaires désactivés (Bluetooth, Fax, etc.)', critical: false },
          { id: 'chs-svc-2', label: 'RDP désactivé si non utilisé', critical: true },
          { id: 'chs-svc-3', label: 'Partages SMB limités au strict nécessaire', critical: true },
          { id: 'chs-svc-4', label: 'Seuls les ports nécessaires sont ouverts dans le pare-feu', critical: true },
        ],
        commands: ['cmd-ps-open-ports-audit', 'cmd-ps-check-rdp', 'cmd-ps-check-shares'],
      },
      {
        id: 'chs-updates',
        title: 'Mises à jour et antivirus',
        items: [
          { id: 'chs-upd-1', label: 'Windows Update : patchs de sécurité récents appliqués', critical: true },
          { id: 'chs-upd-2', label: 'Windows Defender actif ou antivirus tiers installé', critical: true },
          { id: 'chs-upd-3', label: 'Base de définitions antivirus récente', critical: true },
        ],
        commands: ['cmd-ps-defender-status'],
      },
      {
        id: 'chs-audit',
        title: 'Audit et journalisation',
        items: [
          { id: 'chs-aud-1', label: 'Audit des connexions activé (réussies et échouées)', critical: true },
          { id: 'chs-aud-2', label: 'Logs de sécurité avec taille suffisante (> 100 MB)', critical: false },
          { id: 'chs-aud-3', label: 'Journaux centralisés sur un SIEM ou serveur de logs (si disponible)', critical: false },
        ],
        commands: ['cmd-ps-audit-policy', 'cmd-ps-event-log'],
      },
    ],
    notes: "Ce durcissement est un minimum. Pour des environnements sensibles, se référer aux guides CIS Benchmark ou ANSSI.",
  },
  {
    id: 'cl-network-new-site',
    title: 'Préparation réseau — Ouverture d\'un nouveau site',
    description: "Checklist de préparation du réseau avant l'installation d'équipements sur un nouveau site.",
    category: 'network-config',
    tags: ['réseau', 'nouveau site', 'préparation', 'infrastructure', 'déploiement'],
    estimatedTime: '60-120 min',
    sections: [
      {
        id: 'nns-infra',
        title: 'Infrastructure physique',
        items: [
          { id: 'nns-inf-1', label: 'Plan de câblage réseau disponible et à jour', critical: true },
          { id: 'nns-inf-2', label: 'Câbles testés et certifiés (Cat5e minimum, Cat6 recommandé)', critical: true },
          { id: 'nns-inf-3', label: 'Baie réseau propre, câblage organisé et étiqueté', critical: false },
          { id: 'nns-inf-4', label: 'Alimentation électrique redondante pour les équipements critiques', critical: false },
          { id: 'nns-inf-5', label: 'Onduleur (UPS) présent pour switches et routeur', critical: true },
        ],
      },
      {
        id: 'nns-switches',
        title: 'Configuration switches',
        items: [
          { id: 'nns-sw-1', label: 'VLANs créés et documentés (gestion, caméra, données, IoT)', critical: true },
          { id: 'nns-sw-2', label: 'Ports access configurés sur les bons VLANs', critical: true },
          { id: 'nns-sw-3', label: 'Ports trunk configurés entre switches', critical: true },
          { id: 'nns-sw-4', label: 'STP/RSTP activé et Root Bridge configuré', critical: true },
          { id: 'nns-sw-5', label: 'Budget PoE vérifié et suffisant pour toutes les caméras', critical: true },
        ],
        commands: ['cmd-switch-show-vlan', 'cmd-switch-show-poe'],
      },
      {
        id: 'nns-services',
        title: 'Services réseau',
        items: [
          { id: 'nns-svc-1', label: 'DHCP serveur configuré avec les bons pools par VLAN', critical: true },
          { id: 'nns-svc-2', label: 'DNS configuré et fonctionnel', critical: true },
          { id: 'nns-svc-3', label: 'NTP configuré sur tous les équipements', critical: true },
          { id: 'nns-svc-4', label: 'Plan d\'adressage IP documenté et validé', critical: true },
        ],
        commands: ['cmd-nslookup-basic', 'cmd-ipconfig-all'],
      },
      {
        id: 'nns-validation',
        title: 'Validation avant installation',
        items: [
          { id: 'nns-val-1', label: 'Connectivité inter-VLANs testée', critical: true },
          { id: 'nns-val-2', label: 'Accès Internet fonctionnel depuis le réseau', critical: true },
          { id: 'nns-val-3', label: 'Accès DHCP fonctionnel sur tous les VLANs', critical: true },
          { id: 'nns-val-4', label: 'Documentation réseau finalisée et partagée', critical: false },
        ],
        commands: ['cmd-ping-basic', 'cmd-tracert'],
      },
    ],
    notes: "Un site bien préparé réduit les problèmes lors de l'installation des équipements. Ne pas commencer l'installation si les services réseau de base ne sont pas opérationnels.",
  },
  {
    id: 'cl-poe-camera-deployment',
    title: 'Déploiement caméras PoE — Validation complète',
    description: "Procédure de validation complète lors du déploiement d'un ensemble de caméras PoE sur un site.",
    category: 'video-surveillance',
    tags: ['caméra', 'poe', 'déploiement', 'validation', 'installation'],
    estimatedTime: '20-30 min par caméra',
    sections: [
      {
        id: 'pcd-poe',
        title: 'Alimentation PoE',
        items: [
          { id: 'pcd-poe-1', label: 'Classe PoE de la caméra vérifiée (IEEE 802.3af/at/bt)', critical: true },
          { id: 'pcd-poe-2', label: 'Budget PoE disponible sur le switch avant branchement', critical: true },
          { id: 'pcd-poe-3', label: 'LED PoE du port switch active après branchement', critical: true },
          { id: 'pcd-poe-4', label: 'Tension PoE vérifiée si problème de démarrage', critical: false },
        ],
        commands: ['cmd-switch-show-poe'],
      },
      {
        id: 'pcd-network',
        title: 'Réseau',
        items: [
          { id: 'pcd-net-1', label: 'Caméra obtient une IP dans le bon sous-réseau', critical: true },
          { id: 'pcd-net-2', label: 'Caméra pingable depuis le poste technicien', critical: true },
          { id: 'pcd-net-3', label: 'Interface web de la caméra accessible', critical: true },
          { id: 'pcd-net-4', label: 'VLAN du port switch correct', critical: true },
        ],
        commands: ['cmd-ping-basic', 'cmd-camera-web-access'],
      },
      {
        id: 'pcd-config',
        title: 'Configuration caméra',
        items: [
          { id: 'pcd-cfg-1', label: 'IP statique ou réservation DHCP configurée', critical: true },
          { id: 'pcd-cfg-2', label: 'Mot de passe par défaut changé', critical: true },
          { id: 'pcd-cfg-3', label: 'Date/heure synchronisée (NTP configuré)', critical: true },
          { id: 'pcd-cfg-4', label: 'Résolution et débit vidéo configurés selon les specs', critical: true },
          { id: 'pcd-cfg-5', label: 'Nom de la caméra configuré (hostname)', critical: false },
        ],
        commands: ['cmd-camera-web-access'],
      },
      {
        id: 'pcd-video',
        title: 'Validation vidéo',
        items: [
          { id: 'pcd-vid-1', label: 'Flux RTSP fonctionnel et lisible', critical: true },
          { id: 'pcd-vid-2', label: 'Caméra intégrée dans le VMS', critical: true },
          { id: 'pcd-vid-3', label: 'Enregistrement actif dans le VMS', critical: true },
          { id: 'pcd-vid-4', label: 'Champ de vision correct et image nette', critical: true },
        ],
        commands: ['cmd-rtsp-vlc', 'cmd-ffprobe-rtsp'],
      },
    ],
    notes: "Documenter le numéro de série, l'IP, le port switch et la position de chaque caméra dans un tableau de bord d'installation.",
  },
  {
    id: 'cl-connectivity-troubleshoot',
    title: 'Diagnostic connectivité réseau — Protocole d\'escalade',
    description: "Procédure structurée d'escalade pour diagnostiquer un problème de connectivité réseau en suivant le modèle OSI du bas vers le haut.",
    category: 'connectivity',
    tags: ['connectivité', 'diagnostic', 'escalade', 'osi', 'protocole'],
    estimatedTime: '15-45 min',
    sections: [
      {
        id: 'ct-phy',
        title: 'Couche 1 — Physique',
        items: [
          { id: 'ct-phy-1', label: 'Câble branché aux deux extrémités', critical: true },
          { id: 'ct-phy-2', label: 'LED du port switch active (lien détecté)', critical: true },
          { id: 'ct-phy-3', label: 'Vitesse de lien correcte (1 Gbps attendu)', critical: false },
          { id: 'ct-phy-4', label: 'Test avec un câble de remplacement effectué', critical: false },
        ],
        commands: ['cmd-check-cable-speed'],
      },
      {
        id: 'ct-l2',
        title: 'Couche 2 — Liaison',
        items: [
          { id: 'ct-l2-1', label: 'Port switch opérationnel (not Down, not err-disabled)', critical: true },
          { id: 'ct-l2-2', label: 'VLAN du port correct', critical: true },
          { id: 'ct-l2-3', label: 'Entrée ARP présente pour l\'IP de destination', critical: false },
        ],
        commands: ['cmd-switch-show-interfaces', 'cmd-arp-a'],
      },
      {
        id: 'ct-l3',
        title: 'Couche 3 — Réseau',
        items: [
          { id: 'ct-l3-1', label: 'Adresse IP valide (pas 169.254.x.x)', critical: true },
          { id: 'ct-l3-2', label: 'Masque de sous-réseau correct', critical: true },
          { id: 'ct-l3-3', label: 'Route par défaut présente', critical: true },
          { id: 'ct-l3-4', label: 'Passerelle pingable', critical: true },
          { id: 'ct-l3-5', label: 'Destination finale pingable', critical: false },
        ],
        commands: ['cmd-ipconfig-all', 'cmd-route-print', 'cmd-ping-basic', 'cmd-tracert'],
      },
      {
        id: 'ct-l4',
        title: 'Couche 4-7 — Transport et Application',
        items: [
          { id: 'ct-l4-1', label: 'Port TCP/UDP requis accessible (Test-NetConnection)', critical: true },
          { id: 'ct-l4-2', label: 'Pare-feu ne bloque pas le port', critical: true },
          { id: 'ct-l4-3', label: 'Service applicatif en écoute sur le port', critical: true },
          { id: 'ct-l4-4', label: 'Résolution DNS fonctionnelle', critical: false },
        ],
        commands: ['cmd-ps-test-firewall-port', 'cmd-nslookup-basic'],
      },
    ],
    notes: "Toujours suivre l'ordre OSI : couche physique → liaison → réseau → transport → application. Un problème de couche 1 non résolu rend l'investigation des couches supérieures inutile.",
  },

  // ── Checklists Lot 3 ──────────────────────────────────────────────────
  {
    id: 'cl-camera-ip-migration',
    title: 'Migration IP caméra (changement de réseau)',
    description: "Procédure de migration d'une caméra IP d'un réseau à un autre (changement d'IP, VLAN ou site).",
    category: 'video-surveillance',
    tags: ['caméra', 'migration', 'ip', 'vlan', 'reconfiguration'],
    estimatedTime: '10-15 min par caméra',
    sections: [
      {
        id: 'cim-preparation',
        title: 'Préparation',
        items: [
          { id: 'cim-prep-1', label: 'Nouvelle IP documentée dans le plan d\'adressage', critical: true },
          { id: 'cim-prep-2', label: 'Configuration actuelle de la caméra notée (IP, subnet, gateway)', critical: true },
          { id: 'cim-prep-3', label: 'Sauvegarde de la configuration complète de la caméra exportée', critical: true },
          { id: 'cim-prep-4', label: 'Plage horaire de migration planifiée (heures creuses)', critical: false },
        ],
        commands: ['cmd-camera-web-access'],
      },
      {
        id: 'cim-migration',
        title: 'Migration réseau',
        items: [
          { id: 'cim-mig-1', label: 'Nouvelle IP assignée dans l\'interface web de la caméra', critical: true },
          { id: 'cim-mig-2', label: 'Nouveau masque et gateway configurés', critical: true },
          { id: 'cim-mig-3', label: 'Paramètres DNS mis à jour si nécessaire', critical: false },
          { id: 'cim-mig-4', label: 'VLAN du port switch mis à jour', critical: true },
        ],
        commands: ['cmd-switch-conf-access-port'],
      },
      {
        id: 'cim-validation',
        title: 'Validation post-migration',
        items: [
          { id: 'cim-val-1', label: 'Caméra pingable à la nouvelle IP', critical: true },
          { id: 'cim-val-2', label: 'Interface web accessible à la nouvelle IP', critical: true },
          { id: 'cim-val-3', label: 'Flux RTSP fonctionnel à la nouvelle IP', critical: true },
          { id: 'cim-val-4', label: 'Mise à jour de l\'IP dans le VMS effectuée', critical: true },
          { id: 'cim-val-5', label: 'Enregistrement actif vérifié dans le VMS', critical: true },
        ],
        commands: ['cmd-ping-basic', 'cmd-rtsp-vlc'],
      },
    ],
    notes: "Mettre à jour le tableau de bord d'installation avec la nouvelle IP dès que la migration est validée.",
  },
  {
    id: 'cl-nmap-audit',
    title: 'Audit réseau avec Nmap — Procédure terrain',
    description: "Procédure structurée d'audit réseau terrain en utilisant Nmap.",
    category: 'discovery',
    tags: ['nmap', 'audit', 'réseau', 'scan', 'inventaire'],
    estimatedTime: '30-60 min',
    sections: [
      {
        id: 'na-autorisation',
        title: 'Autorisation et préparation',
        items: [
          { id: 'na-auth-1', label: 'Autorisation écrite obtenue avant tout scan', critical: true },
          { id: 'na-auth-2', label: 'Plage réseau à scanner définie et documentée', critical: true },
          { id: 'na-auth-3', label: 'Équipements à exclure du scan listés', critical: true },
          { id: 'na-auth-4', label: 'Fenêtre horaire définie (préférer les heures creuses)', critical: false },
        ],
      },
      {
        id: 'na-discovery',
        title: 'Phase 1 — Découverte d\'hôtes',
        items: [
          { id: 'na-disc-1', label: 'Scan de présence (ping scan) effectué sur la plage', critical: true },
          { id: 'na-disc-2', label: 'Nombre d\'hôtes actifs noté', critical: true },
          { id: 'na-disc-3', label: 'IPs actives exportées dans un fichier', critical: false },
        ],
        commands: ['cmd-nmap-ping-scan', 'cmd-nmap-output-file'],
      },
      {
        id: 'na-portscan',
        title: 'Phase 2 — Scan de ports',
        items: [
          { id: 'na-port-1', label: 'Scan des ports courants effectué sur les hôtes actifs', critical: true },
          { id: 'na-port-2', label: 'Ports HTTP/HTTPS relevés (80, 443, 8080, 8443)', critical: false },
          { id: 'na-port-3', label: 'Ports RTSP relevés (554)', critical: false },
          { id: 'na-port-4', label: 'Ports SSH/Telnet relevés (22, 23)', critical: true },
          { id: 'na-port-5', label: 'Ports sensibles ouverts notés (21, 23, 161)', critical: true },
        ],
        commands: ['cmd-nmap-fast-scan', 'cmd-nmap-service'],
      },
      {
        id: 'na-services',
        title: 'Phase 3 — Identification des services',
        items: [
          { id: 'na-svc-1', label: 'Versions des services identifiées sur les ports ouverts', critical: false },
          { id: 'na-svc-2', label: 'Équipements identifiés (caméras, switches, serveurs)', critical: true },
          { id: 'na-svc-3', label: 'Équipements inattendus ou non documentés notés', critical: true },
        ],
        commands: ['cmd-nmap-version-detect'],
      },
      {
        id: 'na-rapport',
        title: 'Rapport',
        items: [
          { id: 'na-rep-1', label: 'Résultats exportés dans un fichier lisible', critical: true },
          { id: 'na-rep-2', label: 'Anomalies et équipements inattendus documentés', critical: true },
          { id: 'na-rep-3', label: 'Recommandations de fermeture des ports inutiles rédigées', critical: false },
        ],
        commands: ['cmd-nmap-output-file'],
      },
    ],
    notes: "Ne jamais effectuer de scan sans autorisation. Un scan Nmap peut déclencher des alertes IDS/IPS et des notifications chez les clients.",
  },
  {
    id: 'cl-server-migration',
    title: 'Migration serveur VMS / NVR',
    description: "Checklist de migration d'un serveur VMS ou NVR vers un nouveau matériel.",
    category: 'video-surveillance',
    tags: ['vms', 'nvr', 'migration', 'serveur', 'backup'],
    estimatedTime: '120-240 min',
    sections: [
      {
        id: 'sm-preparation',
        title: 'Préparation',
        items: [
          { id: 'sm-prep-1', label: 'Documentation de la configuration actuelle du serveur', critical: true },
          { id: 'sm-prep-2', label: 'Sauvegarde complète de la base de données VMS', critical: true },
          { id: 'sm-prep-3', label: 'Export de la liste des caméras avec IPs et configurations', critical: true },
          { id: 'sm-prep-4', label: 'Nouveau serveur installé et pré-configuré (OS, IP, stockage)', critical: true },
          { id: 'sm-prep-5', label: 'Fenêtre de maintenance communiquée aux parties prenantes', critical: true },
        ],
      },
      {
        id: 'sm-migration',
        title: 'Migration',
        items: [
          { id: 'sm-mig-1', label: 'VMS installé sur le nouveau serveur', critical: true },
          { id: 'sm-mig-2', label: 'Licence transférée ou réactivée sur le nouveau serveur', critical: true },
          { id: 'sm-mig-3', label: 'Base de données restaurée depuis la sauvegarde', critical: true },
          { id: 'sm-mig-4', label: 'Caméras reconnectées et vérifiées (status En ligne)', critical: true },
          { id: 'sm-mig-5', label: 'Paramètres d\'enregistrement vérifiés', critical: true },
        ],
      },
      {
        id: 'sm-validation',
        title: 'Validation',
        items: [
          { id: 'sm-val-1', label: 'Toutes les caméras en ligne dans le nouveau VMS', critical: true },
          { id: 'sm-val-2', label: 'Flux vidéo live visible sur toutes les caméras', critical: true },
          { id: 'sm-val-3', label: 'Enregistrements actifs vérifiés', critical: true },
          { id: 'sm-val-4', label: 'Relecture d\'un enregistrement récent testée', critical: true },
          { id: 'sm-val-5', label: 'Accès clients (applications) fonctionnels', critical: true },
          { id: 'sm-val-6', label: 'Alertes et événements fonctionnels', critical: false },
        ],
      },
    ],
    notes: "Conserver l'ancien serveur opérationnel pendant 48h après la migration pour pouvoir revenir en arrière en cas de problème.",
  },
  {
    id: 'cl-poe-switch-replacement',
    title: 'Remplacement switch PoE',
    description: "Procédure de remplacement d'un switch PoE sur un site en production.",
    category: 'poe-switch',
    tags: ['switch', 'poe', 'remplacement', 'maintenance', 'production'],
    estimatedTime: '30-60 min',
    sections: [
      {
        id: 'psr-preparation',
        title: 'Préparation',
        items: [
          { id: 'psr-prep-1', label: 'Configuration de l\'ancien switch sauvegardée', critical: true },
          { id: 'psr-prep-2', label: 'Nouveau switch configuré à l\'avance (VLANs, STP, PoE)', critical: true },
          { id: 'psr-prep-3', label: 'Étiquetage des câbles effectué si non étiqueté', critical: true },
          { id: 'psr-prep-4', label: 'Photo de l\'état du câblage actuel prise', critical: false },
          { id: 'psr-prep-5', label: 'Plage horaire de remplacement planifiée', critical: true },
        ],
        commands: ['cmd-switch-show-interfaces', 'cmd-switch-show-vlan'],
      },
      {
        id: 'psr-remplacement',
        title: 'Remplacement physique',
        items: [
          { id: 'psr-rem-1', label: 'Câbles reconnectés aux mêmes ports (en suivant l\'étiquetage)', critical: true },
          { id: 'psr-rem-2', label: 'Câble uplink reconnecté en premier', critical: false },
          { id: 'psr-rem-3', label: 'LED PoE actives sur les ports caméra', critical: true },
          { id: 'psr-rem-4', label: 'LED de lien actives sur tous les ports utilisés', critical: true },
        ],
      },
      {
        id: 'psr-validation',
        title: 'Validation post-remplacement',
        items: [
          { id: 'psr-val-1', label: 'Switch accessible via SSH (IP de management)', critical: true },
          { id: 'psr-val-2', label: 'VLANs configurés et vérifiés', critical: true },
          { id: 'psr-val-3', label: 'Toutes les caméras pingables', critical: true },
          { id: 'psr-val-4', label: 'Flux vidéo visible dans le VMS', critical: true },
          { id: 'psr-val-5', label: 'Budget PoE vérifié (dans les limites)', critical: true },
          { id: 'psr-val-6', label: 'STP convergé (attendre 30-60s)', critical: true },
        ],
        commands: ['cmd-ping-basic', 'cmd-switch-show-poe', 'cmd-switch-spanning-tree'],
      },
    ],
    notes: "Attendre la convergence STP (30-60s avec RSTP) avant de déclarer la restauration complète.",
  },
  {
    id: 'cl-security-audit-network',
    title: 'Audit sécurité réseau — Points de contrôle terrain',
    description: "Checklist d'audit de sécurité réseau orientée terrain pour un technicien en déplacement.",
    category: 'cybersecurity',
    tags: ['sécurité', 'audit', 'réseau', 'terrain', 'pentest léger'],
    estimatedTime: '30-60 min',
    sections: [
      {
        id: 'san-acces',
        title: 'Accès physique et management',
        items: [
          { id: 'san-acc-1', label: 'Accès physique aux équipements actifs sécurisé (baie fermée)', critical: true },
          { id: 'san-acc-2', label: 'Ports console physiques non accessibles sans autorisation', critical: false },
          { id: 'san-acc-3', label: 'Telnet désactivé sur tous les équipements', critical: true },
          { id: 'san-acc-4', label: 'SSH v2 uniquement (pas SSHv1)', critical: true },
          { id: 'san-acc-5', label: 'Mots de passe management différents du défaut constructeur', critical: true },
        ],
        commands: ['cmd-nmap-service'],
      },
      {
        id: 'san-vlans',
        title: 'Segmentation réseau',
        items: [
          { id: 'san-vlan-1', label: 'Réseau caméra isolé dans son propre VLAN', critical: true },
          { id: 'san-vlan-2', label: 'Accès inter-VLAN limité aux flux nécessaires', critical: true },
          { id: 'san-vlan-3', label: 'VLAN de management différent des VLANs de données', critical: true },
          { id: 'san-vlan-4', label: 'Pas d\'équipements non identifiés sur les VLANs critiques', critical: true },
        ],
        commands: ['cmd-switch-show-vlan', 'cmd-nmap-ping-scan'],
      },
      {
        id: 'san-cameras',
        title: 'Sécurité des caméras',
        items: [
          { id: 'san-cam-1', label: 'Identifiants par défaut changés sur toutes les caméras', critical: true },
          { id: 'san-cam-2', label: 'Firmwares caméras vérifiés et à jour', critical: true },
          { id: 'san-cam-3', label: 'Services non nécessaires désactivés (telnet, FTP sur caméras)', critical: true },
          { id: 'san-cam-4', label: 'HTTPS activé sur les interfaces web caméra si possible', critical: false },
        ],
        commands: ['cmd-nmap-script-http', 'cmd-camera-web-access'],
      },
      {
        id: 'san-monitoring',
        title: 'Surveillance et journalisation',
        items: [
          { id: 'san-mon-1', label: 'Logs des équipements accessibles et conservés > 30 jours', critical: false },
          { id: 'san-mon-2', label: 'SNMP community strings changées (pas de "public"/"private")', critical: true },
          { id: 'san-mon-3', label: 'Alertes de sécurité configurées (port err-disable, auth failure)', critical: false },
        ],
        commands: ['cmd-nmap-udp-scan'],
      },
    ],
    notes: "Cet audit de terrain est un premier niveau de contrôle. Pour un audit de sécurité complet, faire appel à un spécialiste en sécurité réseau.",
  },

  // ── Checklists Lot 4 ──────────────────────────────────────────────────
  {
    id: 'cl-ptz-camera-install',
    title: 'Installation caméra PTZ',
    description: "Procédure complète d'installation et de validation d'une caméra PTZ.",
    category: 'video-surveillance',
    tags: ['ptz', 'caméra', 'installation', 'validation', 'pan-tilt-zoom'],
    estimatedTime: '30-45 min',
    sections: [
      {
        id: 'ptz-poe',
        title: 'Alimentation PoE+ / PoE++',
        items: [
          { id: 'ptz-poe-1', label: 'Budget PoE+ (30W) ou PoE++ (60W) disponible selon la fiche technique', critical: true },
          { id: 'ptz-poe-2', label: 'Switch compatible PoE+ ou PoE++ avec budget suffisant', critical: true },
          { id: 'ptz-poe-3', label: 'Câble ≤ 90m (chute de tension PoE sur grande longueur)', critical: true },
        ],
        commands: ['cmd-switch-show-poe'],
      },
      {
        id: 'ptz-network',
        title: 'Réseau',
        items: [
          { id: 'ptz-net-1', label: 'IP statique ou réservation DHCP configurée', critical: true },
          { id: 'ptz-net-2', label: 'Caméra pingable depuis le serveur VMS', critical: true },
          { id: 'ptz-net-3', label: 'Interface web accessible', critical: true },
        ],
        commands: ['cmd-ping-basic', 'cmd-camera-web-access'],
      },
      {
        id: 'ptz-config',
        title: 'Configuration PTZ',
        items: [
          { id: 'ptz-cfg-1', label: 'Protocole PTZ configuré (ONVIF Profile S recommandé)', critical: true },
          { id: 'ptz-cfg-2', label: 'Mouvements Pan/Tilt/Zoom testés depuis l\'interface web', critical: true },
          { id: 'ptz-cfg-3', label: 'Positions préréglées (presets) configurées', critical: false },
          { id: 'ptz-cfg-4', label: 'Tour automatique (auto-tour) configuré si requis', critical: false },
          { id: 'ptz-cfg-5', label: 'Limite de rotation mécanique vérifiée (éviter les câbles sous tension)', critical: true },
        ],
        commands: ['cmd-onvif-ptz'],
      },
      {
        id: 'ptz-vms',
        title: 'Intégration VMS',
        items: [
          { id: 'ptz-vms-1', label: 'Caméra intégrée dans le VMS', critical: true },
          { id: 'ptz-vms-2', label: 'Contrôle PTZ fonctionnel depuis le VMS', critical: true },
          { id: 'ptz-vms-3', label: 'Presets accessibles depuis le VMS', critical: false },
          { id: 'ptz-vms-4', label: 'Enregistrement actif vérifié', critical: true },
        ],
      },
    ],
    notes: "Pour les PTZ en extérieur avec heater/wiper : vérifier systématiquement le budget PoE et tester en mode heater activé.",
  },
  {
    id: 'cl-access-control-camera',
    title: 'Caméra contrôle d\'accès (entrée/sortie)',
    description: "Checklist spécifique pour l'installation d'une caméra sur un point de contrôle d'accès (entrée, portail, interphone).",
    category: 'video-surveillance',
    tags: ['contrôle accès', 'caméra', 'entrée', 'portail', 'ALPR', 'LPR'],
    estimatedTime: '20-30 min',
    sections: [
      {
        id: 'aca-position',
        title: 'Positionnement',
        items: [
          { id: 'aca-pos-1', label: 'Angle de vue optimisé pour la reconnaissance (plaque, visage)', critical: true },
          { id: 'aca-pos-2', label: 'Contre-jour géré (WDR activé si source lumineuse en face)', critical: true },
          { id: 'aca-pos-3', label: 'Zone couverte include 100% du passage', critical: true },
          { id: 'aca-pos-4', label: 'Hauteur de caméra adaptée (≈ 3m pour véhicules, 2m pour piétons)', critical: false },
        ],
      },
      {
        id: 'aca-config',
        title: 'Configuration image',
        items: [
          { id: 'aca-cfg-1', label: 'Résolution suffisante pour la lecture de plaque (2MP minimum)', critical: true },
          { id: 'aca-cfg-2', label: 'WDR activé pour les contre-jours', critical: true },
          { id: 'aca-cfg-3', label: 'Vitesse d\'obturation adaptée (≥ 1/500s pour véhicules en mouvement)', critical: true },
          { id: 'aca-cfg-4', label: 'Zoom optique ajusté pour couvrir la largeur du passage', critical: true },
        ],
        commands: ['cmd-camera-web-access', 'cmd-rtsp-vlc'],
      },
      {
        id: 'aca-validation',
        title: 'Validation opérationnelle',
        items: [
          { id: 'aca-val-1', label: 'Test de lecture de plaque de nuit (IR) et de jour', critical: true },
          { id: 'aca-val-2', label: 'Déclenchement d\'enregistrement sur événement (mouvement, alerte) testé', critical: false },
          { id: 'aca-val-3', label: 'Intégration avec le système de contrôle d\'accès testée si applicable', critical: false },
        ],
      },
    ],
    notes: "Pour les caméras de lecture de plaques (ALPR/LPR), la configuration image est critique. Faire valider par l'éditeur logiciel ALPR.",
  },
  {
    id: 'cl-remote-site-video',
    title: 'Déploiement vidéosurveillance site distant',
    description: "Checklist pour le déploiement d'un système de vidéosurveillance sur un site distant (connexion WAN/VPN).",
    category: 'video-surveillance',
    tags: ['site distant', 'wan', 'vpn', 'bande passante', 'vidéosurveillance', 'remote'],
    estimatedTime: '60-120 min',
    sections: [
      {
        id: 'rsv-bandwidth',
        title: 'Dimensionnement bande passante',
        items: [
          { id: 'rsv-bw-1', label: 'Débit montant disponible sur le lien WAN mesuré', critical: true },
          { id: 'rsv-bw-2', label: 'Débit total des flux vidéo calculé (caméras × bitrate)', critical: true },
          { id: 'rsv-bw-3', label: 'Débit vidéo < 70% du débit montant WAN disponible', critical: true },
          { id: 'rsv-bw-4', label: 'Flux secondaire (substream) configuré pour accès distant', critical: false },
        ],
      },
      {
        id: 'rsv-nvr',
        title: 'NVR local',
        items: [
          { id: 'rsv-nvr-1', label: 'NVR installé localement pour enregistrement local', critical: true },
          { id: 'rsv-nvr-2', label: 'Toutes les caméras enregistrées localement sur le NVR', critical: true },
          { id: 'rsv-nvr-3', label: 'Accès distant au NVR configuré et testé', critical: true },
          { id: 'rsv-nvr-4', label: 'NVR accessible via VPN ou solution cloud sécurisée', critical: true },
        ],
      },
      {
        id: 'rsv-monitoring',
        title: 'Supervision et alertes',
        items: [
          { id: 'rsv-mon-1', label: 'Alerte si NVR hors ligne configurée', critical: true },
          { id: 'rsv-mon-2', label: 'Alerte si caméra hors ligne configurée', critical: true },
          { id: 'rsv-mon-3', label: 'Alerte si espace disque critique configurée', critical: true },
          { id: 'rsv-mon-4', label: 'Contact d\'urgence local pour intervention physique identifié', critical: false },
        ],
      },
    ],
    notes: "Sur les sites distants, le NVR local est critique pour garantir la continuité de l'enregistrement même en cas de coupure WAN.",
  },
  {
    id: 'cl-onvif-integration',
    title: 'Intégration caméra ONVIF dans VMS',
    description: "Procédure d'intégration d'une caméra ONVIF dans un VMS, avec validation de compatibilité.",
    category: 'onvif',
    tags: ['onvif', 'vms', 'intégration', 'compatibilité', 'profil'],
    estimatedTime: '20-30 min',
    sections: [
      {
        id: 'oi-prereq',
        title: 'Prérequis',
        items: [
          { id: 'oi-pre-1', label: 'Caméra accessible en réseau (ping OK)', critical: true },
          { id: 'oi-pre-2', label: 'ONVIF activé sur la caméra (interface web)', critical: true },
          { id: 'oi-pre-3', label: 'NTP synchronisé entre caméra et VMS (écart < 5 min)', critical: true },
          { id: 'oi-pre-4', label: 'Profil ONVIF de la caméra identifié (S, T, G, M)', critical: false },
        ],
        commands: ['cmd-ping-basic', 'cmd-onvif-device-manager', 'cmd-onvif-getsystemdatetime'],
      },
      {
        id: 'oi-test',
        title: 'Tests pré-intégration',
        items: [
          { id: 'oi-tst-1', label: 'Caméra détectée par ONVIF Device Manager', critical: true },
          { id: 'oi-tst-2', label: 'Profils de flux listés et fonctionnels via ODM', critical: true },
          { id: 'oi-tst-3', label: 'Flux RTSP fonctionnel via ODM ou VLC', critical: true },
        ],
        commands: ['cmd-onvif-profiles', 'cmd-rtsp-vlc'],
      },
      {
        id: 'oi-integration',
        title: 'Intégration dans le VMS',
        items: [
          { id: 'oi-int-1', label: 'Caméra ajoutée dans le VMS via ONVIF', critical: true },
          { id: 'oi-int-2', label: 'Flux vidéo visible dans le VMS', critical: true },
          { id: 'oi-int-3', label: 'Résolution et codec configurés correctement', critical: true },
          { id: 'oi-int-4', label: 'Enregistrement actif vérifié', critical: true },
          { id: 'oi-int-5', label: 'PTZ fonctionnel si applicable', critical: false },
        ],
      },
    ],
    notes: "Si l'intégration ONVIF échoue, tester d'abord avec ONVIF Device Manager pour isoler si le problème est la caméra ou le VMS.",
  },
  {
    id: 'cl-wireshark-field-capture',
    title: 'Capture Wireshark terrain — Protocole',
    description: "Procédure de réalisation d'une capture Wireshark terrain pour diagnostiquer un problème réseau.",
    category: 'wireshark',
    tags: ['wireshark', 'capture', 'terrain', 'protocole', 'analyse'],
    estimatedTime: '15-60 min',
    sections: [
      {
        id: 'wfc-preparation',
        title: 'Préparation',
        items: [
          { id: 'wfc-prep-1', label: 'Wireshark installé et à jour sur le poste de capture', critical: true },
          { id: 'wfc-prep-2', label: 'Interface réseau à capturer identifiée', critical: true },
          { id: 'wfc-prep-3', label: 'Espace disque suffisant pour la capture (≥ 1 GB)', critical: false },
          { id: 'wfc-prep-4', label: 'Filtre de capture préparé si nécessaire (host IP, port, protocole)', critical: false },
        ],
      },
      {
        id: 'wfc-capture',
        title: 'Capture',
        items: [
          { id: 'wfc-cap-1', label: 'Capture lancée avant de reproduire le problème', critical: true },
          { id: 'wfc-cap-2', label: 'Problème reproduit pendant la capture', critical: true },
          { id: 'wfc-cap-3', label: 'Capture arrêtée dans les 30s après la fin du problème', critical: false },
          { id: 'wfc-cap-4', label: 'Fichier pcap sauvegardé avec nom horodaté descriptif', critical: true },
        ],
        commands: ['cmd-netsh-trace'],
      },
      {
        id: 'wfc-analysis',
        title: 'Analyse',
        items: [
          { id: 'wfc-an-1', label: 'Expert Information consulté pour vue d\'ensemble des erreurs', critical: true },
          { id: 'wfc-an-2', label: 'Conversations TCP identifiées (Statistics → Conversations)', critical: false },
          { id: 'wfc-an-3', label: 'Filtres appliqués selon le type de problème (RTSP, DHCP, ARP…)', critical: true },
          { id: 'wfc-an-4', label: 'Conclusions documentées', critical: true },
        ],
        commands: ['cmd-wireshark-tcp-errors', 'cmd-wireshark-expert-info'],
      },
    ],
    notes: "Pour un partage de capture : exporter uniquement la plage temporelle pertinente via File → Export Specified Packets pour réduire la taille.",
  },
  {
    id: 'cl-fiber-link-check',
    title: 'Validation lien fibre optique',
    description: "Checklist de validation d'un lien fibre optique réseau (inter-bâtiments ou backbone).",
    category: 'poe-switch',
    tags: ['fibre', 'optique', 'sfp', 'switch', 'backbone', 'lien'],
    estimatedTime: '15-30 min',
    sections: [
      {
        id: 'flc-physique',
        title: 'Infrastructure physique',
        items: [
          { id: 'flc-phy-1', label: 'Type de fibre correct (OM3/OM4 multimode ou OS2 monomode)', critical: true },
          { id: 'flc-phy-2', label: 'Connecteurs propres (pas de poussière, traces)', critical: true },
          { id: 'flc-phy-3', label: 'Câbles de raccordement sans pliure excessive (rayon mini 50mm)', critical: true },
          { id: 'flc-phy-4', label: 'Longueur dans les normes (OM3: ≤ 300m / OS2: ≤ 10km selon SFP)', critical: true },
        ],
      },
      {
        id: 'flc-sfp',
        title: 'Modules SFP',
        items: [
          { id: 'flc-sfp-1', label: 'Modules SFP compatibles avec les switches (même constructeur ou SFP certifié)', critical: true },
          { id: 'flc-sfp-2', label: 'Type SFP compatible avec le type de fibre (OM3 ≠ OS2)', critical: true },
          { id: 'flc-sfp-3', label: 'Vitesse SFP adaptée (1G, 10G) selon le switch', critical: true },
          { id: 'flc-sfp-4', label: 'LED SFP allumée (lien détecté) sur les deux extrémités', critical: true },
        ],
      },
      {
        id: 'flc-validation',
        title: 'Validation réseau',
        items: [
          { id: 'flc-val-1', label: 'Port switch UP/UP (pas Down)', critical: true },
          { id: 'flc-val-2', label: 'Puissance optique dans les limites (show interfaces SFP)', critical: false },
          { id: 'flc-val-3', label: 'Pas d\'erreurs CRC sur le port fibre', critical: true },
          { id: 'flc-val-4', label: 'Débit mesuré conforme aux attentes', critical: false },
        ],
        commands: ['cmd-switch-show-interfaces'],
      },
    ],
    notes: "Les connecteurs fibre DOIVENT être nettoyés avec un outil de nettoyage adapté avant connexion. Une poussière sur un connecteur LC peut dégrader sévèrement le lien.",
  },
  {
    id: 'cl-network-documentation',
    title: 'Documentation réseau site — Éléments obligatoires',
    description: "Checklist des éléments de documentation réseau à produire et maintenir pour un site.",
    category: 'terrain-tips',
    tags: ['documentation', 'réseau', 'plan', 'adressage', 'site', 'audit'],
    estimatedTime: '30-60 min',
    sections: [
      {
        id: 'nd-adressage',
        title: 'Plan d\'adressage',
        items: [
          { id: 'nd-adr-1', label: 'Liste des VLANs avec nom, numéro et sous-réseau', critical: true },
          { id: 'nd-adr-2', label: 'Plages DHCP documentées par VLAN', critical: true },
          { id: 'nd-adr-3', label: 'IPs statiques documentées (switches, serveurs, NVR, caméras)', critical: true },
          { id: 'nd-adr-4', label: 'Réservations DHCP documentées', critical: false },
        ],
      },
      {
        id: 'nd-equipements',
        title: 'Inventaire équipements',
        items: [
          { id: 'nd-eq-1', label: 'Liste des switches : hostname, IP management, modèle, firmware', critical: true },
          { id: 'nd-eq-2', label: 'Liste des caméras : IP, numéro de série, position, port switch', critical: true },
          { id: 'nd-eq-3', label: 'NVR/VMS : IP, version logicielle, stockage', critical: true },
          { id: 'nd-eq-4', label: 'Plan de câblage avec numérotation des ports', critical: false },
        ],
      },
      {
        id: 'nd-procedures',
        title: 'Procédures opérationnelles',
        items: [
          { id: 'nd-proc-1', label: 'Procédure d\'accès SSH aux switches documentée', critical: false },
          { id: 'nd-proc-2', label: 'Contacts opérateur et références de contrat notés', critical: true },
          { id: 'nd-proc-3', label: 'Procédure de restauration en cas de panne documentée', critical: false },
          { id: 'nd-proc-4', label: 'Mots de passe stockés dans un gestionnaire de mots de passe sécurisé', critical: true },
        ],
      },
    ],
    notes: "Une documentation à jour est essentielle pour les interventions d'urgence et les futurs techniciens. La maintenir à jour à chaque modification.",
  },
  {
    id: 'cl-post-incident-review',
    title: 'Revue post-incident réseau',
    description: "Procédure de revue post-incident pour documenter, analyser et améliorer suite à une panne réseau résolue.",
    category: 'terrain-tips',
    tags: ['incident', 'revue', 'post-mortem', 'amélioration', 'rapport'],
    estimatedTime: '30-60 min',
    sections: [
      {
        id: 'pir-chronologie',
        title: 'Chronologie de l\'incident',
        items: [
          { id: 'pir-chr-1', label: 'Heure de début de l\'incident documentée', critical: true },
          { id: 'pir-chr-2', label: 'Heure de détection documentée', critical: true },
          { id: 'pir-chr-3', label: 'Chronologie des événements reconstituée', critical: true },
          { id: 'pir-chr-4', label: 'Heure de résolution documentée', critical: true },
          { id: 'pir-chr-5', label: 'Durée totale d\'impact calculée', critical: true },
        ],
      },
      {
        id: 'pir-analyse',
        title: 'Analyse de la cause',
        items: [
          { id: 'pir-an-1', label: 'Cause racine identifiée (Root Cause Analysis)', critical: true },
          { id: 'pir-an-2', label: 'Facteurs contributifs identifiés', critical: false },
          { id: 'pir-an-3', label: 'Équipements et configurations impactés documentés', critical: true },
        ],
      },
      {
        id: 'pir-actions',
        title: 'Actions correctives',
        items: [
          { id: 'pir-act-1', label: 'Correction immédiate appliquée documentée', critical: true },
          { id: 'pir-act-2', label: 'Actions préventives identifiées pour éviter la récurrence', critical: true },
          { id: 'pir-act-3', label: 'Améliorations de la supervision identifiées (monitoring, alertes)', critical: false },
          { id: 'pir-act-4', label: 'Responsable et délai pour chaque action préventive assignés', critical: false },
          { id: 'pir-act-5', label: 'Rapport d\'incident rédigé et partagé avec les parties prenantes', critical: false },
        ],
      },
    ],
    notes: "Un post-mortem sans bonne foi ne sert à rien. L'objectif est d'améliorer les systèmes et les processus, pas de trouver des responsables.",
  },
  {
    id: 'cl-pre-intervention-checklist',
    title: 'Préparation intervention terrain',
    description: "Checklist de préparation avant de se rendre sur un site pour une intervention réseau ou vidéosurveillance.",
    category: 'terrain-tips',
    tags: ['terrain', 'préparation', 'intervention', 'matériel', 'outillage'],
    estimatedTime: '15-20 min',
    sections: [
      {
        id: 'pic-info',
        title: 'Informations site',
        items: [
          { id: 'pic-inf-1', label: 'Plan d\'adressage réseau du site disponible', critical: true },
          { id: 'pic-inf-2', label: 'Coordonnées du contact local notées', critical: true },
          { id: 'pic-inf-3', label: 'Description du problème signalé documentée', critical: true },
          { id: 'pic-inf-4', label: 'Accès site et équipements (codes, clés) confirmés', critical: true },
        ],
      },
      {
        id: 'pic-materiel',
        title: 'Matériel',
        items: [
          { id: 'pic-mat-1', label: 'Laptop avec outils réseau installés (Wireshark, Nmap, Putty)', critical: true },
          { id: 'pic-mat-2', label: 'Câble Ethernet de test de remplacement', critical: true },
          { id: 'pic-mat-3', label: 'Câble console (RS232-USB) pour accès switch', critical: false },
          { id: 'pic-mat-4', label: 'Testeur de câble réseau', critical: false },
          { id: 'pic-mat-5', label: 'Câble VGA/HDMI pour écran local (accès direct NVR)', critical: false },
          { id: 'pic-mat-6', label: 'Adaptateur WiFi USB si besoin d\'accès WiFi sur poste sans WiFi', critical: false },
        ],
      },
      {
        id: 'pic-logiciels',
        title: 'Logiciels et accès',
        items: [
          { id: 'pic-log-1', label: 'Accès VPN opérationnel (si accès distant requis)', critical: false },
          { id: 'pic-log-2', label: 'ONVIF Device Manager disponible', critical: false },
          { id: 'pic-log-3', label: 'VLC Media Player installé', critical: true },
          { id: 'pic-log-4', label: 'Gestionnaire de mots de passe avec les credentials du site', critical: true },
          { id: 'pic-log-5', label: 'Documentation du site téléchargée localement (pas uniquement cloud)', critical: false },
        ],
      },
    ],
    notes: "Mieux vaut une préparation de 20 minutes qu'un aller-retour de 2 heures pour récupérer un câble oublié.",
  },
  {
    id: 'cl-snmp-monitoring-setup',
    title: 'Configuration supervision SNMP',
    description: "Checklist de configuration de la supervision SNMP sur les équipements réseau d'un site.",
    category: 'network-config',
    tags: ['snmp', 'supervision', 'monitoring', 'alertes', 'nms'],
    estimatedTime: '30-60 min',
    sections: [
      {
        id: 'sms-config',
        title: 'Configuration SNMP sur les équipements',
        items: [
          { id: 'sms-cfg-1', label: 'SNMP v2c ou v3 activé sur chaque switch', critical: true },
          { id: 'sms-cfg-2', label: 'Community string SNMP changée (pas "public" ou "private")', critical: true },
          { id: 'sms-cfg-3', label: 'Accès SNMP restreint à l\'IP du serveur de supervision', critical: true },
          { id: 'sms-cfg-4', label: 'SNMP Trap configuré vers le serveur NMS', critical: false },
        ],
      },
      {
        id: 'sms-supervision',
        title: 'Configuration NMS',
        items: [
          { id: 'sms-nms-1', label: 'Tous les équipements ajoutés dans le NMS', critical: true },
          { id: 'sms-nms-2', label: 'Polling SNMP configuré (intervalle 5 min recommandé)', critical: true },
          { id: 'sms-nms-3', label: 'Seuils d\'alerte CPU configurés (> 80%)', critical: false },
          { id: 'sms-nms-4', label: 'Seuils d\'alerte utilisation bande passante configurés (> 80%)', critical: false },
          { id: 'sms-nms-5', label: 'Alertes perte d\'équipement (host down) configurées', critical: true },
        ],
      },
      {
        id: 'sms-test',
        title: 'Tests',
        items: [
          { id: 'sms-tst-1', label: 'SNMP polling fonctionnel (données reçues pour chaque équipement)', critical: true },
          { id: 'sms-tst-2', label: 'Test d\'alerte : déconnecter un équipement et vérifier l\'alerte', critical: true },
          { id: 'sms-tst-3', label: 'Canal de notification testé (email, SMS, ITSM)', critical: true },
        ],
        commands: ['cmd-nmap-udp-scan'],
      },
    ],
    notes: "SNMP v3 est recommandé pour les environnements sécurisés (authentification + chiffrement). SNMP v2c est acceptable pour les réseaux internes isolés.",
  },
];

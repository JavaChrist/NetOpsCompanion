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
];

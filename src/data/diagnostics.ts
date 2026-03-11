import type { DiagnosticGuide } from '../types';

export const diagnostics: DiagnosticGuide[] = [
  {
    id: 'diag-cam-invisible',
    title: 'Caméra IP invisible sur le réseau',
    description:
      'Une caméra IP nouvellement installée ou existante ne répond pas au ping et n\'est pas détectée par le VMS.',
    problemSummary: 'Caméra non accessible — absence de réponse réseau',
    category: 'video-surveillance',
    level: 'beginner',
    tags: ['caméra', 'ping', 'réseau', 'invisible', 'dhcp', 'ip'],
    estimatedTime: '15-30 min',
    steps: [
      {
        stepNumber: 1,
        title: 'Vérifier l\'alimentation et les LEDs',
        description:
          'Contrôler que la caméra est bien alimentée. Vérifier les LEDs de la caméra et du port switch.',
        checkpoints: [
          'LED de la caméra allumée (couleur selon modèle)',
          'LED du port switch indique une activité (link + activity)',
          'Si PoE : vérifier la LED PoE du switch',
        ],
        tip: 'Sur un switch Cisco, "show power inline" affiche la consommation PoE par port.',
      },
      {
        stepNumber: 2,
        title: 'Vérifier le câblage physique',
        description:
          'Tester le câble RJ45, le patch, le keystone. Essayer un câble de remplacement.',
        checkpoints: [
          'Câble testé avec un testeur RJ45',
          'Connecteurs bien clipsés',
          'Pas de câble endommagé',
        ],
        tip: 'Un câble OK mais mal terminé peut ne pas alimenter en PoE même si le lien monte.',
      },
      {
        stepNumber: 3,
        title: 'Scanner le réseau avec Nmap',
        description: 'Effectuer un ping scan pour détecter tous les hôtes actifs sur le sous-réseau.',
        commands: ['nmap -sn 192.168.1.0/24'],
        checkpoints: [
          'La caméra apparaît dans les résultats',
          'Comparer le nombre d\'hôtes avant/après branchement',
        ],
        tip: 'Faire le scan avant et après le branchement pour identifier la nouvelle IP.',
      },
      {
        stepNumber: 4,
        title: 'Chercher via MAC address',
        description:
          'Si la caméra n\'apparaît pas au ping scan, chercher son adresse MAC dans la table ARP ou dans le DHCP server.',
        commands: [
          'nmap -sn 192.168.1.0/24',
          'arp -a | findstr "AA-BB-CC-DD-EE-FF"',
        ],
        checkpoints: [
          'Adresse MAC visible dans la table ARP',
          'Adresse MAC visible dans le bail DHCP',
        ],
        tip: "L'adresse MAC est souvent imprimée sur l'étiquette du boîtier de la caméra.",
      },
      {
        stepNumber: 5,
        title: 'Vérifier le VLAN et la segmentation réseau',
        description:
          'S\'assurer que le poste de test et la caméra sont sur le même VLAN. Un VLAN caméra isolé nécessite de brancher depuis le bon port.',
        checkpoints: [
          'Le port switch est bien dans le bon VLAN',
          'Le poste est sur le même réseau que la caméra',
          'Pas de VLAN mal configuré (trunk vs access)',
        ],
        warning: 'Si 802.1X est activé, la caméra sera bloquée sans authentification.',
      },
      {
        stepNumber: 6,
        title: 'Tenter un accès via adresse APIPA',
        description:
          'Si la caméra n\'a pas obtenu de DHCP, elle est probablement en 169.254.x.x. Configurer le poste en APIPA pour l\'atteindre.',
        commands: [
          'netsh interface ip set address "Ethernet" static 169.254.1.1 255.255.0.0',
          'nmap -sn 169.254.0.0/16',
        ],
        tip: 'Utiliser ONVIF Device Manager depuis ce réseau 169.254.x.x pour détecter la caméra.',
      },
    ],
    probableCauses: [
      'Absence d\'alimentation PoE',
      'Câble défectueux ou mal terminé',
      'DHCP non reçu (caméra en APIPA)',
      'VLAN incorrect sur le port switch',
      '802.1X bloquant l\'accès',
      'IP fixe configurée en dehors de la plage du réseau',
      'Caméra en boot (attendre 60s après alimentation)',
    ],
    bestPractices: [
      'Toujours faire un scan nmap avant de connecter une nouvelle caméra (baseline)',
      'Utiliser ONVIF Device Manager comme outil de découverte universel',
      'Vérifier les LEDs PoE du switch avant tout diagnostic logiciel',
    ],
    variants: [
      'Caméra visible dans le switch (table MAC) mais ne répond pas au ping → firewall intégré',
      'Caméra en IP fixe non joignable → reconfigurer en APIPA',
    ],
    relatedCommands: ['cmd-nmap-ping-scan', 'cmd-arp-a', 'cmd-find-mac', 'cmd-169-workaround'],
  },

  {
    id: 'diag-cam-no-dhcp',
    title: 'Caméra sans adresse DHCP (APIPA 169.254.x.x)',
    description:
      'Une caméra ne reçoit pas d\'adresse IP du serveur DHCP et se retrouve en 169.254.x.x.',
    problemSummary: 'DHCP non reçu — caméra en adresse APIPA',
    category: 'video-surveillance',
    level: 'intermediate',
    tags: ['dhcp', 'apipa', '169.254', 'caméra', 'ip'],
    estimatedTime: '10-20 min',
    steps: [
      {
        stepNumber: 1,
        title: 'Confirmer la présence en 169.254.x.x',
        description:
          'Scanner la plage 169.254.0.0/16 pour confirmer la présence de l\'équipement.',
        commands: [
          'netsh interface ip set address "Ethernet" static 169.254.1.1 255.255.0.0',
          'nmap -sn 169.254.0.0/16',
        ],
        checkpoints: ['La caméra apparaît sur la plage 169.254.x.x'],
      },
      {
        stepNumber: 2,
        title: 'Capturer les échanges DHCP avec Wireshark',
        description:
          'Observer si la caméra envoie bien un DHCP Discover. Si aucun Discover n\'est vu, problème matériel ou logiciel caméra.',
        commands: ['bootp'],
        checkpoints: [
          'DHCP Discover visible depuis la MAC de la caméra',
          'DHCP Offer retournée par le serveur',
        ],
        tip: 'Si aucun Discover : tenter un reset usine de la caméra.',
      },
      {
        stepNumber: 3,
        title: 'Vérifier le serveur DHCP',
        description:
          'Vérifier les logs du serveur DHCP. Vérifier les exclusions et la plage disponible.',
        checkpoints: [
          'Pool DHCP non épuisé',
          'Pas de réservation ou exclusion sur la MAC de la caméra',
          'Bail DHCP actif après connexion',
        ],
      },
      {
        stepNumber: 4,
        title: 'Vérifier les options VLAN DHCP',
        description:
          'Si le réseau est segmenté en VLANs, vérifier que le serveur DHCP dispose d\'un scope pour le VLAN caméra et que le relais DHCP est configuré.',
        checkpoints: [
          'Scope DHCP existe pour le VLAN caméra',
          'DHCP relay / ip helper-address configuré sur le routeur/switch L3',
        ],
        warning: 'Sans DHCP relay, le serveur DHCP ne voit jamais les Discover provenant d\'un autre VLAN.',
      },
    ],
    probableCauses: [
      'Pool DHCP épuisé',
      'DHCP relay non configuré sur le VLAN caméra',
      'Port switch dans un VLAN sans scope DHCP',
      'Réservation bloquante sur la MAC',
      'Caméra configurée en IP statique',
      'Caméra en mode boot — réessayer après 60-90 secondes',
    ],
    bestPractices: [
      'Toujours vérifier la disponibilité du pool DHCP avant installation',
      'Configurer une plage DHCP dédiée par VLAN caméra',
      'Utiliser ONVIF Device Manager depuis le même réseau pour configurer une IP statique temporaire',
    ],
    relatedCommands: [
      'cmd-ipconfig-all',
      'cmd-ipconfig-release',
      'cmd-ipconfig-renew',
      'cmd-wireshark-dhcp',
      'cmd-169-workaround',
    ],
  },

  {
    id: 'diag-rtsp-unavailable',
    title: 'Flux RTSP indisponible',
    description:
      'Le VMS ou un lecteur (VLC) ne parvient pas à obtenir le flux vidéo RTSP d\'une caméra.',
    problemSummary: 'Flux RTSP inaccessible depuis le VMS ou VLC',
    category: 'video-surveillance',
    level: 'intermediate',
    tags: ['rtsp', 'flux', 'vidéo', 'vms', 'caméra', '554'],
    estimatedTime: '15-25 min',
    steps: [
      {
        stepNumber: 1,
        title: 'Vérifier la connectivité de base',
        description: 'Pinger la caméra depuis le serveur VMS ou le poste de test.',
        commands: ['ping 192.168.1.10'],
        checkpoints: ['La caméra répond au ping'],
      },
      {
        stepNumber: 2,
        title: 'Vérifier que le port 554 est ouvert',
        description: 'Scanner le port RTSP sur la caméra.',
        commands: ['nmap -p 554 192.168.1.10'],
        checkpoints: ['Port 554 état : open'],
        tip: 'Si filtré ou fermé, vérifier les paramètres réseau de la caméra.',
      },
      {
        stepNumber: 3,
        title: 'Tester le flux RTSP directement avec VLC',
        description: 'Ouvrir le flux RTSP directement dans VLC pour contourner le VMS.',
        commands: [
          'vlc rtsp://admin:password@192.168.1.10:554/stream1',
          'vlc rtsp://admin:password@192.168.1.10/axis-media/media.amp',
        ],
        checkpoints: [
          'Flux vidéo visible dans VLC',
          'Pas d\'erreur d\'authentification (401)',
          'Pas d\'erreur de connexion',
        ],
        tip: 'Si VLC fonctionne mais pas le VMS → problème de configuration VMS ou credentials.',
      },
      {
        stepNumber: 4,
        title: 'Vérifier les credentials',
        description: 'S\'assurer que le login/mot de passe utilisé est correct.',
        checkpoints: [
          'Accès à l\'interface web de la caméra fonctionnel avec les mêmes credentials',
          'Utilisateur avec droit de streaming activé',
        ],
      },
      {
        stepNumber: 5,
        title: 'Vérifier l\'activation du service RTSP dans la caméra',
        description: 'Accéder à l\'interface web de la caméra et vérifier que le service RTSP est activé.',
        checkpoints: [
          'RTSP activé dans les paramètres réseau/vidéo',
          'Port RTSP correct (554 par défaut)',
          'Chiffrement RTSP désactivé si non supporté par le VMS',
        ],
      },
      {
        stepNumber: 6,
        title: 'Analyser avec Wireshark',
        description: 'Capturer les échanges RTSP pour identifier le code d\'erreur retourné.',
        commands: ['rtsp'],
        checkpoints: [
          'Échange RTSP DESCRIBE visible',
          'Réponse 200 OK ou identifier le code d\'erreur',
        ],
      },
    ],
    probableCauses: [
      'Service RTSP désactivé dans la caméra',
      'Mauvaises credentials',
      'URL RTSP incorrecte',
      'Firewall bloquant le port 554',
      'Bande passante insuffisante',
      'Caméra surchargée (trop de flux simultanés)',
    ],
    bestPractices: [
      'Toujours tester le flux RTSP avec VLC avant d\'intégrer au VMS',
      'Documenter les URLs RTSP par constructeur',
      'Vérifier la compatibilité RTSP over HTTP si NAT ou proxy',
    ],
    relatedCommands: ['cmd-nmap-rtsp', 'cmd-rtsp-vlc', 'cmd-wireshark-rtsp-filter'],
  },

  {
    id: 'diag-onvif-not-detected',
    title: 'Caméra ONVIF non détectée',
    description:
      'ONVIF Device Manager ou le VMS ne détecte pas la caméra en mode ONVIF.',
    problemSummary: 'Caméra absente de la découverte ONVIF',
    category: 'onvif',
    level: 'intermediate',
    tags: ['onvif', 'ws-discovery', 'caméra', 'vms', '3702'],
    estimatedTime: '15-20 min',
    steps: [
      {
        stepNumber: 1,
        title: 'Vérifier la connectivité de base',
        description: 'S\'assurer que la caméra est joignable avant de diagnostiquer ONVIF.',
        commands: ['ping 192.168.1.10'],
        checkpoints: ['Ping OK'],
      },
      {
        stepNumber: 2,
        title: 'Vérifier que le service ONVIF est activé',
        description: 'Accéder à l\'interface web de la caméra et vérifier l\'activation ONVIF.',
        checkpoints: [
          'ONVIF activé dans les paramètres',
          'Compte ONVIF créé ou activé',
          'Profils ONVIF configurés',
        ],
        tip: 'Certains constructeurs (Axis, Hikvision) nécessitent d\'activer explicitement ONVIF dans les paramètres réseau.',
      },
      {
        stepNumber: 3,
        title: 'Vérifier le port ONVIF (80/8080)',
        description: 'Scanner le port HTTP ONVIF sur la caméra.',
        commands: ['nmap -p 80,8080,2020 192.168.1.10'],
        checkpoints: ['Port HTTP ouvert (80 ou 8080)'],
      },
      {
        stepNumber: 4,
        title: 'Tester WS-Discovery (UDP 3702)',
        description:
          'ONVIF Device Manager utilise le multicast UDP 3702. Vérifier que ce trafic n\'est pas bloqué.',
        commands: ['nmap -sU -p 3702 192.168.1.10'],
        checkpoints: ['Port 3702 UDP ouvert ou filtré (pas closed)'],
        warning: 'Le multicast WS-Discovery peut être bloqué par certains switches (IGMP snooping mal configuré).',
      },
      {
        stepNumber: 5,
        title: 'Essayer la connexion ONVIF directe par IP',
        description:
          'Dans ONVIF Device Manager, utiliser "Add" et saisir directement l\'IP au lieu de passer par la découverte automatique.',
        checkpoints: ['La caméra apparaît après ajout manuel par IP'],
      },
    ],
    probableCauses: [
      'Service ONVIF désactivé dans la caméra',
      'Multicast WS-Discovery bloqué par le switch',
      'ONVIF sur un port non standard',
      'Credentials ONVIF différents des credentials admin',
      'Version ONVIF non compatible',
      'VLAN séparé bloquant le multicast',
    ],
    bestPractices: [
      'Toujours créer un utilisateur dédié ONVIF avec les bons droits',
      'Tester la connexion ONVIF directe en IP avant de passer par la découverte',
      'Vérifier la version ONVIF supportée par le VMS',
    ],
    relatedCommands: ['cmd-onvif-device-manager', 'cmd-nmap-onvif', 'cmd-ws-discovery-nmap'],
  },

  {
    id: 'diag-cam-mac-only',
    title: 'Équipement retrouvé uniquement via adresse MAC',
    description:
      'Un équipement (caméra, switch) est visible dans la table ARP ou MAC du switch mais ne répond pas au ping et son IP est inconnue.',
    problemSummary: 'MAC visible, IP inconnue ou non répondante',
    category: 'discovery',
    level: 'intermediate',
    tags: ['mac', 'arp', 'ip', 'inconnu', 'équipement'],
    estimatedTime: '10-15 min',
    steps: [
      {
        stepNumber: 1,
        title: 'Identifier le constructeur via OUI',
        description:
          'Les 3 premiers octets de la MAC (OUI) identifient le constructeur. Consulter https://macvendors.com.',
        checkpoints: [
          'OUI identifié (ex: AC:CC:8E = Axis, D4:E8:53 = Hikvision)',
        ],
        tip: 'En ligne de commande : nmap --script=mac-prefix 192.168.1.0/24',
      },
      {
        stepNumber: 2,
        title: 'Rechercher la MAC dans la table ARP',
        description: 'Peupler la table ARP via un scan nmap puis chercher la MAC.',
        commands: [
          'nmap -sn 192.168.1.0/24',
          'arp -a | findstr "AA-BB-CC-DD-EE-FF"',
        ],
        checkpoints: ["L'IP correspondant à la MAC est identifiée dans la table ARP"],
      },
      {
        stepNumber: 3,
        title: 'Interroger la table MAC du switch',
        description: 'Si accès au switch, afficher la table MAC pour identifier le port et l\'VLAN.',
        commands: ['show mac address-table | include AA:BB:CC:DD:EE:FF'],
        checkpoints: [
          'Port switch identifié',
          'VLAN identifié',
        ],
        tip: 'Sur les switches HP/Aruba : show mac-address',
      },
      {
        stepNumber: 4,
        title: 'Interroger le serveur DHCP',
        description: 'Rechercher l\'adresse MAC dans les baux DHCP du serveur.',
        checkpoints: [
          'IP assignée visible dans les logs DHCP',
          'Pas de réservation conflictuelle',
        ],
      },
      {
        stepNumber: 5,
        title: 'Connecter directement en APIPA si IP inconnue',
        description:
          'Si l\'IP reste inconnue, se connecter sur le même segment 169.254.x.x et tenter une découverte ONVIF.',
        commands: ['netsh interface ip set address "Ethernet" static 169.254.1.1 255.255.0.0'],
      },
    ],
    probableCauses: [
      'Caméra en APIPA (DHCP non reçu)',
      'IP fixe hors de la plage pingée',
      'Firewall ICMP bloqué sur la caméra',
      'Équipement sur un VLAN différent',
    ],
    bestPractices: [
      'Toujours noter les adresses MAC des équipements à l\'installation',
      'Utiliser un outil de lookup OUI pour identifier rapidement le constructeur',
    ],
    relatedCommands: ['cmd-arp-a', 'cmd-find-mac', 'cmd-nmap-ping-scan', 'cmd-169-workaround'],
  },

  {
    id: 'diag-8021x-blocked',
    title: 'Port switch potentiellement bloqué par 802.1X',
    description:
      'Un équipement (caméra, PC) branché sur un port switch ne reçoit pas d\'IP et ne communique pas, alors que le lien physique est OK.',
    problemSummary: 'Port switch bloqué par NAC 802.1X',
    category: 'poe-switch',
    level: 'advanced',
    tags: ['802.1x', 'nac', 'eapol', 'authentification', 'switch', 'port'],
    estimatedTime: '20-40 min',
    steps: [
      {
        stepNumber: 1,
        title: 'Vérifier le lien physique',
        description: 'Confirmer que le câble fonctionne et que la LED du switch indique un lien actif.',
        checkpoints: ['LED link active sur le port switch', 'Câble testé'],
      },
      {
        stepNumber: 2,
        title: 'Capturer le trafic EAPOL avec Wireshark',
        description:
          'Brancher un PC entre la caméra et le switch, capturer avec Wireshark. Chercher les trames EAPOL.',
        commands: ['eapol'],
        checkpoints: [
          'Trames EAPOL Request Identity visibles',
          'L\'équipement tente ou non de répondre en EAP',
        ],
        tip: 'Si EAPOL Request Identity sans réponse EAP → l\'équipement n\'est pas compatible 802.1X.',
      },
      {
        stepNumber: 3,
        title: 'Identifier la politique 802.1X du switch',
        description: 'Consulter la configuration du port switch pour voir si 802.1X est actif.',
        commands: [
          'show dot1x interface GigabitEthernet0/1',
          'show authentication sessions interface Gi0/1',
        ],
        checkpoints: [
          'dot1x port-control configuré (auto, force-authorized, force-unauthorized)',
          'État du port : Authorized ou Unauthorized',
        ],
      },
      {
        stepNumber: 4,
        title: 'Passer le port en force-authorized (bypass temporaire)',
        description: 'Pour débloquer temporairement, passer le port en force-authorized.',
        commands: ['interface GigabitEthernet0/1', ' authentication port-control force-authorized'],
        checkpoints: ['L\'équipement obtient une IP après le changement'],
        warning: 'Solution temporaire uniquement. Remettre en auto après diagnostic ou enregistrer l\'équipement dans le NAC.',
      },
      {
        stepNumber: 5,
        title: 'Enregistrer l\'équipement dans le serveur NAC/RADIUS',
        description:
          'Solution pérenne : ajouter la MAC address de la caméra dans la liste d\'accès du serveur RADIUS (MAB - MAC Authentication Bypass).',
        checkpoints: [
          'MAC address ajoutée dans le serveur RADIUS',
          'Politique MAB activée sur le port',
        ],
      },
    ],
    probableCauses: [
      '802.1X activé sur le port switch sans que l\'équipement soit enregistré',
      'Politique MAB non configurée pour les équipements non-802.1X',
      'Serveur RADIUS inaccessible',
    ],
    bestPractices: [
      'Lister toutes les MAC addresses des équipements avant le déploiement 802.1X',
      'Utiliser MAB (MAC Authentication Bypass) pour les caméras non compatibles EAP',
      'Configurer un VLAN de quarantaine plutôt que de bloquer totalement',
    ],
    caution:
      'Désactiver 802.1X sur un port de production est une décision de sécurité. Toujours en informer le responsable réseau/sécurité.',
    relatedCommands: ['cmd-wireshark-eapol', 'cmd-wireshark-dhcp'],
  },

  // ── Nouveaux diagnostics ──────────────────────────────────────────────

  {
    id: 'diag-cam-web-unreachable',
    title: 'Interface web de la caméra inaccessible',
    description:
      "La caméra répond au ping mais son interface d'administration web (HTTP/HTTPS) n'est pas accessible depuis le navigateur.",
    problemSummary: 'Caméra pingable mais interface web non accessible',
    category: 'video-surveillance',
    level: 'intermediate',
    tags: ['caméra', 'http', 'web', 'interface', 'port', '80', '443'],
    estimatedTime: '10-20 min',
    steps: [
      {
        stepNumber: 1,
        title: 'Confirmer que la caméra répond au ping',
        description: 'Vérifier la connectivité de base avant de diagnostiquer le service HTTP.',
        commands: ['ping 192.168.1.10'],
        checkpoints: ['Ping OK (réponse reçue)'],
      },
      {
        stepNumber: 2,
        title: 'Tester l\'accès sur les ports HTTP courants',
        description: 'Les caméras utilisent souvent des ports non standards pour leur interface web.',
        commands: [
          'Test-NetConnection 192.168.1.10 -Port 80',
          'Test-NetConnection 192.168.1.10 -Port 8080',
          'Test-NetConnection 192.168.1.10 -Port 443',
          'Test-NetConnection 192.168.1.10 -Port 8443',
        ],
        checkpoints: [
          'Identifier le port sur lequel TcpTestSucceeded = True',
          'Essayer http://IP:port dans le navigateur',
        ],
        tip: "Les Hikvision utilisent souvent le port 80, Dahua le 80 ou 8080, Axis le 80. Consulter l'étiquette ou le manuel.",
      },
      {
        stepNumber: 3,
        title: 'Vérifier le pare-feu Windows du poste',
        description: "Un pare-feu local peut bloquer les connexions sortantes vers les ports HTTP.",
        commands: ['netsh advfirewall show allprofiles'],
        checkpoints: ['Pare-feu désactivé temporairement pour test', 'Règle sortante non bloquante'],
      },
      {
        stepNumber: 4,
        title: 'Tester depuis un autre navigateur ou poste',
        description: "Exclure un problème de navigateur ou de proxy côté poste technicien.",
        checkpoints: [
          'Test depuis un autre navigateur (Chrome, Firefox, Edge)',
          'Test depuis un autre poste du même réseau',
          'Vérifier qu\'aucun proxy HTTP n\'est configuré',
        ],
      },
      {
        stepNumber: 5,
        title: 'Vérifier le service HTTP sur la caméra',
        description: "Si accessible via ONVIF mais pas en HTTP, le service web de la caméra est peut-être désactivé.",
        commands: ['nmap -p 80,443,8080,8443 192.168.1.10'],
        checkpoints: [
          'Au moins un port HTTP en état open',
          'Si tous sont filtered/closed → service HTTP désactivé dans la caméra',
        ],
        tip: 'Sur certaines caméras, le service HTTP peut être désactivé pour des raisons de sécurité. Essayer le port HTTPS.',
      },
    ],
    probableCauses: [
      'Port HTTP non standard (8080, 8443 au lieu de 80)',
      'Service HTTP désactivé dans la configuration caméra',
      'Pare-feu Windows bloquant la connexion sortante',
      'Proxy HTTP configuré sur le poste technicien',
      'Caméra en train de booter ou service en cours de redémarrage',
      'Conflit HTTPS avec certificat auto-signé rejeté par le navigateur',
    ],
    bestPractices: [
      'Toujours tester les ports 80, 443, 8080 et 8443 avant de conclure',
      'Désactiver temporairement le proxy HTTP lors des interventions terrain',
      'Pour HTTPS : accepter le certificat auto-signé ou utiliser HTTP en maintenance',
    ],
    relatedCommands: ['cmd-ping-basic', 'cmd-ps-test-connection', 'cmd-nmap-http-cameras', 'cmd-camera-web-access'],
  },

  {
    id: 'diag-rtsp-no-stream',
    title: 'Caméra accessible HTTP mais flux RTSP absent',
    description:
      "L'interface web de la caméra est accessible et la caméra est pingable, mais le flux RTSP est indisponible ou retourne une erreur.",
    problemSummary: 'HTTP OK, RTSP inaccessible ou retourne une erreur',
    category: 'video-surveillance',
    level: 'intermediate',
    tags: ['rtsp', 'http', 'flux', 'caméra', '554', 'service'],
    estimatedTime: '15-25 min',
    steps: [
      {
        stepNumber: 1,
        title: 'Vérifier que le port RTSP 554 est ouvert',
        description: 'Le service RTSP peut être désactivé indépendamment du service HTTP.',
        commands: [
          'nmap -p 554 192.168.1.10',
          'Test-NetConnection 192.168.1.10 -Port 554',
        ],
        checkpoints: ['Port 554 état : open', 'Si closed ou filtered → service RTSP désactivé'],
      },
      {
        stepNumber: 2,
        title: 'Activer le service RTSP dans la caméra',
        description: "Accéder à l'interface web et vérifier que le service RTSP est activé.",
        checkpoints: [
          'Menu : Configuration → Réseau → Paramètres RTSP',
          'Service RTSP coché / activé',
          'Port RTSP = 554 (par défaut)',
          'Authentification RTSP : None ou Digest',
        ],
        tip: "Sur Hikvision : Configuration > Network > Advanced Settings > Integration Protocol. Sur Axis : System > Plain Config > Network > RTSP.",
      },
      {
        stepNumber: 3,
        title: 'Tester le flux RTSP avec VLC',
        description: "Tester directement avec VLC en utilisant les URLs RTSP standards du constructeur.",
        commands: [
          'vlc rtsp://admin:password@192.168.1.10:554/Streaming/Channels/101',
          'vlc rtsp://admin:password@192.168.1.10/axis-media/media.amp',
        ],
        checkpoints: [
          'Pas d\'erreur 401 (credentials incorrects)',
          'Pas d\'erreur 404 (URL incorrecte)',
          'Pas d\'erreur de connexion (service indisponible)',
        ],
      },
      {
        stepNumber: 4,
        title: 'Vérifier les credentials RTSP',
        description: "Certaines caméras ont des comptes séparés pour l'accès web et l'accès RTSP.",
        checkpoints: [
          'Compte utilisateur avec droit de streaming activé',
          'Mot de passe testé via interface web avant utilisation en RTSP',
          'Compte "admin" vs compte dédié streaming',
        ],
      },
      {
        stepNumber: 5,
        title: 'Analyser les échanges RTSP avec Wireshark',
        description: "Capturer les échanges pour identifier le code d'erreur RTSP retourné.",
        commands: ['rtsp'],
        checkpoints: [
          'RTSP DESCRIBE → 200 OK (succès)',
          'RTSP DESCRIBE → 401 (unauthorized)',
          'RTSP DESCRIBE → 404 (Not Found / mauvaise URL)',
          'Pas de réponse RTSP (service inactif)',
        ],
      },
    ],
    probableCauses: [
      'Service RTSP désactivé dans la configuration caméra',
      'URL RTSP incorrecte (varie selon le constructeur et le modèle)',
      'Credentials incorrects ou compte sans droit streaming',
      'Nombre maximum de flux simultanés atteint',
      'Firmware obsolète avec bug RTSP',
      'Port 554 bloqué par pare-feu ou ACL réseau',
    ],
    bestPractices: [
      'Toujours tester le flux avec VLC avant d\'intégrer dans le VMS',
      'Consulter la documentation constructeur pour l\'URL RTSP exacte',
      'Créer un compte dédié pour les flux RTSP avec les droits minimaux',
    ],
    variants: [
      'Flux RTSP disponible en H.264 mais pas H.265 → Vérifier la compatibilité codec du VMS',
      'Flux disponible depuis la caméra mais pas depuis le VMS → Problème de routage ou firewall entre VMS et caméra',
    ],
    relatedCommands: ['cmd-nmap-rtsp', 'cmd-rtsp-vlc', 'cmd-curl-rtsp-describe', 'cmd-wireshark-rtsp-filter'],
  },

  {
    id: 'diag-ip-conflict',
    title: 'Conflit d\'adresse IP sur le réseau',
    description:
      "Deux équipements partagent la même adresse IP, provoquant des interruptions de connectivité intermittentes et aléatoires.",
    problemSummary: 'Conflit IP — connectivité intermittente sur un équipement',
    category: 'network-config',
    level: 'intermediate',
    tags: ['ip', 'conflit', 'arp', 'dhcp', 'réseau', 'intermittent'],
    estimatedTime: '15-30 min',
    steps: [
      {
        stepNumber: 1,
        title: 'Identifier le symptôme de conflit',
        description: "Windows affiche parfois un message 'Conflit d\'adresse IP'. Sinon, les symptômes sont une connectivité intermittente.",
        checkpoints: [
          'Message Windows "Conflit d\'adresse IP" visible dans la barre des tâches',
          'Ping vers l\'IP affecte donnant des résultats aléatoires (parfois OK, parfois KO)',
          'Log DHCP indiquant une collision',
        ],
      },
      {
        stepNumber: 2,
        title: 'Vider le cache ARP et repinger',
        description: "Forcer une résolution ARP fraîche pour voir quelle MAC répond à cette IP.",
        commands: [
          'arp -d *',
          'ping 192.168.1.10',
          'arp -a | findstr "192.168.1.10"',
        ],
        checkpoints: [
          'Une seule MAC apparaît pour cette IP (normal)',
          'Si deux MACs différentes apparaissent successivement → conflit confirmé',
        ],
        tip: "Faire plusieurs ping puis arp -a et observer si la MAC change entre deux requêtes.",
      },
      {
        stepNumber: 3,
        title: 'Capturer les ARP Gratuitous avec Wireshark',
        description: "Un conflit IP génère des ARP Gratuitous (GARP) visibles dans Wireshark.",
        commands: ['arp'],
        checkpoints: [
          'Trames ARP "is at" avec des MACs différentes pour la même IP',
          'GARP visibles : l\'équipement annonce sa MAC pour une IP déjà utilisée',
        ],
      },
      {
        stepNumber: 4,
        title: 'Identifier les deux équipements en conflit',
        description: "À partir des MACs identifiées, trouver les deux équipements conflictuels.",
        commands: [
          'nmap -sn 192.168.1.0/24',
          'show mac address-table | include AABB.CCDD.EEFF',
        ],
        checkpoints: [
          'Les deux équipements identifiés (constructeur via OUI)',
          'Port switch de chaque équipement identifié',
        ],
      },
      {
        stepNumber: 5,
        title: 'Résoudre le conflit',
        description: "Modifier l'IP d'un des deux équipements pour éliminer le conflit.",
        checkpoints: [
          'Modifier l\'IP statique de l\'équipement non DHCP',
          'Si DHCP : vérifier les réservations et exclusions du serveur DHCP',
          'Vérifier qu\'aucune IP statique n\'est dans la plage dynamique DHCP',
        ],
        tip: "Règle d'or : toujours exclure du pool DHCP les plages réservées aux IP statiques (caméras, switches, imprimantes).",
      },
    ],
    probableCauses: [
      'IP statique attribuée manuellement dans la plage DHCP',
      'Même réservation DHCP faite deux fois avec des MACs différentes',
      'Caméra remplacée avec une nouvelle MAC mais même IP statique conservée sur un autre équipement',
      'Erreur humaine lors de la saisie d\'IP statique',
    ],
    bestPractices: [
      'Séparer les plages DHCP dynamiques et les plages statiques',
      'Documenter toutes les IP statiques dans un tableau de bord IP',
      'Utiliser un outil de gestion IPAM même simple pour les petits réseaux',
    ],
    relatedCommands: ['cmd-arp-a', 'cmd-arp-delete', 'cmd-wireshark-arp', 'cmd-nmap-ping-scan'],
  },

  {
    id: 'diag-dns-not-resolved',
    title: 'Nom d\'hôte DNS non résolu',
    description:
      "Un nom d'hôte (NVR, serveur VMS, caméra) n'est pas résolu en adresse IP. La connexion par IP fonctionne mais par nom d'hôte échoue.",
    problemSummary: 'Résolution DNS en échec — accès par IP OK mais par nom KO',
    category: 'dns',
    level: 'intermediate',
    tags: ['dns', 'résolution', 'nom', 'nslookup', 'serveur'],
    estimatedTime: '10-20 min',
    steps: [
      {
        stepNumber: 1,
        title: 'Confirmer que l\'accès par IP fonctionne',
        description: "Vérifier que le problème est bien DNS et non réseau.",
        commands: ['ping 192.168.1.10', 'ping nom-du-serveur'],
        checkpoints: [
          'Ping par IP : OK',
          'Ping par nom : ECHEC (résolution impossible ou mauvaise IP)',
        ],
      },
      {
        stepNumber: 2,
        title: 'Interroger le DNS manuellement',
        description: "Utiliser nslookup pour diagnostiquer la résolution.",
        commands: [
          'nslookup nom-du-serveur',
          'nslookup nom-du-serveur 192.168.1.1',
        ],
        checkpoints: [
          'nslookup retourne l\'IP attendue',
          'Identifier quel serveur DNS répond',
          'Vérifier si la réponse est autoritaire ou non',
        ],
        tip: "Si nslookup par IP fonctionne mais pas par nom → problème DNS. Si nslookup échoue aussi → problème de serveur DNS.",
      },
      {
        stepNumber: 3,
        title: 'Vider le cache DNS et retester',
        description: "Une entrée DNS obsolète peut causer des échecs de résolution.",
        commands: ['ipconfig /flushdns', 'ipconfig /displaydns'],
        checkpoints: [
          'Cache DNS vidé',
          'Nouvelle résolution tentée après flush',
        ],
      },
      {
        stepNumber: 4,
        title: 'Vérifier la configuration DNS du poste',
        description: "S'assurer que le bon serveur DNS est configuré.",
        commands: ['ipconfig /all'],
        checkpoints: [
          'Serveur DNS primaire : IP du DNS interne',
          'Pas de serveur DNS 0.0.0.0 ou vide',
          'Serveur DNS joignable (ping vers l\'IP du DNS)',
        ],
      },
      {
        stepNumber: 5,
        title: 'Vérifier l\'enregistrement DNS',
        description: "Vérifier que l'enregistrement DNS existe bien sur le serveur.",
        checkpoints: [
          'Enregistrement A créé dans la zone DNS interne',
          'Nom d\'hôte correctement saisi (pas de faute de frappe)',
          'TTL de l\'enregistrement expiré ou pas encore propagé',
        ],
        tip: "Sur Windows Server DNS : Gestionnaire DNS → zone → vérifier l'enregistrement A du nom recherché.",
      },
    ],
    probableCauses: [
      'Enregistrement DNS manquant dans le serveur DNS interne',
      'Cache DNS local obsolète',
      'Mauvais serveur DNS configuré sur le poste',
      'Serveur DNS interne inaccessible ou en panne',
      'Faute de frappe dans le nom d\'hôte',
      'Délai de propagation DNS après création d\'un enregistrement',
    ],
    bestPractices: [
      'Toujours créer un enregistrement DNS pour les serveurs et NVR',
      'Documenter les noms DNS des équipements critiques',
      'Préférer les connexions par IP dans les configurations VMS pour éviter les dépendances DNS',
    ],
    relatedCommands: ['cmd-nslookup-basic', 'cmd-dns-displaydns', 'cmd-ipconfig-flushdns', 'cmd-ps-resolve-dns'],
  },

  {
    id: 'diag-port-blocked',
    title: 'Port réseau bloqué (firewall ou ACL)',
    description:
      "Un port nécessaire (RTSP 554, ONVIF 3702, HTTP 80…) est bloqué par un pare-feu ou une ACL réseau, empêchant la communication entre le VMS et la caméra.",
    problemSummary: 'Port TCP/UDP bloqué entre deux équipements',
    category: 'network-config',
    level: 'intermediate',
    tags: ['port', 'firewall', 'acl', 'bloqué', 'rtsp', '554'],
    estimatedTime: '15-30 min',
    steps: [
      {
        stepNumber: 1,
        title: 'Identifier le port problématique',
        description: "Déterminer quel port est bloqué en testant la connectivité TCP.",
        commands: [
          'Test-NetConnection 192.168.1.10 -Port 554',
          'Test-NetConnection 192.168.1.10 -Port 80',
          'Test-NetConnection 192.168.1.10 -Port 8080',
        ],
        checkpoints: [
          'TcpTestSucceeded = False sur le port suspect',
          'PingSucceeded = True (équipement joignable)',
        ],
      },
      {
        stepNumber: 2,
        title: 'Scanner les ports avec Nmap',
        description: "Nmap différencie les ports closed (pas de service) des ports filtered (pare-feu).",
        commands: ['nmap -p 554,80,8080,443,3702 192.168.1.10'],
        checkpoints: [
          'Port filtered → pare-feu bloque sans répondre',
          'Port closed → service absent sur cet équipement',
          'Port open → service actif et accessible',
        ],
        tip: "filtered = pare-feu actif. closed = port pas de service. C'est une différence fondamentale pour le diagnostic.",
      },
      {
        stepNumber: 3,
        title: 'Vérifier le pare-feu Windows côté source (poste VMS)',
        description: "Le pare-feu du poste VMS peut bloquer les connexions sortantes.",
        commands: [
          'Get-NetFirewallRule -Enabled True | Where-Object { $_.Direction -eq "Outbound" }',
        ],
        checkpoints: [
          'Pas de règle de sortie bloquant le port',
          'Tester avec le pare-feu Windows désactivé temporairement',
        ],
        warning: "Ne désactiver le pare-feu qu'en environnement de test contrôlé.",
      },
      {
        stepNumber: 4,
        title: 'Vérifier les ACL inter-VLAN',
        description: "Dans un réseau segmenté, des ACL sur le routeur/switch L3 peuvent filtrer le trafic entre VLAN.",
        commands: ['show ip access-lists'],
        checkpoints: [
          'ACL autorisant le trafic du VLAN VMS vers le VLAN caméra sur les ports nécessaires',
          'Pas de règle DENY implicite bloquante',
        ],
        tip: "Ports à autoriser : TCP 554 (RTSP), UDP/TCP 3702 (ONVIF), TCP 80/443/8080 (HTTP), UDP 6000-7000 (RTP).",
      },
      {
        stepNumber: 5,
        title: 'Ouvrir le port si nécessaire',
        description: "Si le blocage est sur le pare-feu Windows, créer la règle d'autorisation.",
        commands: [
          'netsh advfirewall firewall add rule name="RTSP 554" protocol=TCP dir=in localport=554 action=allow',
        ],
        checkpoints: ['Port accessible après ajout de la règle'],
      },
    ],
    probableCauses: [
      'Pare-feu Windows actif avec règle par défaut bloquante',
      'ACL inter-VLAN non configurée pour les ports vidéo',
      'Pare-feu réseau (UTM, NGFW) entre le VMS et les caméras',
      'Port de la caméra non ouvert dans sa propre configuration',
    ],
    bestPractices: [
      'Documenter tous les ports nécessaires avant déploiement VMS',
      'Créer des règles de pare-feu nommées explicitement pour faciliter l\'audit',
      'Tester la connectivité de chaque port avant l\'intégration VMS',
    ],
    caution: "Toujours valider les ouvertures de ports avec le responsable sécurité en environnement professionnel.",
    relatedCommands: ['cmd-ps-test-connection', 'cmd-nmap-top-ports', 'cmd-netsh-firewall-port', 'cmd-ps-get-firewall-rules'],
  },

  {
    id: 'diag-vlan-misconfigured',
    title: 'VLAN mal configuré sur un port switch',
    description:
      "Une caméra connectée sur un switch ne communique pas avec le reste du réseau caméra, bien que le câble soit correct et l'alimentation PoE active.",
    problemSummary: 'Équipement isolé — VLAN incorrect sur le port switch',
    category: 'poe-switch',
    level: 'intermediate',
    tags: ['vlan', 'switch', 'port', 'configuration', 'segmentation'],
    estimatedTime: '10-20 min',
    steps: [
      {
        stepNumber: 1,
        title: 'Vérifier le lien physique',
        description: "Confirmer que le câble est OK et que le port switch est actif.",
        commands: ['show interfaces status'],
        checkpoints: [
          'Port switch état : connected (pas notconnect)',
          'LED switch active',
        ],
      },
      {
        stepNumber: 2,
        title: 'Vérifier le VLAN du port',
        description: "Afficher la configuration VLAN du port suspect.",
        commands: [
          'show interfaces GigabitEthernet0/1 switchport',
          'show vlan brief',
        ],
        checkpoints: [
          'Mode du port : access (pas trunk pour un port caméra)',
          'VLAN d\'accès : correspond au VLAN caméra attendu',
          'VLAN bien présent dans la liste des VLANs actifs',
        ],
        tip: "Un port en trunk sur une caméra causerait exactement ce symptôme : connecté mais pas de réseau.",
      },
      {
        stepNumber: 3,
        title: 'Corriger le VLAN du port',
        description: "Reconfigurer le port switch avec le bon VLAN caméra.",
        commands: [
          'interface GigabitEthernet0/1',
          ' switchport mode access',
          ' switchport access vlan 20',
        ],
        checkpoints: [
          'Port reconfigué en mode access sur le bon VLAN',
          'La caméra obtient une IP DHCP après la reconfiguration',
        ],
      },
      {
        stepNumber: 4,
        title: 'Vérifier la propagation du VLAN sur les trunks',
        description: "Si le VLAN existe sur ce switch mais n'est pas propagé vers le switch upstream, les caméras seront isolées.",
        commands: [
          'show interfaces trunk',
          'show vlan brief',
        ],
        checkpoints: [
          'VLAN caméra présent dans les VLANs autorisés sur le trunk',
          'VLAN actif (pas dans la liste Inactive)',
        ],
        tip: "Vérifier sur chaque switch du chemin entre la caméra et le VMS que le VLAN est bien présent et actif.",
      },
    ],
    probableCauses: [
      'Port configuré dans le VLAN 1 (par défaut) au lieu du VLAN caméra',
      'VLAN non créé sur ce switch',
      'VLAN non propagé via les trunks inter-switches',
      'Port en mode trunk au lieu de mode access',
      'VLAN ID incorrect saisi lors de la configuration',
    ],
    bestPractices: [
      'Toujours vérifier show vlan brief après la configuration d\'un port',
      'Utiliser une convention de nommage pour les VLANs (ex: VLAN 20 = cameras)',
      'Documenter la configuration switch avant de commencer une intervention',
    ],
    relatedCommands: ['cmd-switch-show-vlan', 'cmd-switch-show-interfaces', 'cmd-nmap-ping-scan'],
  },

  {
    id: 'diag-poe-issue',
    title: 'Problème d\'alimentation PoE sur un port switch',
    description:
      "Une caméra ou un équipement PoE ne s'alimente pas correctement depuis un port switch, bien que le câble soit fonctionnel.",
    problemSummary: 'Alimentation PoE défaillante ou insuffisante',
    category: 'poe-switch',
    level: 'intermediate',
    tags: ['poe', 'switch', 'alimentation', 'puissance', 'budget', 'caméra'],
    estimatedTime: '15-25 min',
    steps: [
      {
        stepNumber: 1,
        title: 'Vérifier l\'état PoE du port',
        description: "Contrôler l'état et la puissance PoE fournie sur le port suspect.",
        commands: ['show power inline GigabitEthernet0/1'],
        checkpoints: [
          'État : On (alimentation active)',
          'Puissance fournie visible en watts',
          'Pas d\'état Fault, Err-disable, ou Deny',
        ],
      },
      {
        stepNumber: 2,
        title: 'Vérifier le budget PoE global du switch',
        description: "Un switch PoE a un budget total limité. Si dépassé, les nouveaux équipements ne sont pas alimentés.",
        commands: ['show power inline'],
        checkpoints: [
          'Puissance totale consommée < Puissance totale disponible',
          'Budget restant suffisant pour l\'équipement à connecter',
        ],
        tip: "Budget dépassé = symptôme exact : les premières caméras connectées fonctionnent, les dernières n'ont pas d'alimentation.",
      },
      {
        stepNumber: 3,
        title: 'Vérifier la compatibilité PoE',
        description: "La caméra peut nécessiter une norme PoE que le switch ne supporte pas.",
        checkpoints: [
          'Norme PoE de la caméra : 802.3af (15W), 802.3at/PoE+ (30W), 802.3bt/PoE++ (60/90W)',
          'Norme PoE du switch : compatible avec la norme de la caméra',
          'Classe PoE négociée correcte',
        ],
        tip: "Un switch 802.3af ne peut pas alimenter un équipement qui requiert 802.3at. Vérifier les fiches techniques.",
      },
      {
        stepNumber: 4,
        title: 'Tester la caméra sur un autre port PoE',
        description: "Isoler si le problème vient du port ou de la caméra.",
        checkpoints: [
          'La caméra s\'alimente sur un autre port : problème isolé sur le premier port',
          'La caméra ne s\'alimente sur aucun port : problème sur la caméra ou son câble',
        ],
      },
      {
        stepNumber: 5,
        title: 'Vérifier le câble (paires PoE)',
        description: "Le PoE nécessite 4 paires sur Cat5e/Cat6. Un câble avec paires manquantes peut ne pas conduire le PoE.",
        checkpoints: [
          'Câble testé avec un testeur de câble vérifiant les 4 paires',
          'Pas de câble rallonge non blindé ou câble croisé',
          'Longueur totale < 100m (limite Ethernet + PoE)',
        ],
        tip: "Un câble qui monte bien le lien Ethernet (1Gbps) peut ne pas conduire le PoE si une paire est défectueuse.",
      },
    ],
    probableCauses: [
      'Budget PoE du switch dépassé',
      'Norme PoE incompatible (af vs at vs bt)',
      'Câble défectueux avec paires PoE endommagées',
      'Port switch en erreur PoE (Fault / Err-disable)',
      'Équipement avec consommation PoE anormalement élevée',
      'Longueur de câble dépassant 100m',
    ],
    bestPractices: [
      'Calculer le budget PoE total avant installation (somme des consommations + 20% de marge)',
      'Toujours vérifier les normes PoE dans les fiches techniques',
      'Tester les câbles sur les longues distances avec un testeur certifié',
    ],
    relatedCommands: ['cmd-switch-show-poe', 'cmd-switch-show-interfaces'],
  },

  {
    id: 'diag-cam-reboot-loop',
    title: 'Caméra qui reboot en boucle',
    description:
      "Une caméra IP redémarre cycliquement (reboot loop). Elle apparaît brièvement sur le réseau puis disparaît, environ toutes les 30-120 secondes.",
    problemSummary: 'Caméra en boucle de redémarrage — présence réseau intermittente',
    category: 'video-surveillance',
    level: 'advanced',
    tags: ['caméra', 'reboot', 'boucle', 'poe', 'firmware', 'instabilité'],
    estimatedTime: '20-45 min',
    steps: [
      {
        stepNumber: 1,
        title: 'Confirmer le pattern de reboot',
        description: "Observer la caméra avec un ping continu pour mesurer la durée du cycle de reboot.",
        commands: ['ping 192.168.1.10 -t'],
        checkpoints: [
          'Ping perd plusieurs paquets puis reprend cycliquement',
          'Durée du cycle mesurée (ex: perd 30s toutes les 2 min)',
        ],
        tip: "Observer aussi les LEDs de la caméra : s'éteignent puis reprennent = reboot matériel.",
      },
      {
        stepNumber: 2,
        title: 'Vérifier l\'alimentation PoE',
        description: "Une alimentation PoE instable ou insuffisante est la cause la plus fréquente.",
        commands: ['show power inline GigabitEthernet0/1'],
        checkpoints: [
          'Puissance PoE stable (pas de fluctuation)',
          'Classe PoE compatible',
          'Budget PoE non dépassé',
        ],
        tip: "Tester avec un injecteur PoE autonome (non dépendant du switch) pour isoler le problème PoE.",
      },
      {
        stepNumber: 3,
        title: 'Tester avec un autre câble',
        description: "Un câble marginal peut provoquer des reboots sur les caméras alimentées en PoE.",
        checkpoints: [
          'Remplacement du câble par un câble connu bon',
          'Test avec un câble court (2-3m) directement sur le switch',
        ],
      },
      {
        stepNumber: 4,
        title: 'Accéder aux logs de la caméra',
        description: "Si la caméra est accessible pendant une fenêtre de stabilité, consulter les journaux système.",
        checkpoints: [
          'Log système de la caméra : rechercher kernel panic, hardware error, overheat',
          'Log accessible via interface web → System → Logs',
        ],
      },
      {
        stepNumber: 5,
        title: 'Tenter une mise à jour ou reset firmware',
        description: "Un bug firmware peut provoquer des reboots cycliques. Reset usine si tout le reste échoue.",
        checkpoints: [
          'Firmware à jour (consulter le site constructeur)',
          'Reset usine tenté (bouton physique 10s)',
          'Reconfiguration post-reset',
        ],
        warning: "Le reset usine supprime toute la configuration. Documenter les paramètres avant.",
      },
    ],
    probableCauses: [
      'Alimentation PoE instable ou insuffisante',
      'Câble PoE marginal (longueur, qualité, connecteurs)',
      'Bug firmware de la caméra',
      'Surcharge thermique (caméra trop chaude)',
      'Problème matériel de la caméra (condensateur défaillant)',
      'Conflit IP provoquant un reset DHCP en boucle',
    ],
    bestPractices: [
      'Tester systématiquement avec un injecteur PoE direct avant de conclure sur le firmware',
      'Vérifier la température ambiante si la caméra est en extérieur en été',
      'Tenir un journal des échanges avec le SAV constructeur',
    ],
    variants: [
      'Caméra qui reboot uniquement la nuit → IR cut filter bloqué qui surcharge le processeur',
      'Reboot uniquement lors d\'un mouvement → problème de mémoire sur le traitement vidéo analyse',
    ],
    relatedCommands: ['cmd-ping-basic', 'cmd-switch-show-poe', 'cmd-wireshark-dhcp'],
  },

  {
    id: 'diag-nvr-cam-not-found',
    title: 'NVR ne détecte pas la caméra',
    description:
      "Un NVR (enregistreur réseau) ne détecte pas automatiquement une caméra IP, bien que celle-ci soit pingable et accessible via interface web.",
    problemSummary: 'Caméra non trouvée par le NVR lors de la découverte automatique',
    category: 'video-surveillance',
    level: 'intermediate',
    tags: ['nvr', 'caméra', 'découverte', 'onvif', 'ajout', 'intégration'],
    estimatedTime: '15-25 min',
    steps: [
      {
        stepNumber: 1,
        title: 'Vérifier la connectivité NVR ↔ Caméra',
        description: "S'assurer que le NVR et la caméra sont sur le même réseau (ou routage fonctionnel entre eux).",
        commands: ['ping 192.168.1.10'],
        checkpoints: [
          'Ping depuis le NVR vers la caméra : OK',
          'Même VLAN ou routage inter-VLAN configuré',
          'Pas de pare-feu bloquant entre NVR et caméra',
        ],
        tip: "Pinger depuis le NVR lui-même (menu Network Test sur les NVR Dahua/Hikvision).",
      },
      {
        stepNumber: 2,
        title: 'Vérifier les protocoles supportés',
        description: "Le NVR et la caméra doivent parler le même protocole (ONVIF ou protocole propriétaire).",
        checkpoints: [
          'ONVIF activé sur la caméra',
          'Protocole de découverte compatible : ONVIF, ISAPI (Hikvision), DHIP (Dahua)',
          'NVR configuré pour chercher avec le bon protocole',
        ],
        tip: "Un NVR Hikvision peut ne pas découvrir une caméra Dahua via ISAPI mais la trouver en ONVIF.",
      },
      {
        stepNumber: 3,
        title: 'Ajouter la caméra manuellement par IP',
        description: "Si la découverte automatique échoue, ajouter la caméra manuellement.",
        checkpoints: [
          'Saisir l\'IP de la caméra directement dans le NVR',
          'Choisir le protocole : ONVIF ou protocole propriétaire',
          'Saisir les credentials (login/mot de passe) de la caméra',
        ],
      },
      {
        stepNumber: 4,
        title: 'Vérifier le compte de la caméra',
        description: "Le NVR utilise les credentials configurés pour s'authentifier sur la caméra.",
        checkpoints: [
          'Compte avec droits suffisants (admin ou utilisateur avec droit streaming)',
          'Mot de passe sans caractères spéciaux incompatibles',
          'Compte non verrouillé (trop de tentatives échouées)',
        ],
      },
      {
        stepNumber: 5,
        title: 'Vérifier la capacité maximale du NVR',
        description: "Un NVR a un nombre maximum de caméras (licences ou capacité matérielle).",
        checkpoints: [
          'Nombre de caméras actuelles < capacité maximale du NVR',
          'Licences disponibles si NVR avec système de licences',
          'Résolution/débit de la nouvelle caméra compatible avec la capacité résiduelle',
        ],
      },
    ],
    probableCauses: [
      'Protocole ONVIF désactivé sur la caméra',
      'Protocoles incompatibles entre NVR et caméra',
      'Credentials incorrects',
      'Réseau séparé ou routage absent entre NVR et caméra',
      'Capacité maximale du NVR atteinte',
      'Multicast WS-Discovery bloqué sur le réseau',
    ],
    bestPractices: [
      'Toujours activer ONVIF sur les caméras pour assurer la compatibilité multi-VMS',
      'Tester avec ONVIF Device Manager indépendamment du NVR pour isoler le problème',
      'Documenter les capacités maximales du NVR avant de planifier l\'extension',
    ],
    relatedCommands: ['cmd-onvif-device-manager', 'cmd-ps-test-connection', 'cmd-nmap-onvif'],
  },

  {
    id: 'diag-intermittent-video',
    title: 'Perte de flux vidéo intermittente',
    description:
      "Le flux vidéo d'une ou plusieurs caméras se coupe et revient de façon aléatoire, sans redémarrage de la caméra.",
    problemSummary: 'Flux vidéo instable — coupures aléatoires et reprises',
    category: 'video-surveillance',
    level: 'advanced',
    tags: ['vidéo', 'flux', 'intermittent', 'bande-passante', 'réseau', 'qualité'],
    estimatedTime: '20-40 min',
    steps: [
      {
        stepNumber: 1,
        title: 'Caractériser le problème',
        description: "Déterminer si la coupure est totale (ping perdu) ou seulement vidéo (ping OK mais flux coupé).",
        commands: ['ping 192.168.1.10 -t'],
        checkpoints: [
          'Pendant une coupure vidéo : ping OK → problème réseau de bande passante ou codec',
          'Pendant une coupure vidéo : ping KO → problème réseau de connectivité',
        ],
      },
      {
        stepNumber: 2,
        title: 'Mesurer la bande passante disponible',
        description: "Vérifier si la bande passante est suffisante pour tous les flux vidéo.",
        checkpoints: [
          'Débit vidéo de la caméra (ex: 4Mbps H.264 FullHD)',
          'Capacité du lien réseau (100Mbps ou 1Gbps)',
          'Charge totale de tous les flux sur ce segment réseau',
        ],
        tip: "Règle pratique : un switch 100Mbps peut supporter ~20 caméras à 4Mbps. Un switch 1Gbps peut en supporter ~200.",
      },
      {
        stepNumber: 3,
        title: 'Analyser les erreurs sur les interfaces switch',
        description: "Des erreurs CRC ou des collisions sur une interface switch indiquent un problème physique.",
        commands: ['show interfaces GigabitEthernet0/1'],
        checkpoints: [
          'Input errors : 0 ou très faible',
          'CRC errors : 0 (si > 0 → problème de câble ou connecteur)',
          'Output drops : 0 (si > 0 → congestion réseau)',
        ],
        tip: "Des CRC errors indiquent un câble défectueux, un connecteur oxydé ou une EMI (interférence électromagnétique).",
      },
      {
        stepNumber: 4,
        title: 'Capturer le trafic avec Wireshark',
        description: "Observer les retransmissions TCP et les erreurs RTP/UDP pendant une coupure.",
        commands: ['ip.addr == 192.168.1.10 && (tcp.analysis.retransmission || rtp)'],
        checkpoints: [
          'Nombreuses retransmissions TCP : lien dégradé',
          'Perte de paquets RTP : bande passante insuffisante',
          'Délai > 100ms sur les paquets vidéo : latence excessive',
        ],
      },
      {
        stepNumber: 5,
        title: 'Réduire le débit de la caméra si nécessaire',
        description: "Si la bande passante est le problème, réduire la qualité du flux secondaire ou principal.",
        checkpoints: [
          'Résolution réduite (4K → 1080p)',
          'FPS réduit (25fps → 15fps)',
          'Bitrate maximal configuré (VBR avec plafond)',
        ],
      },
    ],
    probableCauses: [
      'Bande passante insuffisante sur le segment réseau',
      'Câble ou connecteur défectueux (CRC errors)',
      'Congestion du switch (queue drops)',
      'Codec non supporté par le VMS (basculement en recalcul)',
      'Bitrate variable (VBR) avec pics dépassant la capacité',
      'EMI / interférence sur câble non blindé',
    ],
    bestPractices: [
      'Prévoir 20% de marge sur la bande passante totale du réseau vidéo',
      'Utiliser des câbles FTP/STP blindés en environnement industriel',
      'Configurer un QoS pour prioriser le trafic vidéo',
    ],
    relatedCommands: ['cmd-ping-basic', 'cmd-wireshark-udp-rtp', 'cmd-switch-show-interfaces', 'cmd-pathping'],
  },

  {
    id: 'diag-onvif-in-vms',
    title: 'Caméra ONVIF détectée mais non intégrable dans le VMS',
    description:
      "ONVIF Device Manager détecte bien la caméra, mais le VMS (Genetec, Milestone, Nx Witness…) ne parvient pas à l'intégrer ou à afficher son flux.",
    problemSummary: 'ONVIF OK hors VMS, mais intégration VMS échoue',
    category: 'onvif',
    level: 'advanced',
    tags: ['onvif', 'vms', 'intégration', 'profil', 'codec', 'compatibilité'],
    estimatedTime: '20-40 min',
    steps: [
      {
        stepNumber: 1,
        title: 'Confirmer la détection ONVIF hors VMS',
        description: "Valider que la caméra est bien accessible via ONVIF indépendamment du VMS.",
        checkpoints: [
          'ONVIF Device Manager détecte la caméra',
          'Flux vidéo visible dans ONVIF Device Manager',
          'Profils Media listés',
        ],
      },
      {
        stepNumber: 2,
        title: 'Vérifier la version ONVIF supportée',
        description: "Le VMS peut requérir une version minimale ONVIF (ex: Profile S, Profile T).",
        checkpoints: [
          'Version ONVIF de la caméra (dans Device Information)',
          'Version minimale requise par le VMS (documentation constructeur)',
          'Profile S (streaming basique), Profile T (H.265, métadonnées), Profile G (enregistrement)',
        ],
        tip: "La majorité des VMS supporte ONVIF Profile S. Profile T est requis pour H.265 et les métadonnées analytics.",
      },
      {
        stepNumber: 3,
        title: 'Tester avec les credentials corrects dans le VMS',
        description: "Le VMS utilise son propre compte pour s'authentifier sur la caméra via ONVIF.",
        checkpoints: [
          'Compte ONVIF créé sur la caméra avec les bons droits',
          'Credentials saisis correctement dans le VMS',
          'Compte non verrouillé',
        ],
        warning: "Sur certaines caméras, le compte ONVIF est distinct du compte admin. Vérifier dans Configuration → Sécurité → Utilisateurs.",
      },
      {
        stepNumber: 4,
        title: 'Vérifier la compatibilité du codec',
        description: "Le VMS peut ne pas supporter tous les codecs proposés par la caméra.",
        checkpoints: [
          'Codec caméra : H.264 (le plus compatible), H.265, MJPEG',
          'Codec supporté par le VMS selon sa liste de compatibilité',
          'Essayer de forcer H.264 sur la caméra si elle est en H.265',
        ],
      },
      {
        stepNumber: 5,
        title: 'Contacter le support VMS avec les infos ONVIF',
        description: "Si tout le reste échoue, certains VMS nécessitent un profil de pilote spécifique.",
        checkpoints: [
          'Marque et modèle exact de la caméra',
          'Version firmware de la caméra',
          'Version ONVIF supportée',
          'Profils ONVIF disponibles',
        ],
      },
    ],
    probableCauses: [
      'Version ONVIF insuffisante (caméra trop ancienne)',
      'Profil ONVIF manquant (Profile T requis pour H.265)',
      'Credentials incorrects dans le VMS',
      'Codec non supporté par le VMS',
      'Bug d\'implémentation ONVIF sur un firmware spécifique',
      'Pilote de caméra manquant dans le VMS',
    ],
    bestPractices: [
      'Toujours vérifier la liste de compatibilité du VMS avant l\'achat des caméras',
      'Maintenir les firmwares caméras à jour pour maximiser la compatibilité ONVIF',
      'Utiliser ONVIF Device Manager comme outil de validation indépendant',
    ],
    relatedCommands: ['cmd-onvif-device-manager', 'cmd-onvif-profiles', 'cmd-rtsp-vlc'],
  },
];

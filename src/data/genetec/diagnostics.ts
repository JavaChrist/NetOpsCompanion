import type { GenetecDiagnosticFlow } from './types';

export const diagnostics: GenetecDiagnosticFlow[] = [
  {
    id: 'camera-offline',
    symptom: 'Caméra hors ligne',
    description: 'Une ou plusieurs caméras apparaissent hors ligne dans Security Desk ou Config Tool. Le flux vidéo est indisponible.',
    domain: 'video',
    equipment: ['camera', 'archiver', 'network'],
    severity: 'warning',
    immediateActions: [
      'Identifier la caméra concernée et noter son adresse IP',
      'Vérifier si d\'autres caméras sur le même switch sont également hors ligne',
      'Contrôler si le problème est apparu suite à une intervention réseau ou une coupure de courant',
    ],
    causes: [
      {
        id: 'cause-1',
        description: 'Perte d\'alimentation PoE ou coupure de courant',
        probability: 'high',
        checkSteps: [
          'Vérifier les voyants du port PoE sur le switch',
          'Contrôler le budget PoE disponible sur le switch (total ports actifs)',
          'Vérifier les voyants de la caméra (power LED)',
          'Tester avec un autre port PoE du switch',
        ],
        correctiveActions: [
          'Réactiver le port PoE (shutdown / no shutdown sur switch Cisco)',
          'Augmenter le budget PoE ou déplacer la caméra vers un port avec plus de puissance',
          'Remplacer l\'injecteur PoE si le switch n\'est pas gérable',
          'Vérifier le câble réseau (longueur max 100m, idéalement Cat5e/Cat6)',
        ],
        logsToCheck: [
          'Switch : contrôler les logs PoE (show power inline sur Cisco)',
          'Config Tool > Event Viewer : chercher les événements "Offline" avec horodatage',
        ],
      },
      {
        id: 'cause-2',
        description: 'Problème réseau : adresse IP inaccessible, VLAN incorrect, pare-feu',
        probability: 'high',
        checkSteps: [
          'Pinger l\'adresse IP de la caméra depuis le serveur d\'archivage',
          'Vérifier que la caméra est dans le bon VLAN',
          'Tester les ports 80, 443 et 554 (RTSP) avec telnet ou nmap',
          'Vérifier les ACL sur les équipements réseau inter-VLAN',
        ],
        correctiveActions: [
          'Corriger la configuration VLAN du port switch',
          'Ouvrir les règles de pare-feu pour les ports vidéo (RTSP 554, HTTP 80, HTTPS 443)',
          'Vérifier et corriger l\'adresse IP de la caméra si elle a changé (DHCP)',
          'Attribuer une adresse IP statique pour éviter les changements futurs',
        ],
        logsToCheck: [
          'Serveur d\'archivage : ping 192.168.x.x -t (test continu)',
          'Config Tool > Event Viewer : "Communication Error" ou "Connection Refused"',
        ],
      },
      {
        id: 'cause-3',
        description: 'Redémarrage ou crash de l\'archiveur Genetec',
        probability: 'medium',
        checkSteps: [
          'Vérifier l\'état du service "Archiver" dans Config Tool',
          'Contrôler si plusieurs caméras du même archiveur sont hors ligne simultanément',
          'Vérifier l\'espace disque de l\'archiveur (disque plein = arrêt du service)',
          'Consulter les logs Windows de l\'archiveur',
        ],
        correctiveActions: [
          'Redémarrer le service Archiver depuis Config Tool ou Services Windows',
          'Libérer de l\'espace disque si le volume d\'enregistrement est plein',
          'Vérifier et corriger les paramètres de purge automatique',
        ],
        logsToCheck: [
          'Windows Event Log > Applications : chercher les erreurs du service Archiver',
          'Config Tool > Event Viewer : état de l\'archiveur et des caméras associées',
        ],
      },
      {
        id: 'cause-4',
        description: 'Panne matérielle de la caméra',
        probability: 'medium',
        checkSteps: [
          'Vérifier si la caméra répond au ping',
          'Accéder à l\'interface web de la caméra directement',
          'Contrôler les voyants de la caméra (power, network)',
          'Tester avec une autre caméra identique sur le même port',
        ],
        correctiveActions: [
          'Redémarrer la caméra depuis son interface web ou en coupant l\'alimentation',
          'Mettre à jour le firmware de la caméra si une version corrective existe',
          'Remplacer la caméra si le problème persiste après redémarrage',
        ],
        logsToCheck: ['Interface web caméra : onglet System > Log ou Event Log'],
      },
      {
        id: 'cause-5',
        description: 'Problème d\'authentification (identifiants modifiés sur la caméra)',
        probability: 'low',
        checkSteps: [
          'Tenter de se connecter à l\'interface web de la caméra avec les identifiants Genetec',
          'Vérifier les propriétés de la caméra dans Config Tool (onglet Hardware ou Network)',
          'Contrôler si les identifiants ont été modifiés récemment',
        ],
        correctiveActions: [
          'Mettre à jour les identifiants dans Config Tool > Propriétés caméra > Network',
          'Si les identifiants sont perdus : réinitialiser la caméra en usine (bouton reset physique)',
          'Reconfigurer la caméra après réinitialisation',
        ],
        logsToCheck: ['Config Tool > Event Viewer : "Authentication Error" ou "401 Unauthorized"'],
      },
    ],
    escalationCriteria: [
      'Toutes les caméras d\'un bâtiment sont hors ligne simultanément → escalader vers réseau',
      'Panne matérielle confirmée de l\'archiveur → escalader vers équipe serveur',
      'Caméra de zone critique hors ligne depuis plus de 4h sans résolution → alerter responsable sécurité',
    ],
    relatedProcedures: ['add-camera'],
  },

  {
    id: 'video-loss',
    symptom: 'Flux vidéo noir ou perte d\'image',
    description: 'La caméra est en ligne dans Genetec mais le flux vidéo affiche une image noire, figée ou déformée.',
    domain: 'video',
    equipment: ['camera', 'archiver'],
    severity: 'warning',
    immediateActions: [
      'Vérifier si la caméra est bien Online dans Config Tool',
      'Tester un autre poste de surveillance pour exclure un problème de workstation',
      'Vérifier si le flux live est noir ou si c\'est l\'enregistrement qui est absent',
    ],
    causes: [
      {
        id: 'cause-1',
        description: 'Flux vidéo non accessible depuis l\'archiveur (port RTSP bloqué)',
        probability: 'high',
        checkSteps: [
          'Depuis le serveur archiveur, tester : telnet [IP_cam] 554',
          'Vérifier les règles de pare-feu entre le réseau caméras et le serveur',
          'Tester l\'accès au flux RTSP avec VLC : rtsp://[user]:[pass]@[IP_cam]/stream1',
        ],
        correctiveActions: [
          'Ouvrir le port 554 entre le réseau caméras et le serveur d\'archivage',
          'Vérifier les paramètres de flux dans Config Tool > Propriétés caméra > Streams',
          'Reconfigurer l\'URL RTSP dans les propriétés de la caméra si nécessaire',
        ],
        logsToCheck: ['Config Tool > Event Viewer : "RTSP" ou "Stream Error"'],
      },
      {
        id: 'cause-2',
        description: 'Problème codec non supporté ou format vidéo incompatible',
        probability: 'medium',
        checkSteps: [
          'Vérifier le codec configuré sur la caméra (H.265 non supporté par certaines versions)',
          'Contrôler la version de Security Center (H.265 supporté à partir de SC 5.7)',
          'Tester en forçant le codec H.264 dans les paramètres de la caméra',
        ],
        correctiveActions: [
          'Forcer H.264 sur la caméra si la version SC ne supporte pas H.265',
          'Mettre à jour Security Center vers une version supportant H.265',
          'Vérifier la configuration du profil ONVIF (certains profils n\'exposent pas tous les codecs)',
        ],
      },
      {
        id: 'cause-3',
        description: 'Saturation bande passante réseau',
        probability: 'medium',
        checkSteps: [
          'Vérifier la consommation bande passante sur le switch (statistiques port)',
          'Contrôler le débit configuré sur chaque caméra du segment',
          'Calculer le débit total prévu vs capacité disponible',
        ],
        correctiveActions: [
          'Réduire le bitrate ou la résolution des caméras concernées',
          'Segmenter le réseau caméras sur un VLAN dédié avec QoS',
          'Augmenter la capacité du lien réseau entre le switch caméras et le serveur',
        ],
        logsToCheck: ['Config Tool > Health Monitor : latence et perte de paquets sur l\'archiveur'],
      },
      {
        id: 'cause-4',
        description: 'Problème optique ou physique de la caméra (objectif, capteur)',
        probability: 'low',
        checkSteps: [
          'Accéder à l\'interface web de la caméra et tester le flux live depuis la caméra elle-même',
          'Vérifier si l\'image est noire dans l\'interface web aussi',
          'Contrôler l\'orientation de la caméra et l\'exposition (nuit sans IR ?)',
        ],
        correctiveActions: [
          'Vérifier que les LEDs infrarouge fonctionnent (caméra en mode nuit)',
          'Ajuster l\'exposition et la balance des blancs dans l\'interface web',
          'Remplacer la caméra si le flux est noir même depuis l\'interface web locale',
        ],
      },
    ],
    relatedProcedures: ['add-camera', 'configure-recording'],
  },

  {
    id: 'badge-denied',
    symptom: 'Badge refusé sur un lecteur',
    description: 'Un badge (carte d\'accès) est refusé sur un lecteur alors que l\'accès devrait être autorisé.',
    domain: 'access-control',
    equipment: ['reader', 'controller', 'door'],
    severity: 'warning',
    immediateActions: [
      'Identifier le titulaire du badge et la porte concernée',
      'Vérifier les logs d\'accès dans Security Desk pour le code de refus exact',
      'Tester avec un badge de référence pour distinguer un problème de badge vs de porte',
    ],
    causes: [
      {
        id: 'cause-1',
        description: 'Badge désactivé, expiré ou non affecté à la porte',
        probability: 'high',
        checkSteps: [
          'Ouvrir Security Desk > Accès > Cardholders',
          'Rechercher le titulaire et ouvrir son profil',
          'Vérifier le statut du badge (actif/inactif/expiré)',
          'Vérifier la date d\'activation et d\'expiration du badge',
          'Vérifier les règles d\'accès associées au groupe du cardholder',
        ],
        correctiveActions: [
          'Activer ou renouveler le badge depuis la fiche du cardholder',
          'Associer le cardholder group à la règle d\'accès couvrant la porte concernée',
          'Vérifier et corriger la date d\'expiration si elle est dépassée',
        ],
        logsToCheck: [
          'Security Desk > Reports > Accès : chercher le refus exact pour ce badge et cette porte',
          'Le code refus "Access denied - Inactive credential" confirme cette cause',
        ],
      },
      {
        id: 'cause-2',
        description: 'Règle d\'accès non applicable à cette plage horaire',
        probability: 'high',
        checkSteps: [
          'Vérifier l\'heure et le jour du refus',
          'Ouvrir Config Tool > Access Control > Access Rules',
          'Vérifier le planning associé à la règle d\'accès de la porte',
          'Comparer avec l\'heure du refus constaté',
        ],
        correctiveActions: [
          'Modifier le planning de la règle d\'accès pour inclure la plage horaire souhaitée',
          'Créer une exception ou une règle d\'accès complémentaire si l\'extension des horaires est justifiée',
        ],
        logsToCheck: ['Le code refus "Access denied - Outside schedule" confirme cette cause'],
      },
      {
        id: 'cause-3',
        description: 'Lecteur hors ligne ou problème de communication contrôleur',
        probability: 'medium',
        checkSteps: [
          'Vérifier l\'état du lecteur dans Config Tool (Online/Offline)',
          'Vérifier l\'état du contrôleur associé',
          'Pinger l\'adresse IP du contrôleur',
          'Tester un autre lecteur sur le même contrôleur',
        ],
        correctiveActions: [
          'Résoudre le problème de communication du contrôleur (voir diagnostic "Contrôleur hors ligne")',
          'Vérifier le câblage entre le contrôleur et le lecteur',
          'Redémarrer le contrôleur si le lecteur ne répond plus',
        ],
        logsToCheck: ['Config Tool > Event Viewer : statut du lecteur et du contrôleur'],
      },
      {
        id: 'cause-4',
        description: 'Anti-passback actif : le badge n\'a pas été badgé en entrée avant de tenter une sortie',
        probability: 'medium',
        checkSteps: [
          'Vérifier si l\'anti-passback est configuré sur la porte',
          'Contrôler le dernier mouvement enregistré pour ce badge (entrée ou sortie)',
        ],
        correctiveActions: [
          'Réinitialiser l\'anti-passback pour ce cardholder : Config Tool > cardholder > Reset antipassback',
          'Si l\'anti-passback génère trop de faux refus, évaluer la pertinence de sa configuration',
        ],
        logsToCheck: ['Le code refus "Access denied - Anti-passback" confirme cette cause'],
      },
    ],
    escalationCriteria: [
      'Plusieurs badges refusés sur plusieurs portes simultanément → problème systémique, escalader vers Genetec admin',
      'Accès refusé à du personnel critique (urgence, sécurité) → escalader immédiatement',
    ],
    relatedProcedures: ['configure-door'],
  },

  {
    id: 'controller-offline',
    symptom: 'Contrôleur d\'accès hors ligne',
    description: 'Un contrôleur d\'accès Synergis apparaît hors ligne dans Config Tool. Les portes associées passent en mode dégradé.',
    domain: 'access-control',
    equipment: ['controller', 'network'],
    severity: 'critical',
    immediateActions: [
      'Identifier le contrôleur hors ligne et toutes les portes associées',
      'Informer la sécurité des portes pouvant être en mode "fail-secure" ou "fail-open"',
      'Vérifier si d\'autres contrôleurs sont également hors ligne',
    ],
    causes: [
      {
        id: 'cause-1',
        description: 'Perte d\'alimentation du contrôleur',
        probability: 'high',
        checkSteps: [
          'Vérifier les voyants LED du contrôleur (power LED)',
          'Contrôler le disjoncteur ou l\'alimentation 12V/24V du coffret',
          'Vérifier la batterie de secours si le contrôleur en est équipé',
        ],
        correctiveActions: [
          'Rétablir l\'alimentation secteur et vérifier le disjoncteur',
          'Remplacer la batterie de secours si déchargée',
          'Vérifier le fusible de l\'alimentation si le contrôleur ne redémarre pas',
        ],
      },
      {
        id: 'cause-2',
        description: 'Problème réseau : câble, VLAN, adresse IP',
        probability: 'high',
        checkSteps: [
          'Pinger l\'adresse IP du contrôleur depuis le serveur',
          'Vérifier le câble réseau et les voyants du port switch',
          'Vérifier la configuration VLAN du port switch',
          'Vérifier si l\'adresse IP du contrôleur a changé (DHCP)',
        ],
        correctiveActions: [
          'Remplacer le câble réseau si défaillant',
          'Corriger le VLAN sur le port switch',
          'Mettre à jour l\'adresse IP dans Config Tool si elle a changé',
          'Attribuer une IP statique au contrôleur pour éviter ce problème',
        ],
        logsToCheck: ['Config Tool > Event Viewer : "Connection timed out" ou "Network unreachable"'],
      },
      {
        id: 'cause-3',
        description: 'Firmware incompatible ou crash applicatif du contrôleur',
        probability: 'medium',
        checkSteps: [
          'Si le contrôleur répond au ping mais pas à Genetec : accéder à son interface web',
          'Vérifier la version firmware dans l\'interface web du contrôleur',
          'Contrôler les logs applicatifs du contrôleur',
        ],
        correctiveActions: [
          'Redémarrer le contrôleur depuis son interface web (ou couper/rétablir l\'alimentation)',
          'Mettre à jour le firmware si une version corrective est disponible',
          'Réenrôler le contrôleur dans Config Tool si la connexion ne se rétablit pas après redémarrage',
        ],
      },
    ],
    escalationCriteria: [
      'Le contrôleur ne répond plus après redémarrage → remplacement matériel nécessaire',
      'Plusieurs contrôleurs d\'un même site hors ligne → problème réseau ou serveur à escalader',
    ],
    relatedProcedures: ['add-access-controller'],
  },
];

# NetOps Companion

Assistant de terrain pour les techniciens réseau, vidéosurveillance et sûreté. L’application rassemble, dans une interface web installable, des commandes, des diagnostics guidés et des checklists. Un module dédié aide à configurer et dépanner Genetec Security Center.

L’interface indique « Réalisé par JavaChrist ». Le paquet npm est marqué privé (`"private": true`).

## Public

- Techniciens réseau (adresses, VLAN, PoE, connectivité, DNS).
- Techniciens vidéosurveillance (caméras IP, RTSP, ONVIF, NVR, VMS).
- Techniciens sûreté et exploitants Genetec (vidéo Omnicast, contrôle d’accès Synergis).
- Techniciens IT de terrain (Windows, Linux, audits simples).

## Fonctionnalités

Les volumes ci-dessous sont ceux des fichiers de données du dépôt, au moment de cette documentation.

### Opérationnelles

Ces fonctions sont branchées dans l’interface et s’appuient sur du contenu ou des services réellement appelés par le code.

- **Compte.** Inscription et connexion par e-mail et mot de passe (6 caractères minimum), via Supabase. Sans session, l’application renvoie vers la page de connexion. La déconnexion est disponible dans le menu.
- **Essai et accès.** À la création d’un utilisateur, le script SQL prévu crée un essai de 30 jours. L’accès au contenu est ouvert si l’abonnement est `active`, ou `trial` et non échu. La page d’abonnement reste accessible même lorsque l’essai est terminé.
- **Tableau de bord.** Compteurs réels (commandes, diagnostics, checklists, catégories), accès rapides, quelques commandes mises en avant et les cinq dernières consultations.
- **225 commandes.** Fiches avec l’outil, la catégorie, le niveau, le cas d’usage, des exemples et parfois un avertissement. Copie dans le presse-papiers. Filtres par catégorie, niveau et outil. Recherche dans le titre, la commande, la description, les tags et les cas d’usage.
- **55 diagnostics guidés.** Parcours pas à pas (cause probable, points de contrôle, commandes associées) pour des pannes réseau, vidéo, PoE, VLAN, DNS, DHCP et sécurité de port.
- **40 checklists terrain.** Listes à cocher, enregistrées dans le navigateur (mise en service caméra, switch PoE, NVR, VMS, audit, recette de site, incident, Wi-Fi, etc.). La progression survit au rechargement de la page.
- **Favoris et historique.** Étoile sur les commandes, diagnostics et checklists généraux. Historique local des consultations et des recherches, limité aux 50 dernières entrées, avec possibilité de l’effacer.
- **Recherche globale.** Barre en haut de l’écran : jusqu’à 6 commandes, 4 diagnostics et 3 checklists. La touche Entrée ouvre la base de commandes avec le même texte.
- **Affichage.** Thème sombre par défaut et thème clair (styles prévus dans la feuille de style). Message d’accueil du tableau de bord activable ou non. Les réglages sont mémorisés dans le navigateur.
- **Application installable.** Manifeste web et service worker (mise à jour automatique, mise en cache des fichiers de l’application). Le nom court affiché est « NetOps ».
- **Module Genetec, contenu guidé.**
  - 4 procédures : ajouter une caméra IP, configurer l’enregistrement, ajouter un contrôleur Synergis, configurer une porte et un lecteur.
  - 4 diagnostics : caméra hors ligne, flux noir, badge refusé, contrôleur hors ligne. Chaque diagnostic propose des causes, des vérifications et des actions.
  - 8 événements de logs (unité hors ligne ou en ligne, disque critique, contrôleur hors ligne, accès refusé, porte forcée, porte maintenue ouverte, licence bientôt expirée).
  - 3 checklists interactives : recette caméra, recette porte, vérification après mise à jour.
  - 10 questions-réponses classées en vidéosurveillance, contrôle d’accès, et système.
  - Une page Maintenance avec une procédure de mise à jour Security Center et six tâches préventives (hebdomadaire à annuel).
  - Une recherche interne sur les titres de procédures et les symptômes.
- **Abonnement, tel qu’affiché.** Deux formules : 9,99 € par mois ou 79 € par an (l’écran annuel indique aussi 6,58 € par mois et une économie de 40,88 €). Le prénom saisi est envoyé avec la demande de paiement. Le paiement passe par Mollie : l’API crée un paiement, puis le webhook marque l’abonnement `active` jusqu’à la fin de la période (un mois ou un an) lorsque Mollie confirme `paid`.

### Partielles

- **Hors ligne.** Après une première visite, les pages déjà mises en cache peuvent s’ouvrir sans réseau. La connexion, la lecture de l’abonnement et le paiement exigent Internet. L’écran Paramètres indique d’ailleurs « PWA / Hors-ligne (partiel) ».
- **Thème clair.** Le basculement applique bien une variante claire au contenu. Le texte du réglage dit encore que ce thème arrivera plus tard, et la barre du haut reste sombre.
- **Mode compact.** Le réglage est enregistré. Aucun écran ne s’en sert pour resserrer l’affichage.
- **Durée de l’abonnement.** Le statut `active` ouvre l’accès sans vérifier la date de fin de période. Aucune tâche du dépôt ne repasse un abonnement expiré après cette date. Le paiement Mollie créé est un paiement unique : les colonnes prévues pour un client et un abonnement récurrents ne sont pas remplies par l’API.
- **Prénom.** L’application lit et enregistre `first_name`. Le script `supabase-schema.sql` ne crée pas cette colonne.
- **Accès le temps du chargement.** Si une personne est connectée et que sa ligne d’abonnement n’est pas encore lue, l’accès est accordé en attendant.
- **Checklists Genetec.** Les cases se cochent pendant la visite. Elles ne sont pas enregistrées : un changement de checklist ou un rechargement repart de zéro.
- **Compteurs de la page d’accueil Genetec.** Certains chiffres affichés sur les cartes (vidéo, logs, maintenance, FAQ) sont écrits en dur et ne correspondent pas toujours au nombre d’éléments réellement listés.
- **Paiement en local.** Si l’adresse de l’application contient `localhost`, le webhook Mollie n’est pas déclaré. Les erreurs de paiement s’affichent avec une boîte de dialogue du navigateur.
- **Cloche du bandeau.** Le bouton est visible et ne déclenche aucune action.
- **Vue d’ensemble Genetec.** La route existe. Le menu Genetec ne propose pas de lien vers elle.

### Simulées

- **État du système Genetec** (`/genetec/overview`). Les services, adresses, versions et la date de licence sont des exemples figés dans la page. Aucune connexion à un serveur Genetec, à une base SQL ou à un équipement réel n’est implémentée.

### Prévues dans le code, non réalisées

Le schéma d’abonnement prévoit un identifiant client Mollie et un identifiant d’abonnement récurrent. Le paiement actuel ne crée pas cet abonnement récurrent.

L’ancien descriptif du dépôt annonçait aussi une base distante pour le contenu, un partage d’équipe, une synchronisation hors ligne, un export PDF et une recherche par Fuse.js. Aucun de ces éléments n’est présent dans le code. Ils ne constituent pas un engagement affiché dans l’application.

## Contenu

Tout le savoir métier (commandes, diagnostics, checklists, procédures Genetec) est écrit dans des fichiers TypeScript de `src/data/`. Il n’est pas chargé depuis Supabase. Les textes sont pédagogiques et génériques : le dépôt ne contient pas de dossier client. La page Vue d’ensemble Genetec, elle, affiche des adresses et un état d’exemple (voir « Simulées »).

Douze catégories de commandes :

| Identifiant | Catégorie |
|---|---|
| `network-config` | Configuration réseau |
| `connectivity` | Connectivité / Routage |
| `dns` | DNS / Résolution de noms |
| `discovery` | Découverte réseau |
| `nmap` | Scan Nmap |
| `ports-processes` | Ports / Processus |
| `video-surveillance` | Vidéosurveillance |
| `onvif` | ONVIF / Découverte |
| `poe-switch` | PoE / Switch / VLAN |
| `wireshark` | Wireshark / Capture |
| `cybersecurity` | Cybersécurité / Audit |
| `terrain-tips` | Astuces terrain |

Les outils cités sur les fiches sont notamment CMD, PowerShell, Nmap, Wireshark, Bash, navigateur, SSH, Telnet et ONVIF.

## Stack

| Technologie | Rôle dans ce dépôt |
|---|---|
| React 19 | Interface |
| TypeScript 5.9 | Typage |
| Vite 7 | Développement et build |
| Tailwind CSS 3.4 | Styles |
| React Router 7 | Pages |
| Zustand 5 | Favoris, historique, checklists générales, réglages, session |
| vite-plugin-pwa | Manifeste et service worker |
| Supabase (`@supabase/supabase-js`) | Comptes et table `subscriptions` |
| Mollie (`@mollie/api-client`) | Création du paiement, côté API |
| Lucide React | Icônes |

L’interface affichée indique la version **1.0.0**. Le fichier `package.json` indique **0.0.0**.

Hébergement visé par la configuration : Vercel (réécriture de toutes les pages vers `index.html`, fonctions dans `api/`). Cette configuration ne permet pas de conclure que le site est en ligne.

## Installation

### Prérequis

- Node.js compatible avec Vite 7 : `^20.19.0` ou `>=22.12.0`
- npm
- Un projet Supabase dont le script `supabase-schema.sql` a été exécuté dans l’éditeur SQL (table `subscriptions`, sécurité par ligne, création automatique de l’essai à l’inscription)

### Configuration

Créer un fichier `.env.local` à la racine (il est ignoré par Git). Aucune valeur secrète ne figure dans ce document.

Variables lues par l’application (navigateur) :

| Variable | Usage |
|---|---|
| `VITE_SUPABASE_URL` | Adresse du projet Supabase. Obligatoire au démarrage. |
| `VITE_SUPABASE_ANON_KEY` | Clé publique Supabase. Obligatoire au démarrage. |

Variables lues par les fonctions `api/create-checkout.js` et `api/webhook.js` :

| Variable | Usage |
|---|---|
| `MOLLIE_API_KEY` | Clé d’API Mollie. |
| `VITE_SUPABASE_URL` | Même adresse de projet, côté serveur. |
| `SUPABASE_SERVICE_ROLE_KEY` | Clé de rôle service, utilisée seulement par ces fonctions. |
| `VITE_APP_URL` | Adresse publique utilisée pour le retour après paiement et pour le webhook. |

Si `VITE_APP_URL` est absente, le code de paiement retombe sur un nom d’hôte écrit dans `api/create-checkout.js`. La mise en ligne de ce nom d’hôte est **à confirmer** : sa présence dans le code ne prouve pas qu’un site répond à cette adresse.

Le script SQL du dépôt ne crée pas la colonne `first_name`, alors que l’écran d’abonnement et le tableau de bord l’utilisent. Le fichier `supabase-admin-queries.sql` contient des exemples de requêtes pour accorder ou retirer un accès depuis l’éditeur SQL Supabase. Il faut y remplacer les e-mails et identifiants d’exemple avant toute utilisation.

### Commandes

```bash
npm install
npm run dev
```

Le serveur Vite s’ouvre en principe sur `http://localhost:5173`.

```bash
npm run build      # vérification TypeScript, puis fichiers dans dist/
npm run preview    # aperçu du build
npm run lint       # ESLint
```

Aucun script de test n’est défini.

## Navigation

Toutes les routes sauf `/login` exigent une session. Hors `/pricing`, elles exigent aussi un essai en cours ou un abonnement actif.

| Route | Page |
|---|---|
| `/login` | Connexion et création de compte |
| `/` | Tableau de bord |
| `/pricing` | Essai restant et formules |
| `/commands` | Base de commandes |
| `/commands/:id` | Fiche commande |
| `/diagnostics` | Diagnostics guidés |
| `/diagnostics/:id` | Détail d’un diagnostic |
| `/checklists` | Checklists terrain |
| `/checklists/:id` | Checklist interactive |
| `/favorites` | Favoris |
| `/history` | Historique |
| `/settings` | Paramètres |
| `/genetec` | Accueil du module Genetec |
| `/genetec/overview` | État d’exemple, non relié au menu |
| `/genetec/cameras` | Vidéo / caméras |
| `/genetec/access-control` | Contrôle d’accès |
| `/genetec/logs` | Référence de logs |
| `/genetec/maintenance` | Mise à jour et maintenance |
| `/genetec/checklists` | Checklists Genetec |
| `/genetec/faq` | Questions fréquentes |
| `/genetec/procedure/:id` | Procédure guidée |
| `/genetec/diagnostic/:id` | Diagnostic Genetec |

## Données conservées dans le navigateur

| Clé | Contenu |
|---|---|
| `netops-favorites` | Identifiants favoris |
| `netops-history` | Consultations et recherches |
| `netops-checklists` | Cases des 40 checklists générales |
| `netops-settings` | Thème, mode compact, message d’accueil |

La session Supabase est gérée par la bibliothèque cliente. Les checklists Genetec ne font pas partie de ce stockage.

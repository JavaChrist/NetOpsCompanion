# NetOps Companion

> Assistant technique terrain pour techniciens réseau, vidéosurveillance, sûreté et cybersécurité opérationnelle.

---

## Présentation

**NetOps Companion** est une application web PWA (Progressive Web App) conçue pour être l'outil de référence des techniciens terrain. Elle centralise les commandes réseau, les procédures de diagnostic guidées et les checklists de déploiement dans une interface rapide, lisible et utilisable sur chantier.

### Cible utilisateurs

- Techniciens réseau (LAN/WAN/VLAN/PoE)
- Intégrateurs vidéosurveillance (RTSP, ONVIF, NVR, VMS)
- Techniciens sûreté (contrôle d'accès, IP caméra)
- Techniciens IT terrain (Windows, Linux, diagnostics)
- Techniciens cybersécurité opérationnelle (audit, hardening)

---

## Fonctionnalités

### Base de commandes (237+)
Recherche instantanée parmi plus de 237 commandes terrain catégorisées :
- Windows réseau (CMD, netsh, ipconfig, route, arp, netstat…)
- PowerShell réseau et sécurité
- Nmap (scan réseau, OS, services, scripts NSE)
- Wireshark (filtres réseau, RTSP, DHCP, 802.1X, RTP…)
- Vidéosurveillance IP (RTSP, ONVIF, flux vidéo, snapshots)
- Switch managé Cisco / HP Aruba (VLAN, PoE, STP, LLDP…)
- Cybersécurité Windows (audit, pare-feu, processus, comptes)
- Linux réseau (ip, ss, tcpdump, dig, nmcli, systemctl…)
- Diagnostics terrain (MTU, ARP, DNS, connectivité)

### Diagnostics guidés (57)
Procédures pas à pas pour les problèmes terrain les plus courants :
- Pas de connectivité, IP APIPA, conflit d'adresses, DNS, DHCP épuisé
- Caméra invisible, flux RTSP absent, ONVIF non détecté, latence vidéo
- Switch port down, PoE insuffisant, VLAN incorrect, STP loop
- Sécurité : rogue DHCP, port-security, 802.1X, broadcast storm
- WiFi faible, VPN instable, MTU fragmentation, panne totale

### Checklists terrain (40)
Listes interactives cochables, persistées en local :
- Installation et validation caméra IP (fixe, PTZ, contrôle d'accès)
- Déploiement switch PoE et audit configuration switch
- Validation NVR et intégration VMS
- Audit sécurité réseau et durcissement serveur Windows
- Préparation intervention terrain
- Capture Wireshark, audit Nmap, supervision SNMP
- Migration IP caméra, migration serveur VMS
- Documentation réseau site, revue post-incident

### Autres fonctionnalités
- **Recherche globale instantanée** : commandes, diagnostics, checklists, tags, cas d'usage
- **Filtres avancés** : catégorie, niveau, outil
- **Favoris** : commandes, diagnostics et checklists mémorisés
- **Historique** : derniers éléments consultés et recherches récentes
- **Copie en un clic** : toutes les commandes copiables presse-papiers
- **Mode hors-ligne** : service worker PWA pour utilisation sans réseau
- **Installable** : compatible installation PWA (desktop et mobile)
- **Design sombre** : interface technique, lisible en conditions de terrain

---

## Stack technique

| Technologie | Rôle |
|---|---|
| React 18 | Interface utilisateur |
| TypeScript 5 | Typage statique |
| Vite 7 | Build et dev server |
| TailwindCSS 3 | Style utilitaire |
| React Router 6 | Navigation SPA |
| Zustand 5 | Gestion d'état global |
| vite-plugin-pwa | PWA (manifest + service worker) |
| Lucide React | Icônes |
| clsx | Classes CSS conditionnelles |

**Données** : fichiers TypeScript statiques dans `src/data/` (prêts pour migration Firebase / Supabase).

---

## Structure du projet

```
netops-companion/
├── public/
│   ├── favicon.svg
│   └── icons/
├── src/
│   ├── components/
│   │   ├── layout/          # AppLayout, Sidebar, Topbar
│   │   ├── ui/              # Badge, CopyCommandButton, FavoriteButton, EmptyState
│   │   ├── CommandCard.tsx
│   │   ├── DiagnosticCard.tsx
│   │   ├── ChecklistCard.tsx
│   │   ├── CategoryCard.tsx
│   │   ├── SearchBar.tsx
│   │   └── FilterPanel.tsx
│   ├── data/
│   │   ├── categories.ts    # 12 catégories
│   │   ├── commands.ts      # 237+ commandes
│   │   ├── diagnostics.ts   # 57 diagnostics
│   │   ├── checklists.ts    # 40 checklists
│   │   └── index.ts
│   ├── hooks/
│   │   ├── useSearch.ts     # Recherche client-side avec useMemo
│   │   └── useCopyToClipboard.ts
│   ├── pages/
│   │   ├── DashboardPage.tsx
│   │   ├── CommandsPage.tsx
│   │   ├── CommandDetailPage.tsx
│   │   ├── DiagnosticsPage.tsx
│   │   ├── DiagnosticDetailPage.tsx
│   │   ├── ChecklistsPage.tsx
│   │   ├── ChecklistDetailPage.tsx
│   │   ├── FavoritesPage.tsx
│   │   ├── HistoryPage.tsx
│   │   └── SettingsPage.tsx
│   ├── store/
│   │   └── index.ts         # Zustand stores (favoris, historique, checklists, settings)
│   ├── types/
│   │   └── index.ts         # Interfaces TypeScript centralisées
│   ├── utils/
│   │   └── index.ts         # Fonctions utilitaires
│   ├── App.tsx
│   ├── main.tsx
│   └── index.css
├── index.html
├── vite.config.ts
├── tailwind.config.js
└── package.json
```

---

## Lancer le projet en développement

### Prérequis

- Node.js 18+
- npm ou yarn

### Installation

```bash
# Cloner ou ouvrir le dossier du projet
cd "NetOps Companion"

# Installer les dépendances
npm install

# Lancer le serveur de développement
npm run dev
```

L'application est accessible sur `http://localhost:5173`.

### Build de production

```bash
npm run build
```

Les fichiers de production sont générés dans le dossier `dist/`.

### Prévisualiser le build

```bash
npm run preview
```

---

## Navigation

| Route | Page |
|---|---|
| `/` | Tableau de bord |
| `/commands` | Base de commandes |
| `/commands/:id` | Détail d'une commande |
| `/diagnostics` | Diagnostics guidés |
| `/diagnostics/:id` | Détail d'un diagnostic |
| `/checklists` | Checklists terrain |
| `/checklists/:id` | Checklist interactive |
| `/favorites` | Favoris |
| `/history` | Historique |
| `/settings` | Paramètres |

---

## Données et contenu

Tout le contenu est **100% générique et non sensible** :
- Aucune IP réelle
- Aucun nom d'équipement client
- Aucun mot de passe
- Contenu pédagogique et universel, utilisable sur tout site

### Catégories de commandes

| ID | Catégorie |
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

---

## Évolutions prévues

- Connexion à une base de données distante (Firebase ou Supabase)
- Authentification utilisateur et partage d'équipe
- Mode hors-ligne complet avec synchronisation différée
- Ajout de contenu : objectif 300+ commandes, 80+ diagnostics
- Export PDF des checklists et diagnostics
- Recherche full-text avancée (Fuse.js)
- Thème clair optionnel

---

## Licence

Usage interne — projet privé. Contenu pédagogique générique libre de droits.
